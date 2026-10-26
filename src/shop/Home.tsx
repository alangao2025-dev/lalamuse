import { useState } from "react";
import { Link } from "react-router-dom";
import { money, useStore } from "../store";
import { Art, ProductImage } from "../components/Art";
import { IconReturn, IconShield, IconSpark, IconTruck } from "../components/Icons";
import { CATS, useCatLabel } from "./Layout";
import { useLang } from "../i18n";
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
  const { tr, pick, lang } = useLang();
  const catLabel = useCatLabel();
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
  const zh = lang === "zh";
  const heroTitle = (zh && settings.zh.heroTitle) || settings.heroTitle;
  const heroSubtitle = (zh && settings.zh.heroSubtitle) || settings.heroSubtitle;
  const lookTitle = (zh && settings.zh.lookTitle) || settings.look.title;
  const lookSubtitle = (zh && settings.zh.lookSubtitle) || settings.look.subtitle;
  const [t1, ...tRest] = heroTitle.split(/[,，]/);

  return (
    <>
      <section className="hero">
        <div className="container hero-in">
          <div>
            <div className="eyebrow">{tr("New Season · Autumn Edit", "新季 · 秋日精选")}</div>
            <h1>{t1}{tRest.length > 0 && <>{zh ? "，" : ","}<br /><em className="serif-i">{tRest.join(",").trim()}</em></>}</h1>
            <p>{heroSubtitle}</p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "inherit" }}>
              <Link className="btn" to="/shop?sort=new">{tr("Shop New In", "选购新品")}</Link>
              <Link className="btn btn-ghost" to="/journal">{tr("Style Journal", "穿搭知识")}</Link>
            </div>
          </div>
          <div className="hero-visual">
            {hero && <Link to={`/product/${hero.id}`} className="hero-card a"><ProductImage p={hero} /></Link>}
            {hero2 && <Link to={`/product/${hero2.id}`} className="hero-card b"><ProductImage p={hero2} /></Link>}
            <div className="hero-tag">✦ {tr("Silk & Pearls Collection", "真丝与珍珠系列")}</div>
          </div>
        </div>
        <div className="hero-deco">Bloom</div>
      </section>

      <section className="section container">
        <div className="section-head"><div><div className="eyebrow">{tr("Shop by category", "按分类选购")}</div><h2>{tr(<>Find your <span className="serif-i">signature</span></>, <>找到你的<span className="serif-i">专属风格</span></>)}</h2></div></div>
        <div className="cats">
          {CATS.map((c) => {
            const [k, col, bg] = CAT_ART[c];
            return <Link key={c} to={`/shop?cat=${c}`} className="cat"><div className="circle"><Art kind={k} color={col} bg={bg} /></div><span>{catLabel(c)}</span></Link>;
          })}
        </div>
      </section>

      <section className="container">
        <div className="section-head">
          <div><div className="eyebrow">{tr("Just landed", "刚刚上新")}</div><h2>{tr("New In", "新品上市")}</h2></div>
          <Link to="/shop?sort=new" className="link-u">{tr("View all", "查看全部")}</Link>
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
              <div className="eyebrow">{lookSubtitle}</div>
              <h2>{lookTitle}</h2>
              {look.map((p) => (
                <div key={p.id} className="look-item">
                  <Link to={`/product/${p.id}`} className="t"><ProductImage p={p} /></Link>
                  <Link to={`/product/${p.id}`}>{pick(p, "name")}</Link>
                  <span className="price">{money(p.price)}</span>
                </div>
              ))}
              <button className="btn" style={{ marginTop: 26 }} onClick={() => { look.forEach((p) => addToCart(p, undefined, undefined, 1, false)); toast(tr("The complete look is in your bag ✨", "整套造型已加入购物袋 ✨")); }}>
                {tr("Add the look", "一键购齐整套")} · {money(lookTotal)}
              </button>
            </div>
          </div>
        </section>
      )}

      <section className="container">
        <div className="section-head">
          <div><div className="eyebrow">{tr("Loved by you", "大家都爱")}</div><h2>{tr("Bestsellers", "热卖单品")}</h2></div>
          <Link to="/shop?sort=best" className="link-u">{tr("View all", "查看全部")}</Link>
        </div>
        <div className="grid">{best.map((p) => <ProductCard key={p.id} p={p} />)}</div>
      </section>

      <section className="section container">
        <div className="section-head">
          <div><div className="eyebrow">{tr("The Style Journal", "穿搭知识")}</div><h2>{tr(<>Notes on <span className="serif-i">dressing well</span></>, <>关于<span className="serif-i">好好穿衣</span></>)}</h2></div>
          <Link to="/journal" className="link-u">{tr("Read more", "阅读更多")}</Link>
        </div>
        <div className="journal-grid">{posts.map((p) => <PostCard key={p.id} post={p} />)}</div>
      </section>

      <section className="container">
        <div className="values">
          <div><IconTruck size={26} /><span><b>{tr("Free shipping", "免运费")}</b><small>{tr(`On orders over ${money(settings.freeShipThreshold)}`, `订单满 ${money(settings.freeShipThreshold)}`)}</small></span></div>
          <div><IconReturn size={26} /><span><b>{tr("30-day returns", "30 天退换")}</b><small>{tr("Easy & free exchanges", "免费轻松换货")}</small></span></div>
          <div><IconShield size={26} /><span><b>{tr("Secure checkout", "安全支付")}</b><small>{tr("Card, PayPal, Apple Pay", "信用卡、PayPal、Apple Pay")}</small></span></div>
          <div><IconSpark size={26} /><span><b>{tr("Thoughtfully made", "用心制作")}</b><small>{tr("Quality fabrics, fair prices", "优质面料，合理价格")}</small></span></div>
        </div>
      </section>

      <section className="section container">
        <div className="newsletter">
          <div className="eyebrow">{tr("Join the Muse list", "订阅 Muse 会员通讯")}</div>
          <h2>{tr(<>10% off your <span className="serif-i">first order</span></>, <><span className="serif-i">首单</span>立享 9 折</>)}</h2>
          <p>{tr("Be first to see new collections, styling notes and private sales.", "第一时间获取新品、穿搭笔记和会员专享折扣。")}</p>
          <form className="nl-form" onSubmit={(e) => { e.preventDefault(); if (!/^\S+@\S+\.\S+$/.test(email)) { toast(tr("Please enter a valid email", "请输入有效的邮箱")); return; } toast(tr("Welcome! Your code: BLOOM10", "欢迎加入！你的优惠码：BLOOM10")); setEmail(""); }}>
            <input type="email" placeholder={tr("Your email address", "你的邮箱地址")} value={email} onChange={(e) => setEmail(e.target.value)} />
            <button className="btn btn-rose">{tr("Subscribe", "订阅")}</button>
          </form>
        </div>
      </section>
    </>
  );
}
