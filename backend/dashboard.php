<?php

header("Content-Type: application/json; charset=UTF-8");

require_once "conexion.php";


// =====================================================
// RECIBIR ID DEL USUARIO
// =====================================================

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
    // USUARIO
    // =====================================================

    $consultaUsuario = $conexion->prepare(
        "SELECT
            id,
            nombre,
            apellidos,
            usuario,
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
                "El usuario no existe."
        ]);

        exit;
    }


    // =====================================================
    // ACTIVIDAD RECIENTE
    // =====================================================

    $consultaMovimientos = $conexion->prepare(
        "SELECT
            id,
            descripcion,
            comercio_persona,
            tipo,
            monto,
            estado,
            fecha
         FROM transacciones
         WHERE usuario_id = ?
         ORDER BY fecha DESC, id DESC
         LIMIT 5"
    );

    $consultaMovimientos->execute([
        $usuarioId
    ]);

    $movimientos =
        $consultaMovimientos->fetchAll(
            PDO::FETCH_ASSOC
        );


    // =====================================================
    // PRÓXIMOS PAGOS
    // =====================================================

    $consultaPagos = $conexion->prepare(
        "SELECT
            id,
            nombre,
            cuota,
            proximo_pago
         FROM deudas
         WHERE usuario_id = ?
         AND estado = 'activa'
         AND proximo_pago IS NOT NULL
         ORDER BY proximo_pago ASC
         LIMIT 5"
    );

    $consultaPagos->execute([
        $usuarioId
    ]);

    $proximosPagos =
        $consultaPagos->fetchAll(
            PDO::FETCH_ASSOC
        );


    // =====================================================
    // METAS DE AHORRO
    // =====================================================

    $consultaMetas = $conexion->prepare(
        "SELECT
            id,
            nombre,
            monto_objetivo,
            monto_actual,
            fecha_limite,
            estado
         FROM metas
         WHERE usuario_id = ?
         AND estado = 'activa'
         ORDER BY fecha_creacion DESC
         LIMIT 5"
    );

    $consultaMetas->execute([
        $usuarioId
    ]);

    $metas =
        $consultaMetas->fetchAll(
            PDO::FETCH_ASSOC
        );


    // =====================================================
    // INGRESOS POR CATEGORÍA
    // =====================================================

    $consultaIngresos = $conexion->prepare(
        "SELECT
            COALESCE(c.nombre, 'Otros ingresos') AS categoria,
            SUM(t.monto) AS total
         FROM transacciones t
         LEFT JOIN categorias c
            ON c.id = t.categoria_id
         WHERE t.usuario_id = ?
         AND t.tipo IN (
            'ingreso',
            'transferencia_recibida'
         )
         GROUP BY c.id, c.nombre
         ORDER BY total DESC"
    );

    $consultaIngresos->execute([
        $usuarioId
    ]);

    $desgloseIngresos =
        $consultaIngresos->fetchAll(
            PDO::FETCH_ASSOC
        );


    // =====================================================
    // GASTOS POR CATEGORÍA
    // =====================================================

    $consultaGastos = $conexion->prepare(
        "SELECT
            COALESCE(c.nombre, 'Otros') AS categoria,
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
         GROUP BY c.id, c.nombre
         ORDER BY total DESC"
    );

    $consultaGastos->execute([
        $usuarioId
    ]);

    $desgloseGastos =
        $consultaGastos->fetchAll(
            PDO::FETCH_ASSOC
        );


    // =====================================================
    // RESPUESTA
    // =====================================================

    echo json_encode([
        "ok" => true,

        "usuario" => $usuario,

        "movimientos" =>
            $movimientos,

        "proximosPagos" =>
            $proximosPagos,

        "metas" =>
            $metas,

        "desgloseIngresos" =>
            $desgloseIngresos,

        "desgloseGastos" =>
            $desgloseGastos
    ]);


} catch (PDOException $error) {

    echo json_encode([
        "ok" => false,
        "mensaje" =>
            "No se pudo cargar el Dashboard."
    ]);

}

?>