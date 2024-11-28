var fInicio = null;
var fFin = null;
var serialConsulta = null;

$(document).ready(function () {

    $('#filtrosTransacciones').chosen({
        width: '100%', // Ajusta el ancho al 100% del contenedor
        placeholder_text_multiple: 'Selecciona opciones de filtro', // Texto de placeholder para múltiples selecciones
        search_contains: true, // Permite búsqueda por texto parcial
        allow_single_deselect: true // Permite deseleccionar opciones,

    });

    var tablaTransacciones = $('#tablaTransacciones').DataTable({
        "pageLength": 10, // Limita la cantidad de registros por página a 10
        "searching": false, // Oculta el input de búsqueda
        "ordering": false,
        "paginate": true,
        "lengthChange": true, // Oculta la opción "Show entries"
        "info": false, // Oculta el texto "Showing X of Y entries",
        "responsive": true,
        "bAutoWidth": false,
        "zeroRecords": "No se encontraron resultados",

        "language": {
            "paginate": {
                "previous": "<i class='fas fa-chevron-left'></i>",
                "next": "<i class='fas fa-chevron-right'></i>"
            },
            "processing": "Cargando datos...",
            "lengthMenu": "<span >Mostrar _MENU_ entradas por página</span>",

        },
        "order": [[0, 'asc']],
        "processing": true,
        "serverSide": true,

        "ajax": {
            "url": "/Transaccion/consultarTransacciones",
            "type": "GET",
            "data": function (d) {
                d.page = (d.start / d.length) + 1; // Página actual
                d.pageSize = d.length; // Tamaño de página
            },
            "error": function (xhr, error, thrown) {

                if (xhr.status === 401) {
                    window.location.href = '/Login/SignIn';
                } else {
                    console.log("Error en la petición AJAX:", xhr.responseText);
                    alert("Se produjo un error al cargar los datos: " + error);
                }

            }

        },
        "columns": [

            {
                "data": "fechaRespuesta", "title": "Fecha", "autoWidth": true,
                "render": function (data, type, row) {

                    const fecha = new Date(data);

                    const opciones = {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                        second: 'numeric',
                        hour12: true
                    };

                    const fechaFormateada = fecha.toLocaleDateString('es-ES', opciones);

                    return fechaFormateada;

                },
            },
            { "data": "funcionario", "title": "Funcionario", "autoWidth": true },
            { "data": "tipoToken", "title": "TipoToken", "autoWidth": true },
            {
                "data": "pin", "title": "Token", "autoWidth": true,
                "render": function (data, type, row) {
                    let tokens = "";
                    let tok = "";

                    for (let i = 0; i < data.length; i++) {
                        tok += data[i];
                        if (tok.length == 20) {
                            tokens += tok + "<br>";
                            tok = "";
                        }
                    }

                    return tokens;


                },
            },
            { "data": "medidor", "title": "Medidor", "autoWidth": true },
            {
                "data": null, "title": "Ver más", "autoWidth": true,
                "render": function (data, type, row) {
                    return '<button type="button" onclick=\'verMasTransaccionModal(' + JSON.stringify(row) + ')\' class="mx-auto btn btn-forest-green btn-sm"> <i class="fa-solid fa-circle-info"></i></button>';

                },
            },
        ],
    });




    if (funcionario.funcionario.permisos.find(e => e.nombre == "VerMasInfoTransacciones" && e.estado == true) == null) {

        tablaTransacciones.column(5).visible(false);

    }

    $('#filtrosTransacciones').on('change', function () {
        // Obtener el valor seleccionado (o valores seleccionados en caso de select múltiple)
        var valoresSeleccionados = $(this).val();

        const serial = document.getElementById('serial');

        const fechaInicial = document.getElementById('fechaInicial');
        const fechaFinal = document.getElementById('fechaFinal');


        if (valoresSeleccionados.length == 2) {
            $('#labelBotonFiltro').hide();
        } else {
            $('#labelBotonFiltro').show();
        }

        if (valoresSeleccionados.length >= 1) {
            $('#buscarPorFiltro').show();

        } else {
            $('#buscarPorFiltro').hide();
        }


        // Ejemplo: Mostrar u ocultar divs basados en la selección
        if (valoresSeleccionados.includes('medidor')) {
            serial.disabled = false;
            $('#filtroSerial').show();
        } else {
            serial.disabled = true;
            $('#filtroSerial').hide();

        }

        if (valoresSeleccionados.includes('fechas')) {
            fechaInicial.disabled = false;
            fechaFinal.disabled = false;
            $('#filtroFechas').show();
        } else {
            fechaInicial.disabled = true;
            fechaFinal.disabled = true;
            $('#filtroFechas').hide();
        }
    });

    $('#refrescarTabla').click(function () {
        tablaTransacciones = $('#tablaTransacciones').DataTable();
        if (tablaTransacciones) {
            tablaTransacciones.ajax.reload();
        }
    });

    $('#refrescarTablaCompleta').click(function () {
        tablaTransaccionesCompleto = $('#tablaTransaccionesCompleto').DataTable();
        if (tablaTransaccionesCompleto) {
            tablaTransaccionesCompleto.ajax.reload();
        }
    });


});

