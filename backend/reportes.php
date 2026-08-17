<?php

header("Content-Type: application/json; charset=UTF-8");

require_once "conexion.php";


// =====================================================
// USUARIO
// =====================================================

$usuarioId =
    intval(
        $_GET["usuario_id"] ?? 0
    );


if ($usuarioId <= 0) {

    echo json_encode([
        "ok" => false,
        "mensaje" =>
            "Usuario inválido."
    ]);

    exit;
}


try {


    // =====================================================
    // DATOS DEL USUARIO
    // =====================================================

    $consultaUsuario =
        $conexion->prepare(
            "SELECT
                id,
                nombre,
                apellidos,
                correo,
                balance,
                ingresos,
                gastos,
                deudas,
                ahorro
             FROM usuarios
             WHERE id = ?
             LIMIT 1"
        );


    $consultaUsuario->execute([
        $usuarioId
    ]);


    $usuario =
        $consultaUsuario->fetch(
            PDO::FETCH_ASSOC
        );


    if (!$usuario) {

        echo json_encode([
            "ok" => false,
            "mensaje" =>
                "Usuario no encontrado."
        ]);

        exit;
    }



    // =====================================================
    // MES ACTUAL
    // =====================================================

    $anioActual =
        intval(
            date("Y")
        );


    $mesActual =
        intval(
            date("n")
        );



    // =====================================================
    // INGRESOS DEL MES
    // =====================================================

    $consultaIngresos =
        $conexion->prepare(
            "SELECT
                COALESCE(
                    SUM(monto),
                    0
                )
             FROM transacciones
             WHERE usuario_id = ?
             AND tipo IN (
                'ingreso',
                'transferencia_recibida'
             )
             AND YEAR(fecha) = ?
             AND MONTH(fecha) = ?"
        );


    $consultaIngresos->execute([
        $usuarioId,
        $anioActual,
        $mesActual
    ]);


    $ingresosMes =
        floatval(
            $consultaIngresos
                ->fetchColumn()
        );



    // =====================================================
    // GASTOS DEL MES
    // =====================================================

    $consultaGastos =
        $conexion->prepare(
            "SELECT
                COALESCE(
                    SUM(monto),
                    0
                )
             FROM transacciones
             WHERE usuario_id = ?
             AND tipo IN (
                'gasto',
                'transferencia_enviada',
                'pago_deuda'
             )
             AND YEAR(fecha) = ?
             AND MONTH(fecha) = ?"
        );


    $consultaGastos->execute([
        $usuarioId,
        $anioActual,
        $mesActual
    ]);


    $gastosMes =
        floatval(
            $consultaGastos
                ->fetchColumn()
        );



    // =====================================================
    // HISTÓRICO ÚLTIMOS 4 MESES
    // =====================================================

    $historico = [];


    for (
        $i = 3;
        $i >= 0;
        $i--
    ) {


        $fechaMes =
            new DateTime(
                "first day of -" .
                $i .
                " month"
            );


        $anio =
            intval(
                $fechaMes
                    ->format("Y")
            );


        $mes =
            intval(
                $fechaMes
                    ->format("n")
            );


        $consultaHistorico =
            $conexion->prepare(
                "SELECT
                    COALESCE(
                        SUM(monto),
                        0
                    )
                 FROM transacciones
                 WHERE usuario_id = ?
                 AND tipo IN (
                    'gasto',
                    'transferencia_enviada',
                    'pago_deuda'
                 )
                 AND YEAR(fecha) = ?
                 AND MONTH(fecha) = ?"
            );


        $consultaHistorico->execute([
            $usuarioId,
            $anio,
            $mes
        ]);


        $totalHistorico =
            floatval(
                $consultaHistorico
                    ->fetchColumn()
            );


        $historico[] = [

            "mes" =>
                $mes,

            "anio" =>
                $anio,

            "total" =>
                $totalHistorico

        ];


    }



    // =====================================================
    // CATEGORÍAS DE GASTO
    // =====================================================

    $consultaCategorias =
        $conexion->prepare(
            "SELECT

                COALESCE(
                    c.nombre,
                    'Otros'
                ) AS categoria,

                SUM(t.monto) AS total

             FROM transacciones t

             LEFT JOIN categorias c
                ON c.id = t.categoria_id

             WHERE t.usuario_id = ?

             AND t.tipo IN (
                'gasto',
                'transferencia_enviada',
                'pago_deuda'
             )

             AND YEAR(t.fecha) = ?
             AND MONTH(t.fecha) = ?

             GROUP BY
                c.id,
                c.nombre

             ORDER BY
                total DESC"
        );


    $consultaCategorias->execute([
        $usuarioId,
        $anioActual,
        $mesActual
    ]);


    $categorias =
        $consultaCategorias
            ->fetchAll(
                PDO::FETCH_ASSOC
            );



    // =====================================================
    // ÚLTIMOS GASTOS
    // =====================================================

    $consultaUltimos =
        $conexion->prepare(
            "SELECT

                t.id,

                t.descripcion,

                t.comercio_persona,

                t.monto,

                t.fecha,

                t.tipo,

                COALESCE(
                    c.nombre,
                    'Otros'
                ) AS categoria

             FROM transacciones t

             LEFT JOIN categorias c
                ON c.id = t.categoria_id

             WHERE t.usuario_id = ?

             AND t.tipo IN (
                'gasto',
                'transferencia_enviada',
                'pago_deuda'
             )

             ORDER BY
                t.fecha DESC,
                t.id DESC

             LIMIT 5"
        );


    $consultaUltimos->execute([
        $usuarioId
    ]);


    $ultimosGastos =
        $consultaUltimos
            ->fetchAll(
                PDO::FETCH_ASSOC
            );



    // =====================================================
    // DETALLE DE MOVIMIENTOS
    // =====================================================

    $consultaDetalle =
        $conexion->prepare(
            "SELECT

                COALESCE(
                    c.nombre,
                    'Otros'
                ) AS categoria,

                t.comercio_persona,

                t.descripcion,

                t.monto,

                t.fecha

             FROM transacciones t

             LEFT JOIN categorias c
                ON c.id = t.categoria_id

             WHERE t.usuario_id = ?

             AND t.tipo IN (
                'gasto',
                'transferencia_enviada',
                'pago_deuda'
             )

             AND YEAR(t.fecha) = ?
             AND MONTH(t.fecha) = ?

             ORDER BY
                t.fecha DESC,
                t.id DESC"
        );


    $consultaDetalle->execute([
        $usuarioId,
        $anioActual,
        $mesActual
    ]);


    $movimientos =
        $consultaDetalle
            ->fetchAll(
                PDO::FETCH_ASSOC
            );



    // =====================================================
    // RESPUESTA
    // =====================================================

    echo json_encode([

        "ok" =>
            true,

        "usuario" =>
            $usuario,

        "ingresosMes" =>
            $ingresosMes,

        "gastosMes" =>
            $gastosMes,

        "historico" =>
            $historico,

        "categorias" =>
            $categorias,

        "ultimosGastos" =>
            $ultimosGastos,

        "movimientos" =>
            $movimientos,

        "mesActual" =>
            $mesActual,

        "anioActual" =>
            $anioActual

    ]);


}
catch (PDOException $error) {


    echo json_encode([

        "ok" =>
            false,

        "mensaje" =>
            "No se pudieron cargar los reportes."

    ]);


}

?>