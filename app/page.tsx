"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [lojas, setLojas] = useState<any[]>([]);
  const [produtos, setProdutos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lojaSelecionada, setLojaSelecionada] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("https://motor-saas-ltb4.onrender.com/lojas").then(r => r.json()),
      fetch("https://motor-saas-ltb4.onrender.com/produtos").then(r => r.json()),
    ])
      .then(([l, p]) => { setLojas(l); setProdutos(p); setLoading(false); })
      .catch(() => setLoading(false));
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

  const produtosFiltrados = produtos
    .filter(p => lojaSelecionada ? p.loja_id === lojaSelecionada : true)
    .filter(p => busca.trim() ? p.nome.toLowerCase().includes(busca.toLowerCase()) : true);

  const formatPrice = (v: number) =>
    Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const nomeLojaById = (id: string) => lojas.find(l => l.id === id)?.nome ?? "";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg: #0f0f11;
          --surface: #17171a;
          --surface-2: #1e1e23;
          --border: rgba(255,255,255,0.07);
          --border-hover: rgba(255,255,255,0.14);
          --text: #f1f0ee;
          --muted: #8a8894;
          --subtle: #5a5868;
          --accent: #e8a838;
          --accent-dim: rgba(232,168,56,0.12);
          --accent-hover: #f0bc58;
          --font-display: 'Playfair Display', Georgia, serif;
          --font-body: 'DM Sans', sans-serif;
          --radius: 12px;
          --radius-lg: 16px;
        }

        body {
          background: var(--bg);
          color: var(--text);
          font-family: var(--font-body);
          font-size: 14px;
          -webkit-font-smoothing: antialiased;
          min-height: 100vh;
        }

        /* TOPBAR */
        .topbar {
          background: rgba(15,15,17,0.85);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--border);
          height: 60px;
          display: flex;
          align-items: center;
          padding: 0 32px;
          position: sticky;
          top: 0;
          z-index: 50;
        }
        .logo {
          display: flex; align-items: center; gap: 10px;
          font-family: var(--font-display);
          font-size: 18px;
          color: var(--text);
        }
        .logo-mark {
          width: 32px; height: 32px; border-radius: 8px;
          background: var(--accent);
          display: flex; align-items: center; justify-content: center;
        }
        .logo-mark svg { width: 15px; height: 15px; stroke: #0f0f11; fill: none; stroke-width: 2.2; }

        .search-wrap {
          flex: 1; max-width: 360px; margin-left: auto; position: relative;
        }
        .search-wrap svg {
          position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
          width: 14px; height: 14px; stroke: var(--subtle); fill: none; pointer-events: none;
        }
        .search-input {
          width: 100%;
          background: var(--surface-2);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 9px 14px 9px 34px;
          color: var(--text);
          font-family: var(--font-body);
          font-size: 13px;
          outline: none;
          transition: border-color 0.2s;
        }
        .search-input::placeholder { color: var(--subtle); }
        .search-input:focus { border-color: var(--accent); }

        /* HERO */
        .hero {
          border-bottom: 1px solid var(--border);
          padding: 60px 32px 48px;
          position: relative; overflow: hidden;
        }
        .hero::before {
          content: '';
          position: absolute; top: -100px; right: -60px;
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(232,168,56,0.07) 0%, transparent 65%);
          pointer-events: none;
        }
        .hero-inner {
          max-width: 1120px; margin: 0 auto;
          display: flex; align-items: flex-end; justify-content: space-between;
          gap: 24px; flex-wrap: wrap;
        }
        .hero h1 {
          font-family: var(--font-display);
          font-size: clamp(26px, 3.5vw, 38px);
          font-weight: 700;
          line-height: 1.15;
          letter-spacing: -0.4px;
          margin-bottom: 10px;
        }
        .hero h1 span { color: var(--accent); }
        .hero p { color: var(--muted); font-size: 15px; font-weight: 300; }
        .hero-stats { display: flex; gap: 32px; }
        .stat { text-align: right; }
        .stat strong {
          display: block; font-size: 24px; font-weight: 600;
          font-family: var(--font-display); color: var(--text);
        }
        .stat span { font-size: 10px; color: var(--subtle); text-transform: uppercase; letter-spacing: 0.8px; }

        /* LAYOUT */
        .layout {
          max-width: 1120px; margin: 0 auto;
          padding: 40px 32px 80px;
          display: flex; gap: 32px; align-items: flex-start;
        }

        /* SIDEBAR */
        .sidebar { width: 184px; flex-shrink: 0; position: sticky; top: 76px; }
        .sidebar-label {
          font-size: 10px; font-weight: 500; letter-spacing: 1.2px;
          color: var(--subtle); text-transform: uppercase;
          margin-bottom: 12px; padding-left: 10px;
        }
        .sidebar-item {
          display: flex; align-items: center; gap: 8px;
          padding: 9px 10px; border-radius: 8px;
          cursor: pointer; font-size: 13px;
          color: var(--muted); border: none; background: none;
          width: 100%; text-align: left; margin-bottom: 2px;
          transition: color 0.15s, background 0.15s;
          font-family: var(--font-body);
        }
        .sidebar-item:hover { color: var(--text); background: var(--surface-2); }
        .sidebar-item.active { background: var(--accent-dim); color: var(--accent); font-weight: 500; }
        .sidebar-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--subtle); flex-shrink: 0;
        }
        .sidebar-item.active .sidebar-dot { background: var(--accent); }

        /* GRID */
        .grid-wrap { flex: 1; min-width: 0; }
        .grid-count { font-size: 12px; color: var(--muted); margin-bottom: 20px; }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
          gap: 16px;
        }

        /* CARD */
        .card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          overflow: hidden;
          transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
          animation: fadeUp 0.4s both;
        }
        .card:hover {
          transform: translateY(-4px);
          border-color: var(--border-hover);
          box-shadow: 0 16px 48px rgba(0,0,0,0.5);
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .card:nth-child(1)  { animation-delay: 0.04s; }
        .card:nth-child(2)  { animation-delay: 0.09s; }
        .card:nth-child(3)  { animation-delay: 0.14s; }
        .card:nth-child(4)  { animation-delay: 0.19s; }
        .card:nth-child(5)  { animation-delay: 0.23s; }
        .card:nth-child(6)  { animation-delay: 0.27s; }
        .card:nth-child(n+7){ animation-delay: 0.30s; }

        .card-img {
          height: 196px; background: var(--surface-2);
          position: relative; overflow: hidden;
        }
        .card-img img {
          width: 100%; height: 100%; object-fit: cover;
          transition: transform 0.4s ease;
        }
        .card:hover .card-img img { transform: scale(1.05); }
        .card-badge {
          position: absolute; bottom: 10px; left: 10px;
          background: rgba(15,15,17,0.78);
          backdrop-filter: blur(8px);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 3px 10px;
          font-size: 10px; color: var(--muted);
        }
        .card-body { padding: 14px 16px 16px; }
        .card-nome {
          font-size: 14px; font-weight: 500; color: var(--text);
          margin-bottom: 14px; line-height: 1.4;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .card-footer {
          display: flex; align-items: center;
          justify-content: space-between; gap: 8px;
        }
        .card-preco {
          font-family: var(--font-display);
          font-size: 17px; font-weight: 600; color: var(--text);
        }
        .btn-buy {
          background: var(--accent); color: #0f0f11;
          padding: 8px 15px; border-radius: 8px;
          font-size: 12px; font-weight: 500;
          font-family: var(--font-body);
          border: none; cursor: pointer;
          transition: background 0.15s, transform 0.1s;
          display: flex; align-items: center; gap: 6px;
          white-space: nowrap;
        }
        .btn-buy:hover:not(:disabled) { background: var(--accent-hover); transform: scale(1.03); }
        .btn-buy:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }
        .btn-buy svg { width: 13px; height: 13px; fill: none; stroke: currentColor; stroke-width: 2; }

        /* SKELETON */
        .sk { background: var(--surface-2); border-radius: 6px; animation: pulse 1.8s infinite; }
        @keyframes pulse { 0%,100%{ opacity:1 } 50%{ opacity:0.35 } }

        /* EMPTY */
        .empty {
          grid-column: 1/-1; text-align: center;
          padding: 72px 24px; color: var(--muted);
        }
        .empty svg { width: 36px; height: 36px; stroke: var(--subtle); fill: none; margin-bottom: 12px; display: block; margin-inline: auto; }

        /* FOOTER */
        footer {
          border-top: 1px solid var(--border);
          padding: 24px 32px;
          text-align: center;
          font-size: 11px; color: var(--subtle);
        }

        @media (max-width: 700px) {
          .topbar { padding: 0 16px; }
          .hero { padding: 40px 16px 32px; }
          .layout { flex-direction: column; padding: 24px 16px 60px; }
          .sidebar { width: 100%; position: static; display: flex; flex-wrap: wrap; gap: 6px; }
          .sidebar-label { width: 100%; }
          .sidebar-item { width: auto; }
        }
      `}</style>

      <header className="topbar">
        <div className="logo">
          <div className="logo-mark">
            <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          </div>
          Vitrine
        </div>
        <div className="search-wrap">
          <svg viewBox="0 0 24 24" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input
            className="search-input"
            type="text"
            placeholder="Buscar produto..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
          />
        </div>
      </header>

      <section className="hero">
        <div className="hero-inner">
          <div>
            <h1>Os melhores produtos<br/>das nossas <span>lojas</span></h1>
            <p>Compra segura · Pagamento via Mercado Pago</p>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <strong>{loading ? "—" : produtos.length}</strong>
              <span>Produtos</span>
            </div>
            <div className="stat">
              <strong>{loading ? "—" : lojas.length}</strong>
              <span>Lojas</span>
            </div>
          </div>
        </div>
      </section>

      <div className="layout">
        <aside className="sidebar">
          <div className="sidebar-label">Lojas</div>
          <button
            className={`sidebar-item${lojaSelecionada === null ? " active" : ""}`}
            onClick={() => setLojaSelecionada(null)}
          >
            <span className="sidebar-dot" /> Todas
          </button>
          {lojas.map(l => (
            <button
              key={l.id}
              className={`sidebar-item${lojaSelecionada === l.id ? " active" : ""}`}
              onClick={() => setLojaSelecionada(l.id)}
            >
              <span className="sidebar-dot" /> {l.nome}
            </button>
          ))}
        </aside>

        <div className="grid-wrap">
          <div className="grid-count">
            {loading ? "Carregando produtos..." : `${produtosFiltrados.length} produto${produtosFiltrados.length !== 1 ? "s" : ""} encontrado${produtosFiltrados.length !== 1 ? "s" : ""}`}
          </div>

          <div className="grid">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
                    <div className="sk" style={{ height: "196px", borderRadius: 0 }} />
                    <div style={{ padding: "14px 16px 16px", display: "grid", gap: "10px" }}>
                      <div className="sk" style={{ height: "13px", width: "70%" }} />
                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
                        <div className="sk" style={{ height: "20px", width: "38%" }} />
                        <div className="sk" style={{ height: "32px", width: "68px", borderRadius: "8px" }} />
                      </div>
                    </div>
                  </div>
                ))
              : produtosFiltrados.length === 0
              ? (
                  <div className="empty">
                    <svg viewBox="0 0 24 24" strokeWidth="1.5"><path d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z"/></svg>
                    <p>Nenhum produto encontrado.</p>
                  </div>
                )
              : produtosFiltrados.map(prod => (
                  <div key={prod.id} className="card">
                    <div className="card-img">
                      <img
                        src={prod.foto_url || "https://placehold.co/400x400/1e1e23/5a5868?text=Sem+foto"}
                        alt={prod.nome}
                        loading="lazy"
                      />
                      {prod.loja_id && nomeLojaById(prod.loja_id) && (
                        <span className="card-badge">{nomeLojaById(prod.loja_id)}</span>
                      )}
                    </div>
                    <div className="card-body">
                      <div className="card-nome" title={prod.nome}>{prod.nome}</div>
                      <div className="card-footer">
                        <span className="card-preco">{formatPrice(prod.preco)}</span>
                        <button
                          className="btn-buy"
                          disabled={loadingId === prod.id}
                          onClick={() => irParaPagamento(prod.id, prod.nome, prod.preco)}
                        >
                          {loadingId === prod.id ? "Aguarde..." : (
                            <>
                              <svg viewBox="0 0 24 24"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                              Comprar
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
            }
          </div>
        </div>
      </div>

      <footer>© {new Date().getFullYear()} Vitrine · Todos os direitos reservados</footer>
    </>
  );
}
