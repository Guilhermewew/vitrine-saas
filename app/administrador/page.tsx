"use client";
import { useState } from "react";

export default function Admin() {
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [lojaId, setLojaId] = useState("");
  const [fotoUrl, setFotoUrl] = useState("");

  async function cadastrarProduto(e: any) {
    e.preventDefault();
    const resposta = await fetch("https://motor-saas-ltb4.onrender.com/produtos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, preco: parseFloat(preco), foto_url: fotoUrl, loja_id: lojaId })
    });
    if (resposta.ok) { alert("🚀 Sucesso! Produto já está na vitrine."); setNome(""); setPreco(""); setLojaId(""); setFotoUrl(""); }
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", fontFamily: "sans-serif" }}>
      <div style={{ width: "100%", maxWidth: "450px", background: "#1e293b", padding: "40px", borderRadius: "24px", border: "1px solid #334155", boxShadow: "0 20px 50px rgba(0,0,0,0.3)" }}>
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <div style={{ fontSize: "50px", marginBottom: "10px" }}>🛠️</div>
          <h1 style={{ color: "white", fontSize: "24px", fontWeight: "bold" }}>Painel de Controle</h1>
          <p style={{ color: "#94a3b8" }}>Gerencie o estoque do seu SaaS</p>
        </div>

        <form onSubmit={cadastrarProduto} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ color: "#facc15", fontSize: "14px", fontWeight: "bold" }}>NOME DO PRODUTO</label>
            <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} style={adminInput} placeholder="Ex: Nike Air Max" required />
          </div>

          <div style={{ display: "flex", gap: "15px" }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ color: "#facc15", fontSize: "14px", fontWeight: "bold" }}>PREÇO</label>
              <input type="number" step="0.01" value={preco} onChange={(e) => setPreco(e.target.value)} style={adminInput} placeholder="0.00" required />
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ color: "#facc15", fontSize: "14px", fontWeight: "bold" }}>ID LOJA</label>
              <input type="text" value={lojaId} onChange={(e) => setLojaId(e.target.value)} style={adminInput} placeholder="ID" required />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ color: "#facc15", fontSize: "14px", fontWeight: "bold" }}>URL DA IMAGEM</label>
            <input type="text" value={fotoUrl} onChange={(e) => setFotoUrl(e.target.value)} style={adminInput} placeholder="https://..." />
          </div>

          <button type="submit" style={{ marginTop: "10px", background: "linear-gradient(90deg, #4ade80, #22c55e)", color: "#064e3b", padding: "18px", borderRadius: "12px", border: "none", fontWeight: "900", fontSize: "16px", cursor: "pointer", boxShadow: "0 4px 15px rgba(34, 197, 94, 0.4)" }}>
            SALVAR PRODUTO
          </button>
        </form>
      </div>
    </div>
  );
}

const adminInput = { background: "#0f172a", border: "1px solid #334155", padding: "15px", borderRadius: "10px", color: "white", outline: "none" };