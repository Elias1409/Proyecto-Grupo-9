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
     WHERE correo = ?
     LIMIT 1"
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
// COMPROBAR USUARIO
// =====================================================

$consultaUsuario = $conexion->prepare(
    "SELECT id
     FROM usuarios
     WHERE usuario = ?
     LIMIT 1"
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

try {

    $insertar = $conexion->prepare(
        "INSERT INTO usuarios
        (
            nombre,
            apellidos,
            usuario,
            correo,
            clave,
            telefono,
            pais,
            zona_horaria,
            moneda,
            fecha_nacimiento,
            balance,
            ingresos,
            gastos,
            deudas,
            ahorro
        )
        VALUES
        (
            ?,
            ?,
            ?,
            ?,
            ?,
            NULL,
            'CR',
            '(GMT-06:00) América/Costa_Rica',
            'Colón Costarricense (₡)',
            NULL,
            0,
            0,
            0,
            0,
            0
        )"
    );


    $insertar->execute([
        $nombre,
        $apellidos,
        $usuario,
        $correo,
        $claveSegura
    ]);


    $idUsuario =
        $conexion->lastInsertId();


    // =====================================================
    // DEVOLVER USUARIO CREADO
    // =====================================================

    echo json_encode([
        "ok" => true,
        "mensaje" =>
            "Cuenta creada correctamente.",

        "usuario" => [
            "id" =>
                (int) $idUsuario,

            "nombre" =>
                $nombre,

            "apellidos" =>
                $apellidos,

            "usuario" =>
                $usuario,

            "correo" =>
                $correo,

            "telefono" =>
                "",

            "pais" =>
                "CR",

            "zonaHoraria" =>
                "(GMT-06:00) América/Costa_Rica",

            "moneda" =>
                "Colón Costarricense (₡)",

            "fechaNacimiento" =>
                "",

            "balance" =>
                0,

            "ingresos" =>
                0,

            "gastos" =>
                0,

            "deudas" =>
                0,

            "ahorro" =>
                0
        ]
    ]);

} catch (PDOException $error) {

    echo json_encode([
        "ok" => false,
        "mensaje" =>
            "No se pudo crear la cuenta."
    ]);

}
?>