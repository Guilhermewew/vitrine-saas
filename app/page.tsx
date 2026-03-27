"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [lojas, setLojas] = useState<any[]>([]);
  const [produtos, setProdutos] = useState<any[]>([]);

  useEffect(() => {
    fetch("https://motor-saas-ltb4.onrender.com/lojas").then(res => res.json()).then(setLojas);
    fetch("https://motor-saas-ltb4.onrender.com/produtos").then(res => res.json()).then(setProdutos);
  }, []);

  async function irParaPagamento(nome: string, valor: number) {
    const resposta = await fetch("https://motor-saas-ltb4.onrender.com/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titulo_produto: nome, preco: valor })
    });
    const dados = await resposta.json();
    window.location.href = dados.link_de_pagamento;
  }

  return (
    <div style={{ backgroundColor: "#0f172a", minHeight: "100vh", color: "white", fontFamily: "'Inter', sans-serif" }}>
      
      {/* Header Futurista */}
      <header style={{ background: "linear-gradient(90deg, #4f46e5, #9333ea)", padding: "40px 20px", textAlign: "center", borderBottom: "4px solid #facc15" }}>
        <h1 style={{ fontSize: "32px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "2px" }}>🚀 Mega Vitrine SaaS</h1>
        <p style={{ opacity: "0.9" }}>As melhores lojas em um só lugar</p>
      </header>

      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}>
        
        {/* Lojas com efeito de Neon */}
        <section style={{ marginBottom: "50px" }}>
          <h2 style={{ fontSize: "20px", marginBottom: "20px", color: "#facc15" }}>🔥 Lojas em Destaque:</h2>
          <div style={{ display: "flex", gap: "15px", overflowX: "auto", paddingBottom: "10px" }}>
            {lojas.map(loja => (
              <div key={loja.id} style={{ background: "#1e293b", padding: "12px 25px", borderRadius: "50px", border: "1px solid #334155", whiteSpace: "nowrap", cursor: "pointer", transition: "0.3s" }}>
                🏪 {loja.nome}
              </div>
            ))}
          </div>
        </section>

        {/* Grid de Produtos Premium */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "30px" }}>
          {produtos.map(prod => (
            <div key={prod.id} style={{ background: "#1e293b", borderRadius: "20px", overflow: "hidden", border: "1px solid #334155", transition: "transform 0.3s" }}>
              <div style={{ position: "relative" }}>
                <img src={prod.foto_url || "https://via.placeholder.com/300"} style={{ width: "100%", height: "250px", objectFit: "cover" }} />
                <span style={{ position: "absolute", top: "10px", right: "10px", background: "#facc15", color: "#000", padding: "5px 12px", borderRadius: "10px", fontWeight: "bold", fontSize: "14px" }}>NOVO</span>
              </div>
              
              <div style={{ padding: "20px" }}>
                <h3 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "10px" }}>{prod.nome}</h3>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "20px" }}>
                  <span style={{ fontSize: "24px", fontWeight: "900", color: "#4ade80" }}>R$ {prod.preco}</span>
                  <button 
                    onClick={() => irParaPagamento(prod.nome, prod.preco)}
                    style={{ background: "#4f46e5", color: "white", padding: "12px 20px", borderRadius: "12px", border: "none", fontWeight: "bold", cursor: "pointer", boxShadow: "0 4px 14px rgba(79, 70, 229, 0.4)" }}
                  >
                    COMPRAR
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}