$('#sidebar').on('transitionend', function () {
    tablaTransacciones = $('#tablaTransacciones').DataTable();
    if (tablaTransacciones) {
        tablaTransacciones.columns.adjust().responsive.recalc();
    }
});

$('#verInfoCompletaTransaccionModal').on('shown.bs.modal', function () {
    tablaTransaccionesCompleto = $('#tablaTransaccionesCompleto').DataTable();
    if (tablaTransaccionesCompleto) {
        tablaTransaccionesCompleto.columns.adjust().responsive.recalc();
    }
});


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

document.getElementById("filtrosForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Evitar el envío del formulario de forma predeterminada

    showLoadingScreen();

    let filtrosTexto = "Filtros" + "<br>";

    const serial = document.getElementById('serial').value;

    if (serial) {
        filtrosTexto += "Serial: " + serial + "<br>";
    }

    // Obtiene los valores de las fechas inicial y final
    const fechaInicial = document.getElementById('fechaInicial').value;
    const fechaFinal = document.getElementById('fechaFinal').value;



    // Verifica si las fechas no son nulas y actualiza el texto del elemento 'filtrosUsados'
    if (fechaInicial && fechaFinal) {
        filtrosTexto += "Fecha Inicial: " + fechaInicial + "<br>";
        filtrosTexto += "Fecha Final: " + fechaFinal;
    }


    var validacionFechas = validarFechasFiltro(fechaInicial, fechaFinal);

    if (validacionFechas) {

        document.getElementById('filtrosUsados').innerHTML = filtrosTexto;
        $('#filtrosUsados').show();
        tablaTransacciones = $('#tablaTransacciones').DataTable();
        tablaTransacciones.destroy();

        tablaTransacciones = $('#tablaTransacciones').DataTable({
            "pageLength": 10, // Limita la cantidad de registros por página a 10
            "searching": false, // Oculta el input de búsqueda
            "ordering": false,
            "paginate": true,
            "lengthChange": true, // Oculta la opción "Show entries"
            "info": false, // Oculta el texto "Showing X of Y entries",
            "responsive": true,
            "bAutoWidth": false,
            "zeroRecords": "No se encontraron resultados",

            "language": {
                "paginate": {
                    "previous": "<i class='fas fa-chevron-left'></i>",
                    "next": "<i class='fas fa-chevron-right'></i>"
                },
                "processing": "Cargando datos...",
                "lengthMenu": "<span >Mostrar _MENU_ entradas por página</span>",

            },
            "order": [[0, 'asc']],
            "processing": true,
            "serverSide": true,

            "ajax": {
                "url": "/Transaccion/consultarTransacciones",
                "type": "GET",
                "data": function (d) {
                    d.page = (d.start / d.length) + 1; // Página actual
                    d.pageSize = d.length; // Tamaño de página
                    d.sort = serial;
                    d.dateStart = fechaInicial;
                    d.dateEnd = fechaFinal;
                },
                "error": function (xhr, error, thrown) {
                    if (xhr.status === 401) {
                        window.location.href = '/Login/SignIn';
                    } else {
                        console.log("Error en la petición AJAX:", xhr.responseText);
                        alert("Se produjo un error al cargar los datos: " + error);
                    }
                }

            },
            "columns": [

                {
                    "data": "fechaRespuesta", "title": "Fecha", "autoWidth": true,
                    "render": function (data, type, row) {

                        const fecha = new Date(data);

                        const opciones = {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric',
                            second: 'numeric',
                            hour12: true
                        };

                        const fechaFormateada = fecha.toLocaleDateString('es-ES', opciones);

                        return fechaFormateada;

                    },
                },
                { "data": "funcionario", "title": "Funcionario", "autoWidth": true },
                { "data": "tipoToken", "title": "TipoToken", "autoWidth": true },
                {
                    "data": "pin", "title": "Token", "autoWidth": true,
                    "render": function (data, type, row) {
                        let tokens = "";
                        let tok = "";

                        for (let i = 0; i < data.length; i++) {
                            tok += data[i];
                            if (tok.length == 20) {
                                tokens += tok + "<br>";
                                tok = "";
                            }
                        }

                        return tokens;


                    },
                },
                { "data": "medidor", "title": "Medidor", "autoWidth": true },
                {
                    "data": null, "title": "Ver más", "autoWidth": true,
                    "render": function (data, type, row) {
                        return '<button type="button" onclick=\'verMasTransaccionModal(' + JSON.stringify(row) + ')\' class="mx-auto btn btn-forest-green btn-sm"> <i class="fa-solid fa-circle-info"></i></button>';

                    },
                },
            ],
        });

        serialConsulta = document.getElementById('serial').value;
        fInicio = document.getElementById('fechaInicial').value;
        fFin = document.getElementById('fechaFinal').value;

        $('#filtrosForm')[0].reset();
        hideLoadingScreen();
        $('#removerFiltros').show();




        if (funcionario.funcionario.permisos.find(e => e.nombre == "VerMasInfoTransacciones" && e.estado == true) == null) {

            tablaTransacciones.column(5).visible(false);

        }


    } else {
        hideLoadingScreen();
        errorAlert('La fecha inicial debe ser menor a la fecha final');
    }
});

