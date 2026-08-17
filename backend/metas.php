<?php

header("Content-Type: application/json; charset=UTF-8");

require_once "conexion.php";


$usuarioId =
    intval(
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

    $consultaUsuario =
        $conexion->prepare(
            "SELECT
                id,
                balance,
                ahorro
             FROM usuarios
             WHERE id = ?"
        );


    $consultaUsuario->execute([
        $usuarioId
    ]);


    $usuario =
        $consultaUsuario->fetch(
            PDO::FETCH_ASSOC
        );


    $consultaMetas =
        $conexion->prepare(
            "SELECT
                id,
                nombre,
                descripcion,
                monto_objetivo,
                monto_actual,
                fecha_limite,
                estado,
                fecha_creacion
             FROM metas
             WHERE usuario_id = ?
             AND estado = 'activa'
             ORDER BY fecha_creacion DESC"
        );


    $consultaMetas->execute([
        $usuarioId
    ]);


    $metas =
        $consultaMetas->fetchAll(
            PDO::FETCH_ASSOC
        );


    echo json_encode([
        "ok" => true,
        "usuario" => $usuario,
        "metas" => $metas
    ]);


} catch (PDOException $error) {

    echo json_encode([
        "ok" => false,
        "mensaje" =>
            "No se pudieron cargar las metas."
    ]);

}

?>