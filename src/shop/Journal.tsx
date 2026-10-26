import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { money, useStore } from "../store";
import { ProductImage } from "../components/Art";
import { IconPlay } from "../components/Icons";
import { PostCard, PostCover, useShopActions } from "./parts";
import { COLUMN_LABEL, useLang } from "../i18n";
import type { Post, PostColumn } from "../types";

const COLUMNS = ["All", "Videos", "Styling Tips", "Trend Report", "Capsule Wardrobe", "Occasion Wear", "Care Guide"];

export function Journal() {
  const { state } = useStore();
  const { tr, pick, lang } = useLang();
  const colLabel = (c: string) => (c === "All" ? tr("All", "全部") : c === "Videos" ? tr("Videos", "视频") : lang === "zh" ? COLUMN_LABEL[c as PostColumn] : c);
  const [col, setCol] = useState("All");
  const posts = state.posts.filter((p) => p.status === "published").sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  const list = posts.filter((p) => col === "All" || (col === "Videos" ? p.type === "video" : p.column === col));
  const [feature, ...rest] = list;

  return (
    <div className="container">
      <div className="page-head">
        <div className="eyebrow">{tr("The Style Journal", "穿搭知识")}</div>
        <h1>{tr(<>Notes on <span className="serif-i">dressing well</span></>, <>关于<span className="serif-i">好好穿衣</span></>)}</h1>
        <p>{tr("Styling advice, trend reports and video lookbooks from our studio.", "来自我们工作室的穿搭建议、趋势解读和视频穿搭。")}</p>
      </div>
      <div className="chips" style={{ justifyContent: "safe center", marginBottom: 36 }}>
        {COLUMNS.map((c) => <button key={c} className={`chip ${col === c ? "on" : ""}`} onClick={() => setCol(c)}>{colLabel(c)}</button>)}
      </div>
      {!feature ? <div className="empty"><h3>{tr("No stories yet", "暂无内容")}</h3></div> : (
        <>
          <Link to={`/journal/${feature.id}`} className="feature-post post-card">
            <div className="cover">
              <PostCover post={feature} />
              {feature.type === "video" && <span className="play"><IconPlay size={24} /></span>}
            </div>
            <div>
              <div className="eyebrow">{feature.type === "video" ? tr("Video · ", "视频 · ") : ""}{colLabel(feature.column)}</div>
              <h2>{pick(feature, "title")}</h2>
              <p>{pick(feature, "excerpt")}</p>
              <span className="link-u">{feature.type === "video" ? tr("Watch now", "立即观看") : tr("Read the story", "阅读全文")}</span>
            </div>
          </Link>
          <div className="journal-grid">{rest.map((p) => <PostCard key={p.id} post={p} />)}</div>
        </>
      )}
    </div>
  );
}

function Body({ text }: { text: string }) {
  return <>{text.split(/\n\n+/).flatMap((block, i) => {
    const lines = block.split("\n");
    return lines.map((l, j) => l.startsWith("## ") ? <h2 key={`${i}-${j}`}>{l.slice(3)}</h2> : <p key={`${i}-${j}`}>{l}</p>);
  })}</>;
}

function embedUrl(url: string) {
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}?autoplay=1`;
  return null;
}

function VideoPlayer({ post }: { post: Post }) {
  const { tr } = useLang();
  const [playing, setPlaying] = useState(false);
  const url = post.videoUrl?.trim() ?? "";
  const embed = url ? embedUrl(url) : null;
  return (
    <div className="video-frame">
      {playing && embed && <iframe src={embed} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen title={post.title} />}
      {playing && !embed && url && <video src={url} controls autoPlay playsInline />}
      {(!playing || !url) && (
        <button className="poster" onClick={() => setPlaying(true)} aria-label={tr("Play video", "播放视频")}>
          <PostCover post={post} />
          {playing
            ? <div className="playing"><div style={{ textAlign: "center" }}><div className="serif-i" style={{ fontSize: 28 }}>{tr("Now playing…", "正在播放…")}</div><small>{tr("Prototype: add a YouTube or video URL in the admin to play the real video", "原型示意：在后台为该视频填写 YouTube 链接或视频地址即可真实播放")}</small></div><div className="progress"><i /></div></div>
            : <span className="play" style={{ width: 80, height: 80 }}><IconPlay size={30} /></span>}
        </button>
      )}
    </div>
  );
}

export function Article() {
  const { id } = useParams();
  const { state } = useStore();
  const { addToCart } = useShopActions();
  const { tr, pick, date, lang } = useLang();
  const post = state.posts.find((p) => p.id === id && p.status === "published");
  if (!post) return <div className="container empty"><h3>{tr("Story not found", "内容不存在")}</h3><Link to="/journal" className="btn" style={{ marginTop: 16 }}>{tr("Back to Journal", "返回穿搭知识")}</Link></div>;
  const products = post.productIds.map((pid) => state.products.find((p) => p.id === pid && p.status === "active")).filter(Boolean) as typeof state.products;
  const more = state.posts.filter((p) => p.status === "published" && p.id !== post.id).slice(0, 3);

  return (
    <div className="container" style={{ paddingTop: 30 }}>
      <div className="article-head">
        <div className="eyebrow">{post.type === "video" ? tr("Video · ", "视频 · ") : ""}{lang === "zh" ? COLUMN_LABEL[post.column] : post.column}</div>
        <h1>{pick(post, "title")}</h1>
        <div className="by">{tr("By", "作者")} {post.author} · {date(post.publishedAt, true)}{post.duration ? ` · ${post.duration}` : ""}</div>
      </div>
      {post.type === "video" ? <VideoPlayer post={post} /> : <div className="article-hero"><PostCover post={post} /></div>}
      <div className="article">
        <div className="article-body"><Body text={pick(post, "body")} /></div>
        {products.length > 0 && (
          <aside>
            <div className="aside-shop">
              <div className="eyebrow">{tr("Shop this story", "文中单品")}</div>
              <h3>{tr("Featured pieces", "本期推荐")}</h3>
              {products.map((p) => (
                <div className="look-item" key={p.id}>
                  <Link to={`/product/${p.id}`} className="t"><ProductImage p={p} /></Link>
                  <div><Link to={`/product/${p.id}`}>{pick(p, "name")}</Link><div className="price" style={{ fontSize: 13 }}>{money(p.price)}</div></div>
                  <button className="icon-btn" style={{ border: "1px solid var(--line)" }} onClick={() => addToCart(p)} aria-label={tr("Add to bag", "加入购物袋")} disabled={p.stock <= 0}>+</button>
                </div>
              ))}
            </div>
          </aside>
        )}
      </div>
      <section className="section">
        <div className="section-head"><div><div className="eyebrow">{tr("Keep reading", "继续阅读")}</div><h2>{tr("More from the Journal", "更多穿搭知识")}</h2></div></div>
        <div className="journal-grid">{more.map((p) => <PostCard key={p.id} post={p} />)}</div>
      </section>
    </div>
  );
}
