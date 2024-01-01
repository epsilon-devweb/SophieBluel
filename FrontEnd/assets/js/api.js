// Création d'une variable constante route de l'API
const API = "http://127.0.0.1:5678/api";

// Fonction asynchrone récupération des données Works avec fetch
export async function fetchWorks() {
    try {
        const response = await fetch(`${API}/works`);
        return await response.json();
    } catch (error) {
        console.log(error);
    }
}

// Fonction asynchrone récupération des données Catégories avec fetch
export async function fetchCategories() {
    try {
        const response = await fetch(`${API}/categories`);
        return await response.json();
    } catch (error) {
        console.log(error);
    }
}

// Fonction asynchrone récupération des données de connexion utilisateur avec fetch
export async function fetchUserLogin(body) {
    console.log(body);
    try {
        const response = await fetch(`${API}/users/login`, {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json"
            }
        });
        return await response.json();
    } catch (error) {
        console.log(error);
    }
}

// Fonction asynchrone suppresion des données de travaux avec fetch
export async function deleteWork(workId) {
    try {
        const token = localStorage.getItem('token');
        await fetch(`${API}/works/${workId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        return;
    } catch (error) {
        console.log(error);
    }
}

// Fonction asynchrone envoi des données de travaux avec fetch
export async function postWork(body) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API}/works`, {
            method: "POST",
            body: body,
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return await response.json();
    } catch (error) {
        console.log(error);
    }
}

