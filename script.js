let chart = null;
let chartType = "bar";

function loadChart() {
  $.getJSON("data.php", function (data) {

    let labels = [];
    let sales = [];
    let total = 0;
    let bestValue = 0;
    let bestMonth = "";

    data.forEach(item => {
      labels.push(item.month);
      sales.push(item.sales);
      total += item.sales;

      if (item.sales > bestValue) {
        bestValue = item.sales;
        bestMonth = item.month;
      }
    });

    $("#totalSales").text(total.toFixed(2));
    $("#avgSales").text((total / sales.length).toFixed(2));
    $("#bestMonth").text(bestMonth);

    // 🔥 المهم جدًا
    if (chart !== null) {
      chart.destroy();
    }

    chart = new Chart(document.getElementById("salesChart"), {
      type: chartType,
      data: {
        labels: labels,
        datasets: [{
          label: "Monthly Sales",
          data: sales,
          backgroundColor: "rgba(54, 162, 235, 0.6)"
        }]
      }
    });
  });
}

$(document).ready(function () {

  loadChart();

  $("#btnBar").click(function () {
    chartType = "bar";
    loadChart();
  });

  $("#btnLine").click(function () {
    chartType = "line";
    loadChart();
  });

  $("#btnRefresh").click(function () {
    loadChart();
  });

});
