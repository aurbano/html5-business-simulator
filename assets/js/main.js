/**
 * Main application code for Mondragon's simulators
 * @author Alejandro U. Alvarez <alejandro@urbanoalvarez.es>
 */

 Simulator = {

	// Para configurar el Simulador unicamente se deberian modificar los parametros a continuacion
	// todos ellos estan explicados a continuacion.
	// Para arrancar el simulador hay que llamar a 'Simulator.start();''
	config : {
		cycle: 250,				// Tiempo entre cada comprobacion. Decrementarlo hace mas rapida la simulacion
		maxGrowth: 100,			// Maximo crecimiento, deberia ser 100 siempre
		needsRangeUnder: 30,	// El nivel de crecimiento actual menos esto es el minimo de cada palanca
		needsRangeOver: 30,		// El nivel de crecimiento actual mas esto es el maximo de cada palanca
		growthRate : 1,			// Ritmo de crecimiento (0-1). Si se decrementa 'cycle' deberia disminuir este para compensar.
		minGrowthRate: 1,		// Minimo ritmo de crecimiento, si la planta no recibe todo lo que necesita crece mas despacio, hasta alcanzar este valor.
		debug : false,			// Activar mensajes de debug en la consola
		sickRate : 0.5,			// Ritmo al que enferma la planta cuando las condiciones no son favorables
		minSick : 6,			// Valor 0-100 a partir del cual la planta se ve enferma
		maxSick : 100,			// Valor a partir del cual la planta se muere,
		showStartModal: false,	// Mostrar la ventana de ayuda nada mas abrir el simulador
	},

	// ------------------------------------------- //
	/**
	 *	Launch the simulator
	 *	This will start the event dispatch system and the lifecycle one.
	 */
	start: function(){
		
		$('#mensaje .btn-primary').click(function(e){
			e.preventDefault();
			window.location.reload();
		});
		
		$('#help-modal .btn-default').click(function(e){
			e.preventDefault();
			$('#help-modal').modal('hide');
		});
		
		if(Simulator.config.showStartModal)
			$('#help-modal').modal();
		
		$('#help').click(function(e){
			e.preventDefault();
			$('#help-modal').modal();
		});

		Simulator.layers = {
			earth : $('#earth-img'),
			plant : $('#plant-img')
		};
		
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

		console.log("Launch simulator");

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
			
			// Ok state
			var status = 'ok';
			
			if( Simulator.Plant.sickness >= Simulator.config.maxSick){
				Simulator.stopLife();
				// Dead state
				status = 'dead';
				
			}else if(Simulator.Plant.sickness > Simulator.config.minSick){
				// Sick state
				status = 'sick';
			}
			
			// Get growth level from 1-6
			var level = Math.round(Simulator.Plant.growth * 5 / 100)+1;
			
			if(level !== Simulator.Plant.level && level <= 3){
				// Just upgraded, take down the width
				Simulator.Plant.levelGrowth = Simulator.Plant.growth;
			}
			
			Simulator.Plant.level = level;
			
			Simulator.layers.plant.attr('src','assets/img/planta/'+status+'/'+level+'-'+status+'.png');
			
			var mult = 0.5;
			if(level >= 3) mult = 0.1;
			
			var width = (Simulator.Plant.growth - Simulator.Plant.levelGrowth)*mult + 30 + level*2;
			
			Simulator.layers.plant.css({
				'width' : width+'%',
				'marginBottom': 1/(width*0.005)+'px'
			});
			
			if(status == 'dead'){
				Simulator.layers.earth.hide();
				Simulator.displayMessage('Atención!', 'La planta ha muerto.');
			}
			
			if(Simulator.Plant.growth >= 100){
				Simulator.stopLife();
				Simulator.displayMessage('Genial!', 'La planta ha crecido al maximo.');
			}
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
	
	// Internal method
	setSrc: function(which, state){
		var attr = which;
		if(state==1) attr+='-2';
		$('#'+which+'-img').attr('src', 'assets/img/iconos/'+attr+'.png');
	},
	
	displayMessage: function(title, text, dismiss){
		$('#mensaje .modal-title').text(title);
		$('#mensaje .modal-body').html(text);
		$('#mensaje').modal();
	},

	/**
	 * Array of functions to be executed in the plant lifecycle. All the functions will be executed one after the other
	 * every X ms during the plant's life.
	 */
	lifecycle : [],
	
	Plant : {
		growth : 0,
		sickness: 0,
		state : 'ok',
		problems : [],
		level: 0,
		levelGrowth: 0,

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

			Simulator.setSrc('agua');
			Simulator.setSrc('entorno');
			Simulator.setSrc('sol');
			Simulator.setSrc('nutriente');
			
			var ok = true,
				unbalance = 0;

			if(Simulator.Plant.growth >= e.space){
				Simulator.setSrc('entorno',1);
				ok = false;
			}

			needs = Simulator.Plant.needs();

			console.log("Plant needs: ",needs);

			if(e.water < needs.water.min || e.water > needs.water.max){
				Simulator.setSrc('agua',1);
				ok = false;
				// Update the unbalance level
				if(e.water < needs.water.min){
					unbalance += needs.water.min - e.water;
				}else if(e.water > needs.water.max){
					unbalance += e.water - needs.water.max;
				}
			}
			if(e.sun < needs.sun.min || e.sun > needs.sun.max){
				Simulator.setSrc('sol',1);
				ok = false;
				// Update the unbalance level
				if(e.sun < needs.sun.min){
					unbalance += needs.sun.min - e.sun;
				}else if(e.sun > needs.sun.max){
					unbalance += e.sun - needs.sun.max;
				}
			}
			if(e.food < needs.food.min || e.food > needs.food.max){
				Simulator.setSrc('nutriente',1);
				ok = false;
				// Update the unbalance level
				if(e.food < needs.food.min){
					unbalance += needs.food.min - e.food;
				}else if(e.food > needs.food.max){
					unbalance += e.food - needs.food.max;
				}
			}

			if(ok && e.food > 0 && e.sun > 0 && e.water > 0){
				// It will grow from 0-1, 0 being the minimum necessary, 1 being the max
				// Since all is ok we know that all levels are withing boundaries, get the average
				// substract the minimum level and thats it :)
				var value = Simulator.config.growthRate*Math.max(Simulator.config.minGrowthRate, ((e.water + e.sun + e.food)/3 - needs.food.min)/needs.food.max);
				
				console.log("Growth = "+Simulator.Plant.growth+". Growing "+value);

				Simulator.Plant.sickness -= 50*value*Simulator.config.sickRate;
				
				Simulator.Plant.state = 'ok';

				Simulator.Plant.grow(value);
			}else if(e.food === 0 && e.sun === 0 && e.water === 0){
				console.log("Something is 0");
			}else{
				console.log("Not OK! Unbalance: "+unbalance+', sickness: '+Simulator.Plant.sickness);
				Simulator.Plant.sickness += unbalance*Simulator.config.sickRate;
			}

			Simulator.Plant.sickness = Math.max(Math.min(Simulator.Plant.sickness, 100), 0);
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