const estadoSelect = document.getElementById("estado");
const cidadeSelect = document.getElementById("cidade");
const input = document.getElementById("dateInput"); // ← apenas uma vez

input.addEventListener("input", (e) => {
  let v = e.target.value.replace(/\D/g, "");
  if (v.length >= 1) { if (parseInt(v[0]) > 3) v = "0" + v; }
  if (v.length >= 2) {
    let day = parseInt(v.slice(0, 2));
    if (day > 31) v = "31" + v.slice(2);
  }
  if (v.length >= 3) {
    if (parseInt(v[2]) > 1) v = v.slice(0, 2) + "0" + v.slice(2);
  }
  if (v.length >= 4) {
    let month = parseInt(v.slice(2, 4));
    if (month > 12) v = v.slice(0, 2) + "12" + v.slice(4);
  }
  if (v.length > 2 && v.length <= 4) v = v.slice(0, 2) + "/" + v.slice(2);
  else if (v.length > 4) {
    v = v.slice(0, 2) + "/" + v.slice(2, 4) + "/" + v.slice(4, 8);
  }
  e.target.value = v;
});

fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
  .then((res) => res.json())
  .then((estados) => {
    estados.sort((a, b) => a.nome.localeCompare(b.nome));
    estadoSelect.innerHTML = '<option value="">Selecione um estado</option>';
    estados.forEach((uf) => {
      const option = document.createElement("option");
      option.value = uf.sigla;
      option.textContent = uf.nome;
      estadoSelect.appendChild(option);
    });
  });

estadoSelect.addEventListener("change", () => {
  const uf = estadoSelect.value;
  cidadeSelect.innerHTML = "<option>Carregando...</option>";
  cidadeSelect.disabled = true;
  if (!uf) {
    cidadeSelect.innerHTML =
      '<option value="">Selecione um estado primeiro</option>';
    return;
  }
  fetch(
    `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`,
  )
    .then((res) => res.json())
    .then((cidades) => {
      cidades.sort((a, b) => a.nome.localeCompare(b.nome));
      cidadeSelect.innerHTML = '<option value="">Selecione uma cidade</option>';
      cidades.forEach((cidade) => {
        const option = document.createElement("option");
        option.value = cidade.id;
        option.textContent = cidade.nome;
        cidadeSelect.appendChild(option);
      });
      cidadeSelect.disabled = false;
    })
    .catch((err) => {
      console.error("Erro ao carregar cidades:", err);
      cidadeSelect.innerHTML = "<option>Erro ao carregar</option>";
    });
});

const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxk6XqrEGtE84AjuKdXffZ7eTAKdjRPh2rO9Dep3NlEOdDpVDX39PNMu_yxsY8j40HESg/exec";

const form = document.getElementById("inscricaoForm");
const msg = document.getElementById("msg");
const btn = document.getElementById("btnEnviar");
const telefone = document.getElementById("telefone");

telefone.addEventListener("input", function (e) {
  let v = e.target.value.replace(/\D/g, "");
  if (v.length > 11) v = v.slice(0, 11);
  if (v.length > 6) {
    v = "(" + v.slice(0, 2) + ") " + v.slice(2, 7) + "-" + v.slice(7);
  } else if (v.length > 2) v = "(" + v.slice(0, 2) + ") " + v.slice(2);
  else if (v.length > 0) v = "(" + v;
  e.target.value = v;
});

function mostrarMensagem(tipo, texto) {
  msg.className = "msg " + tipo;
  msg.textContent = texto;
}

function calcularIdade(dataStr) {
  // converte DD/MM/AAAA para AAAA-MM-DD
  const partes = dataStr.split("/");
  if (partes.length !== 3) return 0;
  const nasc = new Date(`${partes[2]}-${partes[1]}-${partes[0]}`);
  const hoje = new Date();
  let idade = hoje.getFullYear() - nasc.getFullYear();
  const m = hoje.getMonth() - nasc.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) idade--;
  return idade;
}

form.addEventListener("submit", async function (e) {
  e.preventDefault();
  msg.className = "msg";
  msg.textContent = "";
  btn.disabled = true;
  btn.textContent = "Enviando...";

  const dataNasc = input.value; // ← pega do campo dateInput (DD/MM/AAAA)

  const dados = {
    nome: form.nome.value.trim(),
    data_nascimento: dataNasc,
    idade: calcularIdade(dataNasc),
    telefone: form.telefone.value.trim(),
    email: form.email.value.trim(),
    estado: estadoSelect.options[estadoSelect.selectedIndex]?.text || "",
    cidade: cidadeSelect.options[cidadeSelect.selectedIndex]?.text || "",
    categoria: form.categoria.value.trim(),
    origem: "site_publico",
  };

  try {
    const resposta = await fetch(SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });

    const resultado = await resposta.json();

    if (resultado.ok) {
      mostrarMensagem("success", resultado.mensagem);
      form.reset();
    } else {
      mostrarMensagem("error", resultado.mensagem);
    }
  } catch (erro) {
    mostrarMensagem("error", "Erro de conexão. Tente novamente em instantes.");
  } finally {
    btn.disabled = false;
    btn.textContent = "Realizar inscrição";
  }
});

const diasEl = document.getElementById("dias");
const horasEl = document.getElementById("horas");
const minEl = document.getElementById("min");
const segEl = document.getElementById("seg");

function atualizarContador() {
  const evento = new Date("2026-05-19T20:00:00");
  const agora = new Date();

  const diff = evento - agora;

  if (diff <= 0) {
    document.querySelector(".countdown").innerHTML = "<p>O evento começou!</p>";

    clearInterval(timer);

    return;
  }

  const dias = Math.floor(diff / (1000 * 60 * 60 * 24));

  const horas = Math.floor(
    (diff % (1000 * 60 * 60 * 24)) /
      (1000 * 60 * 60),
  );

  const min = Math.floor(
    (diff % (1000 * 60 * 60)) /
      (1000 * 60),
  );

  const seg = Math.floor(
    (diff % (1000 * 60)) / 1000,
  );

  diasEl.textContent = String(dias).padStart(2, "0");
  horasEl.textContent = String(horas).padStart(2, "0");
  minEl.textContent = String(min).padStart(2, "0");
  segEl.textContent = String(seg).padStart(2, "0");
}

atualizarContador();

const timer = setInterval(atualizarContador, 1000);
