<?php

$host = "localhost";
$usuario = "root";
$contrasena = "";
$baseDatos = "fintrack";

try {

    $conexion = new PDO(
        "mysql:host=$host;dbname=$baseDatos;charset=utf8mb4",
        $usuario,
        $contrasena
    );

    $conexion->setAttribute(
        PDO::ATTR_ERRMODE,
        PDO::ERRMODE_EXCEPTION
    );

} catch (PDOException $error) {

    die("Error de conexión: " . $error->getMessage());

}
?>