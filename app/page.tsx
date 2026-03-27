"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [lojas, setLojas] = useState<any[]>([]);

  // O garçom continua buscando as lojas do mesmo jeito
  useEffect(() => {
    fetch("https://motor-saas-ltb4.onrender.com/lojas")
      .then((res) => res.json())
      .then((dados) => setLojas(dados));
  }, []);

  // O botão de pagamento continua com a mesma mecânica
  async function irParaPagamento() {
    alert("Gerando link seguro do Mercado Pago...");
    const resposta = await fetch("https://motor-saas-ltb4.onrender.com/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titulo_produto: "Camiseta Teste", preco: 50.00 })
    });
    const dados = await resposta.json();
    window.location.href = dados.link_de_pagamento;
  }

  // Aqui muda o visual (a "roupa" do site)
  return (
    <div style={{ backgroundColor: "#f3f4f6", minHeight: "100vh", fontFamily: "sans-serif", padding: "20px" }}>
      
      {/* Cabeçalho Bonito */}
      <header style={{ backgroundColor: "#ffffff", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", marginBottom: "20px", textAlign: "center" }}>
        <h1 style={{ margin: 0, color: "#333", fontSize: "24px" }}>🛍️ Minha Vitrine Profissional</h1>
      </header>

      {/* Lista de Lojas parecida com "Stories" do Instagram */}
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

      {/* Cartão de Produto Profissional */}
      <section style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ backgroundColor: "#ffffff", padding: "25px", borderRadius: "15px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", width: "100%", maxWidth: "350px", textAlign: "center" }}>
          <div style={{ fontSize: "60px", marginBottom: "10px" }}>👕</div>
          <h2 style={{ margin: "10px 0 5px 0", color: "#1f2937", fontSize: "20px" }}>Camiseta Premium</h2>
          <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "15px" }}>Algodão 100%, super confortável e com caimento perfeito.</p>
          <p style={{ color: "#10b981", fontSize: "28px", fontWeight: "900", margin: "0 0 20px 0" }}>R$ 50,00</p>
          
          {/* Botão Chamativo */}
          <button 
            onClick={irParaPagamento} 
            style={{ width: "100%", padding: "16px", backgroundColor: "#009ee3", color: "white", border: "none", borderRadius: "8px", fontSize: "16px", fontWeight: "bold", cursor: "pointer", boxShadow: "0 4px 6px rgba(0, 158, 227, 0.3)" }}
          >
            💳 Comprar com Mercado Pago
          </button>
        </div>
      </section>

    </div>
  );
}