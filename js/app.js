document.addEventListener("DOMContentLoaded", function () {
  // =====================================================
  // INICIAR SESIÓN
  // =====================================================

  const formLogin = document.getElementById("formLogin");

  if (formLogin) {
    formLogin.addEventListener("submit", async function (event) {
      event.preventDefault();

      const usuario = document
        .getElementById("loginUsuario")
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
            usuario: usuario,
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
      if (nombre === "") {
        mensaje.textContent = "Debe ingresar su nombre.";

        mensaje.style.color = "red";

        return;
      }
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
// DASHBOARD CONECTADO A MYSQL
// =====================================================

const balanceUsuario =
  document.getElementById("balanceUsuario");

const ingresosUsuario =
  document.getElementById("ingresosUsuario");

const gastosUsuario =
  document.getElementById("gastosUsuario");

const ahorroUsuario =
  document.getElementById("ahorroUsuario");

const tablaMovimientos =
  document.getElementById("tablaMovimientos");

const proximosPagos =
  document.getElementById("proximosPagos");

const sobresAhorro =
  document.getElementById("sobresAhorro");

const detalleIngresos =
  document.getElementById("detalleIngresos");

const detalleGastos =
  document.getElementById("detalleGastos");

const resumenIngresos =
  document.getElementById("resumenIngresos");

const resumenGastos =
  document.getElementById("resumenGastos");

const resumenDisponible =
  document.getElementById("resumenDisponible");


// =====================================================
// COMPROBAR SI ESTAMOS EN DASHBOARD
// =====================================================

const estamosEnDashboard =
  balanceUsuario ||
  tablaMovimientos ||
  proximosPagos ||
  sobresAhorro;


// =====================================================
// FORMATO MONEDA
// =====================================================

function monedaDashboard(valor) {

  const numero =
    Number(valor) || 0;

  return (
    "₡ " +
    numero.toLocaleString(
      "es-CR",
      {
        maximumFractionDigits: 0
      }
    )
  );

}


// =====================================================
// FORMATEAR FECHA
// =====================================================

function fechaDashboard(fecha) {

  if (!fecha) {
    return "";
  }

  const partes =
    fecha.split("-");

  if (partes.length !== 3) {
    return fecha;
  }

  const fechaLocal =
    new Date(
      Number(partes[0]),
      Number(partes[1]) - 1,
      Number(partes[2])
    );

  return fechaLocal.toLocaleDateString(
    "es-CR",
    {
      day: "numeric",
      month: "short",
      year: "numeric"
    }
  );

}


// =====================================================
// DÍAS PARA PRÓXIMO PAGO
// =====================================================

function diasHasta(fecha) {

  if (!fecha) {
    return null;
  }

  const partes =
    fecha.split("-");

  const fechaPago =
    new Date(
      Number(partes[0]),
      Number(partes[1]) - 1,
      Number(partes[2])
    );

  const hoy =
    new Date();

  hoy.setHours(
    0,
    0,
    0,
    0
  );

  fechaPago.setHours(
    0,
    0,
    0,
    0
  );

  const diferencia =
    fechaPago - hoy;

  return Math.ceil(
    diferencia /
    (
      1000 *
      60 *
      60 *
      24
    )
  );

}


// =====================================================
// TEXTO PRÓXIMO PAGO
// =====================================================

function textoProximoPago(fecha) {

  const dias =
    diasHasta(fecha);


  if (dias === null) {
    return "";
  }


  if (dias < 0) {

    return (
      "Vencido hace " +
      Math.abs(dias) +
      (
        Math.abs(dias) === 1
          ? " día"
          : " días"
      )
    );

  }


  if (dias === 0) {

    return "Vence hoy";

  }


  if (dias === 1) {

    return "Vence mañana";

  }


  return (
    "Vence en " +
    dias +
    " días"
  );

}


// =====================================================
// CARGAR DASHBOARD DESDE MYSQL
// =====================================================

async function cargarDashboard() {

  if (!estamosEnDashboard) {
    return;
  }


  if (!usuario.id) {

    console.error(
      "El usuario actual no tiene ID."
    );

    return;
  }


  try {

    const respuesta =
      await fetch(
        "backend/dashboard.php?usuario_id=" +
        encodeURIComponent(
          usuario.id
        )
      );


    if (!respuesta.ok) {

      throw new Error(
        "Error HTTP: " +
        respuesta.status
      );

    }


    const datos =
      await respuesta.json();


    if (!datos.ok) {

      console.error(
        datos.mensaje
      );

      return;
    }


    // =================================================
    // ACTUALIZAR USUARIO EN SESSIONSTORAGE
    // =================================================

    /*
      Conservamos teléfono, país, moneda,
      fecha de nacimiento, etc.

      dashboard.php solamente devuelve
      algunos campos del usuario.
    */

    const usuarioActualizado = {
      ...usuario,
      ...datos.usuario
    };


    sessionStorage.setItem(
      "fintrackUsuarioActual",
      JSON.stringify(
        usuarioActualizado
      )
    );


    // =================================================
    // NOMBRE Y USUARIO DEL SIDEBAR
    // =================================================

    const nombreCompleto =
      `${usuarioActualizado.nombre || ""} ${usuarioActualizado.apellidos || ""}`
        .trim();


    if (nombreUsuario) {

      nombreUsuario.textContent =
        nombreCompleto ||
        "Usuario";

    }


    if (correoUsuario) {

      correoUsuario.textContent =
        usuarioActualizado.usuario
          ? "@" +
            usuarioActualizado.usuario
          : "@usuario";

    }


    // =================================================
    // BIENVENIDA
    // =================================================

    if (nombreBienvenida) {

      nombreBienvenida.textContent =
        usuarioActualizado.nombre ||
        "Usuario";

    }


    // =================================================
    // AVATAR
    // =================================================

    const partesNombre =
      nombreCompleto
        .split(/\s+/)
        .filter(Boolean);


    let iniciales =
      "US";


    if (partesNombre.length === 1) {

      iniciales =
        partesNombre[0][0]
          .toUpperCase();

    }


    if (partesNombre.length >= 2) {

      iniciales =
        (
          partesNombre[0][0] +
          partesNombre[
            partesNombre.length - 1
          ][0]
        ).toUpperCase();

    }


    if (avatarUsuario) {

      avatarUsuario.textContent =
        iniciales;

    }


    if (avatarBienvenida) {

      avatarBienvenida.textContent =
        iniciales;

    }


    // =================================================
    // BALANCE / INGRESOS / GASTOS / AHORRO
    // =================================================

    if (balanceUsuario) {

      balanceUsuario.textContent =
        monedaDashboard(
          datos.usuario.balance
        );

    }


    if (ingresosUsuario) {

      ingresosUsuario.textContent =
        monedaDashboard(
          datos.usuario.ingresos
        );

    }


    if (gastosUsuario) {

      gastosUsuario.textContent =
        monedaDashboard(
          datos.usuario.gastos
        );

    }


    if (ahorroUsuario) {

      ahorroUsuario.textContent =
        monedaDashboard(
          datos.usuario.ahorro
        );

    }


    // =================================================
    // RESUMEN DEL MES
    // =================================================

    if (resumenIngresos) {

      resumenIngresos.textContent =
        monedaDashboard(
          datos.usuario.ingresos
        );

    }


    if (resumenGastos) {

      resumenGastos.textContent =
        monedaDashboard(
          datos.usuario.gastos
        );

    }


    if (resumenDisponible) {

      resumenDisponible.textContent =
        monedaDashboard(
          datos.usuario.balance
        );

    }


    // =================================================
    // PORCENTAJE DE GASTOS
    // =================================================

    const totalIngresos =
      Number(
        datos.usuario.ingresos
      ) || 0;


    const totalGastos =
      Number(
        datos.usuario.gastos
      ) || 0;


    let porcentajeUso =
      0;


    if (totalIngresos > 0) {

      porcentajeUso =
        (
          totalGastos /
          totalIngresos
        ) * 100;

    }


    porcentajeUso =
      Math.min(
        porcentajeUso,
        100
      );


    const etiquetaUso =
      document.querySelector(
        ".usage-label"
      );


    const barraUso =
      document.querySelector(
        ".usage-progress"
      );


    if (etiquetaUso) {

      if (totalIngresos === 0) {

        etiquetaUso.textContent =
          "Aún no tienes ingresos registrados.";

      } else {

        etiquetaUso.textContent =
          "Has utilizado el " +
          porcentajeUso.toFixed(1) +
          "% de tus ingresos.";

      }

    }


    if (barraUso) {

      barraUso.style.width =
        porcentajeUso + "%";

    }


    // =================================================
    // ACTIVIDAD RECIENTE
    // =================================================

    if (tablaMovimientos) {

      tablaMovimientos.innerHTML =
        "";


      if (
        !datos.movimientos ||
        datos.movimientos.length === 0
      ) {

        tablaMovimientos.innerHTML = `

          <tr>

            <td colspan="2">

              <div class="alert alert-info">
                No hay movimientos registrados.
              </div>

            </td>

          </tr>

        `;

      } else {

        datos.movimientos.forEach(
          function (movimiento) {

            const esIngreso =
              movimiento.tipo === "ingreso" ||
              movimiento.tipo ===
                "transferencia_recibida" ||
              movimiento.tipo ===
                "retiro_meta";


            const signo =
              esIngreso
                ? "+"
                : "-";


            const clase =
              esIngreso
                ? "text-green"
                : "text-red";


            const icono =
              esIngreso
                ? "icon-arrow-down-left"
                : "icon-cart";


            const fila =
              document.createElement(
                "tr"
              );


            fila.innerHTML = `

              <td>

                <span class="cell-ic">

                  <svg class="icon">

                    <use
                      href="assets/icons.svg#${icono}">
                    </use>

                  </svg>

                  <div>

                    <strong>
                      ${movimiento.descripcion}
                    </strong>

                    <div class="text-muted text-xs">

                      ${fechaDashboard(
                        movimiento.fecha
                      )}

                    </div>

                  </div>

                </span>

              </td>


              <td
                class="${clase} fw-700 num"
                style="text-align:right;"
              >

                ${signo}${monedaDashboard(
                  movimiento.monto
                )}

              </td>

            `;


            tablaMovimientos.appendChild(
              fila
            );

          }
        );

      }

    }


    // =================================================
    // PRÓXIMOS PAGOS
    // =================================================

    if (proximosPagos) {

      proximosPagos.innerHTML =
        "";


      if (
        !datos.proximosPagos ||
        datos.proximosPagos.length === 0
      ) {

        proximosPagos.innerHTML = `

          <div class="alert alert-info">

            No tienes pagos próximos.

          </div>

        `;

      } else {

        datos.proximosPagos.forEach(
          function (pago) {

            const item =
              document.createElement(
                "div"
              );


            item.className =
              "payment-item";


            const dias =
              diasHasta(
                pago.proximo_pago
              );


            const claseMonto =
              dias !== null &&
              dias <= 3
                ? "text-red"
                : "";


            item.innerHTML = `

              <div>

                <strong>
                  ${pago.nombre}
                </strong>

                <div
                  class="text-muted text-sm"
                >

                  ${textoProximoPago(
                    pago.proximo_pago
                  )}

                </div>

              </div>


              <div
                class="${claseMonto} fw-700 num"
              >

                ${monedaDashboard(
                  pago.cuota
                )}

              </div>

            `;


            proximosPagos.appendChild(
              item
            );

          }
        );

      }

    }


    // =================================================
    // METAS DE AHORRO
    // =================================================

    if (sobresAhorro) {

      sobresAhorro.innerHTML =
        "";


      if (
        !datos.metas ||
        datos.metas.length === 0
      ) {

        sobresAhorro.innerHTML = `

          <div class="alert alert-info">

            Aún no tienes metas de ahorro.

          </div>

        `;

      } else {

        datos.metas.forEach(
          function (meta) {

            const objetivo =
              Number(
                meta.monto_objetivo
              ) || 0;


            const actual =
              Number(
                meta.monto_actual
              ) || 0;


            let porcentaje =
              0;


            if (objetivo > 0) {

              porcentaje =
                (
                  actual /
                  objetivo
                ) * 100;

            }


            porcentaje =
              Math.min(
                porcentaje,
                100
              );


            const item =
              document.createElement(
                "div"
              );


            item.className =
              "goal-item";


            item.innerHTML = `

              <div class="goal-top">

                <strong>
                  ${meta.nombre}
                </strong>

                <span>
                  ${porcentaje.toFixed(0)}%
                </span>

              </div>


              <div class="goal-bar">

                <div
                  class="goal-progress"
                  style="width:${porcentaje}%;">
                </div>

              </div>


              <div
                class="text-muted text-sm"
              >

                ${monedaDashboard(
                  actual
                )}
                de
                ${monedaDashboard(
                  objetivo
                )}

              </div>

            `;


            sobresAhorro.appendChild(
              item
            );

          }
        );

      }

    }


    // =================================================
    // DESGLOSE DE INGRESOS
    // =================================================

    if (detalleIngresos) {

      detalleIngresos.innerHTML =
        "";


      if (
        !datos.desgloseIngresos ||
        datos.desgloseIngresos.length === 0
      ) {

        detalleIngresos.innerHTML = `

          <div class="detalle-item">

            <span>
              Sin ingresos registrados
            </span>

            <strong>
              ₡ 0
            </strong>

          </div>

        `;

      } else {

        datos.desgloseIngresos.forEach(
          function (categoria) {

            const item =
              document.createElement(
                "div"
              );


            item.className =
              "detalle-item";


            item.innerHTML = `

              <span>
                ${categoria.categoria}
              </span>

              <strong>
                ${monedaDashboard(
                  categoria.total
                )}
              </strong>

            `;


            detalleIngresos.appendChild(
              item
            );

          }
        );

      }

    }


    // =================================================
    // DESGLOSE DE GASTOS
    // =================================================

    if (detalleGastos) {

      detalleGastos.innerHTML =
        "";


      if (
        !datos.desgloseGastos ||
        datos.desgloseGastos.length === 0
      ) {

        detalleGastos.innerHTML = `

          <div class="detalle-item">

            <span>
              Sin gastos registrados
            </span>

            <strong>
              ₡ 0
            </strong>

          </div>

        `;

      } else {

        datos.desgloseGastos.forEach(
          function (categoria) {

            const item =
              document.createElement(
                "div"
              );


            item.className =
              "detalle-item";


            item.innerHTML = `

              <span>
                ${categoria.categoria}
              </span>

              <strong>
                ${monedaDashboard(
                  categoria.total
                )}
              </strong>

            `;


            detalleGastos.appendChild(
              item
            );

          }
        );

      }

    }


  } catch (error) {

    console.error(
      "Error cargando Dashboard:",
      error
    );

  }

}


// =====================================================
// INICIAR DASHBOARD
// =====================================================
  
cargarDashboard();
  }

  // =====================================================
// NUEVA TRANSACCIÓN - ABRIR Y CERRAR MODAL
// =====================================================

const btnNuevaTransaccion =
  document.getElementById("btnNuevaTransaccion");

const modalNuevaTransaccion =
  document.getElementById("modalNuevaTransaccion");

const cerrarNuevaTransaccion =
  document.getElementById("cerrarNuevaTransaccion");

const cancelarNuevaTransaccion =
  document.getElementById("cancelarNuevaTransaccion");


function abrirModalNuevaTransaccion() {

  if (!modalNuevaTransaccion) {
    return;
  }

  modalNuevaTransaccion.classList.add("abierto");
}


function cerrarModalNuevaTransaccion() {

  if (!modalNuevaTransaccion) {
    return;
  }

  modalNuevaTransaccion.classList.remove("abierto");
}


if (btnNuevaTransaccion) {

  btnNuevaTransaccion.addEventListener(
    "click",
    abrirModalNuevaTransaccion
  );
}


if (cerrarNuevaTransaccion) {

  cerrarNuevaTransaccion.addEventListener(
    "click",
    cerrarModalNuevaTransaccion
  );
}


if (cancelarNuevaTransaccion) {

  cancelarNuevaTransaccion.addEventListener(
    "click",
    cerrarModalNuevaTransaccion
  );
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

  const formNuevaTransaccion =
  document.getElementById("formNuevaTransaccion");

if (formNuevaTransaccion) {
  formNuevaTransaccion.addEventListener(
    "submit",
    async function (event) {
      event.preventDefault();

      const usuarioGuardado =
        sessionStorage.getItem("fintrackUsuarioActual");

      const usuarioActual =
        JSON.parse(usuarioGuardado);

      const datosTransaccion = {
        usuario_id: usuarioActual.id,
        tipo: document.getElementById("transaccionTipo").value,
        comercio_persona: document.getElementById("transaccionComercio").value.trim(),
        descripcion: document.getElementById("transaccionDescripcion").value.trim(),
        categoria_id: Number(document.getElementById("transaccionCategoria").value),
        medio_pago_id: document.getElementById("transaccionMedioPago").value
          ? Number(document.getElementById("transaccionMedioPago").value)
          : null,
        monto: Number(document.getElementById("transaccionMonto").value),
        fecha: document.getElementById("transaccionFecha").value
      };

      try {
        console.log("DATOS ENVIADOS:", datosTransaccion);
        const respuesta = await fetch(
          "backend/guardar_transaccion.php",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(datosTransaccion)
          }
        );

        const datos = await respuesta.json();

        if (!datos.ok) {
          alert(datos.mensaje);
          return;
        }

        const usuarioNuevo = {
          ...usuarioActual,
          ...datos.usuario
        };

        sessionStorage.setItem(
          "fintrackUsuarioActual",
          JSON.stringify(usuarioNuevo)
        );

        alert("Transacción guardada correctamente.");

        window.location.reload();

      } catch (error) {
        console.error(error);
        alert("No se pudo conectar con el servidor.");
      }
    }
  );
}
  

  // =====================================================
// CARGAR TRANSACCIONES DESDE MYSQL
// =====================================================

const tablaTransacciones =
  document.getElementById("tablaTransacciones");


if (tablaTransacciones) {

  const usuarioGuardadoTransacciones =
    sessionStorage.getItem(
      "fintrackUsuarioActual"
    );


  if (usuarioGuardadoTransacciones) {

    const usuarioActualTransacciones =
      JSON.parse(
        usuarioGuardadoTransacciones
      );


    // =====================================================
    // FORMATO COLONES
    // =====================================================

    function formatoColonesTransaccion(valor) {

      const numero =
        Number(valor) || 0;

      return (
        "₡ " +
        numero.toLocaleString(
          "es-CR",
          {
            maximumFractionDigits: 0
          }
        )
      );

    }


    // =====================================================
    // FORMATO FECHA
    // =====================================================

    function formatoFechaTransaccion(fecha) {

      if (!fecha) {
        return "";
      }


      const partes =
        fecha.split("-");


      if (partes.length !== 3) {
        return fecha;
      }


      const fechaLocal =
        new Date(
          Number(partes[0]),
          Number(partes[1]) - 1,
          Number(partes[2])
        );


      return fechaLocal.toLocaleDateString(
        "es-CR",
        {
          day: "numeric",
          month: "short",
          year: "numeric"
        }
      );

    }


    // =====================================================
    // MÉTODO DE PAGO
    // =====================================================

    function obtenerMetodo(transaccion) {

      if (
        transaccion.tipo ===
          "transferencia_recibida" ||
        transaccion.tipo ===
          "transferencia_enviada"
      ) {

        return "SINPE Móvil";

      }


      if (
        !transaccion.medio_nombre &&
        !transaccion.medio_banco
      ) {

        return "Sin especificar";

      }


      const nombre =
        transaccion.medio_nombre ||
        transaccion.medio_banco ||
        "Medio de pago";


      if (transaccion.medio_ultimos4) {

        return (
          nombre +
          " •••• " +
          transaccion.medio_ultimos4
        );

      }


      return nombre;

    }


    // =====================================================
    // TIPO PARA FILTRO
    // =====================================================

    function obtenerTipoFiltro(tipo) {

      if (
        tipo === "ingreso" ||
        tipo ===
          "transferencia_recibida" ||
        tipo === "retiro_meta"
      ) {

        return "ingreso";

      }


      return "gasto";

    }


    // =====================================================
    // MÉTODO PARA FILTRO
    // =====================================================

    function obtenerMetodoFiltro(transaccion) {

      if (
        transaccion.tipo ===
          "transferencia_recibida" ||
        transaccion.tipo ===
          "transferencia_enviada"
      ) {

        return "sinpe";

      }


      const nombre =
        (
          transaccion.medio_nombre ||
          transaccion.medio_tipo ||
          ""
        ).toLowerCase();


      if (nombre.includes("visa")) {

        return "visa";

      }


      if (
        nombre.includes(
          "mastercard"
        )
      ) {

        return "mastercard";

      }


      if (
        nombre.includes("cuenta") ||
        transaccion.medio_tipo ===
          "cuenta"
      ) {

        return "cuenta";

      }


      return "otro";

    }


    // =====================================================
    // CARGAR
    // =====================================================

    async function cargarTransacciones() {

      try {

        const respuesta =
          await fetch(
            "backend/transacciones.php?usuario_id=" +
            encodeURIComponent(
              usuarioActualTransacciones.id
            )
          );


        if (!respuesta.ok) {

          throw new Error(
            "Error HTTP: " +
            respuesta.status
          );

        }


        const datos =
          await respuesta.json();


        if (!datos.ok) {

          console.error(
            datos.mensaje
          );

          return;

        }
        // =====================================================
// ACTUALIZAR RESUMEN DE TRANSACCIONES
// =====================================================

const gastosTransacciones =
  document.getElementById(
    "gastosTransacciones"
  );

const balanceTransacciones =
  document.getElementById(
    "balanceTransacciones"
  );

const ingresosTransacciones =
  document.getElementById(
    "ingresosTransacciones"
  );

const porcentajeUsoTransacciones =
  document.getElementById(
    "porcentajeUsoTransacciones"
  );

const barraUsoTransacciones =
  document.getElementById(
    "barraUsoTransacciones"
  );


const totalIngresos =
  Number(datos.usuario.ingresos) || 0;

const totalGastos =
  Number(datos.usuario.gastos) || 0;

const balanceActual =
  Number(datos.usuario.balance) || 0;


if (gastosTransacciones) {

  gastosTransacciones.textContent =
    formatoColonesTransaccion(
      totalGastos
    );

}


if (balanceTransacciones) {

  balanceTransacciones.textContent =
    formatoColonesTransaccion(
      balanceActual
    );

}


if (ingresosTransacciones) {

  ingresosTransacciones.textContent =
    formatoColonesTransaccion(
      totalIngresos
    );

}


// =====================================================
// PORCENTAJE UTILIZADO
// =====================================================

let porcentaje =
  0;


if (totalIngresos > 0) {

  porcentaje =
    (
      totalGastos /
      totalIngresos
    ) * 100;

}


porcentaje =
  Math.min(
    porcentaje,
    100
  );


if (porcentajeUsoTransacciones) {

  porcentajeUsoTransacciones.textContent =
    porcentaje.toFixed(1) + "%";

}


if (barraUsoTransacciones) {

  barraUsoTransacciones.style.width =
    porcentaje + "%";

}


        // Limpiar datos escritos en HTML
        tablaTransacciones.innerHTML =
          "";


        // =================================================
        // SIN TRANSACCIONES
        // =================================================

        if (
          !datos.transacciones ||
          datos.transacciones.length === 0
        ) {

          tablaTransacciones.innerHTML = `

            <tr>

              <td colspan="4">

                <div class="alert alert-info">

                  No tienes transacciones registradas.

                </div>

              </td>

            </tr>

          `;

          return;

        }


        // =================================================
        // MOSTRAR TRANSACCIONES
        // =================================================

        datos.transacciones.forEach(
          function (transaccion) {

            const tipoFiltro =
              obtenerTipoFiltro(
                transaccion.tipo
              );


            const esIngreso =
              tipoFiltro === "ingreso";


            const signo =
              esIngreso
                ? "+"
                : "-";


            const claseMonto =
              esIngreso
                ? "text-green"
                : "text-red";


            const claseIcono =
              esIngreso
                ? "ic-green"
                : "ic-red";


            const icono =
              esIngreso
                ? "icon-arrow-down-left"
                : "icon-cart";


            const comercio =
              transaccion.comercio_persona ||
              transaccion.descripcion ||
              "Movimiento";


            const descripcion =
              transaccion.descripcion ||
              "Transacción";


            const metodo =
              obtenerMetodo(
                transaccion
              );


            const metodoFiltro =
              obtenerMetodoFiltro(
                transaccion
              );


            const fila =
              document.createElement(
                "tr"
              );


            // Para filtros
            fila.dataset.tipo =
              tipoFiltro;

            fila.dataset.metodo =
              metodoFiltro;


            // =================================================
            // TU TABLA TIENE 4 COLUMNAS
            // =================================================

            fila.innerHTML = `

              <td>

                <div class="transaction-main">

                  <div
                    class="transaction-merchant-icon ${claseIcono}"
                  >

                    <svg class="icon">

                      <use
                        href="assets/icons.svg#${icono}">
                      </use>

                    </svg>

                  </div>


                  <div>

                    <strong>
                      ${comercio}
                    </strong>

                    <span>
                      ${descripcion}
                    </span>

                  </div>

                </div>

              </td>


              <td>

                ${formatoFechaTransaccion(
                  transaccion.fecha
                )}

              </td>


              <td>

                ${metodo}

              </td>


              <td
                class="${claseMonto} fw-700 num"
                style="text-align:right;"
              >

                ${signo}${formatoColonesTransaccion(
                  transaccion.monto
                )}

              </td>

            `;


            tablaTransacciones.appendChild(
              fila
            );

          }
        );


        // =================================================
        // VOLVER A APLICAR FILTROS
        // =================================================

        if (
          typeof filtrarTransacciones ===
          "function"
        ) {

          filtrarTransacciones();

        }


      } catch (error) {

        console.error(
          "Error cargando transacciones:",
          error
        );

      }

    }


    // =====================================================
    // EJECUTAR
    // =====================================================

    cargarTransacciones();

  }

}

// =====================================================
// FILTROS DE TRANSACCIONES
// =====================================================

const filtrosTransaccion =
    document.querySelectorAll(
      ".transaction-filter"
    );

const filtroMetodo =
    document.getElementById(
      "filtroMetodo"
    );

const buscarTransaccion =
    document.getElementById(
      "buscarTransaccion"
    );

// =====================================================
// BOTONES TODOS / INGRESOS / GASTOS
// =====================================================
function normalizarTexto(texto) {

    return texto
        .toLowerCase()

        // Separar letras de sus tildes
        .normalize("NFD")

        // Quitar tildes y marcas
        .replace(/[\u0300-\u036f]/g, "")

        // Convertir ñ en n
        .replace(/ñ/g, "n");
}
filtrosTransaccion.forEach(
    function (boton) {

        boton.addEventListener(
            "click",
            function () {

                // Quitar activo de todos
                filtrosTransaccion.forEach(
                    function (otroBoton) {

                        otroBoton.classList.remove(
                            "active"
                        );

                    }
                );


                // Activar botón seleccionado
                boton.classList.add(
                    "active"
                );


                // Filtrar tabla
                filtrarTransacciones();

            }
        );

    }
);



// =====================================================
// FILTRO POR MÉTODO
// =====================================================

if (filtroMetodo) {

    filtroMetodo.addEventListener(
        "change",
        filtrarTransacciones
    );

}



// =====================================================
// BUSCADOR
// =====================================================

if (buscarTransaccion) {

    buscarTransaccion.addEventListener(
        "input",
        filtrarTransacciones
    );

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
// =====================================================
// DEUDAS CONECTADAS A MYSQL
// =====================================================

document.addEventListener(
  "DOMContentLoaded",
  function () {

    const listaDeudas =
      document.getElementById(
        "listaDeudas"
      );


    if (!listaDeudas) {
      return;
    }


    // =====================================================
    // USUARIO
    // =====================================================

    const usuarioGuardadoDeudas =
      sessionStorage.getItem(
        "fintrackUsuarioActual"
      );


    if (!usuarioGuardadoDeudas) {
      return;
    }


    const usuarioDeudas =
      JSON.parse(
        usuarioGuardadoDeudas
      );


    // =====================================================
    // ELEMENTOS
    // =====================================================

    const btnNuevaDeuda =
      document.getElementById(
        "btnNuevaDeuda"
      );

    const btnRegistrarPago =
      document.getElementById(
        "btnRegistrarPago"
      );


    const totalDeudasPendientes =
      document.getElementById(
        "totalDeudasPendientes"
      );

    const cantidadDeudasActivas =
      document.getElementById(
        "cantidadDeudasActivas"
      );

    const proximoPagoMonto =
      document.getElementById(
        "proximoPagoMonto"
      );

    const proximoPagoEntidad =
      document.getElementById(
        "proximoPagoEntidad"
      );

    const proximoPagoFecha =
      document.getElementById(
        "proximoPagoFecha"
      );


    const seleccionarDeudaPago =
      document.getElementById(
        "seleccionarDeudaPago"
      );


    // =====================================================
    // FORMATO MONEDA
    // =====================================================

    function monedaDeuda(valor) {

      return (
        "₡ " +
        (Number(valor) || 0)
          .toLocaleString(
            "es-CR",
            {
              maximumFractionDigits: 0
            }
          )
      );

    }


    // =====================================================
    // FORMATO FECHA
    // =====================================================

    function fechaDeuda(fecha) {

      if (!fecha) {
        return "—";
      }


      const partes =
        fecha.split("-");


      const fechaLocal =
        new Date(
          Number(partes[0]),
          Number(partes[1]) - 1,
          Number(partes[2])
        );


      return fechaLocal.toLocaleDateString(
        "es-CR",
        {
          day: "numeric",
          month: "short",
          year: "numeric"
        }
      );

    }


    // =====================================================
    // ABRIR MODAL
    // =====================================================

    function abrirModalDeuda(id) {

      const modal =
        document.getElementById(id);


      if (modal) {

        modal.classList.add(
          "abierto"
        );

      }

    }


    // =====================================================
    // CERRAR MODAL
    // =====================================================

    function cerrarModalDeuda(id) {

      const modal =
        document.getElementById(id);


      if (modal) {

        modal.classList.remove(
          "abierto"
        );

      }

    }


    // =====================================================
    // BOTONES ABRIR
    // =====================================================

    if (btnNuevaDeuda) {

      btnNuevaDeuda.addEventListener(
        "click",
        function () {

          abrirModalDeuda(
            "modalNuevaDeuda"
          );

        }
      );

    }


    if (btnRegistrarPago) {

      btnRegistrarPago.addEventListener(
        "click",
        function () {

          abrirModalDeuda(
            "modalRegistrarPago"
          );

        }
      );

    }


    // =====================================================
    // BOTONES CERRAR
    // =====================================================

    document
      .querySelectorAll(
        "[data-cerrar-modal]"
      )
      .forEach(
        function (boton) {

          boton.addEventListener(
            "click",
            function () {

              cerrarModalDeuda(
                boton.dataset.cerrarModal
              );

            }
          );

        }
      );


    // =====================================================
    // CARGAR DEUDAS
    // =====================================================

    async function cargarDeudas() {

      try {

        const respuesta =
          await fetch(
            "backend/deudas.php?usuario_id=" +
            encodeURIComponent(
              usuarioDeudas.id
            )
          );


        const datos =
          await respuesta.json();


        if (!datos.ok) {

          console.error(
            datos.mensaje
          );

          return;

        }


        // =================================================
        // RESUMEN
        // =================================================

        if (totalDeudasPendientes) {

          totalDeudasPendientes.textContent =
            monedaDeuda(
              datos.totalPendiente
            );

        }


        if (cantidadDeudasActivas) {

          cantidadDeudasActivas.textContent =
            datos.cantidadActivas;

        }


        if (datos.proximoPago) {

          if (proximoPagoMonto) {

            proximoPagoMonto.textContent =
              monedaDeuda(
                datos.proximoPago.cuota
              );

          }


          if (proximoPagoEntidad) {

            proximoPagoEntidad.textContent =
              datos.proximoPago.nombre;

          }


          if (proximoPagoFecha) {

            proximoPagoFecha.textContent =
              fechaDeuda(
                datos.proximoPago.fecha
              );

          }

        } else {

          if (proximoPagoMonto) {
            proximoPagoMonto.textContent =
              "₡ 0";
          }

          if (proximoPagoEntidad) {
            proximoPagoEntidad.textContent =
              "Sin pagos";
          }

          if (proximoPagoFecha) {
            proximoPagoFecha.textContent =
              "—";
          }

        }


        // =================================================
        // LIMPIAR LISTA
        // =================================================

        listaDeudas.innerHTML = "";


        if (
          !datos.deudas ||
          datos.deudas.length === 0
        ) {

          listaDeudas.innerHTML = `

            <div class="alert alert-info">

              No tienes deudas activas.

            </div>

          `;

        } else {

          datos.deudas.forEach(
            function (deuda) {

              const pendiente =
                Math.max(
                  0,
                  Number(
                    deuda.monto_total
                  ) -
                  Number(
                    deuda.monto_pagado
                  )
                );


              const tarjeta =
                document.createElement(
                  "div"
                );


              tarjeta.className =
                "debt-card";


              tarjeta.innerHTML = `

                <div class="debt-card-header">

                  <div class="debt-card-title">

                    <div class="debt-icon">

                      <svg class="icon">

                        <use
                          href="assets/icons.svg#icon-credit-card">
                        </use>

                      </svg>

                    </div>


                    <div>

                      <strong>
                        ${deuda.nombre}
                      </strong>

                      <span>
                        ${deuda.descripcion}
                      </span>

                    </div>

                  </div>

                </div>


                <div class="debt-data">

                  <div class="debt-data-item">

                    <span>
                      Saldo pendiente
                    </span>

                    <strong class="num">

                      ${monedaDeuda(
                        pendiente
                      )}

                    </strong>

                  </div>


                  <div class="debt-data-item">

                    <span>
                      Próxima cuota
                    </span>

                    <strong class="num">

                      ${monedaDeuda(
                        deuda.cuota
                      )}

                    </strong>

                  </div>


                  <div class="debt-data-item">

                    <span>
                      Próximo vencimiento
                    </span>

                    <strong>

                      ${fechaDeuda(
                        deuda.proximo_pago
                      )}

                    </strong>

                  </div>

                </div>


                <div class="debt-footer">

                  <div
                    class="debt-installments"
                  >

                    Pendiente:
                    ${monedaDeuda(
                      pendiente
                    )}

                  </div>


                  <button
                    type="button"
                    class="btn btn-ghost btn-sm"
                    data-detalle-id="${deuda.id}"
                  >

                    Ver detalle

                  </button>

                </div>

              `;


              listaDeudas.appendChild(
                tarjeta
              );


              const botonDetalle =
                tarjeta.querySelector(
                  "[data-detalle-id]"
                );


              if (botonDetalle) {

                botonDetalle.addEventListener(
                  "click",
                  function () {

                    const titulo =
                      document.getElementById(
                        "detalleDeudaTitulo"
                      );

                    const descripcion =
                      document.getElementById(
                        "detalleDeudaDescripcion"
                      );

                    const saldo =
                      document.getElementById(
                        "detalleSaldo"
                      );

                    const cuota =
                      document.getElementById(
                        "detalleCuota"
                      );

                    const fecha =
                      document.getElementById(
                        "detalleFecha"
                      );

                    const cuotas =
                      document.getElementById(
                        "detalleCuotas"
                      );


                    if (titulo) {
                      titulo.textContent =
                        deuda.nombre;
                    }


                    if (descripcion) {
                      descripcion.textContent =
                        deuda.descripcion;
                    }


                    if (saldo) {
                      saldo.textContent =
                        monedaDeuda(
                          pendiente
                        );
                    }


                    if (cuota) {
                      cuota.textContent =
                        monedaDeuda(
                          deuda.cuota
                        );
                    }


                    if (fecha) {
                      fecha.textContent =
                        fechaDeuda(
                          deuda.proximo_pago
                        );
                    }


                    if (cuotas) {
                      cuotas.textContent =
                        monedaDeuda(
                          deuda.monto_pagado
                        ) +
                        " pagado";
                    }


                    abrirModalDeuda(
                      "modalDetalleDeuda"
                    );

                  }
                );

              }

            }
          );

        }


        // =================================================
        // SELECT PARA PAGAR
        // =================================================

        if (seleccionarDeudaPago) {

          seleccionarDeudaPago.innerHTML =
            `
              <option value="">
                Selecciona una deuda
              </option>
            `;


          datos.deudas.forEach(
            function (deuda) {

              const pendiente =
                Math.max(
                  0,
                  Number(
                    deuda.monto_total
                  ) -
                  Number(
                    deuda.monto_pagado
                  )
                );


              const opcion =
                document.createElement(
                  "option"
                );


              opcion.value =
                deuda.id;


              opcion.textContent =
                deuda.nombre +
                " — " +
                monedaDeuda(
                  pendiente
                );


              seleccionarDeudaPago.appendChild(
                opcion
              );

            }
          );

        }


      } catch (error) {

        console.error(
          "Error cargando deudas:",
          error
        );

      }

    }


    // =====================================================
    // GUARDAR NUEVA DEUDA
    // =====================================================

    const formNuevaDeuda =
      document.getElementById(
        "formNuevaDeuda"
      );


    if (formNuevaDeuda) {

      formNuevaDeuda.addEventListener(
        "submit",
        async function (event) {

          event.preventDefault();


          const nombre =
            document
              .getElementById(
                "deudaNombre"
              )
              .value
              .trim();


          const descripcion =
            document
              .getElementById(
                "deudaDescripcion"
              )
              .value
              .trim();


          const monto =
            Number(
              document.getElementById(
                "deudaMonto"
              ).value
            );


          const cuota =
            Number(
              document.getElementById(
                "deudaCuota"
              ).value
            );


          const fecha =
            document.getElementById(
              "deudaProximoPago"
            ).value;


          try {

            const respuesta =
              await fetch(
                "backend/guardar_deuda.php",
                {
                  method: "POST",

                  headers: {
                    "Content-Type":
                      "application/json"
                  },

                  body:
                    JSON.stringify({
                      usuario_id:
                        usuarioDeudas.id,

                      nombre:
                        nombre,

                      descripcion:
                        descripcion,

                      monto_total:
                        monto,

                      cuota:
                        cuota,

                      proximo_pago:
                        fecha
                    })
                }
              );


            const datos =
              await respuesta.json();


            if (!datos.ok) {

              alert(
                datos.mensaje
              );

              return;

            }


            alert(
              "Deuda creada correctamente."
            );


            formNuevaDeuda.reset();


            cerrarModalDeuda(
              "modalNuevaDeuda"
            );


            cargarDeudas();


          } catch (error) {

            console.error(
              error
            );

            alert(
              "No se pudo guardar la deuda."
            );

          }

        }
      );

    }

// =====================================================
// REGISTRAR PAGO DE DEUDA
// =====================================================

const formRegistrarPago =
  document.getElementById(
    "formRegistrarPago"
  );


if (formRegistrarPago) {

  formRegistrarPago.addEventListener(
    "submit",
    async function (event) {

      event.preventDefault();


      const deudaId =
        Number(
          document.getElementById(
            "seleccionarDeudaPago"
          ).value
        );


      const monto =
        Number(
          document.getElementById(
            "montoPago"
          ).value
        );


      if (
        deudaId <= 0 ||
        monto <= 0
      ) {

        alert(
          "Seleccione una deuda e ingrese un monto válido."
        );

        return;

      }


      try {

        const respuesta =
          await fetch(
            "backend/registrar_pago_deuda.php",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json"
              },

              body:
                JSON.stringify({
                  usuario_id:
                    usuarioDeudas.id,

                  deuda_id:
                    deudaId,

                  monto:
                    monto
                })
            }
          );


        const datos =
          await respuesta.json();


        if (!datos.ok) {

          alert(
            datos.mensaje
          );

          return;

        }


        alert(
          "Pago registrado correctamente."
        );


        formRegistrarPago.reset();


        cerrarModalDeuda(
          "modalRegistrarPago"
        );


        // Actualizar lista inmediatamente
        cargarDeudas();


        // Actualizar sesión para que
        // Dashboard tenga los nuevos valores
        try {

          const respuestaDashboard =
            await fetch(
              "backend/dashboard.php?usuario_id=" +
              encodeURIComponent(
                usuarioDeudas.id
              )
            );


          const datosDashboard =
            await respuestaDashboard.json();


          if (
            datosDashboard.ok &&
            datosDashboard.usuario
          ) {

            const usuarioSesion =
              JSON.parse(
                sessionStorage.getItem(
                  "fintrackUsuarioActual"
                )
              );


            const actualizado = {
              ...usuarioSesion,
              ...datosDashboard.usuario
            };


            sessionStorage.setItem(
              "fintrackUsuarioActual",
              JSON.stringify(
                actualizado
              )
            );

          }

        } catch (error) {

          console.error(
            "No se pudo actualizar la sesión:",
            error
          );

        }


      } catch (error) {

        console.error(
          "Error registrando pago:",
          error
        );


        alert(
          "No se pudo registrar el pago."
        );

      }

    }
  );

}
    // =====================================================
    // INICIAR
    // =====================================================

    cargarDeudas();

  }
);
// =====================================================
// PERFIL - BOTONES FUNCIONALES
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

  // =====================================================
  // USUARIO ACTUAL
  // =====================================================

  const usuarioGuardado =
    sessionStorage.getItem("fintrackUsuarioActual");

  if (!usuarioGuardado) {
    return;
  }

  let usuario = JSON.parse(usuarioGuardado);


  // =====================================================
  // ELEMENTOS DEL PERFIL
  // =====================================================

  const perfilNombre =
    document.getElementById("perfilNombre");

  const perfilUsuario =
    document.getElementById("perfilUsuario");

  const nombreUsuario =
    document.getElementById("nombreUsuario");

  const correoUsuario =
    document.getElementById("correoUsuario");

  const avatarUsuario =
    document.getElementById("avatarUsuario");

  const perfilAvatar =
    document.getElementById("perfilAvatar");


  const inputNombre =
    document.getElementById("perfilNombreInput");

  const inputUsuario =
    document.getElementById("perfilUsuarioInput");

  const inputCorreo =
    document.getElementById("perfilCorreoInput");

  const inputTelefono =
    document.getElementById("perfilTelefono");

  const inputPais =
    document.getElementById("perfilPais");

  const inputZona =
    document.getElementById("perfilZonaHoraria");

  const inputMoneda =
    document.getElementById("perfilMoneda");

  const inputFecha =
    document.getElementById("perfilFechaNacimiento");


  // =====================================================
  // MOSTRAR DATOS
  // =====================================================

  function mostrarDatosPerfil() {

    const nombreCompleto =
      `${usuario.nombre || ""} ${usuario.apellidos || ""}`
        .trim();

    const nombreUsuarioFormateado =
      usuario.usuario
        ? "@" + usuario.usuario.replace(/^@/, "")
        : "@usuario";


    if (perfilNombre) {
      perfilNombre.textContent =
        nombreCompleto || "Usuario";
    }

    if (perfilUsuario) {
      perfilUsuario.textContent =
        nombreUsuarioFormateado;
    }

    if (nombreUsuario) {
      nombreUsuario.textContent =
        nombreCompleto || "Usuario";
    }

    if (correoUsuario) {
      correoUsuario.textContent =
        nombreUsuarioFormateado;
    }


    if (inputNombre) {
      inputNombre.value =
        nombreCompleto;
    }

    if (inputUsuario) {
      inputUsuario.value =
        nombreUsuarioFormateado;
    }

    if (inputCorreo) {
      inputCorreo.value =
        usuario.correo || "";
    }

    if (inputTelefono) {
      inputTelefono.value =
        usuario.telefono || "";
    }

    if (inputPais && usuario.pais) {
      inputPais.value =
        usuario.pais;
    }

    if (inputZona && usuario.zonaHoraria) {
      inputZona.value =
        usuario.zonaHoraria;
    }

    if (inputMoneda && usuario.moneda) {
      inputMoneda.value =
        usuario.moneda;
    }

    if (inputFecha) {
      inputFecha.value =
        usuario.fechaNacimiento || "";
    }


    // INICIALES

    const partes =
      nombreCompleto
        .split(/\s+/)
        .filter(Boolean);

    let iniciales = "US";

    if (partes.length === 1) {
      iniciales =
        partes[0][0].toUpperCase();
    }

    if (partes.length >= 2) {
      iniciales =
        (
          partes[0][0] +
          partes[partes.length - 1][0]
        ).toUpperCase();
    }


    if (avatarUsuario) {
      avatarUsuario.textContent =
        iniciales;
    }

    if (perfilAvatar) {
      perfilAvatar.textContent =
        iniciales;
    }

  }


  mostrarDatosPerfil();


  // =====================================================
// ACTUALIZAR PERFIL
// =====================================================

const formPerfil =
  document.getElementById("formPerfil");


if (formPerfil) {

  formPerfil.addEventListener(
    "submit",
    async function (event) {

      event.preventDefault();


      // =================================================
      // OBTENER DATOS DEL FORMULARIO
      // =================================================

      const nombreCompleto =
        inputNombre
          ? inputNombre.value.trim()
          : "";


      let usuarioNuevo =
        inputUsuario
          ? inputUsuario.value.trim()
          : "";


      usuarioNuevo =
        usuarioNuevo
          .replace(/^@/, "")
          .replace(/[^a-zA-Z0-9]/g, "")
          .toLowerCase();


      const correoNuevo =
        inputCorreo
          ? inputCorreo.value
              .trim()
              .toLowerCase()
          : "";


      // =================================================
      // VALIDACIONES
      // =================================================

      if (nombreCompleto === "") {

        alert(
          "Debe ingresar su nombre."
        );

        return;
      }


      if (usuarioNuevo === "") {

        alert(
          "Debe ingresar un nombre de usuario."
        );

        return;
      }


      if (usuarioNuevo.length < 4) {

        alert(
          "El nombre de usuario debe tener mínimo 4 caracteres."
        );

        return;
      }


      if (correoNuevo === "") {

        alert(
          "Debe ingresar su correo electrónico."
        );

        return;
      }


      // =================================================
      // SEPARAR NOMBRE Y APELLIDOS
      // =================================================

      const partesNombre =
        nombreCompleto
          .split(/\s+/)
          .filter(Boolean);


      const nombre =
        partesNombre.shift() || "";


      const apellidos =
        partesNombre.join(" ");


      // =================================================
      // DATOS A ENVIAR A PHP
      // =================================================

      const datosPerfil = {

        id: usuario.id,

        nombre: nombre,

        apellidos: apellidos,

        usuario: usuarioNuevo,

        correo: correoNuevo,

        telefono:
          inputTelefono
            ? inputTelefono.value.trim()
            : "",

        pais:
          inputPais
            ? inputPais.value
            : "CR",

        zonaHoraria:
          inputZona
            ? inputZona.value
            : "(GMT-06:00) América/Costa_Rica",

        moneda:
          inputMoneda
            ? inputMoneda.value
            : "Colón Costarricense (₡)",

        fechaNacimiento:
          inputFecha
            ? inputFecha.value
            : ""

      };


      try {

        // =================================================
        // ENVIAR A MYSQL MEDIANTE PHP
        // =================================================

        const respuesta =
          await fetch(
            "backend/actualizar_perfil.php",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json"
              },

              body:
                JSON.stringify(
                  datosPerfil
                )
            }
          );


        // =================================================
        // COMPROBAR RESPUESTA HTTP
        // =================================================

        if (!respuesta.ok) {

          throw new Error(
            "Error HTTP: " +
            respuesta.status
          );

        }


        const datos =
          await respuesta.json();


        // =================================================
        // PHP DEVOLVIÓ ERROR
        // =================================================

        if (!datos.ok) {

          alert(
            datos.mensaje ||
            "No se pudo actualizar el perfil."
          );

          return;
        }


        // =================================================
        // USUARIO ACTUALIZADO
        // =================================================

        usuario =
          datos.usuario;


        // Guardar versión actualizada en sesión

        sessionStorage.setItem(
          "fintrackUsuarioActual",
          JSON.stringify(usuario)
        );


        // =================================================
        // ACTUALIZAR LA PANTALLA
        // =================================================

        mostrarDatosPerfil();


        // =================================================
        // ACTUALIZAR SIDEBAR
        // =================================================

        const nombreCompletoActualizado =
          `${usuario.nombre || ""} ${usuario.apellidos || ""}`
            .trim();


        const usuarioFormateado =
          usuario.usuario
            ? "@" +
              usuario.usuario.replace(/^@/, "")
            : "@usuario";


        if (nombreUsuario) {

          nombreUsuario.textContent =
            nombreCompletoActualizado ||
            "Usuario";

        }


        if (correoUsuario) {

          correoUsuario.textContent =
            usuarioFormateado;

        }


        // =================================================
        // ACTUALIZAR AVATAR
        // =================================================

        const partesAvatar =
          nombreCompletoActualizado
            .split(/\s+/)
            .filter(Boolean);


        let iniciales =
          "US";


        if (partesAvatar.length === 1) {

          iniciales =
            partesAvatar[0][0]
              .toUpperCase();

        }


        if (partesAvatar.length >= 2) {

          iniciales =
            (
              partesAvatar[0][0] +
              partesAvatar[
                partesAvatar.length - 1
              ][0]
            ).toUpperCase();

        }


        if (avatarUsuario) {

          avatarUsuario.textContent =
            iniciales;

        }


        if (perfilAvatar) {

          // Solo mostrar iniciales si no hay foto
          if (
            !fotoPerfil ||
            !fotoPerfil.src ||
            fotoPerfil.style.display === "none"
          ) {

            perfilAvatar.textContent =
              iniciales;

          }

        }


        alert(
          "Perfil actualizado correctamente."
        );

      } catch (error) {

        console.error(
          "Error actualizando perfil:",
          error
        );


        alert(
          "No se pudo conectar con el servidor para actualizar el perfil."
        );

      }

    }
  );

}
  // =====================================================
  // EDITAR FOTO
  // =====================================================

  const inputFoto =
    document.getElementById(
      "inputFotoPerfil"
    );

  const fotoPerfil =
    document.getElementById(
      "fotoPerfil"
    );


  const identificador =
    usuario.id ||
    usuario.usuario ||
    usuario.correo ||
    "usuario";


  const claveFoto =
    "fintrackFotoPerfil_" +
    identificador;


  const fotoGuardada =
    localStorage.getItem(claveFoto);


  if (
    fotoGuardada &&
    fotoPerfil
  ) {

    fotoPerfil.src =
      fotoGuardada;

    fotoPerfil.style.display =
      "block";

    if (perfilAvatar) {
      perfilAvatar.style.display =
        "none";
    }

  }


  if (
    inputFoto &&
    fotoPerfil
  ) {

    inputFoto.addEventListener(
      "change",
      function () {

        const archivo =
          inputFoto.files[0];

        if (!archivo) {
          return;
        }


        if (
          !archivo.type.startsWith("image/")
        ) {

          alert(
            "Seleccione una imagen válida."
          );

          return;
        }


        const lector =
          new FileReader();


        lector.onload =
          function (event) {

            const imagen =
              event.target.result;

            fotoPerfil.src =
              imagen;

            fotoPerfil.style.display =
              "block";

            if (perfilAvatar) {
              perfilAvatar.style.display =
                "none";
            }

            localStorage.setItem(
              claveFoto,
              imagen
            );

          };


        lector.readAsDataURL(
          archivo
        );

      }
    );

  }

});

