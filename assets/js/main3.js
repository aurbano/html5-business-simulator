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

  // "Palancas" -> Nombre y opciones
  // Las opciones deben ir en orden (columna 1, columna 2 y columna 3)
  palancas: [
    {
      name: "Liderazgo",
      opciones: ["Clásico", "Clásico", "Transformacional"]
    },
    {
      name: "Formación",
      opciones: ['La justa/sólo para la "tarea"','Algo más','Se potencia el desarrollo profesional']
    },
    {
      name: "Transparencia en las cuentas",
      opciones: ["No existe","No existe","Total. Se comparten sistemáticamente."]
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
  start: function(){

    $('#help').click(function(e){
      e.preventDefault();
      $('#help-modal').modal();
    });

  }
};