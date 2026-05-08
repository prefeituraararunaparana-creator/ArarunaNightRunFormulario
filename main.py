import json

import requests
from flask import Flask, jsonify, render_template, request

app = Flask(__name__)

SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyg5uG7spPxc-VtLk7lAmarGstL1UxSRNLTxV1RXM31xnLKmpChFcFZozf1oeVgzF8N0A/exec"


@app.route("/", methods=["GET"])
def index():
    return render_template("about.html")


# =========================
# FORMULÁRIO
# =========================
@app.route("/formulario", methods=["GET"])
def form():
    return render_template("form.html")


@app.route("/enviar", methods=["POST"])
def enviar_formulario():
    try:
        dados = request.get_json()
        resposta = requests.post(
            SCRIPT_URL,
            data=json.dumps(dados),
            headers={"Content-Type": "text/plain;charset=utf-8"},
            allow_redirects=True,
        )
        print("Status:", resposta.status_code)
        print("Resposta:", resposta.text)
        return jsonify(resposta.json())
    except Exception as e:
        print("ERRO:", str(e))
        return jsonify({"ok": False, "Mensagem": str(e)}), 500


# =========================
# ADMIN
# =========================
@app.route("/admin/login", methods=["GET"])
def admin_login():
    return render_template("admin_login.html")


# =========================
# START
# =========================
if __name__ == "__main__":
    print("Servidor rodando em http://localhost:5000")
    app.run(debug=True, host="0.0.0.0", port=5000)
