from flask import Flask, render_template

app = Flask(__name__)


@app.route("/", methods=["GET"])
def index():
    return render_template("index.html")


@app.route("/about", methods=["GET"])
def about():
    return render_template("about.html")


# =========================
# FORMULÁRIO
# =========================
@app.route("/formulario", methods=["GET"])
def form():
    return render_template("form.html")


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
