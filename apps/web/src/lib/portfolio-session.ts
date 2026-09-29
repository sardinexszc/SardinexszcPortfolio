const storageKey = "portfolio_analytics_session_v1";
const idleLimitMs = 30 * 60 * 1000;
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
type Session = { id: string; activeMs: number; lastSeen: number };
let currentSession: Session | null = null;

export function getPortfolioSession(): Session {
  const now = Date.now();
  if (currentSession && now - currentSession.lastSeen <= idleLimitMs) return currentSession;
  try {
    const saved = JSON.parse(window.sessionStorage.getItem(storageKey) ?? "null") as Session | null;
    if (saved && typeof saved.id === "string" && uuidPattern.test(saved.id) &&
      typeof saved.activeMs === "number" && Number.isFinite(saved.activeMs) &&
      typeof saved.lastSeen === "number" && now - saved.lastSeen <= idleLimitMs && now >= saved.lastSeen) {
      currentSession = saved;
      return saved;
    }
  } catch {
    // Session tracking can still run when sessionStorage is unavailable.
  }
  currentSession = { id: crypto.randomUUID(), activeMs: 0, lastSeen: now };
  savePortfolioSession(currentSession);
  return currentSession;
}

export function savePortfolioSession(session: Session) {
  session.lastSeen = Date.now();
  currentSession = session;
  try { window.sessionStorage.setItem(storageKey, JSON.stringify(session)); } catch { /* Storage may be disabled. */ }
}
