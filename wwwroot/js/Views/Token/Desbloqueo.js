

    document.querySelector("#sidebar").style.zIndex = "0";

    window.onload = function () {
        hideLoadingScreen();
    checkResolution();
    var activeElement = document.querySelector(".sidebar-item.active");

    

    if (activeElement) {

        activeElement.scrollIntoView();
            }
    mostrarModalSiHayTokens();
        }
    window.onresize = function () {

        checkResolution();

        }

    document.addEventListener("DOMContentLoaded", function () {
            // Inicializar el modal
            var modal = new bootstrap.Modal(document.getElementById('modalTokens'));

            // Otro código relacionado con el modal u otras funcionalidades
        });

    // Función para mostrar la pantalla de carga
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

    function setOperacionToken(value) {
        document.getElementById('tipoToken').value = value;
        }

    function mostrarModalSiHayTokens() {


           


    if (tokensGenerados != null) {
                // Muestra el modal
                var modal = new bootstrap.Modal(document.getElementById('modalTokens'));
    modal.show();

            } else {

                if (mensajeError != null) {

                    if (mensajeError != null) {
        errorAlert(mensajeError);

                    }
                }

            }
        }



    function copyToken(token, alerta) {


        
    let text = token;

    // Se añade el elemento text al portapapeles
    navigator.clipboard.writeText(text.toString())

                .then(() => {

        document.getElementById(alerta).style.display = "block";
    setTimeout(hideAlertToken.bind(null, alerta), 5000);


                })
                .catch(err => {
        console.error('Error al copiar al portapapeles:', err)
    })

        }

    function hideAlertToken(alerta) {

        document.getElementById(alerta).style.display = "none"
    }

        // Intercepta el formulario una vez se da click en el botón "submit"
    document.getElementById("DesbloqueoForm").addEventListener("submit", function (event) {
        event.preventDefault(); // Evitar el envío del formulario de forma predeterminada


    showLoadingScreen();

    // Simplemente envía el formulario
    this.submit();
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
