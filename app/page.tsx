"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [lojas, setLojas] = useState<any[]>([]);
  const [produtos, setProdutos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lojaSelecionada, setLojaSelecionada] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("https://motor-saas-ltb4.onrender.com/lojas").then(r => r.json()),
      fetch("https://motor-saas-ltb4.onrender.com/produtos").then(r => r.json()),
    ]).then(([l, p]) => { setLojas(l); setProdutos(p); setLoading(false); });
  }, []);

  async function irParaPagamento(id: number, nome: string, valor: number) {
    setLoadingId(id);
    try {
      const res = await fetch("https://motor-saas-ltb4.onrender.com/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo_produto: nome, preco: valor }),
      });
      const dados = await res.json();
      window.location.href = dados.link_de_pagamento;
    } finally {
      setLoadingId(null);
    }
  }

  const produtosFiltrados = lojaSelecionada
    ? produtos.filter(p => p.loja === lojaSelecionada || p.loja_nome === lojaSelecionada)
    : produtos;

  const formatPrice = (v: number) =>
    Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg: #f9fafb;
          --surface: #ffffff;
          --border: #e5e7eb;
          --border-hover: #d1d5db;
          --text: #111827;
          --muted: #6b7280;
          --subtle: #9ca3af;
          --accent: #2563eb;
          --accent-light: #eff6ff;
          --accent-hover: #1d4ed8;
          --success: #16a34a;
          --radius-sm: 6px;
          --radius: 10px;
          --radius-lg: 14px;
          --font: 'Inter', -apple-system, sans-serif;
          --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
          --shadow-md: 0 4px 6px rgba(0,0,0,0.05), 0 2px 4px rgba(0,0,0,0.04);
        }

        body { background: var(--bg); color: var(--text); font-family: var(--font); font-size: 14px; line-height: 1.5; -webkit-font-smoothing: antialiased; }

        .topbar {
          background: var(--surface);
          border-bottom: 1px solid var(--border);
          height: 56px;
          display: flex;
          align-items: center;
          padding: 0 24px;
          position: sticky;
          top: 0;
          z-index: 50;
          gap: 32px;
        }
        .logo {
          display: flex; align-items: center; gap: 8px;
          font-size: 15px; font-weight: 600; color: var(--text);
          letter-spacing: -0.3px; flex-shrink: 0;
        }
        .logo-mark {
          width: 28px; height: 28px; border-radius: var(--radius-sm);
          background: var(--accent);
          display: flex; align-items: center; justify-content: center;
        }
        .logo-mark svg { width: 14px; height: 14px; stroke: white; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
        .topbar-sep { flex: 1; }
        .topbar-badge {
          display: flex; align-items: center; gap: 6px;
          font-size: 12px; color: var(--success); font-weight: 500;
        }
        .topbar-badge-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--success); }

        .hero {
          background: var(--surface);
          border-bottom: 1px solid var(--border);
          padding: 48px 24px 40px;
        }
        .hero-inner { max-width: 1100px; margin: 0 auto; display: flex; align-items: flex-end; justify-content: space-between; gap: 32px; flex-wrap: wrap; }
        .hero-label {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 12px; font-weight: 500; color: var(--accent);
          background: var(--accent-light);
          padding: 3px 10px; border-radius: 999px;
          margin-bottom: 14px;
        }
        .hero h1 { font-size: 28px; font-weight: 600; letter-spacing: -0.5px; color: var(--text); line-height: 1.25; margin-bottom: 8px; }
        .hero p { font-size: 14px; color: var(--muted); max-width: 420px; }
        .hero-stats { display: flex; gap: 32px; flex-shrink: 0; }
        .hero-stat { text-align: right; }
        .hero-stat-num { font-size: 22px; font-weight: 600; color: var(--text); letter-spacing: -0.5px; }
        .hero-stat-label { font-size: 12px; color: var(--subtle); margin-top: 2px; }

        .layout { max-width: 1100px; margin: 0 auto; padding: 32px 24px 64px; display: flex; gap: 28px; align-items: flex-start; }

        .sidebar { width: 200px; flex-shrink: 0; position: sticky; top: 72px; }
        .sidebar-title { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: var(--subtle); margin-bottom: 10px; padding: 0 8px; }
        .sidebar-item {
          display: flex; align-items: center; gap: 10px;
          padding: 8px 10px; border-radius: var(--radius-sm);
          cursor: pointer; transition: background 0.15s;
          font-size: 13px; color: var(--muted);
          border: none; background: none; width: 100%; text-align: left;
          margin-bottom: 2px; font-family: var(--font);
        }
        .sidebar-item:hover { background: var(--border); color: var(--text); }
        .sidebar-item.active { background: var(--accent-light); color: var(--accent); font-weight: 500; }
        .sidebar-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--border-hover); flex-shrink: 0; }
        .sidebar-item.active .sidebar-dot { background: var(--accent); }

        .content { flex: 1; min-width: 0; }
        .content-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
        .content-title { font-size: 14px; font-weight: 600; color: var(--text); }
        .content-count { font-size: 13px; color: var(--subtle); }

        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px; }

        .card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          overflow: hidden;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .card:hover { border-color: var(--border-hover); box-shadow: var(--shadow-md); }

        .card-img { position: relative; height: 190px; background: #f3f4f6; overflow: hidden; }
        .card-img img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.3s; }
        .card:hover .card-img img { transform: scale(1.03); }
        .card-tag {
          position: absolute; bottom: 10px; left: 10px;
          background: rgba(255,255,255,0.92);
          border: 1px solid var(--border);
          color: var(--text); font-size: 11px; font-weight: 500;
          padding: 3px 8px; border-radius: 4px;
        }

        .card-body { padding: 14px 16px 16px; }
        .card-name { font-size: 14px; font-weight: 500; color: var(--text); margin-bottom: 12px; line-height: 1.4; }
        .card-footer { display: flex; align-items: center; justify-content: space-between; gap: 8px; }

        .price { font-size: 16px; font-weight: 600; color: var(--text); letter-spacing: -0.3px; }

        .btn {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 7px 14px; border-radius: var(--radius-sm);
          font-size: 13px; font-weight: 500; font-family: var(--font);
          border: none; cursor: pointer; transition: background 0.15s, opacity 0.15s;
          white-space: nowrap;
        }
        .btn-primary { background: var(--accent); color: white; }
        .btn-primary:hover { background: var(--accent-hover); }
        .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
        .btn-primary svg { width: 13px; height: 13px; stroke: white; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }

        @keyframes sk { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .sk { background: var(--border); border-radius: var(--radius-sm); animation: sk 1.5s ease-in-out infinite; }
        .sk-card { border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; background: var(--surface); }

        .empty { text-align: center; padding: 64px 24px; color: var(--subtle); grid-column: 1/-1; }
        .empty svg { display: block; margin: 0 auto 10px; }
        .empty p { font-size: 13px; }

        .footer { border-top: 1px solid var(--border); padding: 20px 24px; text-align: center; font-size: 12px; color: var(--subtle); }

        @media (max-width: 640px) {
          .sidebar { display: none; }
          .hero-stats { display: none; }
          .layout { padding: 20px 16px 48px; }
        }
      `}</style>

      <header className="topbar">
        <div className="logo">
          <div className="logo-mark">
            <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          </div>
          Vitrine
        </div>
        <div className="topbar-sep" />
        <div className="topbar-badge">
          <div className="topbar-badge-dot" />
          Sistema operacional
        </div>
      </header>

      <section className="hero">
        <div className="hero-inner">
          <div>
            <div className="hero-label">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
              Catálogo atualizado
            </div>
            <h1>Produtos disponíveis<br />para compra agora</h1>
            <p>Navegue pelo catálogo das lojas parceiras e finalize sua compra com segurança.</p>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-num">{loading ? "—" : produtos.length}</div>
              <div className="hero-stat-label">Produtos</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-num">{loading ? "—" : lojas.length}</div>
              <div className="hero-stat-label">Lojas</div>
            </div>
          </div>
        </div>
      </section>

      <div className="layout">
        <aside className="sidebar">
          <div className="sidebar-title">Lojas</div>
          <button
            className={`sidebar-item${lojaSelecionada === null ? " active" : ""}`}
            onClick={() => setLojaSelecionada(null)}
          >
            <div className="sidebar-dot" />
            Todas as lojas
          </button>
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="sk" style={{ height: 32, marginBottom: 4, borderRadius: 6 }} />
              ))
            : lojas.map(loja => (
                <button
                  key={loja.id}
                  className={`sidebar-item${lojaSelecionada === (loja.nome ?? loja.id) ? " active" : ""}`}
                  onClick={() => setLojaSelecionada(loja.nome ?? loja.id)}
                >
                  <div className="sidebar-dot" />
                  {loja.nome}
                </button>
              ))}
        </aside>

        <div className="content">
          <div className="content-header">
            <span className="content-title">
              {lojaSelecionada ?? "Todos os produtos"}
            </span>
            {!loading && (
              <span className="content-count">
                {produtosFiltrados.length} {produtosFiltrados.length === 1 ? "item" : "itens"}
              </span>
            )}
          </div>

          <div className="grid">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="sk-card">
                    <div className="sk" style={{ height: 190, borderRadius: 0 }} />
                    <div style={{ padding: "14px 16px 16px" }}>
                      <div className="sk" style={{ height: 14, width: "70%", marginBottom: 12 }} />
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div className="sk" style={{ height: 18, width: 80 }} />
                        <div className="sk" style={{ height: 32, width: 90, borderRadius: 6 }} />
                      </div>
                    </div>
                  </div>
                ))
              : produtosFiltrados.length === 0
              ? (
                <div className="empty">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                  </svg>
                  <p>Nenhum produto encontrado nesta loja.</p>
                </div>
              )
              : produtosFiltrados.map(prod => (
                <div key={prod.id} className="card">
                  <div className="card-img">
                    <img
                      src={prod.foto_url || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80"}
                      alt={prod.nome}
                      onError={(e: any) => { e.target.src = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80"; }}
                    />
                    <span className="card-tag">{prod.loja_nome || prod.loja || "Loja"}</span>
                  </div>
                  <div className="card-body">
                    <div className="card-name">{prod.nome}</div>
                    <div className="card-footer">
                      <div className="price">{formatPrice(prod.preco)}</div>
                      <button
                        className="btn btn-primary"
                        disabled={loadingId === prod.id}
                        onClick={() => irParaPagamento(prod.id, prod.nome, prod.preco)}
                      >
                        {loadingId === prod.id
                          ? "Aguarde…"
                          : <>Comprar <svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg></>
                        }
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      <footer className="footer">
        © {new Date().getFullYear()} Vitrine SaaS — Todos os direitos reservados
      </footer>
    </>
  );
}