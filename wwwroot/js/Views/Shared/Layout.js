const hamBurger = document.querySelector(".toggle-btn");

hamBurger.addEventListener("click", function () {
    document.querySelector("#sidebar").classList.toggle("expand");
    document.querySelector('.main').classList.toggle('expanded');

});

function checkResolution() {
    var width = window.innerWidth;
    var sidebar = document.querySelector("#sidebar");
    var main = document.querySelector('.main');

    if (width < 768) { // Por ejemplo, menos de 768px es una pantalla pequeña

        main.classList.remove('expanded');
        sidebar.classList.remove('expand');
    } else {
        main.classList.add('expanded');
        sidebar.classList.add('expand');

    }
}

// Ejecutar al cargar la página
//window.onload = checkResolution;

// Ejecutar cada vez que se cambia el tamaño de la ventana
//window.onresize = checkResolution;



document.addEventListener('DOMContentLoaded', function () {



    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[title]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl, {
            trigger: 'hover',
            container: 'body'
        });
    });
});

document.getElementById("img-logo").addEventListener("click", function () {
    window.location.href = "/Home/Index";
});