// =====================================================
// PERFIL - MEDIOS VINCULADOS
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

  // =====================================================
  // USUARIO ACTUAL
  // =====================================================

  const usuarioGuardado =
    sessionStorage.getItem("fintrackUsuarioActual");

  if (!usuarioGuardado) {
    return;
  }

  const usuarioActual =
    JSON.parse(usuarioGuardado);


  const identificadorUsuario =
    usuarioActual.id ||
    usuarioActual.usuario ||
    usuarioActual.correo ||
    "usuario";


  // Elias solamente tendrá medios de demostración
  const esElias =
    usuarioActual.correo ===
    "erodriguez60177@ufide.ac.cr";


  // =====================================================
  // ELEMENTOS HTML
  // =====================================================

  const btnVincularMedio =
    document.getElementById("btnVincularMedio");

  const modalMedio =
    document.getElementById("modalMedioPago");

  const cerrarModalMedio =
    document.getElementById("cerrarModalMedio");

  const cancelarMedio =
    document.getElementById("cancelarMedio");

  const formMedio =
    document.getElementById("formMedioPago");

  const tituloModal =
    document.getElementById("tituloModalMedio");

  const listaMedios =
    document.getElementById("listaMediosVinculados");


  // INPUTS

  const inputId =
    document.getElementById("medioId");

  const inputTipo =
    document.getElementById("medioTipo");

  const inputBanco =
    document.getElementById("medioBanco");

  const inputNombre =
    document.getElementById("medioNombre");

  const inputNumeroTarjeta =
    document.getElementById("medioNumeroTarjeta");

  const inputVencimiento =
    document.getElementById("medioVencimiento");

  const inputTitular =
    document.getElementById("medioTitular");

  const inputNumeroCuenta =
    document.getElementById("medioNumeroCuenta");

  const inputPrincipal =
    document.getElementById("medioPrincipal");


  // GRUPOS

  const grupoNumeroTarjeta =
    document.getElementById("grupoNumeroTarjeta");

  const datosTarjeta =
    document.getElementById("datosTarjeta");

  const grupoNumeroCuenta =
    document.getElementById("grupoNumeroCuenta");


  if (!listaMedios) {
    return;
  }


  // =====================================================
  // DATOS DE EJEMPLO PARA ELIAS
  // =====================================================

  const mediosElias = [

    {
      id: 1,
      tipo: "Cuenta bancaria",
      banco: "BAC Credomatic",
      nombre: "Cuenta BAC",
      numeroCuenta: "CR000000000000002045",
      ultimos4: "2045",
      titular: "Elias Rodriguez",
      vencimiento: "",
      principal: true
    },

    {
      id: 2,
      tipo: "Tarjeta de débito",
      banco: "BAC Credomatic",
      nombre: "Visa",
      numeroTarjeta: "",
      ultimos4: "4821",
      titular: "Elias Rodriguez",
      vencimiento: "08/29",
      principal: false
    },

    {
      id: 3,
      tipo: "Tarjeta de crédito",
      banco: "BAC Credomatic",
      nombre: "Mastercard",
      numeroTarjeta: "",
      ultimos4: "7314",
      titular: "Elias Rodriguez",
      vencimiento: "11/28",
      principal: false
    }

  ];


  // =====================================================
  // CARGAR MEDIOS DEL USUARIO
  // =====================================================

  const claveMedios =
    "fintrackMedios_" +
    identificadorUsuario;


  let medios =
    JSON.parse(
      localStorage.getItem(claveMedios)
    );


  if (!medios) {

    if (esElias) {

      medios =
        JSON.parse(
          JSON.stringify(mediosElias)
        );

    } else {

      medios = [];

    }


    guardarMedios();

  }


  // =====================================================
  // GUARDAR EN LOCALSTORAGE
  // =====================================================

  function guardarMedios() {

    localStorage.setItem(
      claveMedios,
      JSON.stringify(medios)
    );

  }


  // =====================================================
  // ABRIR MODAL
  // =====================================================

  function abrirModal() {

    if (!modalMedio) {
      return;
    }

    modalMedio.classList.add("abierto");

  }


  // =====================================================
  // CERRAR MODAL
  // =====================================================

  function cerrarModal() {

    if (!modalMedio) {
      return;
    }

    modalMedio.classList.remove("abierto");

  }


  // =====================================================
  // LIMPIAR FORMULARIO
  // =====================================================

  function limpiarFormulario() {

    if (!formMedio) {
      return;
    }

    formMedio.reset();

    inputId.value = "";

    inputPrincipal.value = "no";

    actualizarCamposPorTipo();

  }


  // =====================================================
  // MOSTRAR CAMPOS SEGÚN TIPO
  // =====================================================

  function actualizarCamposPorTipo() {

    const tipo =
      inputTipo.value;


    const esCuenta =
      tipo === "Cuenta bancaria";


    const esTarjeta =
      tipo === "Tarjeta de débito" ||
      tipo === "Tarjeta de crédito";


    // CUENTA

    if (grupoNumeroCuenta) {

      grupoNumeroCuenta.style.display =
        esCuenta ? "block" : "none";

    }


    // TARJETA

    if (grupoNumeroTarjeta) {

      grupoNumeroTarjeta.style.display =
        esTarjeta ? "block" : "none";

    }


    if (datosTarjeta) {

      datosTarjeta.style.display =
        esTarjeta ? "grid" : "none";

    }


    // REQUIRED DINÁMICO

    if (inputNumeroCuenta) {

      inputNumeroCuenta.required =
        esCuenta;

    }


    if (inputNumeroTarjeta) {

      inputNumeroTarjeta.required =
        esTarjeta;

    }


    if (inputVencimiento) {

      inputVencimiento.required =
        esTarjeta;

    }


    if (inputTitular) {

      inputTitular.required =
        esTarjeta || esCuenta;

    }

  }


  if (inputTipo) {

    inputTipo.addEventListener(
      "change",
      actualizarCamposPorTipo
    );

  }


  // =====================================================
  // FORMATEAR NÚMERO DE TARJETA
  // =====================================================

  if (inputNumeroTarjeta) {

    inputNumeroTarjeta.addEventListener(
      "input",
      function () {

        let valor =
          this.value.replace(/\D/g, "");


        valor =
          valor.substring(0, 16);


        this.value =
          valor
            .replace(
              /(.{4})/g,
              "$1 "
            )
            .trim();

      }
    );

  }


  // =====================================================
  // FORMATEAR VENCIMIENTO
  // =====================================================

  if (inputVencimiento) {

    inputVencimiento.addEventListener(
      "input",
      function () {

        let valor =
          this.value.replace(/\D/g, "");


        valor =
          valor.substring(0, 4);


        if (valor.length >= 3) {

          valor =
            valor.substring(0, 2) +
            "/" +
            valor.substring(2);

        }


        this.value = valor;

      }
    );

  }


 // =====================================================
