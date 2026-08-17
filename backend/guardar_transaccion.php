<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Content-Type: application/json; charset=UTF-8");

require_once "conexion.php";


// =====================================================
// RECIBIR DATOS
// =====================================================

$datos = json_decode(
    file_get_contents("php://input"),
    true
);


$usuarioId =
    intval($datos["usuario_id"] ?? 0);

$tipo =
    trim($datos["tipo"] ?? "");

$comercio =
    trim($datos["comercio_persona"] ?? "");

$descripcion =
    trim($datos["descripcion"] ?? "");

$categoriaId =
    intval($datos["categoria_id"] ?? 0);

$medioPagoId =
    intval($datos["medio_pago_id"] ?? 0);

$monto =
    floatval($datos["monto"] ?? 0);

$fecha =
    trim($datos["fecha"] ?? "");


// =====================================================
// VALIDACIONES
// =====================================================

if ($usuarioId <= 0) {

    echo json_encode([
        "ok" => false,
        "mensaje" => "Usuario inválido."
    ]);

    exit;
}


if (
    $tipo !== "ingreso" &&
    $tipo !== "gasto"
) {

    echo json_encode([
        "ok" => false,
        "mensaje" =>
            "Tipo de transacción inválido."
    ]);

    exit;
}


if ($descripcion === "") {

    echo json_encode([
        "ok" => false,
        "mensaje" =>
            "Debe ingresar una descripción."
    ]);

    exit;
}


if ($comercio === "") {

    echo json_encode([
        "ok" => false,
        "mensaje" =>
            "Debe ingresar un comercio o persona."
    ]);

    exit;
}


if ($categoriaId <= 0) {

    echo json_encode([
        "ok" => false,
        "mensaje" =>
            "Debe seleccionar una categoría."
    ]);

    exit;
}


if ($monto <= 0) {

    echo json_encode([
        "ok" => false,
        "mensaje" =>
            "El monto debe ser mayor que cero."
    ]);

    exit;
}


if ($fecha === "") {

    echo json_encode([
        "ok" => false,
        "mensaje" =>
            "Debe seleccionar una fecha."
    ]);

    exit;
}


// Medio de pago opcional
if ($medioPagoId <= 0) {
    $medioPagoId = null;
}


// =====================================================
// GUARDAR
// =====================================================

try {

    $conexion->beginTransaction();


    // =================================================
    // OBTENER USUARIO Y BLOQUEAR REGISTRO
    // =================================================

    $consultaUsuario = $conexion->prepare(
        "SELECT
            id,
            balance,
            ingresos,
            gastos
         FROM usuarios
         WHERE id = ?
         FOR UPDATE"
    );


    $consultaUsuario->execute([
        $usuarioId
    ]);


    $usuario =
        $consultaUsuario->fetch(
            PDO::FETCH_ASSOC
        );


    if (!$usuario) {

        $conexion->rollBack();

        echo json_encode([
            "ok" => false,
            "mensaje" =>
                "El usuario no existe."
        ]);

        exit;
    }


    // =================================================
    // COMPROBAR SALDO PARA GASTO
    // =================================================

    if (
        $tipo === "gasto" &&
        floatval($usuario["balance"]) < $monto
    ) {

        $conexion->rollBack();

        echo json_encode([
            "ok" => false,
            "mensaje" =>
                "No tienes saldo suficiente para registrar este gasto."
        ]);

        exit;
    }


    // =================================================
    // GENERAR REFERENCIA
    // =================================================

    $referencia =
        "FT-" .
        strtoupper(
            substr(
                md5(
                    uniqid(
                        (string)$usuarioId,
                        true
                    )
                ),
                0,
                10
            )
        );


    // =================================================
    // INSERTAR TRANSACCIÓN
    // =================================================

    $insertar = $conexion->prepare(
        "INSERT INTO transacciones
        (
            usuario_id,
            descripcion,
            comercio_persona,
            tipo,
            categoria_id,
            medio_pago_id,
            monto,
            estado,
            referencia,
            fecha
        )
        VALUES
        (
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            'procesado',
            ?,
            ?
        )"
    );


    $insertar->execute([
        $usuarioId,
        $descripcion,
        $comercio,
        $tipo,
        $categoriaId,
        $medioPagoId,
        $monto,
        $referencia,
        $fecha
    ]);


    // =================================================
    // ACTUALIZAR FINANZAS DEL USUARIO
    // =================================================

    if ($tipo === "ingreso") {

        $actualizar = $conexion->prepare(
            "UPDATE usuarios
             SET
                balance = balance + ?,
                ingresos = ingresos + ?
             WHERE id = ?"
        );


        $actualizar->execute([
            $monto,
            $monto,
            $usuarioId
        ]);

    } else {

        $actualizar = $conexion->prepare(
            "UPDATE usuarios
             SET
                balance = balance - ?,
                gastos = gastos + ?
             WHERE id = ?"
        );


        $actualizar->execute([
            $monto,
            $monto,
            $usuarioId
        ]);

    }


    // =================================================
    // OBTENER NUEVOS TOTALES
    // =================================================

    $consultaActualizada =
        $conexion->prepare(
            "SELECT
                id,
                balance,
                ingresos,
                gastos,
                deudas,
                ahorro
             FROM usuarios
             WHERE id = ?"
        );


    $consultaActualizada->execute([
        $usuarioId
    ]);


    $usuarioActualizado =
        $consultaActualizada->fetch(
            PDO::FETCH_ASSOC
        );


    $conexion->commit();


    echo json_encode([
        "ok" => true,
        "mensaje" =>
            "Transacción guardada correctamente.",
        "usuario" =>
            $usuarioActualizado
    ]);


} catch (PDOException $error) {

    if ($conexion->inTransaction()) {
        $conexion->rollBack();
    }


    echo json_encode([
        "ok" => false,
        "mensaje" =>
            "No se pudo guardar la transacción."
    ]);

}

?>