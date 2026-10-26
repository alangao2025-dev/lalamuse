import { useState } from "react";
import { useStore } from "../store";
import { ProductImage } from "../components/Art";
import { IconPlus, IconTrash } from "../components/Icons";
import type { Settings as S } from "../types";

export default function Settings() {
  const { state, set, reset, toast } = useStore();
  const [f, setF] = useState<S>(state.settings);
  const [code, setCode] = useState("");
  const [pct, setPct] = useState(10);
  const up = <K extends keyof S>(k: K, v: S[K]) => setF((x) => ({ ...x, [k]: v }));
  const save = () => { set((s) => ({ ...s, settings: f })); toast("设置已保存，前台已同步"); };
  const lookIds = f.look.productIds;

  return (
    <>
      <div className="form-grid">
        <div>
          <div className="panel">
            <h3>首页配置</h3>
            <div className="f"><label>顶部公告条</label><input className="a-input" value={f.announcement} onChange={(e) => up("announcement", e.target.value)} /><span className="hint">留空则不显示</span></div>
            <div className="f"><label>首屏大标题</label><input className="a-input" value={f.heroTitle} onChange={(e) => up("heroTitle", e.target.value)} /><span className="hint">逗号后的部分会以斜体花体显示</span></div>
            <div className="f"><label>首屏副标题</label><input className="a-input" value={f.heroSubtitle} onChange={(e) => up("heroSubtitle", e.target.value)} /></div>
          </div>
          <div className="panel">
            <h3>Shop the Look 整套搭配 <span style={{ fontSize: 12, color: "var(--muted)" }}>已选 {lookIds.length} 件</span></h3>
            <div className="f2">
              <div className="f"><label>专题标题</label><input className="a-input" value={f.look.title} onChange={(e) => up("look", { ...f.look, title: e.target.value })} /></div>
              <div className="f"><label>小标题</label><input className="a-input" value={f.look.subtitle} onChange={(e) => up("look", { ...f.look, subtitle: e.target.value })} /></div>
            </div>
            <div className="pick-list">
              {state.products.filter((p) => p.status === "active").map((p) => (
                <label key={p.id}>
                  <input type="checkbox" checked={lookIds.includes(p.id)} onChange={() => up("look", { ...f.look, productIds: lookIds.includes(p.id) ? lookIds.filter((i) => i !== p.id) : [...lookIds, p.id] })} />
                  <span className="t"><ProductImage p={p} /></span>{p.name}
                </label>
              ))}
            </div>
          </div>
        </div>
        <div>
          <div className="panel">
            <h3>运费</h3>
            <div className="f3">
              <div className="f"><label>免运费门槛 $</label><input className="a-input" type="number" min="0" value={f.freeShipThreshold} onChange={(e) => up("freeShipThreshold", Number(e.target.value))} /></div>
              <div className="f"><label>标准运费 $</label><input className="a-input" type="number" min="0" value={f.standardShip} onChange={(e) => up("standardShip", Number(e.target.value))} /></div>
              <div className="f"><label>加急运费 $</label><input className="a-input" type="number" min="0" value={f.expressShip} onChange={(e) => up("expressShip", Number(e.target.value))} /></div>
            </div>
          </div>
          <div className="panel">
            <h3>支付方式</h3>
            {([["card", "信用卡 / 借记卡（Stripe）"], ["paypal", "PayPal"], ["applepay", "Apple Pay / Google Pay"]] as const).map(([k, l]) => (
              <div className="sw-row" key={k}><span>{l}</span><button className={`switch ${f.payments[k] ? "on" : ""}`} aria-label={l}
                onClick={() => { const n = { ...f.payments, [k]: !f.payments[k] }; if (!Object.values(n).some(Boolean)) { toast("至少保留一种支付方式"); return; } up("payments", n); }} /></div>
            ))}
            <p className="hint" style={{ fontSize: 12, color: "var(--muted)", marginBottom: 0 }}>正式版在此填写 Stripe / PayPal 的 API 密钥（加密保存）。</p>
          </div>
          <div className="panel">
            <h3>优惠码</h3>
            {f.coupons.map((c, i) => (
              <div className="sw-row" key={c.code}><span><b style={{ fontWeight: 500 }}>{c.code}</b> · {c.percent}% off</span>
                <button className="a-btn danger sm" onClick={() => up("coupons", f.coupons.filter((_, j) => j !== i))} aria-label="删除"><IconTrash size={14} /></button></div>
            ))}
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <input className="a-input" placeholder="代码，如 SUMMER20" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} />
              <input className="a-input" type="number" min="1" max="90" style={{ width: 80 }} value={pct} onChange={(e) => setPct(Number(e.target.value))} />
              <button className="a-btn ghost" onClick={() => {
                if (!/^[A-Z0-9]{3,20}$/.test(code) || pct < 1 || pct > 90) { toast("代码需 3–20 位字母数字，折扣 1–90%"); return; }
                if (f.coupons.some((c) => c.code === code)) { toast("优惠码已存在"); return; }
                up("coupons", [...f.coupons, { code, percent: pct }]); setCode("");
              }}><IconPlus size={14} />添加</button>
            </div>
          </div>
          <div className="panel">
            <h3>原型数据</h3>
            <p style={{ fontSize: 13, color: "var(--ink-2)", marginTop: 0 }}>原型的数据保存在当前浏览器中。恢复后，所有商品、内容、订单回到初始示例。</p>
            <button className="a-btn danger" onClick={() => { if (confirm("确定恢复示例数据？你添加的商品、内容和订单都会被清除")) { reset(); setTimeout(() => location.reload(), 100); } }}>恢复示例数据</button>
          </div>
        </div>
      </div>
      <div className="sticky-save"><button className="a-btn rose" onClick={save}>保存设置</button></div>
    </>
  );
}
