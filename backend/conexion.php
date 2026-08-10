<?php

$usuario = "fintrack_user";
$contrasena = "FinTrack2026!";
$baseDatos = "fintrack";

try {

    $conexion = new PDO(
        "mysql:unix_socket=/tmp/mysql.sock;dbname=$baseDatos;charset=utf8mb4",
        $usuario,
        $contrasena
    );

    $conexion->setAttribute(
        PDO::ATTR_ERRMODE,
        PDO::ERRMODE_EXCEPTION
    );

    $conexion->setAttribute(
        PDO::ATTR_DEFAULT_FETCH_MODE,
        PDO::FETCH_ASSOC
    );

} catch (PDOException $error) {

    http_response_code(500);

    echo json_encode([
        "ok" => false,
        "mensaje" => "No se pudo conectar con la base de datos."
    ]);

    exit;
}

?>