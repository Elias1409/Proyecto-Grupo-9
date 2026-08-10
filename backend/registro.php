<?php

header("Content-Type: application/json; charset=UTF-8");

require_once "conexion.php";


$datos = json_decode(
    file_get_contents("php://input"),
    true
);


$nombre = trim($datos["nombre"] ?? "");
$correo = strtolower(
    trim($datos["correo"] ?? "")
);
$clave = $datos["clave"] ?? "";


if (
    $nombre === "" ||
    $correo === "" ||
    $clave === ""
) {

    echo json_encode([
        "ok" => false,
        "mensaje" => "Debe completar todos los campos."
    ]);

    exit;
}


// Validar correo
if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {

    echo json_encode([
        "ok" => false,
        "mensaje" => "El correo electrónico no es válido."
    ]);

    exit;
}


// Validar contraseña
if (strlen($clave) < 8) {

    echo json_encode([
        "ok" => false,
        "mensaje" => "La contraseña debe tener mínimo 8 caracteres."
    ]);

    exit;
}


// Revisar si ya existe
$consulta = $conexion->prepare(
    "SELECT id
     FROM usuarios
     WHERE correo = ?"
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


// Insertar usuario
//
// No enviamos balance, ingresos, gastos,
// deudas ni ahorro.
//
// MySQL les asignará 0.00 automáticamente.
$insertar = $conexion->prepare(
    "INSERT INTO usuarios
    (
        nombre,
        correo,
        clave
    )
    VALUES
    (
        ?,
        ?,
        ?
    )"
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