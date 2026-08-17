<?php

header("Content-Type: application/json; charset=UTF-8");

require_once "conexion.php";


$usuarioId = intval(
    $_GET["usuario_id"] ?? 0
);


if ($usuarioId <= 0) {

    echo json_encode([
        "ok" => false,
        "mensaje" => "Usuario inválido."
    ]);

    exit;
}


try {

    // =====================================================
    // DEUDAS ACTIVAS
    // =====================================================

    $consulta = $conexion->prepare(
        "SELECT
            id,
            nombre,
            descripcion,
            monto_total,
            monto_pagado,
            cuota,
            proximo_pago,
            estado
         FROM deudas
         WHERE usuario_id = ?
         AND estado = 'activa'
         ORDER BY
            proximo_pago ASC,
            id DESC"
    );


    $consulta->execute([
        $usuarioId
    ]);


    $deudas =
        $consulta->fetchAll(
            PDO::FETCH_ASSOC
        );


    // =====================================================
    // TOTAL PENDIENTE
    // =====================================================

    $totalPendiente = 0;


    foreach ($deudas as $deuda) {

        $pendiente =
            floatval($deuda["monto_total"]) -
            floatval($deuda["monto_pagado"]);


        if ($pendiente < 0) {
            $pendiente = 0;
        }


        $totalPendiente += $pendiente;

    }


    // =====================================================
    // PRÓXIMO PAGO
    // =====================================================

    $proximoPago = null;


    if (count($deudas) > 0) {

        foreach ($deudas as $deuda) {

            if (!empty($deuda["proximo_pago"])) {

                $proximoPago = [
                    "id" => $deuda["id"],
                    "nombre" => $deuda["nombre"],
                    "cuota" => $deuda["cuota"],
                    "fecha" => $deuda["proximo_pago"]
                ];

                break;
            }

        }

    }


    echo json_encode([
        "ok" => true,

        "deudas" =>
            $deudas,

        "totalPendiente" =>
            $totalPendiente,

        "cantidadActivas" =>
            count($deudas),

        "proximoPago" =>
            $proximoPago
    ]);


} catch (PDOException $error) {

    echo json_encode([
        "ok" => false,
        "mensaje" =>
            "No se pudieron cargar las deudas."
    ]);

}

?>