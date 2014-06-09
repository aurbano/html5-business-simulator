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
				sig_energia: [
					'Es un buen sitio para trabajar (seguridad, salarios, ritmo, etc)',
					'¿Para qué cambiar o esforzarse? No  hay muchos retos',
					'Nuestros "jefes" siguen un estilo de orden y control pero es paternalista y predecible'
				]
			},
			{
				nombre: 'Resignación',
				sig_energia: [
					'Nos engañan - esto no merece la pena',
					'Aunque suene a nuevo, es lo de siempre',
					'No hay nada que pueda hacer, esto no se puede cambiar'
				]
			},
			{
				nombre: 'Pasión',
				sig_energia: [
					'Este proyecto realmente merece la pena; veo la visión y realmente me entusiasma',
					'Los responsables de esta organización confían en nosotros',
					'Las personas somos clave para la organización por lo que se busca nuestro desarrollo profesional'
				]
			},
			{
				nombre: 'Agresión',
				sig_energia: [
					'No es una opción fracasar; no nos van a sacar del mercado!!',
					'Es probable que perdamos el empleo si no superamos los retos de mercado más inmediatos',
					'Los responsables son exigentes; no hay margen de error'
				]
			}
		],
		// Aqui se pone el prefijo, los que extiende, y los comentarios extra
		culturales: [
			{
				prefijo: 'Logro',
				extiende: [
					'Pasión',
					'Agresión'
				],
				sig_cultural: [
					'Se cumplen los compromisos con rigor y responsabilidad',
					'El resultado si o si, la honestidad, el logro en lugar del esfuerzo, la disciplina',
					'Materializamos los objetivos relacionados con la productividad, la calidad, el gasto, etc es lo importante'
				]
			},

			{
				prefijo: 'Cliente',
				extiende: [
					'Pasión',
					'Agresión'
				],
				sig_cultural: [
					'Fomentamos una comprensión íntima del cliente para que todas las decisiones estén orientadas a cubrir sus necesidades',
					'Escuchamos al cliente, somos flexibles para adpatarnos a sus necesidades, tenemos vocación de servicio.'
				]
			},

			{
				prefijo: 'Innovación',
				extiende: [
					'Pasión'
				],
				sig_cultural: [
					'Perseguimos ser único, lo que nunca antes se ha hecho, buscando los máximos estándares',
					'Nos caracteriza la curiosidad, aprender del fracaso, ser creativos y desafiar al status quo.',
					'Se fomenta la experimentación, la vigilancia y el aprendizaje'
				]
			},

			{
				prefijo: 'Eq.-Pers.',
				extiende: [
					'Pasión'
				],
				sig_cultural: [
					'Priorizamos el bien común con un compromiso y apoyo en las personas.',
					'Las personas son la esencia de esta organización',
					'Nos caracterizamos por la cooperación, el respeto, el "empowerment".'
				]
			}
		]
	},


	// Codigo

	start: function () {
		console.log('Empezando Simulador 2');

		$(window).resize(function () {
			Simulator.resize();
		});

		Simulator.resize();

		var $seleccion = $('#seleccion');

		// Rellena el campo de seleccion
		for(var i=0; i<Simulator.modos.emocionales.length; i++){
			$seleccion.append('<a class="btn btn-default" href="#">'+Simulator.modos.emocionales[i].nombre+'</a> ');
		}

		$seleccion.append('<hr />');

		for(var i=0; i<Simulator.modos.culturales.length; i++){
			var modo = Simulator.modos.culturales[i];
			for(var a=0;a<modo.extiende.length;a++){
				$seleccion.append('<a class="btn btn-primary" href="#">'+modo.prefijo+' '+modo.extiende[a]+'</a> ');
			}
		}

	},

	resize: function () {
		var simOff = $('#app').offset(),
			footerOff = $('footer').offset(),
			footerHeight = $('footer').height(),
			win = $(window).height(),
			height = Math.max(win - simOff.top - footerHeight - 50, 374);
		$('#app .panel').height(height);

		$('.animation').each(function () {
			var top = height / 2 - $(this).height() / 2 + 40;
			$(this).css({
				top: top
			});
		});
	}

};
