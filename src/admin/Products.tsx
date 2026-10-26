import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { compressImage, money, uid, useStore } from "../store";
import { ProductImage } from "../components/Art";
import { IconEdit, IconPlus, IconTrash, IconUpload } from "../components/Icons";
import type { ArtKind, Category, Product } from "../types";

export const CAT_CN: Record<Category, string> = { clothing: "服装", shoes: "鞋履", bags: "包袋", jewelry: "首饰", accessories: "配饰" };
const STATUS_CN = { active: "已上架", draft: "草稿", archived: "已下架" };
const KIND_CN: Record<ArtKind, string> = {
  dress: "连衣裙", blouse: "上衣", skirt: "半裙", coat: "外套", heels: "高跟鞋", flats: "平底鞋", boots: "靴子",
  tote: "托特包", handbag: "手提包", clutch: "手拿包", earrings: "耳饰", necklace: "项链", ring: "戒指", bracelet: "手链",
  scarf: "丝巾", hat: "帽子", sunglasses: "墨镜",
};

function StatusTag({ s }: { s: Product["status"] }) {
  return <span className={`tag ${s === "active" ? "green" : s === "draft" ? "" : "gray"}`}>{STATUS_CN[s]}</span>;
}

export function Products() {
  const { state, set, toast } = useStore();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [st, setSt] = useState("");
  const [sel, setSel] = useState<string[]>([]);
  const list = state.products.filter((p) =>
    (!q || p.name.toLowerCase().includes(q.toLowerCase())) && (!cat || p.category === cat) && (!st || p.status === st));

  const setStatus = (ids: string[], status: Product["status"]) => {
    set((s) => ({ ...s, products: s.products.map((p) => (ids.includes(p.id) ? { ...p, status } : p)) }));
    toast(`已${STATUS_CN[status]} ${ids.length} 件商品`);
    setSel([]);
  };
  const remove = (p: Product) => {
    if (!confirm(`确定删除「${p.name}」？此操作不可恢复`)) return;
    set((s) => ({ ...s, products: s.products.filter((x) => x.id !== p.id) }));
    toast("已删除");
  };
  const allSel = list.length > 0 && list.every((p) => sel.includes(p.id));

  return (
    <>
      <div className="bar-tools">
        <input className="a-input" placeholder="搜索商品名称" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="a-select" value={cat} onChange={(e) => setCat(e.target.value)}>
          <option value="">全部分类</option>{Object.entries(CAT_CN).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select className="a-select" value={st} onChange={(e) => setSt(e.target.value)}>
          <option value="">全部状态</option>{Object.entries(STATUS_CN).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <span className="grow" />
        {sel.length > 0 && <>
          <button className="a-btn ghost sm" onClick={() => setStatus(sel, "active")}>批量上架 ({sel.length})</button>
          <button className="a-btn ghost sm" onClick={() => setStatus(sel, "archived")}>批量下架</button>
        </>}
        <Link to="/admin/products/new" className="a-btn rose"><IconPlus size={16} />新增商品</Link>
      </div>

      <div className="panel">
        <div className="tbl-wrap cards-m">
          <table className="tbl">
            <thead><tr>
              <th><input type="checkbox" checked={allSel} onChange={() => setSel(allSel ? [] : list.map((p) => p.id))} /></th>
              <th>商品</th><th>分类</th><th>售价</th><th>库存</th><th>销量</th><th>状态</th><th style={{ textAlign: "right" }}>操作</th>
            </tr></thead>
            <tbody>{list.map((p) => (
              <tr key={p.id}>
                <td><input type="checkbox" checked={sel.includes(p.id)} onChange={() => setSel((s) => (s.includes(p.id) ? s.filter((x) => x !== p.id) : [...s, p.id]))} /></td>
                <td><div className="pcell"><span className="t"><ProductImage p={p} /></span><div><div>{p.name}</div>{p.zh?.name && <div style={{ fontSize: 12.5, color: "var(--ink-2)" }}>{p.zh.name}</div>}<small style={{ color: "var(--muted)" }}>{p.isNew && "新品 "}{p.isBest && "热卖 "}{p.images.length ? `${p.images.length} 张图` : "未上传实拍图"}</small></div></div></td>
                <td>{CAT_CN[p.category]}</td>
                <td>{money(p.price)}{p.compareAt && <div><s style={{ color: "var(--muted)", fontSize: 12 }}>{money(p.compareAt)}</s></div>}</td>
                <td style={{ color: p.stock < 10 ? "#B4545A" : undefined }}>{p.stock}</td>
                <td>{p.sold}</td>
                <td><StatusTag s={p.status} /></td>
                <td><div className="ops">
                  {p.status === "active"
                    ? <button className="a-btn ghost sm" onClick={() => setStatus([p.id], "archived")}>下架</button>
                    : <button className="a-btn ghost sm" onClick={() => setStatus([p.id], "active")}>上架</button>}
                  <Link className="a-btn ghost sm" to={`/admin/products/${p.id}`}><IconEdit size={14} />编辑</Link>
                  <button className="a-btn danger sm" onClick={() => remove(p)} aria-label="删除"><IconTrash size={14} /></button>
                </div></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
        <div className="mcards">
          {list.map((p) => (
            <div className="mcard" key={p.id}>
              <span className="t"><ProductImage p={p} /></span>
              <div>
                <div className="row"><b style={{ fontWeight: 400 }}>{p.name}</b><StatusTag s={p.status} /></div>
                <div style={{ fontSize: 12.5, color: "var(--muted)", margin: "4px 0 8px" }}>{CAT_CN[p.category]} · {money(p.price)} · 库存 {p.stock} · 售 {p.sold}</div>
                <div style={{ display: "flex", gap: 6 }}>
                  <Link className="a-btn ghost sm" to={`/admin/products/${p.id}`}>编辑</Link>
                  <button className="a-btn ghost sm" onClick={() => setStatus([p.id], p.status === "active" ? "archived" : "active")}>{p.status === "active" ? "下架" : "上架"}</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {list.length === 0 && <p style={{ textAlign: "center", color: "var(--muted)", padding: 30 }}>没有符合条件的商品</p>}
      </div>
    </>
  );
}

const blank = (): Product => ({
  id: uid("p"), name: "", category: "clothing", kind: "dress", price: 0, stock: 0,
  colors: [{ name: "Blush", hex: "#E9C4BE" }], sizes: ["S", "M", "L"], images: [], description: "", material: "",
  tags: [], isNew: true, isBest: false, status: "draft", sold: 0, createdAt: new Date().toISOString(),
});

export function ProductEdit() {
  const { id } = useParams();
  const { state, set, toast } = useStore();
  const nav = useNavigate();
  const existing = state.products.find((p) => p.id === id);
  const [p, setP] = useState<Product>(() => existing ?? blank());
  const [sizes, setSizes] = useState(p.sizes.join(", "));
  const [tags, setTags] = useState(p.tags.join(", "));
  const [uploading, setUploading] = useState(false);
  const up = <K extends keyof Product>(k: K, v: Product[K]) => setP((x) => ({ ...x, [k]: v }));

  if (id !== "new" && !existing) return <div className="panel">商品不存在 <Link to="/admin/products">返回列表</Link></div>;

  const onFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    try {
      const urls = await Promise.all([...files].filter((f) => f.type.startsWith("image/")).map((f) => compressImage(f)));
      setP((x) => ({ ...x, images: [...x.images, ...urls] }));
    } catch { toast("图片读取失败，请换一张试试"); }
    setUploading(false);
  };

  const save = (status?: Product["status"]) => {
    if (!p.name.trim()) { toast("请填写商品名称"); return; }
    if (p.price <= 0) { toast("请填写正确的售价"); return; }
    const final: Product = {
      ...p, status: status ?? p.status,
      sizes: sizes.split(/[,，]/).map((s) => s.trim()).filter(Boolean),
      tags: tags.split(/[,，]/).map((s) => s.trim()).filter(Boolean),
      compareAt: p.compareAt && p.compareAt > p.price ? p.compareAt : undefined,
    };
    if (!final.sizes.length) final.sizes = ["One size"];
    set((s) => ({ ...s, products: existing ? s.products.map((x) => (x.id === final.id ? final : x)) : [final, ...s.products] }));
    toast(final.status === "active" ? "已保存并上架，前台已同步" : "已保存");
    nav("/admin/products");
  };

  return (
    <>
      <div className="bar-tools"><Link to="/admin/products" style={{ color: "var(--ink-2)" }}>← 商品列表</Link><span className="grow" />{existing && p.status === "active" && <a className="a-btn ghost sm" href={`/product/${p.id}`} target="_blank" rel="noreferrer">在前台查看</a>}</div>
      <div className="form-grid">
        <div>
          <div className="panel">
            <h3>基本信息</h3>
            <div className="f"><label>商品名称（英文，前台默认展示）*</label><input className="a-input" value={p.name} onChange={(e) => up("name", e.target.value)} placeholder="e.g. Camille Silk Slip Dress" /></div>
            <div className="f"><label>商品描述</label><textarea className="a-textarea" rows={4} value={p.description} onChange={(e) => up("description", e.target.value)} /></div>
            <div className="f"><label>材质与护理</label><input className="a-input" value={p.material} onChange={(e) => up("material", e.target.value)} placeholder="100% silk · Dry clean" /></div>
          </div>
          <div className="panel">
            <h3>中文版本 <span style={{ fontSize: 12, color: "var(--muted)" }}>前台切换到「中文」时显示，留空则显示英文</span></h3>
            <div className="f"><label>中文名称</label><input className="a-input" value={p.zh?.name ?? ""} onChange={(e) => up("zh", { ...p.zh, name: e.target.value })} placeholder="例如：卡米尔真丝吊带裙" /></div>
            <div className="f"><label>中文描述</label><textarea className="a-textarea" rows={3} value={p.zh?.description ?? ""} onChange={(e) => up("zh", { ...p.zh, description: e.target.value })} /></div>
            <div className="f"><label>中文材质与护理</label><input className="a-input" value={p.zh?.material ?? ""} onChange={(e) => up("zh", { ...p.zh, material: e.target.value })} /></div>
          </div>
          <div className="panel">
            <h3>商品图片 <span style={{ fontSize: 12, color: "var(--muted)" }}>第一张为主图，自动压缩</span></h3>
            <div className="uploader">
              {p.images.length === 0 && <div className="u"><ProductImage p={p} /><span className="first">插画占位</span></div>}
              {p.images.map((src, i) => (
                <div className="u" key={i}>
                  <img src={src} alt="" />
                  {i === 0 && <span className="first">主图</span>}
                  <button onClick={() => up("images", p.images.filter((_, j) => j !== i))} aria-label="删除图片"><IconTrash size={13} /></button>
                </div>
              ))}
              <label className="add">
                <span><IconUpload size={22} /><br />{uploading ? "处理中…" : "上传图片"}</span>
                <input type="file" accept="image/*" multiple onChange={(e) => { onFiles(e.target.files); e.target.value = ""; }} />
              </label>
            </div>
          </div>
          <div className="panel">
            <h3>规格</h3>
            <div className="f"><label>颜色</label>
              {p.colors.map((c, i) => (
                <div className="color-row" key={i}>
                  <input type="color" value={c.hex} onChange={(e) => up("colors", p.colors.map((x, j) => (j === i ? { ...x, hex: e.target.value } : x)))} />
                  <input className="a-input" value={c.name} onChange={(e) => up("colors", p.colors.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))} placeholder="颜色名（英文）" />
                  <button className="a-btn danger sm" onClick={() => up("colors", p.colors.filter((_, j) => j !== i))} aria-label="删除颜色"><IconTrash size={14} /></button>
                </div>
              ))}
              <button className="a-btn ghost sm" style={{ width: "fit-content" }} onClick={() => up("colors", [...p.colors, { name: "New colour", hex: "#D4B47C" }])}><IconPlus size={14} />添加颜色</button>
            </div>
            <div className="f"><label>尺码</label><input className="a-input" value={sizes} onChange={(e) => setSizes(e.target.value)} /><span className="hint">用逗号分隔，例如 XS, S, M, L 或 36, 37, 38；无尺码填 One size</span></div>
          </div>
        </div>
        <div>
          <div className="panel">
            <h3>状态</h3>
            <select className="a-select" value={p.status} onChange={(e) => up("status", e.target.value as Product["status"])}>
              {Object.entries(STATUS_CN).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <div className="sw-row" style={{ marginTop: 8 }}><span>标记为新品</span><button className={`switch ${p.isNew ? "on" : ""}`} onClick={() => up("isNew", !p.isNew)} aria-label="新品" /></div>
            <div className="sw-row"><span>标记为热卖</span><button className={`switch ${p.isBest ? "on" : ""}`} onClick={() => up("isBest", !p.isBest)} aria-label="热卖" /></div>
          </div>
          <div className="panel">
            <h3>价格与库存</h3>
            <div className="f2">
              <div className="f"><label>售价 (USD) *</label><input className="a-input" type="number" min="0" step="0.01" value={p.price || ""} onChange={(e) => up("price", Number(e.target.value))} /></div>
              <div className="f"><label>划线原价</label><input className="a-input" type="number" min="0" step="0.01" value={p.compareAt ?? ""} onChange={(e) => up("compareAt", e.target.value ? Number(e.target.value) : undefined)} /></div>
            </div>
            <div className="f"><label>库存</label><input className="a-input" type="number" min="0" value={p.stock} onChange={(e) => up("stock", Math.max(0, Number(e.target.value)))} /></div>
          </div>
          <div className="panel">
            <h3>分类</h3>
            <div className="f"><label>商品分类</label>
              <select className="a-select" value={p.category} onChange={(e) => up("category", e.target.value as Category)}>{Object.entries(CAT_CN).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
            </div>
            <div className="f"><label>款式（无实拍图时用于生成插画）</label>
              <select className="a-select" value={p.kind} onChange={(e) => up("kind", e.target.value as ArtKind)}>{Object.entries(KIND_CN).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
            </div>
            <div className="f"><label>标签</label><input className="a-input" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="silk, gift, summer" /><span className="hint">用于前台搜索</span></div>
          </div>
          <div className="panel">
            <h3>SEO</h3>
            <div className="f"><label>页面标题</label><input className="a-input" placeholder={p.name ? `${p.name} | Muse & Bloom` : ""} /></div>
            <div className="f"><label>页面描述</label><textarea className="a-textarea" rows={2} placeholder={p.description.slice(0, 120)} /></div>
          </div>
        </div>
      </div>
      <div className="sticky-save">
        <button className="a-btn ghost" onClick={() => nav("/admin/products")}>取消</button>
        <button className="a-btn ghost" onClick={() => save("draft")}>存为草稿</button>
        <button className="a-btn rose" onClick={() => save("active")}>保存并上架</button>
      </div>
    </>
  );
}
