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
			opciones: ["Clásico", "Clásico", "Transformacional"]
		},
		{
			name: "Formación",
			opciones: ['La justa/sólo para la "tarea"', 'Algo más', 'Se potencia el desarrollo profesional']
		},
		{
			name: "Transparencia en las cuentas",
			opciones: ["No existe", "No existe", "Total. Se comparten sistemáticamente."]
		},
		{
			name: "Participación en los beneficios",
			opciones: ["No", "No", "Si"]
		},
		{
			name: "Incentivos individuales",
			opciones: ["Basados en niveles de productividad/calidad", "Basados en niveles de productividad/calidad", "No existen"]
		},
		{
			name: "Autonomía en el trabajo",
			opciones: ["Limitada a la ejecución de la tarea", "Amplia (calidad, objetivos...", "Amplia (Calidad, objetivos...)"]
		},
		{
			name: "Participación en la estrategia",
			opciones: ["Inexistente", "Algo (Iniciativas timidas)", "La mayor posible"]
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
			'OP1: Es un engaño, pues se trata de una iniciativa disfrazada de buenas palabras para darnos otra "vuelta de tuerca" más!',
			'OP2: Están confiando en nosotros y parece que reconocen nuestro potencial para aportar y hacer sostenible el proyecto.'
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
		"¡Viene a controlarnos!",
		"",
		"Viene a escucharnos; Quiere estar cerca de nosotros/as"
	],

	result: [
		{
			index: 0,
			text: 'Mis 8 horitas y me voy cuanto antes y a ser posible con el menor trabajo posible.'
		},
		{
			index: 6,
			text: 'El proyecto de esta organización me ilusiona y mi labor para su materialización es importante.'
		}
	],

	// ------------------------------------------- //
	target: false, // Current target position for all settings
	currentResult: -1, // Current result index

	// ------------------------------------------- //
	/**
	 *  Launch the simulator
	 */
	start: function () {

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

		Simulator.startAnimation(0);

		// Initial task and target setup
		// Simulator.newTask(
		// 	'Configura, por favor, las siguientes palancas siguiendo una lógica clásica de poco compromiso en las personas.', [0, 0, 0, 0, 0, 0, 0]
		// );

		var status;

		$('#palancas select').change(function () {
			status = Simulator.getStatus();

			if (status.status) {
				// All are ok
				// Since this is task 1, they must all be in the first setting
				console.log('start: Settings match case 1, start animation!');
				Simulator.startAnimation(0);
			}
		});
	},

	/**
	 * Show the new task modal with the updated text
	 * @param  {String} task
	 * @return {void}
	 */
	newTask: function (task, target) {
		Simulator.$tarea.find(".modal-body").html(task);
		Simulator.$tarea.modal().on('hidden.bs.modal', function () {
			Simulator.enableSettings();
		});
		Simulator.target = target;
	},

	/* ----------------------------------------- */
	/*           INTERNAL FUNCTIONS              */

	/**
	 * Display all the buttons and get things ready
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
		Simulator.cycleComments(0);

		setTimeout(function () {
			Simulator.showResult(0);
		}, 10000 * Simulator.config.speed);


		setTimeout(function () {
			Simulator.showBoss();

			// This will trigger a new spinner and a new result
			Simulator.animateSpinner();
			Simulator.animateQuestionMark();
		}, 14000 * Simulator.config.speed);

		setTimeout(function () {
			// Add consequence to the result box
			$('#result').append('<p style="margin:10px 0; font-weight:bold;">' + Simulator.gerente[type] + '</p>');
		}, 19000 * Simulator.config.speed);
	},

	/**
	 * Displays the animation area
	 * @return {void}
	 */
	displayCircle: function () {
		$('.bubble').hide();
		$('#boss').hide();
		$('#result').hide();
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

		var times = [1000 * Simulator.config.speed, 3000 * Simulator.config.speed, 7000 * Simulator.config.speed];

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
		}, 500 * Simulator.config.speed);

		setTimeout(function () {
			$('#questions').fadeToggle();
		}, 1500 * Simulator.config.speed);

		setTimeout(function () {
			$('#questions').fadeToggle();
		}, 3500 * Simulator.config.speed);

		setTimeout(function () {
			$('#questions').fadeOut();
		}, 5000 * Simulator.config.speed);
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
			$('#result').html(text).fadeIn();
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