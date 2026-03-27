"use client";
import { useState, useEffect } from "react";

export default function Admin() {
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [lojaId, setLojaId] = useState("");
  const [fotoUrl, setFotoUrl] = useState("");
  const [lojas, setLojas] = useState<any[]>([]);
  const [produtos, setProdutos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [tab, setTab] = useState<"add" | "list">("add");

  useEffect(() => {
    fetch("https://motor-saas-ltb4.onrender.com/lojas").then(r => r.json()).then(setLojas).catch(() => {});
    fetch("https://motor-saas-ltb4.onrender.com/produtos").then(r => r.json()).then(setProdutos).catch(() => {});
  }, []);

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
        body: JSON.stringify({ nome, preco: parseFloat(preco), foto_url: fotoUrl, loja_id: lojaId }),
      });
      if (res.ok) {
        showToast("Produto cadastrado com sucesso.", "success");
        const novo = await res.json().catch(() => ({ id: Date.now(), nome, preco: parseFloat(preco), foto_url: fotoUrl, loja_id: lojaId }));
        setProdutos(prev => [novo, ...prev]);
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

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
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
          --danger: #dc2626;
          --danger-light: #fef2f2;
          --success: #16a34a;
          --success-light: #f0fdf4;
          --font: 'Inter', -apple-system, sans-serif;
          --radius-sm: 6px;
          --radius: 10px;
          --radius-lg: 14px;
          --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
          --shadow: 0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04);
          --shadow-md: 0 4px 6px rgba(0,0,0,0.05), 0 2px 4px rgba(0,0,0,0.04);
        }
        body { background: var(--bg); color: var(--text); font-family: var(--font); font-size: 14px; -webkit-font-smoothing: antialiased; }

        /* TOPBAR */
        .topbar {
          background: var(--surface); border-bottom: 1px solid var(--border);
          height: 56px; display: flex; align-items: center; padding: 0 24px;
          position: sticky; top: 0; z-index: 50; gap: 16px;
        }
        .logo { display: flex; align-items: center; gap: 8px; font-size: 15px; font-weight: 600; letter-spacing: -0.3px; }
        .logo-mark { width: 28px; height: 28px; border-radius: var(--radius-sm); background: var(--accent); display: flex; align-items: center; justify-content: center; }
        .logo-mark svg { width: 14px; height: 14px; stroke: white; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
        .topbar-sep { height: 18px; width: 1px; background: var(--border); }
        .topbar-breadcrumb { font-size: 13px; color: var(--muted); }
        .topbar-right { margin-left: auto; display: flex; align-items: center; gap: 8px; }
        .avatar { width: 30px; height: 30px; border-radius: 50%; background: var(--accent-light); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 600; color: var(--accent); }

        /* LAYOUT */
        .layout { display: flex; min-height: calc(100vh - 56px); }

        /* SIDEBAR */
        .sidebar { width: 220px; flex-shrink: 0; background: var(--surface); border-right: 1px solid var(--border); padding: 20px 12px; display: flex; flex-direction: column; gap: 4px; }
        .sidebar-section { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: var(--subtle); padding: 0 8px; margin: 16px 0 8px; }
        .sidebar-section:first-child { margin-top: 0; }
        .nav-item {
          display: flex; align-items: center; gap: 10px;
          padding: 8px 10px; border-radius: var(--radius-sm);
          font-size: 13px; color: var(--muted); cursor: pointer;
          border: none; background: none; width: 100%; text-align: left; font-family: var(--font);
          transition: background 0.12s, color 0.12s;
        }
        .nav-item:hover { background: var(--bg); color: var(--text); }
        .nav-item.active { background: var(--accent-light); color: var(--accent); font-weight: 500; }
        .nav-item svg { width: 15px; height: 15px; flex-shrink: 0; }
        .nav-badge { margin-left: auto; background: var(--bg); border: 1px solid var(--border); color: var(--muted); font-size: 11px; padding: 1px 7px; border-radius: 999px; }
        .nav-item.active .nav-badge { background: var(--accent); color: white; border-color: var(--accent); }

        /* MAIN */
        .main { flex: 1; min-width: 0; padding: 32px; background: var(--bg); }
        .page-header { margin-bottom: 28px; }
        .page-title { font-size: 20px; font-weight: 600; letter-spacing: -0.4px; color: var(--text); margin-bottom: 4px; }
        .page-sub { font-size: 13px; color: var(--muted); }

        /* TABS */
        .tabs { display: flex; gap: 0; border-bottom: 1px solid var(--border); margin-bottom: 28px; }
        .tab-btn {
          padding: 10px 16px; font-size: 13px; font-weight: 500; font-family: var(--font);
          border: none; background: none; cursor: pointer; color: var(--muted);
          border-bottom: 2px solid transparent; margin-bottom: -1px;
          transition: color 0.12s, border-color 0.12s;
        }
        .tab-btn.active { color: var(--accent); border-bottom-color: var(--accent); }
        .tab-btn:hover:not(.active) { color: var(--text); }

        /* FORM CARD */
        .card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 24px; }
        .card + .card { margin-top: 16px; }

        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .form-full { grid-column: 1 / -1; }

        .field { display: flex; flex-direction: column; gap: 6px; }
        .label { font-size: 12px; font-weight: 500; color: var(--muted); }
        .label span { color: var(--danger); margin-left: 2px; }

        input, select {
          width: 100%; padding: 8px 12px; border-radius: var(--radius-sm);
          border: 1px solid var(--border); background: var(--surface);
          font-family: var(--font); font-size: 13px; color: var(--text);
          outline: none; transition: border-color 0.15s, box-shadow 0.15s;
          height: 36px;
        }
        input:focus, select:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }
        input::placeholder { color: var(--subtle); }

        /* PREVIEW STRIP */
        .preview-strip { display: flex; align-items: center; gap: 12px; padding: 12px; background: var(--bg); border-radius: var(--radius); border: 1px solid var(--border); margin-top: 8px; }
        .preview-img { width: 44px; height: 44px; border-radius: var(--radius-sm); object-fit: cover; background: var(--border); border: 1px solid var(--border); flex-shrink: 0; }
        .preview-info { flex: 1; min-width: 0; }
        .preview-name { font-size: 13px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .preview-price { font-size: 12px; color: var(--muted); }

        /* ACTIONS */
        .form-actions { display: flex; align-items: center; justify-content: flex-end; gap: 10px; padding-top: 4px; }

        .btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: var(--radius-sm); font-size: 13px; font-weight: 500; font-family: var(--font); border: 1px solid var(--border); cursor: pointer; transition: all 0.12s; white-space: nowrap; }
        .btn-ghost { background: var(--surface); color: var(--muted); }
        .btn-ghost:hover { background: var(--bg); color: var(--text); }
        .btn-primary { background: var(--accent); color: white; border-color: var(--accent); }
        .btn-primary:hover { background: var(--accent-hover); border-color: var(--accent-hover); }
        .btn-primary:disabled { opacity: 0.55; cursor: not-allowed; }
        .btn svg { width: 14px; height: 14px; flex-shrink: 0; }
        .btn-primary svg { stroke: white; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }

        /* TABLE */
        .table-wrap { overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; font-size: 13px; }
        th { text-align: left; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--subtle); padding: 10px 12px; border-bottom: 1px solid var(--border); white-space: nowrap; }
        td { padding: 12px 12px; border-bottom: 1px solid var(--border); color: var(--text); vertical-align: middle; }
        tr:last-child td { border-bottom: none; }
        tr:hover td { background: var(--bg); }

        .prod-cell { display: flex; align-items: center; gap: 10px; }
        .prod-thumb { width: 36px; height: 36px; border-radius: var(--radius-sm); object-fit: cover; background: var(--border); flex-shrink: 0; }
        .prod-name { font-weight: 500; }
        .prod-id { font-size: 11px; color: var(--subtle); }

        .pill { display: inline-block; font-size: 11px; font-weight: 500; padding: 2px 8px; border-radius: 999px; }
        .pill-blue { background: var(--accent-light); color: var(--accent); }

        /* TOAST */
        .toast-wrap { position: fixed; bottom: 24px; right: 24px; z-index: 200; display: flex; flex-direction: column; gap: 8px; pointer-events: none; }
        .toast {
          display: flex; align-items: center; gap: 10px;
          background: var(--surface); border: 1px solid var(--border);
          border-radius: var(--radius); padding: 12px 16px;
          box-shadow: var(--shadow-md); font-size: 13px; font-weight: 500;
          animation: slideUp 0.2s ease;
          pointer-events: all; min-width: 240px;
        }
        .toast.success { border-left: 3px solid var(--success); }
        .toast.error { border-left: 3px solid var(--danger); }
        .toast-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
        .toast.success .toast-dot { background: var(--success); }
        .toast.error .toast-dot { background: var(--danger); }
        @keyframes slideUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

        /* STATS ROW */
        .stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 28px; }
        .stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 18px 20px; }
        .stat-label { font-size: 12px; color: var(--muted); margin-bottom: 6px; }
        .stat-num { font-size: 22px; font-weight: 600; letter-spacing: -0.5px; color: var(--text); }

        @media (max-width: 768px) {
          .sidebar { display: none; }
          .main { padding: 20px 16px; }
          .form-grid { grid-template-columns: 1fr; }
          .stats-row { grid-template-columns: 1fr 1fr; }
        }
      `}</style>

      {/* TOPBAR */}
      <header className="topbar">
        <div className="logo">
          <div className="logo-mark">
            <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          </div>
          Vitrine
        </div>
        <div className="topbar-sep" />
        <span className="topbar-breadcrumb">Admin</span>
        <div className="topbar-right">
          <div className="avatar">AD</div>
        </div>
      </header>

      <div className="layout">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="sidebar-section">Geral</div>
          <button className="nav-item active">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            Produtos
            <span className="nav-badge">{produtos.length}</span>
          </button>
          <button className="nav-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Lojas
            <span className="nav-badge">{lojas.length}</span>
          </button>
          <div className="sidebar-section">Sistema</div>
          <button className="nav-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14"/></svg>
            Configurações
          </button>
        </aside>

        {/* MAIN */}
        <main className="main">
          <div className="page-header">
            <div className="page-title">Produtos</div>
            <div className="page-sub">Gerencie o catálogo da sua vitrine</div>
          </div>

          {/* STATS */}
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
              <div className="stat-num">
                {produtos.length > 0
                  ? formatPrice(produtos.reduce((s, p) => s + Number(p.preco), 0) / produtos.length)
                  : "—"}
              </div>
            </div>
          </div>

          {/* TABS */}
          <div className="tabs">
            <button className={`tab-btn${tab === "add" ? " active" : ""}`} onClick={() => setTab("add")}>Cadastrar produto</button>
            <button className={`tab-btn${tab === "list" ? " active" : ""}`} onClick={() => setTab("list")}>
              Todos os produtos ({produtos.length})
            </button>
          </div>

          {/* TAB: ADD */}
          {tab === "add" && (
            <form onSubmit={cadastrarProduto}>
              <div className="card">
                <div className="form-grid">
                  <div className="field form-full">
                    <label className="label">Nome do produto <span>*</span></label>
                    <input
                      type="text" value={nome} onChange={e => setNome(e.target.value)}
                      placeholder="Ex: Nike Air Max 90" required
                    />
                  </div>

                  <div className="field">
                    <label className="label">Preço (R$) <span>*</span></label>
                    <input
                      type="number" step="0.01" min="0" value={preco}
                      onChange={e => setPreco(e.target.value)}
                      placeholder="0,00" required
                    />
                  </div>

                  <div className="field">
                    <label className="label">Loja <span>*</span></label>
                    {lojas.length > 0 ? (
                      <select value={lojaId} onChange={e => setLojaId(e.target.value)} required>
                        <option value="">Selecione uma loja</option>
                        {lojas.map(l => (
                          <option key={l.id} value={l.id}>{l.nome}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text" value={lojaId} onChange={e => setLojaId(e.target.value)}
                        placeholder="ID da loja" required
                      />
                    )}
                  </div>

                  <div className="field form-full">
                    <label className="label">URL da imagem</label>
                    <input
                      type="url" value={fotoUrl} onChange={e => setFotoUrl(e.target.value)}
                      placeholder="https://exemplo.com/imagem.jpg"
                    />
                  </div>
                </div>

                {/* PREVIEW */}
                {(nome || preco || fotoUrl) && (
                  <div className="preview-strip" style={{ marginTop: 16 }}>
                    {fotoUrl
                      ? <img src={fotoUrl} className="preview-img" alt="" onError={(e: any) => { e.target.style.display = "none"; }} />
                      : <div className="preview-img" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                        </div>
                    }
                    <div className="preview-info">
                      <div className="preview-name">{nome || "Nome do produto"}</div>
                      <div className="preview-price">{preco ? formatPrice(parseFloat(preco)) : "R$ 0,00"}</div>
                    </div>
                    <span className="pill pill-blue">Pré-visualização</span>
                  </div>
                )}
              </div>

              <div className="form-actions" style={{ marginTop: 16 }}>
                <button type="button" className="btn btn-ghost" onClick={() => { setNome(""); setPreco(""); setLojaId(""); setFotoUrl(""); }}>
                  Limpar
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? "Salvando…" : (
                    <>
                      <svg viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                      Salvar produto
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* TAB: LIST */}
          {tab === "list" && (
            <div className="card">
              {produtos.length === 0 ? (
                <div style={{ textAlign: "center", padding: "48px 24px", color: "var(--subtle)" }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", margin: "0 auto 10px" }}>
                    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
                  </svg>
                  <p style={{ fontSize: 13 }}>Nenhum produto cadastrado ainda.</p>
                </div>
              ) : (
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Produto</th>
                        <th>Preço</th>
                        <th>Loja</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {produtos.map(prod => (
                        <tr key={prod.id}>
                          <td>
                            <div className="prod-cell">
                              <img
                                src={prod.foto_url || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80&q=60"}
                                className="prod-thumb" alt=""
                                onError={(e: any) => { e.target.src = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80&q=60"; }}
                              />
                              <div>
                                <div className="prod-name">{prod.nome}</div>
                                <div className="prod-id">#{prod.id}</div>
                              </div>
                            </div>
                          </td>
                          <td style={{ fontWeight: 500 }}>{formatPrice(prod.preco)}</td>
                          <td style={{ color: "var(--muted)" }}>{prod.loja_nome || prod.loja_id || "—"}</td>
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

      {/* TOAST */}
      <div className="toast-wrap">
        {toast && (
          <div className={`toast ${toast.type}`}>
            <div className="toast-dot" />
            {toast.msg}
          </div>
        )}
      </div>
    </>
  );
}