import { useState } from "react";
import { money, useStore } from "../store";
import { IconClose } from "../components/Icons";
import type { Order, OrderStatus } from "../types";

const S_CN: Record<OrderStatus, [string, string]> = {
  pending: ["待支付", ""], paid: ["待发货", "rose"], shipped: ["已发货", "blue"], completed: ["已完成", "green"], refunded: ["已退款", "gray"],
};
const PAY_CN = { card: "信用卡 (Stripe)", paypal: "PayPal", applepay: "Apple / Google Pay" };

export function OrderStatusTag({ s }: { s: OrderStatus }) {
  return <span className={`tag ${S_CN[s][1]}`}>{S_CN[s][0]}</span>;
}

function OrderModal({ o, onClose }: { o: Order; onClose: () => void }) {
  const { set, toast } = useStore();
  const [carrier, setCarrier] = useState(o.carrier ?? "DHL Express");
  const [tracking, setTracking] = useState(o.tracking ?? "");
  const patch = (x: Partial<Order>, msg: string) => {
    set((s) => ({ ...s, orders: s.orders.map((y) => (y.id === o.id ? { ...y, ...x } : y)) }));
    toast(msg);
    onClose();
  };
  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>订单 {o.id} <button className="icon-btn" onClick={onClose} aria-label="关闭"><IconClose /></button></h2>
        <div className="kv">
          <span>状态</span><span><OrderStatusTag s={o.status} /></span>
          <span>下单时间</span><span>{new Date(o.createdAt).toLocaleString("zh-CN")}</span>
          <span>客户</span><span>{o.name} · {o.email}</span>
          <span>收货地址</span><span>{o.address.line1}, {o.address.city} {o.address.zip}, {o.address.country}</span>
          <span>支付方式</span><span>{PAY_CN[o.payment]}</span>
          <span>配送</span><span>{o.shippingMethod === "express" ? "加急" : "标准"}{o.tracking ? ` · ${o.carrier} ${o.tracking}` : ""}</span>
        </div>
        <table className="tbl" style={{ marginBottom: 12 }}>
          <thead><tr><th>商品</th><th>规格</th><th>数量</th><th style={{ textAlign: "right" }}>小计</th></tr></thead>
          <tbody>{o.items.map((i, k) => <tr key={k}><td>{i.name}</td><td>{i.color} / {i.size}</td><td>×{i.qty}</td><td style={{ textAlign: "right" }}>{money(i.price * i.qty)}</td></tr>)}</tbody>
        </table>
        <div className="kv" style={{ gridTemplateColumns: "1fr auto", textAlign: "right" }}>
          <span>商品金额</span><span>{money(o.subtotal)}</span>
          {o.discount > 0 && <><span>优惠</span><span>−{money(o.discount)}</span></>}
          <span>运费</span><span>{money(o.shipping)}</span>
          <span style={{ color: "var(--ink)" }}>实付</span><b style={{ fontWeight: 500 }}>{money(o.total)}</b>
        </div>
        {o.status === "paid" && (
          <div className="panel" style={{ background: "var(--cream)" }}>
            <h3>发货</h3>
            <div className="f2">
              <div className="f"><label>物流公司</label><select className="a-select" value={carrier} onChange={(e) => setCarrier(e.target.value)}>{["DHL Express", "FedEx", "UPS", "USPS", "YunExpress 云途", "4PX 递四方"].map((c) => <option key={c}>{c}</option>)}</select></div>
              <div className="f"><label>物流单号</label><input className="a-input" value={tracking} onChange={(e) => setTracking(e.target.value)} placeholder="输入运单号" /></div>
            </div>
            <button className="a-btn rose" onClick={() => { if (!tracking.trim()) { toast("请填写物流单号"); return; } patch({ status: "shipped", carrier, tracking }, "已标记发货，系统将邮件通知客户"); }}>确认发货</button>
          </div>
        )}
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 14, flexWrap: "wrap" }}>
          {o.status === "shipped" && <button className="a-btn" onClick={() => patch({ status: "completed" }, "订单已完成")}>标记已签收</button>}
          {o.status === "pending" && <button className="a-btn ghost" onClick={() => patch({ status: "paid" }, "已标记为已支付")}>标记已支付</button>}
          {(o.status === "paid" || o.status === "shipped" || o.status === "completed") && <button className="a-btn danger" onClick={() => { if (confirm("确认全额退款？")) patch({ status: "refunded" }, "已退款（正式版将原路退回）"); }}>退款</button>}
        </div>
      </div>
    </div>
  );
}

