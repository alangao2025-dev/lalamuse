import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Category, PostColumn } from "./types";

export type Lang = "en" | "zh";
const KEY = "lalamuse-lang";

interface Ctx {
  lang: Lang;
  setLang: (l: Lang) => void;
  tr: <T>(en: T, zh: T) => T;
  pick: <O extends { zh?: object }>(obj: O, key: keyof O & string) => string;
  date: (iso: string, long?: boolean) => string;
}

const LangCtx = createContext<Ctx | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem(KEY) === "zh" ? "zh" : "en"));
  useEffect(() => {
    localStorage.setItem(KEY, lang);
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  }, [lang]);
  const value = useMemo<Ctx>(() => ({
    lang,
    setLang,
    tr: (en, zh) => (lang === "zh" ? zh : en),
    pick: (obj, key) => {
      const zh = (obj.zh as Record<string, string | undefined> | undefined)?.[key]?.trim();
      return lang === "zh" && zh ? zh : String(obj[key] ?? "");
    },
    date: (iso, long) => new Date(iso).toLocaleDateString(lang === "zh" ? "zh-CN" : "en-US", { month: long ? "long" : "short", day: "numeric", year: "numeric" }),
  }), [lang]);
  return <LangCtx.Provider value={value}>{children}</LangCtx.Provider>;
}

export function useLang() {
  const c = useContext(LangCtx);
  if (!c) throw new Error("useLang outside provider");
  return c;
}

export const CAT_LABEL: Record<Category, [string, string]> = {
  clothing: ["Clothing", "服装"],
  shoes: ["Shoes", "鞋履"],
  bags: ["Bags", "包袋"],
  jewelry: ["Jewelry", "首饰"],
  accessories: ["Accessories", "配饰"],
};

export const COLUMN_LABEL: Record<PostColumn, string> = {
  "Styling Tips": "穿搭技巧",
  "Trend Report": "流行趋势",
  "Capsule Wardrobe": "胶囊衣橱",
  "Occasion Wear": "场合穿搭",
  "Care Guide": "保养指南",
};

const COLOR_ZH: Record<string, string> = {
  Blush: "裸粉", Ivory: "象牙白", Noir: "黑色", Sage: "鼠尾草绿", Camel: "驼色", Gold: "金色", Silver: "银色",
  Rosewood: "玫瑰木", "Mist Blue": "雾霾蓝", Lilac: "丁香紫",
};

export function useColorName() {
  const { lang } = useLang();
  return (name: string) => (lang === "zh" ? COLOR_ZH[name] ?? name : name);
}
