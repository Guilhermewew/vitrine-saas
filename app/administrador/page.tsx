"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://sdffwrpacvtjncuqtrft.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkZmZ3cnBhY3Z0am5jdXF0cmZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NjU3NTAsImV4cCI6MjA5MDE0MTc1MH0.FarfM9aF-rKZOqEfhzt6Oqar1aN3H75wkHoySMAICcg"
);

export default function Admin() {
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [authLoading, setAuthLoading] = useState(true);
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [lojaId, setLojaId] = useState("");
  const [fotoUrl, setFotoUrl] = useState("");
  const [lojas, setLojas] = useState<any[]>([]);
  const [produtos, setProdutos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [tab, setTab] = useState<"add" | "list">("add");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });
  }, []);

  useEffect(() => {
    if (user) {
      fetch("https://motor-saas-ltb4.onrender.com/lojas").then(r => r.json()).then(setLojas).catch(() => {});
      fetch(`https://motor-saas-ltb4.onrender.com/produtos?user_id=${user.id}`).then(r => r.json()).then(setProdutos).catch(() => {});
    }
  }, [user]);

  async function handleLogin(e: any) {
    e.preventDefault();
    setLoginError("");
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: senha });
    if (error) setLoginError("E-mail ou senha incorretos. Tente novamente.");
    else setUser(data.user);
    setLoading(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
  }

  function showToast(msg: string, type: "success" | "error") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }

  async function cadastrarProduto(e: any) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("https://motor-saas-ltb4.onrender.com/produtos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, preco: parseFloat(preco), foto_url: fotoUrl, loja_id: lojaId, user_id: user.id }),
      });
      if (res.ok) {
        showToast("Produto cadastrado com sucesso.", "success");
        const novo = await res.json();
        setProdutos((prev: any[]) => [novo.dados[0], ...prev]);
        setNome(""); setPreco(""); setLojaId(""); setFotoUrl("");
      } else {
        showToast("Erro ao cadastrar produto.", "error");
      }
    } catch {
      showToast("Falha na conexão com o servidor.", "error");
    } finally {
      setLoading(false);
    }
  }

  const formatPrice = (v: number) =>
    Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  if (authLoading) return null;

  // ─── LOGIN ───────────────────────────────────────────────────────────────────
  if (!user) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: 'Inter', -apple-system, sans-serif; -webkit-font-smoothing: antialiased; }

          .login-root {
            min-height: 100vh;
            display: grid;
            grid-template-columns: 1fr 1fr;
            background: #fff;
          }

          /* LEFT PANEL */
          .login-left {
            background: #0f172a;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 40px;
            position: relative;
            overflow: hidden;
          }
          .login-left-bg {
            position: absolute; inset: 0; pointer-events: none;
            background:
              radial-gradient(ellipse 60% 50% at 20% 80%, rgba(37,99,235,0.18) 0%, transparent 60%),
              radial-gradient(ellipse 40% 40% at 80% 10%, rgba(99,102,241,0.12) 0%, transparent 50%);
          }
          .login-left-grid {
            position: absolute; inset: 0; pointer-events: none;
            background-image:
              linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
            background-size: 48px 48px;
          }
          .ll-logo {
            position: relative; z-index: 1;
            display: flex; align-items: center; gap: 10px;
            font-size: 16px; font-weight: 600; color: #fff; letter-spacing: -0.3px;
          }
          .ll-logo-mark {
            width: 32px; height: 32px; border-radius: 8px;
            background: #2563eb;
            display: flex; align-items: center; justify-content: center;
          }
          .ll-logo-mark svg { stroke: white; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }

          .ll-body { position: relative; z-index: 1; }
          .ll-headline {
            font-size: 30px; font-weight: 600; color: #fff;
            line-height: 1.2; letter-spacing: -0.5px; margin-bottom: 16px;
          }
          .ll-sub { font-size: 14px; color: #94a3b8; line-height: 1.7; max-width: 340px; }

          .ll-features { position: relative; z-index: 1; display: flex; flex-direction: column; gap: 12px; }
          .ll-feat {
            display: flex; align-items: center; gap: 12px;
            font-size: 13px; color: #cbd5e1;
          }
          .ll-feat-icon {
            width: 30px; height: 30px; border-radius: 8px;
            background: rgba(255,255,255,0.06);
            border: 1px solid rgba(255,255,255,0.08);
            display: flex; align-items: center; justify-content: center; flex-shrink: 0;
          }
          .ll-feat-icon svg { stroke: #60a5fa; fill: none; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }

          /* RIGHT PANEL */
          .login-right {
            display: flex; align-items: center; justify-content: center;
            padding: 40px 24px; background: #fff;
          }
          .login-form-wrap { width: 100%; max-width: 380px; }

          .lf-header { margin-bottom: 32px; }
          .lf-title { font-size: 22px; font-weight: 600; color: #111827; letter-spacing: -0.4px; margin-bottom: 6px; }
          .lf-sub { font-size: 13px; color: #6b7280; }

          .lf-field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
          .lf-label { font-size: 12px; font-weight: 500; color: #374151; }

          .lf-input-wrap { position: relative; }
          .lf-input {
            width: 100%; height: 42px; padding: 0 12px;
            border: 1px solid #e5e7eb; border-radius: 8px;
            font-family: 'Inter', sans-serif; font-size: 14px; color: #111827;
            background: #fff; outline: none;
            transition: border-color 0.15s, box-shadow 0.15s;
          }
          .lf-input:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }
          .lf-input.error { border-color: #dc2626; box-shadow: 0 0 0 3px rgba(220,38,38,0.08); }
          .lf-input-pass { padding-right: 42px; }

          .lf-eye {
            position: absolute; right: 0; top: 0; bottom: 0; width: 42px;
            display: flex; align-items: center; justify-content: center;
            border: none; background: none; cursor: pointer; color: #9ca3af;
            transition: color 0.15s;
          }
          .lf-eye:hover { color: #374151; }
          .lf-eye svg { width: 16px; height: 16px; stroke: currentColor; fill: none; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }

          .lf-error {
            display: flex; align-items: center; gap: 8px;
            background: #fef2f2; border: 1px solid #fecaca;
            color: #991b1b; font-size: 13px; padding: 10px 12px;
            border-radius: 8px; margin-bottom: 16px;
          }
          .lf-error svg { width: 14px; height: 14px; stroke: #dc2626; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; flex-shrink: 0; }

          .lf-btn {
            width: 100%; height: 42px;
            background: #2563eb; color: #fff;
            border: none; border-radius: 8px;
            font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 500;
            cursor: pointer; transition: background 0.15s, opacity 0.15s;
            display: flex; align-items: center; justify-content: center; gap: 8px;
            margin-top: 8px;
          }
          .lf-btn:hover { background: #1d4ed8; }
          .lf-btn:disabled { opacity: 0.55; cursor: not-allowed; }
          .lf-btn svg { width: 15px; height: 15px; stroke: white; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }

          .lf-divider { display: flex; align-items: center; gap: 12px; margin: 20px 0; }
          .lf-divider-line { flex: 1; height: 1px; background: #f3f4f6; }
          .lf-divider-text { font-size: 12px; color: #9ca3af; }

          .lf-footer { margin-top: 28px; text-align: center; font-size: 12px; color: #9ca3af; }

          /* Spinner */
          @keyframes spin { to { transform: rotate(360deg); } }
          .spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.7s linear infinite; }

          @media (max-width: 640px) {
            .login-root { grid-template-columns: 1fr; }
            .login-left { display: none; }
          }
        `}</style>

        <div className="login-root">
          {/* LEFT */}
          <div className="login-left">
            <div className="login-left-bg" />
            <div className="login-left-grid" />

            <div className="ll-logo">
              <div className="ll-logo-mark">
                <svg width="16" height="16" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              </div>
              Vitrine SaaS
            </div>

            <div className="ll-body">
              <div className="ll-headline">Gerencie sua<br />vitrine com precisão</div>
              <div className="ll-sub">Cadastre produtos, acompanhe vendas e controle seu catálogo em um único painel.</div>
            </div>

            <div className="ll-features">
              <div className="ll-feat">
                <div className="ll-feat-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>
                </div>
                Catálogo de produtos em tempo real
              </div>
              <div className="ll-feat">
                <div className="ll-feat-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                </div>
                Múltiplas lojas por conta
              </div>
              <div className="ll-feat">
                <div className="ll-feat-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                </div>
                Checkout integrado e seguro
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="login-right">
            <div className="login-form-wrap">
              <div className="lf-header">
                <div className="lf-title">Acessar o painel</div>
                <div className="lf-sub">Entre com seu e-mail e senha para continuar</div>
              </div>

              <form onSubmit={handleLogin}>
                <div className="lf-field">
                  <label className="lf-label">E-mail</label>
                  <input
                    className={`lf-input${loginError ? " error" : ""}`}
                    type="email" placeholder="voce@exemplo.com"
                    value={email} onChange={e => { setEmail(e.target.value); setLoginError(""); }}
                    required autoComplete="email"
                  />
                </div>

                <div className="lf-field">
                  <label className="lf-label">Senha</label>
                  <div className="lf-input-wrap">
                    <input
                      className={`lf-input lf-input-pass${loginError ? " error" : ""}`}
                      type={showPass ? "text" : "password"}
                      placeholder="••••••••"
                      value={senha} onChange={e => { setSenha(e.target.value); setLoginError(""); }}
                      required autoComplete="current-password"
                    />
                    <button type="button" className="lf-eye" onClick={() => setShowPass(s => !s)} tabIndex={-1}>
                      {showPass
                        ? <svg viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                        : <svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      }
                    </button>
                  </div>
                </div>

                {loginError && (
                  <div className="lf-error">
                    <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    {loginError}
                  </div>
                )}

                <button type="submit" className="lf-btn" disabled={loading}>
                  {loading
                    ? <><div className="spinner" /> Entrando...</>
                    : <>Acessar sistema <svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg></>
                  }
                </button>
              </form>

              <div className="lf-footer">
                Problemas para acessar? Contate o suporte.
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ─── PAINEL ADMIN ─────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg: #f9fafb; --surface: #ffffff; --border: #e5e7eb; --border-hover: #d1d5db;
          --text: #111827; --muted: #6b7280; --subtle: #9ca3af;
          --accent: #2563eb; --accent-light: #eff6ff; --accent-hover: #1d4ed8;
          --danger: #dc2626; --success: #16a34a;
          --font: 'Inter', -apple-system, sans-serif;
          --radius-sm: 6px; --radius: 10px; --radius-lg: 14px;
          --shadow-md: 0 4px 6px rgba(0,0,0,0.05), 0 2px 4px rgba(0,0,0,0.04);
        }
        body { background: var(--bg); color: var(--text); font-family: var(--font); font-size: 14px; -webkit-font-smoothing: antialiased; }
        .topbar { background: var(--surface); border-bottom: 1px solid var(--border); height: 56px; display: flex; align-items: center; padding: 0 24px; position: sticky; top: 0; z-index: 50; gap: 16px; }
        .logo { display: flex; align-items: center; gap: 8px; font-size: 15px; font-weight: 600; letter-spacing: -0.3px; }
        .logo-mark { width: 28px; height: 28px; border-radius: var(--radius-sm); background: var(--accent); display: flex; align-items: center; justify-content: center; }
        .logo-mark svg { width: 14px; height: 14px; stroke: white; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
        .topbar-sep { height: 18px; width: 1px; background: var(--border); }
        .layout { display: flex; min-height: calc(100vh - 56px); }
        .sidebar { width: 220px; flex-shrink: 0; background: var(--surface); border-right: 1px solid var(--border); padding: 20px 12px; display: flex; flex-direction: column; gap: 4px; }
        .sidebar-section { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: var(--subtle); padding: 0 8px; margin: 16px 0 8px; }
        .sidebar-section:first-child { margin-top: 0; }
        .nav-item { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: var(--radius-sm); font-size: 13px; color: var(--muted); cursor: pointer; border: none; background: none; width: 100%; text-align: left; font-family: var(--font); transition: background 0.12s, color 0.12s; }
        .nav-item:hover { background: var(--bg); color: var(--text); }
        .nav-item.active { background: var(--accent-light); color: var(--accent); font-weight: 500; }
        .nav-item svg { width: 15px; height: 15px; flex-shrink: 0; stroke: currentColor; fill: none; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
        .nav-badge { margin-left: auto; background: var(--bg); border: 1px solid var(--border); color: var(--muted); font-size: 11px; padding: 1px 7px; border-radius: 999px; }
        .nav-item.active .nav-badge { background: var(--accent); color: white; border-color: var(--accent); }
        .main { flex: 1; min-width: 0; padding: 32px; background: var(--bg); }
        .page-header { margin-bottom: 28px; }
        .page-title { font-size: 20px; font-weight: 600; letter-spacing: -0.4px; margin-bottom: 4px; }
        .page-sub { font-size: 13px; color: var(--muted); }
        .stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 28px; }
        .stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 18px 20px; }
        .stat-label { font-size: 12px; color: var(--muted); margin-bottom: 6px; }
        .stat-num { font-size: 22px; font-weight: 600; letter-spacing: -0.5px; }
        .tabs { display: flex; border-bottom: 1px solid var(--border); margin-bottom: 24px; }
        .tab-btn { padding: 10px 16px; font-size: 13px; font-weight: 500; font-family: var(--font); border: none; background: none; cursor: pointer; color: var(--muted); border-bottom: 2px solid transparent; margin-bottom: -1px; transition: color 0.12s, border-color 0.12s; }
        .tab-btn.active { color: var(--accent); border-bottom-color: var(--accent); }
        .card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 24px; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .form-full { grid-column: 1 / -1; }
        .field { display: flex; flex-direction: column; gap: 6px; }
        .label { font-size: 12px; font-weight: 500; color: var(--muted); }
        input, select { width: 100%; padding: 8px 12px; border-radius: var(--radius-sm); border: 1px solid var(--border); background: var(--surface); font-family: var(--font); font-size: 13px; color: var(--text); outline: none; transition: border-color 0.15s, box-shadow 0.15s; height: 36px; }
        input:focus, select:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }
        input::placeholder { color: var(--subtle); }
        .form-actions { display: flex; align-items: center; justify-content: flex-end; gap: 10px; padding-top: 4px; margin-top: 16px; }
        .btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: var(--radius-sm); font-size: 13px; font-weight: 500; font-family: var(--font); border: 1px solid var(--border); cursor: pointer; transition: all 0.12s; white-space: nowrap; }
        .btn-ghost { background: var(--surface); color: var(--muted); }
        .btn-ghost:hover { background: var(--bg); color: var(--text); }
        .btn-primary { background: var(--accent); color: white; border-color: var(--accent); }
        .btn-primary:hover { background: var(--accent-hover); }
        .btn-primary:disabled { opacity: 0.55; cursor: not-allowed; }
        .btn svg { width: 14px; height: 14px; stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
        .btn-primary svg { stroke: white; }
        .btn-danger { background: none; color: var(--danger); border-color: transparent; font-size: 13px; }
        .btn-danger:hover { background: #fef2f2; }
        .table-wrap { overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; font-size: 13px; }
        th { text-align: left; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--subtle); padding: 10px 12px; border-bottom: 1px solid var(--border); white-space: nowrap; }
        td { padding: 12px; border-bottom: 1px solid var(--border); vertical-align: middle; }
        tr:last-child td { border-bottom: none; }
        tr:hover td { background: var(--bg); }
        .prod-cell { display: flex; align-items: center; gap: 10px; }
        .prod-thumb { width: 36px; height: 36px; border-radius: var(--radius-sm); object-fit: cover; background: var(--border); flex-shrink: 0; }
        .prod-name { font-weight: 500; }
        .prod-id { font-size: 11px; color: var(--subtle); }
        .pill { display: inline-block; font-size: 11px; font-weight: 500; padding: 2px 8px; border-radius: 999px; }
        .pill-blue { background: var(--accent-light); color: var(--accent); }
        .preview-strip { display: flex; align-items: center; gap: 12px; padding: 12px; background: var(--bg); border-radius: var(--radius); border: 1px solid var(--border); margin-top: 16px; }
        .preview-img { width: 44px; height: 44px; border-radius: var(--radius-sm); object-fit: cover; background: var(--border); flex-shrink: 0; border: 1px solid var(--border); }
        .preview-name { font-size: 13px; font-weight: 500; flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .preview-price { font-size: 12px; color: var(--muted); }
        .toast-wrap { position: fixed; bottom: 24px; right: 24px; z-index: 200; pointer-events: none; }
        .toast { display: flex; align-items: center; gap: 10px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 12px 16px; box-shadow: var(--shadow-md); font-size: 13px; font-weight: 500; min-width: 240px; animation: slideUp 0.2s ease; }
        .toast.success { border-left: 3px solid var(--success); }
        .toast.error { border-left: 3px solid var(--danger); }
        .toast-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
        .toast.success .toast-dot { background: var(--success); }
        .toast.error .toast-dot { background: var(--danger); }
        @keyframes slideUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @media (max-width: 768px) { .sidebar { display: none; } .main { padding: 20px 16px; } .form-grid { grid-template-columns: 1fr; } .stats-row { grid-template-columns: 1fr 1fr; } }
      `}</style>

      <header className="topbar">
        <div className="logo">
          <div className="logo-mark">
            <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          </div>
          Vitrine
        </div>
        <div className="topbar-sep" />
        <span style={{ fontSize: 13, color: "var(--muted)" }}>Admin</span>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 13, color: "var(--muted)" }}>{user.email}</span>
          <button className="btn btn-danger" onClick={handleLogout}>Sair</button>
        </div>
      </header>

      <div className="layout">
        <aside className="sidebar">
          <div className="sidebar-section">Geral</div>
          <button className="nav-item active">
            <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            Produtos
            <span className="nav-badge">{produtos.length}</span>
          </button>
          <button className="nav-item">
            <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Minha Loja
            <span className="nav-badge">{lojas.length}</span>
          </button>
        </aside>

        <main className="main">
          <div className="page-header">
            <div className="page-title">Gerenciar Catálogo</div>
            <div className="page-sub">Cadastre e visualize os produtos da sua vitrine</div>
          </div>

          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-label">Total de produtos</div>
              <div className="stat-num">{produtos.length}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Lojas ativas</div>
              <div className="stat-num">{lojas.length}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Ticket médio</div>
              <div className="stat-num">{produtos.length > 0 ? formatPrice(produtos.reduce((s: number, p: any) => s + Number(p.preco), 0) / produtos.length) : "—"}</div>
            </div>
          </div>

          <div className="tabs">
            <button className={`tab-btn${tab === "add" ? " active" : ""}`} onClick={() => setTab("add")}>Novo produto</button>
            <button className={`tab-btn${tab === "list" ? " active" : ""}`} onClick={() => setTab("list")}>Meus produtos ({produtos.length})</button>
          </div>

          {tab === "add" && (
            <form onSubmit={cadastrarProduto}>
              <div className="card">
                <div className="form-grid">
                  <div className="field form-full">
                    <label className="label">Nome do produto *</label>
                    <input type="text" value={nome} onChange={e => setNome(e.target.value)} placeholder="Ex: Camiseta Premium" required />
                  </div>
                  <div className="field">
                    <label className="label">Preço (R$) *</label>
                    <input type="number" step="0.01" min="0" value={preco} onChange={e => setPreco(e.target.value)} placeholder="0,00" required />
                  </div>
                  <div className="field">
                    <label className="label">Loja *</label>
                    <select value={lojaId} onChange={e => setLojaId(e.target.value)} required>
                      <option value="">Selecione uma loja</option>
                      {lojas.map((l: any) => <option key={l.id} value={l.id}>{l.nome}</option>)}
                    </select>
                  </div>
                  <div className="field form-full">
                    <label className="label">URL da imagem</label>
                    <input type="url" value={fotoUrl} onChange={e => setFotoUrl(e.target.value)} placeholder="https://..." />
                  </div>
                </div>

                {(nome || preco || fotoUrl) && (
                  <div className="preview-strip">
                    {fotoUrl
                      ? <img src={fotoUrl} className="preview-img" alt="" onError={(e: any) => { e.target.style.display = "none"; }} />
                      : <div className="preview-img" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                        </div>
                    }
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="preview-name">{nome || "Nome do produto"}</div>
                      <div className="preview-price">{preco ? formatPrice(parseFloat(preco)) : "R$ 0,00"}</div>
                    </div>
                    <span className="pill pill-blue">Pré-visualização</span>
                  </div>
                )}
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-ghost" onClick={() => { setNome(""); setPreco(""); setLojaId(""); setFotoUrl(""); }}>Limpar</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? "Salvando…" : <><svg viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg> Publicar produto</>}
                </button>
              </div>
            </form>
          )}

          {tab === "list" && (
            <div className="card" style={{ padding: 0 }}>
              {produtos.length === 0 ? (
                <div style={{ textAlign: "center", padding: "48px 24px", color: "var(--subtle)" }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", margin: "0 auto 10px" }}><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>
                  <p style={{ fontSize: 13 }}>Nenhum produto cadastrado ainda.</p>
                </div>
              ) : (
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr><th>Produto</th><th>Preço</th><th>Loja</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                      {produtos.map((p: any) => (
                        <tr key={p.id}>
                          <td>
                            <div className="prod-cell">
                              <img src={p.foto_url || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80&q=60"} className="prod-thumb" alt="" onError={(e: any) => { e.target.src = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80&q=60"; }} />
                              <div><div className="prod-name">{p.nome}</div><div className="prod-id">#{p.id}</div></div>
                            </div>
                          </td>
                          <td style={{ fontWeight: 500 }}>{formatPrice(p.preco)}</td>
                          <td style={{ color: "var(--muted)" }}>{p.loja_nome || p.loja_id || "—"}</td>
                          <td><span className="pill pill-blue">Ativo</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      <div className="toast-wrap">
        {toast && <div className={`toast ${toast.type}`}><div className="toast-dot" />{toast.msg}</div>}
      </div>
    </>
  );
}