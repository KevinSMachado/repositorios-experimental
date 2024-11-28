
        var fechaActual;
        var informe;
var informeObjeto;
        var fechaInicial;
var dataPorTipoTranssaccion;
$('#ExportarYGraficos').hide();


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


        document.getElementById("informeTransaccionesForm").addEventListener("submit", function (event) {
            event.preventDefault(); // Evitar el envío del formulario de forma predeterminada

            showLoadingScreen();

            let filtrosTexto = "<strong>Filtros</strong>" + "<br>";


            // Obtiene los valores de las fechas inicial y final
             fechaInicial = document.getElementById('fechaInicial').value;
             fechaFinal = document.getElementById('fechaFinal').value;

            // Verifica si las fechas no son nulas y actualiza el texto del elemento 'filtrosUsados'
            if (fechaInicial && fechaFinal) {
                filtrosTexto += "Fecha Inicial: " + fechaInicial + "<br>";
                filtrosTexto += "Fecha Final: " + fechaFinal;
            }


            var validacionFechas = validarFechasFiltro(fechaInicial, fechaFinal);

            if (validacionFechas) {

                document.getElementById('filtrosUsados').innerHTML = filtrosTexto;


                // Crear los parámetros de la URL a partir de los datos del formulario
                const params = new URLSearchParams(new FormData(this)).toString();

                fetch(this.action + '?' + params, {
                    method: this.method  // Debe ser 'GET' en este caso
                })
                    .then(response => response.json())
                    .then(data => {

                        // Verificar si el registro fue exitoso
                        if (data.success) {

                            informeObjeto = data.data;
                            dataPorTipoTranssaccion = informeObjeto.tiposTransacciones.map(tipo => ({
                                name: tipo.tipoTransaccion,
                                data: [
                                    tipo.cantExitosas,
                                    tipo.cantFallidas,
                                    tipo.totalTransacciones
                                ]
                            }));
                            calcularInforme(data.data);
                            hideLoadingScreen();

                        } else {

                            // Mostrar una alerta de error
                            hideLoadingScreen();

                            document.getElementById('filtrosUsados').innerText = null;
                            errorAlert(data.text);
                        }
                    })
                    .catch(error => {

                        // Manejar errores de red u otros errores
                        console.error('Error:', error);
                        hideLoadingScreen();
                        document.getElementById('filtrosUsados').innerText = null;

                        Swal.fire({
                            title: "Error!",
                            text: 'Hubo un error al procesar la solicitud.',  // Usar el parámetro 'text'
                            icon: "error",
                            'confirmButtonColor': "#84bd00"
                        });
                    });




            } else {
                hideLoadingScreen();
                errorAlert('La fecha inicial debe ser menor a la fecha final');
            }
        });

        function calcularInforme(informeT) {

            var Transacciones = informeT;

            fechaActual = new Date();

            document.getElementById('FechaActual').innerText = conversorFecha(fechaActual);

            // Construir el string organizado
            informe = `
                            <strong>Número total de transacciones:</strong> ${Transacciones.totalTransacciones}<br>

                                    <strong>Número de transacciones exitosas:</strong> ${Transacciones.totalCantExitosas}<br>

                                   <strong>Número de transacciones fallidas:</strong> ${Transacciones.totalCantFallidas}<br><br>`;

            Transacciones.tiposTransacciones.forEach(transaccion => {
                informe += `<strong>  ${transaccion.tipoTransaccion}: </strong><br>`;
                informe += `        - Total: ${transaccion.totalTransacciones}<br>`;
                informe += `        - Exitosas: ${transaccion.cantExitosas}<br>`;
                informe += `        - Fallidas: ${transaccion.cantFallidas}<br><br>`;
            });


            // Mostrar el informe en el HTML
            document.getElementById('resultadoInforme').innerHTML = informe;

            // Guardar el informe para exportarlo
            window.informeTexto = informe;
            $('#ExportarYGraficos').show();
            $('#exportarBoton').show();
            $('#fechaInforme').show();
            $('#removerFiltros').show();
        }

        function removerFiltros() {
            $('#removerFiltros').hide();
            $('#fechaInforme').hide();
            $('#exportarBoton').hide();
            $('#ExportarYGraficos').hide();
            document.getElementById('FechaActual').innerText = null;
            document.getElementById('filtrosUsados').innerText = null;
            document.getElementById('resultadoInforme').innerText = null;
            $('#informeTransaccionesForm')[0].reset();
            informe = null;

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

        function exportarPDF() {
            showLoadingScreen();

            const element = document.getElementById('content');

            // Configura las opciones de html2pdf
            const options = {
                margin: [20, 20], // Margen de 20px arriba y abajo
                filename: 'Informe_Transacciones_' + conversorFecha(fechaActual) + '.pdf',
            };

            // Convierte el contenido a PDF
            html2pdf().from(element).set(options).save().then(() => {
                hideLoadingScreen();
            });

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

        $(document).ready(function () {
            $('#btnVerGraficas').on('click', function () {
                document.getElementById('totalTrans').innerHTML = "Número total de transacciones: " + informeObjeto.totalTransacciones;
                $('#graficaModal').modal('show');
            });



            // Inicializar la gráfica al mostrar el modal
            $('#graficaModal').on('shown.bs.modal', function () {

                
                

                Highcharts.setOptions({
                    lang: {
                        contextButtonTitle: "Menú de exportación",
                        downloadJPEG: "Descargar en formato JPEG",
                        downloadPDF: "Descargar en formato PDF",
                        downloadPNG: "Descargar en formato PNG",
                        downloadSVG: "Descargar en formato SVG",
                        downloadCSV: "Descargar en formato CSV",
                        downloadXLS: "Descargar en formato XLS",
                        printChart: "Imprimir gráfico",
                        viewFullscreen: "Ver en pantalla completa",
                        viewData: "Ver tabla de datos",
                        openInCloud: "Abrir en Highcharts Cloud",
                        loading: "Cargando...",
                        months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
                        weekdays: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
                        shortMonths: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
                        exportButtonTitle: "Exportar",
                        printButtonTitle: "Imprimir",
                        rangeSelectorFrom: "Desde",
                        rangeSelectorTo: "Hasta",
                        rangeSelectorZoom: "Período",
                        resetZoom: "Restablecer zoom",
                        resetZoomTitle: "Restablecer nivel de zoom 1:1",
                        thousandsSep: ".",
                        decimalPoint: ","
                    }
                });


                Highcharts.getSVG = function (charts, options, callback) {
                    let top = 0,
                        width = 0;
                    const svgArr = [],
                        titleHeight = 220, // Mantenemos la altura reservada para el título
                        titlePadding = 20, // Añadimos un pequeño padding
                        addSVG = function (svgres) {
                            const svgWidth = +svgres.match(/^<svg[^>]*width\s*=\s*\"?(\d+)\"?[^>]*>/)[1],
                                svgHeight = +svgres.match(/^<svg[^>]*height\s*=\s*\"?(\d+)\"?[^>]*>/)[1];
                            let svg = svgres.replace('<svg', `<g transform="translate(0,${top + titleHeight})" `);
                            svg = svg.replace('</svg>', '</g>');
                            top += svgHeight;
                            width = Math.max(width, svgWidth);
                            svgArr.push(svg);
                        },
                        exportChart = function (i) {
                            if (i === charts.length) {
                                const titleLines = options.title.split('\n');
                                const finalSVG = `<svg version="1.1" width="${width}" height="${top + titleHeight}"
                                viewBox="0 0 ${width} ${top + titleHeight}" xmlns="http://www.w3.org/2000/svg">
                                <rect x="0" y="0" width="${width}" height="${titleHeight}" fill="#FFFFF"/>
                                ${titleLines.map((line, index) =>
                                    `<text x="${titlePadding}" y="${(index + 1) * 30}" font-size="${index === 0 || index === 2 ? 24 : 20}" font-weight="${index === 0 || index === 2 ? 'bold' : 'normal'}" fill="${index === 0 || index === 2 ? '#456200' : '#000000'}">
                                        ${line}
                                    </text>`
                                                            ).join('')}
                                ${svgArr.join('')}
                                </svg>`;
                                return callback(finalSVG);
                            }
                            charts[i].getSVGForLocalExport(options, {}, function () {
                                console.log('Failed to get SVG');
                            }, function (svg) {
                                addSVG(svg);
                                return exportChart(i + 1);
                            });
                        };
                    exportChart(0);
                };

                /**
                 * Create a global exportCharts method that takes an array of charts as an
                 * argument, and exporting options as the second argument
                 */
                Highcharts.exportCharts = function (charts, options) {
                    options = Highcharts.merge(Highcharts.getOptions().exporting, options);
                    options.filename = 'Informe_Graficos_Transacciones_' + conversorFecha(new Date());

                    // Get SVG asynchronously and then download the resulting SVG
                    Highcharts.getSVG(charts, options, function (svg) {
                        Highcharts.downloadSVGLocal(svg, options, function () {
                            console.log('Failed to export on client side');
                        });
                    });
                };

                // Set global default options for all charts
                Highcharts.setOptions({
                    exporting: {
                        // Ensure the export happens on the client side or not at all
                        fallbackToExportServer: false
                    }
                });

                const chart1 = Highcharts.chart('TransaccionesTipo', {
                    chart: {
                        type: 'pie',
                        options3d: {
                            enabled: true,
                            alpha: 45
                        }
                    },
                    title: {
                        text: 'Distribución de Tipos de Transacciones'
                    },
                    legend: {
                        enabled: true,
                        align: 'right',
                        layout: 'vertical',
                        verticalAlign: 'middle'
                    },
                    credits: {
                        enabled: false
                    },
                    plotOptions: {
                        pie: {
                            innerSize: 100,
                            depth: 45,
                            dataLabels: {
                                enabled: true,
                                format: '{point.name}: {point.y} ({point.percentage:.1f}%)'
                            }
                        }
                    },
                    series: [{
                        name: 'Transacciones',
                        data: informeObjeto.tiposTransacciones.map(function (tipo) {
                            return {
                                name: tipo.tipoTransaccion,
                                y: tipo.totalTransacciones
                            };
                        })
                    }]
                });

                const chart2 = Highcharts.chart('SubtotalTransacciones', {
                    chart: {
                        type: 'pie',
                        options3d: {
                            enabled: true,
                            alpha: 45,
                            beta: 0
                        }
                    },
                    title: {
                        text: 'Distribución de Transacciones Exitosas y No Exitosas'
                    },
                    legend: {
                        enabled: true,
                        align: 'right',
                        layout: 'vertical',
                        verticalAlign: 'middle'
                    },
                    credits: {
                        enabled: false
                    },
                    accessibility: {
                        point: {
                            valueSuffix: '%'
                        }
                    },
                    tooltip: {
                        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            depth: 35,
                            dataLabels: {
                                enabled: true,
                                format: '{point.name}: {point.y} ({point.percentage:.1f}%)'
                            }
                        }
                    },
                    series: [{
                        type: 'pie',
                        name: 'Transacciones',
                        data: [
                            {
                                name: 'Exitosas',
                                y: informeObjeto.totalCantExitosas,
                                color: '#28a745'
                            },
                            {
                                name: 'No Exitosas',
                                y: informeObjeto.totalCantFallidas,
                                color: '#dc3545'
                            }
                        ]
                    }]
                });


                const chart3 = Highcharts.chart('SubTotalTipo', {
                    chart: {
                        type: 'bar',
                        options3d: {
                            enabled: true,
                            alpha: 5,
                            beta: 5,
                            depth: 20
                        }
                    },
                    title: {
                        text: 'Transacciones por Tipos',
                        
                    },
                    xAxis: {
                        categories: ['Exitosas', 'No Exitosas', 'Total transacciones'],
                        title: {
                            text: null
                        },
                        gridLineWidth: 1,
                        lineWidth: 0
                    },
                    yAxis: {

                        title: {
                            text: 'Cantidad transacciones',

                        },
                        gridLineWidth: 1,
                        lineWidth: 0
                    },
                    tooltip: {
                        valueSuffix: ' Transacciones'
                    },
                    plotOptions: {
                        bar: {
                            borderRadius: 5,
                            dataLabels: {
                                enabled: true
                            },
                            groupPadding: 0.1,  // Aumentar el espacio entre grupos de barras
                            pointPadding: 0.2,  // Aumentar el espacio entre barras dentro de un grupo
                        }
                    },
                    legend: {
                        layout: 'vertical',
                        align: 'right',
                        verticalAlign: 'top',
                        x: -40,
                        y: 80,
                        floating: false,
                        borderWidth: 1,
                        backgroundColor:
                            Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
                        shadow: true
                    },
                    credits: {
                        enabled: false
                    },
                    series: dataPorTipoTranssaccion
                });

                document.getElementById('exportarPDFGraficos').addEventListener('click', () => {

                    var fActual = document.getElementById('FechaActual').innerText = conversorFecha(fechaActual);
                    const textoInforme = `Fecha en la que se realiza el informe\n${fActual}\nFiltros\nFecha Inicial: ${fechaInicial}\nFecha Final: ${fechaFinal}`;

                    Highcharts.exportCharts([chart1, chart2, chart3], {
                        type: 'application/pdf',
                        title: textoInforme
                    });
                });
            });

        });

        


   