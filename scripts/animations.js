export class Animations {
	static fadeIn(element, onFinish = null) {
		// Since transforms can be concatenated maybe the user
		// specified a transform that should be chained to the fadeIn
		// effect.

		const transform = element.style.transform;

		const keyframes = [
			{ transform: transform + " scale(0.8, 0.8)", opacity: "0.0" },
			{ transform: transform + " scale(1.0, 1.0)", opacity: "1.0" }
		];

		const animation = element.animate(keyframes, { duration: 240 });

		animation.addEventListener("finish", (event) => {
			element.style.opacity = "1.0";
		});

		if (onFinish)
			animation.addEventListener("finish", onFinish);
	}

	static fadeOut(element, onFinish = null) {
		const keyframes = [
			{ transform: "scale(1.0, 1.0)", opacity: "1.0" },
			{ transform: "scale(0.8, 0.8)", opacity: "0.0" }
		];

		const animation = element.animate(keyframes, { duration: 240 });

		if (onFinish)
			animation.addEventListener("finish", onFinish);
	}
}
