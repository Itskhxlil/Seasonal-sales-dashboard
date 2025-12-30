<?php
$filename = __DIR__ . "/data/sales.csv";
$data = [];

if (($handle = fopen($filename, "r")) !== false) {
    $header = fgetcsv($handle); // skip header

    while (($row = fgetcsv($handle)) !== false) {
        $date = $row[10];   // Date column
        $total = (float)$row[9]; // Total column

        $month = date("F", strtotime($date));

        if (!isset($data[$month])) {
            $data[$month] = 0;
        }
        $data[$month] += $total;
    }
    fclose($handle);
}

$result = [];
foreach ($data as $month => $sales) {
    $result[] = [
        "month" => $month,
        "sales" => round($sales, 2)
    ];
}

header("Content-Type: application/json");
echo json_encode($result);
