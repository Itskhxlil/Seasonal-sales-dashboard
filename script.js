$(document).ready(function () {

  $.getJSON("data.json", function (data) {

    let labels = [];
    let values = "";
    let sales = [];

    data.forEach(item => {
      labels.push(item.month);
      sales.push(item.sales);
      values += item.month + " : " + item.sales + "<br>";
    });

    $("#result").html(values);

    new Chart(document.getElementById("salesChart"), {
      type: "bar",
      data: {
        labels: labels,
        datasets: [{
          label: "Monthly Sales",
          data: sales
        }]
      }
    });

    let total = sales.reduce((a, b) => a + b, 0);
    let avg = total / sales.length;
    let max = Math.max(...sales);

    $("#result").append(
      "<br><strong>Total Sales:</strong> " + total +
      "<br><strong>Average Sales:</strong> " + avg.toFixed(2) +
      "<br><strong>Max Sales:</strong> " + max
    );

  });

});
