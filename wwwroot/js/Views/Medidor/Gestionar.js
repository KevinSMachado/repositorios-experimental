

    function ImportarMed(){
        window.location.href = "/Medidor/Importar";
        }

    $(document).ready(function () {

        $('#filtrosMedidores').chosen({
            width: '100%', // Ajusta el ancho al 100% del contenedor
            placeholder_text_multiple: 'Selecciona opciones de filtro', // Texto de placeholder para múltiples selecciones
            search_contains: true, // Permite búsqueda por texto parcial
            allow_single_deselect: true // Permite deseleccionar opciones,

        });

    var tablaMedidores = $('#tablaMedidores').DataTable({
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
        "url": "/Medidor/consultarMedidores",
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
    {"data": "serial", "title": "Serial" },
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
    {"data": "fabricante", "title": "Fabricante" },
    {"data": "modelo", "title": "Modelo" },
    {"data": "tipoServicio", "title": "Servicio",
    "render": function (data, type, row) {
                            if(data == 0){
                                return "Electricidad (kWhs/10)";
                            }else{
                                if(data == 1){
                                    return "Agua (Mts3)";
                                }else{
                                    if(data == 2){
                                        return "Gas (Mts3)";
                                    }else{
                                        return "Tiempo (Minutos)";
                                    }
                                }
                            }
                        },
                    },


    {
        "data": null,
    "title": "Editar",
    "render": function (data, type, row) {
                            return '<button onclick=\'verEditarMedidorModal(' + JSON.stringify(row) + ')\' type="button" class="mx-auto btn btn-azul-marino btn-sm"> <i class="fa-solid fa-pen"></i></button>';
                        },
"orderable": false
                    },
{
    "data": null,
        "title": "Ver más",
            "render": function (data, type, row) {
                return '<button type="button" onclick=\'verMasMedidorModal(' + JSON.stringify(row) + ')\' class="mx-auto btn btn-forest-green btn-sm"> <i class="fa-solid fa-circle-info"></i></button>';

            },
    "orderable": false
}
                ]

                
            });





if (funcionario.funcionario.permisos.find(e => e.nombre == "EditarMedidores" && e.estado == true) == null) {


    tablaMedidores.column(6).visible(false);
}


if (funcionario.funcionario.permisos.find(e => e.nombre == "VerMasInfoMedidores" && e.estado == true) == null) {


    tablaMedidores.column(7).visible(false);
}

$('#filtrosMedidores').on('change', function () {
    // Obtener el valor seleccionado (o valores seleccionados en caso de select múltiple)
    var valoresSeleccionados = $(this).val();

    const serial = document.getElementById('serial');



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

});



$('#refrescarTabla').click(function () {
    tablaMedidores = $('#tablaMedidores').DataTable();
    if (tablaMedidores) {
        tablaMedidores.ajax.reload();
    }
});

$('#refrescarTablaCompleta').click(function () {
    tablaMedidoresCompleto = $('#tablaMedidoresCompleto').DataTable();
    if (tablaMedidoresCompleto) {
        tablaMedidoresCompleto.ajax.reload();
    }
});
        });


$('#sidebar').on('transitionend', function () {
    tablaMedidores = $('#tablaMedidores').DataTable();
    if (tablaMedidores) {
        tablaMedidores.columns.adjust().responsive.recalc();
    }
});

$('#verInfoCompletaMedidorModal').on('shown.bs.modal', function () {
    tablaMedidoresCompleto = $('#tablaMedidoresCompleto').DataTable();
    if (tablaMedidoresCompleto) {
        tablaMedidoresCompleto.columns.adjust().responsive.recalc();
    }
});

function verEditarMedidorModal(data) {
    var editarMedidorModal = new bootstrap.Modal(document.getElementById('editarMedidorModal'));
    $('#editarMedidorForm')[0].reset();

    cargasCamposEditar(data);
    editarMedidorModal.show();
}

