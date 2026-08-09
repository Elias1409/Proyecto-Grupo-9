<?php

header("Content-Type: application/json");

require_once "conexion.php";

$datos = json_decode(
    file_get_contents("php://input"),
    true
);

$nombre = trim($datos["nombre"] ?? "");
$correo = trim($datos["correo"] ?? "");
$clave = $datos["clave"] ?? "";


if ($nombre === "" || $correo === "" || $clave === "") {

    echo json_encode([
        "ok" => false,
        "mensaje" => "Debe completar todos los campos."
    ]);

    exit;
}


// Verificar si ya existe el correo
$consulta = $conexion->prepare(
    "SELECT id FROM usuarios WHERE correo = ?"
);

$consulta->execute([$correo]);

if ($consulta->fetch()) {

    echo json_encode([
        "ok" => false,
        "mensaje" => "Ya existe una cuenta con ese correo."
    ]);

    exit;
}


// Proteger contraseña
$claveSegura = password_hash(
    $clave,
    PASSWORD_DEFAULT
);


// Crear usuario
$insertar = $conexion->prepare(
    "INSERT INTO usuarios (nombre, correo, clave)
     VALUES (?, ?, ?)"
);

$insertar->execute([
    $nombre,
    $correo,
    $claveSegura
]);


echo json_encode([
    "ok" => true,
    "mensaje" => "Cuenta creada correctamente."
]);

?>