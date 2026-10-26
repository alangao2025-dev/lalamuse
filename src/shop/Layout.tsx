import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { cartTotals, money, useStore } from "../store";
import { ProductImage } from "../components/Art";
import { IconBag, IconBook, IconChevron, IconClose, IconGlobe, IconGrid, IconHeart, IconHome, IconMenu, IconMinus, IconPlus, IconSearch, IconUser } from "../components/Icons";
import { CAT_LABEL, useColorName, useLang } from "../i18n";
import type { Category } from "../types";

export const CATS = Object.keys(CAT_LABEL) as Category[];

export function useCatLabel() {
  const { lang } = useLang();
  return (c: Category) => CAT_LABEL[c][lang === "zh" ? 1 : 0];
}

export function LangSwitch({ className = "" }: { className?: string }) {
  const { lang, setLang } = useLang();
  return (
    <div className={`lang-switch ${className}`} role="group" aria-label="Language / 语言">
      <IconGlobe size={16} />
      <button className={lang === "en" ? "on" : ""} onClick={() => setLang("en")} aria-pressed={lang === "en"}>EN</button>
      <button className={lang === "zh" ? "on" : ""} onClick={() => setLang("zh")} aria-pressed={lang === "zh"}>中文</button>
    </div>
  );
}

function Logo() {
  return <Link to="/" className="logo">Muse <em>&amp;</em> Bloom</Link>;
}

