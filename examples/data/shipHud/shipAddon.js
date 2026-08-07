const shipAddon = new Addon({
    cssFiles: [`ship.css`],
})

class Compass extends Canvas {
    constructor(headingState) {
        super({ classes: ["compass"], attributes: { width: 300, height: 300 } });
        this.heading = 0;
        this.ctx.width = 300;
        this.ctx.height = 300;

        headingState.subscribe(yaw => {
            this.heading = yaw;
        })
    }

    update(ctx) {
        ctx.clearRect(0, 0, ctx.width, ctx.height);
        ctx.strokeStyle = "#FFF";
        ctx.fillStyle = "#FFF";
        let X = this.html.width / 2;
        let Y = this.html.height / 2;
        ctx.beginPath();
        ctx.arc(X, Y, 100, 0, 2 * Math.PI);
        ctx.stroke();
        for (let a = 0; a < 360; a++) {
            let rad = a / 360 * Math.PI * 2 + Math.PI
            rad = Math.PI * 2 - rad
            if (a % 10 == 0) {
                let x = X + Math.sin(rad) * 100
                let y = Y + Math.cos(rad) * 100
                let L = 5
                if (a % 30 == 0) {
                    L = 10
                    let x_ = x + Math.sin(rad) * 30
                    let y_ = y + Math.cos(rad) * 30
                    ctx.textAlign = "center"
                    ctx.fillText(`${a} *`, x_, y_);
                }
                // Start a new Path
                ctx.beginPath();
                ctx.moveTo(x, y);
                x += Math.sin(rad) * L
                y += Math.cos(rad) * L
                ctx.lineTo(x, y);

                // Draw the Path
                ctx.stroke();

                // SHIP
            }
        }

        this.drawShip(ctx, this.heading)
    }

    drawShip(ctx, heading) {
        let X = ctx.width / 2;
        let Y = ctx.height / 2;
        let headingRad = heading / 360 * Math.PI * 2 + Math.PI
        headingRad = Math.PI * 2 - headingRad
        let x = X + Math.sin(headingRad) * 80
        let y = Y + Math.cos(headingRad) * 80
        ctx.beginPath();
        ctx.moveTo(x, y);
        x = X + Math.sin(headingRad + 0.3) * 60
        y = Y + Math.cos(headingRad + 0.3) * 60
        ctx.lineTo(x, y);
        x = X + Math.sin(headingRad - 0.3 + Math.PI) * 60
        y = Y + Math.cos(headingRad - 0.3 + Math.PI) * 60
        ctx.lineTo(x, y);
        x = X + Math.sin(headingRad + 0.3 + Math.PI) * 60
        y = Y + Math.cos(headingRad + 0.3 + Math.PI) * 60
        ctx.lineTo(x, y);
        x = X + Math.sin(headingRad - 0.3) * 60
        y = Y + Math.cos(headingRad - 0.3) * 60
        ctx.lineTo(x, y);
        x = X + Math.sin(headingRad) * 80
        y = Y + Math.cos(headingRad) * 80
        ctx.lineTo(x, y);

        // Draw the Path
        this.ctx.stroke();
    }
}

class Rudder extends Canvas {
    constructor(rudderState) {
        super({ classes: ["rudder"], attributes: { width: 300, height: 200 } });
        this.angle = 0;

        rudderState.subscribe(rudder => {
            this.angle = rudder;
        })
    }

    update(ctx) {
        ctx.clearRect(0, 0, this.html.width, this.html.height);
        ctx.strokeStyle = "#FFF";
        ctx.fillStyle = "#FFF";
        let X = this.html.width / 2;
        let Y = 50;
        ctx.beginPath();
        ctx.arc(X, Y, 100, 0, Math.PI);
        ctx.stroke();
        for (let a = 90; a <= 270; a++) {
            let rad = a / 360 * Math.PI * 2 + Math.PI
            rad = Math.PI * 2 - rad
            if (a % 10 == 0) {
                let x = X + Math.sin(rad) * 100
                let y = Y + Math.cos(rad) * 100
                let L = 5
                if (a % 30 == 0) {
                    L = 10
                    let x_ = x + Math.sin(rad) * 30
                    let y_ = y + Math.cos(rad) * 30
                    ctx.textAlign = "center"
                    ctx.fillText(`${-(a - 180)} *`, x_, y_);
                }
                // Start a new Path
                ctx.beginPath();
                ctx.moveTo(x, y);
                x += Math.sin(rad) * L
                y += Math.cos(rad) * L
                ctx.lineTo(x, y);

                // Draw the Path
                ctx.stroke();

                // SHIP
            }
        }

        this.ctx.strokeStyle = DEBIAN_RED;
        this.drawRudder(ctx, this.angle);
    }

