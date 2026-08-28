//animacion fondo home
document.addEventListener('DOMContentLoaded', () => {
	const host = document.body;

	if (!host || host.querySelector('.chronos-particles')) {
		return;
	}

	const layer = document.createElement('div');
	layer.className = 'chronos-particles';
	layer.setAttribute('aria-hidden', 'true');

	const particles = 24;

	for (let index = 0; index < particles; index++) {
		const particle = document.createElement('span');
		particle.className = 'chronos-particle';

		const x = Math.random() * 100;
		const y = Math.random() * 100;
		const size = 2 + Math.random() * 4;
		const duration = 10 + Math.random() * 18;
		const delay = -(Math.random() * duration);
		const opacity = 0.2 + Math.random() * 0.6;

		particle.style.setProperty('--x', `${x.toFixed(2)}vw`);
		particle.style.setProperty('--y', `${y.toFixed(2)}vh`);
		particle.style.setProperty('--size', `${size.toFixed(2)}px`);
		particle.style.setProperty('--duration', `${duration.toFixed(2)}s`);
		particle.style.setProperty('--delay', `${delay.toFixed(2)}s`);
		particle.style.setProperty('--opacity', opacity.toFixed(2));

		layer.appendChild(particle);
	}

	host.prepend(layer);
});
