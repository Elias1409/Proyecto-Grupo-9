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
                .value
                .trim()
                .toLowerCase();

            const clave = document
                .getElementById("loginClave")
                .value;

            const mensaje = document
                .getElementById("loginMensaje");


            // Limpiar mensaje anterior
            mensaje.textContent = "";


            try {

                // Enviar correo y contraseña a PHP
                const respuesta = await fetch(
                    "backend/login.php",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({
                            correo: correo,
                            clave: clave
                        })
                    }
                );


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

                mensaje.textContent =
                    "No se pudo conectar al servidor.";

                mensaje.style.color = "red";
            }

        });

    }



    // =====================================================
    // CREAR CUENTA
    // =====================================================

    const formRegistro = document
        .getElementById("formRegistro");


    if (formRegistro) {

        formRegistro.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                // Obtener datos del formulario
                const nombre = document
                    .getElementById("registroNombre")
                    .value
                    .trim();


                const correo = document
                    .getElementById("registroCorreo")
                    .value
                    .trim()
                    .toLowerCase();


                const clave = document
                    .getElementById("registroClave")
                    .value;


                const confirmar = document
                    .getElementById("registroConfirmar")
                    .value;


                const mensaje = document
                    .getElementById("registroMensaje");


                // Limpiar mensaje anterior
                mensaje.textContent = "";


                // =================================================
                // VALIDAR NOMBRE
                // =================================================

                if (nombre === "") {

                    mensaje.textContent =
                        "Debe ingresar su nombre.";

                    mensaje.style.color = "red";

                    return;
                }


                // =================================================
                // VALIDAR CORREO
                // =================================================

                if (correo === "") {

                    mensaje.textContent =
                        "Debe ingresar su correo electrónico.";

                    mensaje.style.color = "red";

                    return;
                }


                // =================================================
                // VALIDAR CONTRASEÑA
                // =================================================

                if (clave.length < 8) {

                    mensaje.textContent =
                        "La contraseña debe tener mínimo 8 caracteres.";

                    mensaje.style.color = "red";

                    return;
                }


                // =================================================
                // COMPARAR CONTRASEÑAS
                // =================================================

                if (clave !== confirmar) {

                    mensaje.textContent =
                        "Las contraseñas no coinciden.";

                    mensaje.style.color = "red";

                    return;
                }


                try {

                    mensaje.textContent =
                        "Creando cuenta...";

                    mensaje.style.color = "#555";


                    // Enviar datos a registro.php
                    const respuesta = await fetch(
                        "backend/registro.php",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                nombre: nombre,
                                correo: correo,
                                clave: clave
                            })
                        }
                    );


                    const datos = await respuesta.json();


                    // PHP encontró algún problema
                    if (!datos.ok) {

                        mensaje.textContent =
                            datos.mensaje;

                        mensaje.style.color =
                            "red";

                        return;
                    }


                    // =================================================
                    // CUENTA CREADA
                    // =================================================

                    mensaje.textContent =
                        "Cuenta creada correctamente.";

                    mensaje.style.color =
                        "green";


                    // Limpiar formulario
                    formRegistro.reset();


                    // Volver al login después de 1 segundo
                    setTimeout(function () {

                        window.location.href =
                            "index.html";

                    }, 1000);


                } catch (error) {

                    console.error(
                        "Error en registro:",
                        error
                    );

                    mensaje.textContent =
                        "No se pudo conectar al servidor.";

                    mensaje.style.color =
                        "red";
                }

            }
        );

    }



    // =====================================================
    // OBTENER USUARIO QUE INICIÓ SESIÓN
    // =====================================================

    const usuarioGuardado = sessionStorage.getItem("fintrackUsuarioActual");

if (usuarioGuardado) {

    const usuario = JSON.parse(usuarioGuardado);

    const nombreUsuario =
        document.getElementById("nombreUsuario");

    const correoUsuario =
        document.getElementById("correoUsuario");

    const avatarUsuario =
        document.getElementById("avatarUsuario");


    // Cambiar nombre
    if (nombreUsuario) {
        nombreUsuario.textContent = usuario.nombre;
    }


    // Cambiar correo
    if (correoUsuario) {
        correoUsuario.textContent = usuario.correo;
    }


    // Cambiar iniciales del avatar
    if (avatarUsuario && usuario.nombre) {

        const partes = usuario.nombre
            .trim()
            .split(" ");

        let iniciales = partes[0][0];

        if (partes.length > 1) {
            iniciales += partes[1][0];
        }

        avatarUsuario.textContent =
            iniciales.toUpperCase();
    }
}


    // =====================================================
    // CERRAR SESIÓN
    // =====================================================

    const botonesCerrarSesion =
        document.querySelectorAll(
            ".logout-link"
        );


    botonesCerrarSesion.forEach(
        function (boton) {

            boton.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();


                    // Borrar usuario de la sesión
                    sessionStorage.removeItem(
                        "fintrackUsuarioActual"
                    );


                    // Volver al login
                    window.location.href =
                        "index.html";

                }
            );

        }
    );

});