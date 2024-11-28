
    
    $('#cancelarCambioBoton').hide();
    const valoresOriginales = { };
    
    document.getElementById("PerfilForm").addEventListener("submit", function (event) {
        event.preventDefault(); // Evitar el envío del formulario de forma predeterminada

    showLoadingScreen();
    var claveNueva1 = document.getElementById("claveNueva1");
    var claveNueva2 = document.getElementById("claveNueva2");




    var codigo = document.getElementById("editarCodigo");
    var nombre = document.getElementById("editarNombre");
    var celular = document.getElementById("editarMovil");
    var correo = document.getElementById("editarEmail");

    if(codigo.disabled == true && nombre.disabled == true && celular.disabled == true & correo.disabled == true &&
    claveNueva1.disabled == true && claveNueva2.disabled == true){

        errorAlert('No hay campos para actualizar');
    hideLoadingScreen();

            }else{


                if(claveNueva1.disabled != true && claveNueva2.disabled != true){
                    if ((claveNueva1.value != null || claveNueva1.value != "") && (claveNueva2.value != null || claveNueva2.value != "")) {
                        var valorNuevaClave = validarContraseñasNuevas(claveNueva1.value, claveNueva2.value);
    console.log("Entré a ver la clave");
                    }
                }


    if (valorNuevaClave != false) {

        codigo.disabled = false;
    nombre.disabled = false;
    celular.disabled = false;
    correo.disabled = false;

    funcionario.codigo = codigo.value;
    funcionario.nombre = nombre.value;
    funcionario.celular = celular.value;
    funcionario.correo = correo.value;

    if (valorNuevaClave == true) {
        funcionario.clave = claveNueva1.value;
                    }

    var formData = new FormData();
    formData.append("funcionario", JSON.stringify(funcionario));

    fetch('/Perfil/actualizarPerfil', {
        method: 'POST',
    body: formData
                    })
                        .then(response => response.json())
                        .then(data => {

                            if (data.success) {
        //SuccessfulAlert(data.text);
        codigo.disabled = true;
    nombre.disabled = true;
    celular.disabled = true;
    correo.disabled = true;
    claveNueva1.disabled = true;
    claveNueva2.disabled = true;

    SuccessfulRedirectAlert(data.text, "/Home/SignOut");
    hideLoadingScreen();

                            } else {
        errorAlert(data.text);
    codigo.disabled = true;
    nombre.disabled = true;
    celular.disabled = true;
    correo.disabled = true;
    claveNueva1.disabled = true;
    claveNueva2.disabled = true;
    hideLoadingScreen();
                            }
                        })
                        .catch(error => {
        hideLoadingScreen();
    console.error('Error:', error);
    Swal.fire('Error!', 'Hubo un error al procesar la solicitud.', 'error');
    codigo.disabled = true;
    nombre.disabled = true;
    celular.disabled = true;
    correo.disabled = true;
    claveNueva1.disabled = true;
    claveNueva2.disabled = true;
                        });

                }else{

        hideLoadingScreen();
                }

               

            }

           
        });

    function eliminarPerfil(){

        showLoadingScreen();
    funcionario.estado = 1;
    var formData = new FormData();
    formData.append("funcionario", JSON.stringify(funcionario));

    fetch('/Perfil/eliminarPerfil', {
        method: 'POST',
    body: formData
            })
                .then(response => response.json())
                .then(data => {

                    if (data.success) {
        //SuccessfulAlert(data.text);

        SuccessfulRedirectAlert(data.text, "/Home/SignOut");
    hideLoadingScreen();

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
        }


    function validarContraseñasNuevas(nueva1, nueva2){

            if(nueva1 != nueva2){

        errorAlert('Las contraseñas no coinciden');
    return false;
            }else{

                return true;
            }

        }

    function editarCampo(idCampo) {

            var campo = document.getElementById(idCampo);


    if (campo.disabled == false) {

        campo.disabled = true;
    campo.value = valoresOriginales[idCampo];

            } else {

        campo.disabled = false;
            }
        }



    function validarContraseñaActual(clave){

            var claveIngresada = document.getElementById("claveActual").value;

    var claveNueva1 = document.getElementById("claveNueva1");
    var claveNueva2 = document.getElementById("claveNueva2");




    if(claveIngresada == "" || claveIngresada == null){
        errorAlert('Debes ingresar una contraseña');
            }else{
                if (clave == claveIngresada) {
        SuccessfulAlert('Contraseña correcta');
    claveNueva1.disabled = false;
    claveNueva2.disabled = false;
    $('#cancelarCambioBoton').show();

                    


                } else {
        errorAlert('Contraseña incorrecta');
                }
            }

          

        }

    function cancelarCambioClave(){


        $('#cancelarCambioBoton').hide();

    document.getElementById("claveActual").value = null;

    var claveNueva1 = document.getElementById("claveNueva1");
    var claveNueva2 = document.getElementById("claveNueva2");


    claveNueva1.value = null;
    claveNueva2.value = null;


    claveNueva1.disabled = true;
    claveNueva2.disabled = true;

        }

    document.querySelector("#sidebar").style.zIndex = "0";

    window.onload = function () {



        function almacenarValoresOriginales() {
            const inputs = document.querySelectorAll("input");
            inputs.forEach(input => {
                valoresOriginales[input.id] = input.value;
            });


        }

            almacenarValoresOriginales();

    $('#tablaPermisos').DataTable({
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
               
            });

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

