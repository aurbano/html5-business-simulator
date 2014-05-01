/**
 * Main application code for Mondragon's simulator 3
 * @author Alejandro U. Alvarez <alejandro@urbanoalvarez.es>
 */

Simulator = {

	// Para configurar el Simulador unicamente se deberian modificar los parametros a continuacion
	// todos ellos estan explicados a continuacion.
	// Para arrancar el simulador hay que llamar a 'Simulator.start();''
	config: {
		debug: true, // Turn console debugging on/off
		speed: 1, // Modificador de la velocidad. 1 : Normal; >1 : Más lento; <1 : Más despacio
	},

	// "Palancas" -> Nombre y opciones
	// Las opciones deben ir en orden (columna 1, columna 2 y columna 3)
	palancas: [
		{
			name: "Liderazgo",
			opciones: ["Clásico", "Transformacional"]
		},
		{
			name: "Formación",
			opciones: ['La justa/sólo para la "tarea"', 'Se potencia el desarrollo profesional']
		},
		{
			name: "Transparencia en las cuentas",
			opciones: ["No existe", "Total. Se comparten sistemáticamente."]
		},
		{
			name: "Participación en los beneficios",
			opciones: ["No", "Si"]
		},
		{
			name: "Incentivos individuales",
			opciones: ["Basados en niveles de productividad/calidad", "No existen"]
		},
		{
			name: "Autonomía en el trabajo",
			opciones: ["Limitada a la ejecución de la tarea", "Amplia (Calidad, objetivos...)"]
		},
		{
			name: "Participación en la estrategia",
			opciones: ["Inexistente", "La mayor posible"]
		}
	],

	// Cada Array corresponde con una columna.
	// Los elementos 4 y 5 se muestran alternativamente de manera aleatoria.
	comments: [
		[
			"La organización no confía en nosotros/as",
			"No somos parte del proyecto",
			'Somos un "recurso" al servicio de un proyecto ajeno a nosotros',
			'En esta organización hago el esfuerzo justo, y si tenemos la suerte de trabajar menos por averías/ineficiencias... mejor!',
		],
		[
			"Parece que confian en nosotros/as",
			"Por el momento no somos parte del proyecto, pero en un futuro...",
			'Parece que somos un "activo" clave',
			'Están confiando en nosotros y parece que reconocen nuestro potencial para aportar y hacer sostenible el proyecto.',
			'Es un engaño, pues se trata de una iniciativa disfrazada de buenas palabras para darnos otra "vuelta de tuerca" más!',

		],
		[
			"La organización confía en nosotros/as",
			"Somos parte del proyecto",
			'Somos un "activo" clave para el éxito del proyecto',
			'Nos esforzamos continuamente para mejorar la calidad del servicio que ofrecemos a nuestros clientes',
			'Realizamos esfuerzos extra en el trabajo para que el proyecto tenga éxito.'
		]
	],

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

	tasks: [
		{
			text: 'Configura, por favor, las siguientes palancas siguiendo una lógica clásica de poco compromiso en las personas.',
			target: [0, 0, 0, 0, 0, 0, 0]
		},
		{
			text: 'La gerencia decide probar una nueva iniciativa, modifica por favor la configuración de Autonomía',
			target: [0, 0, 0, 0, 0, 1, 0]
		},
		{
			text: 'Por favor, vuelve a configurar nuevamente el sistema de prácticas, pero en este caso sigue un planteamiento de compromiso total en las personas.',
			target: [1, 1, 1, 1, 1, 1, 1]
		}
	],

	conclusiones: [
		{
			text: 'Las diferentes palancas se encuentran interrelacionadas, constituyendo un sistema (o configuración) más o menos coherente.'
		},
		{
			text: 'Las personas se encuentran continuamente atribuyendo significados (de forma colectiva) a los cambios / contenidos de las palancas. Es una forma de reducir la incertidumbre y un paso clave para la generación de valores y normas compartidas (cultura). De esta forma, se generan comportamientos colectivos de un tipo u otro.'
		},
		{
			text: 'Cualquier evento (p.ej. modificación de una palanca) está transmitiendo un "mensaje" al colectivo. De la misma forma, no modificar nunca un evento, sigue transmitiendo un "mensaje" al colectivo. El conjunto de palancas que constituyen el sistema / configuración transmitirá por tanto un conjunto de mensajes coherentes (o no).'
		},
		{
			text: 'Cualquier nuevo evento, será interpretado desde la cultura previamente generada y se le atribuirá un significado acorde a los significados creados para el resto de palancas. Esto es, el significado que se le atribuye a un nuevo evento estará fuertemente influenciado por cómo están configuradas otras palancas y los significados previamente construidos.'
		},
		{
			text: 'Una iniciativa aislada (p.ej. Implantar un mayor nivel de autonomía) puede generar ciertas expectativas que se materializan a corto plazo en una respuesta positiva por parte de las personas. Sin embargo, si no se materializan cambios en el resto de palancas que constituyen el sistema, las personas estarán percibiendo mensajes contradictorios (contexto "débil" - configuración o sistema incoherente) y la iniciativa tendrá previsiblemente un recorrido corto (en el mejor de los casos, pues las personas pueden sentirse engañadas y defraudadas). En este último caso, la respuesta resultante (a nivel colecitvo) es peor que no realizando ningún cambio. En resumen, es muy improbable modificar el "mensaje" atribuido por las personas a la configuración cambiando sólo una parte de la misma. O bien se cambia toda la configuración o bien se corre el riesgo de generar respuestas / reacciones contraproducentes.'
		},
		{
			text: 'Al mismo acto / hecho / evento se le pueden atribuir diferentes significados. De esta forma se explica por qué diferentes colectivos puden responder de forma muy diferente a una misma iniciativa. Ello se debe a que el significado de se le atribuye a la iniciativa depende del significado que han construido / atribuido al sistema / configuración en su conjunto. Lo que se debe tener en cuenta es la coherencia del "mensaje", es decir, "hacer lo que se dice".'
		}
	],

	// ------------------------------------------- //
	target: false, // Current target position for all settings
	editable: false, // Could the settings be editable? Should be false during animation cycles.
	currentResult: -1, // Current result index
	animationPhase: 0, // Current animation phase
	lastConclusion: -1,

	// ------------------------------------------- //
	/**
	 *  Launch the simulator
	 */
	start: function () {

		// ---------- SIMULATOR CONFIGURATION AND SETUP ------------- //

		$(window).resize(function () {
			Simulator.resize();
		});

		Simulator.setup();

		Simulator.resize();

		Simulator.disableSettings();

		$('#help').click(function (e) {
			e.preventDefault();
			$('#help-modal').modal();
		});

		// Adjust spinner speed
		$('#spinner').css({
			'-webkit-animation-duration': 5 * Simulator.config.speed + 's'
		});

		Simulator.$tarea = $('#instruction-modal');

		// ---------------------------------------------------------- //
		// ---------------------------------------------------------- //
		// 
		if (!Simulator.config.debug) {
			console = {
				log: function (text) {}
			};
		}

		// Initial task and target setup
		Simulator.newTask(0);

		var status;

		$('#palancas input').click(function (e) {

			Simulator.showConclusion(0);

			status = Simulator.getStatus();

			if (status.status) {
				// All are ok
				// Since this is task 1, they must all be in the first setting
				console.log('start: Start simulation phase ' + Simulator.animationPhase);
				Simulator.startAnimation(Simulator.animationPhase);

				if (Simulator.animationPhase == 3) {
					Simulator.showConclusion(5);
				}
			} else {
				Simulator.highlightTarget();
			}
		});
	},

	/**
	 * Show the new task modal with the updated text
	 * @param  {String} task
	 * @return {void}
	 */
	newTask: function (task) {
		console.log("Starting new phase: " + task);

		if (task > 0) Simulator.moveAnimation(0);

		$('.bubble').hide();
		Simulator.hideBoss();
		$('#result').hide();
		$('.messages .message').remove();

		Simulator.editable = true;
		Simulator.$tarea.find(".modal-body").html(Simulator.tasks[task].text);
		Simulator.$tarea.modal().on('hidden.bs.modal', function () {
			Simulator.enableSettings();
		});
		Simulator.target = Simulator.tasks[task].target;
	},

	/* ----------------------------------------- */
	/*           INTERNAL FUNCTIONS              */

	/**
	 * Display the setting buttons
	 * @return {void}
	 */
	setup: function () {
		$('#palancas').html();

		// Test element
		var div = document.createElement('div');
		document.body.appendChild(div);
		$(div).css({
			position: 'absolute',
			left: -1000,
			top: -1000,
			display: 'none'
		});


		for (var i = Simulator.palancas.length - 1; i >= 0; i--) {

			// Get the max possible width
			var largest = Simulator.palancas[i].name;
			if (Simulator.palancas[i].opciones[0].length > largest.length) largest = Simulator.palancas[i].opciones[0];
			if (Simulator.palancas[i].opciones[1].length > largest.length) largest = Simulator.palancas[i].opciones[1];
			$(div).text(largest);
			var width = $(div).width() + 30; // + padding

			var btn = '<button class="btn btn-default" data-setting="' + i + '" style="width: ' + width + 'px">' +
				'<span class="btn-title">' + Simulator.palancas[i].name + '</span>' +
				'<span class="btn-value" data-index="-1">-</span>' +
				'</button>';
			$('#palancas').prepend(btn);
		}

		$('#palancas').append('<p style="margin-bottom:-10px"><input type="button" class="btn btn-primary" value="Comprobar"/></p>');

		// Set them up to change on click and trigger the change event
		$('#palancas button').click(function (e) {
			e.preventDefault();

			var setting = $(this).attr('data-setting'),
				index = parseInt($(this).find('.btn-value').attr('data-index')) + 1; // Next index

			if (parseInt($(this).find('.btn-value').attr('data-index')) == -1) {
				index = Math.round(Math.random()); // 0-1
			} else {
				// Get current index
				if (typeof (Simulator.palancas[setting].opciones[index]) == 'undefined') {
					// The next element doesn't exist, back to 0
					index = 0;
				}
			}

			$(this).find('.btn-value').attr('data-index', index).text(Simulator.palancas[setting].opciones[index]);

			$(this).trigger('change');
		});
	},

	/**
	 * Return the combined status of all user settings.
	 * If all the items are configured in one of the three states then it will
	 * return its number, if not it will return the index of the faulty settings.
	 * @return {Array} 0=> valid (true, false). If true, 1=> Column index (0-3). If false 1=> Array with the faulty settings.
	 */
	getStatus: function () {

		var mostPopular = 0,
			faulty = [],
			palancas = $('#palancas button'),
			target = Simulator.target;

		// Check if there is a defined target
		if (!target) {
			mostPopular = Simulator.findPopular();
			target = [];
			for (var i = 0; i < Simulator.palancas.length; i++) {
				target.push(mostPopular);
			}
		}

		// Now compare each setting with the target settings
		for (var i = 0; i < palancas.length; i++) {
			if (Simulator.getValue($(palancas[i])) - target[i] !== 0) {
				faulty.push(i);
				//$(palancas[i]).removeClass('btn-default').removeClass('btn-success').addClass('btn-danger');
			} else {
				//$(palancas[i]).removeClass('btn-default').removeClass('btn-danger').addClass('btn-success');
			}
		}

		if (faulty.length === 0) {
			console.log('getStatus: All settings are OK');
			return {
				status: true
			};
		}

		console.log("getStatus: Faulty settings: ", faulty);

		return {
			status: false,
			faulty: faulty
		};
	},

	/**
	 * Returns the value of the specified setting. Abstracts the code from the HTML used.
	 * Uncomment the first line if using selects instead of 2 line buttons.
	 * @param  {DOM element} $obj Reference to the DOM element.
	 * @return {String}      The value of the button
	 */
	getValue: function ($obj) {
		//return $obj.val(); // Uncomment if using selects
		return $obj.find('.btn-value').attr('data-index');
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
			[0, -740, 2000, 2000], // People
			[0, -1100, 2000, 0], // Right of people
			[100, -740, 1000, 0] // Results
		];

		pos = {
			top: positions[position][0] + 'px',
			left: positions[position][1] + 'px'
		};

		Simulator.highlightWrong();

		console.log("moveAnimation(), pos: ", pos);
		setTimeout(function () {
			$('#app').animate(pos, positions[position][2] * Simulator.config.speed, 'swing', callback);
		}, positions[position][3] * Simulator.config.speed);
	},

	/**
	 * Highlight the right/wrong columns
	 * @return {void}
	 */
	highlightWrong: function () {
		var right = Simulator.findPopular(),
			palancas = $('#palancas button');

		for (var i = 0; i < palancas.length; i++) {
			if (Simulator.getValue($(palancas[i])) - right !== 0) {
				$(palancas[i]).removeClass('btn-default').removeClass('btn-success').addClass('btn-danger');
			} else {
				$(palancas[i]).removeClass('btn-default').addClass('btn-success').removeClass('btn-danger');
			}
		}
	},

	/**
	 * Highlight the wrong columns according to the current target
	 * @return {void}
	 */
	highlightTarget: function () {
		var palancas = $('#palancas button');

		for (var i = 0; i < palancas.length; i++) {
			if (Simulator.getValue($(palancas[i])) - Simulator.target[i] !== 0) {
				$(palancas[i]).removeClass('btn-default').removeClass('btn-success').addClass('btn-danger');
			} else {
				$(palancas[i]).removeClass('btn-default').addClass('btn-success').removeClass('btn-danger');
			}
		}
	},

	/**
	 * Muestra la conclusion indicada por el parametro index, no la vuelve a mostrar
	 * si ya la habia mostrado antes
	 * @param  {int} index Numero de conclusion a mostrar
	 * @return {void}
	 */
	showConclusion: function (index) {
		if (index <= Simulator.lastConclusion) return;
		Simulator.lastConclusion = index;
		if (index > 0) $('#conclusiones').append('<hr />');
		$('#conclusiones').append(Simulator.conclusiones[index].text).scrollTop($('#conclusiones')[0].scrollHeight);
	},

	/**
	 * Starts a new animation sequence of the given type (Column)
	 * @param  {int} type Column index (0-2)
	 * @return {void}
	 */
	startAnimation: function (type) {
		console.log("startAnimation: Animation of type " + type + ' triggered! Blocking all settings');
		Simulator.editable = false;
		Simulator.disableSettings();
		Simulator.displayCircle();
		Simulator.moveAnimation(1, function () {
			Simulator.animateSpinner();
			if (type == 0) Simulator.showConclusion(1);
			Simulator.cycleComments(type, function () {

				var timing = 0;

				if (Simulator.gerente) {
					timing += 7000;
					setTimeout(function () {
						Simulator.showBoss();

						// This will trigger a new spinner and a new result
						Simulator.animateSpinner();
						Simulator.animateQuestionMark();
					}, timing * Simulator.config.speed);

					timing += 10000;

					setTimeout(function () {
						// Add consequence to the result box
						$('.messages').append('<div class="message ' + Simulator.gerente[type].style + '" style="margin:10px 0; font-weight:bold;">' + Simulator.gerente[type].text + '</div>');
					}, timing * Simulator.config.speed);
				}

				timing += 5000;

				setTimeout(function () {
					Simulator.animationPhase++;
					// If there are more tasks, restart the process
					if (Simulator.animationPhase < Simulator.tasks.length) {
						Simulator.newTask(Simulator.animationPhase);
					} else {
						alert("Has acabado la demostración.");
					}
				}, timing * Simulator.config.speed);
			});
		});
	},

	/**
	 * Displays the animation area
	 * @return {void}
	 */
	displayCircle: function () {
		$('.bubble').hide();
		Simulator.hideBoss();
		$('#result').hide();
		$('.messages .message').remove();
		$('#circle').fadeIn();
	},

	/**
	 * Triggers the animation again
	 * @return {void}
	 */
	animateSpinner: function () {
		console.log("animateSpinner()");
		$('#spinner').removeClass('animated').fadeIn();
		$('#spinner').prop('offsetWidth', $('#spinner').prop('offsetWidth'));
		setTimeout(function () {
			$('#spinner').addClass('animated');
		}, 10);
	},

	/**
	 * Start displaying the comments for the specified index
	 * in a timed order
	 * @param  {int} index Phase number
	 * @return {void}
	 */
	cycleComments: function (index, callback) {
		if (typeof (Simulator.comments[index]) == 'undefined')
			return;

		var times = [2000 * Simulator.config.speed, 5000 * Simulator.config.speed, 9000 * Simulator.config.speed],
			lastTime = times[times.length - 1],
			shouldMove = false;

		Simulator.animateQuestionMark();

		for (var i = 0; i < 3; i++) {
			Simulator.displayComment(index, i, times[i]);
		}

		// Check if there is an extra comment for this phase
		if (Simulator.comments[index].length > 3) {
			console.log("cycleComments: Phase " + index + " There are more comments, spin again and show them");

			setTimeout(function () {
				// More comments, turn again!
				Simulator.animateQuestionMark();
				Simulator.animateSpinner();
			}, lastTime);

			lastTime += 9000 * Simulator.config.speed;

			shouldMove = true;

			if (index > 1) {
				var display = 3;
				if (Simulator.comments[index].length > 4) {
					display = Math.floor((Math.random() * (Simulator.comments[index].length - 1)) + 3);
				}
				console.log('cycleComments: Phase ' + index + ', chosen randomly comment: ' + display);
				Simulator.displayComment(index, display, lastTime);
			} else {
				Simulator.displayComment(index, 3, lastTime);
			}

		}

		// In phase 2 we have to spin twice, and then show what they realized
		if (index == 1) {
			console.log("cycleComments: Phase 1, show the conclussion they get after a given time.");

			setTimeout(function () {
				// More comments, turn again!
				Simulator.animateSpinner();
				Simulator.animateQuestionMark();
			}, lastTime);

			shouldMove = true;

			lastTime += 9000 * Simulator.config.speed;
			Simulator.displayComment(index, 4, lastTime);
		}

		setTimeout(function () {
			if (shouldMove) {
				Simulator.moveAnimation(2);
				Simulator.showConclusion(3);
				setTimeout(function () {
					callback.call();
				}, 2000 * Simulator.config.speed);
			}
			if (index > 1) {
				Simulator.showConclusion(4);
			}
		}, lastTime);
	},

	/**
	 * Display the specified comment after time has passed
	 * @param  {int} phase   Current phase
	 * @param  {int} comment Comment index (0-3)
	 * @param  {int} time    Time in ms until the comment is displayed
	 * @return {void}
	 */
	displayComment: function (phase, comment, time) {
		setTimeout(function () {
			var id = comment + 1;
			if (id > 4) {
				id = 4;
				$('#m' + id).fadeOut(250, function () {
					$('#m' + id).html(Simulator.comments[phase][comment]).fadeIn();
				});
			} else {
				$('#m' + id).html(Simulator.comments[phase][comment]).fadeIn();
			}
		}, time);
	},

	animateQuestionMark: function () {
		Simulator.showConclusion(2);
		setTimeout(function () {
			$('#questions').fadeToggle();
		}, 100 * Simulator.config.speed);

		setTimeout(function () {
			$('#questions').fadeToggle();
		}, 2500 * Simulator.config.speed);

		setTimeout(function () {
			$('#questions').fadeToggle();
		}, 6500 * Simulator.config.speed);

		setTimeout(function () {
			$('#questions').fadeOut();
		}, 8000 * Simulator.config.speed);
	},

	/**
	 * Returns the most popular column
	 * @return {int} Most popular column (0-3)
	 */
	findPopular: function () {
		var eachColumnCount = [0, 0, 0],
			palancas = $('#palancas button');

		for (var i = 0; i < palancas.length; i++) {
			if (Simulator.getValue($(palancas[i])) < 0) {
				// Skip unselected values
				continue;
			}
			eachColumnCount[Simulator.getValue($(palancas[i]))]++;
		}

		var mostPopular = 0;
		if (eachColumnCount[1] > eachColumnCount[0]) mostPopular = 1;
		if (eachColumnCount[2] > eachColumnCount[mostPopular]) mostPopular = 2;

		console.log("findPopular: Most popular column: " + mostPopular);
		return mostPopular;
	},

	/**
	 * Show the boss message
	 * @return {void}
	 */
	showBoss: function () {
		console.log("showBoss()");
		Simulator.moveAnimation(3);
		$('#boss').fadeIn().animate({
			top: '-100px'
		});
	},

	/**
	 * Hide the Boss
	 * @return {void}
	 */
	hideBoss: function () {
		$('#boss').fadeOut().css({
			top: '-400px'
		}, 3000 * Simulator.config.speed, 'swing');
	},

	/**
	 * Sets the settings into editable mode
	 */
	enableSettings: function () {
		if (!Simulator.editable) return;
		$('#palancas input').prop('disabled', false);
		$('#palancas').animate({
			backgroundColor: '#79B6FF'
		}, 600).find('button').prop('disabled', false);
	},

	/**
	 * Sets the settings into editable mode
	 */
	disableSettings: function () {
		$('#palancas input').prop('disabled', true);
		$('#palancas').animate({
			backgroundColor: '#DBDBDB'
		}, 400).find('button').prop('disabled', true);
	},

	resize: function () {
		var simOff = $('#simulador').offset(),
			footerOff = $('footer').offset(),
			footerHeight = $('footer').height(),
			win = $(window).height(),
			height = Math.max(win - simOff.top - footerHeight - 70, 374);
		$('#simulador').height(height);

		$('.animation').each(function () {
			var top = height / 2 - $(this).height() / 2 + 40;
			$(this).css({
				top: top
			});
		});
	}
};