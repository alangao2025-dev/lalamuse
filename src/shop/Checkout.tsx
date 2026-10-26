import { useState, type ChangeEvent, type InputHTMLAttributes } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { cartTotals, money, uid, useStore } from "../store";
import { ProductImage } from "../components/Art";
import { IconCheck, IconShield } from "../components/Icons";
import type { Order } from "../types";

const COUNTRIES = ["United States", "United Kingdom", "Canada", "Australia", "France", "Germany", "Italy", "Spain", "Netherlands", "Singapore", "Japan"];

export function Checkout() {
  const { state, set, toast } = useStore();
  const nav = useNavigate();
  const [f, setF] = useState({ email: state.user?.email ?? "", first: "", last: "", line1: "", city: "", zip: "", country: "United States", card: "", exp: "", cvc: "" });
  const [express, setExpress] = useState(false);
  const pays = (["card", "paypal", "applepay"] as const).filter((k) => state.settings.payments[k]);
  const [pay, setPay] = useState<Order["payment"]>(pays[0] ?? "card");
  const [codeInput, setCodeInput] = useState("");
  const [code, setCode] = useState("");
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [busy, setBusy] = useState(false);
  const t = cartTotals(state, code, express);
  const freeLeft = state.settings.freeShipThreshold - (t.subtotal - t.discount);

  if (t.lines.length === 0 && !busy) {
    return <div className="container empty"><h3>Your bag is empty</h3><Link className="btn" to="/shop" style={{ marginTop: 16 }}>Continue shopping</Link></div>;
  }

  const upd = (k: keyof typeof f) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });
  const inp = (k: keyof typeof f, label: string, props: InputHTMLAttributes<HTMLInputElement> = {}) => (
    <div className="field">
      <label>{label}</label>
      <input className="input" value={f[k]} onChange={upd(k)} style={errors[k] ? { borderColor: "#C46B6B" } : undefined} {...props} />
    </div>
  );

  const applyCode = () => {
    const ok = state.settings.coupons.some((c) => c.code === codeInput.trim().toUpperCase());
    if (ok) { setCode(codeInput); toast("Code applied ✨"); } else toast("That code isn't valid");
  };

  const placeOrder = () => {
    const req: (keyof typeof f)[] = ["email", "first", "last", "line1", "city", "zip"];
    if (pay === "card") req.push("card", "exp", "cvc");
    const e: Record<string, boolean> = {};
    req.forEach((k) => { if (!f[k].trim()) e[k] = true; });
    if (f.email && !/^\S+@\S+\.\S+$/.test(f.email)) e.email = true;
    if (pay === "card" && f.card && f.card.replace(/\s/g, "").length < 12) e.card = true;
    setErrors(e);
    if (Object.keys(e).length) { toast("Please complete the highlighted fields"); return; }

    setBusy(true);
    const id = `MB${10240 + state.orders.length + Math.floor(Math.random() * 90)}`;
    const name = `${f.first} ${f.last}`.trim();
    const order: Order = {
      id, email: f.email, name,
      address: { line1: f.line1, city: f.city, zip: f.zip, country: f.country },
      items: t.lines.map((l) => ({ productId: l.productId, name: l.product.name, price: l.product.price, qty: l.qty, color: l.color, size: l.size })),
      subtotal: t.subtotal, shipping: t.shipping, discount: t.discount, total: t.total,
      payment: pay, shippingMethod: express ? "express" : "standard", status: "paid", createdAt: new Date().toISOString(),
    };
    setTimeout(() => {
      set((s) => ({
        ...s,
        orders: [order, ...s.orders],
        cart: [],
        products: s.products.map((p) => {
          const q = order.items.filter((i) => i.productId === p.id).reduce((a, i) => a + i.qty, 0);
          return q ? { ...p, stock: Math.max(0, p.stock - q), sold: p.sold + q } : p;
        }),
        customers: s.customers.some((c) => c.email === f.email) ? s.customers
          : [{ id: uid("c"), name, email: f.email, country: f.country, subscribed: false, joinedAt: new Date().toISOString() }, ...s.customers],
      }));
      nav(`/order/${id}`);
    }, 1600);
  };

  return (
    <div className="container">
      {busy && <div className="processing"><div><div className="spinner" /><h3 style={{ fontSize: 28 }}>Processing payment…</h3><p style={{ color: "var(--muted)" }}>原型演示：模拟支付，不会真实扣款</p></div></div>}
      <div className="page-head" style={{ paddingBottom: 10 }}><h1 style={{ fontSize: 44 }}>Checkout</h1></div>
      <div className="checkout">
        <div>
          <div className="step">
            <h3><span>01</span>Contact</h3>
            {inp("email", "Email", { type: "email", placeholder: "you@example.com", autoComplete: "email" })}
            {!state.user && <p style={{ fontSize: 13, color: "var(--muted)", margin: 0 }}>Checking out as a guest. <Link to="/account" style={{ textDecoration: "underline" }}>Sign in</Link></p>}
          </div>
          <div className="step">
            <h3><span>02</span>Shipping address</h3>
            <div className="two">{inp("first", "First name", { autoComplete: "given-name" })}{inp("last", "Last name", { autoComplete: "family-name" })}</div>
            {inp("line1", "Address", { autoComplete: "address-line1" })}
            <div className="two">{inp("city", "City", { autoComplete: "address-level2" })}{inp("zip", "Postal code", { autoComplete: "postal-code" })}</div>
            <div className="field"><label>Country / Region</label>
              <select className="input" value={f.country} onChange={upd("country")}>{COUNTRIES.map((c) => <option key={c}>{c}</option>)}</select>
            </div>
          </div>
          <div className="step">
            <h3><span>03</span>Delivery</h3>
            <label className={`radio-card ${!express ? "on" : ""}`}><input type="radio" checked={!express} onChange={() => setExpress(false)} /><span className="grow">Standard · 5–9 business days</span><b style={{ fontWeight: 400 }}>{freeLeft <= 0 ? "Free" : money(state.settings.standardShip)}</b></label>
            <label className={`radio-card ${express ? "on" : ""}`}><input type="radio" checked={express} onChange={() => setExpress(true)} /><span className="grow">Express · 2–4 business days</span><b style={{ fontWeight: 400 }}>{money(state.settings.expressShip)}</b></label>
          </div>
          <div className="step">
            <h3><span>04</span>Payment</h3>
            {pays.includes("card") && <label className={`radio-card ${pay === "card" ? "on" : ""}`}><input type="radio" checked={pay === "card"} onChange={() => setPay("card")} /><span className="grow">Credit / debit card</span><span className="pay-icons"><span>VISA</span><span>MC</span><span>AMEX</span></span></label>}
            {pay === "card" && (
              <div style={{ padding: "6px 2px 10px" }}>
                {inp("card", "Card number", { inputMode: "numeric", placeholder: "4242 4242 4242 4242", autoComplete: "cc-number" })}
                <div className="two">{inp("exp", "Expiry", { placeholder: "MM / YY", autoComplete: "cc-exp" })}{inp("cvc", "CVC", { inputMode: "numeric", placeholder: "123", autoComplete: "cc-csc" })}</div>
              </div>
            )}
            {pays.includes("paypal") && <label className={`radio-card ${pay === "paypal" ? "on" : ""}`}><input type="radio" checked={pay === "paypal"} onChange={() => setPay("paypal")} /><span className="grow">PayPal</span><span style={{ fontWeight: 500, color: "#1F3B82" }}>Pay<span style={{ color: "#2C8BD8" }}>Pal</span></span></label>}
            {pays.includes("applepay") && <label className={`radio-card ${pay === "applepay" ? "on" : ""}`}><input type="radio" checked={pay === "applepay"} onChange={() => setPay("applepay")} /><span className="grow">Apple Pay / Google Pay</span><span className="pay-icons"><span>Apple Pay</span><span>G Pay</span></span></label>}
            <button className="btn btn-block" style={{ marginTop: 14, height: 54 }} onClick={placeOrder}>
              {pay === "paypal" ? "Continue to PayPal" : pay === "applepay" ? "Pay with wallet" : "Pay now"} · {money(t.total)}
            </button>
            <div className="secure"><IconShield size={15} /> Encrypted & secure · Payments processed by Stripe / PayPal</div>
          </div>
        </div>

        <aside className="summary">
          <h3 style={{ fontSize: 26, marginBottom: 12 }}>Order summary</h3>
          {t.lines.map((l, i) => (
            <div key={i} className="look-item" style={{ borderColor: "rgba(91,52,60,.1)" }}>
              <div className="t"><ProductImage p={l.product} colorHex={l.product.colors.find((c) => c.name === l.color)?.hex} /></div>
              <div><div>{l.product.name}</div><small style={{ color: "var(--ink-2)" }}>{l.color} · {l.size} · ×{l.qty}</small></div>
              <span className="price">{money(l.product.price * l.qty)}</span>
            </div>
          ))}
          <div className="coupon">
            <input className="input" placeholder="Discount code" value={codeInput} onChange={(e) => setCodeInput(e.target.value)} />
            <button className="btn btn-ghost" onClick={applyCode}>Apply</button>
          </div>
          <div className="line"><span>Subtotal</span><span>{money(t.subtotal)}</span></div>
          {t.discount > 0 && <div className="line" style={{ color: "var(--rose-deep)" }}><span>Discount ({code.toUpperCase()} −{t.pct}%)</span><span>−{money(t.discount)}</span></div>}
          <div className="line"><span>Shipping</span><span>{t.shipping === 0 ? "Free" : money(t.shipping)}</span></div>
          <div className="line total"><span>Total</span><span>USD {money(t.total)}</span></div>
          <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 0 }}>Try code <b>BLOOM10</b> for 10% off.</p>
        </aside>
      </div>
    </div>
  );
}