// MOSTRAR MEDIOS
// =====================================================

function mostrarMedios() {

  listaMedios.innerHTML = "";


  // =================================================
  // SIN MEDIOS
  // =================================================

  if (medios.length === 0) {

    listaMedios.innerHTML = `

      <div class="linked-accounts-empty">

        <div class="linked-account-empty-icon">

          <svg class="icon">
            <use href="assets/icons.svg#icon-credit-card"></use>
          </svg>

        </div>

        <strong>
          Aún no tienes medios vinculados
        </strong>

        <span>
          Vincula una cuenta bancaria o tarjeta para comenzar.
        </span>

      </div>

    `;

    return;
  }


  // =================================================
  // CREAR TARJETAS
  // =================================================

  medios.forEach(function (medio) {

    const tarjeta =
      document.createElement("div");


    tarjeta.className =
      "linked-account-card";


    tarjeta.innerHTML = `

      <div class="linked-account-top">

        <div class="linked-account-icon">

          <svg class="icon">
            <use href="assets/icons.svg#icon-credit-card"></use>
          </svg>

        </div>


        ${
          medio.principal
            ? `
                <span class="badge badge-teal">
                  Principal
                </span>
              `
            : ""
        }

      </div>


      <strong>
        ${medio.nombre}
      </strong>


      <span class="linked-account-type">
        ${medio.banco} · ${medio.tipo}
      </span>


      <div class="linked-account-number">
        •••• ${medio.ultimos4}
      </div>


      ${
        medio.vencimiento
          ? `
              <span class="linked-account-expiration">
                Vence ${medio.vencimiento}
              </span>
            `
          : ""
      }


      <div class="linked-account-actions">

        <button
          type="button"
          class="btn btn-ghost btn-sm btn-editar-medio"
          data-medio-id="${medio.id}"
        >
          Editar
        </button>


        <button
          type="button"
          class="btn btn-ghost btn-sm btn-eliminar-medio"
          data-medio-id="${medio.id}"
        >
          Eliminar
        </button>

      </div>

    `;


    listaMedios.appendChild(
      tarjeta
    );

  });

}


