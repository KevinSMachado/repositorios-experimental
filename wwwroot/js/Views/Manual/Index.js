

    window.onload = function () {
        hideLoadingScreen();
    checkResolution();
    var activeElement = document.querySelector(".sidebar-item.active");

    

    if (activeElement) {

        activeElement.scrollIntoView();
            }

           
        }
    window.onresize = function () {

        checkResolution();

        }


    // Verifica si el navegador puede mostrar PDF en iframes
    document.getElementById('pdfViewer').addEventListener('load', function () {
            var iframeDocument = this.contentDocument || this.contentWindow.document;
    if (!iframeDocument.body.innerHTML.trim()) {
        alert('El PDF no se puede mostrar en el iframe. Por favor, revisa la ruta del archivo.');
            }
        });

    // Adicionalmente, agregar un mensaje si el iframe no puede cargar el PDF
    document.getElementById('pdfViewer').onerror = function () {
        alert('No se pudo cargar el PDF. Por favor, verifica la ruta y asegúrate de que el archivo exista.');
        };


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

