import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useStore } from "../store";
import { CATS } from "./Layout";
import { ProductCard } from "./parts";

const PRICES = [
  { id: "all", label: "All prices", test: () => true },
  { id: "u50", label: "Under $50", test: (n: number) => n < 50 },
  { id: "50-100", label: "$50 – $100", test: (n: number) => n >= 50 && n <= 100 },
  { id: "o100", label: "Over $100", test: (n: number) => n > 100 },
];

export default function Shop() {
  const { state } = useStore();
  const [sp, setSp] = useSearchParams();
  const cat = sp.get("cat") ?? "";
  const q = (sp.get("q") ?? "").toLowerCase();
  const sort = sp.get("sort") ?? "featured";
  const [price, setPrice] = useState("all");
  const [colors, setColors] = useState<string[]>([]);
  const [inStock, setInStock] = useState(false);

  const update = (k: string, v: string) => {
    const n = new URLSearchParams(sp);
    if (v) n.set(k, v); else n.delete(k);
    setSp(n, { replace: true });
  };

  const allColors = useMemo(() => {
    const m = new Map<string, string>();
    state.products.forEach((p) => p.colors.forEach((c) => m.set(c.name, c.hex)));
    return [...m];
  }, [state.products]);

  const list = useMemo(() => {
    const pt = PRICES.find((p) => p.id === price)!.test;
    const r = state.products.filter((p) =>
      p.status === "active" &&
      (!cat || p.category === cat) &&
      (!q || `${p.name} ${p.tags.join(" ")} ${p.category}`.toLowerCase().includes(q)) &&
      pt(p.price) &&
      (!colors.length || p.colors.some((c) => colors.includes(c.name))) &&
      (!inStock || p.stock > 0));
    const s = [...r];
    if (sort === "new") s.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    if (sort === "best") s.sort((a, b) => b.sold - a.sold);
    if (sort === "low") s.sort((a, b) => a.price - b.price);
    if (sort === "high") s.sort((a, b) => b.price - a.price);
    return s;
  }, [state.products, cat, q, price, colors, inStock, sort]);

  const title = q ? `“${sp.get("q")}”` : CATS.find((c) => c.id === cat)?.label ?? "Shop All";

  return (
    <div className="container">
      <div className="page-head">
        <div className="eyebrow">{q ? "Search results" : "The Collection"}</div>
        <h1>{title}</h1>
        {!q && <p>Romantic, versatile pieces designed to be worn again and again.</p>}
      </div>

      <div className="chips">
        <button className={`chip ${!cat ? "on" : ""}`} onClick={() => update("cat", "")}>All</button>
        {CATS.map((c) => <button key={c.id} className={`chip ${cat === c.id ? "on" : ""}`} onClick={() => update("cat", c.id)}>{c.label}</button>)}
      </div>

      <div className="toolbar">
        <span className="count">{list.length} pieces</span>
        <select className="select" value={sort} onChange={(e) => update("sort", e.target.value)} aria-label="Sort">
          <option value="featured">Featured</option>
          <option value="new">Newest</option>
          <option value="best">Bestselling</option>
          <option value="low">Price: low to high</option>
          <option value="high">Price: high to low</option>
        </select>
      </div>

      <div className="shop-layout">
        <aside className="filters">
          <section>
            <h4>Price</h4>
            {PRICES.map((p) => <label key={p.id}><input type="radio" name="price" checked={price === p.id} onChange={() => setPrice(p.id)} />{p.label}</label>)}
          </section>
          <section>
            <h4>Colour</h4>
            <div className="color-dots">
              {allColors.map(([name, hex]) => (
                <button key={name} title={name} style={{ background: hex }} className={colors.includes(name) ? "on" : ""}
                  onClick={() => setColors((c) => (c.includes(name) ? c.filter((x) => x !== name) : [...c, name]))} />
              ))}
            </div>
          </section>
          <section>
            <h4>Availability</h4>
            <label><input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} />In stock only</label>
          </section>
        </aside>
        <div>
          {list.length === 0
            ? <div className="empty"><h3>Nothing here… yet</h3><p>Try another category or clear your filters.</p></div>
            : <div className="grid">{list.map((p, i) => <ProductCard key={p.id} p={p} delay={Math.min(i, 8) * 40} />)}</div>}
        </div>
      </div>
    </div>
  );
}