// =====================================================
// VINCULAR NUEVO MEDIO
// =====================================================

if (btnVincularMedio) {

  btnVincularMedio.addEventListener(
    "click",
    function () {

      limpiarFormulario();


      if (tituloModal) {

        tituloModal.textContent =
          "Vincular medio";

      }


      abrirModal();

    }
  );

}


// =====================================================
// EDITAR O ELIMINAR MEDIO
// =====================================================

listaMedios.addEventListener(
  "click",
  function (event) {


    // =================================================
    // EDITAR
    // =================================================

    const botonEditar =
      event.target.closest(
        ".btn-editar-medio"
      );


    if (botonEditar) {

      const id =
        Number(
          botonEditar.dataset.medioId
        );


      const medio =
        medios.find(
          function (item) {

            return item.id === id;

          }
        );


      if (!medio) {
        return;
      }


      limpiarFormulario();


      inputId.value =
        medio.id;


      inputTipo.value =
        medio.tipo;


      inputBanco.value =
        medio.banco;


      inputNombre.value =
        medio.nombre;


      inputPrincipal.value =
        medio.principal
          ? "si"
          : "no";


      if (inputTitular) {

        inputTitular.value =
          medio.titular || "";

      }


      // ===============================================
      // CUENTA BANCARIA
      // ===============================================

      if (
        medio.tipo ===
        "Cuenta bancaria"
      ) {

        if (inputNumeroCuenta) {

          inputNumeroCuenta.value =
            medio.numeroCuenta || "";

        }

      }


      // ===============================================
      // TARJETA
      // ===============================================

      else {

        if (inputNumeroTarjeta) {

          inputNumeroTarjeta.value =
            medio.ultimos4
              ? "•••• •••• •••• " +
                medio.ultimos4
              : "";

        }


        if (inputVencimiento) {

          inputVencimiento.value =
            medio.vencimiento || "";

        }

      }


      actualizarCamposPorTipo();


      if (tituloModal) {

        tituloModal.textContent =
          "Editar medio";

      }


      abrirModal();

      return;
    }



    // =================================================
    // ELIMINAR
    // =================================================

    const botonEliminar =
      event.target.closest(
        ".btn-eliminar-medio"
      );


    if (botonEliminar) {

      const id =
        Number(
          botonEliminar.dataset.medioId
        );


      const medio =
        medios.find(
          function (item) {

            return item.id === id;

          }
        );


      if (!medio) {
        return;
      }


      const confirmar =
        confirm(
          `¿Deseas eliminar ${medio.nombre} •••• ${medio.ultimos4}?`
        );


      if (!confirmar) {
        return;
      }


      const eraPrincipal =
        medio.principal;


      medios =
        medios.filter(
          function (item) {

            return item.id !== id;

          }
        );


      // Si se eliminó el principal
      // y todavía quedan medios,
      // el primero pasa a ser principal

      if (
        eraPrincipal &&
        medios.length > 0
      ) {

        medios[0].principal =
          true;

      }


      guardarMedios();

      mostrarMedios();

    }

  }
);


