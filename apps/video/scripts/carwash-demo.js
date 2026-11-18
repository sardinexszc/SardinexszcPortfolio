// Runs the carwash-booking bot logic (lib/booking.js) on made-up bookings and saves the chat it produces,
// so every message in the CarwashWalkthrough video is the bot's real output.
// Usage: node scripts/carwash-demo.js <path to carwash-booking repo>
// Writes public/carwash/chat.json: [{ chat: "owner" | "customer", from: "bot" | "user", text }]
const assert = require("assert");
const { mkdirSync, writeFileSync } = require("fs");
const { join, resolve } = require("path");

const repo = process.argv[2];
if (!repo) throw new Error("usage: node scripts/carwash-demo.js <carwash-booking repo>");
const { processNewBookings, matchBooking, handleCommand, dueReminders } = require(resolve(repo, "lib/booking.js"));

const OWNER = -100, CUSTOMER = 501; // demo chat IDs
const DATE = "2026-11-14", TODAY = "2026-11-13";
const row = (n, extra) => ({ row_number: n, Vehicle: "", Service: "Full Detail", Date: DATE, "Time slot": "10:00", Notes: "", "Booking ID": "", Status: "", "Chat ID": "", Reminded: "", ...extra });
// Demo customers, not real people.
const rows = [
  row(2, { Name: "Maria Santos", Phone: "0917 000 1234", Vehicle: "Toyota Vios / ABC 1234" }),
  row(3, { Name: "Paolo Reyes", Phone: "0918 000 5678", Vehicle: "Honda City / XYZ 5678", Service: "Basic Wash" }),
];
const chat = [];
const say = (who, from, text) => chat.push({ chat: who, from, text });

// Workflow 1: two form answers for the same slot.
for (const o of processNewBookings(rows)) say("owner", "bot", o.text);
assert.deepStrictEqual(rows.map((r) => r.Status), ["New", "Conflict"]);

// Workflow 2: Maria opens the bot and shares her phone.
say("customer", "user", "📱 Shared phone number");
const link = matchBooking(rows, { chat: { id: CUSTOMER }, from: { id: 7 }, contact: { user_id: 7, phone_number: "+63 917 000 1234" } });
assert.ok(link.found);
rows[0]["Chat ID"] = String(CUSTOMER);
say("customer", "bot", link.text.split("\n\nCommands:")[0]); // command list trimmed for screen space

// Owner confirms; the customer is told.
say("owner", "user", "/confirm 2");
const confirm = handleCommand(rows, { chat: { id: OWNER }, from: { id: 1 }, text: "/confirm 2" }, OWNER, TODAY, 9 * 60);
rows[0].Status = "Confirmed";
for (const m of confirm.messages) say(String(m.chatId) === String(OWNER) ? "owner" : "customer", "bot", m.text);

// Workflow 3: reminder the evening before.
const [reminder] = dueReminders(rows, DATE);
assert.ok(reminder);
say("customer", "bot", reminder.text);

const out = join(__dirname, "..", "public", "carwash");
mkdirSync(out, { recursive: true });
writeFileSync(join(out, "chat.json"), JSON.stringify(chat, null, 1));
console.log(chat.map((m) => `[${m.chat}/${m.from}] ${m.text.split("\n")[0]}`).join("\n"));
