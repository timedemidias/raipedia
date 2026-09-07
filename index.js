require("dotenv").config();

const express = require("express");
const path = require("path");
const session = require("express-session");

const db = require("./config/firebaseAdmin");
const authRoutes = require("./routes/admin/authRoutes");

const adminAuth = require("./middleware/adminAuth");

const app = express();


// CONFIGURAÇÕES

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


// MIDDLEWARE

// Permite receber dados de formulários
app.use(express.urlencoded({ extended: true }));

// Arquivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Sessão
app.use(
    session({
        secret: process.env.SESSION_SECRET || "raitec-admin",
        resave: false,
        saveUninitialized: false
    })
);


// ROTAS DE AUTENTICAÇÃO

app.use("/", authRoutes);


// ROTA PRINCIPAL

app.get("/", (req, res) => {
    res.render("index");
});


// TESTE FIREBASE

app.get("/teste", async (req, res) => {
    try {
        const doc = await db
            .collection("inicio")
            .doc("principal")
            .get();

        res.json(doc.data());

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});


// PAINEL ADMINISTRATIVO

app.get("/admin", adminAuth, (req, res) => {
    res.render("admin/index");
});

// INICIAR SERVIDOR

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});