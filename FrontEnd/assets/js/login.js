//Importation de la fonction login
import { fetchUserLogin } from "./api.js";

const form = document.querySelector("form");

form.addEventListener("submit", async event => {

    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!email || !password) {
        alert("Veuillez remplir tous les champs");
        return;
    }

    const response = await fetchUserLogin({ email, password });

    if (response.error) {
        const errorMessage = document.createElement("p");
        alert("Erreur dans l'identifiant ou le mot de passe");
        return form.appendChild(errorMessage);
    }

    localStorage.setItem("token", response.token);
    localStorage.setItem("userId", response.userId);

    window.location = "/FrontEnd/index.html";
});