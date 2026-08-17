USE fintrack;

-- =====================================================
-- DATOS DEMO PARA ELIAS
-- USUARIO ID = 2
-- =====================================================


-- =====================================================
-- 1. ACTUALIZAR RESUMEN FINANCIERO DE ELIAS
-- =====================================================

UPDATE usuarios
SET
    balance = 315800,
    ingresos = 850000,
    gastos = 534200,
    deudas = 1245000,
    ahorro = 235000
WHERE id = 2;


-- =====================================================
-- 2. LIMPIAR DATOS DEMO ANTERIORES DE ELIAS
-- =====================================================

DELETE FROM movimientos_meta
WHERE usuario_id = 2;

DELETE FROM pagos_deuda
WHERE usuario_id = 2;

DELETE FROM pagos_servicios
WHERE usuario_id = 2;

DELETE FROM transferencias
WHERE emisor_id = 2
   OR receptor_id = 2;

DELETE FROM transacciones
WHERE usuario_id = 2;

DELETE FROM metas
WHERE usuario_id = 2;

DELETE FROM deudas
WHERE usuario_id = 2;

DELETE FROM medios_pago
WHERE usuario_id = 2;


-- =====================================================
-- 3. MEDIOS DE PAGO
-- =====================================================

INSERT INTO medios_pago
(
    usuario_id,
    tipo,
    banco,
    nombre,
    ultimos4,
    titular,
    vencimiento,
    principal
)
VALUES
(
    2,
    'cuenta',
    'BAC Credomatic',
    'Cuenta BAC',
    '2045',
    'Elias Rodriguez',
    NULL,
    TRUE
),
(
    2,
    'debito',
    'BAC Credomatic',
    'Visa',
    '4821',
    'Elias Rodriguez',
    '08/29',
    FALSE
),
(
    2,
    'credito',
    'BAC Credomatic',
    'Mastercard',
    '7314',
    'Elias Rodriguez',
    '11/28',
    FALSE
);


-- =====================================================
-- 4. INGRESOS
-- TOTAL = 850,000
-- =====================================================

INSERT INTO transacciones
(
    usuario_id,
    descripcion,
    comercio_persona,
    tipo,
    categoria_id,
    medio_pago_id,
    monto,
    estado,
    referencia,
    fecha
)
VALUES
(
    2,
    'Salario mensual',
    'Empresa',
    'ingreso',
    1,
    NULL,
    700000,
    'procesado',
    'DEMO-ING-001',
    '2026-08-01'
),
(
    2,
    'Venta de artículos',
    'Venta personal',
    'ingreso',
    1,
    NULL,
    100000,
    'procesado',
    'DEMO-ING-002',
    '2026-08-08'
),
(
    2,
    'SINPE recibido',
    'Carlos',
    'transferencia_recibida',
    9,
    NULL,
    50000,
    'recibido',
    'DEMO-ING-003',
    '2026-08-15'
);


-- =====================================================
-- 5. GASTOS
-- TOTAL = 534,200
-- =====================================================

INSERT INTO transacciones
(
    usuario_id,
    descripcion,
    comercio_persona,
    tipo,
    categoria_id,
    medio_pago_id,
    monto,
    estado,
    referencia,
    fecha
)
VALUES
(
    2,
    'Supermercado Palí',
    'Palí',
    'gasto',
    2,
    2,
    42000,
    'procesado',
    'DEMO-GAS-001',
    '2026-08-02'
),
(
    2,
    'Compra Walmart',
    'Walmart',
    'gasto',
    2,
    2,
    45000,
    'procesado',
    'DEMO-GAS-002',
    '2026-08-04'
),
(
    2,
    'Restaurantes y alimentación',
    'Varios',
    'gasto',
    2,
    2,
    98000,
    'procesado',
    'DEMO-GAS-003',
    '2026-08-10'
),

(
    2,
    'Transporte mensual',
    'Uber / Bus',
    'gasto',
    5,
    2,
    72000,
    'procesado',
    'DEMO-GAS-004',
    '2026-08-11'
),

(
    2,
    'Internet',
    'Telecable Costa Rica',
    'gasto',
    4,
    3,
    28500,
    'procesado',
    'DEMO-GAS-005',
    '2026-08-12'
),
(
    2,
    'Electricidad',
    'CNFL',
    'gasto',
    4,
    1,
    31500,
    'procesado',
    'DEMO-GAS-006',
    '2026-08-13'
),
(
    2,
    'Servicios varios',
    'Servicios',
    'gasto',
    4,
    1,
    50000,
    'procesado',
    'DEMO-GAS-007',
    '2026-08-14'
),

(
    2,
    'Entretenimiento',
    'Cine y streaming',
    'gasto',
    6,
    3,
    47000,
    'procesado',
    'DEMO-GAS-008',
    '2026-08-15'
),

(
    2,
    'Compras personales',
    'Comercio',
    'gasto',
    7,
    2,
    65000,
    'procesado',
    'DEMO-GAS-009',
    '2026-08-16'
),

(
    2,
    'Otros gastos',
    'Varios',
    'gasto',
    11,
    1,
    55100,
    'procesado',
    'DEMO-GAS-010',
    '2026-08-17'
);


-- =====================================================
-- 6. DEUDAS
-- TOTAL PENDIENTE = 1,245,000
-- =====================================================

INSERT INTO deudas
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
    2,
    'Gollo',
    'Televisor Samsung',
    550000,
    275000,
    55000,
    '2026-08-20',
    'activa',
    '2026-03-20'
),
(
    2,
    'BAC Credomatic',
    'Tarjeta de crédito •••• 4821',
    300000,
    115500,
    25000,
    '2026-08-22',
    'activa',
    '2026-04-10'
),
(
    2,
    'Préstamo Personal',
    'Financiamiento personal',
    1200000,
    414500,
    85000,
    '2026-08-30',
    'activa',
    '2026-01-15'
);


-- =====================================================
-- 7. METAS DE AHORRO
-- =====================================================

INSERT INTO metas
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
    2,
    'Marchamo',
    'Ahorro para pago del marchamo',
    200000,
    150000,
    '2026-12-01',
    'activa'
),
(
    2,
    'Viaje',
    'Ahorro para viaje',
    300000,
    85000,
    '2026-10-01',
    'activa'
);


-- =====================================================
-- 8. MOVIMIENTOS DE METAS
-- =====================================================

INSERT INTO movimientos_meta
(
    meta_id,
    usuario_id,
    tipo,
    monto,
    fecha
)
SELECT
    id,
    2,
    'aporte',
    monto_actual,
    NOW()
FROM metas
WHERE usuario_id = 2;
