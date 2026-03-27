"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [lojas, setLojas] = useState<any[]>([]);

  useEffect(() => {
    fetch("https://motor-saas-ltb4.onrender.com/lojas")
      .then((res) => res.json())
      .then((dados) => setLojas(dados));
  }, []);

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

      <section style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ backgroundColor: "#ffffff", padding: "25px", borderRadius: "15px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", width: "100%", maxWidth: "350px", textAlign: "center" }}>
          
          {/* AQUI ESTÁ A FOTO REAL */}
          <img 
            src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
            alt="Camiseta Branca" 
            style={{ width: "100%", height: "250px", objectFit: "cover", borderRadius: "10px", marginBottom: "15px" }} 
          />

          <h2 style={{ margin: "0 0 5px 0", color: "#1f2937", fontSize: "20px" }}>Camiseta Premium</h2>
          <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "15px" }}>Algodão 100%, super confortável e com caimento perfeito.</p>
          <p style={{ color: "#10b981", fontSize: "28px", fontWeight: "900", margin: "0 0 20px 0" }}>R$ 50,00</p>
          
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