    drawRudder(ctx, rudder_angle) {
        let X = this.html.width / 2;
        let Y = 50;
        let rudderRad = (-rudder_angle) / 360 * Math.PI * 2
        rudderRad = Math.PI * 2 - rudderRad
        let x = X + Math.sin(rudderRad) * 80
        let y = Y + Math.cos(rudderRad) * 80
        ctx.beginPath();
        ctx.moveTo(x, y);
        x = X + Math.sin(rudderRad + 0.15) * 60
        y = Y + Math.cos(rudderRad + 0.15) * 60
        ctx.lineTo(x, y);
        x = X + Math.sin(rudderRad + Math.PI / 2) * 15
        y = Y + Math.cos(rudderRad + Math.PI / 2) * 15
        ctx.lineTo(x, y);
        x = X + Math.sin(rudderRad - Math.PI / 2) * 15
        y = Y + Math.cos(rudderRad - Math.PI / 2) * 15
        ctx.lineTo(x, y);
        x = X + Math.sin(rudderRad - 0.15) * 60
        y = Y + Math.cos(rudderRad - 0.15) * 60
        ctx.lineTo(x, y);
        x = X + Math.sin(rudderRad) * 80
        y = Y + Math.cos(rudderRad) * 80
        ctx.lineTo(x, y);

        // Draw the Path
        ctx.stroke();
    }
}

class Roll extends Canvas {
    constructor(rollState) {
        super({ classes: ["Roll"], attributes: { width: 300, height: 200 } });
        this.angle = 0;

        rollState.subscribe(roll => {
            this.angle = roll;
        })
    }

    update(ctx) {
        ctx.clearRect(0, 0, this.html.width, this.html.height);

        let X = this.html.width / 2;
        let Y = 50;
        ctx.strokeStyle = "#FFF";
        ctx.fillStyle = "#FFF";
        ctx.beginPath();
        ctx.arc(X, Y, 100, 0, Math.PI);
        ctx.stroke();
        for (let a = 120; a <= 240; a++) {
            let rad = a / 360 * Math.PI * 2 + Math.PI
            rad = Math.PI * 2 - rad
            if (a % 10 == 0) {
                let x = X + Math.sin(rad) * 100
                let y = Y + Math.cos(rad) * 100
                let L = 5
                if (a % 30 == 0) {
                    L = 10
                    let x_ = x + Math.sin(rad) * 30
                    let y_ = y + Math.cos(rad) * 30
                    ctx.textAlign = "center"
                    ctx.fillText(`${-(a - 180)} *`, x_, y_);
                }
                // Start a new Path
                ctx.beginPath();
                ctx.moveTo(x, y);
                x += Math.sin(rad) * L
                y += Math.cos(rad) * L
                ctx.lineTo(x, y);

                // Draw the Path
                ctx.stroke();

                // SHIP
            }
        }

        this.ctx.strokeStyle = "#FFF";
        this.drawShip(ctx, this.angle);
    }

