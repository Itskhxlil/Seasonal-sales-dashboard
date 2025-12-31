class SalesDashboard {
  constructor() {
    this.chart = null;
    this.chartType = "bar";
    this.data = null;
  }

  fetchData(callback) {
    $.getJSON("data.php")
      .done(data => {
        this.data = data;
        callback(data);
      })
      .fail(() => alert("Error loading data. Please try again."));
  }

  processData(data) {
    const labels = data.map(item => item.month);
    const sales = data.map(item => item.sales);
    const total = sales.reduce((sum, val) => sum + val, 0);
    const best = data.reduce((best, item) => item.sales > best.sales ? item : best, { sales: 0, month: "" });

    return {
      labels,
      sales,
      total: total.toFixed(2),
      average: (total / sales.length).toFixed(2),
      bestMonth: best.month
    };
  }

  updateKPIs(kpis) {
    $("#totalSales").text(kpis.total);
    $("#avgSales").text(kpis.average);
    $("#bestMonth").text(kpis.bestMonth);
  }

  renderChart(processedData) {
    if (this.chart) this.chart.destroy();

    this.chart = new Chart(document.getElementById("salesChart"), {
      type: this.chartType,
      data: {
        labels: processedData.labels,
        datasets: [{
          label: "Monthly Sales",
          data: processedData.sales,
          backgroundColor: "rgba(54, 162, 235, 0.6)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: { y: { beginAtZero: true } }
      }
    });
  }

  loadChart(forceRefresh = false) {
    const callback = data => {
      const processed = this.processData(data);
      this.updateKPIs(processed);
      this.renderChart(processed);
    };

    if (forceRefresh || !this.data) this.fetchData(callback);
    else callback(this.data);
  }

  setChartType(type) {
    this.chartType = type;
    this.loadChart();
  }

  init() {
    this.loadChart();
    $("#btnBar").click(() => this.setChartType("bar"));
    $("#btnLine").click(() => this.setChartType("line"));
    $("#btnRefresh").click(() => this.loadChart(true));
  }
}

$(document).ready(() => new SalesDashboard().init());
