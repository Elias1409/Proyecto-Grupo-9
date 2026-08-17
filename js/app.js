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
// FILTROS DE TRANSACCIONES
// =====================================================

const filtrosTransaccion =
    document.querySelectorAll(".transaction-filter");

const filtroMetodo =
    document.getElementById("filtroMetodo");

const buscarTransaccion =
    document.getElementById("buscarTransaccion");


function filtrarTransacciones() {

    // BOTÓN ACTIVO
    const filtroActivo =
        document.querySelector(
            ".transaction-filter.active"
        );

    const tipoSeleccionado =
        filtroActivo
            ? filtroActivo.dataset.tipo
            : "todos";


    // MÉTODO DE PAGO
    const metodoSeleccionado =
        filtroMetodo
            ? filtroMetodo.value
            : "todos";


    // BÚSQUEDA
    const textoBusqueda =
    buscarTransaccion
        ? normalizarTexto(
            buscarTransaccion.value.trim()
        )
        : "";


    // FILAS DE LA TABLA
    const filas =
        document.querySelectorAll(
            "#tablaTransacciones tr"
        );


    filas.forEach(function (fila) {

        const tipoFila =
            fila.dataset.tipo;

        const metodoFila =
            fila.dataset.metodo;

        const contenidoFila =
    normalizarTexto(
        fila.textContent
    );


        // FILTRAR POR TIPO
        const coincideTipo =
            tipoSeleccionado === "todos" ||
            tipoFila === tipoSeleccionado;


        // FILTRAR POR MÉTODO
        const coincideMetodo =
            metodoSeleccionado === "todos" ||
            metodoFila === metodoSeleccionado;


        // FILTRAR POR BÚSQUEDA
        const coincideBusqueda =
            textoBusqueda === "" ||
            contenidoFila.includes(
                textoBusqueda
            );


        // MOSTRAR U OCULTAR
        if (
            coincideTipo &&
            coincideMetodo &&
            coincideBusqueda
        ) {

            fila.style.display = "";

        } else {

            fila.style.display = "none";
        }

    });

}



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
// BOTONES DE DEUDAS
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {


        const btnNuevaDeuda =
            document.getElementById(
                "btnNuevaDeuda"
            );


        const btnRegistrarPago =
            document.getElementById(
                "btnRegistrarPago"
            );



        // =================================================
        // ABRIR MODAL
        // =================================================

        function abrirModal(id) {

            const modal =
                document.getElementById(id);

            if (modal) {

                modal.classList.add(
                    "abierto"
                );

            }

        }



        // =================================================
        // CERRAR MODAL
        // =================================================

        function cerrarModal(id) {

            const modal =
                document.getElementById(id);

            if (modal) {

                modal.classList.remove(
                    "abierto"
                );

            }

        }



        // =================================================
        // NUEVA DEUDA
        // =================================================

        if (btnNuevaDeuda) {

            btnNuevaDeuda.addEventListener(
                "click",
                function () {

                    abrirModal(
                        "modalNuevaDeuda"
                    );

                }
            );

        }



        // =================================================
        // REGISTRAR PAGO
        // =================================================

        if (btnRegistrarPago) {

            btnRegistrarPago.addEventListener(
                "click",
                function () {

                    abrirModal(
                        "modalRegistrarPago"
                    );

                }
            );

        }



        // =================================================
        // CERRAR MODALES
        // =================================================

        document
            .querySelectorAll(
                "[data-cerrar-modal]"
            )
            .forEach(
                function (boton) {

                    boton.addEventListener(
                        "click",
                        function () {

                            cerrarModal(
                                boton.dataset
                                    .cerrarModal
                            );

                        }
                    );

                }
            );



        // =================================================
        // DATOS DE EJEMPLO PARA VER DETALLE
        // =================================================

        const detallesDeudas = {

            1: {
                nombre: "Gollo",
                descripcion: "Televisor Samsung",
                saldo: "₡ 275,000",
                cuota: "₡ 55,000",
                fecha: "17 ago. 2026",
                cuotas: "5 de 10"
            },


            2: {
                nombre: "BAC Credomatic",
                descripcion:
                    "Tarjeta de crédito •••• 4821",
                saldo: "₡ 184,500",
                cuota: "₡ 25,000",
                fecha: "22 ago. 2026",
                cuotas: "Pago mínimo"
            },


            3: {
                nombre:
                    "Préstamo Personal",
                descripcion:
                    "Financiamiento personal",
                saldo: "₡ 785,500",
                cuota: "₡ 85,000",
                fecha: "30 ago. 2026",
                cuotas: "7 de 18"
            }

        };



        // =================================================
        // VER DETALLE
        // =================================================

        const botonesDetalle =
            document.querySelectorAll(
                "[data-ver-deuda]"
            );


        botonesDetalle.forEach(
            function (boton) {

                boton.addEventListener(
                    "click",
                    function () {

                        const id =
                            boton.dataset
                                .verDeuda;


                        const deuda =
                            detallesDeudas[id];


                        if (!deuda) {
                            return;
                        }


                        document.getElementById(
                            "detalleDeudaTitulo"
                        ).textContent =
                            deuda.nombre;


                        document.getElementById(
                            "detalleDeudaDescripcion"
                        ).textContent =
                            deuda.descripcion;


                        document.getElementById(
                            "detalleSaldo"
                        ).textContent =
                            deuda.saldo;


                        document.getElementById(
                            "detalleCuota"
                        ).textContent =
                            deuda.cuota;


                        document.getElementById(
                            "detalleFecha"
                        ).textContent =
                            deuda.fecha;


                        document.getElementById(
                            "detalleCuotas"
                        ).textContent =
                            deuda.cuotas;


                        abrirModal(
                            "modalDetalleDeuda"
                        );

                    }
                );

            }
        );



        // =================================================
        // POR AHORA EVITAR ENVÍO REAL
        // =================================================

        const formNuevaDeuda =
            document.getElementById(
                "formNuevaDeuda"
            );


        if (formNuevaDeuda) {

            formNuevaDeuda.addEventListener(
                "submit",
                function (event) {

                    event.preventDefault();

                    cerrarModal(
                        "modalNuevaDeuda"
                    );

                }
            );

        }



        const formRegistrarPago =
            document.getElementById(
                "formRegistrarPago"
            );


        if (formRegistrarPago) {

            formRegistrarPago.addEventListener(
                "submit",
                function (event) {

                    event.preventDefault();

                    cerrarModal(
                        "modalRegistrarPago"
                    );

                }
            );

        }

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
      function (event) {

        event.preventDefault();


        const nombreCompleto =
          inputNombre.value.trim();

        let usuarioNuevo =
          inputUsuario.value.trim();


        usuarioNuevo =
          usuarioNuevo
            .replace(/^@/, "")
            .replace(/[^a-zA-Z0-9]/g, "")
            .toLowerCase();


        const partesNombre =
          nombreCompleto
            .split(/\s+/)
            .filter(Boolean);


        usuario.nombre =
          partesNombre.shift() || "";

        usuario.apellidos =
          partesNombre.join(" ");

        usuario.usuario =
          usuarioNuevo;

        usuario.correo =
          inputCorreo.value
            .trim()
            .toLowerCase();

        usuario.telefono =
          inputTelefono.value.trim();

        usuario.pais =
          inputPais.value;

        usuario.zonaHoraria =
          inputZona.value;

        usuario.moneda =
          inputMoneda.value;

        usuario.fechaNacimiento =
          inputFecha.value;


        sessionStorage.setItem(
          "fintrackUsuarioActual",
          JSON.stringify(usuario)
        );


        mostrarDatosPerfil();


        alert(
          "Perfil actualizado correctamente."
        );

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
    // TARJETAS
    // =================================================

    medios.forEach(
      function (medio) {

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
            ${medio.banco}
            ·
            ${medio.tipo}
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


        listaMedios.appendChild(
          tarjeta
        );

      }
    );

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
  // EDITAR MEDIO
  // =====================================================

  listaMedios.addEventListener(
    "click",
    function (event) {

      const boton =
        event.target.closest(
          ".btn-editar-medio"
        );


      if (!boton) {
        return;
      }


      const id =
        Number(
          boton.dataset.medioId
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


      if (medio.tipo === "Cuenta bancaria") {

        inputNumeroCuenta.value =
          medio.numeroCuenta || "";

      } else {

        /*
        Por seguridad NO cargamos
        nuevamente el número completo.
        Solo mostramos los últimos 4.
        */

        inputNumeroTarjeta.value =
          medio.ultimos4
            ? "•••• •••• •••• " +
              medio.ultimos4
            : "";


        inputVencimiento.value =
          medio.vencimiento || "";

      }


      actualizarCamposPorTipo();


      if (tituloModal) {

        tituloModal.textContent =
          "Editar medio";

      }


      abrirModal();

    }
  );


  // =====================================================
  // VALIDAR VENCIMIENTO
  // =====================================================

  function vencimientoValido(
    valor
  ) {

    if (
      !/^\d{2}\/\d{2}$/.test(
        valor
      )
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