document.getElementById("filtrosForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Evitar el envío del formulario de forma predeterminada

    showLoadingScreen();

    const serial = document.getElementById('serial').value;
    let filtrosTexto = "Filtros" + "<br>";

    if (serial != null) {
        filtrosTexto += "Serial: " + serial + "<br>";
        document.getElementById('filtrosUsados').innerHTML = filtrosTexto;
        $('#filtrosUsados').show();
    }

    tablaMedidores = $('#tablaMedidores').DataTable();
    tablaMedidores.destroy();

    tablaMedidores = $('#tablaMedidores').DataTable({
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
            "url": "/Medidor/consultarMedidores",
            "type": "GET",
            "data": function (d) {
                d.page = (d.start / d.length) + 1; // Página actual
                d.pageSize = d.length; // Tamaño de página
                d.sort = serial;
            },
            "error": function (xhr, error, thrown) {
                if (xhr.status === 401) {
                    window.location.href = '/Login/SignIn';
                }
            }
        },
        "columns": [
            { "data": "serial", "title": "Serial" },
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
            { "data": "fabricante", "title": "Fabricante" },
            { "data": "modelo", "title": "Modelo" },
            {
                "data": "tipoServicio", "title": "Servicio",
                "render": function (data, type, row) {
                    if (data == 0) {
                        return "Electricidad (kWhs/10)";
                    } else {
                        if (data == 1) {
                            return "Agua (Mts3)";
                        } else {
                            if (data == 2) {
                                return "Gas (Mts3)";
                            } else {
                                return "Tiempo (Minutos)";
                            }
                        }
                    }
                },
            },


            {
                "data": null,
                "title": "Editar",
                "render": function (data, type, row) {
                    return '<button onclick=\'verEditarMedidorModal(' + JSON.stringify(row) + ')\' type="button" class="mx-auto btn btn-azul-marino btn-sm"> <i class="fa-solid fa-pen"></i></button>';
                },
                "orderable": false
            },
            {
                "data": null,
                "title": "Ver más",
                "render": function (data, type, row) {
                    return '<button type="button" onclick=\'verMasMedidorModal(' + JSON.stringify(row) + ')\' class="mx-auto btn btn-forest-green btn-sm"> <i class="fa-solid fa-circle-info"></i></button>';

                },
                "orderable": false
            }
        ]


    });

    $('#filtrosForm')[0].reset();
    hideLoadingScreen();
    $('#removerFiltros').show();

    



    if (funcionario.funcionario.permisos.find(e => e.nombre == "EditarMedidores" && e.estado == true) == null) {


        tablaMedidores.column(6).visible(false);
    }


    if (funcionario.funcionario.permisos.find(e => e.nombre == "VerMasInfoMedidores" && e.estado == true) == null) {


        tablaMedidores.column(7).visible(false);
    }





});

function removerFiltros() {
    $('#removerFiltros').hide();
    $('#filtrosUsados').hide();
    document.getElementById('filtrosUsados').innerText = null;

    tablaMedidores = $('#tablaMedidores').DataTable();
    tablaMedidores.destroy();

    tablaMedidores = $('#tablaMedidores').DataTable({
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
            "url": "/Medidor/consultarMedidores",
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
            { "data": "serial", "title": "Serial" },
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
            { "data": "fabricante", "title": "Fabricante" },
            { "data": "modelo", "title": "Modelo" },
            {
                "data": "tipoServicio", "title": "Servicio",
                "render": function (data, type, row) {
                    if (data == 0) {
                        return "Electricidad (kWhs/10)";
                    } else {
                        if (data == 1) {
                            return "Agua (Mts3)";
                        } else {
                            if (data == 2) {
                                return "Gas (Mts3)";
                            } else {
                                return "Tiempo (Minutos)";
                            }
                        }
                    }
                },
            },


            {
                "data": null,
                "title": "Editar",
                "render": function (data, type, row) {
                    return '<button onclick=\'verEditarMedidorModal(' + JSON.stringify(row) + ')\' type="button" class="mx-auto btn btn-azul-marino btn-sm"> <i class="fa-solid fa-pen"></i></button>';
                },
                "orderable": false
            },
            {
                "data": null,
                "title": "Ver más",
                "render": function (data, type, row) {
                    return '<button type="button" onclick=\'verMasMedidorModal(' + JSON.stringify(row) + ')\' class="mx-auto btn btn-forest-green btn-sm"> <i class="fa-solid fa-circle-info"></i></button>';

                },
                "orderable": false
            }
        ]


    });





    if (funcionario.funcionario.permisos.find(e => e.nombre == "EditarMedidores" && e.estado == true) == null) {


        tablaMedidores.column(6).visible(false);
    }


    if (funcionario.funcionario.permisos.find(e => e.nombre == "VerMasInfoMedidores" && e.estado == true) == null) {


        tablaMedidores.column(7).visible(false);
    }
}

