import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useStore } from "../store";
import { ProductImage } from "../components/Art";
import { IconHeart, IconReturn, IconShield, IconTruck } from "../components/Icons";
import { useCatLabel } from "./Layout";
import { useColorName, useLang } from "../i18n";
import { PostCard, PriceTag, ProductCard, useShopActions } from "./parts";
import type { Product } from "../types";

export default function ProductPage() {
  const { id } = useParams();
  const { state } = useStore();
  const { tr } = useLang();
  const p = state.products.find((x) => x.id === id && x.status === "active");
  if (!p) return <div className="container empty"><h3>{tr("This piece is no longer available", "该商品已下架")}</h3><Link className="btn" to="/shop" style={{ marginTop: 16 }}>{tr("Back to shop", "返回商城")}</Link></div>;
  return <ProductView key={p.id} p={p} />;
}

function ProductView({ p }: { p: Product }) {
  const { state } = useStore();
  const { addToCart, toggleWish, wished } = useShopActions();
  const { tr, pick } = useLang();
  const catLabel = useCatLabel();
  const colorName = useColorName();
  const [img, setImg] = useState(0);
  const [color, setColor] = useState(p.colors[0]?.name ?? "");
  const [size, setSize] = useState(p.sizes.length === 1 ? p.sizes[0] : "");
  const [needSize, setNeedSize] = useState(false);

  const colorHex = p.colors.find((c) => c.name === color)?.hex;
  const views = p.images.length > 0 ? p.images.length : Math.max(3, p.colors.length);
  const viewHex = (i: number) => (p.images.length ? undefined : i === 0 ? colorHex : p.colors[i % p.colors.length]?.hex);
  const related = state.products.filter((x) => x.status === "active" && x.id !== p.id && x.category !== p.category).slice(0, 4);
  const posts = state.posts.filter((x) => x.status === "published" && x.productIds.includes(p.id)).slice(0, 3);
  const isClothing = p.category === "clothing";

  const add = () => {
    if (!size) { setNeedSize(true); return; }
    addToCart(p, color, size);
  };

  return (
    <div className="container">
      <div className="crumbs"><Link to="/">{tr("Home", "首页")}</Link> / <Link to={`/shop?cat=${p.category}`}>{catLabel(p.category)}</Link> / {pick(p, "name")}</div>
      <div className="pdp">
        <div className={`gallery ${views <= 1 ? "single" : ""}`}>
          {views > 1 && <div className="thumbs">
            {Array.from({ length: views }, (_, i) => (
              <button key={i} className={img === i ? "on" : ""} onClick={() => setImg(i)} aria-label={tr(`View ${i + 1}`, `图 ${i + 1}`)}>
                <ProductImage p={p} index={p.images.length ? i : 0} colorHex={viewHex(i)} />
              </button>
            ))}
          </div>}
          <div className="main-img"><ProductImage p={p} index={p.images.length ? img : 0} colorHex={viewHex(img)} /></div>
        </div>

        <div className="pdp-info">
          <div className="eyebrow">{p.isNew ? tr("New arrival", "新品上市") : p.isBest ? tr("Bestseller", "热卖单品") : catLabel(p.category)}</div>
          <h1>{pick(p, "name")}</h1>
          <div className="row" style={{ justifyContent: "flex-start", gap: 16 }}>
            <PriceTag p={p} />
            <span className="stars">★★★★★</span><span style={{ fontSize: 12, color: "var(--muted)" }}>{tr(`${Math.round(p.sold / 6)} reviews`, `${Math.round(p.sold / 6)} 条评价`)}</span>
          </div>
          <p style={{ color: "var(--ink-2)", marginTop: 16 }}>{pick(p, "description")}</p>

          {p.colors.length > 0 && (
            <div className="opt">
              <div className="opt-label"><span>{tr("Colour", "颜色")}: <b>{colorName(color)}</b></span></div>
              <div className="colors">
                {p.colors.map((c) => <button key={c.name} title={colorName(c.name)} style={{ background: c.hex }} className={color === c.name ? "on" : ""} onClick={() => { setColor(c.name); setImg(0); }} />)}
              </div>
            </div>
          )}

          <div className="opt">
            <div className="opt-label"><span>{tr("Size", "尺码")}{size && <>: <b>{size}</b></>}</span>{isClothing && <a href="#size-guide" className="link-u" style={{ fontSize: 11 }}>{tr("Size guide", "尺码表")}</a>}</div>
            <div className="sizes">{p.sizes.map((s) => <button key={s} className={size === s ? "on" : ""} onClick={() => { setSize(s); setNeedSize(false); }}>{s}</button>)}</div>
            {needSize && <div style={{ color: "var(--rose-deep)", fontSize: 13, marginTop: 8 }}>{tr("Please select a size", "请选择尺码")}</div>}
          </div>

          <div className={`stock ${p.stock <= 0 ? "out" : p.stock < 10 ? "low" : ""}`}>
            <i />{p.stock <= 0 ? tr("Sold out — back soon", "已售罄，即将补货") : p.stock < 10 ? tr(`Only ${p.stock} left — order soon`, `仅剩 ${p.stock} 件，欲购从速`) : tr("In stock, ships in 1–2 days", "现货，1–2 天内发货")}
          </div>

          <div className="buy-row">
            <button className="btn" disabled={p.stock <= 0} onClick={add}>{p.stock <= 0 ? tr("Sold out", "已售罄") : tr("Add to bag", "加入购物袋")}</button>
            <button className="heart-btn" onClick={() => toggleWish(p.id)} aria-label="Wishlist"><IconHeart filled={wished(p.id)} /></button>
          </div>

          <div className="perks">
            <div><IconTruck /> {tr(`Free worldwide shipping over $${state.settings.freeShipThreshold}`, `订单满 $${state.settings.freeShipThreshold} 全球免运费`)}</div>
            <div><IconReturn /> {tr("Free 30-day returns & exchanges", "30 天免费退换")}</div>
            <div><IconShield /> {tr("Secure payment · Card, PayPal, Apple Pay", "安全支付 · 信用卡、PayPal、Apple Pay")}</div>
          </div>

          <div style={{ marginTop: 18 }}>
            <details className="acc" open><summary>{tr("Details & care", "材质与护理")}</summary><p>{pick(p, "material")}</p></details>
            {isClothing && (
              <details className="acc" id="size-guide"><summary>{tr("Size guide", "尺码表")}</summary>
                <table className="size-table">
                  <thead><tr><th>{tr("Size", "尺码")}</th><th>US</th><th>UK</th><th>EU</th><th>{tr("Bust (cm)", "胸围 (cm)")}</th><th>{tr("Waist (cm)", "腰围 (cm)")}</th></tr></thead>
                  <tbody>{[["XS", 2, 6, 34, 80, 62], ["S", 4, 8, 36, 84, 66], ["M", 6, 10, 38, 88, 70], ["L", 8, 12, 40, 93, 75], ["XL", 10, 14, 42, 98, 80]].map((r) => <tr key={r[0]}>{r.map((c, i) => <td key={i}>{c}</td>)}</tr>)}</tbody>
                </table>
              </details>
            )}
            <details className="acc"><summary>{tr("Shipping & returns", "配送与退换")}</summary><p>{tr("Standard delivery 5–9 business days, express 2–4 days. Returns are free within 30 days of delivery for unworn items with tags.", "标准配送 5–9 个工作日，加急 2–4 个工作日。签收后 30 天内，未穿着且吊牌完好的商品可免费退货。")}</p></details>
          </div>
        </div>
      </div>

      {posts.length > 0 && (
        <section className="section" style={{ paddingBottom: 0 }}>
          <div className="section-head"><div><div className="eyebrow">{tr("How to wear it", "怎么穿")}</div><h2>{tr(<>Styled in the <span className="serif-i">Journal</span></>, <>在<span className="serif-i">穿搭知识</span>里看搭配</>)}</h2></div></div>
          <div className="journal-grid">{posts.map((x) => <PostCard key={x.id} post={x} />)}</div>
        </section>
      )}

      <section className="section">
        <div className="section-head"><div><div className="eyebrow">{tr("Complete the look", "完成整套造型")}</div><h2>{tr("Pairs beautifully with", "搭配推荐")}</h2></div></div>
        <div className="grid">{related.map((x) => <ProductCard key={x.id} p={x} />)}</div>
      </section>
    </div>
  );
}
