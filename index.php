<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Seasonal Sales Dashboard</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>

  <div class="container">

    <h1>📊 Seasonal Sales Dashboard</h1>

    <!-- Buttons -->
    <div class="buttons">
      <button id="btnBar">Bar Chart</button>
      <button id="btnLine">Line Chart</button>
      <button id="btnRefresh">Refresh Data</button>
    </div>

    <!-- KPIs -->
    <div class="kpi-container">
      <div class="kpi">
        <h3>Total Sales</h3>
        <p id="totalSales">-</p>
      </div>
      <div class="kpi">
        <h3>Average Sales</h3>
        <p id="avgSales">-</p>
      </div>
      <div class="kpi">
        <h3>Best Month</h3>
        <p id="bestMonth">-</p>
      </div>
    </div>

    <!-- Chart -->
    <canvas id="salesChart"></canvas>

  </div>

  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <script src="script.js"></script>
</body>
</html>
