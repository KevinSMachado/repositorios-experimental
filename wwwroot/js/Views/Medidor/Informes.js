

        
       
        var dataPorFabricante;

        var fechaActual;

        window.onload = function () {
            hideLoadingScreen();
            checkResolution();
            var activeElement = document.querySelector(".sidebar-item.active");
            if (activeElement) {
                activeElement.scrollIntoView();
            }
            validarMensajeError();
            //Medidores = @Html.Raw(medidoresJson);
             

             
           

             fechaActual = new Date();

             document.getElementById('FechaActual').innerText = conversorFecha(fechaActual);

             calcularInforme();




            dataPorFabricante = Medidores.medidoresPorFabricante.map(fabricante => ({
                name: fabricante.fabricante,
                data: [
                    fabricante.estado0,
                    fabricante.estado1,
                    fabricante.otroEstado
                ]
            }));

           

        }

        window.onresize = function () {
            checkResolution();
        }

        function abrirGraficosInformeModal() {
           
            var graficosModal = new bootstrap.Modal(document.getElementById('modalGraficos'));

            graficosModal.show();
        }

        function calcularInforme() {
            
            // Construir el string organizado
            let informe = `
            <strong>Número total de medidores:</strong> ${Medidores.totalMedidores}<br><br>

            <strong>Medidores por Estado:</strong><br>
            - Estado Activo: ${Medidores.medidoresPorEstado.estado0}<br>
            - Estado En Bodega: ${Medidores.medidoresPorEstado.estado1}<br>
                    - Otros Estados: ${Medidores.medidoresPorEstado.otroEstado}<br><br>

            <strong>Medidores Prepago:</strong><br>
            - Estado Activo: ${Medidores.medidoresPrepago.estado0}<br>
            - Estado En Bodega: ${Medidores.medidoresPrepago.estado1}<br>
                    - Otros Estados: ${Medidores.medidoresPrepago.otroEstado}<br><br>

            <strong>Medidores Pospago:</strong><br>
            - Estado Activo: ${Medidores.medidoresPospago.estado0}<br>
            - Estado En Bodega: ${Medidores.medidoresPospago.estado1}<br>
                    - Otros Estados: ${Medidores.medidoresPospago.otroEstado}<br><br>

            <strong>Medidores por Fabricante:</strong><br><br>`;

            Medidores.medidoresPorFabricante.forEach(fabricante => {
                informe += `<strong>  ${fabricante.fabricante}: </strong><br>`;
                informe += `        - Estado Activo: ${fabricante.estado0}<br>`;
                informe += `        - Estado En Bodega: ${fabricante.estado1}<br>`;
                informe += `        - Otros Estados: ${fabricante.otroEstado}<br><br>`;
            });

            informe += `
            <strong>Medidores por Año Base:</strong><br>
            - Año base 1993: ${Medidores.medidoresPorAnoBase.ano1993}<br>
                    - Actualizados a año base 2014: ${Medidores.medidoresPorAnoBase.ano2014}<br>
                    - Año base 1993 que no se pueden actualizar: ${Medidores.medidoresPorAnoBase.noActualizables}<br>`;


            // Mostrar el informe en el HTML
            document.getElementById('resultadoInforme').innerHTML = informe;

            // Guardar el informe para exportarlo
            window.informeTexto = informe;
        }
       


        function exportarPDF() {
            showLoadingScreen();

            const element = document.getElementById('content');

            // Configura las opciones de html2pdf
            const options = {
                margin: [20, 20], // Margen de 20px arriba y abajo
                filename: 'Informe_Medidores_' + conversorFecha(fechaActual) + '.pdf',
            };

            // Convierte el contenido a PDF
            html2pdf().from(element).set(options).save().then(() => {
                hideLoadingScreen();
            });
            
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

        document.addEventListener('DOMContentLoaded', function () {
            // Inicializar gráfico al abrir el modal
            $('#modalGraficos').on('shown.bs.modal', function () {

                
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
                        addSVG = function (svgres) {
                            // Grab width/height from exported chart
                            const svgWidth = +svgres.match(
                                /^<svg[^>]*width\s*=\s*\"?(\d+)\"?[^>]*>/
                            )[1],
                                svgHeight = +svgres.match(
                                    /^<svg[^>]*height\s*=\s*\"?(\d+)\"?[^>]*>/
                                )[1];

                            // Offset the position of this chart in the final SVG
                            let svg = svgres.replace(
                                '<svg',
                                `<g transform="translate(0,${top})" `
                            );
                            svg = svg.replace('</svg>', '</g>');
                            top += svgHeight;
                            width = Math.max(width, svgWidth);
                            svgArr.push(svg);
                        },
                        exportChart = function (i) {
                            if (i === charts.length) {
                                return callback(
                                    `<svg version="1.1" width="${width}" height="${top}"
                                            viewBox="0 0 ${width} ${top}"
                                            xmlns="http://www.w3.org/2000/svg">
                                        ${svgArr.join('')}
                                    </svg>`
                                );
                            }
                            charts[i].getSVGForLocalExport(options, {}, function () {
                                console.log('Failed to get SVG');
                            }, function (svg) {
                                addSVG(svg);
                                // Export next only when this SVG is received
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
                    options.filename = 'Informe_Graficos_Medidores_' + conversorFecha(new Date());

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

                const chart1 = Highcharts.chart('containerGrafico', {
                    chart: {
                        type: 'pie',
                        options3d: {
                            enabled: true,
                            alpha: 45,
                            beta: 0
                        }
                    },
                    title: {
                        text: 'Medidores por Estado'
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
                    legend: {
                        layout: 'vertical',
                        align: 'left',
                        verticalAlign: 'middle',
                        borderWidth: 1,
                        backgroundColor: Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
                        shadow: true
                    },
                    credits: {
                        enabled: false
                    },
                    series: [{
                        type: 'pie',
                        name: 'Número de Medidores',
                        data: [
                            ['Estado Activo', Medidores.medidoresPorEstado.estado0],
                            ['Estado En Bodega', Medidores.medidoresPorEstado.estado1],
                            ['Otros Estados', Medidores.medidoresPorEstado.otroEstado]
                        ]
                    }]
                });

                const chart2 =  Highcharts.chart('containerGraficoAnoBase', {
                    chart: {
                        type: 'pie',
                        options3d: {
                            enabled: true,
                            alpha: 45,
                            beta: 0
                        }
                    },
                    title: {
                        text: 'Número de Medidores por Año Base'
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
                    legend: {
                        layout: 'vertical',
                        align: 'left',
                        verticalAlign: 'middle',
                        borderWidth: 1,
                        backgroundColor: Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
                        shadow: true
                    },
                    credits: {
                        enabled: false
                    },
                    series: [{
                        name: 'Número de Medidores',
                        data: [
                            ['Año base 1993', Medidores.medidoresPorAnoBase.ano1993],
                            ['Actualizados a año base 2014', Medidores.medidoresPorAnoBase.ano2014],
                            ['Año base 1993 que no se pueden actualizar', Medidores.medidoresPorAnoBase.noActualizables]
                        ]
                    }]
                });

                const chart3 =  Highcharts.chart('containerGraficoFuncionalidad', {
                    chart: {
                        type: 'column',
                        options3d: {
                            enabled: true,
                            alpha: 5,
                            beta: 5,
                            depth: 20
                        }
                    },
                    title: {
                        text: 'Medidores por Funcionalidad y Estado',
                        align: 'left'
                    },
                    xAxis: {
                        categories: ['Activo', 'En bodega', 'Otros Estados'],
                        labels: {
                            style: {
                                fontSize: '16px'
                            }
                        }
                    },
                    yAxis: {
                        allowDecimals: false,
                        min: 0,
                        title: {
                            text: 'Número de Medidores',
                            style: {
                                fontSize: '16px'
                            }
                        }
                    },
                    tooltip: {
                        headerFormat: '<b>{point.key}</b><br>',
                        pointFormat: '<span style="color:{series.color}">\u25CF</span> {series.name}: {point.y}'
                    },
                    plotOptions: {
                        column: {
                            stacking: 'normal',
                            groupPadding: 0.1,
                            pointPadding: 0.1,
                            borderWidth: 0,
                            borderRadius: 5,
                            dataLabels: {
                                enabled: true
                            }
                        }
                    },
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom',
                        backgroundColor: Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
                        shadow: true
                    },
                    credits: {
                        enabled: false
                    },
                    series: [{
                        name: 'Prepago',
                        data: [
                            Medidores.medidoresPrepago.estado0,
                            Medidores.medidoresPrepago.estado1,
                            Medidores.medidoresPrepago.otroEstado
                        ],
                        stack: 'Prepago',
                        color: '#28a745'
                    }, {
                        name: 'Pospago',
                        data: [
                            Medidores.medidoresPospago.estado0,
                            Medidores.medidoresPospago.estado1,
                            Medidores.medidoresPospago.otroEstado
                        ],
                        stack: 'Pospago',
                        color: '#007bff' // Color azul para la serie de Pospago
                    }]
                });

                const chart4 = Highcharts.chart('containerGraficoFabricantes', {
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
                        text: 'Número de Medidores por Fabricante y Estado',
                        align: 'left'
                    },
                    xAxis: {
                        categories: ['Activo', 'En bodega', 'Otros Estados'],
                        title: {
                            text: null
                        },
                        gridLineWidth: 1,
                        lineWidth: 0
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: 'Número de Medidores',
                            align: 'right'
                        },
                        labels: {
                            overflow: 'justify'
                        },
                        gridLineWidth: 0
                    },
                    tooltip: {
                        valueSuffix: ' medidores'
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
                    series: dataPorFabricante
                });

                document.getElementById('exportarPDFGraficos').addEventListener('click', () => {
                    Highcharts.exportCharts([chart1, chart2, chart3, chart4], {
                        type: 'application/pdf'
                    });
                });
            });

            Highcharts.charts.forEach(function (chart) {
                if (chart) {
                    chart.reflow();
                }
            });

            
           
        });



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
  