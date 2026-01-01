<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin Dashboard - Sales Analytics</title>
  <meta name="description" content="Professional admin dashboard for sales analytics with KPIs, charts, and reports.">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="dashboard">
    <aside class="sidebar">
      <div class="sidebar-header">
        <h2>📊 Dashboard</h2>
      </div>
      <nav class="sidebar-nav">
        <ul>
          <li class="active">
            <a href="#" data-section="dashboard"><span class="icon">🏠</span> Dashboard</a>
          </li>
          <li>
            <a href="#" data-section="sales"><span class="icon">💰</span> Sales</a>
          </li>
          <li>
            <a href="#" data-section="analytics"><span class="icon">📈</span> Analytics</a>
          </li>
          <li>
            <a href="#" data-section="reports"><span class="icon">📋</span> Reports</a>
          </li>
          <li>
            <a href="#" data-section="settings"><span class="icon">⚙️</span> Settings</a>
          </li>
        </ul>
      </nav>
    </aside>

    <main class="main-content">
      <header class="header">
        <div class="header-content">
          <div class="header-left">
            <h1>Sales Analytics Dashboard</h1>
            <p>Monitor your sales performance with real-time data and insights.</p>
          </div>

        </div>
      </header>

      <div class="content">
        <!-- Dashboard Section -->
        <section class="section" data-section="dashboard">
          <div class="section-header">
            <h2>Dashboard Overview</h2>
            <p>Main dashboard with key metrics and charts.</p>
            <div class="dataset-selector">
              <label for="datasetSelector">Select Dataset:</label>
              <select id="datasetSelector">
                <option value="">Choose Dataset</option>
                <?php
                $dataDir = __DIR__ . '/data';
                if (is_dir($dataDir)) {
                  $files = glob($dataDir . '/sales*.csv');
                  foreach ($files as $file) {
                    $filename = basename($file, '.csv');
                    echo '<option value="' . htmlspecialchars($filename) . '">' . htmlspecialchars($filename) . '</option>';
                  }
                }
                ?>
              </select>
            </div>
          </div>
          <div id="emptyStateMessage" class="empty-state" style="display: block;">
            <p>Please select a dataset to view data</p>
          </div>
          <div class="kpi-container">
            <div class="kpi-card">
              <div class="kpi-icon">💰</div>
              <div class="kpi-content">
                <h3>Total Sales</h3>
                <p class="kpi-value" id="totalSales">-</p>
                <p class="kpi-subtext">Total revenue generated</p>
              </div>
            </div>
            <div class="kpi-card">
              <div class="kpi-icon">📊</div>
              <div class="kpi-content">
                <h3>Average Sales</h3>
                <p class="kpi-value" id="avgSales">-</p>
                <p class="kpi-subtext">Average monthly sales</p>
              </div>
            </div>
            <div class="kpi-card">
              <div class="kpi-icon">🏆</div>
              <div class="kpi-content">
                <h3>Best Month</h3>
                <p class="kpi-value" id="bestMonth">-</p>
                <p class="kpi-subtext">Highest performing month</p>
              </div>
            </div>
          </div>

          <div class="chart-card">
            <div class="chart-header">
              <h3>Monthly Sales Chart</h3>
              <div class="chart-controls">
                <button id="btnBar" class="btn-chart active">Bar Chart</button>
                <button id="btnLine" class="btn-chart">Line Chart</button>
                <button id="btnRefresh" class="btn-refresh">Refresh</button>
              </div>
            </div>
            <canvas id="salesChart"></canvas>
          </div>

          <div class="table-card">
            <h3>Recent Sales Summary</h3>
            <div class="table-controls">
              <label for="monthSelector">Select Month:</label>
              <select id="monthSelector">
                <option value="">All Months</option>
              </select>
            </div>
            <table id="salesTable">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Sales ($)</th>
                  <th>Growth</th>
                  <th>Performance</th>
                </tr>
              </thead>
              <tbody>
                <!-- Table rows will be populated by JS -->
              </tbody>
            </table>
          </div>
        </section>

        <!-- Sales Section -->
        <section class="section" data-section="sales" style="display: none;">
          <div class="section-header">
            <h2>Sales Management</h2>
            <p>Manage and track sales transactions.</p>
          </div>
          <div class="table-card">
            <h3>Sales Data</h3>
            <table id="salesDataTable">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Sales ($)</th>
                </tr>
              </thead>
              <tbody>
                <!-- Table rows will be populated by JS -->
              </tbody>
            </table>
          </div>
        </section>

        <!-- Analytics Section -->
        <section class="section" data-section="analytics" style="display: none;">
          <div class="section-header">
            <h2>Advanced Analytics</h2>
            <p>Detailed analysis and insights from sales data.</p>
          </div>
          <div class="chart-card">
            <h3>Sales Analytics Chart</h3>
            <canvas id="analyticsChart"></canvas>
          </div>
        </section>

        <!-- Reports Section -->
        <section class="section" data-section="reports" style="display: none;">
          <div class="section-header">
            <h2>Reports</h2>
            <p>Generate and download sales reports.</p>
          </div>
          <div class="card">
            <h3>Sales Summary</h3>
            <div id="reportSummary"></div>
          </div>
        </section>

        <!-- Settings Section -->
        <section class="section" data-section="settings" style="display: none;">
          <div class="section-header">
            <h2>Settings</h2>
            <p>Configure dashboard preferences and options.</p>
          </div>
          <div class="card">
            <h3>Dashboard Settings</h3>
            <div class="setting-item">
              <label for="darkModeCheckbox" class="setting-label">Dark Mode</label>
              <input type="checkbox" id="darkModeCheckbox" class="setting-checkbox">
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>

  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <script src="script.js"></script>
</body>
</html>
