import { deleteWork, fetchWorks, fetchCategories, postWork } from "./api.js"

const token = localStorage.getItem('token');

function showModal(modalId) {
    const modal = document.querySelector(modalId);
    modal.classList.remove('modal-visibility-hidden');
    modal.classList.add('modal-visibility-visible');
}

function closeModal(modalId) {
    const modal = document.querySelector(modalId);
    modal.classList.remove('modal-visibility-visible');
    modal.classList.add('modal-visibility-hidden');
}

function displayWorks(works) {
    const galleryElement = document.querySelector('.gallery');
    galleryElement.innerHTML = "";
    works.forEach(work => {
        const figure = document.createElement('figure');
        const image = document.createElement('img');
        image.src = work.imageUrl;
        const figCaption = document.createElement('figcaption');
        figCaption.textContent = work.title;

        figure.appendChild(image);
        figure.appendChild(figCaption);
        galleryElement.appendChild(figure);
    });
}

function displayThumbnails(works, categories) {
    const thumbnailsModal = document.querySelector('.thumbnails-modal');
    thumbnailsModal.innerHTML = "";

    const addWorksBtn = document.querySelector('.addWorksBtn');

    addWorksBtn.addEventListener('click', async () => {

        const categoriesItem = document.querySelector('#categories');
        const hasCategories = categoriesItem.length === 0 && categories && categories.length > 0;

        if (hasCategories) {

            const defaultOption = document.createElement('option');
            defaultOption.text = "-- selectionner une categorie";
            defaultOption.value = "";
            categoriesItem.appendChild(defaultOption);
            categories.map(category => {
                const option = document.createElement('option');
                option.text = category.name;
                option.value = category.id;
                categoriesItem.appendChild(option);
            });
        }

        closeModal('#modal1');
        showModal('#modal2');

    });

    works.forEach((work) => {
        const formElement = document.createElement('form');
        const worksElement = document.createElement('figure');
        worksElement.setAttribute('id', work.id);

        const imageElement = document.createElement('img');
        imageElement.src = work.imageUrl;

        const trashButton = document.createElement('button');
        const trash = document.createElement('i');
        trash.setAttribute('class', 'fa-solid fa-trash-can fa-xs trash');
        trashButton.appendChild(trash);

        thumbnailsModal.appendChild(formElement);
        formElement.appendChild(worksElement);
        worksElement.appendChild(imageElement);
        worksElement.appendChild(trashButton);

        trashButton.addEventListener('click', async (event) => {
            event.preventDefault();
            handleWorkDelete(work.id);
        });
    });
}

function isValidInputs() {
    const imgSrcInput = document.getElementById("File");
    const titleInput = document.getElementById("title");
    const categoryIdInput = document.getElementById("categories");

    let imageSrc = imgSrcInput.files[0];
    let title = titleInput.value;
    let categoryId = categoryIdInput.value;

    const btnValider = document.getElementById("btnValider");

    if (!imageSrc || !title || !categoryId) {

        btnValider.style.backgroundColor = "#A7A7A7";
        btnValider.style.border = "solid 1px #A7A7A7";
        document.querySelector('.error-message-category').classList.remove('hidden');
        const errorMargin = document.querySelector('.error-message-category');
        errorMargin.style.marginBottom = '20px';
        return false;
    }

    btnValider.style.backgroundColor = "#1D6154";
    btnValider.style.border = "solid 1px #1D6154";
    document.querySelector('.error-message-category').classList.add('hidden');
    const errorMargin = document.querySelector('.error-message-category');
    errorMargin.style.marginBottom = '';
    return true;
}

function emptyForm() {
    const imgSrcInput = document.getElementById("File");
    const titleInput = document.getElementById("title");
    const categoryIdInput = document.getElementById("categories");
    const photoDisplay = document.querySelector('.add-photo-display');
    const photoBlock = document.querySelector('.add-photo-block');

    photoDisplay.classList.add('hidden');
    photoBlock.classList.remove('hidden');
    imgSrcInput.value = '';
    titleInput.value = '';
    categoryIdInput.value = '';
}

