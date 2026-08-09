const FinTrack = {

    init() {

        this.crearUsuarioDemo();

        this.configurarLogin();

        this.configurarRegistro();

        this.protegerPagina();

        this.mostrarUsuario();

        this.configurarPerfil();

        this.configurarCambioClave();

        this.configurarCerrarSesion();

        this.agregarEnlaceTutorial();
    },


    crearUsuarioDemo() {

        const usuarios = this.obtenerUsuarios();

        const existe = usuarios.some(
            usuario =>
                usuario.correo ===
                'erodriguez60177@ufide.ac.cr'
        );


        if (!existe) {

            usuarios.push({

                nombre: 'Elias Rodriguez',

                correo:
                    'erodriguez60177@ufide.ac.cr',

                clave: '12345678',

                moneda: 'CRC',

                tutorialVisto: false
            });


            localStorage.setItem(
                'fintrackUsuarios',
                JSON.stringify(usuarios)
            );
        }
    },


    obtenerUsuarios() {

        return JSON.parse(
            localStorage.getItem(
                'fintrackUsuarios'
            )
        ) || [];
    },


    guardarUsuarios(usuarios) {

        localStorage.setItem(
            'fintrackUsuarios',
            JSON.stringify(usuarios)
        );
    },


    usuarioActual() {

        return JSON.parse(
            sessionStorage.getItem(
                'fintrackUsuarioActual'
            )
        );
    },


    iniciales(nombre) {

        return nombre
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map(
                palabra =>
                    palabra[0].toUpperCase()
            )
            .join('');
    },


    configurarLogin() {

        const formulario =
            document.getElementById(
                'formLogin'
            );


        if (!formulario) {
            return;
        }


        formulario.addEventListener(
            'submit',
            (evento) => {

                evento.preventDefault();


                const correo =
                    document
                        .getElementById(
                            'loginCorreo'
                        )
                        .value
                        .trim()
                        .toLowerCase();


                const clave =
                    document
                        .getElementById(
                            'loginClave'
                        )
                        .value;


                const mensaje =
                    document.getElementById(
                        'loginMensaje'
                    );


                const usuario =
                    this.obtenerUsuarios()
                        .find(
                            usuario =>
                                usuario.correo
                                    .toLowerCase()
                                    === correo
                                &&
                                usuario.clave
                                    === clave
                        );


                if (!usuario) {

                    mensaje.textContent =
                        'Correo o contraseña incorrectos.';

                    mensaje.className =
                        'form-message error';

                    return;
                }


                sessionStorage.setItem(
                    'fintrackUsuarioActual',
                    JSON.stringify(usuario)
                );


                if (usuario.tutorialVisto) {

                    window.location.href =
                        'dashboard.html';

                } else {

                    window.location.href =
                        'tutorial.html';
                }

            }
        );
    },


    configurarRegistro() {

        const formulario =
            document.getElementById(
                'formRegistro'
            );


        if (!formulario) {
            return;
        }


        formulario.addEventListener(
            'submit',
            (evento) => {

                evento.preventDefault();


                const nombre =
                    document
                        .getElementById(
                            'registroNombre'
                        )
                        .value
                        .trim();


                const correo =
                    document
                        .getElementById(
                            'registroCorreo'
                        )
                        .value
                        .trim()
                        .toLowerCase();


                const clave =
                    document
                        .getElementById(
                            'registroClave'
                        )
                        .value;


                const confirmar =
                    document
                        .getElementById(
                            'registroConfirmar'
                        )
                        .value;


                const mensaje =
                    document.getElementById(
                        'registroMensaje'
                    );


                if (nombre.length < 3) {

                    mensaje.textContent =
                        'Ingrese un nombre válido.';

                    mensaje.className =
                        'form-message error';

                    return;
                }


                if (
                    !correo.endsWith(
                        '@ufide.ac.cr'
                    )
                ) {

                    mensaje.textContent =
                        'Debe utilizar un correo universitario @ufide.ac.cr.';

                    mensaje.className =
                        'form-message error';

                    return;
                }


                if (clave.length < 8) {

                    mensaje.textContent =
                        'La contraseña debe tener al menos 8 caracteres.';

                    mensaje.className =
                        'form-message error';

                    return;
                }


                if (clave !== confirmar) {

                    mensaje.textContent =
                        'Las contraseñas no coinciden.';

                    mensaje.className =
                        'form-message error';

                    return;
                }


                const usuarios =
                    this.obtenerUsuarios();


                const correoExiste =
                    usuarios.some(
                        usuario =>
                            usuario.correo
                                .toLowerCase()
                                === correo
                    );


                if (correoExiste) {

                    mensaje.textContent =
                        'Ya existe una cuenta con ese correo.';

                    mensaje.className =
                        'form-message error';

                    return;
                }


                const nuevoUsuario = {

                    nombre: nombre,

                    correo: correo,

                    clave: clave,

                    moneda: 'CRC',

                    tutorialVisto: false
                };


                usuarios.push(
                    nuevoUsuario
                );


                this.guardarUsuarios(
                    usuarios
                );


                sessionStorage.setItem(
                    'fintrackUsuarioActual',
                    JSON.stringify(
                        nuevoUsuario
                    )
                );


                window.location.href =
                    'tutorial.html';

            }
        );
    },


    protegerPagina() {

        const pagina =
            location.pathname
                .split('/')
                .pop()
                || 'index.html';


        const paginasPublicas = [
            'index.html',
            'registro.html',
            ''
        ];


        if (
            !paginasPublicas.includes(
                pagina
            )
            &&
            !this.usuarioActual()
        ) {

            window.location.href =
                'index.html';
        }
    },


    mostrarUsuario() {

        const usuario =
            this.usuarioActual();


        if (!usuario) {
            return;
        }


        document
            .querySelectorAll(
                '.s-name, [data-user-name]'
            )
            .forEach(
                elemento => {

                    elemento.textContent =
                        usuario.nombre;
                }
            );


        document
            .querySelectorAll(
                '.s-email, [data-user-email]'
            )
            .forEach(
                elemento => {

                    elemento.textContent =
                        usuario.correo;
                }
            );


        document
            .querySelectorAll(
                '.avatar, [data-user-avatar]'
            )
            .forEach(
                elemento => {

                    elemento.textContent =
                        this.iniciales(
                            usuario.nombre
                        );
                }
            );
    },


    configurarCerrarSesion() {

        document
            .querySelectorAll(
                '.logout-link'
            )
            .forEach(
                enlace => {

                    enlace.addEventListener(
                        'click',
                        (evento) => {

                            evento.preventDefault();


                            sessionStorage.removeItem(
                                'fintrackUsuarioActual'
                            );


                            window.location.href =
                                'index.html';
                        }
                    );

                }
            );
    },


    completarTutorial() {

        const usuario =
            this.usuarioActual();


        if (!usuario) {
            return;
        }


        const usuarios =
            this.obtenerUsuarios();


        const posicion =
            usuarios.findIndex(
                u =>
                    u.correo ===
                    usuario.correo
            );


        if (posicion !== -1) {

            usuarios[posicion]
                .tutorialVisto = true;


            this.guardarUsuarios(
                usuarios
            );


            sessionStorage.setItem(
                'fintrackUsuarioActual',
                JSON.stringify(
                    usuarios[posicion]
                )
            );
        }


        window.location.href =
            'dashboard.html';
    }

};


document.addEventListener(
    'DOMContentLoaded',
    () => FinTrack.init()
);