'use client';

import { Bot, Send, Sparkles, UserRound } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { answerPortfolioQuestion } from "@/lib/chatbot";
import type { Portfolio } from "@/lib/types";

type Message = {
  id: number;
  role: "assistant" | "user";
  content: string;
  source?: "resume" | "portfolio";
};

export function PortfolioChatbot({ portfolio }: { portfolio: Portfolio }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      content:
        "Hi! I can answer questions about Ivan’s background, projects, experience, and the tools he uses. Try asking: “What do you do?” or “What technologies do you use?”",
    },
  ]);

  const quickQuestions = useMemo(
    () => [
      "What do you do?",
      "What technologies do you use?",
      "What projects have you built?",
      "How can I contact you?",
      "Ask about my resume",
    ],
    [],
  );

  const appendMessage = (question: string) => {
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion) return;

    const normalizedQuestion = trimmedQuestion === "Ask about my resume" ? "Tell me about your resume" : trimmedQuestion;
    const answer = answerPortfolioQuestion(normalizedQuestion, portfolio);
    const isResumeBased = /resume|education|publication|contact|skills|experience|projects|professional summary|summary/i.test(normalizedQuestion);

    setMessages((prev) => [
      ...prev,
      { id: prev.length + 1, role: "user", content: trimmedQuestion },
      {
        id: prev.length + 2,
        role: "assistant",
        content: answer,
        source: isResumeBased ? "resume" : "portfolio",
      },
    ]);
    setInput("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    appendMessage(input);
  };

  return (
    <>
      <button
        type="button"
        className="chatbot-toggle"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-controls="portfolio-chatbot-panel"
      >
        <Bot size={18} />
        <span>{open ? "Close chat" : "Ask about Ivan"}</span>
      </button>

      <div id="portfolio-chatbot-panel" className={`chatbot-panel ${open ? "open" : ""}`}>
        <div className="chatbot-panel-header">
          <div>
            <p className="chatbot-eyebrow">Portfolio concierge</p>
            <h3>Ask about Ivan</h3>
          </div>
          <div className="chatbot-badge">
            <Sparkles size={14} />
            AI-style answers
          </div>
        </div>

        <div className="chatbot-quick-actions">
          {quickQuestions.map((question) => (
            <button key={question} type="button" onClick={() => appendMessage(question)}>
              {question}
            </button>
          ))}
        </div>

        <div className="chatbot-messages" role="log" aria-live="polite">
          {messages.map((message) => (
            <div key={message.id} className={`chatbot-message ${message.role}`}>
              <div className="chatbot-avatar">
                {message.role === "assistant" ? <Bot size={15} /> : <UserRound size={15} />}
              </div>
              <div className="chatbot-bubble">
                {message.content}
                {message.role === "assistant" && message.source === "resume" ? <span className="chatbot-source-badge">Resume-based answer</span> : null}
              </div>
            </div>
          ))}
        </div>

        <form className="chatbot-form" onSubmit={handleSubmit}>
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask about his background, work, or stack"
            aria-label="Ask a question about Ivan"
          />
          <button type="submit" aria-label="Send question">
            <Send size={16} />
          </button>
        </form>
      </div>
    </>
  );
}
