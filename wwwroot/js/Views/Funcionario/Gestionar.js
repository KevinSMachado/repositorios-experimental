

    var usuarioAEditar;

    $(document).ready(function () {

        $('#filtrosFuncionarios').chosen({
            width: '100%', // Ajusta el ancho al 100% del contenedor
            placeholder_text_multiple: 'Selecciona opciones de filtro', // Texto de placeholder para múltiples selecciones
            search_contains: true, // Permite búsqueda por texto parcial
            allow_single_deselect: true // Permite deseleccionar opciones,

        });

    var tablaFuncionarios = $('#tablaFuncionarios').DataTable({
        "pageLength": 10, // Limita la cantidad de registros por página a 10
    "searching": false, // Oculta el input de búsqueda
    "ordering": false,
    "lengthChange": true, // Oculta la opción "Show entries"
    "info": false, // Oculta el texto "Showing X of Y entries",
    "responsive": true,

    "autoFill": true,
    "zeroRecords": "No se encontraron resultados",

    "language": {
        "paginate": {
        "previous": "<i class='fas fa-chevron-left'></i>",
    "next": "<i class='fas fa-chevron-right'></i>"
                    },
    "processing": "Cargando datos...",
    "lengthMenu": "<span >Mostrar _MENU_ entradas por página</span>"
                },
    "order": [[0, 'asc']],
    "processing": true,
    "serverSide": true,

    "ajax": {
        "url": "/Funcionario/consultarFuncionarios",
    "type": "GET",
    "data": function (d) {
        d.page = (d.start / d.length) + 1; // Página actual
    d.pageSize = d.length; // Tamaño de página
                    },
    "error": function (xhr, error, thrown) {
                        if (xhr.status === 401) {
        window.location.href = '/Login/SignIn';
                        }
                    }
                },
    "columns": [

    {
        "data": null,
    "title": "Empresa",
    "render": function (data, type, row) {
                            return "Epm"; // Valor fijo para Empresa
                        }
                    },
    {
        "data": null,
    "title": "Proyecto",
    "render": function (data, type, row) {
                            return "Epm"; // Valor fijo para Proyecto
                        }
                    },
    {"data": "funcionario.codigo", "title": "Código" },
    {"data": "funcionario.estado", "title": "Estado",
    "render": function (data, type, row) {
                            
                            if(data == "0"){
                                return "Activo";
                            }else{
                                return "Inactivo";
                            }
    

                        }
                    },
    {
        "data": null,
    "title": "Rol",
    "render": function (data, type, row) {
                            if (row.funcionario && row.funcionario.rolFuncionario && row.funcionario.rolFuncionario.nombre) {
                                return row.funcionario.rolFuncionario.nombre;
                            } else {
                                return "N/A";
                            }
                        }
                    },
   

    {
        "data": null,
    "title": "Editar",
    "render": function (data, type, row) {
                            return '<button onclick=\'verEditarFuncionarioModal(' + JSON.stringify(row) + ')\' type="button" class="mx-auto btn btn-azul-marino btn-sm"> <i class="fa-solid fa-pen"></i></button>';
                        },
"orderable": false
                    },
{
    "data": null,
        "title": "Eliminar",
            "render": function (data, type, row) {
                return '<button onclick=\'verEliminarFuncionarioModal(' + JSON.stringify(row) + ')\' type="button" class="mx-auto btn btn-danger btn-sm"> <i class="fa-solid fa-trash"></i></button>';
            },
    "orderable": false
},

{
    "data": null,
        "title": "Ver más",
            "render": function (data, type, row) {
                return '<button type="button" onclick=\'verMasFuncionarioModal(' + JSON.stringify(row) + ')\' class="mx-auto btn btn-forest-green btn-sm"> <i class="fa-solid fa-circle-info"></i></button>';

            },
    "orderable": false
}
                ]


            });





if (funcionario.funcionario.permisos.find(e => e.nombre == "EditarFuncionarios" && e.estado == true) == null) {

    tablaTransacciones.column(6).visible(false);

}

if (funcionario.funcionario.permisos.find(e => e.nombre == "EliminarFuncionarios" && e.estado == true) == null) {

    tablaTransacciones.column(7).visible(false);

}

if (funcionario.funcionario.permisos.find(e => e.nombre == "VerMasInfoFuncionarios" && e.estado == true) == null) {

    tablaTransacciones.column(8).visible(false);

}




$('#filtrosFuncionarios').on('change', function () {
    // Obtener el valor seleccionado (o valores seleccionados en caso de select múltiple)
    var valoresSeleccionados = $(this).val();

    const nombre = document.getElementById('filtroNombre');


    if (valoresSeleccionados.length == 1) {
        $('#buscarPorFiltro').show();

    } else {
        $('#buscarPorFiltro').hide();
    }


    // Ejemplo: Mostrar u ocultar divs basados en la selección
    if (valoresSeleccionados.includes('nombre')) {
        nombre.disabled = false;
        $('#filtroNombre').show();
    } else {
        nombre.disabled = true;
        $('#filtroNombre').hide();

    }

});



$('#refrescarTabla').click(function () {
    tablaFuncionarios = $('#tablaFuncionarios').DataTable();
    if (tablaFuncionarios) {
        tablaFuncionarios.ajax.reload();
    }
});

$('#refrescarTablaCompleta').click(function () {
    tablaFuncionariosCompleto = $('#tablaFuncionariosCompleto').DataTable();
    if (tablaFuncionariosCompleto) {
        tablaFuncionariosCompleto.ajax.reload();
    }
});
        });