    drawShip(ctx, rudder_angle) {
        let X = this.html.width / 2;
        let Y = 50;
        let rudderRad = (-rudder_angle) / 360 * Math.PI * 2
        rudderRad = Math.PI * 2 - rudderRad
        let x = X + Math.sin(rudderRad) * 40
        let y = Y + Math.cos(rudderRad) * 40
        ctx.beginPath();
        ctx.moveTo(x, y);
        x = X + Math.sin(rudderRad + 0.5) * 30
        y = Y + Math.cos(rudderRad + 0.5) * 30
        ctx.lineTo(x, y);
        x = X + Math.sin(rudderRad + Math.PI / 2 + 0.4) * 25
        y = Y + Math.cos(rudderRad + Math.PI / 2 + 0.4) * 25
        ctx.lineTo(x, y);
        x = X + Math.sin(rudderRad - Math.PI / 2 - 0.4) * 25
        y = Y + Math.cos(rudderRad - Math.PI / 2 - 0.4) * 25
        ctx.lineTo(x, y);
        x = X + Math.sin(rudderRad - 0.5) * 30
        y = Y + Math.cos(rudderRad - 0.5) * 30
        ctx.lineTo(x, y);
        x = X + Math.sin(rudderRad) * 40
        y = Y + Math.cos(rudderRad) * 40
        ctx.lineTo(x, y);

        // Draw the Path
        ctx.stroke();

        x = X + Math.sin(rudderRad) * -30
        y = Y + Math.cos(rudderRad) * -30
        ctx.beginPath();
        ctx.moveTo(x, y);
        x = X + Math.sin(rudderRad + Math.PI / 2 + 1.2) * 25
        y = Y + Math.cos(rudderRad + Math.PI / 2 + 1.2) * 25
        ctx.lineTo(x, y);
        x = X + Math.sin(rudderRad + Math.PI / 2 + 0.7) * 15
        y = Y + Math.cos(rudderRad + Math.PI / 2 + 0.7) * 15
        ctx.lineTo(x, y);
        x = X + Math.sin(rudderRad - Math.PI / 2 - 0.7) * 15
        y = Y + Math.cos(rudderRad - Math.PI / 2 - 0.7) * 15
        ctx.moveTo(x, y);
        x = X + Math.sin(rudderRad - Math.PI / 2 - 1.2) * 25
        y = Y + Math.cos(rudderRad - Math.PI / 2 - 1.2) * 25
        ctx.lineTo(x, y);
        x = X + Math.sin(rudderRad) * -30
        y = Y + Math.cos(rudderRad) * -30
        ctx.lineTo(x, y);

        ctx.stroke();

        this.ctx.strokeStyle = CURIOS_BLUE;
        x = X + Math.sin(Math.PI / 2 + 0.1) * -100
        y = Y + Math.cos(Math.PI / 2 + 0.1) * -100
        ctx.beginPath();
        ctx.moveTo(x, y);
        x = X + Math.sin(Math.PI / 2 - 0.1) * 100
        y = Y + Math.cos(Math.PI / 2 - 0.1) * 100
        ctx.lineTo(x, y);

        ctx.stroke();

        this.ctx.strokeStyle = DEBIAN_RED;
        x = X + Math.sin(rudderRad) * 0
        y = Y + Math.cos(rudderRad) * 0
        ctx.beginPath();
        ctx.moveTo(x, y);
        x = X + Math.sin(rudderRad) * 100
        y = Y + Math.cos(rudderRad) * 100
        ctx.lineTo(x, y);

        ctx.stroke();
    }
}

class Pitch extends Canvas {
    constructor(rollState) {
        super({ classes: ["Roll"], attributes: { width: 300, height: 200 } });
        this.angle = 0;

        rollState.subscribe(roll => {
            this.angle = roll;
        })
    }

    update(ctx) {
        ctx.clearRect(0, 0, this.html.width, this.html.height);

        let X = this.html.width / 2;
        let Y = 50;
        ctx.strokeStyle = "#FFF";
        ctx.fillStyle = "#FFF";
        ctx.beginPath();
        ctx.arc(X, Y, 100, 0, Math.PI);
        ctx.stroke();
        for (let a = 120; a <= 240; a++) {
            let rad = a / 360 * Math.PI * 2 + Math.PI
            rad = Math.PI * 2 - rad
            if (a % 10 == 0) {
                let x = X + Math.sin(rad) * 100
                let y = Y + Math.cos(rad) * 100
                let L = 5
                if (a % 30 == 0) {
                    L = 10
                    let x_ = x + Math.sin(rad) * 30
                    let y_ = y + Math.cos(rad) * 30
                    ctx.textAlign = "center"
                    ctx.fillText(`${-(a - 180)} *`, x_, y_);
                }
                // Start a new Path
                ctx.beginPath();
                ctx.moveTo(x, y);
                x += Math.sin(rad) * L
                y += Math.cos(rad) * L
                ctx.lineTo(x, y);

                // Draw the Path
                ctx.stroke();

                // SHIP
            }
        }

        this.ctx.strokeStyle = CURIOS_BLUE;
        let x = X + Math.sin(Math.PI / 2 + 0.1) * -100
        let y = Y + Math.cos(Math.PI / 2 + 0.1) * -100
        ctx.beginPath();
        ctx.moveTo(x, y);
        x = X + Math.sin(Math.PI / 2 - 0.1) * 100
        y = Y + Math.cos(Math.PI / 2 - 0.1) * 100
        ctx.lineTo(x, y);

        ctx.stroke();

        this.ctx.strokeStyle = "#FFF";
        this.drawShip(ctx, this.angle);
    }

