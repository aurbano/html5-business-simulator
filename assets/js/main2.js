/**
 * Main application code for Mondragon's simulator 2
 * @author Alejandro U. Alvarez <alejandro@urbanoalvarez.es>
 * @author Nicolas Lozano <nlozanoarguelles@gmail.com>
 */

var Simulator = {

    // Para configurar el Simulador unicamente se deberian modificar los parametros a continuacion
    // todos ellos estan explicados a continuacion.
    // Para arrancar el simulador hay que llamar a 'Simulator.start();''
    config: {
        debug: true, // Turn console debugging on/off
        speed: 0.9, // Modificador de la velocidad. 1 : Normal; >1 : Más lento; <1 : Más rapido
        wheel: 4, // Tiempo (s) que tarda en dar una vuelta entera la rueda, relativo a la velocidad del simulador
        numberIntents: 1 //Numero intentos para poder comprobar los resultados

    },
    simulationEnd: false,
    //name of the face loaded, if not face faceLoad = false
    faceLoad: false,

    // Mensajes de conclusion del gerente, uno por cada fase
    // Como la fase dos no tiene mensaje de gerente se deja en false
    gerente: [
        {
            text: "¡Viene a controlarnos!",
            style: 'bg-danger'
  },
  false,
        {
            text: 'Viene a escucharnos; Quiere estar cerca de nosotros/as',
            style: 'bg-success'
  }
 ],

    // Valores

    palancas: {
        emocion: [
            {
                nombre: 'Seguridad',
                desc: 'Seguridad de empleo',
                opt: ['Baja', 'Alta']
            },
            {
                nombre: 'Transparencia',
                desc: 'Nivel de transparencia en la organización (en las cuentas, objetivos, retos estratégicos, inversiones, …) y en el caso de que exista dónde se pone especialmente el énfasis.',
                opt: ['Baja', 'Alta; énfasis en la crudeza del mercado', 'Alta; énfasis en el Proyecto']
            },
            {
                nombre: 'Proyecto',
                desc: 'Grado de Proyecto Compartido: hasta qué punto la organización hace partícipes a las personas del proyecto ("la metáfora de la catedral")',
                opt: ['No se comparte', 'No se comparte. La clave es salvar el PG', 'Se comparte de forma continuada']
            },
            {
                nombre: 'Retribución',
                desc: 'El salario medio de la organización respecto a otras organizaciones del entorno y los incentivos económicos existentes',
                opt: ['Salario mínimo. Incentivos adicionales importantes.', 'Por encima de la media. Sin incentivos', 'Por encima de la media. Sin incentivos y si existen sin efecto real']

            },
            {
                nombre: 'Resultados',
                desc: 'Participación en Resultados de la empresa (p.ej. en un % de los beneficios)',
                opt: ['No se participa en resultados', 'Si (p.ej. un 30% de beneficios)']
            },
            {
                nombre: 'Nivel Formación',
                desc: 'Nivel de inversión en formación de las personas en la organización',
                opt: ['La justa para la ejecución tarea', 'Alta. Filosofía de desarrollo']
            },
            {
                nombre: 'Diseño trabajo',
                desc: 'Grado de autonomía en el puesto de trabajo (enriquecimiento vertical) y grado de enriquecimiento del trabajo (enriquecimiento horizontal)',
                opt: ['Diseño empobrecido', 'Diseño enriquecido']
            },
            {
                nombre: 'Participación',
                desc: 'Hasta qué punto la organización hace partícipes a las personas de las decisiones estratégicas',
                opt: ['Baja / nula', 'Alta']
            },
            {
                nombre: 'Política de Personas',
                desc: 'El mensaje general transmitido a las personas',
                opt: ['No hay un mensaje claro', 'La persona es el "activo" clave']
            },
            {
                nombre: 'Liderazgo',
                desc: 'Estilo de liderazgo predominante en la organización',
                opt: ['Paternalista / clásico', 'Clásico (orden y control)', 'Transformacional', 'Liderazgo autoritario']

            }
        ],
        cultural: [
            {
                nombre: 'Mensaje',
                desc: 'El principal mensaje que la dirección transmite a las personas',
                opt: ['Lograr los objetivos / resultados por encima de todo. Cumplir con los compromisos', 'Las necesidades del cliente por encima de todo', 'Sorprender al mercado y el liderazgo de producto es la clave', 'Las personas primero y por encima de todo']
            },
            {
                nombre: 'Inversión',
                desc: 'Dónde se invierten los recursos económicos',
                opt: ['En sistemas de control, información, monitorización a tiempo real, seguimiento de indicadores.', 'En mejorar la comunicación con los clientes y desarrollar soluciones para atender sus necesidades', 'En el desarrollo de nuevas soluciones no necesariamente explicitadas por el cliente', 'En cambios org. hacia equipos / autonomía']
            },
            {
                nombre: 'Tiempo',
                desc: 'En qué se ocupan los responsables de la organización. Esto es, en qué pasan el tiempo.',
                opt: ['Monitorizando resultados / objetivos / indicadores', 'Escuchando, atendiendo y estando cerca del cliente', 'Valorando y asignando recursos a nuevas iniciativas', 'Escuchando y acompañando a las personas / equipos']
            },
            {
                nombre: 'Indicadores',
                desc: 'Cuáles son los indicadores más importantes monitorizados por la dirección de la organización. Aquellos especialmente prioritarios. ',
                opt: ['Productividades, gastos operativos, niveles de calidad, etc.', 'Reclamaciones de cliente, nivel de fidelización, cuota de mercado, etc.', 'Nivel de éxito de nuevos productos, oportunidades detectadas, prospectivas.', 'Satisfacción de personas, nivel de desarrollo de equipos, nº de equipos, sentimiento de pertenencia, ..']
            },
            {
                nombre: 'Promoción',
                desc: 'Cuáles son los criterios de promoción',
                opt: ['Los que mejor cumplen con los compromisos, logran resultados, etc', 'Los que mejor conocen a los clientes', 'Los más visionarios en nuevos desarrollos', 'Los que mejor se relacionan y tratan con las personas']
            }
        ]
    },
    // La configuracion de los modos
    // el target es la config de las palancas, si no importa se deja en false.
    // Si se rellena, hay que poner el contenido que debe aparecer en la palanca.
    modos: {
        emocionales: [
            {
                nombre: 'Confort',
                sig_emocionales: [
     'Es un buen sitio para trabajar (seguridad, salarios, ritmo, etc)',
     '¿Para qué cambiar o esforzarse? No  hay muchos retos',
     'Nuestros "jefes" siguen un estilo de orden y control pero es paternalista y predecible'
    ],
                ref_emocionales: 'Proactividad y esfuerzo extra-rol baja; resistencia al cambio por inacción; Pasividad ante nuevas iniciativas',
                target: [
     'Alta',
     'Baja',
     'No se comparte',
     'Por encima de la media. Sin incentivos y si existen sin efecto real',
     false,
     false,
     false,
     false,
     'No hay un mensaje claro',
     'Paternalista / clásico'
    ]
   },
            {
                nombre: 'Resignación',
                sig_emocionales: [
     'Nos engañan - esto no merece la pena',
     'Aunque suene a nuevo, es lo de siempre',
     'No hay nada que pueda hacer, esto no se puede cambiar'
    ],
                ref_emocionales: 'Proactividad y esfuerzo extra-rol baja; resistencia alta; comportamientos de evitación de compromisos; cinismo - alienación',
                target: [
     false,
     'Baja',
     'No se comparte',
     false,
     false,
     'La justa para la ejecución tarea',
     false,
     'Baja / nula',
     'La persona es el "activo" clave',
     'Clásico (orden y control)'
    ]
   },
            {
                nombre: 'Pasión',
                sig_emocionales: [
     'Este proyecto realmente merece la pena; veo la visión y realmente me entusiasma',
     'Los responsables de esta organización confían en nosotros',
     'Las personas somos clave para la organización por lo que se busca nuestro desarrollo profesional'
    ],
                ref_emocionales: 'Proactividad y esfuerzo extra-rol alto; predisposición a asumir iniciativas, a aprender y arriesgarse',
                target: [
     'Alta',
     'Alta; énfasis en el Proyecto',
     'Se comparte de forma continuada',
     'Por encima de la media. Sin incentivos',
     'Si (p.ej. un 30% de beneficios)',
     'Alta. Filosofía de desarrollo',
     'Diseño enriquecido',
     'Alta',
     'La persona es el "activo" clave',
     'Transformacional'
    ]
   },
            {
                nombre: 'Agresión',
                sig_emocionales: [
     'No es una opción fracasar; no nos van a sacar del mercado!!',
     'Es probable que perdamos el empleo si no superamos los retos de mercado más inmediatos',
     'Los responsables son exigentes; no hay margen de error'
    ],
                ref_emocionales: 'Proactividad y esfuerzo extra-rol alto; dispuesto a cambios y nuevas iniciativas',
                target: [
     'Baja',
     'Alta; énfasis en la crudeza del mercado',
     'No se comparte. La clave es salvar el PG',
     'Salario mínimo. Incentivos adicionales importantes.',
     false,
     'La justa para la ejecución tarea',
     false,
     'Baja / nula',
     false,
     'Liderazgo autoritario'
    ]
   }
  ],
        // Aqui se pone el prefijo, los que extiende (por referencia), y los comentarios extra
        culturales: [
            {
                prefijo: 'Logro',
                extiende: [
     2,
     3
    ],
                sig_culturales: [
     'Se cumplen los compromisos con rigor y responsabilidad',
     'El resultado si o si, la honestidad, el logro en lugar del esfuerzo, la disciplina',
     'Materializamos los objetivos relacionados con la productividad, la calidad, el gasto, etc es lo importante'
    ],
                ref_culturales: 'Alta proactividad y esfuerzo para lograr los objetivos de eficiencia, calidad, servicio, control del gasto, etc',
                target_cultural: [
     'Lograr los objetivos / resultados por encima de todo. Cumplir con los compromisos',
     'En sistemas de control, información, monitorización a tiempo real, seguimiento de indicadores.',
     'Monitorizando resultados / objetivos / indicadores',
     'Productividades, gastos operativos, niveles de calidad, etc.',

     'Los que mejor cumplen con los compromisos, logran resultados, etc'
    ],
                graph: [
                    3,
                    5,
                    2.5,
                    null
                ]
   },

            {
                prefijo: 'Cliente',
                extiende: [
     2,
     3
    ],
                sig_culturales: [
     'Fomentamos una comprensión íntima del cliente para que todas las decisiones estén orientadas a cubrir sus necesidades',
     'Escuchamos al cliente, somos flexibles para adpatarnos a sus necesidades, tenemos vocación de servicio.'
    ],
                ref_culturales: 'Mucha iniciativa y predisposición para escuchar y atender las necesidades cambiantes del cliente; la flexibilidad y el aprendizaje continuo todos los días.',
                target_cultural: [
     'Las necesidades del cliente por encima de todo',
     'En mejorar la comunicación con los clientes y desarrollar soluciones para atender sus necesidades',
     'Escuchando, atendiendo y estando cerca del cliente',
     'Reclamaciones de cliente, nivel de fidelización, cuota de mercado, etc.',
     'Los que mejor conocen a los clientes'
    ],
                graph: [
                    3,
                    5,
                    2.5,
                    null
                ]
   },

            {
                prefijo: 'Innovación',
                extiende: [
     2
    ],
                sig_culturales: [
     'Perseguimos ser único, lo que nunca antes se ha hecho, buscando los máximos estándares',
     'Nos caracteriza la curiosidad, aprender del fracaso, ser creativos y desafiar al status quo.',
     'Se fomenta la experimentación, la vigilancia y el aprendizaje'
    ],
                ref_culturales: 'Mucha inquietud e iniciativa para crear nuevas soluciones para desafiar el status quo y sorprender al mercado',
                target_cultural: [
     'Sorprender al mercado y el liderazgo de producto es la clave',
     'En el desarrollo de nuevas soluciones no necesariamente explicitadas por el cliente',
     'Valorando y asignando recursos a nuevas iniciativas',
     'Nivel de éxito de nuevos productos, oportunidades detectadas, prospectivas.',
     'Los más visionarios en nuevos desarrollos'
    ],
                graph: [
                    3,
                    5,
                    2.5,
                    2
                ]
   },

            {
                prefijo: 'Eq.-Pers.',
                extiende: [
     2
    ],
                sig_culturales: [
     'Priorizamos el bien común con un compromiso y apoyo en las personas.',
     'Las personas son la esencia de esta organización',
     'Nos caracterizamos por la cooperación, el respeto, el "empowerment".'
    ],
                ref_culturales: 'Iniciativas continuas para desarrollar y dar libertad de acción a las personas',
                target_cultural: [
     'Las personas primero y por encima de todo',
     'En cambios org. hacia equipos / autonomía',
     'Escuchando y acompañando a las personas / equipos',
     'Satisfacción de personas, nivel de desarrollo de equipos, nº de equipos, sentimiento de pertenencia, ..',
     'Los que mejor se relacionan y tratan con las personas'
    ],
                graph: [
                    3,
                    5,
                    2.5,
                    2
                ]
   }
  ]
    },

    // Variables internas
    current: {
        type: '',
        mode: {}
    },

    // ------------------------------------------- //
    target: false, // Current target position for all settings
    editable: false, // Could the settings be editable? Should be false during animation cycles.
    currentResult: -1, // Current result index
    animationPhase: 0, // Current animation phase
    lastConclusion: -1,
    spinning: false, // Indicates if the spinner is active. Question marks don't appear if it isn't.
    questionTimers: [], // Timers used by the question marks
    questionInterval: null,

    // ------------------------------------------- //

    // Codigo

    start: function () {
        console.log('Empezando Simulador 2');

        $(window).resize(function () {
            Simulator.resize();
        });

        Simulator.resize();

        $('textarea').autosize();

        //  LOAD CONTENT INTO WINDOWS 0 AND 1 ----
        var $seleccion = $('#seleccion'),
            $select = $('#configuracion select'),
            $msgSelected = $('#msgSelectedList');
        used_messages = []; // Holder for the used messages, to avoid dupes

        // Rellena el campo de seleccion y los options
        for (var i = 0; i < Simulator.modos.emocionales.length; i++) {
            $seleccion.append('<a class="btn btn-default" href="#" data-type="emocionales" data-index="' + i + '">' + Simulator.modos.emocionales[i].nombre + '</a> ');
            // Select
            for (var a = 0; a < Simulator.modos.emocionales[i].sig_emocionales.length; a++) {
                if (used_messages.indexOf(Simulator.modos.emocionales[i].sig_emocionales[a]) < 0) {
                    used_messages.push(Simulator.modos.emocionales[i].sig_emocionales[a]);
                }
            }
        }

        $seleccion.append('<hr />');

        for (var i = 0; i < Simulator.modos.culturales.length; i++) {
            var modo = Simulator.modos.culturales[i];
            for (var a = 0; a < modo.extiende.length; a++) {
                $seleccion.append('<a class="btn btn-primary" href="#" data-type="culturales" data-index="' + i + '" data-extends="' + modo.extiende[a] + '">' + modo.prefijo + ' ' + Simulator.modos.emocionales[modo.extiende[a]].nombre + '</a> ');
            }
            // Select
            for (var a = 0; a < Simulator.modos.culturales[i].sig_culturales.length; a++) {
                if (used_messages.indexOf(Simulator.modos.culturales[i].sig_culturales[a]) < 0) {
                    used_messages.push(Simulator.modos.culturales[i].sig_culturales[a]);

                }
            }
        }

        var shuffled_messages = Simulator.shuffle(used_messages);

        for (var i = 0; i < shuffled_messages.length; i++) {
            $select.find('optgroup').append('<option data-index="' + i + '">' + shuffled_messages[i] + '</option>');
        };


        // EVENTS OF WINDOWS 0 AND 1 AND 2----------------

        //Start simulation
        $('#start_simulation').click(function (e) {
            e.preventDefault();
            Simulator.windows.change(1);
        });
        // Click event on initial selection page
        $seleccion.find('a.btn').click(function (e) {
            e.preventDefault();
            Simulator.current.type = $(this).attr("data-type");
            Simulator.current.name = $(this).text();
            // Update current mode
            if (Simulator.current.type == "emocionales") {
                Simulator.current.mode = Simulator.modos.emocionales[$(this).attr("data-index")];
                Simulator.current.mode.graph = [3.5, 3.4, 3.2, 3.3];
            } else {
                Simulator.current.mode = Simulator.modos.culturales[$(this).attr("data-index")];
                Simulator.current.mode.nombre = Simulator.current.mode.prefijo + ' ' + Simulator.modos.emocionales[$(this).attr("data-extends")].nombre;
                Simulator.current.mode.sig_emocionales = Simulator.modos.emocionales[$(this).attr("data-extends")].sig_emocionales;
                Simulator.current.mode.target = Simulator.modos.emocionales[$(this).attr("data-extends")].target;
            }
            console.log(Simulator.current);
            // Change title
            $('h3 span').text(' - ' + Simulator.current.mode.nombre);
            // Update message textarea
            if (typeof (Simulator.current.mode.sig_emocionales) !== 'undefined') {
                for (var i = 0; i < Simulator.current.mode.sig_emocionales.length; i++) {
                    $('#msgBox').append(Simulator.current.mode.sig_emocionales[i] + "\n");
                }
            }
            if (typeof (Simulator.current.mode.sig_culturales) !== 'undefined') {
                for (var i = 0; i < Simulator.current.mode.sig_culturales.length; i++) {
                    $('#msgBox').append(Simulator.current.mode.sig_culturales[i] + "\n");
                }
            }
            // Change window
            Simulator.windows.change(2);
        });

        // Clicks on second page
        $select.change(function () {
            $('#configMensaje').text($(this).val());
        });

        // Clicks on dropdown menu
        $select.change(function () {
            $select.find('option:selected').each(function () {
                $msgSelected.append('<li class="list-group-item" data-index="' + $(this).attr('data-index') + '">' + $(this).text() + '<button id="ereaseMsg' + $(this).attr('data-index') + '" class="close">&times;</button></li>');
                $(this).hide();
                $select.find('option').eq(0).prop('selected', true);

                //Erease a message selected and show it on the select dropdown menu
                $('#ereaseMsg' + $(this).attr('data-index')).click(function (e) {
                    e.preventDefault();
                    var index = $(this).parent().attr('data-index');
                    $select.find('optgroup').find('option').each(function () {

                        if ($(this).attr('data-index') == index) {
                            $(this).show();
                        }
                    });
                    $(this).parent().remove();
                });
            });
        });


        $('#showMsg').click(function (e) {
            e.preventDefault();
            //hide show message button
            $(this).hide();
            //hide dropdown menu
            $('#configuracion select').hide();
            $('#msgBox').fadeIn(100, function () {
                $(this).trigger('autosize.resize');
            });
            //Check if messages selected were right
            $msgSelected.find('li').each(function () {
                $(this).find('button').remove();
                if ($('#msgBox').text().indexOf($(this).text()) != -1) {
                    $(this).addClass('list-group-item-success');
                } else {
                    $(this).addClass('list-group-item-danger');
                }
            });
        });

        $('#configuracion a.next').click(function (e) {
            e.preventDefault();
            Simulator.windows.change(3);
        });

    },

    windows: {

        current: 0,

        /**
         * Change to another window
         * index is the window reference, in the defined elements inside the function
         */
        change: function (index, callback) {
            var windows = [$('#menu_principal'), $('#seleccion'), $('#configuracion'), $('#simulador')],
                breadcrumbs = $('.breadcrums');
            if (index == Simulator.windows.current) return;
            if (index == 3) this.loadWindow2();
            Simulator.windows.current = index;

            $('#app .panel').slideUp();
            windows[index].slideDown();

            // Reset title and current
            if (index == 1) {
                $('h3 span').text('');

                Simulator.current = {};
            }

        },
        loadWindow2: function () {
            $goalTitle = $('#title_objetivo');
            $goalMessages = $('#sim_objetivo');
            $palancas = $('#palancas');

            //Write the selected Goal in the title
            $goalTitle.append(Simulator.current.name);
            //Write the messages according to the goal
            $goalMessages.append('<li>' + $('#msgBox').text().replace(/\n$/, '').replace(/\n/g, '</li><li>') + '</li>');
            //Toggle function to show goal messages when user move mouse over title
            $goalTitle.hover(function () {
                $goalMessages.fadeIn();
            }, function () {
                $goalMessages.fadeOut();
            });
            //Object with the tooltip info
            var tooltip = {};
            // Fill palancas
            if (typeof (Simulator.current.mode.sig_culturales) == 'undefined') {

                for (var i = 0; i < Simulator.palancas.emocion.length; i++) {
                    if (i % 2 == 0) {
                        if (i != Simulator.palancas.emocion.length - 1)
                            $palancas.append('<div class="row" id="columna' + Simulator.palancas.emocion[i].nombre.replace(/ /g, '') + '"><div class="col-md-6" id="elemento' + Simulator.palancas.emocion[i].nombre.replace(/ /g, '') + '"></th></tr>');
                        else
                            $palancas.append('<div class="row" id="columna' + Simulator.palancas.emocion[i].nombre.replace(/ /g, '') + '"><div class="col-md-12" id="elemento' + Simulator.palancas.emocion[i].nombre.replace(/ /g, '') + '"></th></tr>');
                    } else {
                        $palancas.find('#columna' + Simulator.palancas.emocion[i - 1].nombre.replace(/ /g, '')).append('<div class="col-md-6" id="elemento' + Simulator.palancas.emocion[i].nombre.replace(/ /g, '') + '">');
                    }
                    $palancas.find('#elemento' + Simulator.palancas.emocion[i].nombre.replace(/ /g, '')).append('<div><div class="title_palancas">' + Simulator.palancas.emocion[i].nombre + '</div><select class="selectpicker" data-width="180px" id="menu' + Simulator.palancas.emocion[i].nombre.replace(/ /g, '') + '" ><option disabled selected>--Selecciona una--</option></select></div>');
                    tooltip[$('#elemento' + Simulator.palancas.emocion[i].nombre.replace(/ /g, '')).attr('id')] = new Opentip('#elemento' + Simulator.palancas.emocion[i].nombre.replace(/ /g, ''), {
                        tipJoint: "bottom left"
                    });
                    tooltip[$('#elemento' + Simulator.palancas.emocion[i].nombre.replace(/ /g, '')).attr('id')].deactivate();
                    for (var j = 0; j < Simulator.palancas.emocion[i].opt.length; j++) {
                        $palancas.find('#menu' + Simulator.palancas.emocion[i].nombre.replace(/ /g, '')).append('<option >' + Simulator.palancas.emocion[i].opt[j] + '</option>');
                    }

                }
            } else {

                var columnaActual;
                for (var i = 0; i < (Simulator.palancas.emocion.length + Simulator.palancas.cultural.length); i++) {

                    if (i < Simulator.palancas.emocion.length) {

                        if (i % 3 == 0) {
                            columnaActual = i;
                            $palancas.append('<div class="row" id="columna' + Simulator.palancas.emocion[i].nombre.replace(/ /g, '') + '"><div class="col-md-4" id="elemento' + Simulator.palancas.emocion[i].nombre.replace(/ /g, '') + '"></th></tr>');

                        } else {
                            $palancas.find('#columna' + Simulator.palancas.emocion[columnaActual].nombre.replace(/ /g, '')).append('<div class="col-md-4" id="elemento' + Simulator.palancas.emocion[i].nombre.replace(/ /g, '') + '">');
                        }
                        $palancas.find('#elemento' + Simulator.palancas.emocion[i].nombre.replace(/ /g, '')).append('<div><div class="title_palancas">' + Simulator.palancas.emocion[i].nombre + '</div><select class="selectpicker" data-width="150px" id="menu' + Simulator.palancas.emocion[i].nombre.replace(/ /g, '') + '" ><option disabled selected>--Selecciona una--</option></select></div>');
                        tooltip[$('#elemento' + Simulator.palancas.emocion[i].nombre.replace(/ /g, '')).attr('id')] = new Opentip('#elemento' + Simulator.palancas.emocion[i].nombre.replace(/ /g, ''), {
                            tipJoint: "bottom left"
                        });
                        tooltip[$('#elemento' + Simulator.palancas.emocion[i].nombre.replace(/ /g, '')).attr('id')].deactivate();
                        for (var j = 0; j < Simulator.palancas.emocion[i].opt.length; j++) {
                            $palancas.find('#menu' + Simulator.palancas.emocion[i].nombre.replace(/ /g, '')).append('<option >' + Simulator.palancas.emocion[i].opt[j] + '</option>');
                        }

                    } else {
                        var u = i - Simulator.palancas.emocion.length;
                        if (i % 3 == 0) {
                            columnaActual = u;
                            $palancas.append('<div class="row" id="columna' + Simulator.palancas.cultural[u].nombre.replace(/ /g, '') + '"><div class="col-md-4" id="elemento' + Simulator.palancas.cultural[u].nombre.replace(/ /g, '') + '"></th></tr>');

                        } else {
                            if (columnaActual > Simulator.palancas.cultural.length) {
                                $palancas.find('#columna' + Simulator.palancas.emocion[columnaActual].nombre.replace(/ /g, '')).append('<div class="col-md-4" id="elemento' + Simulator.palancas.cultural[u].nombre.replace(/ /g, '') + '">');
                            } else {
                                $palancas.find('#columna' + Simulator.palancas.cultural[columnaActual].nombre.replace(/ /g, '')).append('<div class="col-md-4" id="elemento' + Simulator.palancas.cultural[u].nombre.replace(/ /g, '') + '">');
                            }
                        }
                        $palancas.find('#elemento' + Simulator.palancas.cultural[u].nombre.replace(/ /g, '')).append('<div><div class="title_palancas" >' + Simulator.palancas.cultural[u].nombre + '</div><select class="selectpicker" data-width="150px" data-selected="0" id="menu' + Simulator.palancas.cultural[u].nombre.replace(/ /g, '') + '" ><option disabled selected>--Selecciona una--</option></select></div>');
                        tooltip[$('#elemento' + Simulator.palancas.cultural[u].nombre.replace(/ /g, '')).attr('id')] = new Opentip('#elemento' + Simulator.palancas.cultural[u].nombre.replace(/ /g, ''), {
                            tipJoint: "bottom left"
                        });
                        tooltip[$('#elemento' + Simulator.palancas.cultural[u].nombre.replace(/ /g, '')).attr('id')].deactivate()
                        for (var j = 0; j < Simulator.palancas.cultural[u].opt.length; j++) {
                            $palancas.find('#menu' + Simulator.palancas.cultural[u].nombre.replace(/ /g, '')).append('<option>' + Simulator.palancas.cultural[u].opt[j] + '</option>');
                        }

                    }
                }
                $('.title_palancas').css('font-size', '11px');
            }
            console.log(tooltip);

            //Apply style to "palancas"
            $('.selectpicker').selectpicker();


            //Handle selects "palancas"
            $('.selectpicker').on('change', function (e) {
                var $optionSelected = $("option:selected", this);
                var $selectParent = $optionSelected.closest('.selectpicker');
                $selectParent.selectpicker('setStyle', 'btn-info');
                $selectParent.attr('data-selected', '1');
                tooltip[$selectParent.parent().parent().attr('id')].setContent($optionSelected.text());
                tooltip[$selectParent.parent().parent().attr('id')].activate();
                console.log($optionSelected.text());
            });

            //Add a continue button to start the animation
            $palancas.append('<hr /><a class="btn btn-primary btn-sm" id="reset_palancas">Reset</a><a class="btn btn-primary btn-sm" id="validate_window2" style="margin-left:15px;">Ver Resultado</a><a class="btn btn-danger btn-sm" id="check_window2" style="margin-left:15px;" disabled>Comprobar</a>');

            //Event, check wether if its possible or not to run the simulation
            $('#check_window2,#validate_window2').click(function () {
                var correctPalancas = false;
                if ($(this).attr('id') == 'check_window2') {
                    console.log('Boton correccion');
                    correctPalancas = true;
                }
                var rightPalancas = 0;
                var selectedPalancas = 0;
                var notSelectedPalancas = [];
                var numBlink = 6;
                var currentTargets;
                var interval = null;
                var $select = $('#palancas select.selectpicker');
                if (typeof (Simulator.current.mode.sig_culturales) !== 'undefined') {
                    currentTargets = Simulator.current.mode.target.concat(Simulator.current.mode.target_cultural);
                } else {
                    currentTargets = Simulator.current.mode.target;
                }
                var blink = function () {
                    for (var i = 0; i < notSelectedPalancas.length; i++) {
                        if (numBlink % 2 == 0) {
                            $select.eq(notSelectedPalancas[i]).selectpicker('setStyle', 'btn-warning', 'add');
                        } else {
                            $select.eq(notSelectedPalancas[i]).selectpicker('setStyle', 'btn-warning', 'remove');
                        }
                    }
                    numBlink--;
                    if (numBlink == 0) {
                        clearInterval(interval);
                    }
                }

                for (var i = 0; i < $select.length; i++) {
                    if ($select.eq(i).attr('data-selected') == '1') {
                        selectedPalancas++;
                    } else {
                        notSelectedPalancas.push(i);
                    }
                }
                if (selectedPalancas == $select.length) {

                    for (var i = 0; i < $select.length; i++) {
                        if ($select.eq(i).find('option:selected').text() == currentTargets[i] || !currentTargets[i]) {
                            console.log('bien');
                            rightPalancas++;
                            if (correctPalancas) {
                                $select.eq(i).selectpicker('setStyle', 'btn-info', 'remove');
                                $select.eq(i).selectpicker('setStyle', 'btn-danger', 'remove');
                                $select.eq(i).selectpicker('setStyle', 'btn-success', 'add');
                            }

                        } else {
                            console.log('mal:' + currentTargets[i] + '-' + $select.eq(i).find('option:selected').text());
                            if (correctPalancas) {
                                $select.eq(i).selectpicker('setStyle', 'btn-info', 'remove');
                                $select.eq(i).selectpicker('setStyle', 'btn-danger', 'remove');
                                $select.eq(i).selectpicker('setStyle', 'btn-danger');
                            }
                        }

                    }
                    if (rightPalancas == $select.length) {
                        //Disabled palanacas
                        for (var i = 0; i < $select.length; i++) {
                            $select.eq(i).selectpicker('setStyle', 'btn-info', 'remove');
                            $select.eq(i).selectpicker('setStyle', 'btn-danger', 'remove');
                            $select.eq(i).selectpicker('setStyle', 'btn-success', 'add');
                            $select.eq(i).prop('disabled', true);
                        }
                        $('.selectpicker').selectpicker('render');

                        if (Simulator.Animation.started) {
                            Simulator.Animation.reset();
                            Simulator.hideGraph();
                        }

                        //true because the palancas were filled correctly

                        Simulator.loadFaces();
                        setTimeout(function () {
                            Simulator.loadGraph(true);
                        }, 150);
                        setTimeout(function () {
                            Simulator.Animation.startAnimation(true);
                        }, 1000);
                        //Disabled check button
                        $('#check_window2').attr('disabled', true);
                        $('#validate_window2').attr('disabled', true);
                        $('#reset_palancas').attr('disabled', true);
                        Simulator.simulationEnd = true;
                    } else if (!correctPalancas) {
                        //false because the palancas were filled uncorrectly
                        if (Simulator.Animation.started) {
                            Simulator.Animation.reset();
                            Simulator.hideGraph();
                        }

                        Simulator.loadFaces("resignacion");
                        setTimeout(function () {
                            Simulator.loadGraph(false);
                        }, 150);
                        setTimeout(function () {
                            Simulator.Animation.startAnimation(false);
                        }, 1000);
                        //Disabled check button
                        $('#check_window2').attr('disabled', true);
                        $('#validate_window2').attr('disabled', true);
                    }

                } else {
                    interval = setInterval(function () {
                        blink();
                    }, 200 * Simulator.config.speed);
                }



            });

            $('#reset_palancas').click(function () {
                var $select = $('#palancas select.selectpicker');
                for (var i = 0; i < $select.length; i++) {
                    $select.eq(i).selectpicker('val', '--Selecciona una--');
                    $select.eq(i).selectpicker('setStyle', 'btn-info', 'remove');
                    $select.eq(i).selectpicker('setStyle', 'btn-danger', 'remove');
                    $select.eq(i).selectpicker('setStyle', 'btn-success', 'remove');
                    $select.eq(i).selectpicker('setStyle', 'btn-default', 'add');
                    $select.eq(i).attr('data-selected', '0');
                }
                $select.selectpicker('render');
            });
        }
    },

    loadGraph: function (valid) {
        $('#graph').show();
        var $bars = $('#graph .bar .y-element');
        var height = 0;
        if (valid) {
            for (var i = 0; i < $bars.length; i++) {
                if (Simulator.current.mode.graph[i] != null) {
                    height = Simulator.current.mode.graph[i] / 5 * 130;

                } else if (Simulator.current.mode.nombre.indexOf('Pasión') != -1) {
                    height = 2 / 5 * 130;
                } else {
                    height = 4 / 5 * 130;
                }
                console.log('number' + i + '-height:' + height);
                $bars.eq(i).css("height", height + "px");
                $bars.eq(i).show();
                $bars.eq(i).parent().show({
                    duration: 1000,
                    easing: 'linear'
                });
            }
        } else {
            for (var i = 0; i < $bars.length; i++) {
                //Values to show when the user set the palancas wrong
                var valuesWrong = [3.5, 3.4, 3.2, 3.3];

                height = valuesWrong[i] / 5 * 130;
                console.log('number' + i + '-height:' + height);
                $bars.eq(i).css("height", height + "px");
                $bars.eq(i).show();
                $bars.eq(i).parent().show({
                    duration: 600,
                    easing: 'linear'
                });
            }

        }
    },

    hideGraph: function () {
        var $bars = $('.bar .y-element');
        for (var i = 0; i < $bars.length; i++) {
            height = 0;
            $bars.eq(i).css("height", height + "px");
            $bars.eq(i).hide();
        }

    },
    loadFaces: function (face) {

        var faceType;
        if (typeof face == 'undefined') {
            faceType = Simulator.normalize(Simulator.current.mode.nombre).toLowerCase().replace(/.*\s/, '');
        } else {
            faceType = face;
        }
        if (Simulator.faceLoad != faceType) {
            if (Simulator.faceLoad != false) {
                console.log('face:' + Simulator.faceLoad + ' to false');
                $('[data-face*="' + Simulator.faceLoad + '"]').slideToggle();

            }
            $('[data-face*="' + faceType + '"]').slideToggle();
            Simulator.faceLoad = faceType;
            console.log('face:' + Simulator.faceLoad);
        }
    },
    /**
     * Move the application canvas around.
     * @param  {int}   position Position, 0= Initial, 1= Animation position
     * @param  {Function} callback Callback after its done
     * @return {void}
     */
    moveAnimation: function (position, callback) {
        // Positions array
        // [x, y, time, wait]
        var positions = [
            [0, 0, 2000, 0], // Initial
            [0, -920, 2000, 2000], // People
            [0, -1100, 2000, 0], // Right of people
            [100, -740, 1000, 0] // Results
        ];

        pos = {
            top: positions[position][0] + 'px',
            left: positions[position][1] + 'px'
        };

        console.log("moveAnimation(), pos: ", pos);
        setTimeout(function () {
            $('#app').animate(pos, positions[position][2] * Simulator.config.speed, 'swing', callback);
        }, positions[position][3] * Simulator.config.speed);
    },
    //+ Jonas Raoni Soares Silva
    //@ http://jsfromhell.com/array/shuffle [v1.0]
    shuffle: function (o) { //v1.0
        for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    },
    //+Carlos Benitez
    //@http://www.etnassoft.com/2011 / 03 / 03 / eliminar - tildes - con - javascript /
    normalize: function (text) {
        var acentos = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç";
        var original = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc";
        for (var i = 0; i < acentos.length; i++) {
            text = text.replace(acentos.charAt(i), original.charAt(i));
        }
        return text;
    },
    resize: function () {
        var simOff = $('#simulador').offset(),
            footerOff = $('footer').offset(),
            footerHeight = $('footer').height(),
            win = $(window).height(),
            height = Math.max(win - simOff.top - footerHeight - 70, 374);
        $('#simulador').height(height);
        $('#conclusiones').css({
            maxHeight: height + "px"
        });

        //        $('.animation').each(function () {
        //            var top = height / 2 - $(this).height() / 2 + 40;
        //            $(this).css({
        //                top: top
        //            });
        //        });
    },
    Animation: {
        started: false,
        questionTimers: [],
        timeout: 0,
        elements: {
            animation: jQuery('#animacion'),
            circle: jQuery('#circle'),
            people: jQuery('#people'),
            spinner: jQuery('#spinner'),
            questions: {
                global: jQuery('#questions'),
                q1: jQuery('#q1'),
                q2: jQuery('#q2'),
                q3: jQuery('#q3')
            },
            pyramid: {
                global: jQuery('#pyramid'),
                result: jQuery('#result'),
                comments: {
                    global: jQuery('#comments'),
                    cm1: jQuery('#cm1'),
                    cm2: jQuery('#cm2'),
                    cm3: jQuery('#cm3')
                }
            }
        },
        startAnimation: function (valid) {
            //show the basic elements of the Animation
            this.elements.spinner.fadeIn();
            this.moveSpinner();
            this.animateQuestionMark();
            if (valid == true) {
                this.showRightComments();
            } else {
                this.showWrongComments();
            }
            setTimeout(function () {
                Simulator.Animation.stopSpinner();
            }, Simulator.Animation.timeout / 2);
            setTimeout(function () {
                if (valid == true)
                    Simulator.Animation.showRightResult();
                else
                    Simulator.Animation.showWrongResult();

                if (!Simulator.simulationEnd) {
                    $('#validate_window2').attr('disabled', false);
                    if (Simulator.config.numberIntents == 0) {
                        $('#check_window2').attr('disabled', false);
                        $('#check_window2').removeClass('btn-danger');
                        $('#check_window2').addClass('btn-primary');
                    } else {
                        Simulator.config.numberIntents--;
                    }
                } else {
                    $('#palancas').append('<a href="javascript:window.location.reload()" class="btn btn-warning  btn-sm" id="check_window2" style="margin-left:15px;">Reiniciar</a>');
                }
            }, Simulator.Animation.timeout);
            this.started = true;
        },
        moveSpinner: function () {
            this.elements.spinner.addClass('animated');
        },
        stopSpinner: function () {
            this.elements.spinner.one('animationiteration webkitAnimationIteration', function () {
                $(this).removeClass("animated");
            });
        },
        animateQuestionMark: function () {

            // Show
            Simulator.Animation.questionTimers[0] = setTimeout(function () {
                Simulator.Animation.elements.questions.q1.fadeToggle(400 * Simulator.config.speed);
            }, 100 * Simulator.config.speed);

            Simulator.Animation.questionTimers[1] = setTimeout(function () {
                Simulator.Animation.elements.questions.q2.fadeToggle(400 * Simulator.config.speed);
            }, 700 * Simulator.config.speed);

            Simulator.Animation.questionTimers[2] = setTimeout(function () {
                Simulator.Animation.elements.questions.q3.fadeToggle(400 * Simulator.config.speed);
            }, 1300 * Simulator.config.speed);

            // Hide

            Simulator.Animation.questionTimers[0] = setTimeout(function () {
                Simulator.Animation.elements.questions.q2.fadeToggle(400 * Simulator.config.speed);
            }, 2500 * Simulator.config.speed);

            Simulator.Animation.questionTimers[1] = setTimeout(function () {
                Simulator.Animation.elements.questions.q1.fadeToggle(400 * Simulator.config.speed);
            }, 3100 * Simulator.config.speed);

            Simulator.Animation.questionTimers[2] = setTimeout(function () {
                Simulator.Animation.elements.questions.q3.fadeToggle(400 * Simulator.config.speed);
            }, 5000 * Simulator.config.speed);

            // Show

            Simulator.Animation.questionTimers[0] = setTimeout(function () {
                Simulator.Animation.elements.questions.q2.fadeToggle(400 * Simulator.config.speed);
            }, 6500 * Simulator.config.speed);

            Simulator.Animation.questionTimers[1] = setTimeout(function () {
                Simulator.Animation.elements.questions.q3.fadeToggle(400 * Simulator.config.speed);
            }, 7300 * Simulator.config.speed);

            Simulator.Animation.questionTimers[2] = setTimeout(function () {
                Simulator.Animation.elements.questions.q1.fadeToggle(400 * Simulator.config.speed);
            }, 7600 * Simulator.config.speed);

            // Hide

            Simulator.Animation.questionTimers[0] = setTimeout(function () {
                Simulator.Animation.elements.questions.q3.fadeOut(400 * Simulator.config.speed);
            }, 8000 * Simulator.config.speed);

            Simulator.Animation.questionTimers[1] = setTimeout(function () {
                Simulator.Animation.elements.questions.q1.fadeOut(400 * Simulator.config.speed);
            }, 8400 * Simulator.config.speed);

            Simulator.Animation.questionTimers[2] = setTimeout(function () {
                Simulator.Animation.elements.questions.q2.fadeOut(400 * Simulator.config.speed);
                Simulator.Animation.timeout -= 8800 * Simulator.config.speed;
            }, 8800 * Simulator.config.speed);

            //Add Max Timeout
            Simulator.Animation.timeout += 8800 * Simulator.config.speed;
        },
        showRightResult: function () {
            if (typeof (Simulator.current.mode.sig_culturales) !== 'undefined') {
                Simulator.Animation.elements.pyramid.result.append(Simulator.current.mode.ref_culturales.replace(/;/, '<br>'));

            } else {
                Simulator.Animation.elements.pyramid.result.append(Simulator.current.mode.ref_emocionales.replace(/;/g, '<br>'));
            }
            Simulator.Animation.elements.pyramid.result.fadeIn();
        },
        showWrongResult: function () {
            Simulator.Animation.elements.pyramid.result.append('Palancas con configuracion erronea');
            Simulator.Animation.elements.pyramid.result.fadeIn();
        },
        showRightComments: function () {
            Simulator.Animation.elements.pyramid.comments.global.fadeIn();
            if (typeof (Simulator.current.mode.sig_culturales) !== 'undefined') {
                setTimeout(function () {
                    Simulator.Animation.elements.pyramid.comments.cm1.append(Simulator.current.mode.sig_culturales[0]);
                }, 1800 * Simulator.config.speed);
                setTimeout(function () {
                    Simulator.Animation.elements.pyramid.comments.cm2.append(Simulator.current.mode.sig_culturales[1]);
                }, 1800 * Simulator.config.speed * 2);
                setTimeout(function () {
                    Simulator.Animation.elements.pyramid.comments.cm3.append(Simulator.current.mode.sig_culturales[2]);
                }, 1800 * Simulator.config.speed * 3);

            } else {
                setTimeout(function () {
                    Simulator.Animation.elements.pyramid.comments.cm1.append(Simulator.current.mode.sig_emocionales[0]);
                }, 1800 * Simulator.config.speed);
                setTimeout(function () {
                    Simulator.Animation.elements.pyramid.comments.cm2.append(Simulator.current.mode.sig_emocionales[1]);
                }, 1800 * Simulator.config.speed * 2);
                setTimeout(function () {
                    Simulator.Animation.elements.pyramid.comments.cm3.append(Simulator.current.mode.sig_emocionales[2]);
                }, 1800 * Simulator.config.speed * 3);
            }
        },
        showWrongComments: function () {
            Simulator.Animation.elements.pyramid.comments.global.fadeIn();
            setTimeout(function () {
                Simulator.Animation.elements.pyramid.comments.cm1.text('xxxxxxxxxxxxxxxxx');
            }, 1800 * Simulator.config.speed);
            setTimeout(function () {
                Simulator.Animation.elements.pyramid.comments.cm2.text('xxxxxxxxxxxxxxxxx');
            }, 1800 * Simulator.config.speed * 2);
            setTimeout(function () {
                Simulator.Animation.elements.pyramid.comments.cm3.text('xxxxxxxxxxxxxxxxx');
            }, 1800 * Simulator.config.speed * 3);

        },
        reset: function () {
            //hide comments
            Simulator.Animation.elements.pyramid.comments.global.fadeOut();
            //hide results
            Simulator.Animation.elements.pyramid.result.fadeOut();
            //hide all
            Simulator.Animation.elements.spinner.fadeOut();
            //clean 3 comments
            for (var u = 0; u < 3; u++) {
                var element = u + 1;
                Simulator.Animation.elements.pyramid.comments["cm" + element].text('');
            }
            //clean result
            Simulator.Animation.elements.pyramid.result.text('');


        }



    }
}