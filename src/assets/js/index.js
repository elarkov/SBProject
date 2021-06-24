import 'core-js/stable';
import 'regenerator-runtime/runtime';

// import jquery from 'jquery';
// global.jquery = jquery;

import { gsap } from 'gsap';

// import { ScrollToPlugin } from 'gsap/ScrollToPlugin.js';
// gsap.registerPlugin(ScrollToPlugin);

global.gsap = gsap;

gsap.defaults({
	overwrite: 'auto',
});

class ProjectApp {
	constructor() {
		this.env = require('./utils/env').default;
		this.utils = require('./utils/utils').default;
		this.classes = {
			Signal: require('./classes/Signal').default,
		};
		this.components = {};
		this.helpers = {};
		this.modules = {};
		document.addEventListener('DOMContentLoaded', () => {
			document.documentElement.classList.remove('_loading');
		});
	}
}

global.ProjectApp = new ProjectApp();

if (module.hot) {
	module.hot.accept();
}

const inputCards = document.querySelectorAll('.js-input--number');
const cardName = document.getElementById('card-name');
const cartCount = document.querySelector('.cart__count');
const valueInput = document.querySelectorAll('.basket-count__input');

cardName.addEventListener('keypress', evt => {
	if ('1234567890'.indexOf(evt.key) !== -1) {
		evt.preventDefault();
	}
});

inputCards.forEach(el => {
	el.oninput = function() {
		this.value = this.value.replace(/[^\d]/g, '');
	};
});

const updateCartTotal = () => {
	const TAX = 150;
	const SHIPPING = 100;
	const cartContainer = document.getElementsByClassName('basket-list')[0];
	const cartItems = cartContainer.getElementsByClassName('basket-list__item');
	const subTotal = document.getElementById('subtotal');
	const totalPrice = document.getElementById('total');
	const taxElement = document.querySelector('#tax');
	const shippingElement = document.querySelector('#shipping');

	let total = 0;

	for (let i = 0; i < cartItems.length; i++) {
		const cartItem = cartItems[i];

		const price = cartItem.getElementsByClassName('price__current')[0];
		const input = cartItem.getElementsByClassName('basket-count__input')[0];
		const priceValue = Number(price.innerText);
		const quentytyInput = Number(input.value);
		total += priceValue * quentytyInput;
	}
	subTotal.innerText = `$ ${total}`;

	if (total > 1) {
		taxElement.innerText = `$ ${TAX}`;
		shippingElement.innerText = `$ ${SHIPPING}`;
		totalPrice.innerText = '$' + (total + TAX + SHIPPING);
	} else {
		taxElement.innerText = `$` + 0;
		shippingElement.innerText = `$` + 0;
		totalPrice.innerText = `$` + 0;
	}
};

const removeCartItem = evt => {
	const target = evt.target;
	target.parentElement.parentElement.remove();
	updateCartTotal();
};

const countCartIncrease = () => {
	let num = 0;
	for (let i = 0; i < valueInput.length; i++) {
		const input = valueInput[i].value;
		num += Number(input);
	}
	cartCount.innerText = num;
};

const quantityChangeMinus = evt => {
	const parentElement = evt.target.parentElement;
	const input = parentElement.querySelector('.basket-count__input');
	if (Number(input.value).isNaN || Number(input.value) <= 0) {
		input.value = 1;
		cartCount.innerText = 1;
		updateCartTotal();
	}
	input.value--;
	cartCount.innerText--;
	updateCartTotal();
};

const quantityChangePlus = evt => {
	const parentElement = evt.target.parentElement;
	const input = parentElement.querySelector('.basket-count__input');
	input.value++;
	countCartIncrease();
	updateCartTotal();
};

const readyContent = () => {
	const removeCartItemElement = document.getElementsByClassName('close');
	const minus = document.getElementsByClassName('basket-count__btn--minus');
	const plus = document.getElementsByClassName('basket-count__btn--plus');

	for (let i = 0; i < removeCartItemElement.length; i++) {
		const button = removeCartItemElement[i];
		button.addEventListener('click', removeCartItem);
	}

	for (let i = 0; i < minus.length; i++) {
		const button = minus[i];
		button.addEventListener('click', quantityChangeMinus);
	}

	for (let i = 0; i < plus.length; i++) {
		const button = plus[i];
		button.addEventListener('click', quantityChangePlus);
	}
	countCartIncrease();
	updateCartTotal();
};

const doSandwich = () => {
	const sandwich = document.querySelector('.sandwich');
	const wrapper = document.querySelector('.wrapper');
	const menu = document.querySelector('.menu-list');
	sandwich.addEventListener('click', () => {
		sandwich.classList.toggle('sandwich--open');
		menu.classList.toggle('menu-list--open');
		wrapper.classList.toggle('hidden');
	});
};
doSandwich();

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', readyContent);
} else {
	readyContent();
}