function verInfoCompletaMedidorModal() {
    var verInfoCompletaMedidorModal = new bootstrap.Modal(document.getElementById('verInfoCompletaMedidorModal'));

    var tablaMedidoresCompleto = $('#tablaMedidoresCompleto').DataTable({
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
            "url": "/Medidor/consultarMedidores",
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
            { "data": "serial", "title": "Serial" },
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
            { "data": "fabricante", "title": "Fabricante" },
            { "data": "modelo", "title": "Modelo" },
            {
                "data": "tipoServicio", "title": "Servicio",
                "render": function (data, type, row) {
                    if (data == 0) {
                        return "Electricidad (kWhs/10)";
                    } else {
                        if (data == 1) {
                            return "Agua (Mts3)";
                        } else {
                            if (data == 2) {
                                return "Gas (Mts3)";
                            } else {
                                return "Tiempo (Minutos)";
                            }
                        }
                    }
                },
            },
            {
                "data": "modo", "title": "Modo",
                "render": function (data, type, row) {
                    if (data == 0) {
                        return "Pospago";
                    } else {
                        return "Prepago";
                    }
                },
            },
            {
                "data": "estado", "title": "Estado",
                "render": function (data, type, row) {
                    if (data == 0) {
                        return "Activo";
                    } else {
                        if (data == 1) {
                            return "En bodega";
                        } else {
                            if (data == 2) {
                                return "Bloqueado";
                            } else {
                                if (data == 3) {
                                    return "Dado de baja por perdida total";
                                } else {
                                    return "Dado de baja por robo";
                                }
                            }
                        }
                    }
                },
            },
            { "data": "nis", "title": "Nis" },
            { "data": "nic", "title": "Nic" },
            { "data": "anoBase", "title": "Año Base" },
            { "data": "fechaFabricacion", "title": "Fecha de fabricación" },
            {
                "data": "reportaEmail", "title": "ReportaEmail",
                "render": function (data, type, row) {
                    if (data == 0) {
                        return "No";
                    } else {
                        return "Si";
                    }
                },
            },
            { "data": "email", "title": "Correo" },
            {
                "data": "reportaMovil", "title": "ReportaMovil",
                "render": function (data, type, row) {
                    if (data == 0) {
                        return "No";
                    } else {
                        return "Si";
                    }
                },
            },
            { "data": "movil", "title": "Celular" },
            { "data": "sgc", "title": "SGC" },
            {
                "data": "ami", "title": "AMI",
                "render": function (data, type, row) {

                    if (data == 0) {
                        return "STS OFF-LINE";
                    }
                },
            },
            { "data": "ti", "title": "TarifIndex" },
            {
                "data": "tidRo", "title": "TidRollover",
                "render": function (data, type, row) {
                    if (data == 0) {
                        return "Autorizado Automatico";
                    } else {
                        if (data == 1) {
                            return "Autorizado manual (Sectorización)";
                        } else {
                            return "No se puede actualizar";
                        }
                    }
                },
            },
            { "data": "krn", "title": "KRN" }


        ]


    });

    verInfoCompletaMedidorModal.show();

    $('#verInfoCompletaMedidorModal').on('hidden.bs.modal', function () {
        tablaMedidoresCompleto.destroy();
    });
    // var table = new DataTable('#tablaMedidoresCompleto');
    // table.columns.adjust().responsive.recalc();
}


