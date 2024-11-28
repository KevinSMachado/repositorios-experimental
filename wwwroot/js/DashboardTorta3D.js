$(document).ready(function () {

    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: "Dashboard/DashboardTorta3D",
        error: function () {
            alert("Ocurrio un error al consultar los datos");
        },
        success: function (data) {
            console.log(data);
            GraficaTorta3D(data);
        }
    })
});

function GraficaTorta3D(dataPie) {

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

    Highcharts.chart('dashboardtorta3d', {
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
            type: 'pie'
      
    },
    title: {
        text: 'Ventas Día Por Unidad Por Tipo Instalación / Estrato',
        align: 'left'
    },
    tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    accessibility: {
        point: {
            valueSuffix: '%'
        }
    },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: false
            },
            showInLegend: true
        }
    },
    series: [{
        name: 'Ventas día por unidad',
        colorByPoint: true,
        data: [{
            name: dataPie[0].estrato,
            y: dataPie[1].und,
            sliced: true,
            selected: true
        }]
    }]
});
}