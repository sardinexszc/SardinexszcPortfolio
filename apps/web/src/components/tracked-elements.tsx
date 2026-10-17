"use client";

import type { ComponentProps } from "react";
import { trackEngagement, type EngagementEvent } from "@/lib/track-engagement";

// Small client islands so the portfolio page itself can render on the server.
export function TrackedLink({ event, ...props }: ComponentProps<"a"> & { event: EngagementEvent }) {
  return <a {...props} onClick={() => trackEngagement(event)} />;
}
