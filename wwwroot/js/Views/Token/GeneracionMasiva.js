
    var archivoJson = "";

    $('#tiposTokenSelector').on('change', function () {
            // Obtener el valor seleccionado (o valores seleccionados en caso de select múltiple)

            

            var valoresSeleccionados = $(this).val();

    var botonGenerarTokens = document.getElementById('botonGenerarTokens');

            if (valoresSeleccionados.length >= 1) {

        botonGenerarTokens.disabled = false;
            } else {
        botonGenerarTokens.disabled = true;
                
            }

            
        });

    document.getElementById("archivoForm").addEventListener("submit", function (event) {
        event.preventDefault(); // Evitar el envío del formulario de forma predeterminada
    showLoadingScreen();

    var fileInput = document.getElementById("archivoMedidores");

    var file = fileInput.files[0];
    if (!file) {
        hideLoadingScreen();
    errorAlert("Por favor, selecciona un archivo.");
    return;
            }

    var reader = new FileReader();
    reader.onload = function (e) {
                var data = new Uint8Array(e.target.result);
    var workbook = XLSX.read(data, {type: 'array' });

    var firstSheetName = workbook.SheetNames[0];
    var worksheet = workbook.Sheets[firstSheetName];
    var json = XLSX.utils.sheet_to_json(worksheet);

    var formData = new FormData();
    formData.append("archivo", JSON.stringify(json));

    archivoJson = JSON.stringify(json);


        fetch('/Token/cargarArchivo', {
        method: 'POST',
    body: formData
                })
                    .then(response => response.json())
                    .then(data => {
                        
                        if (data.success) {
        SuccessfulAlert(data.text);
    inicializarTabla(data.data);
    document.getElementById("descripcionSolicitud").disabled = true;
    document.getElementById("subirArchivoMedidores").disabled = true;

    fileInput.disabled = true;

                        } else {
        errorAlert(data.text);
    hideLoadingScreen();
                        }
                    })
                    .catch(error => {
        hideLoadingScreen();
    console.error('Error:', error);
    Swal.fire('Error!', 'Hubo un error al procesar la solicitud.', 'error');
                    });
            };
    reader.readAsArrayBuffer(file);
        });

    window.onload = function () {
        hideLoadingScreen();
    checkResolution();
    var activeElement = document.querySelector(".sidebar-item.active");
    if (activeElement) {
        activeElement.scrollIntoView();
            }
    validarMensajeError();

    $('#tiposTokenSelector').chosen({
        width: '100%', // Ajusta el ancho al 100% del contenedor
    placeholder_text_multiple: 'Selecciona los tipos de token', // Texto de placeholder para múltiples selecciones
    search_contains: true, // Permite búsqueda por texto parcial
    allow_single_deselect: true // Permite deseleccionar opciones,

            });
        }

    window.onresize = function () {
        checkResolution();
        }

    function generarTokens(){

        showLoadingScreen();

    var TokensSeleccionados = $('#tiposTokenSelector').val();

    var tokenDTOList = TokensSeleccionados.map(function (token) {
                return {tipoToken: token };
            });

    document.getElementById("descripcionSolicitud").disabled = false;
    var descripcionSolicitud = document.getElementById("descripcionSolicitud").value;

    var formData = new FormData();
    formData.append("archivo", archivoJson);
    formData.append("tiposToken", JSON.stringify(tokenDTOList));
    formData.append("descripcionSolicitud", descripcionSolicitud);

        fetch('/Token/cargarArchivo', {
        method: 'POST',
    body: formData
            })
                .then(response => response.json())
                .then(data => {

                    if (data.success) {
        SuccessfulRedirectAlert(data.text, '/Home/Index');

    $('#archivoForm')[0].reset();
    hideLoadingScreen();

                    } else {

                        
                        if(data.codigo != 400){
        errorAlert(data.data);
    hideLoadingScreen();

                        }else{

        errorAlert(data.text);

    // Crear un Blob con el contenido del archivo
    const blob = new Blob([data.data], {type: 'text/plain' });

    // Crear un enlace temporal para la descarga
    const enlace = document.createElement('a');
    enlace.href = URL.createObjectURL(blob);

    // Asignar nombre al archivo
    enlace.download = 'ErroresArchivoGeneracionMasiva.txt';

    // Simular un clic en el enlace para iniciar la descarga
    enlace.click();

    // Liberar el objeto URL después de la descarga
    URL.revokeObjectURL(enlace.href);

    hideLoadingScreen();

                        }
                        
                    }
                })
                .catch(error => {
        hideLoadingScreen();
    console.error('Error:', error);
    Swal.fire('Error!', 'Hubo un error al procesar la solicitud.', 'error');
                });

        }

    function inicializarTabla(datos) {

            if ($.fn.DataTable.isDataTable('#tablaMedidoresCargados')) {
        $('#tablaMedidoresCargados').DataTable().clear().destroy();
            }


    // tablaMedidoresCargados = $('#tablaMedidoresCargados').DataTable();
    // tablaMedidoresCargados.destroy();

    $('#tablaMedidoresCargados').DataTable({
        "pageLength": 10, // Limita la cantidad de registros por página a 10
    "searching": true, // Oculta el input de búsqueda
    "ordering": false,
    "paginate": true,
    "lengthChange": true, // Oculta la opción "Show entries"
    "info": true, // Oculta el texto "Showing X of Y entries",
    "responsive": true,
    "bAutoWidth": false,
    "deferRender": true,
    "zeroRecords": "No se encontraron resultados",

    "language": {
        "paginate": {
        "previous": "<i class='fas fa-chevron-left'></i>",
    "next": "<i class='fas fa-chevron-right'></i>"
                    },
    "emptyTable": "<span>No hay datos disponibles en la tabla</span>",
    "info": "<span>Mostrando _START_ a _END_ de _TOTAL_ entradas</span>",
    "infoEmpty": "<span>Mostrando 0 a 0 de 0 entradas</span>",
    "infoFiltered": "<span>(filtrado de _MAX_ total de entradas)</span>",
    "infoPostFix": "",
    "lengthMenu": "<span>Mostrar _MENU_ entradas</span>",
    "loadingRecords": "<span>Cargando...</span>",
    "processing": "<span>Procesando...</span>",
    "search": "<span>Buscar en la tabla:</span>",
    "zeroRecords": "<span>No se encontraron registros coincidentes</span>",


                },
    "order": [[0, 'asc']],
    "data": datos,
    "columns": [

    {"data": "medidor", "title": "Medidor", "autoWidth": true },
    {"data": "valor", "title": "Valor", "autoWidth": true },

    ],
            });
    $('#tiposTokenAGenerar').show();
    $('#removerTabla').show();
    $('#GenerarTokens').show();


    hideLoadingScreen();
        }

    function removerTabla(){

        $('#archivoForm')[0].reset();
    document.getElementById("descripcionSolicitud").disabled = false;
    document.getElementById("archivoMedidores").disabled = false;
    document.getElementById("subirArchivoMedidores").disabled = false;

    $('#tiposTokenAGenerar').hide();
    $('#removerTabla').hide();
    $('#GenerarTokens').hide();
           
            if ($('#tiposTokenSelector').val().length > 0) {

        $("#tiposTokenSelector").val([]).trigger("chosen:updated");
            }


    $('#tablaMedidoresCargados').DataTable().clear().destroy();
    $('#tablaMedidoresCargados thead').empty(); // Elimina los encabezados de las columnas
    $('#tablaMedidoresCargados tbody').empty(); // Elimina el cuerpo de la tabla, si es necesario

        }

    function validarMensajeError() {
            
    if (mensajeError != null) {
        errorRedirectAlert(mensajeError, '/Home/Index');
            }
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

    function SuccessfulAlert(text) {
        Swal.fire({
            title: "Completado!",
            text: text,
            icon: "success",
            confirmButtonColor: "#84bd00"
        });
        }

    function errorRedirectAlert(text, url) {
        Swal.fire({
            title: "Error!",
            text: text,
            icon: "error",
            confirmButtonColor: "#84bd00"
        }).then(function () {
            showLoadingScreen();
            window.location.href = url;
        });
        }

    function SuccessfulRedirectAlert(text, url) {
        Swal.fire({
            title: "Completado!",
            text: text,
            icon: "success",
            confirmButtonColor: "#84bd00"
        }).then(function () {
            showLoadingScreen();
            window.location.href = url;
        });
        }

    function errorAlert(text) {
        Swal.fire({
            title: "Error!",
            text: text,
            icon: "error",
            confirmButtonColor: "#84bd00"
        });
        }
