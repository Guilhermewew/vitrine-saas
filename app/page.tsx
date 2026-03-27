"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [lojas, setLojas] = useState<any[]>([]);
  const [produtos, setProdutos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lojaSelecionada, setLojaSelecionada] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  useEffect(() => {
    // Busca lojas e produtos ao carregar
    Promise.all([
      fetch("https://motor-saas-ltb4.onrender.com/lojas").then(r => r.json()),
      fetch("https://motor-saas-ltb4.onrender.com/produtos").then(r => r.json()), // Busca global
    ]).then(([l, p]) => { 
      setLojas(l); 
      setProdutos(p); 
      setLoading(false); 
    }).catch(() => setLoading(false));
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

  // Filtro por loja selecionada
  const produtosFiltrados = lojaSelecionada
    ? produtos.filter(p => p.loja_id === lojaSelecionada || p.loja_nome === lojaSelecionada)
    : produtos;

  const formatPrice = (v: number) =>
    Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg: #f9fafb; --surface: #ffffff; --border: #e5e7eb; --border-hover: #d1d5db;
          --text: #111827; --muted: #6b7280; --subtle: #9ca3af; --accent: #2563eb;
          --accent-light: #eff6ff; --accent-hover: #1d4ed8; --success: #16a34a;
          --radius-sm: 6px; --radius: 10px; --radius-lg: 14px; --font: 'Inter', sans-serif;
          --shadow-sm: 0 1px 2px rgba(0,0,0,0.05); --shadow-md: 0 4px 6px rgba(0,0,0,0.05);
        }
        body { background: var(--bg); color: var(--text); font-family: var(--font); font-size: 14px; -webkit-font-smoothing: antialiased; }
        .topbar { background: var(--surface); border-bottom: 1px solid var(--border); height: 56px; display: flex; align-items: center; padding: 0 24px; position: sticky; top: 0; z-index: 50; gap: 32px; }
        .logo { display: flex; align-items: center; gap: 8px; font-size: 15px; font-weight: 600; }
        .logo-mark { width: 28px; height: 28px; border-radius: var(--radius-sm); background: var(--accent); display: flex; align-items: center; justify-content: center; }
        .logo-mark svg { width: 14px; height: 14px; stroke: white; fill: none; stroke-width: 2; }
        .hero { background: var(--surface); border-bottom: 1px solid var(--border); padding: 48px 24px 40px; }
        .hero-inner { max-width: 1100px; margin: 0 auto; display: flex; align-items: flex-end; justify-content: space-between; gap: 32px; flex-wrap: wrap; }
        .layout { max-width: 1100px; margin: 0 auto; padding: 32px 24px 64px; display: flex; gap: 28px; }
        .sidebar { width: 200px; flex-shrink: 0; position: sticky; top: 72px; }
        .sidebar-item { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: var(--radius-sm); cursor: pointer; font-size: 13px; color: var(--muted); border: none; background: none; width: 100%; text-align: left; margin-bottom: 2px; }
        .sidebar-item.active { background: var(--accent-light); color: var(--accent); font-weight: 500; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px; flex: 1; }
        .card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; transition: 0.15s; }
        .card:hover { border-color: var(--border-hover); box-shadow: var(--shadow-md); }
        .card-img { height: 190px; background: #f3f4f6; }
        .card-img img { width: 100%; height: 100%; object-fit: cover; }
        .card-body { padding: 14px 16px 16px; }
        .btn-primary { background: var(--accent); color: white; padding: 7px 14px; border-radius: var(--radius-sm); font-size: 13px; font-weight: 500; border: none; cursor: pointer; }
        .sk { background: var(--border); border-radius: var(--radius-sm); animation: sk 1.5s infinite; height: 20px; }
        @keyframes sk { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>

      <header className="topbar">
        <div className="logo">
          <div className="logo-mark"><svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg></div>
          Vitrine
        </div>
      </header>

      <section className="hero">
        <div className="hero-inner">
          <div>
            <h1>Produtos Disponíveis</h1>
            <p style={{ color: "var(--muted)" }}>Navegue pelo catálogo e compre com segurança.</p>
          </div>
          <div style={{ display: "flex", gap: "20px" }}>
             <div style={{ textAlign: "right" }}><strong>{produtos.length}</strong><div style={{ fontSize: "12px", color: "var(--subtle)" }}>Produtos</div></div>
             <div style={{ textAlign: "right" }}><strong>{lojas.length}</strong><div style={{ fontSize: "12px", color: "var(--subtle)" }}>Lojas</div></div>
          </div>
        </div>
      </section>

      <div className="layout">
        <aside className="sidebar">
          <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--subtle)", marginBottom: "10px" }}>LOJAS</div>
          <button className={`sidebar-item${lojaSelecionada === null ? " active" : ""}`} onClick={() => setLojaSelecionada(null)}>Todas</button>
          {lojas.map(l => (
            <button key={l.id} className={`sidebar-item${lojaSelecionada === l.id ? " active" : ""}`} onClick={() => setLojaSelecionada(l.id)}>
              {l.nome}
            </button>
          ))}
        </aside>

        <div className="grid">
          {loading ? <div className="sk" style={{ width: "100%", height: "200px" }}></div> : 
            produtosFiltrados.map(prod => (
              <div key={prod.id} className="card">
                <div className="card-img">
                  <img src={prod.foto_url || "https://via.placeholder.com/400"} alt={prod.nome} />
                </div>
                <div className="card-body">
                  <div style={{ fontWeight: 500, marginBottom: "10px" }}>{prod.nome}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontWeight: 600 }}>{formatPrice(prod.preco)}</div>
                    <button className="btn-primary" disabled={loadingId === prod.id} onClick={() => irParaPagamento(prod.id, prod.nome, prod.preco)}>
                      {loadingId === prod.id ? "..." : "Comprar"}
                    </button>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </>
  );
}