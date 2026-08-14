<?php

header("Content-Type: application/json; charset=UTF-8");

require_once "conexion.php";


// =====================================================
// RECIBIR DATOS
// =====================================================

$datos = json_decode(
    file_get_contents("php://input"),
    true
);


// Nombre de usuario
$usuarioLogin = strtolower(
    trim($datos["usuario"] ?? "")
);


// Contraseña
$clave = $datos["clave"] ?? "";


// =====================================================
// VALIDAR CAMPOS
// =====================================================

if ($usuarioLogin === "" || $clave === "") {

    echo json_encode([
        "ok" => false,
        "tipo" => "campos",
        "mensaje" => "Debe ingresar usuario y contraseña."
    ]);

    exit;
}


// =====================================================
// BUSCAR USUARIO
// =====================================================

$consulta = $conexion->prepare(
    "SELECT
        id,
        nombre,
        apellidos,
        usuario,
        correo,
        clave,
        balance,
        ingresos,
        gastos,
        deudas,
        ahorro
     FROM usuarios
     WHERE usuario = ?"
);


$consulta->execute([
    $usuarioLogin
]);


$usuario = $consulta->fetch();


// =====================================================
// CUENTA NO EXISTE
// =====================================================

if (!$usuario) {

    echo json_encode([
        "ok" => false,
        "tipo" => "cuenta",
        "mensaje" => "El usuario no existe."
    ]);

    exit;
}


// =====================================================
// CONTRASEÑA INCORRECTA
// =====================================================

if (!password_verify(
    $clave,
    $usuario["clave"]
)) {

    echo json_encode([
        "ok" => false,
        "tipo" => "clave",
        "mensaje" => "Contraseña incorrecta."
    ]);

    exit;
}


// =====================================================
// NO DEVOLVER CONTRASEÑA
// =====================================================

unset($usuario["clave"]);


// =====================================================
// LOGIN CORRECTO
// =====================================================

echo json_encode([
    "ok" => true,
    "mensaje" => "Inicio de sesión correcto.",
    "usuario" => $usuario
]);

?>