import assert from "node:assert/strict";
import test from "node:test";
import { answerPortfolioQuestion } from "./chatbot";
import type { Portfolio } from "./types";

const portfolio: Portfolio = {
  projects: [
    {
      id: 1,
      title: "Crops and Resources Research and Development Center",
      description: "Research management portal",
      image_url: null,
      tech_stack: ["Next.js", "React", "TypeScript"],
      live_url: "https://example.com",
      github_url: null,
      featured: true,
    },
  ],
  skills: [{ id: 1, name: "TypeScript", proficiency: 90, icon: "TS" }],
  timeline: [
    {
      id: 1,
      type: "experience",
      organization: "Central Luzon State University",
      role: "Full-Stack Web Developer",
      description: "Built research systems and automation tools",
      start_date: "2026",
      end_date: null,
    },
  ],
};

test("answers background questions from the portfolio data", () => {
  const answer = answerPortfolioQuestion("What do you do?", portfolio);
  assert.match(answer, /full-stack|software engineer/i);
});

test("answers technology questions with portfolio examples", () => {
  const answer = answerPortfolioQuestion("What technologies do you use?", portfolio);
  assert.match(answer, /TypeScript|Next\.js|React/i);
});
