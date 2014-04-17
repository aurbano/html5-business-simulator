/**
 * Main application code for Mondragon's simulator 3
 * @author Alejandro U. Alvarez <alejandro@urbanoalvarez.es>
 */

Simulator = {

	// Para configurar el Simulador unicamente se deberian modificar los parametros a continuacion
	// todos ellos estan explicados a continuacion.
	// Para arrancar el simulador hay que llamar a 'Simulator.start();''
	config: {
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
			'OP1: En esta organización hago el esfuerzo justo, y si tenemos la suerte de trabajar menos por averías/ineficiencias... mejor!',
			'OP2: blabla'
		],
		[
			"Parece que confian en nosotros/as",
			"Por el momento no somos parte del proyecto, pero en un futuro...",
			'Parece que somos un "activo" clave',
			'OP1: Están confiando en nosotros y parece que reconocen nuestro potencial para aportar y hacer sostenible el proyecto.',
			'OP2: Es un engaño, pues se trata de una iniciativa disfrazada de buenas palabras para darnos otra "vuelta de tuerca" más!',

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
		{
			text: '¡Viene a controlarnos!',
			style: 'bg-danger'
		},
		{
			text: 'Viene a escucharnos; Quiere estar cerca de nosotros/as',
			style: 'bg-success'
		}
	],

	result: [
		{
			index: 0,
			text: 'Mis 8 horitas y me voy cuanto antes y a ser posible con el menor trabajo posible.',
			style: 'bg-warning'
		},
		{
			index: 6,
			text: 'El proyecto de esta organización me ilusiona y mi labor para su materialización es importante.',
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

	// ------------------------------------------- //
	target: false, // Current target position for all settings
	currentResult: -1, // Current result index
	animationPhase: 0, // Current animation phase

	// ------------------------------------------- //
	/**
	 *  Launch the simulator
	 */
	start: function () {

		// ---------- SIMULATOR CONFIGURATION AND SETUP ------------- //

		Simulator.setup();

		Simulator.disableSettings();

		$('#help').click(function (e) {
			e.preventDefault();
			$('#help-modal').modal();
		});

		// Adjust spinner speed
		$('#spinner').css({
			'-webkit-animation-duration': 10 * Simulator.config.speed + 's'
		});

		Simulator.$tarea = $('#instruction-modal');

		// ---------------------------------------------------------- //
		// ---------------------------------------------------------- //

		// Initial task and target setup
		Simulator.newTask(0);

		var status;

		$('#palancas select').change(function () {

			status = Simulator.getStatus();

			if (status.status) {
				// All are ok
				// Since this is task 1, they must all be in the first setting
				console.log('start: Start simulation phase ' + Simulator.animationPhase);
				Simulator.startAnimation(Simulator.animationPhase);
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

		/*for (var i = Simulator.palancas.length - 1; i >= 0; i--) {
	      var btn = '<div class="btn-group">'+
	                    '<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">'+
	                      Simulator.palancas[i].name+' <span class="caret"></span>'+
	                    '</button>'+
	                    '<ul class="dropdown-menu" role="menu">';
	      for (var a = 0; a < Simulator.palancas[i].opciones.length; a++) {
	        btn += '<li><a href="#">'+Simulator.palancas[i].opciones[a]+'</a></li>';
	      }

	      btn +=        '</ul>'+
	                  '</div>';
	      $('#palancas').prepend(btn);
	    }*/

		for (var i = Simulator.palancas.length - 1; i >= 0; i--) {
			var btn = '<select class="form-control" data-index="' + i + '">' +
				'<option value="-1">' + Simulator.palancas[i].name + '</option>';
			for (var a = 0; a < Simulator.palancas[i].opciones.length; a++) {
				btn += '<option value="' + a + '">' + Simulator.palancas[i].opciones[a] + '</option>';
			}

			btn += '</select>';
			$('#palancas').prepend(btn);
		}
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
			palancas = $('#palancas select'),
			target = Simulator.target;

		palancas.css({
			background: 'white'
		});

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
			if ($(palancas[i]).val() - target[i] !== 0) {
				faulty.push(i);
				$(palancas[i]).css({
					background: 'rgba(255,0,0,0.1)'
				});
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
	 * Starts a new animation sequence of the given type (Column)
	 * @param  {int} type Column index (0-2)
	 * @return {void}
	 */
	startAnimation: function (type) {
		console.log("startAnimation: Animation of type " + type + ' triggered! Blocking all settings');
		Simulator.disableSettings();
		Simulator.displayCircle();
		Simulator.animateSpinner();
		Simulator.cycleComments(type);

		setTimeout(function () {
			Simulator.showResult(0);
		}, 13000 * Simulator.config.speed);


		setTimeout(function () {
			Simulator.showBoss();

			// This will trigger a new spinner and a new result
			Simulator.animateSpinner();
			Simulator.animateQuestionMark();
		}, 17000 * Simulator.config.speed);

		setTimeout(function () {
			// Add consequence to the result box
			$('.messages').append('<div class="message ' + Simulator.gerente[type].style + '" style="margin:10px 0; font-weight:bold;">' + Simulator.gerente[type].text + '</div>');
		}, 27000 * Simulator.config.speed);

		setTimeout(function () {
			// If there are more tasks, restart the process
			if (Simulator.animationPhase < Simulator.tasks.length) {
				Simulator.animationPhase++;
				Simulator.newTask(Simulator.animationPhase);
			} else {
				alert("Has acabado la demostración.");
			}
		}, 32000 * Simulator.config.speed);
	},

	/**
	 * Displays the animation area
	 * @return {void}
	 */
	displayCircle: function () {
		$('.bubble').hide();
		$('#boss').hide();
		$('#result').hide();
		$('.messages .message').remove();
		$('#circle').fadeIn();
	},

	/**
	 * Triggers the animation again
	 * @return {void}
	 */
	animateSpinner: function () {
		$('#spinner').removeClass('animated').fadeIn();
		$('#spinner').prop('offsetWidth', $('#spinner').prop('offsetWidth'));
		$('#spinner').addClass('animated');
	},

	/**
	 * Start displaying the comments for the specified index
	 * in a timed order
	 * @param  {int} index Phase number
	 * @return {void}
	 */
	cycleComments: function (index) {
		if (typeof (Simulator.comments[index]) == 'undefined')
			return;

		var times = [2000 * Simulator.config.speed, 5000 * Simulator.config.speed, 9000 * Simulator.config.speed];

		Simulator.animateQuestionMark();

		for (var i = 0; i < 3; i++) {
			Simulator.displayComment(index, i, times[i]);
		}
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
			$('#m' + (comment + 1)).html(Simulator.comments[phase][comment]).fadeIn();
		}, time);
	},

	animateQuestionMark: function () {
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
			palancas = $('#palancas select');

		for (var i = 0; i < palancas.length; i++) {
			if ($(palancas[i]).val() < 0) {
				// Skip unselected values
				continue;
			}
			eachColumnCount[$(palancas[i]).val()]++;
		}

		var mostPopular = 0;
		if (eachColumnCount[1] > eachColumnCount[0]) mostPopular = 1;
		if (eachColumnCount[2] > eachColumnCount[mostPopular]) mostPopular = 2;

		console.log("findPopular: Most popular column: " + mostPopular);
		return mostPopular;
	},

	/**
	 * Show the next result for the given index
	 * @param  {int} index Index corresponding to the current step
	 * @return {void}
	 */
	showResult: function (index) {

		$('#spinner').fadeOut();

		if (index > Simulator.currentResult) {
			var text = Simulator.result[0].text;
			// Get the next result with <= index
			for (var i = Simulator.currentResult; i < Simulator.result.length; i++) {
				if (typeof (Simulator.result[i]) == 'undefined') continue;
				if (Simulator.result[i].index > index) break;
				text = Simulator.result[i].text;
				console.log("showResult: Valid result (Index=" + i + "): " + text);
			}
			// Display the text and the result
			$('.messages').append('<div id="result" class="message ' + Simulator.result[i].style + '">' + text + '</div>').fadeIn();
		} else {
			$('#result').fadeIn();
		}
	},

	/**
	 * Show the boss message
	 * @return {void}
	 */
	showBoss: function () {
		$('#boss').fadeIn();
	},

	/**
	 * Sets the settings into editable mode
	 */
	enableSettings: function () {
		$('#palancas').animate({
			backgroundColor: '#79B6FF'
		}, 600).find('select').prop('disabled', false);
	},

	/**
	 * Sets the settings into editable mode
	 */
	disableSettings: function () {
		$('#palancas').animate({
			backgroundColor: '#DBDBDB'
		}, 400).find('select').prop('disabled', true);
	}
};