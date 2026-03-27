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
        .logo { display: flex; align-items: center; gap: 10px; font-family: var(--font-display); font-size: 18px; color: var(--text); }
        .logo-mark { width: 32px; height: 32px; border-radius: 8px; background: var(--accent); display: flex; align-items: center; justify-content: center; }
        .logo-mark svg { width: 15px; height: 15px; stroke: #0f0f11; fill: none; stroke-width: 2.2; }

        .search-wrap { flex: 1; max-width: 360px; margin-left: auto; position: relative; }
        .search-wrap svg { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); width: 14px; height: 14px; stroke: var(--subtle); fill: none; }
        .search-input { width: 100%; background: var(--surface-2); border: 1px solid var(--border); border-radius: 8px; padding: 9px 14px 9px 34px; color: var(--text); font-family: var(--font-body); font-size: 13px; outline: none; transition: 0.2s; }
        .search-input:focus { border-color: var(--accent); }

        /* HERO */
        .hero { border-bottom: 1px solid var(--border); padding: 60px 32px 48px; position: relative; overflow: hidden; }
        .hero-inner { max-width: 1300px; margin: 0 auto; display: flex; align-items: flex-end; justify-content: space-between; gap: 24px; flex-wrap: wrap; }
        .hero h1 { font-family: var(--font-display); font-size: clamp(26px, 3.5vw, 38px); font-weight: 700; line-height: 1.15; margin-bottom: 10px; }
        .hero h1 span { color: var(--accent); }
        .hero p { color: var(--muted); font-size: 15px; font-weight: 300; }

        /* LAYOUT AJUSTADO */
        .layout {
          max-width: 1300px; /* Aumentado para ocupar mais tela */
          margin: 0 auto;
          padding: 40px 32px 80px;
          display: flex; 
          gap: 40px; /* Espaço entre lojas e produtos */
          align-items: flex-start;
        }

        /* SIDEBAR FIXA NA ESQUERDA */
        .sidebar { 
          width: 220px; 
          flex-shrink: 0; 
          position: sticky; 
          top: 100px; 
        }
        .sidebar-label { font-size: 10px; font-weight: 500; letter-spacing: 1.2px; color: var(--subtle); text-transform: uppercase; margin-bottom: 12px; padding-left: 10px; }
        .sidebar-item { display: flex; align-items: center; gap: 10px; padding: 10px; border-radius: 8px; cursor: pointer; font-size: 13px; color: var(--muted); border: none; background: none; width: 100%; text-align: left; transition: 0.15s; }
        .sidebar-item:hover { color: var(--text); background: var(--surface-2); }
        .sidebar-item.active { background: var(--accent-dim); color: var(--accent); font-weight: 500; }
        .sidebar-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--subtle); }
        .sidebar-item.active .sidebar-dot { background: var(--accent); }

        /* GRID OCUPANDO O RESTO DA TELA */
        .grid-wrap { flex: 1; min-width: 0; }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); /* Cards maiores */
          gap: 20px;
        }

        /* CARD */
        .card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; transition: 0.2s; animation: fadeUp 0.4s both; }
        .card:hover { transform: translateY(-4px); border-color: var(--border-hover); box-shadow: 0 16px 48px rgba(0,0,0,0.5); }
        .card-img { height: 210px; background: var(--surface-2); position: relative; overflow: hidden; }
        .card-img img { width: 100%; height: 100%; object-fit: cover; transition: 0.4s ease; }
        .card-body { padding: 16px; }
        .card-nome { font-size: 14px; font-weight: 500; color: var(--text); margin-bottom: 14px; }
        .card-footer { display: flex; align-items: center; justify-content: space-between; }
        .card-preco { font-family: var(--font-display); font-size: 18px; font-weight: 600; }
        .btn-buy { background: var(--accent); color: #0f0f11; padding: 8px 16px; border-radius: 8px; font-size: 12px; font-weight: 600; border: none; cursor: pointer; display: flex; align-items: center; gap: 6px; }
        
        @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }

        @media (max-width: 800px) {
          .layout { flex-direction: column; padding: 24px 16px; }
          .sidebar { width: 100%; position: static; display: flex; overflow-x: auto; padding-bottom: 10px; gap: 8px; }
          .sidebar-item { width: auto; white-space: nowrap; }
        }
      `}</style>

      <header className="topbar">
        <div className="logo">
          <div className="logo-mark"><svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg></div>
          Vitrine
        </div>
        <div className="search-wrap">
          <svg viewBox="0 0 24 24" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input className="search-input" type="text" placeholder="Buscar produto..." value={busca} onChange={e => setBusca(e.target.value)} />
        </div>
      </header>

      <section className="hero">
        <div className="hero-inner">
          <div>
            <h1>Os melhores produtos<br/>das nossas <span>lojas</span></h1>
            <p>Compra segura · Pagamento via Mercado Pago</p>
          </div>
          <div style={{ display: "flex", gap: "32px" }}>
            <div style={{ textAlign: "right" }}>
              <strong style={{ display: "block", fontSize: "24px", fontFamily: "var(--font-display)" }}>{loading ? "—" : produtos.length}</strong>
              <span style={{ fontSize: "10px", color: "var(--subtle)", textTransform: "uppercase" }}>Produtos</span>
            </div>
            <div style={{ textAlign: "right" }}>
              <strong style={{ display: "block", fontSize: "24px", fontFamily: "var(--font-display)" }}>{loading ? "—" : lojas.length}</strong>
              <span style={{ fontSize: "10px", color: "var(--subtle)", textTransform: "uppercase" }}>Lojas</span>
            </div>
          </div>
        </div>
      </section>

      <div className="layout">
        <aside className="sidebar">
          <div className="sidebar-label">Lojas</div>
          <button className={`sidebar-item${lojaSelecionada === null ? " active" : ""}`} onClick={() => setLojaSelecionada(null)}>
            <span className="sidebar-dot" /> Todas
          </button>
          {lojas.map(l => (
            <button key={l.id} className={`sidebar-item${lojaSelecionada === l.id ? " active" : ""}`} onClick={() => setLojaSelecionada(l.id)}>
              <span className="sidebar-dot" /> {l.nome}
            </button>
          ))}
        </aside>

        <div className="grid-wrap">
          <div style={{ fontSize: "12px", color: "var(--muted)", marginBottom: "20px" }}>
            {loading ? "Carregando..." : `${produtosFiltrados.length} encontrados`}
          </div>

          <div className="grid">
            {loading ? (
              <div style={{ color: "var(--muted)" }}>Carregando catálogo...</div>
            ) : produtosFiltrados.length === 0 ? (
              <div style={{ color: "var(--muted)", padding: "40px 0" }}>Nenhum produto encontrado.</div>
            ) : (
              produtosFiltrados.map(prod => (
                <div key={prod.id} className="card">
                  <div className="card-img">
                    <img src={prod.foto_url || "https://placehold.co/400x400/1e1e23/5a5868?text=Sem+foto"} alt={prod.nome} />
                    <span style={{ position: "absolute", bottom: "10px", left: "10px", background: "rgba(0,0,0,0.6)", padding: "4px 10px", borderRadius: "20px", fontSize: "10px" }}>
                      {nomeLojaById(prod.loja_id)}
                    </span>
                  </div>
                  <div className="card-body">
                    <div className="card-nome">{prod.nome}</div>
                    <div className="card-footer">
                      <span className="card-preco">{formatPrice(prod.preco)}</span>
                      <button className="btn-buy" disabled={loadingId === prod.id} onClick={() => irParaPagamento(prod.id, prod.nome, prod.preco)}>
                        {loadingId === prod.id ? "..." : "Comprar"}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <footer style={{ borderTop: "1px solid var(--border)", padding: "24px", textAlign: "center", fontSize: "11px", color: "var(--subtle)" }}>
        © {new Date().getFullYear()} Vitrine · Todos os direitos reservados
      </footer>
    </>
  );
}