// =====================================================
// VALIDAR VENCIMIENTO
// =====================================================

function vencimientoValido(valor) {

  if (
    !/^\d{2}\/\d{2}$/.test(valor)
  ) {

    return false;

  }


  const partes =
    valor.split("/");


  const mes =
    Number(partes[0]);


  return (
    mes >= 1 &&
    mes <= 12
  );

}

  // =====================================================
  // GUARDAR MEDIO
  // =====================================================

  if (formMedio) {

    formMedio.addEventListener(
      "submit",
      function (event) {

        event.preventDefault();


        const tipo =
          inputTipo.value;


        const banco =
          inputBanco.value.trim();


        const nombre =
          inputNombre.value.trim();


        const principal =
          inputPrincipal.value ===
          "si";


        if (
          !tipo ||
          !banco ||
          !nombre
        ) {

          alert(
            "Complete todos los campos obligatorios."
          );

          return;

        }


        // =================================================
        // DATOS GENERALES
        // =================================================

        let ultimos4 = "";

        let numeroCuenta = "";

        let titular =
          inputTitular
            ? inputTitular.value.trim()
            : "";

        let vencimiento = "";


        // =================================================
        // CUENTA BANCARIA
        // =================================================

        if (
          tipo === "Cuenta bancaria"
        ) {

          numeroCuenta =
            inputNumeroCuenta.value
              .trim()
              .replace(/\s/g, "");


          if (
            numeroCuenta.length < 4
          ) {

            alert(
              "Ingrese un número de cuenta o IBAN válido."
            );

            return;

          }


          ultimos4 =
            numeroCuenta.slice(-4);

        }


        // =================================================
        // TARJETA
        // =================================================

        else {

          let numeroTarjeta =
            inputNumeroTarjeta.value
              .replace(/\D/g, "");


          /*
          Al editar permitimos que aparezcan
          solamente los últimos 4 existentes.
          */

          const idActual =
            Number(
              inputId.value
            );


          const medioExistente =
            medios.find(
              function (item) {

                return item.id ===
                  idActual;

              }
            );


          if (
            inputId.value &&
            numeroTarjeta.length === 4 &&
            medioExistente
          ) {

            ultimos4 =
              medioExistente.ultimos4;

          } else {

            if (
              numeroTarjeta.length !== 16
            ) {

              alert(
                "La tarjeta debe contener exactamente 16 dígitos."
              );

              return;

            }


            ultimos4 =
              numeroTarjeta.slice(-4);

          }


          vencimiento =
            inputVencimiento.value.trim();


          if (
            !vencimientoValido(
              vencimiento
            )
          ) {

            alert(
              "Ingrese un vencimiento válido en formato MM/AA."
            );

            return;

          }


          if (!titular) {

            alert(
              "Ingrese el nombre del titular."
            );

            return;

          }

        }


        // =================================================
        // SOLO UN MEDIO PRINCIPAL
        // =================================================

        if (principal) {

          medios.forEach(
            function (item) {

              item.principal =
                false;

            }
          );

        }


        // =================================================
        // EDITAR
        // =================================================

        if (inputId.value) {

          const id =
            Number(
              inputId.value
            );


          const medio =
            medios.find(
              function (item) {

                return item.id === id;

              }
            );


          if (medio) {

            medio.tipo =
              tipo;

            medio.banco =
              banco;

            medio.nombre =
              nombre;

            medio.ultimos4 =
              ultimos4;

            medio.numeroCuenta =
              numeroCuenta;

            medio.titular =
              titular;

            medio.vencimiento =
              vencimiento;

            medio.principal =
              principal;

          }

        }


        // =================================================
        // NUEVO
        // =================================================

        else {

          medios.push({

            id: Date.now(),

            tipo: tipo,

            banco: banco,

            nombre: nombre,

            ultimos4: ultimos4,

            numeroCuenta:
              numeroCuenta,

            titular:
              titular,

            vencimiento:
              vencimiento,

            principal:
              principal

          });

        }


        guardarMedios();

        mostrarMedios();

        cerrarModal();

      }
    );

  }


  // =====================================================
  // CERRAR
  // =====================================================

  if (cerrarModalMedio) {

    cerrarModalMedio.addEventListener(
      "click",
      cerrarModal
    );

  }


  if (cancelarMedio) {

    cancelarMedio.addEventListener(
      "click",
      cerrarModal
    );

  }


  // Cerrar tocando el fondo

  if (modalMedio) {

    modalMedio.addEventListener(
      "click",
      function (event) {

        if (
          event.target ===
          modalMedio
        ) {

          cerrarModal();

        }

      }
    );

  }


  // =====================================================
  // INICIAR
  // =====================================================

  actualizarCamposPorTipo();

  mostrarMedios();

});

