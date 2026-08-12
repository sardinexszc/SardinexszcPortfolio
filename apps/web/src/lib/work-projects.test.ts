import assert from "node:assert/strict";
import test from "node:test";
import { getKeyFeatures, getOutcomeStatement, getRoleSummary, projectSlug } from "./work-projects";
import type { Project } from "./types";

const project: Project = {
  id: 1,
  title: "CLAARRDEC RTMS",
  description: "A monitoring platform built to improve reporting.",
  image_url: null,
  tech_stack: ["Laravel", "PHP", "MySQL"],
  live_url: null,
  github_url: null,
  featured: true,
  role_summary: "Built the full-stack monitoring workflow.",
  outcome: "Improved reporting coordination.",
  highlights: ["Reporting", "Project tracking"],
};

test("uses authored case-study evidence when it is available", () => {
  assert.equal(getRoleSummary(project), "Built the full-stack monitoring workflow.");
  assert.equal(getOutcomeStatement(project), "Improved reporting coordination.");
  assert.deepEqual(getKeyFeatures(project), ["Reporting", "Project tracking"]);
});

test("generates stable canonical project slugs", () => {
  assert.equal(projectSlug(project), "claarrdec-real-time-monitoring-system");
});
