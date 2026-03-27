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
      body: JSON.stringify({
        nome: nome,
        preco: parseFloat(preco),
        foto_url: fotoUrl,
        loja_id: lojaId
      })
    });

    if (resposta.ok) {
      alert("✅ Produto cadastrado com sucesso!");
      setNome(""); setPreco(""); setLojaId(""); setFotoUrl("");
    } else {
      alert("❌ Erro ao cadastrar. Verifique o Motor.");
    }
  }

  return (
    <div style={{ maxWidth: "500px", margin: "50px auto", padding: "30px", fontFamily: "sans-serif", backgroundColor: "#fff", borderRadius: "12px", border: "1px solid #eee", boxShadow: "0 10px 25px rgba(0,0,0,0.05)" }}>
      <h1 style={{ textAlign: "center", color: "#333", marginBottom: "10px" }}>⚙️ Painel do Gerente</h1>
      <p style={{ textAlign: "center", color: "#888", marginBottom: "30px" }}>Adicione produtos à sua vitrine</p>

      <form onSubmit={cadastrarProduto} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <input type="text" placeholder="Nome do Produto" value={nome} onChange={(e) => setNome(e.target.value)} style={inputStyle} required />
        <input type="number" step="0.01" placeholder="Preço (ex: 50.00)" value={preco} onChange={(e) => setPreco(e.target.value)} style={inputStyle} required />
        <input type="text" placeholder="URL da Imagem" value={fotoUrl} onChange={(e) => setFotoUrl(e.target.value)} style={inputStyle} />
        <input type="text" placeholder="ID da Loja (veja no Supabase)" value={lojaId} onChange={(e) => setLojaId(e.target.value)} style={inputStyle} required />
        
        <button type="submit" style={{ padding: "15px", backgroundColor: "#10b981", color: "white", border: "none", borderRadius: "8px", fontWeight: "bold", fontSize: "16px", cursor: "pointer", marginTop: "10px" }}>
          🚀 Publicar Produto
        </button>
      </form>
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <a href="/" style={{ color: "#009ee3", textDecoration: "none", fontSize: "14px" }}>← Voltar para a Vitrine</a>
      </div>
    </div>
  );
}

const inputStyle = { padding: "12px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "16px", outline: "none" };