// =====================================================
// REPORTES CONECTADOS A MYSQL
// =====================================================

document.addEventListener(
  "DOMContentLoaded",
  function () {

    const reportesMain =
      document.querySelector(
        ".reports-main-grid"
      );


    // Si no estamos en reportes.html
    if (!reportesMain) {
      return;
    }


    // =====================================================
    // USUARIO
    // =====================================================

    const usuarioGuardadoReportes =
      sessionStorage.getItem(
        "fintrackUsuarioActual"
      );


    if (!usuarioGuardadoReportes) {
      return;
    }


    const usuarioReportes =
      JSON.parse(
        usuarioGuardadoReportes
      );


    // =====================================================
    // ELEMENTOS
    // =====================================================

    const tarjetasResumen =
      document.querySelectorAll(
        ".stats-grid-3 .stat-card .val"
      );


    const graficoHistorico =
      document.querySelector(
        ".report-bar-chart"
      );


    const mesSeleccionado =
      document.querySelector(
        ".report-selected-month strong"
      );


    const totalDona =
      document.querySelector(
        ".report-donut-center strong"
      );


    const listaCategorias =
      document.querySelector(
        ".report-category-list"
      );


    const listaDetalle =
      document.querySelector(
        ".report-detail-list"
      );


    const listaUltimos =
      document.querySelector(
        ".report-recent-list"
      );


    // =====================================================
    // MONEDA
    // =====================================================

    function monedaReporte(valor) {

      return (
        "₡ " +
        (Number(valor) || 0)
          .toLocaleString(
            "es-CR",
            {
              maximumFractionDigits: 0
            }
          )
      );

    }


    // =====================================================
    // MONEDA CORTA PARA GRÁFICA
    // =====================================================

    function monedaCorta(valor) {

      const numero =
        Number(valor) || 0;


      if (numero >= 1000000) {

        return (
          "₡" +
          (
            numero /
            1000000
          ).toFixed(1) +
          "M"
        );

      }


      if (numero >= 1000) {

        return (
          "₡" +
          Math.round(
            numero / 1000
          ) +
          "k"
        );

      }


      return "₡" + numero;

    }


    // =====================================================
    // NOMBRE MES
    // =====================================================

    function nombreMes(numero) {

      const meses = [
        "",
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre"
      ];


      return (
        meses[
          Number(numero)
        ] || ""
      );

    }


    // =====================================================
    // FECHA
    // =====================================================

    function fechaReporte(fecha) {

      if (!fecha) {
        return "";
      }


      const partes =
        fecha.split("-");


      const fechaLocal =
        new Date(
          Number(partes[0]),
          Number(partes[1]) - 1,
          Number(partes[2])
        );


      return fechaLocal.toLocaleDateString(
        "es-CR",
        {
          day: "numeric",
          month: "short",
          year: "numeric"
        }
      );

    }


    // =====================================================
    // CARGAR REPORTES
    // =====================================================

    async function cargarReportes() {

      try {

        const respuesta =
          await fetch(
            "backend/reportes.php?usuario_id=" +
            encodeURIComponent(
              usuarioReportes.id
            )
          );


        if (!respuesta.ok) {

          throw new Error(
            "Error HTTP " +
            respuesta.status
          );

        }


        const datos =
          await respuesta.json();


        if (!datos.ok) {

          console.error(
            datos.mensaje
          );

          return;

        }


        // =================================================
        // RESUMEN SUPERIOR
        // =================================================

        /*
          Orden actual de reportes.html:

          0 = Ingresos
          1 = Gastos
          2 = Balance
        */

        if (tarjetasResumen[0]) {

          tarjetasResumen[0]
            .textContent =
              monedaReporte(
                datos.usuario.ingresos
              );

        }


        if (tarjetasResumen[1]) {

          tarjetasResumen[1]
            .textContent =
              monedaReporte(
                datos.usuario.gastos
              );

        }


        if (tarjetasResumen[2]) {

          tarjetasResumen[2]
            .textContent =
              monedaReporte(
                datos.usuario.balance
              );

        }


        // =================================================
        // HISTÓRICO DE GASTOS
        // =================================================

        if (graficoHistorico) {

          graficoHistorico.innerHTML =
            "";


          let maximo =
            Math.max(
              ...datos.historico.map(
                item =>
                  Number(item.total) || 0
              ),
              1
            );


          datos.historico.forEach(
            function (
              item,
              indice
            ) {

              const total =
                Number(
                  item.total
                ) || 0;


              const porcentaje =
                maximo > 0
                  ? (
                      total /
                      maximo
                    ) * 100
                  : 0;


              const columna =
                document.createElement(
                  "div"
                );


              columna.className =
                "bar-col report-month";


              if (
                indice ===
                datos.historico.length - 1
              ) {

                columna.classList.add(
                  "active"
                );

              }


              columna.innerHTML = `

                <span
                  class="bar-val num"
                >

                  ${monedaCorta(
                    total
                  )}

                </span>


                <div
                  class="bar-track"
                >

                  <div
                    class="bar-fill expense"
                    style="
                      height:
                      ${Math.max(
                        porcentaje,
                        total > 0
                          ? 5
                          : 0
                      )}%;
                    "
                  >
                  </div>

                </div>


                <span
                  class="bar-lbl"
                >

                  ${nombreMes(
                    item.mes
                  )}

                </span>

              `;


              graficoHistorico.appendChild(
                columna
              );

            }
          );

        }


        // =================================================
        // MES SELECCIONADO
        // =================================================

        if (mesSeleccionado) {

          mesSeleccionado.textContent =
            nombreMes(
              datos.mesActual
            ) +
            " " +
            datos.anioActual;

        }


        // =================================================
        // TOTAL DONA
        // =================================================

        if (totalDona) {

          totalDona.textContent =
            monedaReporte(
              datos.gastosMes
            );

        }


        // =================================================
        // CATEGORÍAS
        // =================================================

        if (listaCategorias) {

          listaCategorias.innerHTML =
            "";


          if (
            !datos.categorias ||
            datos.categorias.length === 0
          ) {

            listaCategorias.innerHTML = `

              <div class="alert alert-info">
                No hay gastos registrados.
              </div>

            `;

          } else {

            datos.categorias.forEach(
              function (
                categoria,
                indice
              ) {

                const item =
                  document.createElement(
                    "div"
                  );


                item.className =
                  "report-category-item";


                const numeroColor =
                  (
                    indice % 5
                  ) + 1;


                item.innerHTML = `

                  <div>

                    <span
                      class="
                        report-dot
                        report-dot-${numeroColor}
                      "
                    >
                    </span>

                    ${categoria.categoria}

                  </div>


                  <strong
                    class="num"
                  >

                    ${monedaReporte(
                      categoria.total
                    )}

                  </strong>

                `;


                listaCategorias.appendChild(
                  item
                );

              }
            );

          }

        }


        // =================================================
        // DETALLE DE GASTOS
        // =================================================

        if (listaDetalle) {

          listaDetalle.innerHTML =
            "";


          if (
            !datos.categorias ||
            datos.categorias.length === 0
          ) {

            listaDetalle.innerHTML = `

              <div class="alert alert-info">
                No hay categorías de gastos.
              </div>

            `;

          } else {

            datos.categorias.forEach(
              function (categoria) {

                const item =
                  document.createElement(
                    "div"
                  );


                item.className =
                  "report-detail-item";


                item.innerHTML = `

                  <div>

                    <strong>
                      ${categoria.categoria}
                    </strong>

                    <span class="num">

                      ${monedaReporte(
                        categoria.total
                      )}

                    </span>

                  </div>


                  <button
                    type="button"
                    class="
                      btn
                      btn-ghost
                      btn-sm
                      report-view-button
                    "
                  >

                    Ver gastos

                  </button>

                `;


                const boton =
                  item.querySelector(
                    ".report-view-button"
                  );


                boton.addEventListener(
                  "click",
                  function () {

                    const movimientos =
                      datos.movimientos.filter(
                        movimiento =>
                          movimiento.categoria ===
                          categoria.categoria
                      );


                    if (
                      movimientos.length === 0
                    ) {

                      alert(
                        "No hay movimientos en esta categoría."
                      );

                      return;

                    }


                    let texto =
                      categoria.categoria +
                      "\n\n";


                    movimientos.forEach(
                      function (movimiento) {

                        texto +=
                          (
                            movimiento
                              .comercio_persona ||
                            movimiento
                              .descripcion
                          ) +
                          " - " +
                          monedaReporte(
                            movimiento.monto
                          ) +
                          "\n";

                      }
                    );


                    alert(texto);

                  }
                );


                listaDetalle.appendChild(
                  item
                );

              }
            );

          }

        }


        // =================================================
        // ÚLTIMOS GASTOS
        // =================================================

        if (listaUltimos) {

          listaUltimos.innerHTML =
            "";


          if (
            !datos.ultimosGastos ||
            datos.ultimosGastos.length === 0
          ) {

            listaUltimos.innerHTML = `

              <div class="alert alert-info">
                No tienes gastos recientes.
              </div>

            `;

          } else {

            datos.ultimosGastos.forEach(
              function (gasto) {

                const item =
                  document.createElement(
                    "div"
                  );


                item.className =
                  "report-recent-item";


                item.innerHTML = `

                  <div>

                    <strong>

                      ${
                        gasto.comercio_persona ||
                        gasto.descripcion ||
                        "Movimiento"
                      }

                    </strong>


                    <span>

                      ${gasto.categoria}

                      ·

                      ${fechaReporte(
                        gasto.fecha
                      )}

                    </span>

                  </div>


                  <strong
                    class="text-red num"
                  >

                    -${monedaReporte(
                      gasto.monto
                    )}

                  </strong>

                `;


                listaUltimos.appendChild(
                  item
                );

              }
            );

          }

        }


      } catch (error) {

        console.error(
          "Error cargando reportes:",
          error
        );

      }

    }


    // =====================================================
    // INICIAR
    // =====================================================

    cargarReportes();

  }
);

