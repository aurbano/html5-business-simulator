/**
 * Main application code for Mondragon's simulators
 * @author Alejandro U. Alvarez <alejandro@urbanoalvarez.es>
 */

 Simulator = {

	// Para configurar el Simulador unicamente se deberian modificar los parametros a continuacion
	// todos ellos estan explicados a continuacion.
	// Para arrancar el simulador hay que llamar a 'Simulator.start();''
	config : {
		cycle: 100,				// Tiempo entre cada comprobacion. Decrementarlo hace mas rapida la simulacion
		maxGrowth: 100,			// Maximo crecimiento, deberia ser 100 siempre
		needsRangeUnder: 10,	// El nivel de crecimiento actual menos esto es el minimo de cada palanca
		needsRangeOver: 10,		// El nivel de crecimiento actual mas esto es el maximo de cada palanca
		growthRate : 0.3,		// Ritmo de crecimiento (0-1). Si se decrementa 'cycle' deberia disminuir este para compensar.
		debug : false			// Activar mensajes de debug en la consola
	},

	// ------------------------------------------- //
	/**
	 *	Launch the simulator
	 *	This will start the event dispatch system and the lifecycle one.
	 */
	start: function(){
		
		Simulator.sliders = {
			sun : $('#palancas #sol').slider().data('slider'),
			water : $('#palancas #agua').slider().data('slider'),
			food : $('#palancas #nutrientes').slider().data('slider'),
			space : $('#palancas #espacio').slider().data('slider')
		};

		if(!Simulator.config.debug){
			console = {
				log : function(text){}
			};
		}

		// Add in the main lifecycle element
		Simulator.addLifecycle(function(){
			Simulator.Plant.update({
				'water': -(Simulator.sliders.water.getValue()-100),
				'food': -(Simulator.sliders.food.getValue()-100),
				'sun': -(Simulator.sliders.sun.getValue()-100),
				'space': -(Simulator.sliders.space.getValue()-100)
			});
		}, true);

		// Update visually the plant
		Simulator.addLifecycle(function(){
			var size = Simulator.Plant.growth*4+'px';
			$('#plant').css({
				fontSize: size
			});
			console.log("Plant size: "+size);
		});

		Simulator.startLife();
	},

	startLife: function(){
		Simulator.stopLife();
		Simulator.executeCycle();
		Simulator.lifeInterval = setInterval(function(){
			Simulator.executeCycle();
		}, Simulator.config.cycle);
	},

	executeCycle : function(){
		var total = Simulator.lifecycle.length;
		if(total<1){
			Simulator.stopLife();
			console.log("Life stopped, no lifecycle functions!");
			return;
		}
		for(var i=0;i<total;i++){
			Simulator.lifecycle[i]();
		}
	},

	stopLife: function(){
		clearInterval(Simulator.lifeInterval);
	},

	addLifecycle: function(cycle, start){

		Simulator.lifecycle.push(cycle);

		if(Simulator.lifeInterval === null && start === true){
			Simulator.startLife();
		}
	},

	lifeInterval : null,

	/**
	 * Array of functions to be executed in the plant lifecycle. All the functions will be executed one after the other
	 * every X ms during the plant's life.
	 */
	lifecycle : [],
	
	Plant : {
		growth : 0,
		sickness: 0,
		state : 'alive',
		problems : [],

		grow : function(amount){
			if(Simulator.Plant.growth>=Simulator.config.maxGrowth){
				console.log("Maximum already");
				return;
			}
			Simulator.Plant.growth += amount;
		},

		/**
		 * The more the plant grows, the more it needs. This returns
		 * and object with the current needs.
		 */
		needs : function(){
			return {
				water : {
					min: Math.max(0,Simulator.Plant.growth-Simulator.config.needsRangeUnder),
					max: Math.min(100,Simulator.Plant.growth+Simulator.config.needsRangeOver)
				},
				sun : {
					min: Math.max(0,Simulator.Plant.growth-Simulator.config.needsRangeUnder),
					max: Math.min(100,Simulator.Plant.growth+Simulator.config.needsRangeOver)
				},
				space : {
					min: Math.max(0,Simulator.Plant.growth-Simulator.config.needsRangeUnder),
					max: Math.min(100,Simulator.Plant.growth+Simulator.config.needsRangeOver)
				},
				food : {
					min: Math.max(0,Simulator.Plant.growth-Simulator.config.needsRangeUnder),
					max: Math.min(100,Simulator.Plant.growth+Simulator.config.needsRangeOver)
				},
			};
		},

		/**
		 * Give elements to the plant and have it update
		 * its state
		 */
		update: function(e){

			$('#palancas i').css({
				color: '#fff'
			});

			var ok = true;

			if(Simulator.Plant.growth >= e.space){
				$('#space-img').css({
					color: 'red'
				});
				ok = false;
			}

			needs = Simulator.Plant.needs();

			console.log("Plant needs: ",needs);

			if(e.water < needs.water.min || e.water > needs.water.max){
				$('#water-img').css({
					color: 'red'
				});
				ok = false;
			}
			if(e.sun < needs.sun.min || e.sun > needs.sun.max){
				$('#sun-img').css({
					color: 'red'
				});
				ok = false;
			}
			if(e.food < needs.food.min || e.food > needs.food.max){
				$('#food-img').css({
					color: 'red'
				});
				ok = false;
			}

			if(ok && e.food > 0 && e.sun > 0 && e.water > 0){
				// It will grow from 0-1, 0 being the minimum necessary, 1 being the max
				// Since all is ok we know that all levels are withing boundaries, get the average
				// substract the minimum level and thats it :)
				var value = Simulator.config.growthRate*((e.water + e.sun + e.food)/3 - needs.food.min)/needs.food.max;

				console.log("Growth = "+Simulator.Plant.growth+". Growing "+value);

				Simulator.Plant.grow(value);
			}else if(ok){
				console.log("Something is 0");
			}else{
				console.log("Not OK!");
			}
		},

		/**
		 * Internal
		 */
		diff: function(a,b){
			return Math.abs(Math.abs(a)-Math.abs(b));
		},

		setProblem: function(problem, value){
			Plant.problems[problem] = value;
		}
	}
};