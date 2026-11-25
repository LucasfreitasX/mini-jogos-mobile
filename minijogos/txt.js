// ======================
// MENU PRINCIPAL
// ======================

const mensagem = document.getElementById("mensagem");

if (mensagem) {

    const frases = [
        "🎯 Escolha um jogo e divirta-se!",
        "🏆 Tente bater seus recordes!",
        "🎮 Bem-vindo ao MiniJogos!",
        "🚀 Preparado para o desafio?",
        "🔥 Qual será seu próximo jogo?"
    ];

    let indice = 0;

    function trocarMensagem() {
        mensagem.style.opacity = 0;

        setTimeout(() => {
            mensagem.textContent = frases[indice];
            mensagem.style.opacity = 1;

            indice = (indice + 1) % frases.length;
        }, 300);
    }

    mensagem.style.transition = "0.3s";

    trocarMensagem();
    setInterval(trocarMensagem, 3000);
}


if (document.getElementById("palavra")) {

    const palavras = [
        "CASA",
        "COMPUTADOR",
        "ESCOLA",
        "PROGRAMACAO",
        "JAVASCRIPT",
        "FUTEBOL",
        "CARRO",
        "BANANA",
        "GATO",
        "CACHORRO",
        "AFRICA",
        "BRASIL",
        "CARRO",
        "MOTO",
        "QUARTO",
        "MORANGO",
        "UVA",
        "ESPANHA",
    ];

    let palavraSecreta;
    let palavraOculta;
    let tentativas;
    let letrasErradas;

    const palavraElemento = document.getElementById("palavra");
    const tentativasElemento = document.getElementById("tentativas");
    const letrasDiv = document.getElementById("letras");
    const reiniciarBtn = document.getElementById("reiniciar");

    // Cria área para letras erradas
    const erradasElemento = document.createElement("p");
    erradasElemento.id = "erradas";

    tentativasElemento.insertAdjacentElement(
        "afterend",
        erradasElemento
    );

    function atualizarTela() {

        palavraElemento.textContent =
            palavraOculta.join(" ");

        tentativasElemento.textContent =
            `Tentativas restantes: ${tentativas}`;

        erradasElemento.textContent =
            `Letras erradas: ${letrasErradas.join(" ")}`;
    }

    function desativarBotoes() {

        document
            .querySelectorAll("#letras button")
            .forEach(btn => btn.disabled = true);
    }

    function verificarFimDeJogo() {

        if (!palavraOculta.includes("_")) {

            setTimeout(() => {
                alert("🎉 Parabéns! Você venceu!");
            }, 100);

            desativarBotoes();
        }

        if (tentativas <= 0) {

            setTimeout(() => {
                alert(
                    `💀 Você perdeu!\nA palavra era: ${palavraSecreta}`
                );
            }, 100);

            desativarBotoes();
        }
    }

    function clicarLetra(letra, botao) {

        let acertou = false;

        for (let i = 0; i < palavraSecreta.length; i++) {

            if (palavraSecreta[i] === letra) {
                palavraOculta[i] = letra;
                acertou = true;
            }
        }

        if (!acertou) {
            tentativas--;
            letrasErradas.push(letra);
        }

        botao.disabled = true;

        atualizarTela();
        verificarFimDeJogo();
    }

    function criarTeclado() {

        letrasDiv.innerHTML = "";

        for (let codigo = 65; codigo <= 90; codigo++) {

            const letra = String.fromCharCode(codigo);

            const botao = document.createElement("button");

            botao.textContent = letra;

            botao.addEventListener("click", () =>
                clicarLetra(letra, botao)
            );

            letrasDiv.appendChild(botao);
        }
    }

    function iniciarJogo() {

        palavraSecreta =
            palavras[Math.floor(Math.random() * palavras.length)];

        palavraOculta =
            Array(palavraSecreta.length).fill("_");

        tentativas = 6;
        letrasErradas = [];

        criarTeclado();
        atualizarTela();
    }

    reiniciarBtn.addEventListener(
        "click",
        iniciarJogo
    );

    iniciarJogo();
}