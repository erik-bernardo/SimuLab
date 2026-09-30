async function buscarSimulador(perguntaDoUsuario) {
  const apiKey = "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"; // Cole a sua API Key do Groq aqui

  try {
    const resposta = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: `Você é o assistente de navegação do site. Sua única função é recomendar o simulador correto com base no que o usuário precisa.

            Lista de Simuladores disponíveis:
https://erik-bernardo.github.io/SimuLab/simulacoes.html
https://erik-bernardo.github.io/SimuLab/index.html

            Regras:
            - Responda em português, de forma amigável e curta.
            - Sempre forneça a URL/link relativo do simulador recomendado.
            - Se o usuário pedir algo fora do escopo do site, diga educadamente que não temos esse simulador.`
          },
          {
            role: "user",
            content: perguntaDoUsuario
          }
        ]
      })
    });

    const dados = await resposta.json();
    console.log(dados.choices[0].message.content);
  } catch (erro) {
    console.error("Erro na chamada da API:", erro);
  }
}

// Testando a função
buscarSimulador("Preciso calcular quanto vou gastar no financiamento do meu carro");
