'use client';

import { Bot, Send, Sparkles, UserRound } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import type { ChatLink } from "@/lib/chatbot";

type Message = {
  id: number;
  role: "assistant" | "user";
  content: string;
  source?: "resume" | "portfolio" | "mixed";
  links?: ChatLink[];
  references?: string[];
};

export function PortfolioChatbot() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messageId, setMessageId] = useState(2);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      content:
        "Hi! I can help you navigate Ivan’s portfolio and answer questions using portfolio and resume data. Ask about projects, technologies, research, AI work, IoT work, experience, education, resume, or contact info.",
    },
  ]);

  const quickQuestions = useMemo(
    () => [
      "What are your strongest backend projects?",
      "Which projects use Laravel?",
      "Which projects involve AI?",
      "What systems have you deployed?",
      "Tell me about your IoT work.",
      "What can you build for a research organization?",
      "Show me your strongest full-stack project.",
    ],
    [],
  );

  const resetConversation = () => {
    setMessages([
      {
        id: 1,
        role: "assistant",
        content:
          "Conversation reset. Ask about projects, technologies, experience, research, AI work, IoT work, education, resume, or contact info.",
      },
    ]);
    setError(null);
  };

  const appendMessage = async (question: string) => {
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion || loading) return;

    if (trimmedQuestion.length > 500) {
      setError("Question is too long. Please keep it under 500 characters.");
      return;
    }

    setError(null);
    setLoading(true);

    const nextUserId = messageId;
    const nextAssistantId = messageId + 1;
    setMessageId((value) => value + 2);

    const userMessage: Message = {
      id: nextUserId,
      role: "user",
      content: trimmedQuestion,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: trimmedQuestion }),
      });

      const payload = (await response.json()) as {
        answer?: string;
        links?: ChatLink[];
        references?: string[];
        source?: "resume" | "portfolio" | "mixed";
        error?: string;
      };

      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to answer right now.");
      }

      setMessages((prev) => [
        ...prev,
        {
          id: nextAssistantId,
          role: "assistant",
          content: payload.answer ?? "I could not find a supported answer for that question.",
          source: payload.source,
          links: payload.links ?? [],
          references: payload.references ?? [],
        },
      ]);
    } catch (err) {
      const fallback = err instanceof Error ? err.message : "Unable to answer right now.";
      setError(fallback);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void appendMessage(input);
  };

  return (
    <>
      <button
        type="button"
        className="chatbot-toggle"
        onClick={() => {
          setOpen((prev) => !prev);
          setMinimized(false);
        }}
        aria-expanded={open}
        aria-controls="portfolio-chatbot-panel"
        aria-haspopup="dialog"
      >
        <Bot size={18} />
        <span>{open ? "Close chat" : "Ask about Ivan"}</span>
      </button>

      <div
        id="portfolio-chatbot-panel"
        className={`chatbot-panel ${open ? "open" : ""} ${minimized ? "minimized" : ""}`}
        role="dialog"
        aria-modal="false"
        aria-labelledby="chatbot-title"
      >
        <div className="chatbot-panel-header">
          <div>
            <p className="chatbot-eyebrow">Portfolio concierge</p>
            <h3 id="chatbot-title">Ask about Ivan</h3>
          </div>
          <div className="chatbot-badge">
            <Sparkles size={14} />
            Portfolio-based answers
          </div>
        </div>

        <div className="chatbot-controls">
          <button type="button" onClick={() => setMinimized((value) => !value)}>
            {minimized ? "Maximize" : "Minimize"}
          </button>
          <button type="button" onClick={resetConversation}>Reset</button>
        </div>

        {minimized ? null : (
          <>
            <div className="chatbot-quick-actions">
              {quickQuestions.map((question) => (
                <button key={question} type="button" onClick={() => void appendMessage(question)} disabled={loading}>
                  {question}
                </button>
              ))}
            </div>

            <div className="chatbot-messages" role="log" aria-live="polite" aria-busy={loading}>
              {messages.map((message) => (
                <div key={message.id} className={`chatbot-message ${message.role}`}>
                  <div className="chatbot-avatar">
                    {message.role === "assistant" ? <Bot size={15} /> : <UserRound size={15} />}
                  </div>
                  <div className="chatbot-bubble">
                    <p>{message.content}</p>

                    {message.links && message.links.length > 0 ? (
                      <div className="chatbot-links">
                        {message.links.map((link) => (
                          <a key={`${message.id}-${link.label}-${link.href}`} href={link.href} target={link.href.startsWith("http") ? "_blank" : undefined} rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}>
                            [{link.label}]
                          </a>
                        ))}
                      </div>
                    ) : null}

                    {message.references && message.references.length > 0 ? (
                      <p className="chatbot-references">Reference: {message.references.join("; ")}</p>
                    ) : null}

                    {message.role === "assistant" && message.source ? <span className="chatbot-source-badge">{message.source}-based answer</span> : null}
                  </div>
                </div>
              ))}

              {loading ? (
                <div className="chatbot-message assistant">
                  <div className="chatbot-avatar"><Bot size={15} /></div>
                  <div className="chatbot-bubble"><p>Thinking...</p></div>
                </div>
              ) : null}
            </div>

            {error ? <p className="chatbot-error" role="alert">{error}</p> : null}

            <form className="chatbot-form" onSubmit={handleSubmit}>
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask about projects, stack, AI, IoT, research, or contact"
                aria-label="Ask a question about Ivan"
                maxLength={500}
                disabled={loading}
              />
              <button type="submit" aria-label="Send question" disabled={loading || !input.trim()}>
                <Send size={16} />
              </button>
            </form>
          </>
        )}
      </div>
    </>
  );
}
