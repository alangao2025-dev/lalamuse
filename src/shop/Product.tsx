import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useStore } from "../store";
import { ProductImage } from "../components/Art";
import { IconHeart, IconReturn, IconShield, IconTruck } from "../components/Icons";
import { CATS } from "./Layout";
import { PostCard, PriceTag, ProductCard, useShopActions } from "./parts";
import type { Product } from "../types";

export default function ProductPage() {
  const { id } = useParams();
  const { state } = useStore();
  const p = state.products.find((x) => x.id === id && x.status === "active");
  if (!p) return <div className="container empty"><h3>This piece is no longer available</h3><Link className="btn" to="/shop" style={{ marginTop: 16 }}>Back to shop</Link></div>;
  return <ProductView key={p.id} p={p} />;
}

function ProductView({ p }: { p: Product }) {
  const { state } = useStore();
  const { addToCart, toggleWish, wished } = useShopActions();
  const [img, setImg] = useState(0);
  const [color, setColor] = useState(p.colors[0]?.name ?? "");
  const [size, setSize] = useState(p.sizes.length === 1 ? p.sizes[0] : "");
  const [needSize, setNeedSize] = useState(false);

  const colorHex = p.colors.find((c) => c.name === color)?.hex;
  const views = p.images.length > 0 ? p.images.length : Math.max(3, p.colors.length);
  const viewHex = (i: number) => (p.images.length ? undefined : i === 0 ? colorHex : p.colors[i % p.colors.length]?.hex);
  const related = state.products.filter((x) => x.status === "active" && x.id !== p.id && x.category !== p.category).slice(0, 4);
  const posts = state.posts.filter((x) => x.status === "published" && x.productIds.includes(p.id)).slice(0, 3);
  const cat = CATS.find((c) => c.id === p.category);
  const isClothing = p.category === "clothing";

  const add = () => {
    if (!size) { setNeedSize(true); return; }
    addToCart(p, color, size);
  };

  return (
    <div className="container">
      <div className="crumbs"><Link to="/">Home</Link> / <Link to={`/shop?cat=${p.category}`}>{cat?.label}</Link> / {p.name}</div>
      <div className="pdp">
        <div className="gallery">
          <div className="thumbs">
            {Array.from({ length: views }, (_, i) => (
              <button key={i} className={img === i ? "on" : ""} onClick={() => setImg(i)} aria-label={`View ${i + 1}`}>
                <ProductImage p={p} index={p.images.length ? i : 0} colorHex={viewHex(i)} />
              </button>
            ))}
          </div>
          <div className="main-img"><ProductImage p={p} index={p.images.length ? img : 0} colorHex={viewHex(img)} /></div>
        </div>

        <div className="pdp-info">
          <div className="eyebrow">{p.isNew ? "New arrival" : p.isBest ? "Bestseller" : cat?.label}</div>
          <h1>{p.name}</h1>
          <div className="row" style={{ justifyContent: "flex-start", gap: 16 }}>
            <PriceTag p={p} />
            <span className="stars">★★★★★</span><span style={{ fontSize: 12, color: "var(--muted)" }}>{Math.round(p.sold / 6)} reviews</span>
          </div>
          <p style={{ color: "var(--ink-2)", marginTop: 16 }}>{p.description}</p>

          {p.colors.length > 0 && (
            <div className="opt">
              <div className="opt-label"><span>Colour: <b>{color}</b></span></div>
              <div className="colors">
                {p.colors.map((c) => <button key={c.name} title={c.name} style={{ background: c.hex }} className={color === c.name ? "on" : ""} onClick={() => { setColor(c.name); setImg(0); }} />)}
              </div>
            </div>
          )}

          <div className="opt">
            <div className="opt-label"><span>Size{size && <>: <b>{size}</b></>}</span>{isClothing && <a href="#size-guide" className="link-u" style={{ fontSize: 11 }}>Size guide</a>}</div>
            <div className="sizes">{p.sizes.map((s) => <button key={s} className={size === s ? "on" : ""} onClick={() => { setSize(s); setNeedSize(false); }}>{s}</button>)}</div>
            {needSize && <div style={{ color: "var(--rose-deep)", fontSize: 13, marginTop: 8 }}>Please select a size</div>}
          </div>

          <div className={`stock ${p.stock <= 0 ? "out" : p.stock < 10 ? "low" : ""}`}>
            <i />{p.stock <= 0 ? "Sold out — back soon" : p.stock < 10 ? `Only ${p.stock} left — order soon` : "In stock, ships in 1–2 days"}
          </div>

          <div className="buy-row">
            <button className="btn" disabled={p.stock <= 0} onClick={add}>{p.stock <= 0 ? "Sold out" : "Add to bag"}</button>
            <button className="heart-btn" onClick={() => toggleWish(p.id)} aria-label="Wishlist"><IconHeart filled={wished(p.id)} /></button>
          </div>

          <div className="perks">
            <div><IconTruck /> Free worldwide shipping over ${state.settings.freeShipThreshold}</div>
            <div><IconReturn /> Free 30-day returns & exchanges</div>
            <div><IconShield /> Secure payment · Card, PayPal, Apple Pay</div>
          </div>

          <div style={{ marginTop: 18 }}>
            <details className="acc" open><summary>Details & care</summary><p>{p.material}</p></details>
            {isClothing && (
              <details className="acc" id="size-guide"><summary>Size guide</summary>
                <table className="size-table">
                  <thead><tr><th>Size</th><th>US</th><th>UK</th><th>EU</th><th>Bust (cm)</th><th>Waist (cm)</th></tr></thead>
                  <tbody>{[["XS", 2, 6, 34, 80, 62], ["S", 4, 8, 36, 84, 66], ["M", 6, 10, 38, 88, 70], ["L", 8, 12, 40, 93, 75], ["XL", 10, 14, 42, 98, 80]].map((r) => <tr key={r[0]}>{r.map((c, i) => <td key={i}>{c}</td>)}</tr>)}</tbody>
                </table>
              </details>
            )}
            <details className="acc"><summary>Shipping & returns</summary><p>Standard delivery 5–9 business days, express 2–4 days. Returns are free within 30 days of delivery for unworn items with tags.</p></details>
          </div>
        </div>
      </div>

      {posts.length > 0 && (
        <section className="section" style={{ paddingBottom: 0 }}>
          <div className="section-head"><div><div className="eyebrow">How to wear it</div><h2>Styled in the <span className="serif-i">Journal</span></h2></div></div>
          <div className="journal-grid">{posts.map((x) => <PostCard key={x.id} post={x} />)}</div>
        </section>
      )}

      <section className="section">
        <div className="section-head"><div><div className="eyebrow">Complete the look</div><h2>Pairs beautifully with</h2></div></div>
        <div className="grid">{related.map((x) => <ProductCard key={x.id} p={x} />)}</div>
      </section>
    </div>
  );
}
