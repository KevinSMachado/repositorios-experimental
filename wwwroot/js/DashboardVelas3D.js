$(document).ready(function () {

    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: "Dashboard/DashboardVelas3D",
        error: function () {
            alert("Ocurrio un error al consultar los datos");
        },
        success: function (data) {
            console.log(data);
            GraficaVelas3DUnidadesVendidas(data, "dashboardVelas3d");
        }
    });

    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: "Dashboard/DashboardInstalacionesRecargaMes",
        error: function () {
            alert("Ocurrio un error al consultar los datos");
        },
        success: function (data) {
            console.log(data);
            GraficaVelas3D(data, "dashboardVelas3dInstalacionesRecargaMes");
        }
    })
});


function GraficaVelas3DUnidadesVendidas(dataInfo, divId) {
    let serieFinal = [];
    for (let i = 0; i < dataInfo.datos; i++) {
        serieFinal.push({
            name: dataInfo.datos[i].Periodo,
            data: dataInfo.datos[i].Valor,
            colorByPoint: true
        });
    };

    Highcharts.setOptions({
        lang: {
            viewFullscreen: "Ver en pantalla completa",
            printChart: "Imprimir",
            downloadPNG: "PNG",
            downloadJPEG: "JPEG",
            downloadPDF: "PDF",
            downloadSVG: "SVG",
            downloadCSV: "CSV",
            downloadXLS: "XLS",
            viewData: "Ver info"
        }
    });
    // Set up the chart
    const chart = new Highcharts.Chart({
        chart: {
            renderTo: divId,
            type: 'column',
            /*options3d: {
                enabled: true,
                alpha: 15,
                beta: 15,
                depth: 50,
                viewDistance: 25
            }*/
        },
        xAxis: {
            categories: dataInfo.nombres,
            crosshair: true,
            accessibility: {
                description: 'Detalle'
            }
        },
        yAxis: {
            title: {
                enabled: false
            }
        },
        tooltip: {
            headerFormat: '<b>{point.key}</b><br>',
            pointFormat: 'Unidades vendidas: {point.y}'
        },
        title: {
            text: 'Unidades Vendidas Por Tipo Instalación / Estrato',
            align: 'left'
        },
        //subtitle: {
        //    text: 'Source: ' +
        //        '<a href="https://ofv.no/registreringsstatistikk"' +
        //        'target="_blank">OFV</a>',
        //    align: 'left'
        //},
        legend: {
            enabled: true
        },
        plotOptions: {
            column: {
                depth: 25
            }
        },
        series: serieFinal
    });

}

function GraficaVelas3D(dataInfo, divId) { 

    Highcharts.setOptions({
        lang: {
            viewFullscreen: "Ver en pantalla completa",
            printChart: "Imprimir",
            downloadPNG: "PNG",
            downloadJPEG: "JPEG",
            downloadPDF: "PDF",
            downloadSVG: "SVG",
            downloadCSV: "CSV",
            downloadXLS: "XLS",
            viewData: "Ver info"
        }
    });
// Set up the chart
const chart = new Highcharts.Chart({
    chart: {
        renderTo: divId,
        type: 'column',
        options3d: {
            enabled: true,
            alpha: 12,
            beta: 2,
            depth: 90,
            viewDistance: 95
        }
    },
    xAxis: {
        categories: dataInfo.map(x => x.periodo),
        crosshair: true,
        accessibility: {
            description: 'Detalle'
        }
    },
    yAxis: {
        title: {
            enabled: false
        }
    },
    tooltip: {
        headerFormat: '<b>{point.key}</b><br>',
        pointFormat: 'Cantidad instalaciones: {point.y}'
    },
    title: {
        text: 'Instalaciones Con / Sin Recarga Por Mes',
        align: 'left'
    },
    legend: {
        enabled: true
    },
    plotOptions: {
        column: {
            depth: 25
        }
    },
    series: [{
        name: 'Sin Recarga',
        data: dataInfo.map(x => x.sinRecarga),
        colorByPoint: true
    }, {
        name: 'Con Recarga',
        data: dataInfo.map(x => x.conRecarga),
        colorByPoint: true
    }]
});

function showValues() {
    document.getElementById('alpha-value').innerHTML = chart.options.chart.options3d.alpha;
    document.getElementById('beta-value').innerHTML = chart.options.chart.options3d.beta;
    document.getElementById('depth-value').innerHTML = chart.options.chart.options3d.depth;
}

// Activate the sliders
document.querySelectorAll('#sliders input').forEach(input => input.addEventListener('input', e => {
    chart.options.chart.options3d[e.target.id] = parseFloat(e.target.value);
    showValues();
    chart.redraw(false);
}));

    showValues();

}