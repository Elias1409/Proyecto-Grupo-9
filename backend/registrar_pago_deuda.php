<?php

header("Content-Type: application/json; charset=UTF-8");

require_once "conexion.php";

$datos = json_decode(
    file_get_contents("php://input"),
    true
);

$usuarioId =
    intval($datos["usuario_id"] ?? 0);

$deudaId =
    intval($datos["deuda_id"] ?? 0);

$monto =
    floatval($datos["monto"] ?? 0);


if (
    $usuarioId <= 0 ||
    $deudaId <= 0 ||
    $monto <= 0
) {

    echo json_encode([
        "ok" => false,
        "mensaje" => "Datos inválidos."
    ]);

    exit;
}


try {

    $conexion->beginTransaction();


    // =====================================================
    // USUARIO
    // =====================================================

    $consultaUsuario =
        $conexion->prepare(
            "SELECT
                id,
                balance,
                gastos,
                deudas
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
            "mensaje" => "Usuario no encontrado."
        ]);

        exit;
    }


    // =====================================================
    // DEUDA
    // =====================================================

    $consultaDeuda =
        $conexion->prepare(
            "SELECT
                id,
                usuario_id,
                nombre,
                monto_total,
                monto_pagado,
                estado
             FROM deudas
             WHERE id = ?
             AND usuario_id = ?
             FOR UPDATE"
        );


    $consultaDeuda->execute([
        $deudaId,
        $usuarioId
    ]);


    $deuda =
        $consultaDeuda->fetch(
            PDO::FETCH_ASSOC
        );


    if (!$deuda) {

        $conexion->rollBack();

        echo json_encode([
            "ok" => false,
            "mensaje" => "La deuda no existe."
        ]);

        exit;
    }


    if ($deuda["estado"] !== "activa") {

        $conexion->rollBack();

        echo json_encode([
            "ok" => false,
            "mensaje" => "La deuda ya está pagada."
        ]);

        exit;
    }


    // =====================================================
    // SALDO PENDIENTE
    // =====================================================

    $saldoPendiente =
        floatval($deuda["monto_total"]) -
        floatval($deuda["monto_pagado"]);


    if ($monto > $saldoPendiente) {

        $conexion->rollBack();

        echo json_encode([
            "ok" => false,
            "mensaje" =>
                "El monto supera el saldo pendiente."
        ]);

        exit;
    }


    if (
        floatval($usuario["balance"]) <
        $monto
    ) {

        $conexion->rollBack();

        echo json_encode([
            "ok" => false,
            "mensaje" =>
                "No tienes saldo suficiente."
        ]);

        exit;
    }


    // =====================================================
    // REGISTRAR PAGO
    // =====================================================

    $insertarPago =
        $conexion->prepare(
            "INSERT INTO pagos_deuda
            (
                usuario_id,
                deuda_id,
                monto,
                fecha
            )
            VALUES
            (
                ?,
                ?,
                ?,
                CURDATE()
            )"
        );


    $insertarPago->execute([
        $usuarioId,
        $deudaId,
        $monto
    ]);


    // =====================================================
    // ACTUALIZAR DEUDA
    // =====================================================

    $nuevoMontoPagado =
        floatval($deuda["monto_pagado"]) +
        $monto;


    $nuevoSaldo =
        floatval($deuda["monto_total"]) -
        $nuevoMontoPagado;


    $nuevoEstado =
        $nuevoSaldo <= 0
            ? "pagada"
            : "activa";


    $actualizarDeuda =
        $conexion->prepare(
            "UPDATE deudas
             SET
                monto_pagado = ?,
                estado = ?
             WHERE id = ?"
        );


    $actualizarDeuda->execute([
        $nuevoMontoPagado,
        $nuevoEstado,
        $deudaId
    ]);


    // =====================================================
    // ACTUALIZAR USUARIO
    // =====================================================

    $actualizarUsuario =
        $conexion->prepare(
            "UPDATE usuarios
             SET
                balance = balance - ?,
                gastos = gastos + ?,
                deudas = GREATEST(
                    deudas - ?,
                    0
                )
             WHERE id = ?"
        );


    $actualizarUsuario->execute([
        $monto,
        $monto,
        $monto,
        $usuarioId
    ]);


    // =====================================================
    // REGISTRAR COMO TRANSACCIÓN
    // =====================================================

    $referencia =
        "DEUDA-" .
        $deudaId .
        "-" .
        time();


    $insertarTransaccion =
        $conexion->prepare(
            "INSERT INTO transacciones
            (
                usuario_id,
                descripcion,
                comercio_persona,
                tipo,
                categoria_id,
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
                'pago_deuda',
                8,
                ?,
                'procesado',
                ?,
                CURDATE()
            )"
        );


    $insertarTransaccion->execute([
        $usuarioId,
        "Pago de deuda",
        $deuda["nombre"],
        $monto,
        $referencia
    ]);


    $conexion->commit();


    echo json_encode([
        "ok" => true,
        "mensaje" =>
            "Pago registrado correctamente."
    ]);


} catch (PDOException $error) {

    if ($conexion->inTransaction()) {
        $conexion->rollBack();
    }


    echo json_encode([
        "ok" => false,
        "mensaje" =>
            "No se pudo registrar el pago."
    ]);

}

?>