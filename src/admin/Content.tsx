import { useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { compressImage, uid, useStore } from "../store";
import { Art, ProductImage } from "../components/Art";
import { IconEdit, IconPlus, IconTrash, IconUpload } from "../components/Icons";
import { PostCover } from "../shop/parts";
import type { ArtKind, Post, PostColumn } from "../types";

const COLUMNS: PostColumn[] = ["Styling Tips", "Trend Report", "Capsule Wardrobe", "Occasion Wear", "Care Guide"];
const COL_CN: Record<PostColumn, string> = { "Styling Tips": "穿搭技巧", "Trend Report": "流行趋势", "Capsule Wardrobe": "胶囊衣橱", "Occasion Wear": "场合穿搭", "Care Guide": "保养指南" };
const PALETTES: [string, string][] = [["#F3E3DC", "#E2C3B8"], ["#EBD9E3", "#CDB9D8"], ["#EFE2D2", "#D2B48C"], ["#E3E8EF", "#B8C7D6"], ["#E6EBDD", "#B9C2A8"], ["#F2EAD8", "#D4B47C"]];
const ARTS: ArtKind[] = ["dress", "heels", "handbag", "earrings", "necklace", "scarf", "hat", "coat", "clutch", "sunglasses"];

export function Content() {
  const { state, set, toast } = useStore();
  const [tab, setTab] = useState<"all" | "article" | "video">("all");
  const list = state.posts.filter((p) => tab === "all" || p.type === tab).sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  const toggle = (p: Post) => {
    set((s) => ({ ...s, posts: s.posts.map((x) => (x.id === p.id ? { ...x, status: x.status === "published" ? "draft" : "published" } : x)) }));
    toast(p.status === "published" ? "已撤回为草稿" : "已发布到前台");
  };
  const remove = (p: Post) => {
    if (!confirm(`确定删除「${p.title}」？`)) return;
    set((s) => ({ ...s, posts: s.posts.filter((x) => x.id !== p.id) }));
  };
  return (
    <>
      <div className="bar-tools">
        <div className="tabs" style={{ margin: 0 }}>
          {([["all", "全部"], ["article", "图文文章"], ["video", "视频"]] as const).map(([k, l]) => <button key={k} className={tab === k ? "on" : ""} onClick={() => setTab(k)}>{l}</button>)}
        </div>
        <span className="grow" />
        <Link to="/admin/content/new?type=article" className="a-btn ghost"><IconPlus size={16} />写文章</Link>
        <Link to="/admin/content/new?type=video" className="a-btn rose"><IconPlus size={16} />发布视频</Link>
      </div>
      <div className="panel">
        <div className="tbl-wrap">
          <table className="tbl">
            <thead><tr><th>内容</th><th>类型</th><th className="hide-sm">栏目</th><th className="hide-sm">关联商品</th><th className="hide-sm">阅读</th><th>状态</th><th style={{ textAlign: "right" }}>操作</th></tr></thead>
            <tbody>{list.map((p) => (
              <tr key={p.id}>
                <td><div className="pcell"><span className="t" style={{ aspectRatio: "4/3", width: 64 }}><PostCover post={p} /></span><div><div>{p.title}</div><small style={{ color: "var(--muted)" }}>{p.author} · {new Date(p.publishedAt).toLocaleDateString("zh-CN")}</small></div></div></td>
                <td><span className={`tag ${p.type === "video" ? "blue" : "rose"}`}>{p.type === "video" ? "视频" : "图文"}</span></td>
                <td className="hide-sm">{COL_CN[p.column]}</td>
                <td className="hide-sm">{p.productIds.length} 件</td>
                <td className="hide-sm">{p.views.toLocaleString()}</td>
                <td><span className={`tag ${p.status === "published" ? "green" : ""}`}>{p.status === "published" ? "已发布" : "草稿"}</span></td>
                <td><div className="ops">
                  <button className="a-btn ghost sm" onClick={() => toggle(p)}>{p.status === "published" ? "撤回" : "发布"}</button>
                  <Link className="a-btn ghost sm" to={`/admin/content/${p.id}`}><IconEdit size={14} /></Link>
                  <button className="a-btn danger sm" onClick={() => remove(p)} aria-label="删除"><IconTrash size={14} /></button>
                </div></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export function ContentEdit() {
  const { id } = useParams();
  const { state, set, toast } = useStore();
  const nav = useNavigate();
  const existing = state.posts.find((p) => p.id === id);
  const [sp] = useSearchParams();
  const type = sp.get("type") === "video" ? "video" : "article";
  const [p, setP] = useState<Post>(() => existing ?? {
    id: uid("a"), type, title: "", column: "Styling Tips", excerpt: "", body: "", palette: PALETTES[0], art: type === "video" ? "heels" : "dress",
    productIds: [], videoUrl: "", duration: "", status: "draft", publishedAt: new Date().toISOString(), author: "Studio M&B", views: 0,
  });
  const [pq, setPq] = useState("");
  const up = <K extends keyof Post>(k: K, v: Post[K]) => setP((x) => ({ ...x, [k]: v }));
  if (id !== "new" && !existing) return <div className="panel">内容不存在</div>;

  const onCover = async (f?: File) => {
    if (!f) return;
    try { up("cover", await compressImage(f, 1400)); } catch { toast("图片读取失败"); }
  };
  const save = (status: Post["status"]) => {
    if (!p.title.trim()) { toast("请填写标题"); return; }
    const final = { ...p, status, publishedAt: status === "published" && p.status !== "published" ? new Date().toISOString() : p.publishedAt };
    set((s) => ({ ...s, posts: existing ? s.posts.map((x) => (x.id === final.id ? final : x)) : [final, ...s.posts] }));
    toast(status === "published" ? "已发布，前台穿搭知识已更新" : "草稿已保存");
    nav("/admin/content");
  };
  const products = state.products.filter((x) => !pq || x.name.toLowerCase().includes(pq.toLowerCase()));

  return (
    <>
      <div className="bar-tools"><Link to="/admin/content" style={{ color: "var(--ink-2)" }}>← 内容列表</Link></div>
      <div className="form-grid">
        <div>
          <div className="panel">
            <h3>{p.type === "video" ? "视频信息" : "文章内容"}</h3>
            <div className="f"><label>标题（英文）*</label><input className="a-input" value={p.title} onChange={(e) => up("title", e.target.value)} placeholder="e.g. 5 Ways to Style a Silk Scarf" /></div>
            <div className="f"><label>摘要</label><textarea className="a-textarea" rows={2} value={p.excerpt} onChange={(e) => up("excerpt", e.target.value)} /></div>
            {p.type === "video" && (
              <div className="f2">
                <div className="f"><label>视频链接</label><input className="a-input" value={p.videoUrl ?? ""} onChange={(e) => up("videoUrl", e.target.value)} placeholder="YouTube 链接或 .mp4 地址" /><span className="hint">正式版支持直接上传视频文件（存 Cloudflare R2）</span></div>
                <div className="f"><label>时长</label><input className="a-input" value={p.duration ?? ""} onChange={(e) => up("duration", e.target.value)} placeholder="1:30" /></div>
              </div>
            )}
            <div className="f"><label>{p.type === "video" ? "视频说明 / 穿搭要点" : "正文"}</label>
              <textarea className="a-textarea" rows={14} value={p.body} onChange={(e) => up("body", e.target.value)} placeholder={"段落之间空一行。\n\n## 小标题以两个井号开头\n正文内容…"} />
              <span className="hint">格式：空行分段；以「## 」开头的行显示为小标题。正式版换成可视化富文本编辑器，支持文中插图。</span>
            </div>
          </div>
          <div className="panel">
            <h3>关联商品 <span style={{ fontSize: 12, color: "var(--muted)" }}>已选 {p.productIds.length} 件 · 显示在内容旁边，可直接加购</span></h3>
            <input className="a-input" style={{ marginBottom: 10 }} placeholder="搜索商品" value={pq} onChange={(e) => setPq(e.target.value)} />
            <div className="pick-list">
              {products.map((x) => (
                <label key={x.id}>
                  <input type="checkbox" checked={p.productIds.includes(x.id)} onChange={() => up("productIds", p.productIds.includes(x.id) ? p.productIds.filter((i) => i !== x.id) : [...p.productIds, x.id])} />
                  <span className="t"><ProductImage p={x} /></span>{x.name}
                </label>
              ))}
            </div>
          </div>
        </div>
        <div>
          <div className="panel">
            <h3>封面</h3>
            <div className="cover-up">
              <PostCover post={p} />
              <div className="acts">
                <label className="a-btn ghost sm" style={{ cursor: "pointer" }}><IconUpload size={14} />上传封面<input type="file" accept="image/*" hidden onChange={(e) => onCover(e.target.files?.[0])} /></label>
                {p.cover && <button className="a-btn danger sm" onClick={() => up("cover", undefined)}>移除</button>}
              </div>
            </div>
            {!p.cover && <>
              <div className="f" style={{ marginTop: 12 }}><label>没有封面图时使用插画：配色</label>
                <div style={{ display: "flex", gap: 8 }}>{PALETTES.map((pal, i) => <button key={i} onClick={() => up("palette", pal)} style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg, ${pal[0]}, ${pal[1]})`, boxShadow: p.palette[0] === pal[0] ? "0 0 0 2px #fff, 0 0 0 3px var(--ink)" : "inset 0 0 0 1px rgba(0,0,0,.08)" }} aria-label={`配色 ${i + 1}`} />)}</div>
              </div>
              <div className="f"><label>插画图案</label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6 }}>{ARTS.map((a) => <button key={a} onClick={() => up("art", a)} style={{ borderRadius: 8, overflow: "hidden", aspectRatio: "4/5", boxShadow: p.art === a ? "0 0 0 2px var(--ink)" : undefined }}><Art kind={a} color={p.palette[1]} bg={p.palette} /></button>)}</div>
              </div>
            </>}
          </div>
          <div className="panel">
            <h3>发布设置</h3>
            <div className="f"><label>类型</label><select className="a-select" value={p.type} onChange={(e) => up("type", e.target.value as Post["type"])}><option value="article">图文文章</option><option value="video">视频</option></select></div>
            <div className="f"><label>栏目</label><select className="a-select" value={p.column} onChange={(e) => up("column", e.target.value as PostColumn)}>{COLUMNS.map((c) => <option key={c} value={c}>{COL_CN[c]} · {c}</option>)}</select></div>
            <div className="f"><label>作者</label><input className="a-input" value={p.author} onChange={(e) => up("author", e.target.value)} /></div>
          </div>
        </div>
      </div>
      <div className="sticky-save">
        <button className="a-btn ghost" onClick={() => nav("/admin/content")}>取消</button>
        <button className="a-btn ghost" onClick={() => save("draft")}>存为草稿</button>
        <button className="a-btn rose" onClick={() => save("published")}>发布</button>
      </div>
    </>
  );
}