export function Orders() {
  const { state } = useStore();
  const [tab, setTab] = useState<OrderStatus | "all">("all");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const list = state.orders.filter((o) => (tab === "all" || o.status === tab) && (!q || `${o.id} ${o.name} ${o.email}`.toLowerCase().includes(q.toLowerCase())));
  const cnt = (s: OrderStatus) => state.orders.filter((o) => o.status === s).length;
  const current = state.orders.find((o) => o.id === open);
  return (
    <>
      <div className="tabs">
        <button className={tab === "all" ? "on" : ""} onClick={() => setTab("all")}>全部 {state.orders.length}</button>
        {(Object.keys(S_CN) as OrderStatus[]).map((s) => <button key={s} className={tab === s ? "on" : ""} onClick={() => setTab(s)}>{S_CN[s][0]} {cnt(s)}</button>)}
      </div>
      <div className="bar-tools"><input className="a-input" placeholder="搜索订单号 / 客户 / 邮箱" value={q} onChange={(e) => setQ(e.target.value)} /></div>
      <div className="panel">
        <div className="tbl-wrap">
          <table className="tbl">
            <thead><tr><th>订单号</th><th>客户</th><th className="hide-sm">国家</th><th className="hide-sm">商品数</th><th>实付</th><th className="hide-sm">支付</th><th>状态</th><th className="hide-sm">时间</th><th></th></tr></thead>
            <tbody>{list.map((o) => (
              <tr key={o.id} style={{ cursor: "pointer" }} onClick={() => setOpen(o.id)}>
                <td>{o.id}</td><td>{o.name}</td><td className="hide-sm">{o.address.country}</td>
                <td className="hide-sm">{o.items.reduce((a, i) => a + i.qty, 0)}</td><td>{money(o.total)}</td>
                <td className="hide-sm">{PAY_CN[o.payment]}</td><td><OrderStatusTag s={o.status} /></td>
                <td className="hide-sm">{new Date(o.createdAt).toLocaleString("zh-CN", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })}</td>
                <td><button className="a-btn ghost sm">{o.status === "paid" ? "发货" : "详情"}</button></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
        {list.length === 0 && <p style={{ textAlign: "center", color: "var(--muted)", padding: 30 }}>暂无订单</p>}
      </div>
      {current && <OrderModal o={current} onClose={() => setOpen(null)} />}
    </>
  );
}

export function Customers() {
  const { state } = useStore();
  const [q, setQ] = useState("");
  const rows = state.customers
    .filter((c) => !q || `${c.name} ${c.email}`.toLowerCase().includes(q.toLowerCase()))
    .map((c) => {
      const os = state.orders.filter((o) => o.email === c.email && o.status !== "refunded" && o.status !== "pending");
      return { ...c, n: os.length, spent: os.reduce((s, o) => s + o.total, 0) };
    })
    .sort((a, b) => b.spent - a.spent);
  return (
    <>
      <div className="bar-tools"><input className="a-input" placeholder="搜索姓名 / 邮箱" value={q} onChange={(e) => setQ(e.target.value)} /><span className="grow" /><span style={{ color: "var(--muted)", fontSize: 13 }}>共 {state.customers.length} 位客户</span></div>
      <div className="panel">
        <div className="tbl-wrap">
          <table className="tbl">
            <thead><tr><th>客户</th><th className="hide-sm">国家</th><th>订单数</th><th>累计消费</th><th className="hide-sm">邮件订阅</th><th className="hide-sm">注册时间</th></tr></thead>
            <tbody>{rows.map((c) => (
              <tr key={c.id}>
                <td><div className="pcell" style={{ minWidth: 0 }}><span className="avatar">{c.name[0]}</span><div><div>{c.name}</div><small style={{ color: "var(--muted)" }}>{c.email}</small></div></div></td>
                <td className="hide-sm">{c.country}</td><td>{c.n}</td><td>{money(c.spent)}</td>
                <td className="hide-sm"><span className={`tag ${c.subscribed ? "green" : "gray"}`}>{c.subscribed ? "已订阅" : "未订阅"}</span></td>
                <td className="hide-sm">{new Date(c.joinedAt).toLocaleDateString("zh-CN")}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </>
  );
}
