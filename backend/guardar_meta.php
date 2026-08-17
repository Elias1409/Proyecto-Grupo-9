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

$montoObjetivo =
    floatval($datos["monto_objetivo"] ?? 0);

$fechaLimite =
    trim($datos["fecha_limite"] ?? "");


if (
    $usuarioId <= 0 ||
    $nombre === "" ||
    $montoObjetivo <= 0
) {

    echo json_encode([
        "ok" => false,
        "mensaje" =>
            "Complete los datos de la meta."
    ]);

    exit;
}


try {

    $insertar =
        $conexion->prepare(
            "INSERT INTO metas
            (
                usuario_id,
                nombre,
                descripcion,
                monto_objetivo,
                monto_actual,
                fecha_limite,
                estado
            )
            VALUES
            (
                ?,
                ?,
                ?,
                ?,
                0,
                ?,
                'activa'
            )"
        );


    $insertar->execute([
        $usuarioId,
        $nombre,
        $descripcion,
        $montoObjetivo,
        $fechaLimite !== ""
            ? $fechaLimite
            : null
    ]);


    echo json_encode([
        "ok" => true,
        "mensaje" =>
            "Meta creada correctamente."
    ]);


} catch (PDOException $error) {

    echo json_encode([
        "ok" => false,
        "mensaje" =>
            "No se pudo crear la meta."
    ]);

}

?>