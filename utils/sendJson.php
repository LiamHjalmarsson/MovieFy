<?php

function sendJSON($data, $responseCode = 200)
{
    header("Content-Type: application/json");
    http_response_code($responseCode);
    $json = json_encode($data);
    echo $json;
    exit();
}