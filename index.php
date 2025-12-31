<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Seasonal Sales Dashboard</title>
  <meta name="description" content="Interactive dashboard displaying seasonal sales data with charts and KPIs.">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="container">
    <header>
      <h1>📊 Seasonal Sales Dashboard</h1>
      <nav class="buttons" role="navigation" aria-label="Chart controls">
        <button id="btnBar" type="button" aria-label="Switch to bar chart view">Bar Chart</button>
        <button id="btnLine" type="button" aria-label="Switch to line chart view">Line Chart</button>
        <button id="btnRefresh" type="button" aria-label="Refresh sales data">Refresh Data</button>
      </nav>
    </header>

    <main>
      <section class="kpi-container" aria-labelledby="kpi-heading">
        <h2 id="kpi-heading" class="sr-only">Key Performance Indicators</h2>
        <div class="kpi" role="region" aria-labelledby="total-sales-label">
          <h3 id="total-sales-label">Total Sales</h3>
          <p id="totalSales" aria-live="polite">-</p>
        </div>
        <div class="kpi" role="region" aria-labelledby="avg-sales-label">
          <h3 id="avg-sales-label">Average Sales</h3>
          <p id="avgSales" aria-live="polite">-</p>
        </div>
        <div class="kpi" role="region" aria-labelledby="best-month-label">
          <h3 id="best-month-label">Best Month</h3>
          <p id="bestMonth" aria-live="polite">-</p>
        </div>
      </section>

      <section class="chart-section" aria-labelledby="chart-heading">
        <h2 id="chart-heading" class="sr-only">Sales Chart</h2>
        <canvas id="salesChart" role="img" aria-label="Interactive chart displaying monthly sales data"></canvas>
      </section>
    </main>
  </div>

  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <script src="script.js"></script>
</body>
</html>