function showImageFormPreview(file) {
    const photoDisplay = document.querySelector('.add-photo-display');
    const photoBlock = document.querySelector('.add-photo-block');

    photoBlock.classList.add('hidden');
    photoDisplay.classList.remove('hidden');
    photoDisplay.style.backgroundImage = `url(${URL.createObjectURL(file)})`;
    photoDisplay.style.backgroundSize = 'cover';
}

async function sendNewProject() {
    const imgSrcInput = document.getElementById("File");
    const titleInput = document.getElementById("title");
    const categoryIdInput = document.getElementById("categories");

    let imageSrc = imgSrcInput.files[0];
    let title = titleInput.value;
    let categoryId = categoryIdInput.value;

    const isValid = isValidInputs();

    if (!isValid) return;

    try {
        let formData = new FormData();
        formData.append("image", imageSrc);
        formData.append("title", title);
        formData.append("category", categoryId);
        await postWork(formData);
        alert("Projet ajouté avec succès !");

        emptyForm();

        const works = await fetchWorks();
        displayWorks(works);
        displayThumbnails(works);
    }
    catch (error) {
        alert("Alerte, impossible d'ajouter ce projet");
    }
}

async function handleWorkDelete(workId) {
    await deleteWork(workId);
    const updatedThumbnails = await fetchWorks();

    displayThumbnails(updatedThumbnails);
    displayWorks(updatedThumbnails);
}

function handleLogout() {
    const loginBtn = document.querySelector(".login-btn")
    localStorage.setItem('token', '')
    loginBtn.textContent = 'login';
    window.location = "/FrontEnd/index.html";
}

function userLogged(works, categories) {
    document.querySelector('.edit-bar-admin').classList.remove('hidden');
    document.querySelector('.edit-btn').classList.remove('hidden');

    const overlay = document.querySelector('.overlay');
    const closeButton = document.querySelector('.close-modal');
    closeButton.addEventListener('click', overlay);

    const modalBtn = document.querySelector('.edit-btn');
    modalBtn.addEventListener('click', () => {
        showModal('#modal1');
    });

    const loginBtn = document.querySelector(".login-btn")
    loginBtn.textContent = 'logout';

    const filtersDiv = document.querySelector("#filters")
    loginBtn.href = "#";
    loginBtn.addEventListener('click', handleLogout);
    filtersDiv.style = 'display:none';

    const closeModal1 = document.getElementById('closeModal1');
    closeModal1.addEventListener('click', () => {
        closeModal('#modal1');
    });

    const closeModal2 = document.getElementById('closeModal2');
    closeModal2.addEventListener('click', () => {
        closeModal('#modal2');
    });

    const backModalBtn = document.querySelector('.backModalBtn');
    backModalBtn.addEventListener('click', () => {
        emptyForm();
        closeModal('#modal2');
        showModal('#modal1');
    });

    const uploadFile = document.querySelector('.input-hidden');
    uploadFile.addEventListener('change', (event) => {
        showImageFormPreview(uploadFile.files[0]);
    });

    displayThumbnails(works, categories);

    const myForm = document.getElementById('form');
    myForm.addEventListener('submit', (event) => {
        event.preventDefault();
        sendNewProject()
    });

}

async function main() {

    const works = await fetchWorks();
    const categories = await fetchCategories();

    if (token) {
        userLogged(works, categories);
    }

    const categoryFilters = [...categories];
    categoryFilters.unshift({ id: 'all', name: 'Tous' });
    const filtersElement = document.querySelector('#filters');
    categoryFilters.forEach(category => {
        const filterButton = document.createElement('button');
        filterButton.textContent = category.name;
        filterButton.id = category.id;
        filtersElement.appendChild(filterButton);
        filterButton.addEventListener('click', (event) => {
            const filteredWorks = event.target.id === 'all' ? works : works.filter(work => work.categoryId == event.target.id);
            displayWorks(filteredWorks);
        });
    });

    displayWorks(works);

}

main();