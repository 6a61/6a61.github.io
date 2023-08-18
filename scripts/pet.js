import { App as PistacchioApp } from "./pistacchio/app.js";

// 0.1.0 - First version
// 0.2.0 - Now it poops randomly

const caca = [
	[
		0,0,0,0,0,0,1,0,0,0,0,
		0,1,0,0,0,0,0,0,0,0,0,
		0,0,0,1,1,0,0,0,0,0,0,
		0,0,1,1,0,1,0,0,0,0,0,
		0,1,1,1,1,0,1,0,0,0,0,
		0,1,1,1,1,1,1,0,0,0,0,
		0,0,1,1,1,1,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,0,
	],
	[
		0,1,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,1,0,0,0,0,
		0,0,0,1,1,0,0,0,0,0,0,
		0,0,1,1,0,1,0,0,0,0,0,
		0,1,1,1,1,0,1,0,0,0,0,
		0,1,1,1,1,1,1,0,0,0,0,
		0,0,1,1,1,1,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,0,
	]
]

const friend = [
	[
		0,0,0,1,1,1,1,1,0,0,0,
		0,0,1,0,0,0,0,0,1,0,0,
		0,1,0,1,0,0,0,0,0,1,0,
		0,1,0,0,0,0,0,1,0,1,0,
		0,1,0,0,1,1,1,0,0,1,0,
		0,1,0,0,0,0,0,0,0,1,0,
		0,0,1,1,1,1,1,1,1,0,0,
		0,0,0,0,0,0,0,0,0,0,0,
	],
	[
		0,0,0,1,1,1,1,1,0,0,0,
		0,0,1,0,0,0,0,0,1,0,0,
		0,1,0,0,0,0,0,0,0,1,0,
		0,1,0,1,0,0,0,1,0,1,0,
		0,1,0,0,1,1,1,0,0,1,0,
		0,1,0,0,0,0,0,0,0,1,0,
		0,0,1,1,1,1,1,1,1,0,0,
		0,0,0,0,0,0,0,0,0,0,0,
	],
	[
		0,0,0,1,1,1,1,1,0,0,0,
		0,0,1,0,0,0,0,0,1,0,0,
		0,1,0,1,0,0,0,1,0,1,0,
		0,1,0,0,0,0,0,0,0,1,0,
		0,1,0,0,1,1,1,0,0,1,0,
		0,1,0,0,0,0,0,0,0,1,0,
		0,0,1,1,1,1,1,1,1,0,0,
		0,0,0,0,0,0,0,0,0,0,0,
	],
	[
		0,0,0,1,1,1,1,1,0,0,0,
		0,0,1,0,0,0,0,0,1,0,0,
		0,1,0,0,0,0,0,1,0,1,0,
		0,1,0,1,0,0,0,0,0,1,0,
		0,1,0,0,1,1,1,0,0,1,0,
		0,1,0,0,0,0,0,0,0,1,0,
		0,0,1,1,1,1,1,1,1,0,0,
		0,0,0,0,0,0,0,0,0,0,0,
	],
	[
		0,0,0,1,1,1,1,1,0,0,0,
		0,0,1,0,0,0,0,0,1,0,0,
		0,1,0,0,0,0,0,0,0,1,0,
		0,1,0,1,0,0,0,1,0,1,0,
		0,1,0,0,0,1,0,0,0,1,0,
		0,1,0,0,0,0,0,0,0,1,0,
		0,0,1,1,1,1,1,1,1,0,0,
		0,0,0,0,0,0,0,0,0,0,0,
	],
]

class Pet {
	x = 9;
	y = 14;
	frame = 0;
	state = "idle";

	clean() {
		if (this.state == "poop")
			this.state = "idle";
	}

