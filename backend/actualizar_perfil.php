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


// =====================================================
// OBTENER DATOS
// =====================================================

$id = intval(
    $datos["id"] ?? 0
);

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

$telefono = trim(
    $datos["telefono"] ?? ""
);

$pais = trim(
    $datos["pais"] ?? "CR"
);

$zonaHoraria = trim(
    $datos["zonaHoraria"] ?? ""
);

$moneda = trim(
    $datos["moneda"] ?? ""
);

$fechaNacimiento =
    !empty($datos["fechaNacimiento"])
        ? $datos["fechaNacimiento"]
        : null;


// =====================================================
// VALIDAR ID
// =====================================================

if ($id <= 0) {

    echo json_encode([
        "ok" => false,
        "mensaje" => "Usuario inválido."
    ]);

    exit;
}


// =====================================================
// VALIDAR CAMPOS OBLIGATORIOS
// =====================================================

if (
    $nombre === "" ||
    $usuario === "" ||
    $correo === ""
) {

    echo json_encode([
        "ok" => false,
        "mensaje" =>
            "Nombre, usuario y correo son obligatorios."
    ]);

    exit;
}


// =====================================================
// VALIDAR NOMBRE DE USUARIO
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
// VALIDAR FECHA DE NACIMIENTO
// =====================================================

if ($fechaNacimiento !== null) {

    $fechaValida =
        DateTime::createFromFormat(
            "Y-m-d",
            $fechaNacimiento
        );

    if (
        !$fechaValida ||
        $fechaValida->format("Y-m-d") !==
        $fechaNacimiento
    ) {

        echo json_encode([
            "ok" => false,
            "mensaje" =>
                "La fecha de nacimiento no es válida."
        ]);

        exit;
    }
}


// =====================================================
// ACTUALIZAR PERFIL
// =====================================================

try {

    // =================================================
    // COMPROBAR USUARIO DUPLICADO
    // =================================================

    $consultaUsuario = $conexion->prepare(
        "SELECT id
         FROM usuarios
         WHERE usuario = ?
         AND id <> ?
         LIMIT 1"
    );

    $consultaUsuario->execute([
        $usuario,
        $id
    ]);


    if ($consultaUsuario->fetch()) {

        echo json_encode([
            "ok" => false,
            "mensaje" =>
                "Ese nombre de usuario ya está en uso."
        ]);

        exit;
    }


    // =================================================
    // COMPROBAR CORREO DUPLICADO
    // =================================================

    $consultaCorreo = $conexion->prepare(
        "SELECT id
         FROM usuarios
         WHERE correo = ?
         AND id <> ?
         LIMIT 1"
    );

    $consultaCorreo->execute([
        $correo,
        $id
    ]);


    if ($consultaCorreo->fetch()) {

        echo json_encode([
            "ok" => false,
            "mensaje" =>
                "Ese correo ya está registrado."
        ]);

        exit;
    }


    // =================================================
    // ACTUALIZAR USUARIO
    // =================================================

    $actualizar = $conexion->prepare(
        "UPDATE usuarios
         SET
            nombre = ?,
            apellidos = ?,
            usuario = ?,
            correo = ?,
            telefono = ?,
            pais = ?,
            zona_horaria = ?,
            moneda = ?,
            fecha_nacimiento = ?
         WHERE id = ?"
    );


    $actualizar->execute([
        $nombre,
        $apellidos,
        $usuario,
        $correo,
        $telefono !== "" ? $telefono : null,
        $pais,
        $zonaHoraria,
        $moneda,
        $fechaNacimiento,
        $id
    ]);


    // =================================================
    // DEVOLVER USUARIO ACTUALIZADO
    // =================================================

    $consulta = $conexion->prepare(
        "SELECT
            id,
            nombre,
            apellidos,
            usuario,
            correo,
            telefono,
            pais,
            zona_horaria,
            moneda,
            fecha_nacimiento,
            balance,
            ingresos,
            gastos,
            deudas,
            ahorro,
            fecha_registro
         FROM usuarios
         WHERE id = ?
         LIMIT 1"
    );


    $consulta->execute([
        $id
    ]);


    $usuarioActualizado =
        $consulta->fetch(
            PDO::FETCH_ASSOC
        );


    if (!$usuarioActualizado) {

        echo json_encode([
            "ok" => false,
            "mensaje" =>
                "No se pudo recuperar el usuario actualizado."
        ]);

        exit;
    }


    // =================================================
    // ADAPTAR NOMBRES PARA JAVASCRIPT
    // =================================================

    $usuarioActualizado["zonaHoraria"] =
        $usuarioActualizado["zona_horaria"] ?? "";

    $usuarioActualizado["fechaNacimiento"] =
        $usuarioActualizado["fecha_nacimiento"] ?? "";

    $usuarioActualizado["fechaRegistro"] =
        $usuarioActualizado["fecha_registro"] ?? "";


    unset(
        $usuarioActualizado["zona_horaria"],
        $usuarioActualizado["fecha_nacimiento"],
        $usuarioActualizado["fecha_registro"]
    );


    // =================================================
    // RESPUESTA CORRECTA
    // =================================================

    echo json_encode([
        "ok" => true,
        "mensaje" =>
            "Perfil actualizado correctamente.",
        "usuario" =>
            $usuarioActualizado
    ]);


} catch (PDOException $error) {

    echo json_encode([
        "ok" => false,
        "mensaje" =>
            "No se pudo actualizar el perfil."
    ]);

}

?>