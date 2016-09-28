/**
 * Created by Esimorp on 16/9/26.
 */
var tank2Controller = {
    forward: 1,
    turn: 0,
    shoot: true,
    bulletType: 0,
    giveCommand: function () {
        if (this.turing) {
            this.turing -= 1;
            return;
        }

        var command = Math.random();
        if (command < 0.1) {
            this.turing = 5;
            this.forward = 0;
            this.turn = 1;
        } else if (command > 0.9) {
            this.turing = 5;
            this.forward = 0;
            this.turn = -1;
        } else {
            this.turn = 0;
            if (Math.random() > 0.5) {
                this.forward = 1;
            } else {
                this.forward = 1;
            }
        }
    }
};