import os
import sqlite3
from datetime import datetime

import openpyxl

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE = os.path.join(BASE_DIR, "araruna_run.db")


def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def init_db():
    conn = get_db()
    c = conn.cursor()
    c.execute("""CREATE TABLE IF NOT EXISTS inscricoes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        datahora DATETIME NOT NULL,
        nome TEXT NOT NULL,
        data_nascimento TEXT NOT NULL,
        idade INTEGER NOT NULL,
        telefone TEXT NOT NULL,
        email TEXT DEFAULT '',
        estado TEXT DEFAULT '',
        cidade TEXT DEFAULT '',
        categoria TEXT DEFAULT '',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        origem TEXT DEFAULT 'formulario'
    );
    """)
    c.execute("""CREATE INDEX IF NOT EXISTS idx_nome ON inscricoes(nome)""")
    c.execute("""CREATE INDEX IF NOT EXISTS idx_telefone ON inscricoes(telefone)""")
    conn.commit()
    conn.close()