function removerFiltros() {
    $('#removerFiltros').hide();
    $('#filtrosUsados').hide();

    fInicio = null;
    fFin = null;
    serialConsulta = null;

    document.getElementById('filtrosUsados').innerText = null;
    tablaTransacciones = $('#tablaTransacciones').DataTable();
    tablaTransacciones.destroy();



    tablaTransacciones = $('#tablaTransacciones').DataTable({
        "pageLength": 10, // Limita la cantidad de registros por página a 10
        "searching": false, // Oculta el input de búsqueda
        "ordering": false,
        "paginate": true,
        "lengthChange": true, // Oculta la opción "Show entries"
        "info": false, // Oculta el texto "Showing X of Y entries",
        "responsive": true,
        "bAutoWidth": false,
        "zeroRecords": "No se encontraron resultados",

        "language": {
            "paginate": {
                "previous": "<i class='fas fa-chevron-left'></i>",
                "next": "<i class='fas fa-chevron-right'></i>"
            },
            "processing": "Cargando datos...",
            "lengthMenu": "<span >Mostrar _MENU_ entradas por página</span>",

        },
        "order": [[0, 'asc']],
        "processing": true,
        "serverSide": true,

        "ajax": {
            "url": "/Transaccion/consultarTransacciones",
            "type": "GET",
            "data": function (d) {
                d.page = (d.start / d.length) + 1; // Página actual
                d.pageSize = d.length; // Tamaño de página

            },
            "error": function (xhr, error, thrown) {
                if (xhr.status === 401) {
                    window.location.href = '/Login/SignIn';
                } else {
                    console.log("Error en la petición AJAX:", xhr.responseText);
                    alert("Se produjo un error al cargar los datos: " + error);
                }
            }

        },
        "columns": [

            {
                "data": "fechaRespuesta", "title": "Fecha", "autoWidth": true,
                "render": function (data, type, row) {

                    const fecha = new Date(data);

                    const opciones = {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                        second: 'numeric',
                        hour12: true
                    };

                    const fechaFormateada = fecha.toLocaleDateString('es-ES', opciones);

                    return fechaFormateada;

                },
            },
            { "data": "funcionario", "title": "Funcionario", "autoWidth": true },
            { "data": "tipoToken", "title": "TipoToken", "autoWidth": true },
            {
                "data": "pin", "title": "Token", "autoWidth": true,
                "render": function (data, type, row) {
                    let tokens = "";
                    let tok = "";

                    for (let i = 0; i < data.length; i++) {
                        tok += data[i];
                        if (tok.length == 20) {
                            tokens += tok + "<br>";
                            tok = "";
                        }
                    }

                    return tokens;


                },
            },
            { "data": "medidor", "title": "Medidor", "autoWidth": true },
            {
                "data": null, "title": "Ver más", "autoWidth": true,
                "render": function (data, type, row) {
                    return '<button type="button" onclick=\'verMasTransaccionModal(' + JSON.stringify(row) + ')\' class="mx-auto btn btn-forest-green btn-sm"> <i class="fa-solid fa-circle-info"></i></button>';

                },
            },
        ],
    });




    if (funcionario.funcionario.permisos.find(e => e.nombre == "VerMasInfoTransacciones" && e.estado == true) == null) {

        tablaTransacciones.column(5).visible(false);

    }

}


