// NOTE: Ideally, one would use window.performance.now() to get slightly better
// accuracy, however it's only supported on Chromium/Firefox on Windows. See:
//   https://developer.mozilla.org/en-US/docs/Web/API/Performance/now
//   https://bugs.chromium.org/p/chromium/issues/detail?id=1206450,
//   https://bugzilla.mozilla.org/show_bug.cgi?id=1709767
//   https://bugs.webkit.org/show_bug.cgi?id=225610
//   https://github.com/w3c/hr-time/issues/115

// const timestamp = window.performance.now.bind(window.performance);
const timestamp = Date.now;

export class App {
	#fixedRate = 30.0;
	#accumulator = 0;
	#currentTime = timestamp();
	#time = 0;
	#loopHandler = null;

	constructor(fixedRate = 30.0) {
		this.#fixedRate = fixedRate;
	}

	update(delta) {}
	fixedUpdate(delta) {}
	render(alpha) {}

	#loop() {
		const dt = 1 / this.#fixedRate * 1e+3;
		const newTime = timestamp();
		const frameTime = newTime - this.#currentTime;

		this.#currentTime = newTime;

		/*
		if (frameTime >= 250) {
			console.warn("WARNING: Slow down");
			frameTime = 250;
		}
		*/

		this.#accumulator += frameTime;

		this.update(frameTime / 1e+3);

		while (this.#accumulator >= dt) {
			this.fixedUpdate(dt / 1e+3);
			this.#time += dt;
			this.#accumulator -= dt;
		}

		const alpha = this.#accumulator / dt;

		this.render(alpha);

		this.#loopHandler = setTimeout(this.#loop.bind(this));
	}

	start() {
		this.#loopHandler = setTimeout(this.#loop.bind(this));
	}

	stop() {
		clearTimeout(this.#loopHandler);
	}
}
