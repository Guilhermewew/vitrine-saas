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
  // NOVO: Estado para guardar o arquivo da foto
  const [fotoArquivo, setFotoArquivo] = useState<File | null>(null);
  
  const [lojas, setLojas] = useState<any[]>([]);
  const [produtos, setProdutos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: senha });
    if (error) showToast("Erro ao entrar: " + error.message, "error");
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
      let urlFinalDaFoto = "";

      // 1. FAZ O UPLOAD DA IMAGEM SE O USUÁRIO SELECIONOU UMA
      if (fotoArquivo) {
        const nomeAleatorio = `${Date.now()}-${fotoArquivo.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("imagens") // O nome do bucket que você criou
          .upload(nomeAleatorio, fotoArquivo);

        if (uploadError) throw new Error("Erro ao subir a imagem pro Supabase");

        // Pega o link público da imagem que acabou de subir
        const { data: urlData } = supabase.storage.from("imagens").getPublicUrl(nomeAleatorio);
        urlFinalDaFoto = urlData.publicUrl;
      }

      // 2. MANDA PRO SEU MOTOR (BACKEND) SALVAR TUDO
      const res = await fetch("https://motor-saas-ltb4.onrender.com/produtos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          nome, 
          preco: parseFloat(preco), 
          foto_url: urlFinalDaFoto, 
          loja_id: lojaId,
          user_id: user.id 
        }),
      });

      if (res.ok) {
        showToast("Produto cadastrado com sucesso!", "success");
        const novo = await res.json();
        setProdutos(prev => [novo.dados[0], ...prev]);
        setNome(""); setPreco(""); setLojaId(""); setFotoArquivo(null); // Limpa tudo
      } else {
        showToast("Erro ao salvar no banco.", "error");
      }
    } catch (err: any) {
      showToast(err.message || "Falha na conexão.", "error");
    } finally {
      setLoading(false);
    }
  }

  const formatPrice = (v: number) => Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  if (authLoading) return null;

  if (!user) {
    return (
      <div style={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center", background: "#f3f4f6", fontFamily: "sans-serif" }}>
        <form onSubmit={handleLogin} style={{ background: "white", padding: "40px", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", width: "350px" }}>
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
             <div style={{ background: "#2563eb", width: "40px", height: "40px", borderRadius: "8px", margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
             </div>
             <h2 style={{ fontSize: "20px", fontWeight: "600", color: "#111827" }}>Acesso ao Painel</h2>
             <p style={{ fontSize: "14px", color: "#6b7280" }}>Entre com suas credenciais</p>
          </div>
          <input type="email" placeholder="Seu e-mail" onChange={e => setEmail(e.target.value)} style={loginInput} required />
          <input type="password" placeholder="Sua senha" onChange={e => setSenha(e.target.value)} style={loginInput} required />
          <button type="submit" disabled={loading} style={loginBtn}>{loading ? "Entrando..." : "Acessar Sistema"}</button>
        </form>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root { --bg: #f9fafb; --surface: #ffffff; --border: #e5e7eb; --text: #111827; --muted: #6b7280; --accent: #2563eb; --danger: #dc2626; --success: #16a34a; --font: 'Inter', sans-serif; --radius: 10px; }
        body { background: var(--bg); color: var(--text); font-family: var(--font); }
        .topbar { background: var(--surface); border-bottom: 1px solid var(--border); height: 56px; display: flex; align-items: center; padding: 0 24px; position: sticky; top: 0; z-index: 50; }
        .layout { display: flex; min-height: calc(100vh - 56px); }
        .sidebar { width: 220px; background: var(--surface); border-right: 1px solid var(--border); padding: 20px 12px; }
        .nav-item { display: flex; align-items: center; gap: 10px; padding: 10px; border-radius: 6px; font-size: 13px; color: var(--muted); cursor: pointer; border: none; background: none; width: 100%; text-align: left; }
        .nav-item.active { background: #eff6ff; color: var(--accent); font-weight: 500; }
        .main { flex: 1; padding: 32px; }
        .card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 24px; margin-bottom: 16px; }
        .tabs { display: flex; border-bottom: 1px solid var(--border); margin-bottom: 24px; }
        .tab-btn { padding: 12px 16px; font-size: 13px; font-weight: 500; border: none; background: none; cursor: pointer; color: var(--muted); border-bottom: 2px solid transparent; }
        .tab-btn.active { color: var(--accent); border-bottom-color: var(--accent); }
        input[type="text"], input[type="number"], select { width: 100%; padding: 10px; border-radius: 6px; border: 1px solid var(--border); margin-top: 5px; outline: none; }
        input[type="file"] { margin-top: 5px; font-size: 13px; }
        .btn-primary { background: var(--accent); color: white; padding: 10px 20px; border-radius: 6px; border: none; font-weight: 600; cursor: pointer; }
        .toast { position: fixed; bottom: 20px; right: 20px; background: white; padding: 12px 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); border-left: 4px solid var(--success); }
      `}</style>

      <header className="topbar">
        <div style={{ fontWeight: 600, display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ background: "var(--accent)", width: "24px", height: "24px", borderRadius: "4px" }}></div>
          Vitrine Admin
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "15px" }}>
           <span style={{ fontSize: "13px", color: "var(--muted)" }}>{user.email}</span>
           <button onClick={handleLogout} style={{ fontSize: "12px", color: "var(--danger)", border: "none", background: "none", cursor: "pointer" }}>Sair</button>
        </div>
      </header>

      <div className="layout">
        <aside className="sidebar">
          <button className="nav-item active">📦 Produtos</button>
          <button className="nav-item">🏪 Minha Loja</button>
        </aside>

        <main className="main">
          <div style={{ marginBottom: "24px" }}>
            <h1 style={{ fontSize: "24px", fontWeight: "600" }}>Gerenciar Catálogo</h1>
          </div>

          <div className="tabs">
            <button className={`tab-btn ${tab === "add" ? "active" : ""}`} onClick={() => setTab("add")}>Novo Produto</button>
            <button className={`tab-btn ${tab === "list" ? "active" : ""}`} onClick={() => setTab("list")}>Meus Produtos ({produtos.length})</button>
          </div>

          {tab === "add" ? (
            <div className="card">
              <form onSubmit={cadastrarProduto} style={{ display: "grid", gap: "15px" }}>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: 600 }}>Nome do Produto *</label>
                  <input type="text" value={nome} onChange={e => setNome(e.target.value)} required />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                  <div>
                    <label style={{ fontSize: "12px", fontWeight: 600 }}>Preço (R$) *</label>
                    <input type="number" step="0.01" value={preco} onChange={e => setPreco(e.target.value)} required />
                  </div>
                  <div>
                    <label style={{ fontSize: "12px", fontWeight: 600 }}>Loja *</label>
                    <select value={lojaId} onChange={e => setLojaId(e.target.value)} required>
                      <option value="">Selecione</option>
                      {lojas.map(l => <option key={l.id} value={l.id}>{l.nome}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: 600 }}>Foto do Produto *</label>
                  <br />
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={e => setFotoArquivo(e.target.files ? e.target.files[0] : null)} 
                    required 
                  />
                </div>
                <button type="submit" disabled={loading} className="btn-primary">
                  {loading ? "Salvando imagem e produto..." : "Publicar Produto"}
                </button>
              </form>
            </div>
          ) : (
            <div className="card" style={{ padding: 0 }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead style={{ background: "#f9fafb" }}>
                  <tr>
                    <th style={thStyle}>Produto</th>
                    <th style={thStyle}>Preço</th>
                    <th style={thStyle}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {produtos.map(p => (
                    <tr key={p.id} style={{ borderTop: "1px solid var(--border)" }}>
                      <td style={tdStyle}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <img src={p.foto_url} style={{ width: "40px", height: "40px", borderRadius: "6px", objectFit: "cover" }} />
                          {p.nome}
                        </div>
                      </td>
                      <td style={tdStyle}>{formatPrice(p.preco)}</td>
                      <td style={tdStyle}><span style={{ color: "var(--success)", fontSize: "12px" }}>● Ativo</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
      {toast && <div className={`toast`} style={{ borderLeftColor: toast.type === 'error' ? 'var(--danger)' : 'var(--success)' }}>{toast.msg}</div>}
    </>
  );
}

const loginInput = { width: "100%", padding: "12px", marginBottom: "12px", borderRadius: "8px", border: "1px solid #e5e7eb", outline: "none", color: "#111827", backgroundColor: "#ffffff" };
const loginBtn = { width: "100%", padding: "12px", background: "#2563eb", color: "white", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" };
const thStyle = { textAlign: "left" as const, padding: "12px 20px", fontSize: "11px", textTransform: "uppercase" as const, color: "#6b7280" };
const tdStyle = { padding: "12px 20px", fontSize: "14px" };