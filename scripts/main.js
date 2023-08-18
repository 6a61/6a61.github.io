import { Window } from "./window.js";
import { Animations } from "./animations.js";
import Pet from "./pet.js";
import "./applets/logo.js";

const Pinguin = {
	version: "0.1.0-2023.08.14",
};

const html = document.documentElement;
const body = document.body;

const regex = /\${\ *([^\ ]*)\ *}/g
const regexMatches = [...html.innerHTML.matchAll(regex)];
const tokens = new Map();

for (const match of regexMatches) {
	const token = match[0];
	const variable = match[1]

	if (!tokens.has(variable))
		tokens.set(variable, new Set());

	tokens.get(variable).add(token);
}

for (const [variable, set] of tokens) {
	for (const token of set) {
		// NOTE: Doing this invalidates the references of previously
		// queried elements!
		html.innerHTML = html.innerHTML.replaceAll(token, eval(variable));
	}
}

const petApp = new Pet.App(document.querySelector("#pet-canvas"));
petApp.start();

const petClean = document.querySelector("#pet-clean");
petClean.addEventListener("click", () => {
	petApp.pet.clean();
});

const maxButton = document.querySelector("#logo-max");

maxButton.addEventListener("mousedown", (event) => {
	const button = document.querySelector("#logo-max > img");

	logo.style.transition = "width 240ms, height 240ms, left 240ms, top 240ms";

	if (!logo.maximized) {
		logo.maximize();
		button.src = "images/max-exit-white.png";
	} else {
		logo.normal();
		button.src = "images/max-white.png";
	}

	setTimeout(() => { logo.style.transition = null; }, 240);
});