	tick() {
		switch (this.state) {
		case "idle": {
			let frames = [ 1, 2 ];
			this.frame = frames[ Math.floor(Math.random() * frames.length) ];

			let states = [ [ "walk_left", 10 ], [ "walk_right", 10 ], [ "idle", 10 ], [ "poop", 1 ] ];
			let cumulativeSums = [ states[0][1] ];

			for (let i = 1; i < states.length; ++i) {
				cumulativeSums[i] = states[i][1] + cumulativeSums[i-1];
			}

			let weightSum = 0;
			for (const item of states) {
				weightSum += item[1];
			}

			const dice = Math.random() * weightSum;

			for (const i in cumulativeSums) {
				const weight = cumulativeSums[i];

				if (weight > dice) {
					this.state = states[i][0];
					break;
				}
			}

			// this.state = states[ Math.floor(Math.random() * states.length) ];
		}
		break;
		case "poop": {
			let frames = [ 1, 2, 4 ];
			this.frame = frames[ Math.floor(Math.random() * frames.length) ];

			this.x = 14;
		}
		break;
		case "walk_left": {
			let frames = [ 1, 2, 0 ];
			this.frame = frames[ Math.floor(Math.random() * frames.length )];

			this.x -= 2;

			if (this.x < 3) {
				this.x += 2;
				this.state = "center";
				break;
			}

			let states = [ "walk_left", "walk_right", "idle", "center" ];
			this.state = states[ Math.floor(Math.random() * states.length) ];
		}
		break;
		case "walk_right": {
			let frames = [ 1, 2, 3 ];
			this.frame = frames[ Math.floor(Math.random() * frames.length )];

			this.x += 2;

			if (this.x > 17) {
				this.x -= 2;
				this.state = "center";
				break;
			}

			let states = [ "walk_left", "walk_right", "idle", "center" ];
			this.state = states[ Math.floor(Math.random() * states.length) ];
		}
		break;
		case "center": {
			if (this.x > 9) {
				let frames = [ 1, 2, 0 ];
				this.frame = frames[ Math.floor(Math.random() * frames.length )];

				this.x = Math.max(9, this.x - 2);
			} else if (this.x < 9) {
				let frames = [ 1, 2, 3 ];
				this.frame = frames[ Math.floor(Math.random() * frames.length )];

				this.x = Math.min(9, this.x + 2);
			} else if (this.x == 9) {
				this.state = "idle";
			}
		}
		break;
		}
	}
};

class App extends PistacchioApp {
	pixelSize = 4;
	pet = new Pet();
	ticks = 0;

	constructor(canvas) {
		super(2);

		this.pet.x = 9;
		this.pet.y = 14;
		this.pet.frame = 0;
		this.canvas = canvas;
		this.context = canvas.getContext("2d");
	}

	fixedUpdate(delta) {
		this.ticks += 1;
		this.pet.tick();
	}

	render(alpha) {
		const canvas = this.canvas;
		const ctx = this.context;

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		// this.drawPixel(1, 1);
		// this.drawPixel(28, 1);
		// this.drawPixel(1, 28);
		// this.drawPixel(28, 28);

		if (this.pet.state == "poop") {
			for (let y = 0; y < 8; ++y) {
				for (let x = 0; x < 11; ++x) {
					if (caca[this.ticks % caca.length][y * 11 + x])
						this.drawPixel(x + 4, y + 14);
				}
			}

			for (let y = 0; y < 8; ++y) {
				for (let x = 0; x < 11; ++x) {
					if (friend[this.pet.frame][y * 11 + x])
						this.drawPixel(x + this.pet.x, y + this.pet.y);
				}
			}
		} else {
			for (let y = 0; y < 8; ++y) {
				for (let x = 0; x < 11; ++x) {
					if (friend[this.pet.frame][y * 11 + x])
						this.drawPixel(x + this.pet.x, y + this.pet.y);
				}
			}
		}
	}

	drawPixel(x, y) {
		const ctx = this.context;

		ctx.fillStyle = "#111111ff";
		ctx.fillRect(
			x * this.pixelSize /*+ 1 * x*/,
			y * this.pixelSize /*+ 1 * y*/,
			this.pixelSize,
			this.pixelSize);
		ctx.fillStyle = "#11111140";
		ctx.fillRect(
			x * this.pixelSize /*+ 1 * x*/ + 1,
			y * this.pixelSize /*+ 1 * y*/ + 1,
			this.pixelSize,
			this.pixelSize);
	}
}

export default {
	version: "0.2.0",
	App
};
