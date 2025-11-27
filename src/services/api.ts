
const BASE = "https://insta-bot-dvds.onrender.com";

export async function getStatus(){
  return fetch(BASE + "/bot/status").then(r=>r.json());
}

export async function startBot(){
  return fetch(BASE + "/bot/start",{method:"POST"}).then(r=>r.json());
}

export async function stopBot(){
  return fetch(BASE + "/bot/stop",{method:"POST"}).then(r=>r.json());
}

export async function getLogs(){
  return fetch(BASE + "/logs").then(r=>r.json());
}

export async function getAccounts(){
  return fetch(BASE + "/accounts").then(r=>r.json());
}
