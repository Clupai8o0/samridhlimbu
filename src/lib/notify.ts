// Best-effort Telegram push for form submissions. Never throws, never blocks long.
// Uses node:https + family:4 on purpose — Node's fetch/undici hangs on IPv6 where
// there's no IPv6 route to Telegram; forcing IPv4 is safe everywhere it's reachable.
import { request as httpsRequest } from "node:https";

const TIMEOUT_MS = 6000;

/** Escape dynamic text for Telegram's HTML parse mode. */
export function tgEsc(str: string) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Send an HTML message to the configured chat. No-op if env vars are missing.
 *  Resolves false on any failure (logs a warning, never throws). */
export function notifyTelegram(html: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return Promise.resolve(false);

  const payload = JSON.stringify({
    chat_id: chatId,
    text: html,
    parse_mode: "HTML",
    disable_web_page_preview: true,
  });

  return new Promise<boolean>((resolve) => {
    const req = httpsRequest(
      {
        host: "api.telegram.org",
        path: `/bot${token}/sendMessage`,
        method: "POST",
        family: 4, // force IPv4 — see header note
        timeout: TIMEOUT_MS,
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(payload),
        },
      },
      (res) => {
        let body = "";
        res.on("data", (c) => (body += c));
        res.on("end", () => {
          const s = res.statusCode ?? 0;
          if (s >= 200 && s < 300) return resolve(true);
          console.warn("Telegram notify failed:", s, body.slice(0, 300));
          resolve(false);
        });
      }
    );
    req.on("timeout", () => {
      console.warn("Telegram notify timed out");
      req.destroy();
      resolve(false);
    });
    req.on("error", (err) => {
      console.warn("Telegram notify error:", err.message);
      resolve(false);
    });
    req.write(payload);
    req.end();
  });
}