function validarFechasFiltro(inicio, fin) {


    const start = new Date(inicio);
    const end = new Date(fin);

    // Comparar las fechas
    if (start > end) {
        return false;
    } else if (start < end) {
        return true;
    } else {
        return true;
    }
}

function verInfoCompletaTransaccionModal() {
    var verInfoCompletaTransaccionModal = new bootstrap.Modal(document.getElementById('verInfoCompletaTransaccionModal'));
    var tablaTransaccionesCompleto = $('#tablaTransaccionesCompleto').DataTable({
        "pageLength": 10, // Limita la cantidad de registros por página a 10
        "autoFill": true,
        "searching": false, // Oculta el input de búsqueda
        "ordering": false,
        "lengthChange": true, // Oculta la opción "Show entries"
        "info": false, // Oculta el texto "Showing X of Y entries",
        "responsive": true,
        "bAutoWidth": false,
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
            "url": "/Transaccion/consultarTransacciones",
            "type": "GET",
            "data": function (d) {
                d.page = (d.start / d.length) + 1; // Página actual
                d.pageSize = d.length; // Tamaño de página
            },
            "error": function (xhr, error, thrown) {
                if (xhr.status === 401) {
                    window.location.href = '/Login/SignIn';
                } else {
                    console.log("Error en la petición AJAX:", xhr.responseText);
                    alert("Se produjo un error al cargar los datos: " + error);
                }
            }

        },
        "columns": [
            { "data": "empresa", "title": "Empresa", "autoWidth": true },
            { "data": "proyecto", "title": "Proyecto", "autoWidth": true },
            { "data": "medidor", "title": "Medidor", "autoWidth": true },
            { "data": "funcionario", "title": "Funcionario", "autoWidth": true },
            { "data": "tipoToken", "title": "TipoToken", "autoWidth": true },
            { "data": "valor", "title": "Valor", "autoWidth": true },
            { "data": "descripcion", "title": "Descripción", "autoWidth": true },
            {
                "data": "fechaRespuesta", "title": "Fecha", "autoWidth": true,
                "render": function (data, type, row) {

                    const fecha = new Date(data);

                    const opciones = {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                        second: 'numeric',
                        hour12: true
                    };

                    const fechaFormateada = fecha.toLocaleDateString('es-ES', opciones);

                    return fechaFormateada;

                },
            },
            { "data": "respuesta", "title": "Respuesta", "autoWidth": true },
            {
                "data": "pin", "title": "Token", "autoWidth": true,
                "render": function (data, type, row) {
                    let tokens = "";
                    let tok = "";

                    for (let i = 0; i < data.length; i++) {
                        tok += data[i];
                        if (tok.length == 20) {
                            tokens += tok + "<br>";
                            tok = "";
                        }
                    }

                    return tokens;


                },
            },

        ],


    });

    verInfoCompletaTransaccionModal.show();

    $('#verInfoCompletaTransaccionModal').on('hidden.bs.modal', function () {
        tablaTransaccionesCompleto.destroy();
    });
    // var table = new DataTable('#tablaMedidoresCompleto');
    // table.columns.adjust().responsive.recalc();
}

