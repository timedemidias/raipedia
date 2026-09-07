const express = require("express");

const router = express.Router();

const auth = require("../../config/firebase");

const {
    signInWithEmailAndPassword
} = require("firebase/auth");


// TELA DE LOGIN
router.get("/login", (req, res) => {

    // Se já estiver logado,
    // vai direto para o painel
    if (req.session.usuario) {
        return res.redirect("/admin");
    }

    res.render("admin/login");
});


// LOGIN
router.post("/login", async (req, res) => {

    try {

        const { email, senha } = req.body;

        // Login no Firebase
        const userCredential =
            await signInWithEmailAndPassword(
                auth,
                email,
                senha
            );

        // Salvar usuário na sessão
        req.session.usuario = {
            email: userCredential.user.email
        };

        // Redirecionar para o painel
        res.redirect("/admin");

    } catch (erro) {

        console.error(erro);

        res.send("Email ou senha inválidos");
    }
});


// LOGOUT
router.get("/logout", (req, res) => {

    req.session.destroy(() => {
        res.redirect("/login");
    });

});


module.exports = router;
