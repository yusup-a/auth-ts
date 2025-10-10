// src/config/slack.ts
// Uses Node 18+ global fetch (no extra package needed)

// Read env at call time (not at import time)
function getSlackConfig() {
  return {
    BOT_TOKEN: process.env.SLACK_BOT_TOKEN || "",
    CHANNEL: process.env.SLACK_CHANNEL_ID || "",
    WEBHOOK: process.env.SLACK_WEBHOOK_URL || "", // optional fallback
  };
}

type ReportKind = "bug" | "feature" | "feedback";

export async function notifySlack(
  kind: ReportKind,
  payload: {
    title: string;
    description: string;
    priority?: string;
    user?: { username?: string; email?: string };
    url?: string; // optional dashboard link later
  }
) {
  const { BOT_TOKEN, CHANNEL, WEBHOOK } = getSlackConfig();

  const text =
    `New *${kind.toUpperCase()}* submitted\n` +
    `• *Title:* ${payload.title}\n` +
    `• *Desc:* ${payload.description}\n` +
    (payload.priority ? `• *Priority:* ${payload.priority}\n` : "") +
    (payload.user ? `• *By:* ${payload.user.username ?? ""} (${payload.user.email ?? ""})\n` : "") +
    (payload.url ? `• ${payload.url}` : "");

  // Prefer Bot token (chat.postMessage)
  if (BOT_TOKEN && CHANNEL) {
    const resp = await fetch("https://slack.com/api/chat.postMessage", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${BOT_TOKEN}`,
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        channel: CHANNEL,
        text,
        blocks: [
          { type: "header", text: { type: "plain_text", text: `New ${kind} submitted` } },
          {
            type: "section",
            fields: [
              { type: "mrkdwn", text: `*Title:*\n${payload.title}` },
              { type: "mrkdwn", text: `*Priority:*\n${payload.priority ?? "-"}` },
              {
                type: "mrkdwn",
                text: `*By:*\n${payload.user ? `${payload.user.username ?? ""} (${payload.user.email ?? ""})` : "-"}`,
              },
            ],
          },
          { type: "section", text: { type: "mrkdwn", text: `*Description:*\n${payload.description}` } },
          ...(payload.url
            ? [
                {
                  type: "actions",
                  elements: [
                    { type: "button", text: { type: "plain_text", text: "Open in dashboard" }, url: payload.url },
                  ],
                },
              ]
            : []),
        ],
      }),
    });

    const j = (await resp.json()) as { ok?: boolean; error?: string };
    if (!j.ok) throw new Error(`Slack chat.postMessage failed: ${j.error}`);
    return;
  }

  // Optional fallback: Incoming Webhook
  if (WEBHOOK) {
    const resp = await fetch(WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    if (!resp.ok) throw new Error(`Slack webhook failed: ${resp.status}`);
    return;
  }

  // No config provided — do nothing (keep API flow alive)
  console.warn("Slack not configured: set SLACK_BOT_TOKEN + SLACK_CHANNEL_ID (or SLACK_WEBHOOK_URL).");
}