function CartDrawer() {
  const { state, set, cartOpen, setCartOpen } = useStore();
  const { tr, pick } = useLang();
  const colorName = useColorName();
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
          <h3>{tr("Your Bag", "购物袋")} <span className="serif-i" style={{ color: "var(--muted)", fontSize: 18 }}>({lines.length})</span></h3>
          <button className="icon-btn" onClick={() => setCartOpen(false)} aria-label="Close"><IconClose /></button>
        </div>
        <div className="drawer-body">
          {lines.length === 0 ? (
            <div className="empty">
              <h3>{tr("Your bag is empty", "购物袋还是空的")}</h3>
              <p>{tr("Discover pieces you'll love wearing.", "去发现你会爱上的单品吧。")}</p>
              <button className="btn" style={{ marginTop: 18 }} onClick={() => { setCartOpen(false); nav("/shop"); }}>{tr("Start shopping", "去逛逛")}</button>
            </div>
          ) : (
            <>
              <div className="ship-progress">
                {left > 0
                  ? tr(<>You're <b>{money(left)}</b> away from free shipping</>, <>再买 <b>{money(left)}</b> 即可享受免运费</>)
                  : tr(<>✨ You've unlocked <b>free shipping</b></>, <>✨ 已享受 <b>免运费</b></>)}
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
                        <h4>{pick(l.product, "name")}</h4>
                        <span className="price">{money(l.product.price * l.qty)}</span>
                      </div>
                      <div className="meta">{colorName(l.color)} · {l.size}</div>
                      <div className="row" style={{ marginTop: 10 }}>
                        <div className="qty">
                          <button onClick={() => setQty(i, l.qty - 1)} aria-label="Decrease"><IconMinus size={14} /></button>
                          <span>{l.qty}</span>
                          <button onClick={() => setQty(i, l.qty + 1)} aria-label="Increase"><IconPlus size={14} /></button>
                        </div>
                        <button className="meta" style={{ textDecoration: "underline" }} onClick={() => setQty(i, 0)}>{tr("Remove", "移除")}</button>
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
            <div className="row" style={{ marginBottom: 4 }}><span>{tr("Subtotal", "小计")}</span><span className="price">{money(subtotal)}</span></div>
            <p style={{ fontSize: 12, color: "var(--muted)", margin: "0 0 14px" }}>{tr("Shipping & discounts calculated at checkout.", "运费和优惠在结账时计算。")}</p>
            <button className="btn btn-block" onClick={() => { setCartOpen(false); nav("/checkout"); }}>{tr("Checkout", "去结账")} · {money(subtotal)}</button>
          </div>
        )}
      </aside>
    </>
  );
}

function MobileMenu({ onClose }: { onClose: () => void }) {
  const { tr } = useLang();
  const cat = useCatLabel();
  const nav = useNavigate();
  const [q, setQ] = useState("");
  return (
    <>
      <div className="overlay" onClick={onClose} />
      <aside className="drawer left">
        <div className="drawer-head"><Logo /><button className="icon-btn" onClick={onClose} aria-label="Close"><IconClose /></button></div>
        <div className="drawer-body">
          <div className="menu-lang"><span>{tr("Language", "语言")}</span><LangSwitch /></div>
          <form className="menu-search" onSubmit={(e) => { e.preventDefault(); onClose(); nav(`/shop?q=${encodeURIComponent(q)}`); }}>
            <IconSearch size={18} /><input placeholder={tr("Search", "搜索商品")} value={q} onChange={(e) => setQ(e.target.value)} />
          </form>
          <div className="mobile-links" onClick={onClose}>
            <Link to="/shop">{tr("Shop All", "全部商品")} <IconChevron /></Link>
            {CATS.map((c) => <Link key={c} to={`/shop?cat=${c}`}>{cat(c)} <IconChevron /></Link>)}
            <Link to="/journal">{tr("Style Journal", "穿搭知识")} <IconChevron /></Link>
            <Link to="/account">{tr("My Account", "我的账户")} <IconChevron /></Link>
          </div>
        </div>
        <div className="drawer-foot" style={{ fontSize: 13, color: "var(--ink-2)" }}>{tr("Need help?", "需要帮助？")} hello@museandbloom.com</div>
      </aside>
    </>
  );
}

export default function ShopLayout() {
  const { state, setCartOpen, toastMsg } = useStore();
  const { tr, lang } = useLang();
  const cat = useCatLabel();
  const announcement = lang === "zh" ? state.settings.zh.announcement || state.settings.announcement : state.settings.announcement;
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
      {announcement && <div className="announce">{announcement}</div>}
      <header className="header">
        <div className="container header-in">
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <button className="icon-btn menu-btn" onClick={() => setMenu(true)} aria-label="Menu"><IconMenu /></button>
            <nav className="nav">
              {[["/shop", tr("Shop", "商城")], ["/shop?cat=clothing", cat("clothing")], ["/shop?cat=bags", cat("bags")], ["/shop?cat=jewelry", cat("jewelry")], ["/journal", tr("Journal", "穿搭知识")]].map(([to, label]) => (
                <Link key={to} to={to} className={loc.pathname + loc.search === to ? "active" : ""}>{label}</Link>
              ))}
            </nav>
          </div>
          <Logo />
          <div className="header-actions">
            <LangSwitch />
            <button className="icon-btn hide-xs" onClick={() => setSearch((v) => !v)} aria-label="Search"><IconSearch /></button>
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
            <div className="container"><input autoFocus placeholder={tr("Search dresses, pearls, tote bags…", "搜索连衣裙、珍珠、托特包…")} value={q} onChange={(e) => setQ(e.target.value)} /></div>
          </form>
        )}
      </header>

      <main><Outlet /></main>

      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <Logo />
              <p style={{ color: "var(--ink-2)", maxWidth: 320, marginTop: 14 }}>{tr("Softly feminine pieces and honest styling advice — for women who dress to feel like themselves.", "温柔有女人味的单品与真诚的穿搭建议——献给为自己而穿的你。")}</p>
              <div className="socials"><a href="#" aria-label="Instagram">IG</a><a href="#" aria-label="TikTok">TT</a><a href="#" aria-label="Pinterest">PIN</a><a href="#" aria-label="YouTube">YT</a></div>
            </div>
            <div><h4>{tr("Shop", "商城")}</h4><ul>{CATS.map((c) => <li key={c}><Link to={`/shop?cat=${c}`}>{cat(c)}</Link></li>)}</ul></div>
            <div><h4>{tr("Journal", "穿搭知识")}</h4><ul>{[["Styling Tips", "穿搭技巧"], ["Trend Report", "流行趋势"], ["Video Lookbooks", "视频穿搭"], ["Care Guide", "保养指南"]].map(([en, zh]) => <li key={en}><Link to="/journal">{tr(en, zh)}</Link></li>)}</ul></div>
            <div><h4>{tr("Help", "帮助")}</h4><ul>{[["Shipping & Delivery", "配送说明"], ["Returns & Exchanges", "退换货政策"], ["Size Guide", "尺码指南"], ["Contact Us", "联系我们"], ["Privacy Policy", "隐私政策"]].map(([en, zh]) => <li key={en}>{tr(en, zh)}</li>)}</ul></div>
          </div>
          <div className="copy">
            <span>© {new Date().getFullYear()} Muse & Bloom. {tr("All rights reserved.", "保留所有权利。")}</span>
            <div className="pay-icons"><span>VISA</span><span>Mastercard</span><span>AMEX</span><span>PayPal</span><span>Apple Pay</span><span>G Pay</span></div>
          </div>
        </div>
      </footer>

      <nav className="tabbar">
        <NavLink to="/" end><IconHome size={21} />{tr("Home", "首页")}</NavLink>
        <NavLink to="/shop"><IconGrid size={21} />{tr("Shop", "商城")}</NavLink>
        <NavLink to="/journal"><IconBook size={21} />{tr("Journal", "穿搭")}</NavLink>
        <NavLink to="/account" end={false}><IconHeart size={21} />{tr("Me", "我的")}</NavLink>
        <button onClick={() => setCartOpen(true)}><IconBag size={21} />{tr("Bag", "购物袋")}{count > 0 && <span className="badge">{count}</span>}</button>
      </nav>

      <CartDrawer />
      {menu && <MobileMenu onClose={() => setMenu(false)} />}
      {cookie && (
        <div className="cookie">
          {tr("We use cookies to personalise your experience and analyse traffic.", "我们使用 Cookie 来优化你的浏览体验并分析流量。")}
          <div className="row"><button className="btn" onClick={acceptCookie}>{tr("Accept", "接受")}</button><button className="btn btn-ghost" onClick={acceptCookie}>{tr("Essential only", "仅必要")}</button></div>
        </div>
      )}
      {!cookie && <Link to="/admin" className="proto-badge">原型 · 进入管理后台 →</Link>}
      {toastMsg && <div className="toast">{toastMsg}</div>}
    </>
  );
}