$('#sidebar').on('transitionend', function () {
    tablaFuncionarios = $('#tablaFuncionarios').DataTable();
    if (tablaFuncionarios) {
        tablaFuncionarios.columns.adjust().responsive.recalc();
    }
});

$('#verInfoCompletaMedidorModal').on('shown.bs.modal', function () {
    tablaFuncionariosCompleto = $('#tablaFuncionariosCompleto').DataTable();
    if (tablaFuncionariosCompleto) {
        tablaFuncionariosCompleto.columns.adjust().responsive.recalc();
    }
});

function verEditarFuncionarioModal(data) {
    var editarFuncionarioModal = new bootstrap.Modal(document.getElementById('editarFuncionarioModal'));


    cargasCamposEditar(data);
    editarFuncionarioModal.show();
}

document.getElementById("filtrosForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Evitar el envío del formulario de forma predeterminada



    const nombre = document.getElementById('nombreFiltro').value;
    let filtrosTexto = "Filtros" + "<br>";

    if (nombre != null) {
        filtrosTexto += "Nombre: " + nombre + "<br>";
        document.getElementById('filtrosUsados').innerHTML = filtrosTexto;
        $('#filtrosUsados').show();
    }

    tablaFuncionarios = $('#tablaFuncionarios').DataTable();
    tablaFuncionarios.destroy();

    tablaFuncionarios = $('#tablaFuncionarios').DataTable({
        "pageLength": 10, // Limita la cantidad de registros por página a 10
        "searching": false, // Oculta el input de búsqueda
        "ordering": false,
        "lengthChange": true, // Oculta la opción "Show entries"
        "info": false, // Oculta el texto "Showing X of Y entries",
        "responsive": true,

        "autoFill": true,
        "zeroRecords": "No se encontraron resultados",

        "language": {
            "paginate": {
                "previous": "<i class='fas fa-chevron-left'></i>",
                "next": "<i class='fas fa-chevron-right'></i>"
            },
            "processing": "Cargando datos...",
            "lengthMenu": "<span >Mostrar _MENU_ entradas por página</span>"
        },
        "order": [[0, 'asc']],
        "processing": true,
        "serverSide": true,

        "ajax": {
            "url": "/Funcionario/consultarFuncionarios",
            "type": "GET",
            "data": function (d) {
                d.page = (d.start / d.length) + 1; // Página actual
                d.pageSize = d.length; // Tamaño de página
                d.sort = nombre;
            },
            "error": function (xhr, error, thrown) {
                if (xhr.status === 401) {
                    window.location.href = '/Login/SignIn';
                }
            }
        },
        "columns": [

            {
                "data": null,
                "title": "Empresa",
                "render": function (data, type, row) {
                    return "Epm"; // Valor fijo para Empresa
                }
            },
            {
                "data": null,
                "title": "Proyecto",
                "render": function (data, type, row) {
                    return "Epm"; // Valor fijo para Proyecto
                }
            },
            { "data": "funcionario.codigo", "title": "Código" },
            {
                "data": "funcionario.estado", "title": "Estado",
                "render": function (data, type, row) {

                    if (data == "0") {
                        return "Activo";
                    } else {
                        return "Inactivo";
                    }


                }
            },
            {
                "data": null,
                "title": "Rol",
                "render": function (data, type, row) {
                    if (row.funcionario && row.funcionario.rolFuncionario && row.funcionario.rolFuncionario.nombre) {
                        return row.funcionario.rolFuncionario.nombre;
                    } else {
                        return "N/A";
                    }
                }
            },
           

            {
                "data": null,
                "title": "Editar",
                "render": function (data, type, row) {
                    return '<button onclick=\'verEditarFuncionarioModal(' + JSON.stringify(row) + ')\' type="button" class="mx-auto btn btn-azul-marino btn-sm"> <i class="fa-solid fa-pen"></i></button>';
                },
                "orderable": false
            },
            {
                "data": null,
                "title": "Eliminar",
                "render": function (data, type, row) {
                    return '<button onclick=\'verEliminarFuncionarioModal(' + JSON.stringify(row) + ')\' type="button" class="mx-auto btn btn-danger btn-sm"> <i class="fa-solid fa-trash"></i></button>';
                },
                "orderable": false
            },

            {
                "data": null,
                "title": "Ver más",
                "render": function (data, type, row) {
                    return '<button type="button" onclick=\'verMasFuncionarioModal(' + JSON.stringify(row) + ')\' class="mx-auto btn btn-forest-green btn-sm"> <i class="fa-solid fa-circle-info"></i></button>';

                },
                "orderable": false
            }
        ]


    });



    $('#filtrosForm')[0].reset();
    hideLoadingScreen();
    $('#removerFiltros').show();


});


