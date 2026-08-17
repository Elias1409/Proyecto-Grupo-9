<?php

header("Content-Type: application/json; charset=UTF-8");

require_once "conexion.php";


// =====================================================
// RECIBIR USUARIO
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
    // COMPROBAR USUARIO
    // =====================================================

    $consultaUsuario = $conexion->prepare(
        "SELECT
            id,
            nombre,
            apellidos,
            usuario,
            balance,
            ingresos,
            gastos
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
            "mensaje" => "El usuario no existe."
        ]);

        exit;
    }


    // =====================================================
    // OBTENER TRANSACCIONES
    // =====================================================

    $consulta = $conexion->prepare(
        "SELECT
            t.id,
            t.descripcion,
            t.comercio_persona,
            t.tipo,
            t.monto,
            t.estado,
            t.fecha,
            t.referencia,

            c.nombre AS categoria,

            m.tipo AS medio_tipo,
            m.banco AS medio_banco,
            m.nombre AS medio_nombre,
            m.ultimos4 AS medio_ultimos4

         FROM transacciones t

         LEFT JOIN categorias c
            ON c.id = t.categoria_id

         LEFT JOIN medios_pago m
            ON m.id = t.medio_pago_id

         WHERE t.usuario_id = ?

         ORDER BY
            t.fecha DESC,
            t.id DESC"
    );


    $consulta->execute([
        $usuarioId
    ]);


    $transacciones =
        $consulta->fetchAll(
            PDO::FETCH_ASSOC
        );


    // =====================================================
    // RESPUESTA
    // =====================================================

    echo json_encode([
        "ok" => true,

        "usuario" => $usuario,

        "transacciones" =>
            $transacciones
    ]);


} catch (PDOException $error) {

    echo json_encode([
        "ok" => false,
        "mensaje" =>
            "No se pudieron cargar las transacciones."
    ]);

}

?>