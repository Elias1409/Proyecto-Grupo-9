<?php

header("Content-Type: application/json; charset=UTF-8");

require_once "conexion.php";


$datos = json_decode(
    file_get_contents("php://input"),
    true
);


// =====================================================
// OBTENER DATOS
// =====================================================

$nombre = trim(
    $datos["nombre"] ?? ""
);

$apellidos = trim(
    $datos["apellidos"] ?? ""
);

$usuario = strtolower(
    trim($datos["usuario"] ?? "")
);

$correo = strtolower(
    trim($datos["correo"] ?? "")
);

$clave =
    $datos["clave"] ?? "";


// =====================================================
// VALIDAR CAMPOS
// =====================================================

if (
    $nombre === "" ||
    $apellidos === "" ||
    $usuario === "" ||
    $correo === "" ||
    $clave === ""
) {

    echo json_encode([
        "ok" => false,
        "mensaje" =>
            "Debe completar todos los campos."
    ]);

    exit;
}


// =====================================================
// VALIDAR USUARIO
// SOLO LETRAS Y NÚMEROS
// =====================================================

if (!preg_match('/^[a-zA-Z0-9]+$/', $usuario)) {

    echo json_encode([
        "ok" => false,
        "mensaje" =>
            "El nombre de usuario solo puede contener letras y números."
    ]);

    exit;
}


if (strlen($usuario) < 4) {

    echo json_encode([
        "ok" => false,
        "mensaje" =>
            "El nombre de usuario debe tener mínimo 4 caracteres."
    ]);

    exit;
}


// =====================================================
// VALIDAR CORREO
// =====================================================

if (
    !filter_var(
        $correo,
        FILTER_VALIDATE_EMAIL
    )
) {

    echo json_encode([
        "ok" => false,
        "mensaje" =>
            "El correo electrónico no es válido."
    ]);

    exit;
}


// =====================================================
// VALIDAR CONTRASEÑA
// =====================================================

if (strlen($clave) < 8) {

    echo json_encode([
        "ok" => false,
        "mensaje" =>
            "La contraseña debe tener mínimo 8 caracteres."
    ]);

    exit;
}


// =====================================================
// COMPROBAR CORREO
// =====================================================

$consultaCorreo = $conexion->prepare(
    "SELECT id
     FROM usuarios
     WHERE correo = ?"
);

$consultaCorreo->execute([
    $correo
]);


if ($consultaCorreo->fetch()) {

    echo json_encode([
        "ok" => false,
        "mensaje" =>
            "Ya existe una cuenta con ese correo."
    ]);

    exit;
}


// =====================================================
// COMPROBAR NOMBRE DE USUARIO
// =====================================================

$consultaUsuario = $conexion->prepare(
    "SELECT id
     FROM usuarios
     WHERE usuario = ?"
);

$consultaUsuario->execute([
    $usuario
]);


if ($consultaUsuario->fetch()) {

    echo json_encode([
        "ok" => false,
        "mensaje" =>
            "Ese nombre de usuario ya está en uso."
    ]);

    exit;
}


// =====================================================
// CIFRAR CONTRASEÑA
// =====================================================

$claveSegura = password_hash(
    $clave,
    PASSWORD_DEFAULT
);


// =====================================================
// CREAR USUARIO
// =====================================================

$insertar = $conexion->prepare(
    "INSERT INTO usuarios
    (
        nombre,
        apellidos,
        usuario,
        correo,
        clave
    )
    VALUES
    (
        ?,
        ?,
        ?,
        ?,
        ?
    )"
);


$insertar->execute([
    $nombre,
    $apellidos,
    $usuario,
    $correo,
    $claveSegura
]);


echo json_encode([
    "ok" => true,
    "mensaje" =>
        "Cuenta creada correctamente."
]);

?>