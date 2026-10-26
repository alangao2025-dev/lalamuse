import { useEffect, useState, type ReactNode } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useStore } from "../store";
import { IconBox, IconChart, IconCog, IconExternal, IconFile, IconLogout, IconMenu, IconReceipt, IconUsers } from "../components/Icons";
import "./admin.css";

const NAV = [
  { to: "/admin", label: "数据概览", icon: IconChart, end: true },
  { to: "/admin/products", label: "商品管理", icon: IconBox },
  { to: "/admin/content", label: "内容管理", icon: IconFile },
  { to: "/admin/orders", label: "订单管理", icon: IconReceipt },
  { to: "/admin/customers", label: "客户管理", icon: IconUsers },
  { to: "/admin/settings", label: "店铺设置", icon: IconCog },
];

function Login() {
  const { set, toast } = useStore();
  const [u, setU] = useState("admin");
  const [p, setP] = useState("bloom2026");
  return (
    <div className="adm-login">
      <div className="art"><div className="big">Muse<br />&amp; Bloom</div></div>
      <div className="box">
        <form onSubmit={(e) => {
          e.preventDefault();
          if (u === "admin" && p === "bloom2026") { set((s) => ({ ...s, admin: true })); toast("欢迎回来"); }
          else toast("账号或密码错误（演示账号 admin / bloom2026）");
        }}>
          <div className="eyebrow">Admin Console</div>
          <h1>管理后台登录</h1>
          <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 0 }}>原型演示账号已预填：admin / bloom2026</p>
          <div className="f"><label>账号</label><input className="a-input" value={u} onChange={(e) => setU(e.target.value)} /></div>
          <div className="f"><label>密码</label><input className="a-input" type="password" value={p} onChange={(e) => setP(e.target.value)} /></div>
          <button className="a-btn" style={{ width: "100%", justifyContent: "center", height: 46, marginTop: 6 }}>登录</button>
          <Link to="/" style={{ display: "block", textAlign: "center", marginTop: 16, fontSize: 13, color: "var(--ink-2)" }}>← 返回前台网站</Link>
        </form>
      </div>
    </div>
  );
}

export function AdminTitle({ children, actions }: { children: ReactNode; actions?: ReactNode }) {
  return <div className="bar-tools" style={{ marginTop: 4 }}><h2 style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 400, color: "var(--ink-2)" }} className="grow">{children}</h2>{actions}</div>;
}

export default function AdminLayout() {
  const { state, set, toastMsg } = useStore();
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  const nav = useNavigate();
  useEffect(() => { setOpen(false); window.scrollTo(0, 0); }, [loc.pathname]);

  if (!state.admin) return <>{<Login />}{toastMsg && <div className="toast">{toastMsg}</div>}</>;

  const current = [...NAV].reverse().find((n) => loc.pathname.startsWith(n.to))?.label ?? "管理后台";

  return (
    <div className="adm">
      {open && <div className="overlay" onClick={() => setOpen(false)} />}
      <aside className={`adm-side ${open ? "open" : ""}`}>
        <Link to="/admin" className="logo">Muse <em>&amp;</em> Bloom</Link>
        <div className="sub">ADMIN CONSOLE</div>
        <nav className="adm-nav">
          {NAV.map((n) => <NavLink key={n.to} to={n.to} end={n.end}><n.icon size={18} />{n.label}</NavLink>)}
        </nav>
        <div className="foot adm-nav">
          <a href="/" target="_blank" rel="noreferrer"><IconExternal size={18} />查看前台网站</a>
          <a href="#" onClick={(e) => { e.preventDefault(); set((s) => ({ ...s, admin: false })); nav("/admin"); }}><IconLogout size={18} />退出登录</a>
        </div>
      </aside>
      <div className="adm-main">
        <div className="adm-top">
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button className="icon-btn adm-menu" onClick={() => setOpen(true)} aria-label="菜单"><IconMenu /></button>
            <h1>{current}</h1>
          </div>
          <div className="who"><span className="nm">超级管理员 · admin</span><span className="avatar">A</span></div>
        </div>
        <div className="adm-body"><Outlet /></div>
      </div>
      {toastMsg && <div className="toast">{toastMsg}</div>}
    </div>
  );
}
