USE fintrack;


-- =====================================================
-- 1. AMPLIAR USUARIOS
-- =====================================================

ALTER TABLE usuarios
    ADD COLUMN IF NOT EXISTS apellidos VARCHAR(150) NULL AFTER nombre;

ALTER TABLE usuarios
    ADD COLUMN IF NOT EXISTS usuario VARCHAR(50) NULL AFTER apellidos;

ALTER TABLE usuarios
    ADD COLUMN IF NOT EXISTS telefono VARCHAR(30) NULL AFTER clave;

ALTER TABLE usuarios
    ADD COLUMN IF NOT EXISTS pais VARCHAR(10) DEFAULT 'CR' AFTER telefono;

ALTER TABLE usuarios
    ADD COLUMN IF NOT EXISTS zona_horaria VARCHAR(100)
        DEFAULT '(GMT-06:00) América/Costa_Rica'
        AFTER pais;

ALTER TABLE usuarios
    ADD COLUMN IF NOT EXISTS moneda VARCHAR(100)
        DEFAULT 'Colón Costarricense (₡)'
        AFTER zona_horaria;

ALTER TABLE usuarios
    ADD COLUMN IF NOT EXISTS fecha_nacimiento DATE NULL
        AFTER moneda;


-- Usuario temporal para cuentas antiguas que no tengan username
UPDATE usuarios
SET usuario = CONCAT('usuario', id)
WHERE usuario IS NULL
   OR usuario = '';


-- Ahora sí debe ser único
ALTER TABLE usuarios
    MODIFY usuario VARCHAR(50) NOT NULL;

CREATE UNIQUE INDEX idx_usuario_unico
ON usuarios(usuario);


-- =====================================================
-- 2. CATEGORÍAS
-- =====================================================

CREATE TABLE IF NOT EXISTS categorias (

    id INT AUTO_INCREMENT PRIMARY KEY,

    nombre VARCHAR(80) NOT NULL UNIQUE

);


INSERT IGNORE INTO categorias(nombre)
VALUES
('Ingreso'),
('Alimentación'),
('Vivienda'),
('Servicios'),
('Transporte'),
('Entretenimiento'),
('Compras'),
('Deudas'),
('Transferencias'),
('Ahorro'),
('Otros');


-- =====================================================
-- 3. MEDIOS DE PAGO
-- =====================================================

CREATE TABLE IF NOT EXISTS medios_pago (

    id INT AUTO_INCREMENT PRIMARY KEY,

    usuario_id INT NOT NULL,

    tipo ENUM(
        'cuenta',
        'debito',
        'credito'
    ) NOT NULL,

    banco VARCHAR(100) NOT NULL,

    nombre VARCHAR(100) NOT NULL,

    ultimos4 CHAR(4) NOT NULL,

    titular VARCHAR(150) NULL,

    vencimiento VARCHAR(5) NULL,

    principal BOOLEAN DEFAULT FALSE,

    fecha_registro TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_medio_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE

);


-- =====================================================
-- 4. AMPLIAR TRANSACCIONES
-- =====================================================

ALTER TABLE transacciones
    MODIFY tipo ENUM(
        'ingreso',
        'gasto',
        'transferencia_enviada',
        'transferencia_recibida',
        'aporte_meta',
        'retiro_meta',
        'pago_deuda'
    ) NOT NULL;


ALTER TABLE transacciones
    ADD COLUMN IF NOT EXISTS categoria_id INT NULL
        AFTER tipo;

ALTER TABLE transacciones
    ADD COLUMN IF NOT EXISTS medio_pago_id INT NULL
        AFTER categoria_id;

ALTER TABLE transacciones
    ADD COLUMN IF NOT EXISTS comercio_persona VARCHAR(150) NULL
        AFTER descripcion;

ALTER TABLE transacciones
    ADD COLUMN IF NOT EXISTS estado VARCHAR(30)
        DEFAULT 'procesado'
        AFTER monto;

