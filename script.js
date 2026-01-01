class SalesDashboard {
  constructor() {
    this.chart = null;
    this.analyticsChart = null;
    this.chartType = "bar";
    this.data = null;
  }

  fetchData(callback, dataset = null) {
    let url = "data.php";
    if (dataset) {
      url += "?dataset=" + dataset;
    }
    $.getJSON(url)
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

    // Calculate growth percentages
    const growth = sales.map((sale, index) => {
      if (index === 0) return "-";
      const prev = sales[index - 1];
      const change = ((sale - prev) / prev * 100).toFixed(1);
      return change + "%";
    });

    // Handle empty data case
    const average = sales.length === 0 ? "0.00" : (total / sales.length).toFixed(2);
    const bestMonth = sales.length === 0 ? "-" : best.month;

    return {
      labels,
      sales,
      growth,
      total: total.toFixed(2),
      average: average,
      bestMonth: bestMonth
    };
  }

  updateKPIs(kpis) {
    $("#totalSales").text("$" + kpis.total);
    $("#avgSales").text("$" + kpis.average);
    $("#bestMonth").text(kpis.bestMonth);
  }

  updateTable(processedData, selectedMonth = null) {
    const tbody = $("#salesTable tbody");
    tbody.empty(); // Clear existing rows

    const getPerformanceLabel = (growth) => {
      if (growth === "-" || growth === "N/A") return "N/A";
      const match = growth.match(/(-?\d+\.?\d*)%/);
      if (!match) return "N/A";
      const value = parseFloat(match[1]);
      if (value < 0) return "Low";
      if (value <= 10) return "Medium";
      return "High";
    };

    if (selectedMonth) {
      // Show only the selected month
      const monthIndex = processedData.labels.indexOf(selectedMonth);
      if (monthIndex !== -1) {
        const sales = processedData.sales[monthIndex];
        let growth = processedData.growth[monthIndex];
        if (monthIndex === 0 || processedData.sales[monthIndex - 1] === 0) {
          growth = "N/A";
        }
        const performance = getPerformanceLabel(growth);
        const row = `<tr>
          <td>${selectedMonth}</td>
          <td>$${sales.toFixed(2)}</td>
          <td>${growth}</td>
          <td>${performance}</td>
        </tr>`;
        tbody.append(row);
      }
    } else {
      // Show all months
      for (let i = 0; i < processedData.labels.length; i++) {
        const growth = processedData.growth[i];
        const performance = getPerformanceLabel(growth);
        const row = `<tr>
          <td>${processedData.labels[i]}</td>
          <td>$${processedData.sales[i].toFixed(2)}</td>
          <td>${growth}</td>
          <td>${performance}</td>
        </tr>`;
        tbody.append(row);
      }
    }
  }

  updateSalesDataTable(processedData) {
    const tbody = $("#salesDataTable tbody");
    tbody.empty();
    for (let i = 0; i < processedData.labels.length; i++) {
      const row = `<tr>
        <td>${processedData.labels[i]}</td>
        <td>$${processedData.sales[i].toFixed(2)}</td>
      </tr>`;
      tbody.append(row);
    }
  }

  renderAnalyticsChart(processedData) {
    const ctx = document.getElementById("analyticsChart");
    if (!ctx) return;
    new Chart(ctx, {
      type: "line",
      data: {
        labels: processedData.labels,
        datasets: [{
          label: "Monthly Sales ($)",
          data: processedData.sales,
          backgroundColor: "rgba(102, 126, 234, 0.2)",
          borderColor: "rgba(102, 126, 234, 1)",
          borderWidth: 2,
          fill: true
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            labels: {
              color: getComputedStyle(document.body).getPropertyValue('--text-color')
            }
          }
        },
        scales: {
          x: {
            ticks: {
              color: getComputedStyle(document.body).getPropertyValue('--text-color')
            },
            grid: {
              color: getComputedStyle(document.body).getPropertyValue('--table-border')
            }
          },
          y: {
            beginAtZero: true,
            ticks: {
              color: getComputedStyle(document.body).getPropertyValue('--text-color'),
              callback: function(value) {
                return "$" + value;
              }
            },
            grid: {
              color: getComputedStyle(document.body).getPropertyValue('--table-border')
            }
          }
        }
      }
    });
  }

  updateReportSummary(processedData) {
    const summary = `Total Sales: $${processedData.total}<br>Best Month: ${processedData.bestMonth}`;
    $("#reportSummary").html(summary);
  }

  renderChart(processedData) {
    if (this.chart) this.chart.destroy();

    this.chart = new Chart(document.getElementById("salesChart"), {
      type: this.chartType,
      data: {
        labels: processedData.labels,
        datasets: [{
          label: "Monthly Sales ($)",
          data: processedData.sales,
          backgroundColor: "rgba(102, 126, 234, 0.6)",
          borderColor: "rgba(102, 126, 234, 1)",
          borderWidth: 2,
          fill: this.chartType === "line"
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            labels: {
              color: getComputedStyle(document.body).getPropertyValue('--text-color')
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return "Sales: $" + context.parsed.y.toFixed(2);
              }
            }
          }
        },
        scales: {
          x: {
            ticks: {
              color: getComputedStyle(document.body).getPropertyValue('--text-color')
            },
            grid: {
              color: getComputedStyle(document.body).getPropertyValue('--table-border')
            }
          },
          y: {
            beginAtZero: true,
            ticks: {
              color: getComputedStyle(document.body).getPropertyValue('--text-color'),
              callback: function(value) {
                return "$" + value;
              }
            },
            grid: {
              color: getComputedStyle(document.body).getPropertyValue('--table-border')
            }
          }
        }
      }
    });
  }

  loadChart(forceRefresh = false) {
    const callback = data => {
      const processed = this.processData(data);
      if (data && data.length > 0) {
        // Hide empty state and show dashboard content
        $("#emptyStateMessage").hide();
        $(".kpi-container, .chart-card, .table-card").show();
        this.updateKPIs(processed);
        this.updateTable(processed);
        this.renderChart(processed);
        this.updateSalesDataTable(processed);
        this.renderAnalyticsChart(processed);
        this.updateReportSummary(processed);
        this.populateMonthSelector(processed);
      } else {
        // Show empty state and hide dashboard content
        $("#emptyStateMessage").show();
        $(".kpi-container, .chart-card, .table-card").hide();
      }
    };

    if (forceRefresh || !this.data) this.fetchData(callback);
    else callback(this.data);
  }

  populateMonthSelector(processedData) {
    const selector = $("#monthSelector");
    selector.empty(); // Clear existing options

    // Add "All Months" option
    selector.append('<option value="">All Months</option>');

    // Add all available months from data
    processedData.labels.forEach(month => {
      selector.append(`<option value="${month}">${month}</option>`);
    });
  }

  setChartType(type) {
    this.chartType = type;
    // Update button active states
    $(".btn-chart").removeClass("active");
    if (type === "bar") $("#btnBar").addClass("active");
    else $("#btnLine").addClass("active");
    this.loadChart();
  }

  init() {
    $("#btnBar").click(() => this.setChartType("bar"));
    $("#btnLine").click(() => this.setChartType("line"));
    $("#btnRefresh").click(() => this.loadChart(true));
    $("#monthSelector").change((e) => {
      const selectedMonth = $(e.target).val() || null;
      if (this.data) {
        const processed = this.processData(this.data);
        this.updateTable(processed, selectedMonth);
      }
    });
  }
}