function verMasMedidorModal(data) {
    var verMasMedidorModal = new bootstrap.Modal(document.getElementById('verMasMedidorModal'));


    cargasCamposVerMas(data);
    verMasMedidorModal.show();
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

function abrirCrearMedidorModal() {
    $('#medidorForm')[0].reset();
    var creaMedidorModal = new bootstrap.Modal(document.getElementById('crearMedidorModal'));

    creaMedidorModal.show();
}

document.addEventListener("DOMContentLoaded", function () {
    var fabricante = document.getElementById("fabricante");
    var modelo = document.getElementById("modelo");

    var ReportaMovil = document.getElementById("reportaMovil");
    var ReportaEmail = document.getElementById("reportaEmail");
    var movil = document.getElementById("movil");
    var email = document.getElementById("email");


    var editarModelo = document.getElementById("editarModelo");

    var editarFabricante = document.getElementById("editarFabricante");

    var botonEditarFabricante = document.getElementById("editarFabricanteBoton");

    editarFabricante.addEventListener("change", function () {

        if (editarFabricante.value != "") {
            

            botonEditarFabricante.disabled = true;

            var fabricanteSeleccionado = fabricantesModelosLista.find(item => item.nombreFabricante == editarFabricante.value);


            editarModelo.innerHTML = '';
            const opt = document.createElement('option');
            opt.value = "";
            opt.text = "Selecciona modelo";
            editarModelo.appendChild(opt);


            fabricanteSeleccionado.modelos.forEach(option => {

                const opt = document.createElement('option');
                opt.value = option.codModelo;
                opt.text = option.codModelo;
                editarModelo.appendChild(opt);
            });


            editarModelo.disabled = false;



        } else {
            botonEditarFabricante.disabled = false;
            editarModelo.innerHTML = '';
            const opt = document.createElement('option');
            opt.value = "";
            opt.text = "Selecciona modelo";
            editarModelo.appendChild(opt);

            editarModelo.disabled = true;
        }


    });

    fabricante.addEventListener("change", function () {



        if (fabricante.value != "") {
            


            var fabricanteSeleccionado = fabricantesModelosLista.find(item => item.nombreFabricante == fabricante.value);


            modelo.innerHTML = '';
            const opt = document.createElement('option');
            opt.value = "";
            opt.text = "Selecciona modelo";
            modelo.appendChild(opt);


            fabricanteSeleccionado.modelos.forEach(option => {

                const opt = document.createElement('option');
                opt.value = option.codModelo;
                opt.text = option.codModelo;
                modelo.appendChild(opt);
            });
            modelo.disabled = false;
        } else {

            modelo.innerHTML = '';
            const opt = document.createElement('option');
            opt.value = "";
            opt.text = "Selecciona modelo";
            modelo.appendChild(opt);

            modelo.disabled = true;
        }
    });

    ReportaMovil.addEventListener("change", function () {
        if (ReportaMovil.value != "0" && ReportaMovil.value != "") {
            movil.disabled = false;
        } else {
            movil.disabled = true;
        }
    });

    ReportaEmail.addEventListener("change", function () {
        if (ReportaEmail.value !== "0" && ReportaEmail.value !== "") {
            email.disabled = false;
        } else {
            email.disabled = true;
        }
    });
});

function cargasCamposVerMas(data) {

    if (typeof data === 'string') {
        data = JSON.parse(data);
    }

    var verMasFabricante = document.getElementById("verMasFabricante");
    var verMasModelo = document.getElementById("verMasModelo");
    var verMasServicio = document.getElementById("verMasServicio");
    var verMasMedidor = document.getElementById("verMasMedidor");
    var verMasModo = document.getElementById("verMasModo");
    var verMasEstado = document.getElementById("verMasEstado");
    var verMasNis = document.getElementById("verMasNis");
    var verMasNic = document.getElementById("verMasNic");
    var verMasAñoBase = document.getElementById("verMasAñoBase");
    var verMasFechaFabricacion = document.getElementById("verMasFechaFabricacion");
    var verMasReportaEmail = document.getElementById("verMasReportaEmail");
    var verMasReportaMovil = document.getElementById("verMasReportaMovil");
    var verMasEmail = document.getElementById("verMasEmail");
    var verMasMovil = document.getElementById("verMasMovil");
    var verMasSgc = document.getElementById("verMasSgc");
    var verMasAmi = document.getElementById("verMasAmi");
    var verMasTarifIndex = document.getElementById("verMasTarifIndex");
    var verMasKrn = document.getElementById("verMasKrn");
    var verMasTidRollover = document.getElementById("verMasTidRollover");



    verMasFabricante.value = data.fabricante;

    verMasModelo.value = data.modelo;
    verMasServicio.value = data.tipoServicio;
    verMasMedidor.value = data.serial;
    verMasModo.value = data.modo;
    verMasEstado.value = data.estado;
    verMasNis.value = data.nis;
    verMasNic.value = data.nic;
    verMasAñoBase.value = data.anoBase;

    if (data.fechaFabricacion.length > 8) {
        verMasFechaFabricacion.value = convertirFechaLarga(data.fechaFabricacion);
    } else {
        verMasFechaFabricacion.value = convertirFechaCorta(data.fechaFabricacion);
    }

    verMasReportaEmail.value = data.reportaEmail;
    verMasReportaMovil.value = data.reportaMovil;
    verMasEmail.value = data.email;
    verMasMovil.value = data.movil;
    verMasSgc.value = data.sgc;
    verMasAmi.value = data.ami;
    verMasTarifIndex.value = data.ti;
    verMasKrn.value = data.krn;
    verMasTidRollover.value = data.tidRo;


}

function cargasCamposEditar(data) {

    if (typeof data === 'string') {
        data = JSON.parse(data);
    }

    var editarFabricante = document.getElementById("editarFabricante");
    var editarModelo = document.getElementById("editarModelo");
    var editarServicio = document.getElementById("editarServicio");
    var editarMedidor = document.getElementById("editarMedidor");
    var editarModo = document.getElementById("editarModo");
    var editarEstado = document.getElementById("editarEstado");
    var editarNis = document.getElementById("editarNis");
    var editarNic = document.getElementById("editarNic");
    var editarAñoBase = document.getElementById("editarAñoBase");
    var editarFechaFabricacion = document.getElementById("editarFechaFabricacion");
    var editarReportaEmail = document.getElementById("editarReportaEmail");
    var editarReportaMovil = document.getElementById("editarReportaMovil");
    var editarEmail = document.getElementById("editarEmail");
    var editarMovil = document.getElementById("editarMovil");
    var editarSgc = document.getElementById("editarSgc");
    var editarAmi = document.getElementById("editarAmi");
    var editarTarifIndex = document.getElementById("editarTarifIndex");
    var editarKrn = document.getElementById("editarKrn");
    var editarTidRollover = document.getElementById("editarTidRollover");


    editarFabricante.value = data.fabricante;

    if (editarFabricante.value != "") {
        

        var fabricanteSeleccionado = fabricantesModelosLista.find(item => item.nombreFabricante == editarFabricante.value);


        editarModelo.innerHTML = '';
        const opt = document.createElement('option');
        opt.value = "";
        opt.text = "Selecciona modelo";
        editarModelo.appendChild(opt);


        fabricanteSeleccionado.modelos.forEach(option => {

            const opt = document.createElement('option');
            opt.value = option.codModelo;
            opt.text = option.codModelo;
            editarModelo.appendChild(opt);
        });


    }


    editarModelo.value = data.modelo;
    editarServicio.value = data.tipoServicio;
    editarMedidor.value = data.serial;
    editarModo.value = data.modo;
    editarEstado.value = data.estado;
    editarNis.value = data.nis;
    editarNic.value = data.nic;
    editarAñoBase.value = data.anoBase;

    if (data.fechaFabricacion.length > 8) {
        editarFechaFabricacion.value = convertirFechaLarga(data.fechaFabricacion);

    } else {
        editarFechaFabricacion.value = convertirFechaCorta(data.fechaFabricacion);
    }

    editarReportaEmail.value = data.reportaEmail;
    editarReportaMovil.value = data.reportaMovil;
    editarEmail.value = data.email;
    editarMovil.value = data.movil;
    editarSgc.value = data.sgc;
    editarAmi.value = data.ami;
    editarTarifIndex.value = data.ti;
    editarKrn.value = data.krn;
    editarTidRollover.value = data.tidRo;

}

function habilitarFormulario() {
    // Seleccionar el formulario por su ID
    var formulario = document.getElementById('editarMedidorForm');

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
    var formulario = document.getElementById('editarMedidorForm');

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



    if (idCampo == "editarReportaEmail") {

        var email = document.getElementById("editarEmail");

        if (email.disabled == false) {

            email.disabled = true;
        } else {
            email.disabled = false;

        }

    }

    if (idCampo == "editarReportaMovil") {

        var movil = document.getElementById("editarMovil");

        if (movil.disabled == false) {

            movil.disabled = true;
        } else {
            movil.disabled = false;

        }

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


document.getElementById("editarMedidorForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Evitar el envío del formulario de forma predeterminada


    showLoadingScreen();
    //console.log("Capturé la petición");

    habilitarFormulario();
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
                deshabilitarFormulario();
                hideLoadingScreen();
                SuccessfulReLoadAlert(data.text);
                $('#editarMedidorForm')[0].reset();



            } else {

                // Mostrar una alerta de error
                deshabilitarFormulario();
                hideLoadingScreen();

                errorAlert(data.text);
            }
        })
        .catch(error => {

            // Manejar errores de red u otros errores
            deshabilitarFormulario();
            console.error('Error:', error);
            hideLoadingScreen();

            Swal.fire(
                'Error!',
                'Hubo un error al procesar la solicitud.',
                'error'
            );
        });
});

document.getElementById("medidorForm").addEventListener("submit", function (event) {
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
                SuccessfulReLoadAlert(data.text);
                $('#medidorForm')[0].reset();



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


        
