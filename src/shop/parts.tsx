import { Link } from "react-router-dom";
import { money, useStore } from "../store";
import { Art, ProductImage } from "../components/Art";
import { IconHeart, IconPlay } from "../components/Icons";
import type { Post, Product } from "../types";

export function useShopActions() {
  const { state, set, toast, setCartOpen } = useStore();
  const addToCart = (p: Product, color = p.colors[0]?.name ?? "", size = p.sizes[0] ?? "", qty = 1, open = true) => {
    if (p.stock <= 0) { toast("Sorry, this piece is sold out"); return; }
    set((s) => {
      const i = s.cart.findIndex((c) => c.productId === p.id && c.color === color && c.size === size);
      const cart = i >= 0 ? s.cart.map((c, j) => (j === i ? { ...c, qty: c.qty + qty } : c)) : [...s.cart, { productId: p.id, color, size, qty }];
      return { ...s, cart };
    });
    if (open) setCartOpen(true); else toast(`Added ${p.name} to your bag`);
  };
  const toggleWish = (id: string) => {
    const on = state.wishlist.includes(id);
    set((s) => ({ ...s, wishlist: on ? s.wishlist.filter((w) => w !== id) : [...s.wishlist, id] }));
    toast(on ? "Removed from wishlist" : "Saved to wishlist ♡");
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
  return (
    <div className="card" style={{ animationDelay: `${delay}ms` }}>
      <Link to={`/product/${p.id}`} className="img">
        <ProductImage p={p} />
        {p.stock <= 0 ? <span className="pill out">Sold out</span>
          : p.compareAt ? <span className="pill sale">-{Math.round((1 - p.price / p.compareAt) * 100)}%</span>
          : p.isNew ? <span className="pill">New</span>
          : p.isBest ? <span className="pill">Bestseller</span> : null}
      </Link>
      <button className="heart" onClick={() => toggleWish(p.id)} aria-label="Wishlist"><IconHeart size={17} filled={wished(p.id)} /></button>
      {p.stock > 0 && <button className="quick" onClick={() => addToCart(p)}>Quick add</button>}
      <Link to={`/product/${p.id}`}><h3>{p.name}</h3></Link>
      <PriceTag p={p} />
      {p.colors.length > 1 && <div className="swatches">{p.colors.map((c) => <i key={c.name} style={{ background: c.hex }} title={c.name} />)}</div>}
    </div>
  );
}

export function PostCover({ post }: { post: Post }) {
  return post.cover
    ? <img src={post.cover} alt="" loading="lazy" />
    : <Art kind={post.art} color={post.palette[1]} bg={post.palette} />;
}

export function PostCard({ post }: { post: Post }) {
  return (
    <Link to={`/journal/${post.id}`} className="post-card">
      <div className="cover">
        <PostCover post={post} />
        {post.type === "video" && <><span className="vtag">Video</span><span className="play"><IconPlay size={22} /></span>{post.duration && <span className="dur">{post.duration}</span>}</>}
      </div>
      <div className="eyebrow" style={{ marginTop: 16 }}>{post.column}</div>
      <h3>{post.title}</h3>
      <p>{post.excerpt}</p>
      <div className="by">By {post.author} · {new Date(post.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>
    </Link>
  );
}
