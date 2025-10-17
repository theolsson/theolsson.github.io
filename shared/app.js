const componentsPath = "../components/";
const navbarPath = `${componentsPath}navbar/navbar.html`

const navbarId = "navbar-container";

const httpErrorMessage = "on fetch";
const noHTMLErrorMessage = "No HTML returned on fetch";

init();

function init() {
    loadNavbar();
}

function loadNavbar() {
    loadComponent(navbarId, navbarPath);
}

function loadComponent(id, component) {
    fetch(component)
        .then(response => {
            if (!response.ok) throw new Error(`${response.status} ${httpErrorMessage}`);

            return response.text();
        })
        .then(text => {
            const html = text.trim();
            if (html === "" || !html.startsWith("<")) throw new Error(noHTMLErrorMessage);

            const element = document.getElementById(id);
            element.innerHTML = html;

            console.log(`Successfully loaded component from ${component}`)
        })
        .catch(error => console.error(`Failed to load component from ${component}: ${error}`));
}