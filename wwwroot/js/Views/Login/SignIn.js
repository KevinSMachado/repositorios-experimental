// Ocultar la pantalla de carga cuando la página cargó
window.onload = function () {
    hideLoadingScreen();
}


// Función para mostrar la pantalla de carga
function showLoadingScreen() {
    document.getElementById("loadingOverlay").classList.remove("hide");
    document.getElementById("loadingScreen").classList.remove("hide");
}

function hideLoadingScreen() {
    document.getElementById("loadingOverlay").classList.add("hide");
    document.getElementById("loadingScreen").classList.add("hide");
}

// Intercepta el formulario una vez se da click en el botón "submit"
document.getElementById("LoginForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Evitar el envío del formulario de forma predeterminada


    showLoadingScreen();


    // Enviar el formulario mediante AJAX
    var formData = new FormData(this);

    fetch(this.action, {
        method: this.method,
        body: formData
    })
        .then(response => response.json())
        .then(data => {

            // Verificar si el registro fue exitoso
            if (data.success) {

                // Mostrar una alerta de éxito
                hideLoadingScreen();
                SuccessfulRedirectAlert(data.text, '/Home/Index');
                $('#LoginForm')[0].reset();



            } else {

                // Mostrar una alerta de error
                hideLoadingScreen();

                errorAlert(data.text);
            }
        })
        .catch(error => {

            // Manejar errores de red u otros errores
            console.error('Error:', error);
            hideLoadingScreen();

            Swal.fire({
                title: "Error!",
                text: 'Hubo un error al procesar la solicitud.',  // Usar el parámetro 'text'
                icon: "error",
                'confirmButtonColor': "#84bd00"
            });
        });
});


// Muestra la alerta de éxito con un texto asignado
function SuccessfulAlert(text) {
    Swal.fire({
        title: "Completado!",
        text: text,  // Usar el parámetro 'text'
        icon: "success",
        'confirmButtonColor': "#84bd00"

    });
}

// Muestra la alerta de éxito con un texto asignado y envia a una url asignada
function SuccessfulRedirectAlert(text, url) {
    Swal.fire({
        title: "Completado!",
        text: text,  // Usar el parámetro 'text'
        icon: "success",
        'confirmButtonColor': "#84bd00"

    }).then(function () {
        showLoadingScreen();
        window.location.href = url;  // Usar el parámetro 'url'
    });
}

// Muestra la alerta de error con un texto asignado
function errorAlert(text) {

    Swal.fire({
        title: "Error!",
        text: text,  // Usar el parámetro 'text'
        icon: "error",
        'confirmButtonColor': "#84bd00"

    });
}