class Navigation {
  constructor() {
    this.currentSection = 'dashboard';
    this.isMobile = window.innerWidth <= 768;
    this.init();
  }

  init() {
    // Add hamburger menu for mobile
    if (this.isMobile) {
      this.addHamburgerMenu();
    }

    // Set up sidebar click handlers
    $('.sidebar-nav a').on('click', (e) => {
      e.preventDefault();
      const section = $(e.currentTarget).data('section');
      this.showSection(section);

      // Close sidebar on mobile after selection
      if (this.isMobile) {
        this.toggleSidebar(false);
      }
    });

    // Show default section
    this.showSection(this.currentSection);
  }

  addHamburgerMenu() {
    // Create hamburger button
    const hamburger = $('<button>', {
      class: 'hamburger-btn',
      html: '☰',
      click: () => this.toggleSidebar()
    });

    // Add to header
    $('.header-content').prepend(hamburger);
  }

  toggleSidebar(show = null) {
    const sidebar = $('.sidebar');
    const isVisible = sidebar.hasClass('sidebar-open');

    if (show === null) {
      show = !isVisible;
    }

    if (show) {
      sidebar.addClass('sidebar-open');
    } else {
      sidebar.removeClass('sidebar-open');
    }
  }

  showSection(sectionName) {
    // Hide all sections
    $('.section').hide();

    // Show selected section
    $(`[data-section="${sectionName}"]`).show();

    // Update active state in sidebar
    $('.sidebar-nav li').removeClass('active');
    $(`.sidebar-nav a[data-section="${sectionName}"]`).parent().addClass('active');

    // Show/hide upload container based on section
    if (sectionName === 'dashboard') {
      $('#uploadContainer').show();
    } else {
      $('#uploadContainer').hide();
    }

    // Update current section
    this.currentSection = sectionName;
  }
}

