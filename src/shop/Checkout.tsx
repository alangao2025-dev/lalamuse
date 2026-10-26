import { useState, type ChangeEvent, type InputHTMLAttributes } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { cartTotals, money, uid, useStore } from "../store";
import { ProductImage } from "../components/Art";
import { IconCheck, IconShield } from "../components/Icons";
import { useColorName, useLang } from "../i18n";
import type { Order } from "../types";

const COUNTRIES = ["United States", "United Kingdom", "Canada", "Australia", "France", "Germany", "Italy", "Spain", "Netherlands", "Singapore", "Japan"];

export function Checkout() {
  const { state, set, toast } = useStore();
  const { tr, pick } = useLang();
  const colorName = useColorName();
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
    return <div className="container empty"><h3>{tr("Your bag is empty", "购物袋还是空的")}</h3><Link className="btn" to="/shop" style={{ marginTop: 16 }}>{tr("Continue shopping", "继续购物")}</Link></div>;
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
    if (ok) { setCode(codeInput); toast(tr("Code applied ✨", "优惠码已使用 ✨")); } else toast(tr("That code isn't valid", "优惠码无效"));
  };

  const placeOrder = () => {
    const req: (keyof typeof f)[] = ["email", "first", "last", "line1", "city", "zip"];
    if (pay === "card") req.push("card", "exp", "cvc");
    const e: Record<string, boolean> = {};
    req.forEach((k) => { if (!f[k].trim()) e[k] = true; });
    if (f.email && !/^\S+@\S+\.\S+$/.test(f.email)) e.email = true;
    if (pay === "card" && f.card && f.card.replace(/\s/g, "").length < 12) e.card = true;
    setErrors(e);
    if (Object.keys(e).length) { toast(tr("Please complete the highlighted fields", "请完善标红的信息")); return; }

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
      {busy && <div className="processing"><div><div className="spinner" /><h3 style={{ fontSize: 28 }}>{tr("Processing payment…", "正在处理付款…")}</h3><p style={{ color: "var(--muted)" }}>{tr("Prototype demo — no real charge is made", "原型演示：模拟支付，不会真实扣款")}</p></div></div>}
      <div className="page-head" style={{ paddingBottom: 10 }}><h1 style={{ fontSize: 44 }}>{tr("Checkout", "结账")}</h1></div>
      <div className="checkout">
        <div>
          <div className="step">
            <h3><span>01</span>{tr("Contact", "联系方式")}</h3>
            {inp("email", tr("Email", "邮箱"), { type: "email", placeholder: "you@example.com", autoComplete: "email" })}
            {!state.user && <p style={{ fontSize: 13, color: "var(--muted)", margin: 0 }}>{tr("Checking out as a guest.", "当前以游客身份结账。")} <Link to="/account" style={{ textDecoration: "underline" }}>{tr("Sign in", "登录")}</Link></p>}
          </div>
          <div className="step">
            <h3><span>02</span>{tr("Shipping address", "收货地址")}</h3>
            <div className="two">{inp("first", tr("First name", "名"), { autoComplete: "given-name" })}{inp("last", tr("Last name", "姓"), { autoComplete: "family-name" })}</div>
            {inp("line1", tr("Address", "详细地址"), { autoComplete: "address-line1" })}
            <div className="two">{inp("city", tr("City", "城市"), { autoComplete: "address-level2" })}{inp("zip", tr("Postal code", "邮编"), { autoComplete: "postal-code" })}</div>
            <div className="field"><label>{tr("Country / Region", "国家 / 地区")}</label>
              <select className="input" value={f.country} onChange={upd("country")}>{COUNTRIES.map((c) => <option key={c}>{c}</option>)}</select>
            </div>
          </div>
          <div className="step">
            <h3><span>03</span>{tr("Delivery", "配送方式")}</h3>
            <label className={`radio-card ${!express ? "on" : ""}`}><input type="radio" checked={!express} onChange={() => setExpress(false)} /><span className="grow">{tr("Standard · 5–9 business days", "标准 · 5–9 个工作日")}</span><b style={{ fontWeight: 400 }}>{freeLeft <= 0 ? tr("Free", "免费") : money(state.settings.standardShip)}</b></label>
            <label className={`radio-card ${express ? "on" : ""}`}><input type="radio" checked={express} onChange={() => setExpress(true)} /><span className="grow">{tr("Express · 2–4 business days", "加急 · 2–4 个工作日")}</span><b style={{ fontWeight: 400 }}>{money(state.settings.expressShip)}</b></label>
          </div>
          <div className="step">
            <h3><span>04</span>{tr("Payment", "支付方式")}</h3>
            {pays.includes("card") && <label className={`radio-card ${pay === "card" ? "on" : ""}`}><input type="radio" checked={pay === "card"} onChange={() => setPay("card")} /><span className="grow">{tr("Credit / debit card", "信用卡 / 借记卡")}</span><span className="pay-icons"><span>VISA</span><span>MC</span><span>AMEX</span></span></label>}
            {pay === "card" && (
              <div style={{ padding: "6px 2px 10px" }}>
                {inp("card", tr("Card number", "卡号"), { inputMode: "numeric", placeholder: "4242 4242 4242 4242", autoComplete: "cc-number" })}
                <div className="two">{inp("exp", tr("Expiry", "有效期"), { placeholder: "MM / YY", autoComplete: "cc-exp" })}{inp("cvc", tr("CVC", "安全码"), { inputMode: "numeric", placeholder: "123", autoComplete: "cc-csc" })}</div>
              </div>
            )}
            {pays.includes("paypal") && <label className={`radio-card ${pay === "paypal" ? "on" : ""}`}><input type="radio" checked={pay === "paypal"} onChange={() => setPay("paypal")} /><span className="grow">PayPal</span><span style={{ fontWeight: 500, color: "#1F3B82" }}>Pay<span style={{ color: "#2C8BD8" }}>Pal</span></span></label>}
            {pays.includes("applepay") && <label className={`radio-card ${pay === "applepay" ? "on" : ""}`}><input type="radio" checked={pay === "applepay"} onChange={() => setPay("applepay")} /><span className="grow">Apple Pay / Google Pay</span><span className="pay-icons"><span>Apple Pay</span><span>G Pay</span></span></label>}
            <button className="btn btn-block" style={{ marginTop: 14, height: 54 }} onClick={placeOrder}>
              {pay === "paypal" ? tr("Continue to PayPal", "前往 PayPal 支付") : pay === "applepay" ? tr("Pay with wallet", "使用钱包支付") : tr("Pay now", "立即支付")} · {money(t.total)}
            </button>
            <div className="secure"><IconShield size={15} /> {tr("Encrypted & secure · Payments processed by Stripe / PayPal", "加密安全 · 由 Stripe / PayPal 处理付款")}</div>
          </div>
        </div>

        <aside className="summary">
          <h3 style={{ fontSize: 26, marginBottom: 12 }}>{tr("Order summary", "订单摘要")}</h3>
          {t.lines.map((l, i) => (
            <div key={i} className="look-item" style={{ borderColor: "rgba(91,52,60,.1)" }}>
              <div className="t"><ProductImage p={l.product} colorHex={l.product.colors.find((c) => c.name === l.color)?.hex} /></div>
              <div><div>{pick(l.product, "name")}</div><small style={{ color: "var(--ink-2)" }}>{colorName(l.color)} · {l.size} · ×{l.qty}</small></div>
              <span className="price">{money(l.product.price * l.qty)}</span>
            </div>
          ))}
          <div className="coupon">
            <input className="input" placeholder={tr("Discount code", "优惠码")} value={codeInput} onChange={(e) => setCodeInput(e.target.value)} />
            <button className="btn btn-ghost" onClick={applyCode}>{tr("Apply", "使用")}</button>
          </div>
          <div className="line"><span>{tr("Subtotal", "小计")}</span><span>{money(t.subtotal)}</span></div>
          {t.discount > 0 && <div className="line" style={{ color: "var(--rose-deep)" }}><span>{tr("Discount", "优惠")} ({code.toUpperCase()} −{t.pct}%)</span><span>−{money(t.discount)}</span></div>}
          <div className="line"><span>{tr("Shipping", "运费")}</span><span>{t.shipping === 0 ? tr("Free", "免费") : money(t.shipping)}</span></div>
          <div className="line total"><span>{tr("Total", "合计")}</span><span>USD {money(t.total)}</span></div>
          <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 0 }}>{tr(<>Try code <b>BLOOM10</b> for 10% off.</>, <>试试优惠码 <b>BLOOM10</b>，立享 9 折。</>)}</p>
        </aside>
      </div>
    </div>
  );
}

