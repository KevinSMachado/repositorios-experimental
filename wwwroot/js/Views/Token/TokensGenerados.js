

    var respuestaTransacciones;
    var solicitudesFuncionario;


    $(document).ready(function () {


            var tablaSolicitudesFuncionario = $('#tablaSolicitudesFuncionario').DataTable({
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
    "order": [[0, 'asc']],
    "processing": true,
    "serverSide": true,

    "ajax": {
        "url": "/Token/consultarSolicitudes",
    "type": "GET",
    "dataSrc": function (json) {
        // Aquí almacenas los datos en la variable externa

        solicitudesFuncionario = json.data;
    return json.data;
                        
                    },
    "error": function (xhr, error, thrown) {
                        if (xhr.status === 401) {
        window.location.href = '/Login/SignIn';
                        }
                    }
                },
    "columns": [
    {"data": "idSolicitud", "title": "IdSolicitud" },
    {"data": "codSolicitud", "title": "CodSolicitud" },
    {"data": "cantidadGenerada", "title": "CantidadGenerada" },
    {"data": "cantidadAGenerar", "title": "CantidadAGenerar" },
    {"data": "cantidadFaltante", "title": "CantidadFaltante" },
    {
        "data": "tiempoPromedioEnSegundos", "title": "TiempoPromedioEnMinutos",
    "render": function (data, type, row) {

                            
                            var dataDouble = parseFloat(data) / 60;
    var txt = dataDouble.toFixed(3) + " Minutos";

    return txt;


                        }
                    },
    {
        "data": "tiempoEstimadoRestanteEnSegundos", "title": "TiempoEstimadoRestanteEnMinutos",
    "render": function (data, type, row) {

                            var dataDouble = parseFloat(data) / 60;
    var txt = dataDouble.toFixed(3) + " Minutos";

    return txt;


                        }
                    },
    {
        "data": "estado", "title": "Estado",
    "render": function (data, type, row) {

                            if (data) {
                                return '<span style="color: orange">En proceso</span>';
                            } else {
                                return '<span style="color: green">Completado</span>';
                            }


                        }
                    },
    {
        "data": null, "title": "Exportar",
    "render": function (data, type, row) {

                           
                            if (!row.estado) {
                                return '<button class="btn btn-primary descargar-btn" data-id="' + row.idSolicitud + '" data-codSolicitud="' + row.codSolicitud + '"><i class="fa-solid fa-file-arrow-down"></i></button>';
                                
                            } else {
                                return '<button class="btn btn-primary descargar-btn" disabled data-id="' + row.idSolicitud + '" data-codsolicitud="' + row.codSolicitud + '"><i class="fa-solid fa-file-arrow-down"></i></button>';
                            }
                        }
                    }


    ]


            });

    var tablaTransaccionesRespuesta = $('#tablaTransaccionesRespuesta').DataTable({
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
    "processing": true,
    "serverSide": true,

    "ajax": {
        "url": "/Token/consultarResultadoTransaccionesMasivas",
    "type": "GET",
    "data": function (d) {
        d.page = (d.start / d.length) + 1; // Página actual
    d.pageSize = d.length; // Tamaño de página
                    },
    "dataSrc": function (json) {


        respuestaTransacciones = json.data;
    return json.data;
                        
                    },
    "error": function (xhr, error, thrown) {
                        if (xhr.status === 401) {
        window.location.href = '/Login/SignIn';
                        }
                    }
                },
    "columns": [
    {"data": "serial", "title": "Medidor" },
    {"data": "idSolicitud", "title": "IdSolicitud" },
    {
        "data": "tokenPersonalizado", "title": "CodSolicitud",
    "render": function (data, type, row) {

                            if(data == "ClearCredit"){
                                return "Borrado Crédito";
                            }else{
                                if(data == "PrePayment"){
                                    return "Pospago a Prepago";
                                }else{
                                    if(data == "PostPayment"){
                                        return "Prepago a Pospago";
                                    }else{
                                        if(data == "ClearTamper"){
                                            return "Desbloqueo";
                                        }else{
                                            if (data == "OpenRelay") {
                                                return "Abrir Relay";
                                            }else{
                                                if(data == "CloseRelay"){
                                                    return "Cerrar Relay";
                                                }else{
                                                    if (data == "RecargaElectricidad") {
                                                        return "Recarga técnica";
                                                    } else {
                                                        return "Cambio Llaves Tid";
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }


                        }
                    },
    {"data": "token1", "title": "Token1" },
    {"data": "token2", "title": "Token2" },
    {"data": "token3", "title": "Token3" },
    {"data": "token4", "title": "Token4" },
    {"data": "menError", "title": "Mensaje" },
    {
        "data": "fechaRespuesta", "title": "FechaRespuesta",
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
    ]
            });



    tablaSolicitudesFuncionario.on('draw', function () {
                
                var estadoSolicitudes = 0;

    if(solicitudesFuncionario.length != 0){
        solicitudesFuncionario.forEach(function (item) {
            if (item.estado) {
                estadoSolicitudes = 1;
            }
        });
                }else{
        estadoSolicitudes = 1;
                }


    if(estadoSolicitudes == 0){
        $('#exportarTodasTransaccionesMasivas').prop('disabled', false); // Habilitar un botón
                }

            });


    $('#exportarTodasTransaccionesMasivas').click(function () {

        showLoadingScreen();

    // Inicializar como un objeto vacío
    var serialesToken = { };

    $.ajax({
        url: '/Token/consultarTodosResultadoTransaccionesMasivas',
    type: 'GET',

    success: function (data) {
                        if (data && data.data) {

        data.data.forEach(function (item) {
            // Verificar si el serial ya existe en el objeto
            if (!serialesToken[item.serial]) {
                serialesToken[item.serial] = {
                    Serial: item.serial,
                    Funcionario: item.codigoFuncionario,
                    Tokens: []
                };
            }

            // Agregar tokens personalizados y tokens correspondientes
            var tokensArray = [];
            if (item.token1 !== "N/A") {
                tokensArray.push(item.token1);
            }
            if (item.token2 !== "N/A") {
                tokensArray.push(item.token2);
            }
            if (item.token3 !== "N/A") {
                tokensArray.push(item.token3);
            }
            if (item.token4 !== "N/A") {
                tokensArray.push(item.token4);
            }

            serialesToken[item.serial].Tokens.push({
                TokenPersonalizado: item.tokenPersonalizado,
                Tokens: tokensArray
            });
        });

    // Reorganizar los datos para exportación a Excel
    var exportData = [];

    Object.values(serialesToken).forEach(function (serialItem) {
                                var row = {
        Serial: serialItem.Serial,
    Funcionario: serialItem.Funcionario
                                };

    // Asegurar que cada token personalizado tenga su columna y token debajo
    serialItem.Tokens.forEach(function (token, index) {
        row[`TokenPersonalizado_${index + 1}`] = token.TokenPersonalizado;
    row[`Token_${index + 1}`] = token.Tokens.join(", ");
                                });

    exportData.push(row);
                            });

    //console.log(exportData);
    // Convertir el JSON a Excel y descargarlo
    convertirYDescargarExcel(exportData, 'Transacciones_Masivas_Completo.xlsx');
                        } else {
        errorAlert('No se encontraron resultados para la solicitud.');
                        }
                    },
    error: function () {
        errorAlert('Error al consultar los resultados de las transacciones masivas.');
                    }
                });

            });

    if (tablaSolicitudesFuncionario) {
        tablaSolicitudesFuncionario.columns.adjust().responsive.recalc();
            }

    if (tablaTransaccionesRespuesta) {
        tablaTransaccionesRespuesta.columns.adjust().responsive.recalc();
            }


    $('#refrescarTablas').click(function () {
        tablaSolicitudesFuncionario = $('#tablaSolicitudesFuncionario').DataTable();
    if (tablaSolicitudesFuncionario) {
        tablaSolicitudesFuncionario.ajax.reload();
                }

    tablaTransaccionesRespuesta = $('#tablaTransaccionesRespuesta').DataTable();
    if (tablaTransaccionesRespuesta) {
        tablaTransaccionesRespuesta.ajax.reload();
                }

    if (tablaSolicitudesFuncionario) {
        tablaSolicitudesFuncionario.columns.adjust().responsive.recalc();
                }

    if (tablaTransaccionesRespuesta) {
        tablaTransaccionesRespuesta.columns.adjust().responsive.recalc();
                }

            });

    $('#tablaSolicitudesFuncionario').on('click', '.descargar-btn', function () {

        showLoadingScreen();

    // Inicializar como un objeto vacío
    var serialesToken = { };

    var solicitudId = $(this).data('id');
    var codSolicitud = $(this).data('codsolicitud');

    $.ajax({
        url: '/Token/consultarResultadoTransaccionesMasivasPorSolicitud',
    type: 'GET',
    data: {
        page: 1, // Ajusta la página y el tamaño de página según sea necesario
    pageSize: 1000000000, // Ajustar según sea necesario
    solicitud: solicitudId
                    },
    success: function (data) {
                        if (data && data.data) {

        data.data.forEach(function (item) {
            // Verificar si el serial ya existe en el objeto
            if (!serialesToken[item.serial]) {
                serialesToken[item.serial] = {
                    Serial: item.serial,
                    Funcionario: item.codigoFuncionario,
                    Tokens: []
                };
            }

            // Agregar tokens personalizados y tokens correspondientes
            var tokensArray = [];
            if (item.token1 !== "N/A") {
                tokensArray.push(item.token1);
            }
            if (item.token2 !== "N/A") {
                tokensArray.push(item.token2);
            }
            if (item.token3 !== "N/A") {
                tokensArray.push(item.token3);
            }
            if (item.token4 !== "N/A") {
                tokensArray.push(item.token4);
            }

            serialesToken[item.serial].Tokens.push({
                TokenPersonalizado: item.tokenPersonalizado,
                Tokens: tokensArray
            });
        });

    // Reorganizar los datos para exportación a Excel
    var exportData = [];

    Object.values(serialesToken).forEach(function (serialItem) {
                                var row = {
        Serial: serialItem.Serial,
    Funcionario: serialItem.Funcionario
                                };

    // Asegurar que cada token personalizado tenga su columna y token debajo
    serialItem.Tokens.forEach(function (token, index) {
        row[`TokenPersonalizado_${index + 1}`] = token.TokenPersonalizado;
    row[`Token_${index + 1}`] = token.Tokens.join(", ");
                                });

    exportData.push(row);
                            });

    //console.log(exportData);
    // Convertir el JSON a Excel y descargarlo
    convertirYDescargarExcel(exportData, 'Transacciones_Masivas_' + codSolicitud + '.xlsx');
                        } else {
        errorAlert('No se encontraron resultados para la solicitud.');
                        }
                    },
    error: function () {
        errorAlert('Error al consultar los resultados de las transacciones masivas.');
                    }
                });
            });



    function convertirYDescargarExcel(jsonData, fileName) {
                // Convertir los datos JSON a una hoja de cálculo
                var ws = XLSX.utils.json_to_sheet(jsonData);

                // Calcular el ancho de las columnas basado en el contenido
                var colWidths = jsonData.map(row => {
                    return Object.values(row).map(val => val ? val.toString().length : 10);
                });

    var result = colWidths[0];

    for (var i = 1; i < colWidths.length; i++) {
                    for (var j = 0; j < colWidths[i].length; j++) {
                        if (result[j] < colWidths[i][j]) {
        result[j] = colWidths[i][j];
                        }
                    }
                }

                ws['!cols'] = result.map(width => {
                    return {wch: width + 2 }; // Añadir un pequeño margen al ancho calculado
                });

    // Crear un nuevo libro de trabajo
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Resultados");

    // Descargar el archivo Excel
    XLSX.writeFile(wb, fileName);
    hideLoadingScreen();
            }

            
        });

    $('#sidebar').on('transitionend', function () {
        tablaSolicitudesFuncionario = $('#tablaSolicitudesFuncionario').DataTable();
    if (tablaSolicitudesFuncionario) {
        tablaSolicitudesFuncionario.columns.adjust().responsive.recalc();
            }

    tablaTransaccionesRespuesta = $('#tablaTransaccionesRespuesta').DataTable();
    if (tablaTransaccionesRespuesta) {
        tablaTransaccionesRespuesta.columns.adjust().responsive.recalc();
            }
        });

    function conversorFecha(data){

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
