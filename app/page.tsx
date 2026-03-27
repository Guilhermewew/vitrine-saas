"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [lojas, setLojas] = useState<any[]>([]);
  const [produtos, setProdutos] = useState<any[]>([]);

  useEffect(() => {
    // Busca as lojas para o topo do site
    fetch("https://motor-saas-ltb4.onrender.com/lojas")
      .then((res) => res.json())
      .then((dados) => setLojas(dados));
    
    // Busca os produtos cadastrados no banco
    fetch("https://motor-saas-ltb4.onrender.com/produtos")
      .then((res) => res.json())
      .then((dados) => setProdutos(dados));
  }, []);

  async function irParaPagamento(nome: string, valor: number) {
    alert("Gerando link seguro do Mercado Pago...");
    const resposta = await fetch("https://motor-saas-ltb4.onrender.com/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titulo_produto: nome, preco: valor })
    });
    const dados = await resposta.json();
    window.location.href = dados.link_de_pagamento;
  }

  return (
    <div style={{ backgroundColor: "#f3f4f6", minHeight: "100vh", fontFamily: "sans-serif", padding: "20px" }}>
      
      <header style={{ backgroundColor: "#ffffff", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", marginBottom: "20px", textAlign: "center" }}>
        <h1 style={{ margin: 0, color: "#333", fontSize: "24px" }}>🛍️ Minha Vitrine Profissional</h1>
      </header>

      <section style={{ marginBottom: "30px" }}>
        <h2 style={{ color: "#555", fontSize: "16px", marginBottom: "10px" }}>Lojas Parceiras:</h2>
        <div style={{ display: "flex", gap: "10px", overflowX: "auto", paddingBottom: "10px" }}>
          {lojas.map((loja) => (
            <span key={loja.id} style={{ backgroundColor: "#e5e7eb", color: "#374151", padding: "8px 16px", borderRadius: "20px", fontSize: "14px", fontWeight: "bold", whiteSpace: "nowrap" }}>
              🏪 {loja.nome}
            </span>
          ))}
        </div>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
        {produtos.map((prod) => (
          <div key={prod.id} style={{ backgroundColor: "#ffffff", padding: "20px", borderRadius: "15px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", textAlign: "center" }}>
            <img 
              src={prod.foto_url || "https://via.placeholder.com/150"} 
              alt={prod.nome} 
              style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "10px", marginBottom: "15px" }} 
            />
            <h2 style={{ margin: "0 0 5px 0", color: "#1f2937", fontSize: "18px" }}>{prod.nome}</h2>
            <p style={{ color: "#10b981", fontSize: "22px", fontWeight: "900", margin: "10px 0" }}>R$ {prod.preco}</p>
            <button 
              onClick={() => irParaPagamento(prod.nome, prod.preco)} 
              style={{ width: "100%", padding: "12px", backgroundColor: "#009ee3", color: "white", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}
            >
              💳 Comprar
            </button>
          </div>
        ))}
      </section>
    </div>
  );
}