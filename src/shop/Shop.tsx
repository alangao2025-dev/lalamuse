import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useStore } from "../store";
import { CATS, useCatLabel } from "./Layout";
import { useColorName, useLang } from "../i18n";
import { ProductCard } from "./parts";

const PRICES = [
  { id: "all", label: ["All prices", "全部价格"], test: () => true },
  { id: "u50", label: ["Under $50", "$50 以下"], test: (n: number) => n < 50 },
  { id: "50-100", label: ["$50 – $100", "$50 – $100"], test: (n: number) => n >= 50 && n <= 100 },
  { id: "o100", label: ["Over $100", "$100 以上"], test: (n: number) => n > 100 },
];

export default function Shop() {
  const { state } = useStore();
  const { tr, lang } = useLang();
  const catLabel = useCatLabel();
  const colorName = useColorName();
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
      (!q || `${p.name} ${p.zh?.name ?? ""} ${p.tags.join(" ")} ${p.category}`.toLowerCase().includes(q)) &&
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

  const title = q ? `“${sp.get("q")}”` : CATS.includes(cat as never) ? catLabel(cat as never) : tr("Shop All", "全部商品");

  return (
    <div className="container">
      <div className="page-head">
        <div className="eyebrow">{q ? tr("Search results", "搜索结果") : tr("The Collection", "精选系列")}</div>
        <h1>{title}</h1>
        {!q && <p>{tr("Romantic, versatile pieces designed to be worn again and again.", "浪漫百搭，值得一穿再穿的单品。")}</p>}
      </div>

      <div className="chips">
        <button className={`chip ${!cat ? "on" : ""}`} onClick={() => update("cat", "")}>{tr("All", "全部")}</button>
        {CATS.map((c) => <button key={c} className={`chip ${cat === c ? "on" : ""}`} onClick={() => update("cat", c)}>{catLabel(c)}</button>)}
      </div>

      <div className="toolbar">
        <span className="count">{tr(`${list.length} pieces`, `共 ${list.length} 件`)}</span>
        <select className="select" value={sort} onChange={(e) => update("sort", e.target.value)} aria-label="Sort">
          <option value="featured">{tr("Featured", "推荐")}</option>
          <option value="new">{tr("Newest", "最新")}</option>
          <option value="best">{tr("Bestselling", "销量最高")}</option>
          <option value="low">{tr("Price: low to high", "价格从低到高")}</option>
          <option value="high">{tr("Price: high to low", "价格从高到低")}</option>
        </select>
      </div>

      <div className="shop-layout">
        <aside className="filters">
          <section>
            <h4>{tr("Price", "价格")}</h4>
            {PRICES.map((p) => <label key={p.id}><input type="radio" name="price" checked={price === p.id} onChange={() => setPrice(p.id)} />{p.label[lang === "zh" ? 1 : 0]}</label>)}
          </section>
          <section>
            <h4>{tr("Colour", "颜色")}</h4>
            <div className="color-dots">
              {allColors.map(([name, hex]) => (
                <button key={name} title={colorName(name)} style={{ background: hex }} className={colors.includes(name) ? "on" : ""}
                  onClick={() => setColors((c) => (c.includes(name) ? c.filter((x) => x !== name) : [...c, name]))} />
              ))}
            </div>
          </section>
          <section>
            <h4>{tr("Availability", "库存")}</h4>
            <label><input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} />{tr("In stock only", "仅看有货")}</label>
          </section>
        </aside>
        <div>
          {list.length === 0
            ? <div className="empty"><h3>{tr("Nothing here… yet", "暂时没有相关商品")}</h3><p>{tr("Try another category or clear your filters.", "换个分类或清除筛选条件试试。")}</p></div>
            : <div className="grid">{list.map((p, i) => <ProductCard key={p.id} p={p} delay={Math.min(i, 8) * 40} />)}</div>}
        </div>
      </div>
    </div>
  );
}
