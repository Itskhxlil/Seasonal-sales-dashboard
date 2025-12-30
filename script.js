$(document).ready(function () {

  $.getJSON("data.php", function (data) {

    let labels = [];
    let sales = [];

    data.forEach(item => {
      labels.push(item.month);
      sales.push(item.sales);
    });

    new Chart(document.getElementById("salesChart"), {
      type: "bar",
      data: {
        labels: labels,
        datasets: [{
          label: "Monthly Sales (Kaggle Data)",
          data: sales
        }]
      }
    });

  });

});
