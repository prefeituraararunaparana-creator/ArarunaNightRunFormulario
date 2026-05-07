# 🏃 Araruna Night Run 2026 — Formulário de Inscrição

Sistema de inscrição online para a corrida noturna de Araruna/PR, com formulário web integrado ao Google Sheets via Google Apps Script.

---

## 📋 Visão Geral

O sistema permite que participantes se inscrevam diretamente pelo navegador. Os dados são enviados para uma planilha do Google Sheets e também armazenados localmente em um banco SQLite via backend Python/Flask.

```
Navegador (HTML + JS)
    ↓ POST (no-cors)
Google Apps Script (doPost)
    ↓ appendRow
Google Sheets (aba: Competidores)

Navegador (HTML + JS)
    ↓ POST
Flask (Python)
    ↓ INSERT
SQLite (inscricoes.db)
```

---

## 🗂 Estrutura do Projeto

```
araruna-night-run/
├── app.py                  # Backend Flask
├── database.py             # Funções do banco SQLite + importação de planilha
├── config.py               # Configurações (DATABASE path, etc.)
├── static/
│   ├── app.js              # Lógica do formulário (fetch, máscaras, validação)
│   └── css/
│       └── style.css       # Estilos
├── templates/
│   └── index.html          # Formulário de inscrição
├── appscript/
│   └── Codigo.gs           # Google Apps Script (doPost + testarInsercao)
└── README.md
```

---

## ⚙️ Tecnologias

| Camada | Tecnologia |
|--------|-----------|
| Frontend | HTML5, CSS3, JavaScript (Vanilla) |
| Backend | Python 3, Flask |
| Banco de dados | SQLite3 |
| Integração externa | Google Apps Script, Google Sheets |
| API de localidades | IBGE (estados e municípios) |

---

## 🚀 Como Rodar Localmente

### Pré-requisitos

- Python 3.10+
- pip

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/araruna-night-run.git
cd araruna-night-run

# Instale as dependências
pip install flask openpyxl

# Inicialize o banco de dados
python database.py

# Inicie o servidor
python app.py
```

Acesse em: [http://localhost:5000](http://localhost:5000)

---

## 📊 Google Apps Script

### Configuração

1. Abra a planilha no Google Sheets
2. Vá em **Extensões → Apps Script**
3. Cole o conteúdo de `appscript/Codigo.gs`
4. Clique em **Implantar → Nova implantação**
   - Tipo: **Aplicativo da Web**
   - Executar como: **Minha conta**
   - Acesso: **Qualquer pessoa**
5. Copie a URL gerada e atualize no `app.js`:

```javascript
const SCRIPT_URL = "https://script.google.com/macros/s/SEU_ID/exec";
```

### Estrutura da Planilha (aba: Competidores)

| Coluna | Campo |
|--------|-------|
| A | Data/Hora da inscrição |
| B | Nome completo |
| C | Data de nascimento |
| D | Idade |
| E | Telefone |
| F | E-mail |
| G | Estado |
| H | Cidade |
| I | Categoria |
| J | Origem |

### Proteção contra duplicatas

O script verifica **telefone** e **e-mail** antes de inserir. Se já existir cadastro com os mesmos dados, a inscrição é rejeitada.

---

## 🗃 Banco de Dados (SQLite)

### Tabela `inscricoes`

```sql
CREATE TABLE inscricoes (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    datahora        DATETIME NOT NULL,
    nome            TEXT NOT NULL,
    data_nascimento TEXT NOT NULL,
    idade           INTEGER NOT NULL,
    telefone        TEXT NOT NULL,
    email           TEXT DEFAULT '',
    estado          TEXT DEFAULT '',
    cidade          TEXT DEFAULT '',
    categoria       TEXT DEFAULT '',
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    origem          TEXT DEFAULT 'formulario'
);
```

### Importar planilha existente

```python
# Em database.py
importar_planilha_original("caminho/para/planilha.xlsx")
```

---

## 🏅 Categorias

| Opção | Distância |
|-------|-----------|
| 1 Volta | 2 KM |
| 2 Voltas | 4 KM |
| 3 Voltas | 6 KM |
| Caminhada | Livre |

---

## 🔧 Configuração (`config.py`)

```python
DATABASE = "inscricoes.db"  # caminho para o banco SQLite
```

---

## ⚠️ Observações

- O formulário usa `mode: "no-cors"` no fetch para contornar limitações de CORS do Google Apps Script. Por isso, erros do servidor (como duplicata) não são exibidos ao usuário — o sistema assume sucesso no envio.
- Toda vez que o código do Apps Script for alterado, é necessário criar uma **nova implantação** (não editar a existente) e atualizar a `SCRIPT_URL` no `app.js`.
- O campo de data de nascimento usa máscara `DD/MM/AAAA` e a idade é calculada automaticamente no front-end antes do envio.

---

## 📍 Organização

**Prefeitura de Araruna** — Araruna, Paraná, Brasil
