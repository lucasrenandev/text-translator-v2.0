// Modo estrito
"use strict";

// Elementos
const selectors = document.querySelectorAll(".container select");
const textAreaFrom = document.getElementById("textarea-from");
const textAreaTo = document.getElementById("textarea-to");
const clearButton = document.getElementById("clear-button");
const listenButton = document.getElementById("listen-button");
const copyButton = document.getElementById("copy-button");
const translateButton = document.getElementById("translate-button");

// Criando os idiomas 
const languages = {
    "en-EN": "Inglês",
    "es-ES": "Espanhol",
    "it-IT": "Italiano",
    "fr-FR": "Francês",
    "de-DE": "Alemão",
    "ru-RU": "Russo",
    "pl-PL": "Polonês",
    "ja-JP": "Japonês",
    "zh-ZH": "Chinês",
    "pt-BR": "Português",
}

// Função para adicionar os idiomas criados no seletor 
function loadLanguages() {
    selectors.forEach((select) => {
        for(let language in languages) {
            let selected = "";
            if(select.className.includes("select-from") && language === "pt-BR") {
                selected = "selected";
            }
            else if(select.className.includes("select-to") && language === "en-EN") {
                selected = "selected";
            }
            const option = `<option value="${language}" ${selected}>${[languages[language]]}</option>`;
            select.insertAdjacentHTML("beforeend", option);
        }
    });
}
loadLanguages();

// Função para ler o texto traduzido
let speaks = null;
async function readText() {
    const translate = await fetch(`https://api.mymemory.translated.net/get?q=${textAreaFrom.value}&langpair=${selectors[0].value}|${selectors[1].value}`);
    translate.json().then((data) => {
        if(data.responseStatus === 200) {
            speaks = new SpeechSynthesisUtterance(data.responseData.translatedText);
            speaks.lang = selectors[1].value;
            textAreaTo.value = speaks.text;    
        }
    });
}

// Função para exibir o icone de limpar o texto digitado 
function displayClearButton() {
    textAreaFrom.addEventListener("beforeinput", (event) => {
        if(event) {
            clearButton.style.display = "block";
        }
        else {
            clearButton.style.display = "none";
        }
    });
}
displayClearButton();

// Botão traduzir
translateButton.addEventListener("click", () => {
    if(textAreaFrom.value && selectors[0].value !== selectors[1].value) {
        readText();
        listenButton.style.display = "block";
        copyButton.style.display = "block";
    }
    else if(textAreaFrom.value && selectors[0].value === selectors[1].value) {
        window.alert("Selecione dois idiomas diferentes!");
    }
    else if(!textAreaFrom.value) {
        window.alert("Digite um texto para ser traduzido!");
    }
});

// Ouvir a tradução
listenButton.addEventListener("click", () => {
    window.speechSynthesis.speak(speaks);
}); 

// Copiar o texto dá tradução
copyButton.addEventListener("click", () => {
    navigator.clipboard.writeText(speaks.text)
    setTimeout(() => {
        window.alert("Tradução copiada!");
    }, 1000);
});

// Limpar o texto digitado
clearButton.addEventListener("click", function() {
    textAreaFrom.value = "";
    textAreaTo.value = "";
    listenButton.style.display = "none";
    copyButton.style.display = "none";
    this.style.display = "none";
});