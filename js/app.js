document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // USUARIO INICIAL
    // ==========================================

    let usuarios = JSON.parse(
        localStorage.getItem("fintrackUsuarios")
    ) || [];

    // Crear la cuenta de Elias solamente si no existe
    const existeElias = usuarios.some(function (usuario) {
        return usuario.correo === "erodriguez60177@ufide.ac.cr";
    });

    if (!existeElias) {

        usuarios.push({
            nombre: "Elias Rodriguez",
            correo: "erodriguez60177@ufide.ac.cr",
            clave: "12345678"
        });

        localStorage.setItem(
            "fintrackUsuarios",
            JSON.stringify(usuarios)
        );
    }


    // ==========================================
    // INICIAR SESIÓN
    // ==========================================

    const formLogin = document.getElementById("formLogin");

    if (formLogin) {

        formLogin.addEventListener("submit", function (event) {

            event.preventDefault();

            const correo = document
                .getElementById("loginCorreo")
                .value
                .trim()
                .toLowerCase();

            const clave = document
                .getElementById("loginClave")
                .value;

            const mensaje =
                document.getElementById("loginMensaje");


            // Volver a obtener usuarios
            const usuariosGuardados = JSON.parse(
                localStorage.getItem("fintrackUsuarios")
            ) || [];


            // Buscar correo
            const usuarioEncontrado =
                usuariosGuardados.find(function (usuario) {

                    return usuario.correo.toLowerCase() === correo;

                });


            // CUENTA NO EXISTE
            if (!usuarioEncontrado) {

                mensaje.textContent =
                    "La cuenta no existe.";

                mensaje.style.color = "red";

                return;
            }


            // CONTRASEÑA INCORRECTA
            if (usuarioEncontrado.clave !== clave) {

                mensaje.textContent =
                    "Contraseña incorrecta.";

                mensaje.style.color = "red";

                return;
            }


            // LOGIN CORRECTO
            sessionStorage.setItem(
                "fintrackUsuarioActual",
                JSON.stringify(usuarioEncontrado)
            );


            window.location.href =
                "dashboard.html";

        });

    }

    const formRegistro =
        document.getElementById("formRegistro");


    if (formRegistro) {

        formRegistro.addEventListener("submit", function (event) {

            event.preventDefault();


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


            const mensaje =
                document.getElementById("registroMensaje");


            // Obtener usuarios
            const usuariosGuardados = JSON.parse(
                localStorage.getItem("fintrackUsuarios")
            ) || [];


            // Verificar correo existente
            const cuentaExistente =
                usuariosGuardados.some(function (usuario) {

                    return usuario.correo.toLowerCase() === correo;

                });


            if (cuentaExistente) {

                mensaje.textContent =
                    "Ya existe una cuenta con ese correo.";

                mensaje.style.color = "red";

                return;
            }


            // Contraseña mínima
            if (clave.length < 8) {

                mensaje.textContent =
                    "La contraseña debe tener mínimo 8 caracteres.";

                mensaje.style.color = "red";

                return;
            }


            // Comparar contraseñas
            if (clave !== confirmar) {

                mensaje.textContent =
                    "Las contraseñas no coinciden.";

                mensaje.style.color = "red";

                return;
            }


            // Crear usuario
            const nuevoUsuario = {

                nombre: nombre,
                correo: correo,
                clave: clave

            };


            // Agregar usuario
            usuariosGuardados.push(nuevoUsuario);


            // Guardar
            localStorage.setItem(
                "fintrackUsuarios",
                JSON.stringify(usuariosGuardados)
            );


            mensaje.textContent =
                "Cuenta creada correctamente.";

            mensaje.style.color = "green";


            // Regresar al login después de crear cuenta
            setTimeout(function () {

                window.location.href =
                    "index.html";

            }, 1000);

        });

    }

});