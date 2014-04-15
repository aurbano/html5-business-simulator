/**
 * Main application code for Mondragon's simulator 3
 * @author Alejandro U. Alvarez <alejandro@urbanoalvarez.es>
 */

Simulator = {
	// Para configurar el Simulador unicamente se deberian modificar los parametros a continuacion
	// todos ellos estan explicados a continuacion.
	// Para arrancar el simulador hay que llamar a 'Simulator.start();''
	config : {
		
	},
	
	// ------------------------------------------- //
	/**
	 *	Launch the simulator.
	 */
	start: function(){
		// Enable/disable logging
		if(!Simulator.config.debug){
			console = {
				log : function(text){}
			};
		}
	}
};