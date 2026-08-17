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


if (
    $usuarioId <= 0 ||
    $metaId <= 0
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


    $consultaMeta =
        $conexion->prepare(
            "SELECT
                id,
                monto_actual
             FROM metas
             WHERE id = ?
             AND usuario_id = ?
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


    $dineroReintegrar =
        floatval(
            $meta["monto_actual"]
        );


    if ($dineroReintegrar > 0) {

        $actualizarUsuario =
            $conexion->prepare(
                "UPDATE usuarios
                 SET
                    balance =
                        balance + ?,
                    ahorro =
                        GREATEST(
                            ahorro - ?,
                            0
                        )
                 WHERE id = ?"
            );


        $actualizarUsuario->execute([
            $dineroReintegrar,
            $dineroReintegrar,
            $usuarioId
        ]);

    }


    $eliminarMovimientos =
        $conexion->prepare(
            "DELETE FROM movimientos_meta
             WHERE meta_id = ?"
        );


    $eliminarMovimientos->execute([
        $metaId
    ]);


    $eliminarMeta =
        $conexion->prepare(
            "DELETE FROM metas
             WHERE id = ?
             AND usuario_id = ?"
        );


    $eliminarMeta->execute([
        $metaId,
        $usuarioId
    ]);


    $conexion->commit();


    echo json_encode([
        "ok" => true,
        "mensaje" =>
            "Meta eliminada y dinero reintegrado.",
        "reintegrado" =>
            $dineroReintegrar
    ]);


} catch (PDOException $error) {

    if (
        $conexion->inTransaction()
    ) {
        $conexion->rollBack();
    }


    echo json_encode([
        "ok" => false,
        "mensaje" =>
            "No se pudo eliminar la meta."
    ]);

}

?>