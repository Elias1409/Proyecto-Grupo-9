CREATE DATABASE IF NOT EXISTS fintrack;

USE fintrack;


-- =========================================
-- TABLA DE USUARIOS
-- =========================================

CREATE TABLE IF NOT EXISTS usuarios (

    id INT AUTO_INCREMENT PRIMARY KEY,

    nombre VARCHAR(100) NOT NULL,

    correo VARCHAR(150) NOT NULL UNIQUE,

    clave VARCHAR(255) NOT NULL,

    balance DECIMAL(12,2) NOT NULL DEFAULT 0.00,

    ingresos DECIMAL(12,2) NOT NULL DEFAULT 0.00,

    gastos DECIMAL(12,2) NOT NULL DEFAULT 0.00,

    deudas DECIMAL(12,2) NOT NULL DEFAULT 0.00,

    ahorro DECIMAL(12,2) NOT NULL DEFAULT 0.00,

    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);


-- =========================================
-- TABLA DE TRANSACCIONES
-- =========================================

CREATE TABLE IF NOT EXISTS transacciones (

    id INT AUTO_INCREMENT PRIMARY KEY,

    usuario_id INT NOT NULL,

    descripcion VARCHAR(150) NOT NULL,

    tipo ENUM('ingreso', 'gasto') NOT NULL,

    monto DECIMAL(12,2) NOT NULL,

    fecha DATE NOT NULL,

    FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE

);


-- =========================================
-- TABLA DE DEUDAS
-- =========================================

CREATE TABLE IF NOT EXISTS deudas (

    id INT AUTO_INCREMENT PRIMARY KEY,

    usuario_id INT NOT NULL,

    descripcion VARCHAR(150) NOT NULL,

    monto_total DECIMAL(12,2) NOT NULL,

    monto_pagado DECIMAL(12,2) NOT NULL DEFAULT 0.00,

    fecha DATE,

    FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE

);


-- =========================================
-- TABLA DE METAS
-- =========================================

CREATE TABLE IF NOT EXISTS metas (

    id INT AUTO_INCREMENT PRIMARY KEY,

    usuario_id INT NOT NULL,

    nombre VARCHAR(100) NOT NULL,

    monto_objetivo DECIMAL(12,2) NOT NULL,

    monto_actual DECIMAL(12,2) NOT NULL DEFAULT 0.00,

    fecha_limite DATE,

    FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE

);