function removerFiltros() {
    $('#removerFiltros').hide();
    $('#filtrosUsados').hide();

    document.getElementById('filtrosUsados').innerText = null;

    tablaFuncionarios = $('#tablaFuncionarios').DataTable();
    tablaFuncionarios.destroy();

    tablaFuncionarios = $('#tablaFuncionarios').DataTable({
        "pageLength": 10, // Limita la cantidad de registros por página a 10
        "searching": false, // Oculta el input de búsqueda
        "ordering": false,
        "lengthChange": true, // Oculta la opción "Show entries"
        "info": false, // Oculta el texto "Showing X of Y entries",
        "responsive": true,

        "autoFill": true,
        "zeroRecords": "No se encontraron resultados",

        "language": {
            "paginate": {
                "previous": "<i class='fas fa-chevron-left'></i>",
                "next": "<i class='fas fa-chevron-right'></i>"
            },
            "processing": "Cargando datos...",
            "lengthMenu": "<span >Mostrar _MENU_ entradas por página</span>"
        },
        "order": [[0, 'asc']],
        "processing": true,
        "serverSide": true,

        "ajax": {
            "url": "/Funcionario/consultarFuncionarios",
            "type": "GET",
            "data": function (d) {
                d.page = (d.start / d.length) + 1; // Página actual
                d.pageSize = d.length; // Tamaño de página

            },
            "error": function (xhr, error, thrown) {
                if (xhr.status === 401) {
                    window.location.href = '/Login/SignIn';
                }
            }
        },
        "columns": [

            {
                "data": null,
                "title": "Empresa",
                "render": function (data, type, row) {
                    return "Epm"; // Valor fijo para Empresa
                }
            },
            {
                "data": null,
                "title": "Proyecto",
                "render": function (data, type, row) {
                    return "Epm"; // Valor fijo para Proyecto
                }
            },
            { "data": "funcionario.codigo", "title": "Código" },
            {
                "data": "funcionario.estado", "title": "Estado",
                "render": function (data, type, row) {

                    if (data == "0") {
                        return "Activo";
                    } else {
                        return "Inactivo";
                    }


                }
            },
            {
                "data": null,
                "title": "Rol",
                "render": function (data, type, row) {
                    if (row.funcionario && row.funcionario.rolFuncionario && row.funcionario.rolFuncionario.nombre) {
                        return row.funcionario.rolFuncionario.nombre;
                    } else {
                        return "N/A";
                    }
                }
            },
           

            {
                "data": null,
                "title": "Editar",
                "render": function (data, type, row) {
                    return '<button onclick=\'verEditarFuncionarioModal(' + JSON.stringify(row) + ')\' type="button" class="mx-auto btn btn-azul-marino btn-sm"> <i class="fa-solid fa-pen"></i></button>';
                },
                "orderable": false
            },
            {
                "data": null,
                "title": "Eliminar",
                "render": function (data, type, row) {
                    return '<button onclick=\'verEliminarFuncionarioModal(' + JSON.stringify(row) + ')\' type="button" class="mx-auto btn btn-danger btn-sm"> <i class="fa-solid fa-trash"></i></button>';
                },
                "orderable": false
            },

            {
                "data": null,
                "title": "Ver más",
                "render": function (data, type, row) {
                    return '<button type="button" onclick=\'verMasFuncionarioModal(' + JSON.stringify(row) + ')\' class="mx-auto btn btn-forest-green btn-sm"> <i class="fa-solid fa-circle-info"></i></button>';

                },
                "orderable": false
            }
        ]


    });
}

