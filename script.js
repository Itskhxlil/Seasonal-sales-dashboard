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

    // Calculate growth percentages
    const growth = sales.map((sale, index) => {
      if (index === 0) return "-";
      const prev = sales[index - 1];
      const change = ((sale - prev) / prev * 100).toFixed(1);
      return change + "%";
    });

    return {
      labels,
      sales,
      growth,
      total: total.toFixed(2),
      average: (total / sales.length).toFixed(2),
      bestMonth: best.month
    };
  }

  updateKPIs(kpis) {
    $("#totalSales").text("$" + kpis.total);
    $("#avgSales").text("$" + kpis.average);
    $("#bestMonth").text(kpis.bestMonth);
  }

  updateTable(processedData) {
    const tbody = $("#salesTable tbody");
    tbody.empty(); // Clear existing rows

    // Show last 5 months or all if less
    const startIndex = Math.max(0, processedData.labels.length - 5);
    for (let i = startIndex; i < processedData.labels.length; i++) {
      const row = `<tr>
        <td>${processedData.labels[i]}</td>
        <td>$${processedData.sales[i].toFixed(2)}</td>
        <td>${processedData.growth[i]}</td>
      </tr>`;
      tbody.append(row);
    }
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
      this.updateKPIs(processed);
      this.updateTable(processed);
      this.renderChart(processed);
    };

    if (forceRefresh || !this.data) this.fetchData(callback);
    else callback(this.data);
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
    this.loadChart();
    $("#btnBar").click(() => this.setChartType("bar"));
    $("#btnLine").click(() => this.setChartType("line"));
    $("#btnRefresh").click(() => this.loadChart(true));
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

    // Update current section
    this.currentSection = sectionName;
  }
}

// Dark Mode Functionality
document.addEventListener('DOMContentLoaded', function() {
  const darkModeToggle = document.getElementById('darkModeToggle');
  const body = document.body;

  // Check for saved dark mode preference
  const darkMode = localStorage.getItem('darkMode');
  if (darkMode === 'enabled') {
    body.classList.add('dark');
    darkModeToggle.textContent = '☀️ Light Mode';
  }

  // Toggle dark mode on button click
  darkModeToggle.addEventListener('click', function() {
    body.classList.toggle('dark');

    if (body.classList.contains('dark')) {
      localStorage.setItem('darkMode', 'enabled');
      darkModeToggle.textContent = '☀️ Light Mode';
      updateChartColors(true); // Update charts for dark mode
    } else {
      localStorage.setItem('darkMode', 'disabled');
      darkModeToggle.textContent = '🌙 Dark Mode';
      updateChartColors(false); // Update charts for light mode
    }
  });

  // Function to update chart colors based on mode
  function updateChartColors(isDark) {
    // Get the dashboard instance and update chart if it exists
    if (window.salesDashboard && window.salesDashboard.chart) {
      const textColor = isDark ? '#e0e0e0' : '#2c3e50';
      const gridColor = isDark ? '#404040' : '#ecf0f1';

      window.salesDashboard.chart.options.plugins.legend.labels.color = textColor;
      window.salesDashboard.chart.options.scales.x.ticks.color = textColor;
      window.salesDashboard.chart.options.scales.y.ticks.color = textColor;
      window.salesDashboard.chart.options.scales.x.grid.color = gridColor;
      window.salesDashboard.chart.options.scales.y.grid.color = gridColor;

      window.salesDashboard.chart.update();
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
});
