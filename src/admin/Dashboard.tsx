import { Link } from "react-router-dom";
import { money, useStore } from "../store";
import { ProductImage } from "../components/Art";
import { OrderStatusTag } from "./Orders";

export default function Dashboard() {
  const { state } = useStore();
  const valid = state.orders.filter((o) => o.status !== "refunded" && o.status !== "pending");
  const now = new Date();
  const sameDay = (iso: string, d: Date) => new Date(iso).toDateString() === d.toDateString();
  const today = valid.filter((o) => sameDay(o.createdAt, now));
  const month = valid.filter((o) => { const d = new Date(o.createdAt); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); });
  const revenue = month.reduce((s, o) => s + o.total, 0);
  const aov = month.length ? revenue / month.length : 0;
  const pending = state.orders.filter((o) => o.status === "paid").length;

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now); d.setDate(d.getDate() - (6 - i));
    const v = valid.filter((o) => sameDay(o.createdAt, d)).reduce((s, o) => s + o.total, 0);
    return { label: `${d.getMonth() + 1}/${d.getDate()}`, v };
  });
  const max = Math.max(1, ...days.map((d) => d.v));
  const top = [...state.products].sort((a, b) => b.sold - a.sold).slice(0, 5);
  const lowStock = state.products.filter((p) => p.status === "active" && p.stock < 10);

  return (
    <>
      <div className="kpis">
        <div className="kpi accent"><small>本月销售额 (USD)</small><b>{money(revenue)}</b><span style={{ fontSize: 12, color: "#E9C4BE" }}>{month.length} 笔有效订单</span></div>
        <div className="kpi"><small>今日订单</small><b>{today.length}</b><span className="up">今日 {money(today.reduce((s, o) => s + o.total, 0))}</span></div>
        <div className="kpi"><small>客单价</small><b>{money(Math.round(aov))}</b><span className="up">▲ 6.2% 较上月</span></div>
        <div className="kpi"><small>会员总数</small><b>{state.customers.length}</b><span className="up">订阅 {state.customers.filter((c) => c.subscribed).length} 人</span></div>
      </div>
      <div className="dash-grid">
        <div>
          <div className="panel">
            <h3>近 7 天销售额</h3>
            <div className="chart">
              {days.map((d) => (
                <div className="col" key={d.label}>
                  <span className="val">{d.v ? `$${Math.round(d.v)}` : ""}</span>
                  <div className="bar-v" style={{ height: `${(d.v / max) * 82}%` }} />
                  <small>{d.label}</small>
                </div>
              ))}
            </div>
          </div>
          <div className="panel">
            <h3>最新订单 <Link to="/admin/orders" className="tag rose">待发货 {pending} 单 →</Link></h3>
            <div className="tbl-wrap">
              <table className="tbl">
                <thead><tr><th>订单号</th><th>客户</th><th className="hide-sm">时间</th><th>金额</th><th>状态</th></tr></thead>
                <tbody>{state.orders.slice(0, 6).map((o) => (
                  <tr key={o.id}><td>{o.id}</td><td>{o.name}</td><td className="hide-sm">{new Date(o.createdAt).toLocaleString("zh-CN", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })}</td><td>{money(o.total)}</td><td><OrderStatusTag s={o.status} /></td></tr>
                ))}</tbody>
              </table>
            </div>
          </div>
        </div>
        <div>
          <div className="panel">
            <h3>热销商品 TOP 5</h3>
            {top.map((p, i) => (
              <div className="rank" key={p.id}>
                <span className="n">{i + 1}</span>
                <span className="t"><ProductImage p={p} /></span>
                <span style={{ fontSize: 13 }}>{p.name}</span>
                <span style={{ fontSize: 12, color: "var(--muted)" }}>售 {p.sold}</span>
              </div>
            ))}
          </div>
          <div className="panel">
            <h3>库存预警 <span className="tag">{lowStock.length} 件</span></h3>
            {lowStock.length === 0 ? <p style={{ color: "var(--muted)", margin: 0 }}>库存充足</p> : lowStock.map((p) => (
              <Link to={`/admin/products/${p.id}`} key={p.id} className="sw-row" style={{ fontSize: 13 }}>
                <span>{p.name}</span><span className={`tag ${p.stock === 0 ? "rose" : ""}`}>{p.stock === 0 ? "已售罄" : `剩 ${p.stock}`}</span>
              </Link>
            ))}
          </div>
          <div className="panel">
            <h3>内容数据</h3>
            {[...state.posts].sort((a, b) => b.views - a.views).slice(0, 4).map((p) => (
              <div key={p.id} className="sw-row" style={{ fontSize: 13 }}>
                <span>{p.type === "video" ? "▶ " : ""}{p.title}</span><span style={{ color: "var(--muted)", whiteSpace: "nowrap" }}>{p.views.toLocaleString()} 阅读</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
