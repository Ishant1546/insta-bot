export interface AddAccountPayload {
  email: string;
  password: string;
}

const BASE_URL = "https://insta-bot-dvds.onrender.com";

export const api = {
  status: async () => {
    const r = await fetch(`${BASE_URL}/bot/status`);
    return r.json();
  },

  start: async () => {
    const r = await fetch(`${BASE_URL}/bot/start`, {
      method: "POST",
    });
    return r.json();
  },

  stop: async () => {
    const r = await fetch(`${BASE_URL}/bot/stop`, {
      method: "POST",
    });
    return r.json();
  },

  logs: async () => {
    const r = await fetch(`${BASE_URL}/logs`);
    return r.json();
  },

  accounts: async () => {
    const r = await fetch(`${BASE_URL}/accounts`);
    return r.json();
  },

  addAccount: async (data: AddAccountPayload) => {
    const r = await fetch(`${BASE_URL}/accounts/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return r.json();
  },

  deleteAccount: async (id: string) => {
    const r = await fetch(`${BASE_URL}/accounts/${id}`, {
      method: "DELETE",
    });
    return r.json();
  },
};
