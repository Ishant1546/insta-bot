export interface AddAccountPayload {
  email: string;
  password: string;
}

const DEFAULT_BASE = "https://insta-bot-dvds.onrender.com";

const getBase = () => localStorage.getItem("lux-backend") || DEFAULT_BASE;

export const api = {
  status: async () => {
    const r = await fetch(`${getBase()}/bot/status`);
    return r.json();
  },

  start: async () => {
    const r = await fetch(`${getBase()}/bot/start`, {
      method: "POST",
    });
    return r.json();
  },

  stop: async () => {
    const r = await fetch(`${getBase()}/bot/stop`, {
      method: "POST",
    });
    return r.json();
  },

  logs: async () => {
    const r = await fetch(`${getBase()}/logs`);
    return r.json();
  },

  accounts: async () => {
    const r = await fetch(`${getBase()}/accounts`);
    return r.json();
  },

  addAccount: async (data: AddAccountPayload) => {
    const r = await fetch(`${getBase()}/accounts/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return r.json();
  },

  deleteAccount: async (id: string) => {
    const r = await fetch(`${getBase()}/accounts/${id}`, {
      method: "DELETE",
    });
    return r.json();
  },
};
