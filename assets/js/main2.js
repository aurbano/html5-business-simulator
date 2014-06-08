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
		speed: 0.9, // Modificador de la velocidad. 1 : Normal; >1 : Más lento; <1 : Más rapido
		wheel: 4, // Tiempo (s) que tarda en dar una vuelta entera la rueda, relativo a la velocidad del simulador
	},

	start: function(){
		console.log('Empezando Simulador 2');
	}

};
