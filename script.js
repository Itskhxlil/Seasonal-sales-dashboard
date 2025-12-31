// Dashboard object to encapsulate state and methods
const SalesDashboard = {
  chart: null,
  chartType: "bar",
  data: null, // Cache data to avoid unnecessary fetches

  // Fetch data from server
  fetchData: function(callback) {
    $.getJSON("data.php")
      .done(function(data) {
        SalesDashboard.data = data;
        callback(data);
      })
      .fail(function() {
        alert("Error loading data. Please try again.");
      });
  },

  // Process data to extract labels, sales, and KPIs
  processData: function(data) {
    const labels = [];
    const sales = [];
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

    return {
      labels: labels,
      sales: sales,
      total: total.toFixed(2),
      average: (total / sales.length).toFixed(2),
      bestMonth: bestMonth
    };
  },

  // Update KPI displays
  updateKPIs: function(kpis) {
    $("#totalSales").text(kpis.total);
    $("#avgSales").text(kpis.average);
    $("#bestMonth").text(kpis.bestMonth);
  },

  // Render or update the chart
  renderChart: function(processedData) {
    if (this.chart !== null) {
      this.chart.destroy();
    }

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
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  },

  // Load and display chart
  loadChart: function(forceRefresh = false) {
    const callback = (data) => {
      const processed = this.processData(data);
      this.updateKPIs(processed);
      this.renderChart(processed);
    };

    if (forceRefresh || !this.data) {
      this.fetchData(callback);
    } else {
      callback(this.data);
    }
  },

  // Change chart type
  setChartType: function(type) {
    this.chartType = type;
    this.loadChart();
  },

  // Initialize dashboard
  init: function() {
    this.loadChart();

    $("#btnBar").click(() => this.setChartType("bar"));
    $("#btnLine").click(() => this.setChartType("line"));
    $("#btnRefresh").click(() => this.loadChart(true));
  }
};

// Initialize on document ready
$(document).ready(function() {
  SalesDashboard.init();
});