function verInfoCompletaFuncionarioModal() {
    var verInfoCompletaFuncionarioModal = new bootstrap.Modal(document.getElementById('verInfoCompletaFuncionarioModal'));

    var tablaFuncionariosCompleto = $('#tablaFuncionariosCompleto').DataTable({
        "pageLength": 10, // Limita la cantidad de registros por página a 10
        "searching": false, // Oculta el input de búsqueda
        "ordering": false,
        "lengthChange": true, // Oculta la opción "Show entries"
        "info": false, // Oculta el texto "Showing X of Y entries",
        "responsive": true,

        "autoFill": true,
        "zeroRecords": "No se encontraron resultados",

        "language": {
            "paginate": {
                "previous": "<i class='fas fa-chevron-left'></i>",
                "next": "<i class='fas fa-chevron-right'></i>"
            },
            "processing": "Cargando datos...",
            "lengthMenu": "<span >Mostrar _MENU_ entradas por página</span>"
        },
        "order": [[0, 'asc']],
        "processing": true,
        "serverSide": true,

        "ajax": {
            "url": "/Funcionario/consultarFuncionarios",
            "type": "GET",
            "data": function (d) {
                d.page = (d.start / d.length) + 1; // Página actual
                d.pageSize = d.length; // Tamaño de página

            },
            "error": function (xhr, error, thrown) {
                if (xhr.status === 401) {
                    window.location.href = '/Login/SignIn';
                }
            }
        },
        "columns": [

            {
                "data": null,
                "title": "Empresa",
                "render": function (data, type, row) {
                    return "Epm"; // Valor fijo para Empresa
                }
            },
            {
                "data": null,
                "title": "Proyecto",
                "render": function (data, type, row) {
                    return "Epm"; // Valor fijo para Proyecto
                }
            },
            { "data": "funcionario.codigo", "title": "Código" },
            {
                "data": "funcionario.estado", "title": "Estado",
                "render": function (data, type, row) {

                    if (data == "0") {
                        return "Activo";
                    } else {
                        return "Inactivo";
                    }


                }
            },
            {
                "data": null,
                "title": "Rol",
                "render": function (data, type, row) {
                    if (row.funcionario && row.funcionario.rolFuncionario && row.funcionario.rolFuncionario.nombre) {
                        return row.funcionario.rolFuncionario.nombre;
                    } else {
                        return "N/A";
                    }
                }
            },
          
            { "data": "funcionario.movil", "title": "Celular" },
            { "data": "funcionario.correo", "title": "Correo eléctronico" },



        ]
    });

    verInfoCompletaFuncionarioModal.show();

    $('#verInfoCompletaFuncionarioModal').on('hidden.bs.modal', function () {
        tablaFuncionariosCompleto.destroy();
    });
    // var table = new DataTable('#tablaMedidoresCompleto');
    // table.columns.adjust().responsive.recalc();
}


function verMasFuncionarioModal(data) {
    var verMasFuncionarioModal = new bootstrap.Modal(document.getElementById('verMasFuncionarioModal'));


    cargasCamposVerMas(data);
    verMasFuncionarioModal.show();
}



window.onload = function () {
    hideLoadingScreen();
    checkResolution();
    var activeElement = document.querySelector(".sidebar-item.active");

    if (activeElement) {

        activeElement.scrollIntoView();
    }
    validarMensajeError();


}
window.onresize = function () {

    checkResolution();

}

function abrirCrearFuncionarioModal() {
    $('#funcionarioForm')[0].reset();
    var crearFuncionarioModal = new bootstrap.Modal(document.getElementById('crearFuncionarioModal'));

    crearFuncionarioModal.show();
}


