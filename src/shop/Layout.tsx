import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { cartTotals, money, useStore } from "../store";
import { ProductImage } from "../components/Art";
import { IconBag, IconBook, IconChevron, IconClose, IconGrid, IconHeart, IconHome, IconMenu, IconMinus, IconPlus, IconSearch, IconUser } from "../components/Icons";
import type { Category } from "../types";

export const CATS: { id: Category; label: string }[] = [
  { id: "clothing", label: "Clothing" },
  { id: "shoes", label: "Shoes" },
  { id: "bags", label: "Bags" },
  { id: "jewelry", label: "Jewelry" },
  { id: "accessories", label: "Accessories" },
];

function Logo() {
  return <Link to="/" className="logo">Muse <em>&amp;</em> Bloom</Link>;
}

function CartDrawer() {
  const { state, set, cartOpen, setCartOpen } = useStore();
  const nav = useNavigate();
  const { lines, subtotal } = cartTotals(state);
  const left = state.settings.freeShipThreshold - subtotal;
  if (!cartOpen) return null;
  const setQty = (i: number, q: number) =>
    set((s) => ({ ...s, cart: q <= 0 ? s.cart.filter((_, j) => j !== i) : s.cart.map((c, j) => (j === i ? { ...c, qty: q } : c)) }));
  return (
    <>
      <div className="overlay" onClick={() => setCartOpen(false)} />
      <aside className="drawer right" aria-label="Shopping bag">
        <div className="drawer-head">
          <h3>Your Bag <span className="serif-i" style={{ color: "var(--muted)", fontSize: 18 }}>({lines.length})</span></h3>
          <button className="icon-btn" onClick={() => setCartOpen(false)} aria-label="Close"><IconClose /></button>
        </div>
        <div className="drawer-body">
          {lines.length === 0 ? (
            <div className="empty">
              <h3>Your bag is empty</h3>
              <p>Discover pieces you'll love wearing.</p>
              <button className="btn" style={{ marginTop: 18 }} onClick={() => { setCartOpen(false); nav("/shop"); }}>Start shopping</button>
            </div>
          ) : (
            <>
              <div className="ship-progress">
                {left > 0 ? <>You're <b>{money(left)}</b> away from free shipping</> : <>✨ You've unlocked <b>free shipping</b></>}
                <div className="bar"><i style={{ width: `${Math.min(100, (subtotal / state.settings.freeShipThreshold) * 100)}%` }} /></div>
              </div>
              {lines.map((l, i) => {
                const color = l.product.colors.find((c) => c.name === l.color);
                return (
                  <div className="cart-line" key={i}>
                    <Link to={`/product/${l.product.id}`} className="thumb" onClick={() => setCartOpen(false)}>
                      <ProductImage p={l.product} colorHex={color?.hex} />
                    </Link>
                    <div>
                      <div className="row" style={{ alignItems: "start" }}>
                        <h4>{l.product.name}</h4>
                        <span className="price">{money(l.product.price * l.qty)}</span>
                      </div>
                      <div className="meta">{l.color} · {l.size}</div>
                      <div className="row" style={{ marginTop: 10 }}>
                        <div className="qty">
                          <button onClick={() => setQty(i, l.qty - 1)} aria-label="Decrease"><IconMinus size={14} /></button>
                          <span>{l.qty}</span>
                          <button onClick={() => setQty(i, l.qty + 1)} aria-label="Increase"><IconPlus size={14} /></button>
                        </div>
                        <button className="meta" style={{ textDecoration: "underline" }} onClick={() => setQty(i, 0)}>Remove</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
        {lines.length > 0 && (
          <div className="drawer-foot">
            <div className="row" style={{ marginBottom: 4 }}><span>Subtotal</span><span className="price">{money(subtotal)}</span></div>
            <p style={{ fontSize: 12, color: "var(--muted)", margin: "0 0 14px" }}>Shipping & discounts calculated at checkout.</p>
            <button className="btn btn-block" onClick={() => { setCartOpen(false); nav("/checkout"); }}>Checkout · {money(subtotal)}</button>
          </div>
        )}
      </aside>
    </>
  );
}

function MobileMenu({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="overlay" onClick={onClose} />
      <aside className="drawer left">
        <div className="drawer-head"><Logo /><button className="icon-btn" onClick={onClose} aria-label="Close"><IconClose /></button></div>
        <div className="drawer-body mobile-links" onClick={onClose}>
          <Link to="/shop">Shop All <IconChevron /></Link>
          {CATS.map((c) => <Link key={c.id} to={`/shop?cat=${c.id}`}>{c.label} <IconChevron /></Link>)}
          <Link to="/journal">Style Journal <IconChevron /></Link>
          <Link to="/account">My Account <IconChevron /></Link>
        </div>
        <div className="drawer-foot" style={{ fontSize: 13, color: "var(--ink-2)" }}>Need help? hello@museandbloom.com</div>
      </aside>
    </>
  );
}

export default function ShopLayout() {
  const { state, setCartOpen, toastMsg } = useStore();
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const [q, setQ] = useState("");
  const [cookie, setCookie] = useState(() => !localStorage.getItem("mb-cookie"));
  const loc = useLocation();
  const nav = useNavigate();
  const count = state.cart.reduce((s, c) => s + c.qty, 0);

  useEffect(() => { window.scrollTo(0, 0); setSearch(false); }, [loc.pathname]);

  const acceptCookie = () => { localStorage.setItem("mb-cookie", "1"); setCookie(false); };

  return (
    <>
      {state.settings.announcement && <div className="announce">{state.settings.announcement}</div>}
      <header className="header">
        <div className="container header-in">
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <button className="icon-btn menu-btn" onClick={() => setMenu(true)} aria-label="Menu"><IconMenu /></button>
            <nav className="nav">
              {[["/shop", "Shop"], ["/shop?cat=clothing", "Clothing"], ["/shop?cat=bags", "Bags"], ["/shop?cat=jewelry", "Jewelry"], ["/journal", "Journal"]].map(([to, label]) => (
                <Link key={to} to={to} className={loc.pathname + loc.search === to ? "active" : ""}>{label}</Link>
              ))}
            </nav>
          </div>
          <Logo />
          <div className="header-actions">
            <button className="icon-btn" onClick={() => setSearch((v) => !v)} aria-label="Search"><IconSearch /></button>
            <Link className="icon-btn hide-m" to="/account" aria-label="Account"><IconUser /></Link>
            <Link className="icon-btn hide-m" to="/account?tab=wishlist" aria-label="Wishlist">
              <IconHeart />{state.wishlist.length > 0 && <span className="badge">{state.wishlist.length}</span>}
            </Link>
            <button className="icon-btn" onClick={() => setCartOpen(true)} aria-label="Bag">
              <IconBag />{count > 0 && <span className="badge">{count}</span>}
            </button>
          </div>
        </div>
        {search && (
          <form className="search-bar" onSubmit={(e) => { e.preventDefault(); nav(`/shop?q=${encodeURIComponent(q)}`); }}>
            <div className="container"><input autoFocus placeholder="Search dresses, pearls, tote bags…" value={q} onChange={(e) => setQ(e.target.value)} /></div>
          </form>
        )}
      </header>

      <main><Outlet /></main>

      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <Logo />
              <p style={{ color: "var(--ink-2)", maxWidth: 320, marginTop: 14 }}>Softly feminine pieces and honest styling advice — for women who dress to feel like themselves.</p>
              <div className="socials"><a href="#" aria-label="Instagram">IG</a><a href="#" aria-label="TikTok">TT</a><a href="#" aria-label="Pinterest">PIN</a><a href="#" aria-label="YouTube">YT</a></div>
            </div>
            <div><h4>Shop</h4><ul>{CATS.map((c) => <li key={c.id}><Link to={`/shop?cat=${c.id}`}>{c.label}</Link></li>)}</ul></div>
            <div><h4>Journal</h4><ul><li><Link to="/journal">Styling Tips</Link></li><li><Link to="/journal">Trend Report</Link></li><li><Link to="/journal">Video Lookbooks</Link></li><li><Link to="/journal">Care Guide</Link></li></ul></div>
            <div><h4>Help</h4><ul><li>Shipping & Delivery</li><li>Returns & Exchanges</li><li>Size Guide</li><li>Contact Us</li><li>Privacy Policy</li></ul></div>
          </div>
          <div className="copy">
            <span>© {new Date().getFullYear()} Muse & Bloom. All rights reserved.</span>
            <div className="pay-icons"><span>VISA</span><span>Mastercard</span><span>AMEX</span><span>PayPal</span><span>Apple Pay</span><span>G Pay</span></div>
          </div>
        </div>
      </footer>

      <nav className="tabbar">
        <NavLink to="/" end><IconHome size={21} />Home</NavLink>
        <NavLink to="/shop"><IconGrid size={21} />Shop</NavLink>
        <NavLink to="/journal"><IconBook size={21} />Journal</NavLink>
        <NavLink to="/account" end={false}><IconHeart size={21} />Me</NavLink>
        <button onClick={() => setCartOpen(true)}><IconBag size={21} />Bag{count > 0 && <span className="badge">{count}</span>}</button>
      </nav>

      <CartDrawer />
      {menu && <MobileMenu onClose={() => setMenu(false)} />}
      {cookie && (
        <div className="cookie">
          We use cookies to personalise your experience and analyse traffic.
          <div className="row"><button className="btn" onClick={acceptCookie}>Accept</button><button className="btn btn-ghost" onClick={acceptCookie}>Essential only</button></div>
        </div>
      )}
      {!cookie && <Link to="/admin" className="proto-badge">原型 · 进入管理后台 →</Link>}
      {toastMsg && <div className="toast">{toastMsg}</div>}
    </>
  );
}
