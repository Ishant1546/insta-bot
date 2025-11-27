const BASE = "https://insta-bot-dvds.onrender.com";

async function safeJson(res: Response) {
  try {
    return await res.json();
  } catch {
    return {};
  }
}

export async function getStatus() {
  const res = await fetch(BASE + "/bot/status");
  return safeJson(res);
}

export async function startBot() {
  const res = await fetch(BASE + "/bot/start", { method: "POST" });
  return safeJson(res);
}

export async function stopBot() {
  const res = await fetch(BASE + "/bot/stop", { method: "POST" });
  return safeJson(res);
}

export async function getLogs() {
  const res = await fetch(BASE + "/logs");
  return safeJson(res);
}

export async function getAccounts() {
  const res = await fetch(BASE + "/accounts");
  return safeJson(res);
}