export function OrderSuccess() {
  const { id } = useParams();
  const { state } = useStore();
  const o = state.orders.find((x) => x.id === id);
  if (!o) return <div className="container empty"><h3>Order not found</h3></div>;
  return (
    <div className="container success">
      <div className="ring"><IconCheck size={40} /></div>
      <div className="eyebrow">Order {o.id}</div>
      <h1>Thank you, <span className="serif-i">{o.name.split(" ")[0]}</span></h1>
      <p style={{ color: "var(--ink-2)" }}>Your payment of <b>{money(o.total)}</b> was successful. A confirmation has been sent to {o.email}. We'll email you again when your parcel is on its way.</p>
      <div className="order-card" style={{ textAlign: "left", marginTop: 28 }}>
        {o.items.map((i, k) => <div key={k} className="row" style={{ padding: "6px 0", fontSize: 14 }}><span>{i.name} <small style={{ color: "var(--muted)" }}>×{i.qty}</small></span><span>{money(i.price * i.qty)}</span></div>)}
        <div className="row" style={{ borderTop: "1px solid var(--line)", marginTop: 8, paddingTop: 10 }}><span>Total paid</span><b style={{ fontWeight: 400 }}>{money(o.total)}</b></div>
        <div style={{ fontSize: 13, color: "var(--ink-2)", marginTop: 10 }}>Ship to: {o.address.line1}, {o.address.city} {o.address.zip}, {o.address.country}</div>
      </div>
      <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 26, flexWrap: "wrap" }}>
        <Link className="btn" to="/shop">Continue shopping</Link>
        <Link className="btn btn-ghost" to="/account">View my orders</Link>
      </div>
    </div>
  );
}