function verMasTransaccionModal(data) {
    var verMasTransaccionModal = new bootstrap.Modal(document.getElementById('verMasTransaccionModal'));

    cargasCamposVerMas(data);
    verMasTransaccionModal.show();
}

function cargasCamposVerMas(data) {

    if (typeof data === 'string') {
        data = JSON.parse(data);
    }

    document.getElementById("verMasEmpresa").value = data.empresa;
    document.getElementById("verMasProyecto").value = data.proyecto;
    document.getElementById("verMasMedidor").value = data.medidor;
    document.getElementById("verMasFuncionario").value = data.funcionario;
    document.getElementById("verMasTipoToken").value = data.tipoToken;
    document.getElementById("verMasValor").value = data.valor;
    document.getElementById("verMasDescripcion").value = data.descripcion;

    var fechaSinFormato = data.fechaRespuesta;

    const fecha = new Date(fechaSinFormato);

    const opciones = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true
    };

    const fechaFormateada = fecha.toLocaleDateString('es-ES', opciones);


    document.getElementById("verMasFechaRespuesta").value = fechaFormateada;

    document.getElementById("verMasRespuesta").value = data.respuesta;

    let tokens = "";
    let tok = "";

    for (let i = 0; i < data.pin.length; i++) {
        tok += data.pin[i];
        if (tok.length == 20) {
            tokens += tok + "\n";
            tok = "";
        }
    }

    document.getElementById("verMasToken").value = tokens;


}


$('#ExportarTransaccionesBoton').click(function () {

    showLoadingScreen();

    // Inicializar como un objeto vacío


    $.ajax({
        url: '/Transaccion/consultarTodasTransacciones',
        type: 'GET',
        data: {
            sort: serialConsulta,   // Ordenar por serialConsulta
            dateStart: fInicio,     // Fecha de inicio
            dateEnd: fFin           // Fecha de fin
        },
        success: function (data) {
            if (data && data.data) {

                var exportData = JSON.stringify(data.data, null, 2);

                //console.log(exportData);
                // Convertir el JSON a Excel y descargarlo
                convertirYDescargarExcel(data.data, 'Transacciones_Completo_' + conversorFecha(new Date()) + '.xlsx');
            } else {
                errorAlert('No se encontraron resultados para la solicitud.');
                hideLoadingScreen();
            }
        },
        error: function () {
            errorAlert('Error al consultar los resultados');
            hideLoadingScreen();
        }
    });

});

function convertirYDescargarExcel(jsonData, fileName) {
    try {
        // Validar que jsonData no esté vacío
        if (!jsonData || jsonData.length === 0) {
            errorAlert('No se encontraron resultados');
            hideLoadingScreen();
            return;
        }

        // Convertir los datos JSON a una hoja de cálculo
        var ws = XLSX.utils.json_to_sheet(jsonData);

        // Calcular el ancho de las columnas basado en el contenido
        var colWidths = jsonData.map(row => {
            return Object.values(row).map(val => Math.max(val ? val.toString().length : 5, 5));
        });

        // Encontrar el ancho máximo para cada columna
        var result = colWidths[0];
        for (var i = 1; i < colWidths.length; i++) {
            for (var j = 0; j < colWidths[i].length; j++) {
                if (result[j] < colWidths[i][j]) {
                    result[j] = colWidths[i][j];
                }
            }
        }

        // Ajustar el ancho de las columnas con un pequeño margen
        ws['!cols'] = result.map(width => {
            return { wch: width + 2 };
        });

        // Crear un nuevo libro de trabajo
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Resultados");

        // Descargar el archivo Excel
        XLSX.writeFile(wb, fileName);

        // Ocultar la pantalla de carga
        hideLoadingScreen();

    } catch (ex) {
        // Mostrar el error en consola y en una alerta
        console.error("Error:", ex);
        errorAlert('Error: ' + ex.message);
        hideLoadingScreen();
    }
}

function conversorFecha(data) {

    const fecha = new Date(data);

    const opciones = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true
    };

    const fechaFormateada = fecha.toLocaleDateString('es-ES', opciones);

    return fechaFormateada;

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
        text: text,  // Usar el parámetro 'text'
        icon: "error",
        'confirmButtonColor': "#84bd00"

    }).then(function () {
        showLoadingScreen();
        window.location.href = url;  // Usar el parámetro 'url'
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