ALTER TABLE transacciones
    ADD COLUMN IF NOT EXISTS referencia VARCHAR(100) NULL
        AFTER estado;


-- =====================================================
-- 5. TRANSFERENCIAS ENTRE USUARIOS
-- =====================================================

CREATE TABLE IF NOT EXISTS transferencias (

    id INT AUTO_INCREMENT PRIMARY KEY,

    emisor_id INT NOT NULL,

    receptor_id INT NOT NULL,

    monto DECIMAL(14,2) NOT NULL,

    concepto VARCHAR(200) NULL,

    referencia VARCHAR(100) NOT NULL UNIQUE,

    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_transferencia_emisor
        FOREIGN KEY (emisor_id)
        REFERENCES usuarios(id),

    CONSTRAINT fk_transferencia_receptor
        FOREIGN KEY (receptor_id)
        REFERENCES usuarios(id)

);


-- =====================================================
-- 6. AMPLIAR DEUDAS
-- =====================================================

ALTER TABLE deudas
    ADD COLUMN IF NOT EXISTS nombre VARCHAR(150) NULL
        AFTER usuario_id;

ALTER TABLE deudas
    ADD COLUMN IF NOT EXISTS cuota DECIMAL(14,2)
        DEFAULT 0.00
        AFTER monto_pagado;

ALTER TABLE deudas
    ADD COLUMN IF NOT EXISTS proximo_pago DATE NULL
        AFTER cuota;

ALTER TABLE deudas
    ADD COLUMN IF NOT EXISTS estado ENUM(
        'activa',
        'pagada'
    ) DEFAULT 'activa'
        AFTER proximo_pago;

ALTER TABLE deudas
    ADD COLUMN IF NOT EXISTS fecha_creacion TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP;


-- Mantener compatibilidad con deudas antiguas
UPDATE deudas
SET nombre = descripcion
WHERE nombre IS NULL
   OR nombre = '';


-- =====================================================
-- 7. PAGOS DE DEUDAS
-- =====================================================

CREATE TABLE IF NOT EXISTS pagos_deuda (

    id INT AUTO_INCREMENT PRIMARY KEY,

    deuda_id INT NOT NULL,

    usuario_id INT NOT NULL,

    monto DECIMAL(14,2) NOT NULL,

    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_pago_deuda
        FOREIGN KEY (deuda_id)
        REFERENCES deudas(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_pago_deuda_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE

);


-- =====================================================
-- 8. AMPLIAR METAS
-- =====================================================

ALTER TABLE metas
    ADD COLUMN IF NOT EXISTS descripcion VARCHAR(200) NULL
        AFTER nombre;

ALTER TABLE metas
    ADD COLUMN IF NOT EXISTS estado ENUM(
        'activa',
        'completada'
    ) DEFAULT 'activa'
        AFTER fecha_limite;

ALTER TABLE metas
    ADD COLUMN IF NOT EXISTS fecha_creacion TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP;


-- =====================================================
-- 9. MOVIMIENTOS DE METAS
-- =====================================================

CREATE TABLE IF NOT EXISTS movimientos_meta (

    id INT AUTO_INCREMENT PRIMARY KEY,

    meta_id INT NOT NULL,

    usuario_id INT NOT NULL,

    tipo ENUM(
        'aporte',
        'retiro',
        'reintegro'
    ) NOT NULL,

    monto DECIMAL(14,2) NOT NULL,

    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_movimiento_meta
        FOREIGN KEY (meta_id)
        REFERENCES metas(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_movimiento_meta_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE

);


-- =====================================================
-- 10. PAGOS DE SERVICIOS
-- =====================================================

CREATE TABLE IF NOT EXISTS pagos_servicios (

    id INT AUTO_INCREMENT PRIMARY KEY,

    usuario_id INT NOT NULL,

    proveedor VARCHAR(100) NOT NULL,

    numero_referencia VARCHAR(100) NULL,

    monto DECIMAL(14,2) NOT NULL,

    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_servicio_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE

);