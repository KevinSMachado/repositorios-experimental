window.onload = function () {
    hideLoadingScreen();
    checkResolution();

};

// Ejecutar cada vez que se cambia el tamaño de la ventana
window.onresize = function () {

    checkResolution();
}

function showLoadingScreen() {
    document.getElementById("loadingOverlay").classList.remove("hide");
    document.querySelector("#sidebar").style.zIndex = "0";
    document.getElementById("loadingScreen").classList.remove("hide");
}

function hideLoadingScreen() {
    document.getElementById("loadingOverlay").classList.add("hide");
    document.getElementById("loadingScreen").classList.add("hide");
    document.querySelector("#sidebar").style.zIndex = "1000";
}