function cargasCamposVerMas(data) {

    if (typeof data === 'string') {
        data = JSON.parse(data);
    }

    document.getElementById("verMasCodigo").value = data.funcionario.codigo;
    document.getElementById("verMasNombre").value = data.funcionario.nombre;
    document.getElementById("verMasEstado").value = data.funcionario.estado;

    if (data.funcionario.rolFuncionario != null) {

        document.getElementById("verMasRol").value = data.funcionario.rolFuncionario.id;

    } else {

        document.getElementById("verMasRol").value = data.funcionario.rolFuncionario;
    }


    document.getElementById("verMasCorreo").value = data.funcionario.correo;
    document.getElementById("verMasMovil").value = data.funcionario.movil;


}

function cargasCamposEditar(data) {

    if (typeof data === 'string') {
        data = JSON.parse(data);
    }

    usuarioAEditar = data.funcionario;

    document.getElementById("editarCodigo").value = data.funcionario.codigo;
    document.getElementById("editarNombre").value = data.funcionario.nombre;
    document.getElementById("editarEstado").value = data.funcionario.estado;

    if (data.funcionario.rolFuncionario != null) {
        document.getElementById("editarRol").value = data.funcionario.rolFuncionario.id;
    } else {
        document.getElementById("editarRol").value = data.funcionario.rolFuncionario;
    }

    document.getElementById("editarCorreo").value = data.funcionario.correo;
    document.getElementById("editarMovil").value = data.funcionario.movil;
    document.getElementById("editarIdFuncionario").value = data.funcionario.idFuncionario;



}

function habilitarFormulario() {
    // Seleccionar el formulario por su ID
    var formulario = document.getElementById('editarFuncionarioForm');

    // Obtener todos los elementos del formulario
    var elementos = formulario.elements;

    // Iterar sobre los elementos y habilitar los que están deshabilitados
    for (var i = 0; i < elementos.length; i++) {
        // Verificar si el elemento está deshabilitado
        if (elementos[i].disabled) {
            elementos[i].disabled = false;
        }
    }

}


function deshabilitarFormulario() {
    // Seleccionar el formulario por su ID
    var formulario = document.getElementById('editarFuncionarioForm');

    // Obtener todos los elementos del formulario
    var elementos = formulario.elements;

    // Iterar sobre los elementos y deshabilitar solo los inputs y selects
    for (var i = 0; i < elementos.length; i++) {
        var element = elementos[i];
        // Verificar si el elemento es un input o un select
        if (element.tagName === 'INPUT' || element.tagName === 'SELECT') {
            element.disabled = true;
        }
    }
}

function editarCampo(idCampo) {

    var campo = document.getElementById(idCampo);


    if (campo.disabled == false) {

        campo.disabled = true;

    } else {
        campo.disabled = false;
    }


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


function validarMensajeError() {
    


    if (mensajeError != null) {
        errorRedirectAlert(mensajeError, '/Home/Index');
    }
}



document.getElementById("funcionarioForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Evitar el envío del formulario de forma predeterminada


    showLoadingScreen();

    var clave1 = document.getElementById("clave1").value;
    var clave2 = document.getElementById("clave2").value;


    // Enviar el formulario mediante AJAX
    var formData = new FormData(this);

    if (clave1 == clave2) {


        formData.append("Clave", clave1);

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
                    SuccessfulReLoadAlert(data.text);
                    $('#funcionarioForm')[0].reset();



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

                Swal.fire(
                    'Error!',
                    'Hubo un error al procesar la solicitud.',
                    'error'
                );
            });
    } else {
        errorAlert("Las contraseñas no coinciden");
        hideLoadingScreen();
    }


});


