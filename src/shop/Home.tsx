import { useState } from "react";
import { Link } from "react-router-dom";
import { money, useStore } from "../store";
import { Art, ProductImage } from "../components/Art";
import { IconReturn, IconShield, IconSpark, IconTruck } from "../components/Icons";
import { CATS } from "./Layout";
import { PostCard, ProductCard, useShopActions } from "./parts";
import type { ArtKind } from "../types";

const CAT_ART: Record<string, [ArtKind, string, [string, string]]> = {
  clothing: ["dress", "#E9C4BE", ["#F6E6E1", "#EED3CC"]],
  shoes: ["heels", "#F3EBDD", ["#EFE4DA", "#E1CDBE"]],
  bags: ["handbag", "#CDB9D8", ["#EFE6F1", "#DDCFE4"]],
  jewelry: ["earrings", "#D4B47C", ["#F5EEDF", "#E9DCC0"]],
  accessories: ["sunglasses", "#B97A7F", ["#F3E3DC", "#E6CBC6"]],
};

export default function Home() {
  const { state, toast } = useStore();
  const { addToCart } = useShopActions();
  const [email, setEmail] = useState("");
  const active = state.products.filter((p) => p.status === "active");
  const newIn = active.filter((p) => p.isNew).slice(0, 8);
  const best = [...active].sort((a, b) => b.sold - a.sold).slice(0, 4);
  const posts = state.posts.filter((p) => p.status === "published").slice(0, 3);
  const { settings } = state;
  const look = settings.look.productIds.map((id) => state.products.find((p) => p.id === id)).filter((p) => p && p.status === "active") as typeof active;
  const lookTotal = look.reduce((s, p) => s + p.price, 0);
  const hero = active.find((p) => p.id === "p1") ?? active[0];
  const hero2 = active.find((p) => p.id === "p11") ?? active[1];
  const [t1, ...tRest] = settings.heroTitle.split(",");

  return (
    <>
      <section className="hero">
        <div className="container hero-in">
          <div>
            <div className="eyebrow">New Season · Autumn Edit</div>
            <h1>{t1}{tRest.length > 0 && <>,<br /><em className="serif-i">{tRest.join(",").trim()}</em></>}</h1>
            <p>{settings.heroSubtitle}</p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "inherit" }}>
              <Link className="btn" to="/shop?sort=new">Shop New In</Link>
              <Link className="btn btn-ghost" to="/journal">Style Journal</Link>
            </div>
          </div>
          <div className="hero-visual">
            {hero && <Link to={`/product/${hero.id}`} className="hero-card a"><ProductImage p={hero} /></Link>}
            {hero2 && <Link to={`/product/${hero2.id}`} className="hero-card b"><ProductImage p={hero2} /></Link>}
            <div className="hero-tag">✦ Silk & Pearls Collection</div>
          </div>
        </div>
        <div className="hero-deco">Bloom</div>
      </section>

      <section className="section container">
        <div className="section-head"><div><div className="eyebrow">Shop by category</div><h2>Find your <span className="serif-i">signature</span></h2></div></div>
        <div className="cats">
          {CATS.map((c) => {
            const [k, col, bg] = CAT_ART[c.id];
            return <Link key={c.id} to={`/shop?cat=${c.id}`} className="cat"><div className="circle"><Art kind={k} color={col} bg={bg} /></div><span>{c.label}</span></Link>;
          })}
        </div>
      </section>

      <section className="container">
        <div className="section-head">
          <div><div className="eyebrow">Just landed</div><h2>New In</h2></div>
          <Link to="/shop?sort=new" className="link-u">View all</Link>
        </div>
        <div className="grid">{newIn.map((p, i) => <ProductCard key={p.id} p={p} delay={i * 60} />)}</div>
      </section>

      {look.length > 0 && (
        <section className="section container">
          <div className="look">
            <div className="look-visual" style={{ background: `linear-gradient(135deg, ${settings.look.palette[0]}, ${settings.look.palette[1]})` }}>
              {look.slice(0, 4).map((p) => <Link key={p.id} to={`/product/${p.id}`} className="tile"><ProductImage p={p} /></Link>)}
            </div>
            <div className="look-info">
              <div className="eyebrow">{settings.look.subtitle}</div>
              <h2>{settings.look.title}</h2>
              {look.map((p) => (
                <div key={p.id} className="look-item">
                  <Link to={`/product/${p.id}`} className="t"><ProductImage p={p} /></Link>
                  <Link to={`/product/${p.id}`}>{p.name}</Link>
                  <span className="price">{money(p.price)}</span>
                </div>
              ))}
              <button className="btn" style={{ marginTop: 26 }} onClick={() => { look.forEach((p) => addToCart(p, undefined, undefined, 1, false)); toast("The complete look is in your bag ✨"); }}>
                Add the look · {money(lookTotal)}
              </button>
            </div>
          </div>
        </section>
      )}

      <section className="container">
        <div className="section-head">
          <div><div className="eyebrow">Loved by you</div><h2>Bestsellers</h2></div>
          <Link to="/shop?sort=best" className="link-u">View all</Link>
        </div>
        <div className="grid">{best.map((p) => <ProductCard key={p.id} p={p} />)}</div>
      </section>

      <section className="section container">
        <div className="section-head">
          <div><div className="eyebrow">The Style Journal</div><h2>Notes on <span className="serif-i">dressing well</span></h2></div>
          <Link to="/journal" className="link-u">Read more</Link>
        </div>
        <div className="journal-grid">{posts.map((p) => <PostCard key={p.id} post={p} />)}</div>
      </section>

      <section className="container">
        <div className="values">
          <div><IconTruck size={26} /><span><b>Free shipping</b><small>On orders over {money(settings.freeShipThreshold)}</small></span></div>
          <div><IconReturn size={26} /><span><b>30-day returns</b><small>Easy & free exchanges</small></span></div>
          <div><IconShield size={26} /><span><b>Secure checkout</b><small>Card, PayPal, Apple Pay</small></span></div>
          <div><IconSpark size={26} /><span><b>Thoughtfully made</b><small>Quality fabrics, fair prices</small></span></div>
        </div>
      </section>

      <section className="section container">
        <div className="newsletter">
          <div className="eyebrow">Join the Muse list</div>
          <h2>10% off your <span className="serif-i">first order</span></h2>
          <p>Be first to see new collections, styling notes and private sales.</p>
          <form className="nl-form" onSubmit={(e) => { e.preventDefault(); if (!/^\S+@\S+\.\S+$/.test(email)) { toast("Please enter a valid email"); return; } toast("Welcome! Your code: BLOOM10"); setEmail(""); }}>
            <input type="email" placeholder="Your email address" value={email} onChange={(e) => setEmail(e.target.value)} />
            <button className="btn btn-rose">Subscribe</button>
          </form>
        </div>
      </section>
    </>
  );
}