export function OrderSuccess() {
  const { id } = useParams();
  const { state } = useStore();
  const { tr, pick } = useLang();
  const o = state.orders.find((x) => x.id === id);
  if (!o) return <div className="container empty"><h3>{tr("Order not found", "订单不存在")}</h3></div>;
  const itemName = (i: Order["items"][number]) => { const p = state.products.find((x) => x.id === i.productId); return p ? pick(p, "name") : i.name; };
  return (
    <div className="container success">
      <div className="ring"><IconCheck size={40} /></div>
      <div className="eyebrow">{tr("Order", "订单")} {o.id}</div>
      <h1>{tr(<>Thank you, <span className="serif-i">{o.name.split(" ")[0]}</span></>, <>谢谢你，<span className="serif-i">{o.name.split(" ")[0]}</span></>)}</h1>
      <p style={{ color: "var(--ink-2)" }}>{tr(<>Your payment of <b>{money(o.total)}</b> was successful. A confirmation has been sent to {o.email}. We'll email you again when your parcel is on its way.</>, <>已成功支付 <b>{money(o.total)}</b>。确认邮件已发送至 {o.email}，包裹发出后我们会再次邮件通知你。</>)}</p>
      <div className="order-card" style={{ textAlign: "left", marginTop: 28 }}>
        {o.items.map((i, k) => <div key={k} className="row" style={{ padding: "6px 0", fontSize: 14 }}><span>{itemName(i)} <small style={{ color: "var(--muted)" }}>×{i.qty}</small></span><span>{money(i.price * i.qty)}</span></div>)}
        <div className="row" style={{ borderTop: "1px solid var(--line)", marginTop: 8, paddingTop: 10 }}><span>{tr("Total paid", "实付金额")}</span><b style={{ fontWeight: 400 }}>{money(o.total)}</b></div>
        <div style={{ fontSize: 13, color: "var(--ink-2)", marginTop: 10 }}>{tr("Ship to", "收货地址")}: {o.address.line1}, {o.address.city} {o.address.zip}, {o.address.country}</div>
      </div>
      <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 26, flexWrap: "wrap" }}>
        <Link className="btn" to="/shop">{tr("Continue shopping", "继续购物")}</Link>
        <Link className="btn btn-ghost" to="/account">{tr("View my orders", "查看我的订单")}</Link>
      </div>
    </div>
  );
}
