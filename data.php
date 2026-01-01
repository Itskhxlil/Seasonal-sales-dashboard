<?php
$dataset = isset($_GET['dataset']) ? $_GET['dataset'] : '';

if (empty($dataset) || !preg_match('/^sales\d+$/', $dataset)) {
    // No dataset selected or invalid format, return empty data
    $result = [];
} else {
    $filename = __DIR__ . "/data/{$dataset}.csv";

    if (!file_exists($filename)) {
        // Dataset file not found, return empty data
        $result = [];
    } else {
    $data = [];

    $allMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    foreach ($allMonths as $month) {
        $data[$month] = 0;
    }

    $monthIndex = -1;
    $salesIndex = -1;

    if (($handle = fopen($filename, "r")) !== false) {
        $header = fgetcsv($handle); // read header
        if ($header !== false) {
            foreach ($header as $index => $col) {
                $col = strtolower(trim($col));
                if ($col === 'month') {
                    $monthIndex = $index;
                } elseif ($col === 'sales') {
                    $salesIndex = $index;
                }
            }
        }

        if ($monthIndex !== -1 && $salesIndex !== -1) {
            while (($row = fgetcsv($handle)) !== false) {
                if (isset($row[$monthIndex]) && isset($row[$salesIndex])) {
                    $month = trim($row[$monthIndex]);
                    $sales = (float)$row[$salesIndex];
                    if (isset($data[$month])) {
                        $data[$month] += $sales;
                    }
                }
            }
        }
        fclose($handle);
    }

    $result = array_map(fn($month, $sales) => ["month" => $month, "sales" => round($sales, 2)], array_keys($data), $data);
}

header("Content-Type: application/json");
echo json_encode($result);
