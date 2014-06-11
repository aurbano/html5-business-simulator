/**
 * Main application code for Mondragon's simulator 3
 * @author Alejandro U. Alvarez <alejandro@urbanoalvarez.es>
 */

var Simulator = {

	// Para configurar el Simulador unicamente se deberian modificar los parametros a continuacion
	// todos ellos estan explicados a continuacion.
	// Para arrancar el simulador hay que llamar a 'Simulator.start();''
	config: {
		debug: true // Turn console debugging on/off
	},

	// Valores

	modos: {
		emocionales: [
			{
				nombre: 'Confort',
				sig_emocionales: [
					'Es un buen sitio para trabajar (seguridad, salarios, ritmo, etc)',
					'¿Para qué cambiar o esforzarse? No  hay muchos retos',
					'Nuestros "jefes" siguen un estilo de orden y control pero es paternalista y predecible'
				]
			},
			{
				nombre: 'Resignación',
				sig_emocionales: [
					'Nos engañan - esto no merece la pena',
					'Aunque suene a nuevo, es lo de siempre',
					'No hay nada que pueda hacer, esto no se puede cambiar'
				]
			},
			{
				nombre: 'Pasión',
				sig_emocionales: [
					'Este proyecto realmente merece la pena; veo la visión y realmente me entusiasma',
					'Los responsables de esta organización confían en nosotros',
					'Las personas somos clave para la organización por lo que se busca nuestro desarrollo profesional'
				]
			},
			{
				nombre: 'Agresión',
				sig_emocionales: [
					'No es una opción fracasar; no nos van a sacar del mercado!!',
					'Es probable que perdamos el empleo si no superamos los retos de mercado más inmediatos',
					'Los responsables son exigentes; no hay margen de error'
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
				]
			}
		]
	},

	// Variables internas
	current: {
		type: '',
		mode: {}
	},

	// Codigo

	start: function () {
		console.log('Empezando Simulador 2');

		$(window).resize(function () {
			Simulator.resize();
		});

		Simulator.resize();

		var $seleccion = $('#seleccion'),
			$select = $('#configuracion select optgroup'),
			used_messages = []; // Holder for the used messages, to avoid dupes

		// Rellena el campo de seleccion y los options
		for(var i=0; i<Simulator.modos.emocionales.length; i++){
			$seleccion.append('<a class="btn btn-default" href="#" data-type="emocionales" data-index="'+i+'">'+Simulator.modos.emocionales[i].nombre+'</a> ');
			// Select
			for(var a=0;a<Simulator.modos.emocionales[i].sig_emocionales.length;a++){
				if(used_messages.indexOf(Simulator.modos.emocionales[i].sig_emocionales[a])<0){
					used_messages.push(Simulator.modos.emocionales[i].sig_emocionales[a]);
					$select.append('<option>'+Simulator.modos.emocionales[i].sig_emocionales[a]+'</option>');
				}
			}
		}

		$seleccion.append('<hr />');

		for(var i=0; i<Simulator.modos.culturales.length; i++){
			var modo = Simulator.modos.culturales[i];
			for(var a=0;a<modo.extiende.length;a++){
				$seleccion.append('<a class="btn btn-primary" href="#" data-type="culturales" data-index="' + i + '" data-extends="' + modo.extiende[a] + '">' + modo.prefijo + ' ' + Simulator.modos.emocionales[modo.extiende[a]].nombre + '</a> ');
			}
			// Select
			for(var a=0;a<Simulator.modos.culturales[i].sig_culturales.length;a++){
				if(used_messages.indexOf(Simulator.modos.culturales[i].sig_culturales[a])<0){
					used_messages.push(Simulator.modos.culturales[i].sig_culturales[a]);
					$select.append('<option>'+Simulator.modos.culturales[i].sig_culturales[a]+'</option>');
				}
			}
		}

		// EVENTS ----------------

		// Click event on initial selection page
		$seleccion.find('a.btn').click(function(e){
			e.preventDefault();
			Simulator.current.type = $(this).attr("data-type");
			// Update current mode
			if(Simulator.current.type=="emocionales"){
				Simulator.current.mode = Simulator.modos.emocionales[$(this).attr("data-index")];
			}else{
				Simulator.current.mode = Simulator.modos.culturales[$(this).attr("data-index")];
				Simulator.current.mode.nombre = Simulator.current.mode.prefijo + ' ' + Simulator.modos.emocionales[$(this).attr("data-extends")].nombre;
				Simulator.current.mode.sig_emocionales = Simulator.modos.emocionales[$(this).attr("data-extends")].sig_emocionales;
			}
			console.log(Simulator.current);
			// Change title
			$('h3 span').text(' - ' + Simulator.current.mode.nombre);
			// Update message textarea
			$('#msgBox').html('Mensajes de '+ Simulator.current.mode.nombre);
			// Change window
			Simulator.windows.change(1);
		});

		// Clicks on second page
		$('#configuracion select').change(function(){
			$('#configMensaje').text($(this).val());
		});

		$('#showMsg').click(function(e){
			e.preventDefault();
			$(this).hide();
			$('#msgBox').fadeIn();
		});

		$('#configuracion a.next').click(function(e){
			e.preventDefault();
			Simulator.windows.change(2);
		});

	},

	windows: {

		current: 0,

		/**
		 * Change to another window
		 * index is the window reference, in the defined elements inside the function
		 */
		change: function(index, callback){
			var windows = [$('seleccion'), $('#configuracion'), $('#simulador')],
				breadcrumbs = $('.breadcrums');
			if(index == Simulator.windows.current) return;

			Simulator.windows.current = index;

			$('#app .panel').slideUp();
			windows[index].slideDown();

			// Reset title and current
			if(index == 0){
				$('h3 span').text('');

				Simulator.current = {};
			}

		}
	},

	resize: function () {
		var simOff = $('#app').offset(),
			footerOff = $('footer').offset(),
			footerHeight = $('footer').height(),
			win = $(window).height(),
			height = Math.max(win - simOff.top - footerHeight - 70, 374);
		$('#app .panel').height(height);

		$('.animation').each(function () {
			var top = height / 2 - $(this).height() / 2 + 40;
			$(this).css({
				top: top
			});
		});
	}

};
