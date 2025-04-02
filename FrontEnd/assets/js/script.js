// Données de l'API
let works, categories;

// Récuperation des données avec fetch
async function requestApi() {
    const resWorks = await fetch("http://localhost:5678/api/works");
    works = await resWorks.json();
    const resCategories = await fetch("http://localhost:5678/api/categories");
    categories = await resCategories.json();
}

let gallery = document.getElementsByClassName("gallery")[0];

// Affichage des travaux dans la galerie
function showWorks() {
    for (let i = 0; i < works.length; i++) {
        const work = works[i];
        let figure = document.createElement("figure");
        let img = document.createElement("img");
        img.src = work.imageUrl;
        img.alt = work.title;
        figure.appendChild(img);
        let figcaption = document.createElement("figcaption");
        figcaption.textContent = work.title;
        figure.appendChild(figcaption);
        gallery.appendChild(figure);
    }
}

// Utilisation des données recupérées
requestApi().then(() => {
    showWorks();
});