import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { money, useStore } from "../store";
import { ProductImage } from "../components/Art";
import { ProductCard } from "./parts";
import { useLang } from "../i18n";

const STATUS: Record<string, [string, string]> = { pending: ["Awaiting payment", "待支付"], paid: ["Processing", "处理中"], shipped: ["Shipped", "已发货"], completed: ["Delivered", "已签收"], refunded: ["Refunded", "已退款"] };

export default function Account() {
  const { state, set, toast } = useStore();
  const { tr, lang } = useLang();
  const [sp, setSp] = useSearchParams();
  const tab = sp.get("tab") ?? "orders";
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [mode, setMode] = useState<"in" | "up">("in");
  const [name, setName] = useState("");
  const wish = state.products.filter((p) => state.wishlist.includes(p.id) && p.status === "active");

  if (!state.user) {
    return (
      <div className="container">
        <div className="auth-box">
          <div className="eyebrow">{tr("Welcome", "欢迎")}</div>
          <h1>{mode === "in" ? tr("Sign in", "登录") : tr("Create account", "注册账户")}</h1>
          <p style={{ color: "var(--ink-2)", fontSize: 14, marginTop: 0 }}>{tr("Track orders, save favourites and check out faster.", "查看订单、收藏心仪单品、更快完成结账。")}</p>
          <form style={{ textAlign: "left", marginTop: 20 }} onSubmit={(e) => {
            e.preventDefault();
            if (!/^\S+@\S+\.\S+$/.test(email) || pw.length < 6) { toast(tr("Enter a valid email and a password of 6+ characters", "请输入有效邮箱和至少 6 位密码")); return; }
            const existing = state.customers.find((c) => c.email === email);
            set((s) => ({ ...s, user: { email, name: name || existing?.name || email.split("@")[0] } }));
            toast(tr("Welcome back ♡", "欢迎回来 ♡"));
          }}>
            {mode === "up" && <div className="field"><label>{tr("Name", "姓名")}</label><input className="input" value={name} onChange={(e) => setName(e.target.value)} /></div>}
            <div className="field"><label>{tr("Email", "邮箱")}</label><input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="emma.j@example.com" /></div>
            <div className="field"><label>{tr("Password", "密码")}</label><input className="input" type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder={tr("6+ characters (any value in prototype)", "至少 6 位（原型任意填写）")} /></div>
            <button className="btn btn-block" style={{ marginTop: 8 }}>{mode === "in" ? tr("Sign in", "登录") : tr("Create account", "注册账户")}</button>
          </form>
          <button style={{ marginTop: 18, fontSize: 13, textDecoration: "underline" }} onClick={() => setMode(mode === "in" ? "up" : "in")}>
            {mode === "in" ? tr("New here? Create an account", "还没有账户？立即注册") : tr("Already have an account? Sign in", "已有账户？去登录")}
          </button>
          {wish.length > 0 && <p style={{ fontSize: 13, color: "var(--muted)" }}>{tr(`You have ${wish.length} saved pieces — `, `你收藏了 ${wish.length} 件单品——`)}<button style={{ textDecoration: "underline" }} onClick={() => setSp({ tab: "wishlist" })}>{tr("sign in to view", "登录后查看")}</button></p>}
        </div>
      </div>
    );
  }

  const orders = state.orders.filter((o) => o.email === state.user!.email);

  return (
    <div className="container">
      <div className="page-head" style={{ textAlign: "left" }}>
        <div className="eyebrow">{tr("My account", "我的账户")}</div>
        <h1>{tr("Hello, ", "你好，")}<span className="serif-i">{state.user.name}</span></h1>
      </div>
      <div className="account">
        <nav className="account-nav">
          {[["orders", `${tr("Orders", "我的订单")} (${orders.length})`], ["wishlist", `${tr("Wishlist", "我的收藏")} (${wish.length})`], ["profile", tr("Profile", "个人资料")]].map(([k, l]) => (
            <button key={k} className={tab === k ? "on" : ""} onClick={() => setSp({ tab: k })}>{l}</button>
          ))}
          <button onClick={() => { set((s) => ({ ...s, user: null })); toast(tr("Signed out", "已退出登录")); }}>{tr("Sign out", "退出登录")}</button>
        </nav>
        <div>
          {tab === "orders" && (orders.length === 0
            ? <div className="empty"><h3>{tr("No orders yet", "还没有订单")}</h3><p>{tr("When you place an order it will appear here.", "下单后会显示在这里。")}</p><Link className="btn" to="/shop" style={{ marginTop: 12 }}>{tr("Shop now", "去购物")}</Link></div>
            : orders.map((o) => (
              <div className="order-card" key={o.id}>
                <div className="row" style={{ flexWrap: "wrap" }}>
                  <div><b style={{ fontWeight: 400 }}>{o.id}</b> <small style={{ color: "var(--muted)" }}>· {new Date(o.createdAt).toLocaleDateString(lang === "zh" ? "zh-CN" : "en-US")}</small></div>
                  <span className={`status ${o.status}`}>{STATUS[o.status][lang === "zh" ? 1 : 0]}</span>
                </div>
                <div style={{ display: "flex", gap: 8, margin: "14px 0", overflowX: "auto" }}>
                  {o.items.map((i, k) => {
                    const p = state.products.find((x) => x.id === i.productId);
                    return p ? <Link key={k} to={`/product/${p.id}`} style={{ width: 60, flex: "none", aspectRatio: "4/5", borderRadius: 8, overflow: "hidden" }}><ProductImage p={p} colorHex={p.colors.find((c) => c.name === i.color)?.hex} /></Link> : null;
                  })}
                </div>
                <div className="row" style={{ fontSize: 13, color: "var(--ink-2)", flexWrap: "wrap" }}>
                  <span>{tr(`${o.items.reduce((a, i) => a + i.qty, 0)} items`, `共 ${o.items.reduce((a, i) => a + i.qty, 0)} 件`)} · {money(o.total)}</span>
                  {o.tracking && <span>{o.carrier} · {o.tracking}</span>}
                </div>
              </div>
            )))}
          {tab === "wishlist" && (wish.length === 0
            ? <div className="empty"><h3>{tr("Your wishlist is empty", "收藏夹是空的")}</h3><p>{tr("Tap the ♡ on any piece to save it here.", "点击商品上的 ♡ 即可收藏。")}</p></div>
            : <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))" }}>{wish.map((p) => <ProductCard key={p.id} p={p} />)}</div>)}
          {tab === "profile" && (
            <div className="order-card" style={{ maxWidth: 480 }}>
              <div className="field"><label>{tr("Name", "姓名")}</label><input className="input" defaultValue={state.user.name} readOnly /></div>
              <div className="field"><label>{tr("Email", "邮箱")}</label><input className="input" defaultValue={state.user.email} readOnly /></div>
              <p style={{ fontSize: 13, color: "var(--muted)" }}>{tr("Address book, password and marketing preferences are managed here in the full version.", "正式版可在此管理地址簿、密码和订阅偏好。")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