document.getElementById("editarFuncionarioForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Evitar el envío del formulario de forma predeterminada

    habilitarFormulario();
    showLoadingScreen();

    usuarioAEditar.codigo = document.getElementById("editarCodigo").value;
    usuarioAEditar.nombre = document.getElementById("editarNombre").value;
    usuarioAEditar.estado = document.getElementById("editarEstado").value;
    usuarioAEditar.rol = document.getElementById("editarRol").value;
    usuarioAEditar.correo = document.getElementById("editarCorreo").value;
    usuarioAEditar.movil = document.getElementById("editarMovil").value;

    usuarioAEditar.idPerfil = 1;


    var formData = new FormData();

    for (var key in usuarioAEditar) {
        if (usuarioAEditar.hasOwnProperty(key)) {
            formData.append(key, usuarioAEditar[key]);
        }
    }


    // Enviar el formulario mediante AJAX
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
                SuccessfulReLoadAlert(data.text);
                $('#editarFuncionarioForm')[0].reset();
                deshabilitarFormulario();



            } else {

                // Mostrar una alerta de error
                hideLoadingScreen();
                deshabilitarFormulario();

                errorAlert(data.text);
            }
        })
        .catch(error => {

            // Manejar errores de red u otros errores
            console.error('Error:', error);
            hideLoadingScreen();
            deshabilitarFormulario();

            Swal.fire(
                'Error!',
                'Hubo un error al procesar la solicitud.',
                'error'
            );
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

function SuccessfulReLoadAlert(text) {
    Swal.fire({
        title: "Completado!",
        text: text,  // Usar el parámetro 'text'
        icon: "success",
        'confirmButtonColor': "#84bd00"

    }).then(function () {
        showLoadingScreen();
        location.reload();  // Usar el parámetro 'url'
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

function errorRedirectAlert(text, url) {
    Swal.fire({
        title: "Error!",
        text: text,  // Usar el parámetro 'text'
        icon: "error",
        'confirmButtonColor': "#84bd00"

    }).then(function () {
        showLoadingScreen();
        window.location.href = url;  // Usar el parámetro 'url'
    });
}

function verEliminarFuncionarioModal(data) {


    if (typeof data === 'string') {
        data = JSON.parse(data);
    }

    Swal.fire({
        title: "¿Estás seguro de eliminar el funcionario?",

        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#84bd00",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, eliminar",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            eliminarFuncionario(data.funcionario);

        }
    });


}


function eliminarFuncionario(data) {

    data.idPerfil = 1;

    var formData = new FormData();

    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            formData.append(key, data[key]);
        }
    }


    showLoadingScreen();
    fetch("/Funcionario/eliminarFuncionario", {
        method: "POST",

        body: formData,
    })
        .then(response => response.json())
        .then(data => {

            // Verificar si el registro fue exitoso
            if (data.success) {

                // Mostrar una alerta de éxito

                hideLoadingScreen();
                SuccessfulReLoadAlert(data.text);
                //$('#funcionarioForm')[0].reset();



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

            Swal.fire(
                'Error!',
                'Hubo un error al procesar la solicitud.',
                'error'
            );
        });
}

function convertirFechaLarga(fechaStr) {

    // Cadena de texto con la fecha
    var fechaTexto = fechaStr; // Nota los espacios adicionales aquí

    // Dividimos la cadena en partes, quitando espacios adicionales
    var partes = fechaTexto.split(/\s+/);

    // Obtenemos el día, mes y año
    var dia = parseInt(partes[1]);
    var mes = obtenerNumeroMes(partes[0]); // Convertimos el nombre del mes a número
    var año = parseInt(partes[2]);

    // Creamos un objeto Date
    var fecha = new Date(año, mes, dia);

    // Formateamos la salida en formato 'dd/mm/yyyy'
    var fechaFormateada = (dia < 10 ? '0' : '') + dia + '/' + (mes + 1 < 10 ? '0' : '') + (mes + 1) + '/' + año;


    var partes = fechaFormateada.split('/');
    var año = parseInt(partes[2]);
    var mes = parseInt(partes[1]) - 1; // Restamos 1 al mes porque en JavaScript los meses van de 0 a 11
    var dia = parseInt(partes[0]);

    // Creamos un objeto Date con los componentes
    var fechaDate = new Date(año, mes, dia);

    // Devolvemos la fecha en formato ISO (YYYY-MM-DD)
    return fechaDate.toISOString().split('T')[0];

}


function convertirFechaCorta(fechaStr) {

    var dia = parseInt(fecha.substring(0, 2));
    var mes = parseInt(fecha.substring(2, 4)) - 1; // Restamos 1 al mes porque en JavaScript los meses van de 0 a 11
    var año = parseInt(fecha.substring(4, 8));

    // Creamos un objeto Date con los componentes
    var fechaDate = new Date(año, mes, dia);

    // Devolvemos la fecha en formato ISO (YYYY-MM-DD)
    return fechaDate.toISOString().split('T')[0];
}



function obtenerNumeroMes(nombreMes) {
    var meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    return meses.indexOf(nombreMes);
}


