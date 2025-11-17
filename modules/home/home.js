export function init(){
    const copyRight = document.getElementById("footer-copyright");
    const year = new Date().getFullYear();
    copyRight.innerText = `© ${year} Theo Olsson. All rights reserved`
}