// =====================================================
// METAS DE AHORRO - MYSQL
// =====================================================

document.addEventListener(
  "DOMContentLoaded",
  function () {

    const listaMetas =
      document.getElementById(
        "listaMetas"
      );


    if (!listaMetas) {
      return;
    }


    const usuarioGuardado =
      sessionStorage.getItem(
        "fintrackUsuarioActual"
      );


    if (!usuarioGuardado) {
      return;
    }


    const usuario =
      JSON.parse(
        usuarioGuardado
      );


    const btnNuevaMeta =
      document.getElementById(
        "btnNuevaMeta"
      );

    const modalNuevaMeta =
      document.getElementById(
        "modalNuevaMeta"
      );

    const formNuevaMeta =
      document.getElementById(
        "formNuevaMeta"
      );

    const totalAhorro =
      document.getElementById(
        "totalAhorroMetas"
      );

    const balanceDisponible =
      document.getElementById(
        "balanceDisponibleMetas"
      );


    function monedaMeta(valor) {

      return (
        "₡ " +
        (Number(valor) || 0)
          .toLocaleString(
            "es-CR",
            {
              maximumFractionDigits: 0
            }
          )
      );

    }


    function abrirModalMeta() {

      if (modalNuevaMeta) {
        modalNuevaMeta.classList.add(
          "abierto"
        );
      }

    }


    function cerrarModalMeta() {

      if (modalNuevaMeta) {
        modalNuevaMeta.classList.remove(
          "abierto"
        );
      }

    }


    if (btnNuevaMeta) {

      btnNuevaMeta.addEventListener(
        "click",
        abrirModalMeta
      );

    }


    document
      .querySelectorAll(
        "[data-cerrar-meta]"
      )
      .forEach(
        function (boton) {

          boton.addEventListener(
            "click",
            cerrarModalMeta
          );

        }
      );


    async function cargarMetas() {

      try {

        const respuesta =
          await fetch(
            "backend/metas.php?usuario_id=" +
            encodeURIComponent(
              usuario.id
            )
          );


        const datos =
          await respuesta.json();


        if (!datos.ok) {

          console.error(
            datos.mensaje
          );

          return;

        }


        if (totalAhorro) {

          totalAhorro.textContent =
            monedaMeta(
              datos.usuario.ahorro
            );

        }


        if (balanceDisponible) {

          balanceDisponible.textContent =
            monedaMeta(
              datos.usuario.balance
            );

        }


        listaMetas.innerHTML =
          "";


        if (
          !datos.metas ||
          datos.metas.length === 0
        ) {

          listaMetas.innerHTML = `

            <div class="alert alert-info">
              No tienes metas de ahorro.
            </div>

          `;

          return;

        }


        datos.metas.forEach(
          function (meta) {

            const actual =
              Number(
                meta.monto_actual
              ) || 0;


            const objetivo =
              Number(
                meta.monto_objetivo
              ) || 0;


            const porcentaje =
              objetivo > 0
                ? Math.min(
                    (
                      actual /
                      objetivo
                    ) * 100,
                    100
                  )
                : 0;


            const tarjeta =
              document.createElement(
                "div"
              );


            tarjeta.className =
              "goal-card";


            tarjeta.innerHTML = `

              <div class="goal-card-header">

                <div>

                  <strong>
                    ${meta.nombre}
                  </strong>

                  <span>
                    ${meta.descripcion || ""}
                  </span>

                </div>

                <strong>
                  ${porcentaje.toFixed(0)}%
                </strong>

              </div>


              <div class="goal-bar">

                <div
                  class="goal-progress"
                  style="
                    width:${porcentaje}%;
                  "
                >
                </div>

              </div>


              <div class="goal-values">

                <span>

                  ${monedaMeta(actual)}
                  de
                  ${monedaMeta(objetivo)}

                </span>

              </div>


              <div
                class="modal-actions"
              >

                <button
                  type="button"
                  class="btn btn-primary btn-sm"
                  data-aportar="${meta.id}"
                >
                  Aportar
                </button>


                <button
                  type="button"
                  class="btn btn-outline btn-sm"
                  data-eliminar="${meta.id}"
                >
                  Eliminar
                </button>

              </div>

            `;


            // =============================================
            // APORTAR
            // =============================================

            tarjeta
              .querySelector(
                "[data-aportar]"
              )
              .addEventListener(
                "click",
                async function () {

                  const monto =
                    Number(
                      prompt(
                        "Monto que desea aportar:"
                      )
                    );


                  if (
                    !monto ||
                    monto <= 0
                  ) {
                    return;
                  }


                  const respuesta =
                    await fetch(
                      "backend/aportar_meta.php",
                      {
                        method: "POST",

                        headers: {
                          "Content-Type":
                            "application/json"
                        },

                        body:
                          JSON.stringify({
                            usuario_id:
                              usuario.id,

                            meta_id:
                              meta.id,

                            monto:
                              monto
                          })
                      }
                    );


                  const resultado =
                    await respuesta.json();


                  alert(
                    resultado.mensaje
                  );


                  if (resultado.ok) {
                    cargarMetas();
                  }

                }
              );


            // =============================================
            // ELIMINAR
            // =============================================

            tarjeta
              .querySelector(
                "[data-eliminar]"
              )
              .addEventListener(
                "click",
                async function () {

                  const confirmar =
                    confirm(
                      "¿Desea eliminar esta meta? El dinero ahorrado será devuelto a su balance."
                    );


                  if (!confirmar) {
                    return;
                  }


                  const respuesta =
                    await fetch(
                      "backend/eliminar_meta.php",
                      {
                        method: "POST",

                        headers: {
                          "Content-Type":
                            "application/json"
                        },

                        body:
                          JSON.stringify({
                            usuario_id:
                              usuario.id,

                            meta_id:
                              meta.id
                          })
                      }
                    );


                  const resultado =
                    await respuesta.json();


                  alert(
                    resultado.mensaje
                  );


                  if (resultado.ok) {
                    cargarMetas();
                  }

                }
              );


            listaMetas.appendChild(
              tarjeta
            );

          }
        );


      } catch (error) {

        console.error(
          "Error cargando metas:",
          error
        );

      }

    }


    // =====================================================
    // CREAR META
    // =====================================================

    if (formNuevaMeta) {

      formNuevaMeta.addEventListener(
        "submit",
        async function (event) {

          event.preventDefault();


          const nombre =
            document
              .getElementById(
                "metaNombre"
              )
              .value
              .trim();


          const descripcion =
            document
              .getElementById(
                "metaDescripcion"
              )
              .value
              .trim();


          const objetivo =
            Number(
              document.getElementById(
                "metaObjetivo"
              ).value
            );


          const fecha =
            document.getElementById(
              "metaFecha"
            ).value;


          const respuesta =
            await fetch(
              "backend/guardar_meta.php",
              {
                method: "POST",

                headers: {
                  "Content-Type":
                    "application/json"
                },

                body:
                  JSON.stringify({
                    usuario_id:
                      usuario.id,

                    nombre:
                      nombre,

                    descripcion:
                      descripcion,

                    monto_objetivo:
                      objetivo,

                    fecha_limite:
                      fecha
                  })
              }
            );


          const datos =
            await respuesta.json();


          alert(
            datos.mensaje
          );


          if (datos.ok) {

            formNuevaMeta.reset();

            cerrarModalMeta();

            cargarMetas();

          }

        }
      );

    }


    cargarMetas();

  }
);