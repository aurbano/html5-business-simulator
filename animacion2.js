var Animation = {
    /**
     * Starts a new animation sequence of the given type (Column)
     * @param  {int} type Column index (0-2)
     * @return {void}
     */
    startAnimation: function () {
        Simulator.displayCircle();
        Simulator.animateSpinner();
        if (type === 0) Simulator.showConclusion(1);
        Simulator.cycleComments(type, function () {

            var timing = 0;

            if (Simulator.gerente[type]) {
                timing += 3000;
                setTimeout(function () {
                    Simulator.showBoss(function () {
                        console.log("    showBoss() done, inside callback.");
                        // This will trigger a new spinner and a new result
                        Simulator.animateSpinner();
                    });
                }, timing * Simulator.config.speed);

                timing += 10000;

                setTimeout(function () {
                    // Add consequence to the result box
                    $('.messages').append('<div class="message ' + Simulator.gerente[type].style + '" style="margin:10px 0; font-weight:bold;">' + Simulator.gerente[type].text + '</div>');
                    Simulator.animateSpinner(false);
                }, timing * Simulator.config.speed);
            }

            timing += 5000;

            setTimeout(function () {
                Simulator.animationPhase++;
                // If there are more tasks, restart the process
                if (Simulator.animationPhase < Simulator.tasks.length) {
                    Simulator.newTask(Simulator.animationPhase);
                } else {
                    alert("Has acabado la demostración.");
                    Simulator.animateSpinner(false);
                }
            }, timing * Simulator.config.speed);
        });
    },

    /**
     * Displays the animation area
     * @return {void}
     */
    displayCircle: function () {
        $('#circle').fadeIn();
        $('#pyramid').fadeIn();
    },


}