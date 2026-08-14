document.addEventListener("DOMContentLoaded", function () {
  // =====================================================
  // INICIAR SESIÓN
  // =====================================================

  const formLogin = document.getElementById("formLogin");

  if (formLogin) {
    formLogin.addEventListener("submit", async function (event) {
      event.preventDefault();

      const correo = document
        .getElementById("loginCorreo")
        .value.trim()
        .toLowerCase();

      const clave = document.getElementById("loginClave").value;

      const mensaje = document.getElementById("loginMensaje");

      // Limpiar mensaje anterior
      mensaje.textContent = "";

      try {
        // Enviar correo y contraseña a PHP
        const respuesta = await fetch("backend/login.php", {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            correo: correo,
            clave: clave,
          }),
        });

        const datos = await respuesta.json();

        // Si PHP devuelve un error
        if (!datos.ok) {
          mensaje.textContent = datos.mensaje;
          mensaje.style.color = "red";

          return;
        }

        // Guardar usuario que inició sesión
        sessionStorage.setItem(
          "fintrackUsuarioActual",
          JSON.stringify(datos.usuario)
        );

        // Entrar al dashboard
        window.location.href = "dashboard.html";
      } catch (error) {
        console.error("Error en login:", error);

        mensaje.textContent = "No se pudo conectar al servidor.";

        mensaje.style.color = "red";
      }
    });
  }
  // =====================================================
  // VALIDAR NOMBRE DE USUARIO
  // SOLO LETRAS Y NÚMEROS
  // =====================================================

  const registroUsuario = document.getElementById("registroUsuario");

  if (registroUsuario) {
    registroUsuario.addEventListener("input", function () {
      // Solo permite letras y números
      this.value = this.value.replace(/[^a-zA-Z0-9]/g, "");
    });
  }

  // =====================================================
  // CREAR CUENTA
  // =====================================================

  const formRegistro = document.getElementById("formRegistro");

  if (formRegistro) {
    formRegistro.addEventListener("submit", async function (event) {
      event.preventDefault();

      // Obtener datos del formulario
      const nombre = document.getElementById("registroNombre").value.trim();

      const apellidos = document
        .getElementById("registroApellidos")
        .value.trim();

      const usuarioRegistro = document
        .getElementById("registroUsuario")
        .value.trim()
        .toLowerCase();

      const correo = document
        .getElementById("registroCorreo")
        .value.trim()
        .toLowerCase();

      const clave = document.getElementById("registroClave").value;

      const confirmar = document.getElementById("registroConfirmar").value;

      const mensaje = document.getElementById("registroMensaje");

      function capitalizar(texto) {
        return texto
          .toLowerCase()
          .split(/\s+/)
          .filter(function (palabra) {
            return palabra !== "";
          })
          .map(function (palabra) {
            return palabra.charAt(0).toUpperCase() + palabra.slice(1);
          })
          .join(" ");
      }

      const nombreFormateado = capitalizar(nombre);

      const apellidosFormateados = capitalizar(apellidos);

      // Limpiar mensaje anterior
      mensaje.textContent = "";

      // =================================================
      // VALIDAR NOMBRE
      // =================================================

      if (apellidos === "") {
        mensaje.textContent = "Debe ingresar sus apellidos.";

        mensaje.style.color = "red";

        return;
      }

      if (usuarioRegistro === "") {
        mensaje.textContent = "Debe ingresar un nombre de usuario.";

        mensaje.style.color = "red";

        return;
      }

      if (usuarioRegistro.length < 4) {
        mensaje.textContent =
          "El nombre de usuario debe tener mínimo 4 caracteres.";

        mensaje.style.color = "red";

        return;
      }

      if (!/^[a-zA-Z0-9]+$/.test(usuarioRegistro)) {
        mensaje.textContent =
          "El usuario solo puede contener letras y números.";

        mensaje.style.color = "red";

        return;
      }

      // =================================================
      // VALIDAR CORREO
      // =================================================

      if (correo === "") {
        mensaje.textContent = "Debe ingresar su correo electrónico.";

        mensaje.style.color = "red";

        return;
      }

      // =================================================
      // VALIDAR CONTRASEÑA
      // =================================================

      if (clave.length < 8) {
        mensaje.textContent = "La contraseña debe tener mínimo 8 caracteres.";

        mensaje.style.color = "red";

        return;
      }

      // =================================================
      // COMPARAR CONTRASEÑAS
      // =================================================

      if (clave !== confirmar) {
        mensaje.textContent = "Las contraseñas no coinciden.";

        mensaje.style.color = "red";

        return;
      }

      try {
        mensaje.textContent = "Creando cuenta...";

        mensaje.style.color = "#555";

        // Enviar datos a registro.php
        const respuesta = await fetch("backend/registro.php", {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            nombre: nombreFormateado,
            apellidos: apellidosFormateados,
            usuario: usuarioRegistro,
            correo: correo,
            clave: clave,
          }),
        });

        const datos = await respuesta.json();

        // PHP encontró algún problema
        if (!datos.ok) {
          mensaje.textContent = datos.mensaje;

          mensaje.style.color = "red";

          return;
        }

        // =================================================
        // CUENTA CREADA
        // =================================================

        mensaje.textContent = "Cuenta creada correctamente.";

        mensaje.style.color = "green";

        // Limpiar formulario
        formRegistro.reset();

        // Volver al login después de 1 segundo
        setTimeout(function () {
          window.location.href = "index.html";
        }, 1000);
      } catch (error) {
        console.error("Error en registro:", error);

        mensaje.textContent = "No se pudo conectar al servidor.";

        mensaje.style.color = "red";
      }
    });
  }

  // =====================================================
  // OBTENER USUARIO QUE INICIÓ SESIÓN
  // =====================================================

  const usuarioGuardado = sessionStorage.getItem("fintrackUsuarioActual");

  if (usuarioGuardado) {
    const usuario = JSON.parse(usuarioGuardado);

    // =====================================================
    // BIENVENIDA DEL DASHBOARD
    // =====================================================

    const nombreBienvenida = document.getElementById("nombreBienvenida");

    if (nombreBienvenida && usuario.nombre) {
      const primerNombre = usuario.nombre.trim().split(" ")[0];

      nombreBienvenida.textContent = primerNombre;
    }

    const avatarBienvenida = document.getElementById("avatarBienvenida");

    if (avatarBienvenida && usuario.nombre) {
      const partes = usuario.nombre.trim().split(" ");

      let iniciales = partes[0][0];

      if (partes.length > 1) {
        iniciales += partes[1][0];
      }

      avatarBienvenida.textContent = iniciales.toUpperCase();
    }

    // =====================================================
    // IDENTIFICAR USUARIO
    // =====================================================

    const esElias = usuario.correo === "erodriguez60177@ufide.ac.cr";

    // aquí continúa el resto de tu código...

    // =====================================================
    // IDENTIFICAR USUARIO
    // =====================================================

    const esUsuarioNuevo =
      Number(usuario.balance) === 0 &&
      Number(usuario.ingresos) === 0 &&
      Number(usuario.gastos) === 0 &&
      Number(usuario.deudas) === 0 &&
      Number(usuario.ahorro) === 0;

    // =====================================================
    // FORMATO DE COLONES
    // =====================================================

    function formatoColones(valor) {
      const numero = Number(valor) || 0;

      return "₡ " + numero.toLocaleString("es-CR");
    }

    // =====================================================
    // NOMBRE DEL USUARIO
    // =====================================================

    const nombreUsuario = document.getElementById("nombreUsuario");

    if (nombreUsuario) {
      nombreUsuario.textContent = usuario.nombre;
    }

    // =====================================================
    // CORREO DEL USUARIO
    // =====================================================

    const correoUsuario = document.getElementById("correoUsuario");

    if (correoUsuario) {
      correoUsuario.textContent = usuario.correo;
    }

    // =====================================================
    // AVATAR DEL SIDEBAR
    // =====================================================

    const avatarUsuario = document.getElementById("avatarUsuario");

    if (avatarUsuario && usuario.nombre) {
      const partes = usuario.nombre.trim().split(" ");

      let iniciales = partes[0][0];

      if (partes.length > 1) {
        iniciales += partes[1][0];
      }

      avatarUsuario.textContent = iniciales.toUpperCase();
    }

    // =====================================================
    // DATOS DE PERFIL
    // =====================================================

    const perfilNombre = document.getElementById("perfilNombre");

    if (perfilNombre) {
      perfilNombre.textContent = usuario.nombre;
    }

    const perfilCorreo = document.getElementById("perfilCorreo");

    if (perfilCorreo) {
      perfilCorreo.textContent = usuario.correo;
    }

    const perfilNombreInput = document.getElementById("perfilNombreInput");

    if (perfilNombreInput) {
      perfilNombreInput.value = usuario.nombre;
    }

    const perfilCorreoInput = document.getElementById("perfilCorreoInput");

    if (perfilCorreoInput) {
      perfilCorreoInput.value = usuario.correo;
    }

    const perfilAvatar = document.getElementById("perfilAvatar");

    if (perfilAvatar && usuario.nombre) {
      const partes = usuario.nombre.trim().split(" ");

      let iniciales = partes[0][0];

      if (partes.length > 1) {
        iniciales += partes[1][0];
      }

      perfilAvatar.textContent = iniciales.toUpperCase();
    }

    // =====================================================
    // ELEMENTOS DEL DASHBOARD
    // =====================================================

    const ahorroUsuario = document.getElementById("ahorroUsuario");

    const balanceUsuario = document.getElementById("balanceUsuario");

    const ingresosUsuario = document.getElementById("ingresosUsuario");

    const gastosUsuario = document.getElementById("gastosUsuario");

    // =====================================================
    // ELIAS - CLIENTE ANTIGUO
    // =====================================================

    if (esElias) {
      if (ahorroUsuario) {
        ahorroUsuario.textContent = formatoColones(usuario.ahorro);
      }

      if (balanceUsuario) {
        balanceUsuario.textContent = formatoColones(315800);
      }

      if (ingresosUsuario) {
        ingresosUsuario.textContent = formatoColones(850000);
      }

      if (gastosUsuario) {
        gastosUsuario.textContent = formatoColones(534200);
      }
    }

    // =====================================================
    // USUARIO NUEVO
    // =====================================================
    else if (esUsuarioNuevo) {
      // Ahorro
      if (ahorroUsuario) {
        ahorroUsuario.textContent = "₡ 0";
      }

      // Balance
      if (balanceUsuario) {
        balanceUsuario.textContent = "₡ 0";
      }

      // Ingresos
      if (ingresosUsuario) {
        ingresosUsuario.textContent = "₡ 0";
      }

      // Gastos
      if (gastosUsuario) {
        gastosUsuario.textContent = "₡ 0";
      }

      // =====================================================
      // ACTIVIDAD RECIENTE
      // =====================================================

      const tablaMovimientos = document.getElementById("tablaMovimientos");

      if (tablaMovimientos) {
        tablaMovimientos.innerHTML = `
            <tr>
                <td colspan="2">
                    No hay movimientos registrados.
                </td>
            </tr>
        `;
      }

      // =====================================================
      // AVISOS
      // =====================================================

      const avisosUsuario = document.getElementById("avisosUsuario");

      if (avisosUsuario) {
        avisosUsuario.innerHTML = `
            <div class="alert alert-info">
                No tienes avisos importantes.
            </div>
        `;
      }

      // =====================================================
      // PRÓXIMOS PAGOS
      // =====================================================

      const proximosPagos = document.getElementById("proximosPagos");

      if (proximosPagos) {
        proximosPagos.innerHTML = `
            <div class="alert alert-info">
                No tienes pagos próximos.
            </div>
        `;
      }

      // =====================================================
      // SOBRES DE AHORRO
      // =====================================================

      const sobresAhorro = document.getElementById("sobresAhorro");

      if (sobresAhorro) {
        sobresAhorro.innerHTML = `
            <div class="alert alert-info">
                Aún no tienes metas de ahorro.
            </div>
        `;
      }

      // =====================================================
      // CONTADOR DE NOTIFICACIONES
      // =====================================================

      const contadorNotificaciones = document.getElementById(
        "contadorNotificaciones"
      );

      if (contadorNotificaciones) {
        contadorNotificaciones.textContent = "0";
      }

      // =====================================================
      // PANEL DE NOTIFICACIONES
      // =====================================================

      const panelNotificaciones = document.getElementById(
        "panelNotificaciones"
      );

      if (panelNotificaciones) {
        panelNotificaciones.innerHTML = `
            <div class="notification-panel-title">
                Notificaciones
            </div>

            <div class="notification-item">
                No tienes notificaciones.
            </div>
        `;
      }

      // =====================================================
      // RESUMEN DEL MES
      // =====================================================

      const resumenIngresos = document.getElementById("resumenIngresos");

      const resumenGastos = document.getElementById("resumenGastos");

      const resumenDisponible = document.getElementById("resumenDisponible");

      if (resumenIngresos) {
        resumenIngresos.textContent = "₡ 0";
      }

      if (resumenGastos) {
        resumenGastos.textContent = "₡ 0";
      }

      if (resumenDisponible) {
        resumenDisponible.textContent = "₡ 0";
      }
    }

    // =====================================================
    // OTRO USUARIO CON DATOS
    // =====================================================
    else {
      if (balanceUsuario) {
        balanceUsuario.textContent = formatoColones(usuario.balance);
      }

      if (ingresosUsuario) {
        ingresosUsuario.textContent = formatoColones(usuario.ingresos);
      }

      if (gastosUsuario) {
        gastosUsuario.textContent = formatoColones(usuario.gastos);
      }
    }
  }
  // =====================================================
  // DESPLEGAR INGRESOS Y GASTOS
  // =====================================================

  const botonesDetalle = document.querySelectorAll(".detalle-toggle");

  botonesDetalle.forEach(function (boton) {
    boton.addEventListener("click", function () {
      const idDetalle = boton.getAttribute("data-target");

      const detalle = document.getElementById(idDetalle);

      if (!detalle) {
        return;
      }

      detalle.classList.toggle("abierto");

      if (detalle.classList.contains("abierto")) {
        boton.textContent = "Ocultar desglose";
      } else {
        boton.textContent = "Ver desglose";
      }
    });
  });

  // =====================================================
  // NOTIFICACIONES
  // =====================================================

  const botonNotificaciones = document.getElementById("botonNotificaciones");

  const panelNotificaciones = document.getElementById("panelNotificaciones");

  if (botonNotificaciones && panelNotificaciones) {
    botonNotificaciones.addEventListener("click", function () {
      panelNotificaciones.classList.toggle("abierto");
    });
  }
  // =====================================================
  // ELIMINAR NOTIFICACIONES
  // =====================================================

  const botonesEliminarNotificacion = document.querySelectorAll(
    ".notification-delete"
  );

  botonesEliminarNotificacion.forEach(function (boton) {
    boton.addEventListener("click", function () {
      const notificacion = boton.closest(".notification-card");

      if (!notificacion) {
        return;
      }

      // Animación opcional
      notificacion.classList.add("eliminando");

      setTimeout(function () {
        notificacion.remove();

        actualizarContadorNotificaciones();

        const lista = document.getElementById("listaNotificaciones");

        if (
          lista &&
          lista.querySelectorAll(".notification-card").length === 0
        ) {
          lista.innerHTML = `
                    <div class="alert alert-info">
                        No tienes notificaciones pendientes.
                    </div>
                `;
        }
      }, 200);
    });
  });

  // =====================================================
  // ACTUALIZAR CONTADOR DE NOTIFICACIONES
  // =====================================================

  function actualizarContadorNotificaciones() {
    const contador = document.getElementById("contadorNotificaciones");

    const cantidad = document.querySelectorAll(".notification-card").length;

    if (!contador) {
      return;
    }

    contador.textContent = cantidad;

    if (cantidad === 0) {
      contador.style.display = "none";
    } else {
      contador.style.display = "flex";
    }
  }

  // =====================================================
  // CERRAR SESIÓN
  // =====================================================

  const botonesCerrarSesion = document.querySelectorAll(".logout-link");

  botonesCerrarSesion.forEach(function (boton) {
    boton.addEventListener("click", function (event) {
      event.preventDefault();

      sessionStorage.removeItem("fintrackUsuarioActual");

      window.location.href = "index.html";
    });
  });
});
