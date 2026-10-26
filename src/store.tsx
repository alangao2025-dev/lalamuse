import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { State } from "./types";
import { seedState } from "./data/seed";

const KEY = "lalamuse-v1";

function load(): State {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...seedState(), ...JSON.parse(raw) };
  } catch { /* corrupted storage falls back to seed */ }
  return seedState();
}

interface Ctx {
  state: State;
  set: (fn: (s: State) => State) => void;
  reset: () => void;
  toast: (msg: string) => void;
  toastMsg: string;
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
}

const StoreCtx = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(load);
  const [toastMsg, setToastMsg] = useState("");
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      setToastMsg("浏览器存储空间已满，请删除部分上传图片 / Storage full");
    }
  }, [state]);

  useEffect(() => {
    if (!toastMsg) return;
    const t = setTimeout(() => setToastMsg(""), 2600);
    return () => clearTimeout(t);
  }, [toastMsg]);

  const value = useMemo<Ctx>(() => ({
    state,
    set: (fn) => setState((s) => fn(s)),
    reset: () => setState({ ...seedState(), admin: true }),
    toast: setToastMsg,
    toastMsg,
    cartOpen,
    setCartOpen,
  }), [state, toastMsg, cartOpen]);

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const c = useContext(StoreCtx);
  if (!c) throw new Error("useStore outside provider");
  return c;
}

export const money = (n: number) => `$${n.toFixed(2).replace(/\.00$/, "")}`;

export const uid = (p: string) => `${p}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;

export function cartTotals(state: State, coupon?: string, express = false) {
  const lines = state.cart
    .map((c) => ({ ...c, product: state.products.find((p) => p.id === c.productId)! }))
    .filter((l) => l.product);
  const subtotal = lines.reduce((s, l) => s + l.product.price * l.qty, 0);
  const pct = state.settings.coupons.find((c) => c.code === coupon?.trim().toUpperCase())?.percent ?? 0;
  const discount = Math.round(subtotal * pct) / 100;
  const shipping = express
    ? state.settings.expressShip
    : subtotal - discount >= state.settings.freeShipThreshold || subtotal === 0 ? 0 : state.settings.standardShip;
  return { lines, subtotal, discount, shipping, total: subtotal - discount + shipping, pct };
}

export function compressImage(file: File, max = 900): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(img.src);
      resolve(canvas.toDataURL("image/jpeg", 0.8));
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}
