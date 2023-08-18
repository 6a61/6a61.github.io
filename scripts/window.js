export class Window extends HTMLElement {
	static #windows = [];

	maximized = false;
	#placeholder = null;
	#position = { x: 0, y: 0 };

	constructor(options = { x: null, y: null, width: null, height: null, draggable: null }) {
		super();

		this.addEventListener("mousedown", this.bringToFront);
		this.addEventListener("touchstart", this.bringToFront);

		for (const child of this.children) {
			if (child.hasAttribute("movable")) {
				this.setMovableElement(child);
			}
		}

		if (options.draggable)
			this.setMovableElement(options.draggable);

		if (this.hasAttribute("movable"))
			this.setMovableElement(this);
	}

	set #x(x) {
		this.#position.x = x;
		this.style.transform = "translate(" + this.#position.x + "px, " + this.#position.y + "px)";
	}

	set #y(y) {
		this.#position.y = y;
		this.style.transform = "translate(" + this.#position.x + "px, " + this.#position.y + "px)";
	}

	get #x() { return this.#position.x; }
	get #y() { return this.#position.y; }

	static get observedAttributes() {
		return [ "movable" ];
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (name == "movable") {
			if (this.hasAttribute("movable"))
				this.setMovableElement(this);
			else
				this.unsetMovableElement(this);
		}
	}

	connectedCallback() {
		Window.#windows.push(this);
		Window.#calculateZIndices();
	}

	disconnectedCallback() {
		Window.#windows.splice(Window.#windows.indexOf(this), 1);
		Window.#calculateZIndices();
	}
	static #calculateZIndices() {
		for (const i in Window.#windows) {
			const window = Window.#windows[i];
			window.style.zIndex = i;
		}
	}

	setMovableElement(element) {
		if (element.pinguinWindowListener)
			return;

		element.pinguinWindowListener = this.onMoveStart.bind(this, element);
		element.setAttribute("movable", "");
		element.addEventListener("mousedown", element.pinguinWindowListener);
		element.addEventListener("touchstart", element.pinguinWindowListener);
	}

	unsetMovableElement(element) {
		element.pinguinWindowListener = null;

		element.removeAttribute("movable");
		element.removeEventListener("mousedown", element.pinguinWindowListener);
		element.removeEventListener("touchstart", element.pinguinWindowListener);
	}

	onMoveStart(element, event) {
		if (element != event.target)
			return;

		if (!element.hasAttribute("movable"))
			return;

		if (this.maximized)
			return;

		if (event.touches && event.touches.length > 1)
			return;

		event.preventDefault();

		let startX = event.clientX ?? event.touches[0].clientX;
		let startY = event.clientY ?? event.touches[0].clientY;

		const onMove = (event) => {
			const deltaX = (event.clientX ?? event.touches[0].clientX) - startX;
			const deltaY = (event.clientY ?? event.touches[0].clientY) - startY;

			startX = (event.clientX ?? event.touches[0].clientX);
			startY = (event.clientY ?? event.touches[0].clientY);

			this.#x += deltaX;
			this.#y += deltaY;
		};

		const onMoveFinish = (event) => {
			document.removeEventListener("mousemove", onMove);
			document.removeEventListener("mouseup", onMoveFinish);

			document.removeEventListener("touchmove", onMove);
			document.removeEventListener("touchend", onMoveFinish);
		};

		document.addEventListener("mousemove", onMove);
		document.addEventListener("mouseup", onMoveFinish);

		document.addEventListener("touchmove", onMove);
		document.addEventListener("touchend", onMoveFinish);
	}

	bringToFront() {
		Window.#windows.splice(Window.#windows.indexOf(this), 1);
		Window.#windows.push(this);
		Window.#calculateZIndices();
	}

	maximize() {
		if (this.maximized)
			return;

		this.maximized = true;

		// The first step to make an element that maximizes is to
		// create a new element with the same properties as the
		// original.

		const style = getComputedStyle(this);
		const rect = this.getBoundingClientRect();
		const parent = this.parentElement;

		this.#placeholder = document.createElement("div");

		for (const key of style) {
			const value = style[key];

			this.#placeholder.style[key] = style[key];
		}

		parent.insertBefore(this.#placeholder, this);

		// Next, is to make our element have a fixed position in the
		// same place as it did before.

		this.style.position = "fixed";
		this.style.top = rect.y + "px";
		this.style.left = rect.x + "px";
		this.style.margin = "0";
		this.style.transform = "";
		this.style.transition = this.#placeholder.style.transition;

		// And finally, we resize it to fullscreen. And add little hack
		// to trigger the transition animation.

		setTimeout(() => {
			this.style.width = "100%";
			this.style.height = "100%";
			this.style.top = "0";
			this.style.left = "0";
			this.style.borderRadius = "0";
		}, 1);
	}

	normal() {
		if (!this.maximized)
			return;

		// Like maximize but backwards. We already begin with a
		// fixed-position element, so we simply resize and move.

		this.style.width = this.#placeholder.style.width;
		this.style.height = this.#placeholder.style.height;
		this.style.top = this.#placeholder.getBoundingClientRect().y + "px";
		this.style.left = this.#placeholder.getBoundingClientRect().x + "px";
		this.style.borderRadius = this.#placeholder.style.borderRadius;

		// And then we restore our element to it's original properties
		// and remove the placeholder item.

		if (this.style.transition) {
			this.addEventListener("transitioncancel", (event) => {
				this.style.position = null;
				this.style.top = null;
				this.style.left = null;
				this.style.margin = null;
				this.style.transform = this.#placeholder.style.transform;
				this.#placeholder.remove();
				this.maximized = false;
			}, { once: true });

			this.addEventListener("transitionend", (event) => {
				this.style.position = null;
				this.style.top = null;
				this.style.left = null;
				this.style.margin = null;
				this.style.transform = this.#placeholder.style.transform;
				this.#placeholder.remove();
				this.maximized = false;
			}, { once: true });
		} else {
			this.style.position = null;
			this.style.top = null;
			this.style.left = null;
			this.style.margin = null;
			this.style.transform = this.#placeholder.style.transform;
			this.#placeholder.remove();
			this.maximized = false;
		}

	}
};

customElements.define("pinguin-window", Window);
