import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { money, useStore } from "../store";
import { ProductImage } from "../components/Art";
import { ProductCard } from "./parts";

const STATUS_EN: Record<string, string> = { pending: "Awaiting payment", paid: "Processing", shipped: "Shipped", completed: "Delivered", refunded: "Refunded" };

export default function Account() {
  const { state, set, toast } = useStore();
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
          <div className="eyebrow">Welcome</div>
          <h1>{mode === "in" ? "Sign in" : "Create account"}</h1>
          <p style={{ color: "var(--ink-2)", fontSize: 14, marginTop: 0 }}>Track orders, save favourites and check out faster.</p>
          <form style={{ textAlign: "left", marginTop: 20 }} onSubmit={(e) => {
            e.preventDefault();
            if (!/^\S+@\S+\.\S+$/.test(email) || pw.length < 6) { toast("Enter a valid email and a password of 6+ characters"); return; }
            const existing = state.customers.find((c) => c.email === email);
            set((s) => ({ ...s, user: { email, name: name || existing?.name || email.split("@")[0] } }));
            toast("Welcome back ♡");
          }}>
            {mode === "up" && <div className="field"><label>Name</label><input className="input" value={name} onChange={(e) => setName(e.target.value)} /></div>}
            <div className="field"><label>Email</label><input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="emma.j@example.com" /></div>
            <div className="field"><label>Password</label><input className="input" type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="至少 6 位（原型任意填写）" /></div>
            <button className="btn btn-block" style={{ marginTop: 8 }}>{mode === "in" ? "Sign in" : "Create account"}</button>
          </form>
          <button style={{ marginTop: 18, fontSize: 13, textDecoration: "underline" }} onClick={() => setMode(mode === "in" ? "up" : "in")}>
            {mode === "in" ? "New here? Create an account" : "Already have an account? Sign in"}
          </button>
          {wish.length > 0 && <p style={{ fontSize: 13, color: "var(--muted)" }}>You have {wish.length} saved pieces — <button style={{ textDecoration: "underline" }} onClick={() => setSp({ tab: "wishlist" })}>sign in to view</button></p>}
        </div>
      </div>
    );
  }

  const orders = state.orders.filter((o) => o.email === state.user!.email);

  return (
    <div className="container">
      <div className="page-head" style={{ textAlign: "left" }}>
        <div className="eyebrow">My account</div>
        <h1>Hello, <span className="serif-i">{state.user.name}</span></h1>
      </div>
      <div className="account">
        <nav className="account-nav">
          {[["orders", `Orders (${orders.length})`], ["wishlist", `Wishlist (${wish.length})`], ["profile", "Profile"]].map(([k, l]) => (
            <button key={k} className={tab === k ? "on" : ""} onClick={() => setSp({ tab: k })}>{l}</button>
          ))}
          <button onClick={() => { set((s) => ({ ...s, user: null })); toast("Signed out"); }}>Sign out</button>
        </nav>
        <div>
          {tab === "orders" && (orders.length === 0
            ? <div className="empty"><h3>No orders yet</h3><p>When you place an order it will appear here.</p><Link className="btn" to="/shop" style={{ marginTop: 12 }}>Shop now</Link></div>
            : orders.map((o) => (
              <div className="order-card" key={o.id}>
                <div className="row" style={{ flexWrap: "wrap" }}>
                  <div><b style={{ fontWeight: 400 }}>{o.id}</b> <small style={{ color: "var(--muted)" }}>· {new Date(o.createdAt).toLocaleDateString("en-US")}</small></div>
                  <span className={`status ${o.status}`}>{STATUS_EN[o.status]}</span>
                </div>
                <div style={{ display: "flex", gap: 8, margin: "14px 0", overflowX: "auto" }}>
                  {o.items.map((i, k) => {
                    const p = state.products.find((x) => x.id === i.productId);
                    return p ? <Link key={k} to={`/product/${p.id}`} style={{ width: 60, flex: "none", aspectRatio: "4/5", borderRadius: 8, overflow: "hidden" }}><ProductImage p={p} colorHex={p.colors.find((c) => c.name === i.color)?.hex} /></Link> : null;
                  })}
                </div>
                <div className="row" style={{ fontSize: 13, color: "var(--ink-2)", flexWrap: "wrap" }}>
                  <span>{o.items.reduce((a, i) => a + i.qty, 0)} items · {money(o.total)}</span>
                  {o.tracking && <span>{o.carrier} · {o.tracking}</span>}
                </div>
              </div>
            )))}
          {tab === "wishlist" && (wish.length === 0
            ? <div className="empty"><h3>Your wishlist is empty</h3><p>Tap the ♡ on any piece to save it here.</p></div>
            : <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))" }}>{wish.map((p) => <ProductCard key={p.id} p={p} />)}</div>)}
          {tab === "profile" && (
            <div className="order-card" style={{ maxWidth: 480 }}>
              <div className="field"><label>Name</label><input className="input" defaultValue={state.user.name} readOnly /></div>
              <div className="field"><label>Email</label><input className="input" defaultValue={state.user.email} readOnly /></div>
              <p style={{ fontSize: 13, color: "var(--muted)" }}>Address book, password and marketing preferences are managed here in the full version.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