// Dark Mode Functionality
document.addEventListener('DOMContentLoaded', function() {
  const darkModeCheckbox = document.getElementById('darkModeCheckbox');
  const body = document.body;

  // Check for saved dark mode preference
  const darkMode = localStorage.getItem('darkMode');
  if (darkMode === 'enabled') {
    body.classList.add('dark');
    darkModeCheckbox.checked = true;
  }

  // Toggle dark mode on checkbox change
  darkModeCheckbox.addEventListener('change', function() {
    body.classList.toggle('dark');

    if (body.classList.contains('dark')) {
      localStorage.setItem('darkMode', 'enabled');
      updateChartColors(true); // Update charts for dark mode
    } else {
      localStorage.setItem('darkMode', 'disabled');
      updateChartColors(false); // Update charts for light mode
    }
  });

  // Function to update chart colors based on mode
  function updateChartColors(isDark) {
    // Get the dashboard instance and update charts if they exist
    if (window.salesDashboard) {
      const textColor = isDark ? '#e0e0e0' : '#2c3e50';
      const gridColor = isDark ? '#404040' : '#ecf0f1';

      if (window.salesDashboard.chart) {
        window.salesDashboard.chart.options.plugins.legend.labels.color = textColor;
        window.salesDashboard.chart.options.scales.x.ticks.color = textColor;
        window.salesDashboard.chart.options.scales.y.ticks.color = textColor;
        window.salesDashboard.chart.options.scales.x.grid.color = gridColor;
        window.salesDashboard.chart.options.scales.y.grid.color = gridColor;
        window.salesDashboard.chart.update();
      }

      if (window.salesDashboard.analyticsChart) {
        window.salesDashboard.analyticsChart.options.plugins.legend.labels.color = textColor;
        window.salesDashboard.analyticsChart.options.scales.x.ticks.color = textColor;
        window.salesDashboard.analyticsChart.options.scales.y.ticks.color = textColor;
        window.salesDashboard.analyticsChart.options.scales.x.grid.color = gridColor;
        window.salesDashboard.analyticsChart.options.scales.y.grid.color = gridColor;
        window.salesDashboard.analyticsChart.update();
      }
    }
  }

  // Apply initial chart colors based on current mode
  updateChartColors(body.classList.contains('dark'));
});

$(document).ready(() => {
  // Store dashboard instance globally for dark mode access
  window.salesDashboard = new SalesDashboard();
  window.salesDashboard.init();
  new Navigation();

  // Handle dataset selector change
  $("#datasetSelector").change((e) => {
    const selectedDataset = $(e.target).val();
    if (selectedDataset) {
      window.salesDashboard.fetchData((data) => {
        window.salesDashboard.loadChart(true);
      }, selectedDataset);
    } else {
      // No dataset selected, show empty state
      $("#emptyStateMessage").show();
      $(".kpi-container, .chart-card, .table-card").hide();
      window.salesDashboard.data = null;
    }
  });
});
