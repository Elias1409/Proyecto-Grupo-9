<?php

header("Content-Type: application/json; charset=UTF-8");

require_once "conexion.php";


$datos = json_decode(
    file_get_contents("php://input"),
    true
);


$correo = strtolower(
    trim($datos["correo"] ?? "")
);

$clave = $datos["clave"] ?? "";


if ($correo === "" || $clave === "") {

    echo json_encode([
        "ok" => false,
        "tipo" => "campos",
        "mensaje" => "Debe ingresar correo y contraseña."
    ]);

    exit;
}


// Buscar usuario por correo
$consulta = $conexion->prepare(
    "SELECT
        id,
        nombre,
        correo,
        clave,
        balance,
        ingresos,
        gastos,
        deudas,
        ahorro
     FROM usuarios
     WHERE correo = ?"
);


$consulta->execute([$correo]);

$usuario = $consulta->fetch();


// La cuenta no existe
if (!$usuario) {

    echo json_encode([
        "ok" => false,
        "tipo" => "cuenta",
        "mensaje" => "La cuenta no existe."
    ]);

    exit;
}


// Contraseña incorrecta
if (!password_verify($clave, $usuario["clave"])) {

    echo json_encode([
        "ok" => false,
        "tipo" => "clave",
        "mensaje" => "Contraseña incorrecta."
    ]);

    exit;
}


// No devolver el hash de contraseña
unset($usuario["clave"]);


echo json_encode([
    "ok" => true,
    "mensaje" => "Inicio de sesión correcto.",
    "usuario" => $usuario
]);

?>