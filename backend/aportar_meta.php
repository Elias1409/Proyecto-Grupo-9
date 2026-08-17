<?php

header("Content-Type: application/json; charset=UTF-8");

require_once "conexion.php";


$datos = json_decode(
    file_get_contents("php://input"),
    true
);


$usuarioId =
    intval($datos["usuario_id"] ?? 0);

$metaId =
    intval($datos["meta_id"] ?? 0);

$monto =
    floatval($datos["monto"] ?? 0);


if (
    $usuarioId <= 0 ||
    $metaId <= 0 ||
    $monto <= 0
) {

    echo json_encode([
        "ok" => false,
        "mensaje" =>
            "Datos inválidos."
    ]);

    exit;
}


try {

    $conexion->beginTransaction();


    $consultaUsuario =
        $conexion->prepare(
            "SELECT
                balance
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

        throw new Exception(
            "Usuario no encontrado."
        );

    }


    if (
        floatval(
            $usuario["balance"]
        ) < $monto
    ) {

        $conexion->rollBack();

        echo json_encode([
            "ok" => false,
            "mensaje" =>
                "No tienes saldo suficiente."
        ]);

        exit;
    }


    $consultaMeta =
        $conexion->prepare(
            "SELECT
                id,
                monto_objetivo,
                monto_actual
             FROM metas
             WHERE id = ?
             AND usuario_id = ?
             AND estado = 'activa'
             FOR UPDATE"
        );


    $consultaMeta->execute([
        $metaId,
        $usuarioId
    ]);


    $meta =
        $consultaMeta->fetch(
            PDO::FETCH_ASSOC
        );


    if (!$meta) {

        $conexion->rollBack();

        echo json_encode([
            "ok" => false,
            "mensaje" =>
                "La meta no existe."
        ]);

        exit;
    }


    $faltante =
        floatval(
            $meta["monto_objetivo"]
        ) -
        floatval(
            $meta["monto_actual"]
        );


    if ($monto > $faltante) {

        $conexion->rollBack();

        echo json_encode([
            "ok" => false,
            "mensaje" =>
                "El aporte supera el monto restante de la meta."
        ]);

        exit;
    }


    $actualizarMeta =
        $conexion->prepare(
            "UPDATE metas
             SET
                monto_actual =
                    monto_actual + ?
             WHERE id = ?"
        );


    $actualizarMeta->execute([
        $monto,
        $metaId
    ]);


    $actualizarUsuario =
        $conexion->prepare(
            "UPDATE usuarios
             SET
                balance =
                    balance - ?,
                ahorro =
                    ahorro + ?
             WHERE id = ?"
        );


    $actualizarUsuario->execute([
        $monto,
        $monto,
        $usuarioId
    ]);


    $movimiento =
        $conexion->prepare(
            "INSERT INTO movimientos_meta
            (
                usuario_id,
                meta_id,
                tipo,
                monto,
                fecha
            )
            VALUES
            (
                ?,
                ?,
                'aporte',
                ?,
                CURDATE()
            )"
        );


    $movimiento->execute([
        $usuarioId,
        $metaId,
        $monto
    ]);


    $conexion->commit();


    echo json_encode([
        "ok" => true,
        "mensaje" =>
            "Aporte realizado correctamente."
    ]);


} catch (Throwable $error) {

    if (
        $conexion->inTransaction()
    ) {
        $conexion->rollBack();
    }


    echo json_encode([
        "ok" => false,
        "mensaje" =>
            "No se pudo realizar el aporte."
    ]);

}

?>