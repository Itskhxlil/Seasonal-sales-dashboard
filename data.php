<?php
$filename = __DIR__ . "/data/sales.csv";
$data = [];

if (($handle = fopen($filename, "r")) !== false) {
    fgetcsv($handle); // skip header
    while (($row = fgetcsv($handle)) !== false) {
        $month = date("F", strtotime($row[10]));
        $data[$month] = ($data[$month] ?? 0) + (float)$row[9];
    }
    fclose($handle);
}

$result = array_map(fn($month, $sales) => ["month" => $month, "sales" => round($sales, 2)], array_keys($data), $data);

header("Content-Type: application/json");
echo json_encode($result);
