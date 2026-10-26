import { Link } from "react-router-dom";
import { money, useStore } from "../store";
import { Art, ProductImage } from "../components/Art";
import { IconHeart, IconPlay } from "../components/Icons";
import { COLUMN_LABEL, useColorName, useLang } from "../i18n";
import type { Post, Product } from "../types";

export function useShopActions() {
  const { state, set, toast, setCartOpen } = useStore();
  const { tr, pick } = useLang();
  const addToCart = (p: Product, color = p.colors[0]?.name ?? "", size = p.sizes[0] ?? "", qty = 1, open = true) => {
    if (p.stock <= 0) { toast(tr("Sorry, this piece is sold out", "抱歉，该商品已售罄")); return; }
    set((s) => {
      const i = s.cart.findIndex((c) => c.productId === p.id && c.color === color && c.size === size);
      const cart = i >= 0 ? s.cart.map((c, j) => (j === i ? { ...c, qty: c.qty + qty } : c)) : [...s.cart, { productId: p.id, color, size, qty }];
      return { ...s, cart };
    });
    if (open) setCartOpen(true); else toast(tr(`Added ${p.name} to your bag`, `已将「${pick(p, "name")}」加入购物袋`));
  };
  const toggleWish = (id: string) => {
    const on = state.wishlist.includes(id);
    set((s) => ({ ...s, wishlist: on ? s.wishlist.filter((w) => w !== id) : [...s.wishlist, id] }));
    toast(on ? tr("Removed from wishlist", "已取消收藏") : tr("Saved to wishlist ♡", "已加入收藏 ♡"));
  };
  return { addToCart, toggleWish, wished: (id: string) => state.wishlist.includes(id) };
}

export function PriceTag({ p }: { p: Product }) {
  return p.compareAt
    ? <span className="price"><span className="now">{money(p.price)}</span><s>{money(p.compareAt)}</s></span>
    : <span className="price">{money(p.price)}</span>;
}

export function ProductCard({ p, delay = 0 }: { p: Product; delay?: number }) {
  const { addToCart, toggleWish, wished } = useShopActions();
  const { tr, pick } = useLang();
  const colorName = useColorName();
  return (
    <div className="card" style={{ animationDelay: `${delay}ms` }}>
      <Link to={`/product/${p.id}`} className="img">
        <ProductImage p={p} />
        {p.stock <= 0 ? <span className="pill out">{tr("Sold out", "已售罄")}</span>
          : p.compareAt ? <span className="pill sale">-{Math.round((1 - p.price / p.compareAt) * 100)}%</span>
          : p.isNew ? <span className="pill">{tr("New", "新品")}</span>
          : p.isBest ? <span className="pill">{tr("Bestseller", "热卖")}</span> : null}
      </Link>
      <button className="heart" onClick={() => toggleWish(p.id)} aria-label="Wishlist"><IconHeart size={17} filled={wished(p.id)} /></button>
      {p.stock > 0 && <button className="quick" onClick={() => addToCart(p)}>{tr("Quick add", "快速加购")}</button>}
      <Link to={`/product/${p.id}`}><h3>{pick(p, "name")}</h3></Link>
      <PriceTag p={p} />
      {p.colors.length > 1 && <div className="swatches">{p.colors.map((c) => <i key={c.name} style={{ background: c.hex }} title={colorName(c.name)} />)}</div>}
    </div>
  );
}

export function PostCover({ post }: { post: Post }) {
  return post.cover
    ? <img src={post.cover} alt="" loading="lazy" />
    : <Art kind={post.art} color={post.palette[1]} bg={post.palette} />;
}

export function PostCard({ post }: { post: Post }) {
  const { tr, pick, date, lang } = useLang();
  return (
    <Link to={`/journal/${post.id}`} className="post-card">
      <div className="cover">
        <PostCover post={post} />
        {post.type === "video" && <><span className="vtag">{tr("Video", "视频")}</span><span className="play"><IconPlay size={22} /></span>{post.duration && <span className="dur">{post.duration}</span>}</>}
      </div>
      <div className="eyebrow" style={{ marginTop: 16 }}>{lang === "zh" ? COLUMN_LABEL[post.column] : post.column}</div>
      <h3>{pick(post, "title")}</h3>
      <p>{pick(post, "excerpt")}</p>
      <div className="by">{tr("By", "作者")} {post.author} · {date(post.publishedAt)}</div>
    </Link>
  );
}
