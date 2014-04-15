/**
 * Main application code for Mondragon's simulator 3
 * @author Alejandro U. Alvarez <alejandro@urbanoalvarez.es>
 */

Simulator = {

	// Para configurar el Simulador unicamente se deberian modificar los parametros a continuacion
	// todos ellos estan explicados a continuacion.
	// Para arrancar el simulador hay que llamar a 'Simulator.start();''
	config: {

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
		"Viene a controlarlos",
		"",
		"Viene a escucharnos; Quiere estar cerca de nosotros/as"
  ],

	// ------------------------------------------- //
	/**
	 *  Launch the simulator
	 */
	start: function () {

		Simulator.setup();

		$('#help').click(function (e) {
			e.preventDefault();
			$('#help-modal').modal();
		});

		Simulator.$tarea = $('#instruction-modal');

		//Simulator.newTask('Configura, por favor, las siguientes palancas siguiendo una lógica clásica de poco compromiso en las personas.');

		var status;

		$('#palancas select').change(function () {
			status = Simulator.getStatus();

			if(status.status){
				// All are ok
				// Since this is task 1, they must all be in the first setting
				if(status.column !== 0){
					console.log('They are not in the correct setting!');
				}else{
					console.log('Settings match case 1, start animation!');
					Simulator.startAnimation(0);
				}
			}
		});
	},

	/**
	 * Show the new task modal with the updated text
	 * @param  {String} task
	 * @return {void}
	 */
	newTask: function (task) {
		Simulator.$tarea.find(".modal-body").html(task);
		Simulator.$tarea.modal();
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
		var eachColumnCount = [0, 0, 0];
		var faulty = [];
		var palancas = $('#palancas select');

		for (var i = 0; i < palancas.length; i++) {
			if ($(palancas[i]).val() < 0) {
				// This setting hasn't been configured!
				console.log('Por favor configura todas las palancas!');
				return {
					status: false,
					message: 'Por favor configura todas las palancas!'
				};
			}
			eachColumnCount[$(palancas[i]).val()]++;
		}

		var mostPopular = 0;
		if (eachColumnCount[1] > eachColumnCount[0]) mostPopular = 1;
		if (eachColumnCount[2] > eachColumnCount[mostPopular]) mostPopular = 2;

		console.log("Most popular column: " + mostPopular);

		// Check if there are faulty settings
		if (eachColumnCount[mostPopular] == Simulator.palancas.length) {
			console.log('No faulty settings!');
			return {
				status: true,
				column: mostPopular
			};
		}

		palancas = $('#palancas select');

		for (i = 0; i < palancas.length; i++) {
			if ($(palancas[i]).val()-mostPopular !== 0) {
				faulty.push(i);
			}
		}

		console.log("Faulty settings: ", faulty);

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
	startAnimation: function(type){
		console.log("Animation of type "+type+' triggered! Blocking all settings');
		$('#palancas select').prop('disabled', true);
	}
};