const logo = document.querySelector("#logo");

function createStar(animationTime) {
	const c = [ "♦", "₊", "•" ]
	const star = document.createElement("div");
	star.classList.add("star");
	star.textContent = c[Math.floor(Math.random() * c.length)];

	const delay = Math.random() * animationTime;
	star.style.animationDuration = animationTime + "s";
	star.style.animationDelay = -delay + "s";

	return star;
}

for (let i = 0; i < 50; ++i) {
	const offset = Math.random() * 100;
	const star = createStar(8);
	star.style.top = offset + "%";

	logo.insertBefore(star, logo.firstChild);
}

for (let i = 0; i < 50; ++i) {
	let topOffset = Math.random() * 100;
	let star = createStar(16);
	star.style.top = topOffset + "%";
	star.style.color = "#808080";

	logo.insertBefore(star, logo.firstChild);
}

for (let i = 0; i < 50; ++i) {
	let topOffset = Math.random() * 100;
	let star = createStar(32);
	star.style.top = topOffset + "%";
	star.style.color = "#404040";

	logo.insertBefore(star, logo.firstChild);
}

const maxButton = document.querySelector("#logo-max");

maxButton.addEventListener("mousedown", (event) => {
	console.log("YES BOY");

	logo.style.width = "100%";
	logo.style.height = "100%";
	logo.style.left = "0";
	logo.style.top = "0";
});
