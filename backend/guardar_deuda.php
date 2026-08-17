<?php

header("Content-Type: application/json; charset=UTF-8");

require_once "conexion.php";


$datos = json_decode(
    file_get_contents("php://input"),
    true
);


$usuarioId =
    intval($datos["usuario_id"] ?? 0);

$nombre =
    trim($datos["nombre"] ?? "");

$descripcion =
    trim($datos["descripcion"] ?? "");

$montoTotal =
    floatval($datos["monto_total"] ?? 0);

$cuota =
    floatval($datos["cuota"] ?? 0);

$proximoPago =
    trim($datos["proximo_pago"] ?? "");


if (
    $usuarioId <= 0 ||
    $nombre === "" ||
    $descripcion === "" ||
    $montoTotal <= 0
) {

    echo json_encode([
        "ok" => false,
        "mensaje" =>
            "Complete los datos de la deuda."
    ]);

    exit;
}


try {

    $conexion->beginTransaction();


    $insertar =
        $conexion->prepare(
            "INSERT INTO deudas
            (
                usuario_id,
                nombre,
                descripcion,
                monto_total,
                monto_pagado,
                cuota,
                proximo_pago,
                estado,
                fecha
            )
            VALUES
            (
                ?,
                ?,
                ?,
                ?,
                0,
                ?,
                ?,
                'activa',
                CURDATE()
            )"
        );


    $insertar->execute([
        $usuarioId,
        $nombre,
        $descripcion,
        $montoTotal,
        $cuota,
        $proximoPago !== ""
            ? $proximoPago
            : null
    ]);


    $actualizar =
        $conexion->prepare(
            "UPDATE usuarios
             SET deudas = deudas + ?
             WHERE id = ?"
        );


    $actualizar->execute([
        $montoTotal,
        $usuarioId
    ]);


    $conexion->commit();


    echo json_encode([
        "ok" => true,
        "mensaje" =>
            "Deuda creada correctamente."
    ]);


} catch (PDOException $error) {

    if ($conexion->inTransaction()) {
        $conexion->rollBack();
    }


    echo json_encode([
        "ok" => false,
        "mensaje" =>
            "No se pudo crear la deuda."
    ]);

}

?>