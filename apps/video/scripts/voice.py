"""Voice-over for the project walkthrough videos: one MP3 per line plus word timings.

Usage: python scripts/voice.py [project] [voice]   (default portfolio, en-US-AndrewNeural)
Writes public/<dir>/line-<n>.mp3 and public/<dir>/voice.json:
  [{"file": "<dir>/line-0.mp3", "duration": 3.9, "words": [{"text", "start", "end"}]}]
"""
import asyncio
import json
import sys
from pathlib import Path

import edge_tts

PORTFOLIO = [
    "I'm Ivan Salinas, a full-stack developer. This portfolio is a production system, not a template.",
    "It runs on Next.js and Supabase. Every section is served from a live CMS.",
    "Selected work links real systems I've shipped: web, data and IoT.",
    "Behind it sits an admin dashboard, locked to my Google account.",
    "It tracks what recruiters click, where visitors come from, and how long they stay.",
    "I edit content that publishes instantly, approve testimonials, and answer enquiries.",
    "Ivan Salinas. ivansalinas dot vercel dot app.",
]
EMAIL_AGENT = [
    "Job hunting floods my inbox, and the interview invites get buried.",
    "So I built an email agent in n8n. Every morning at seven, it pulls the last day of job emails from Gmail.",
    "A local Qwen 2.5 model on Ollama sorts each one: interviews, offers, updates and applications. No paid AI API.",
    "Then it groups them into one clean digest and emails it to me. This morning: thirteen emails, sorted in about twenty seconds.",
    "Email summary agent. Built with n8n and Ollama.",
]
CARWASH = [
    "A small carwash takes bookings by text, and double bookings happen.",
    "So I automated it with free tools. Customers book on a Google Form, and n8n checks every new answer against the sheet, every minute.",
    "The owner gets a Telegram alert, and a clash is flagged at once. Customers link the bot with their phone number. One command confirms the booking, and a reminder goes out the evening before.",
    "Four workflows, plain rules, no AI. The booking logic is unit tested, and a one-click installer sets it all up on Windows.",
    "Carwash booking. Built with n8n, Google Sheets and Telegram.",
]
# project: (output dir under public/, lines)
EDW = [
    "Disaster data comes from five agencies, in five formats, and none of it lines up.",
    "So I built a warehouse. Python loads the raw files into PostgreSQL, and dbt builds a star schema, checked by forty-one quality rules.",
    "Dashboards for leadership, operations and logistics read the marts live, through a PHP API. Real events, synthetic figures.",
    "One hundred seventy-four automated checks rebuild it from scratch, and every planted defect is caught.",
    "Disaster Response Intelligence Warehouse. PostgreSQL, dbt, Next.js.",
]

TCEHUB = [
    "TCEHub is a community site for Toyota Camry owners, and I'm building it right now.",
    "Owners can find specialist shops, filtered by service and Camry generation, then browse journals, events and galleries.",
    "It's mobile first, built with Next.js, TypeScript and Tailwind, and every page is generated from typed data.",
    "An admin dashboard is taking shape. Next up: Supabase for real listings, sign-in, and a live map.",
    "TCEHub. In development, with a live preview on Vercel.",
]

CRRDC = [
    "I built this system end to end while heading the ICT division of CRRDC, at Central Luzon State University.",
    "Projects, documents, extension activities, services and staff records now live in one Next.js and Supabase app.",
    "New accounts wait for approval, sign-in uses whitelisted magic links, and row-level security guards every table.",
    "Documents are stored in Google Drive, changes are audit logged, and backups run from the dashboard.",
    "CRRDC information system. Next.js, Supabase, Vercel.",
]

# Closing "Let's talk" card of the projects reel.
REEL = [
    "I'm a full-stack developer who builds with AI tools like Claude, Codex and GitHub Copilot, and I review and test every change myself. Ivan Salinas. ivansalinas dot vercel dot app.",
]

# Short reel: one line per project, spoken over its best scene.
SHORT = [
    "CRRDC: an information system for a university research center, with role-based access, Drive storage and audit logs.",
    "A disaster-response data warehouse in PostgreSQL and dbt, tested end to end, feeding live dashboards.",
    "An n8n agent that sorts my job emails with a local AI model and sends one digest every morning.",
    "A carwash booking bot on n8n and Telegram that flags double bookings at once.",
    "TCEHub, a mobile-first community site for car owners, still in development.",
    "And this portfolio, with its own CMS and visitor analytics behind a Google sign-in.",
]

PROJECTS = {"portfolio": ("voice", PORTFOLIO), "email-agent": ("email-agent/voice", EMAIL_AGENT), "carwash": ("carwash/voice", CARWASH), "edw": ("edw/voice", EDW), "tcehub": ("tcehub/voice", TCEHUB), "crrdc": ("crrdc/voice", CRRDC), "reel": ("reel/voice", REEL), "short": ("short/voice", SHORT)}
PROJECT = sys.argv[1] if len(sys.argv) > 1 else "portfolio"
DIR, LINES = PROJECTS[PROJECT]
VOICE = sys.argv[2] if len(sys.argv) > 2 else "en-US-AndrewNeural"
OUT = Path(__file__).resolve().parent.parent / "public" / DIR


async def speak(i: int, text: str) -> dict:
    audio, words = bytearray(), []
    async for chunk in edge_tts.Communicate(text, VOICE, boundary="WordBoundary").stream():
        if chunk["type"] == "audio":
            audio += chunk["data"]
        elif chunk["type"] == "WordBoundary":
            start = chunk["offset"] / 1e7  # 100 ns ticks to seconds
            words.append({"text": chunk["text"], "start": start, "end": start + chunk["duration"] / 1e7})
    assert audio and words, f"no audio for line {i}"
    # TTS splits "Next.js" into "Next", ".", "js"; glue them back for the captions.
    for j in range(len(words) - 2, 0, -1):
        if words[j]["text"] == ".":
            words[j - 1:j + 2] = [{"text": words[j - 1]["text"] + "." + words[j + 1]["text"], "start": words[j - 1]["start"], "end": words[j + 1]["end"]}]
    (OUT / f"line-{i}.mp3").write_bytes(audio)
    # Last word end plus a short tail; good enough for scene timing.
    return {"file": f"{DIR}/line-{i}.mp3", "duration": round(words[-1]["end"] + 0.25, 3), "words": words}


async def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    lines = []
    for i, t in enumerate(LINES):
        for attempt in range(4):  # the free TTS endpoint sometimes returns no audio; a retry fixes it
            try:
                lines.append(await speak(i, t))
                break
            except edge_tts.exceptions.NoAudioReceived:
                if attempt == 3:
                    raise
                await asyncio.sleep(2)
    (OUT / "voice.json").write_text(json.dumps(lines, indent=1))
    for i, line in enumerate(lines):
        print(f"line {i}: {line['duration']:.2f}s")
    print(f"total speech: {sum(l['duration'] for l in lines):.2f}s")


asyncio.run(main())
