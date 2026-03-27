"use client"; // Isso avisa o site que teremos botões clicáveis

import { useEffect, useState } from "react";

export default function Home() {
  const [lojas, setLojas] = useState([]);

  // Pede a lista de lojas pro garçom (Python) assim que entra no site
  useEffect(() => {
    fetch("https://motor-saas-ltb4.onrender.com/lojas")
      .then((res) => res.json())
      .then((dados) => setLojas(dados));
  }, []);

  // O que acontece quando o cliente clica em "Comprar"
  async function irParaPagamento() {
    alert("Gerando link seguro do Mercado Pago...");
    
    // Chama a nossa rota de checkout
    const resposta = await fetch("https://motor-saas-ltb4.onrender.com/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titulo_produto: "Camiseta Teste", preco: 50.00 })
    });
    
    const dados = await resposta.json();
    
    // Pega o cliente pela mão e leva pra tela do Mercado Pago
    window.location.href = dados.link_de_pagamento;
  }

  return (
    <main style={{ padding: "50px", fontFamily: "Arial" }}>
      <h1>Minha Vitrine Estilo Shopee 🛒</h1>
      
      <h3>Lojas cadastradas:</h3>
      <ul>
        {lojas.map((loja) => (
          <li key={loja.id}>{loja.nome}</li>
        ))}
      </ul>
      
      <hr style={{ margin: "30px 0" }} />
      
      <h2>Produto em Destaque</h2>
      <p>👕 Camiseta Teste - R$ 50,00</p>
      <button 
        onClick={irParaPagamento} 
        style={{ padding: "15px 30px", background: "#009ee3", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontSize: "16px", fontWeight: "bold" }}
      >
        Comprar com Mercado Pago
      </button>
    </main>
  );
}