    drawShip(ctx, rudder_angle) {
        let X = this.html.width / 2;
        let Y = 50;
        let rudderRad = (-rudder_angle) / 360 * Math.PI * 2
        rudderRad = Math.PI * 2 - rudderRad
        let x = X + Math.sin(rudderRad + 0.9) * 50
        let y = Y + Math.cos(rudderRad + 0.9) * 50
        ctx.beginPath();
        ctx.moveTo(x, y);
        x = X + Math.sin(rudderRad + 1.4) * 63
        y = Y + Math.cos(rudderRad + 1.4) * 63
        ctx.lineTo(x, y);
        x = X + Math.sin(rudderRad + 1.7) * 70
        y = Y + Math.cos(rudderRad + 1.7) * 70
        ctx.lineTo(x, y);
        x = X + Math.sin(rudderRad + Math.PI + 1.45) * 70
        y = Y + Math.cos(rudderRad + Math.PI + 1.45) * 70
        ctx.lineTo(x, y);
        x = X + Math.sin(rudderRad + Math.PI + 2.1) * 65
        y = Y + Math.cos(rudderRad + Math.PI + 2.1) * 65
        ctx.lineTo(x, y);
        x = X + Math.sin(rudderRad + 0.9) * 50
        y = Y + Math.cos(rudderRad + 0.9) * 50
        ctx.lineTo(x, y);

        // Draw the Path
        ctx.stroke();

        x = X + Math.sin(rudderRad + 1.85) * 30
        y = Y + Math.cos(rudderRad + 1.85) * 30
        ctx.beginPath();
        ctx.moveTo(x, y);
        x = X + Math.sin(rudderRad + 2.45) * 40
        y = Y + Math.cos(rudderRad + 2.45) * 40
        ctx.lineTo(x, y);
        x = X + Math.sin(rudderRad + Math.PI + 1) * 40
        y = Y + Math.cos(rudderRad + Math.PI + 1) * 40
        ctx.lineTo(x, y);
        x = X + Math.sin(rudderRad + Math.PI + 1.35) * 40
        y = Y + Math.cos(rudderRad + Math.PI + 1.35) * 40
        ctx.lineTo(x, y);

        // Draw the Path
        ctx.stroke();

        this.ctx.strokeStyle = DEBIAN_RED;
        x = X + Math.sin(rudderRad) * 0
        y = Y + Math.cos(rudderRad) * 0
        ctx.beginPath();
        ctx.moveTo(x, y);
        x = X + Math.sin(rudderRad) * 100
        y = Y + Math.cos(rudderRad) * 100
        ctx.lineTo(x, y);

        ctx.stroke();
    }
}

class TurnRate extends Canvas {
    constructor(state) {
        super({ classes: ["TurnRate"], attributes: { width: 700, height: 150 } });
        this.turnRate = 0;

        state.subscribe(val => {
            this.turnRate = val;
        })
    }

    update(ctx) {
        ctx.clearRect(0, 0, 700, 150)
        ctx.strokeStyle = "#FFF";
        ctx.fillStyle = "#FFF";
		
		ctx.beginPath();
		ctx.moveTo(50, 75);
		ctx.lineTo(650, 75);
		ctx.stroke();
		
		ctx.beginPath();
		ctx.moveTo(50, 45);
		ctx.lineTo(50, 105);
		ctx.stroke();
		
		ctx.beginPath();
		ctx.moveTo(650, 45);
		ctx.lineTo(650, 105);
		ctx.stroke();
		
		for (let i = -29; i <= 29; i++) {

			if (i%10==0) {
				ctx.beginPath();
				ctx.moveTo(350+i*10, 60);
				ctx.lineTo(350+i*10, 90);
				ctx.stroke();
				let x_ = 350+i*10
				let y_ = 105
				ctx.textAlign = "center"
				ctx.fillText(`${i}`, x_, y_);
			} else {
				ctx.beginPath();
				ctx.moveTo(350+i*10, 65);
				ctx.lineTo(350+i*10, 85);
				ctx.stroke();
			}
		}
		
		ctx.textAlign = "center"
		ctx.fillText(` 30`, 650, 125);
		ctx.fillText(`-30`, 50, 125);
		
		ctx.fillStyle = DEBIAN_RED;
		let x_ = this.turnRate*10 + 350
		ctx.beginPath()
		ctx.moveTo(x_-5, 65)
		ctx.lineTo(x_+5, 65)
		ctx.lineTo(x_, 85)
		ctx.fill();
		
    }
}