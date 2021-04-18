import {
	trigger,
	animate,
	transition,
	style,
	query,
	stagger,
	animateChild,
	group
} from '@angular/animations';

export const fadeAnimation = trigger('fadeAnimation', [
	// The '* => *' will trigger the animation to change between any two states
	transition('* => *', [
		// The query function has three params.
		// First is the event, so this will apply on entering or when the element is added to the DOM.
		// Second is a list of styles or animations to apply.
		// Third we add a config object with optional set to true, this is to signal
		// angular that the animation may not apply as it may or may not be in the DOM.
		query(':enter', [style({ opacity: 0 })], { optional: true }),
		query(
			':leave',
			// here we apply a style and use the animate function to apply the style over 0.1 seconds
			[style({ opacity: 1 }), animate('0.1s', style({ opacity: 0 }))],
			{ optional: true }
		),
		query(
			':enter',
			[style({ opacity: 0 }), animate('0.1s', style({ opacity: 1 }))],
			{ optional: true }
		)
	])
]);

export const listAnimation = trigger('listAnimation', [
	transition(':enter', [
		query('@itemsListAnimation', stagger(100, animateChild()))
	]),
]);

export const itemsListAnimation = trigger('itemsListAnimation', [
	transition(':enter', [
		style({ opacity: 0 }), animate('0.1s', style({ opacity: 1 }))
	])
]);

export const wordAnimation = trigger('wordAnimation', [
	transition("* => *", group([
		query(':enter', [
			style({ opacity: 0, transform: 'translateY(40%)' }),
			animate('.5s ease-out', style({ opacity: 1, transform: 'translateY(0%)' }))
		], { optional: true }),
		query(':leave', [
			style({ opacity: 1, transform: 'translateY(0%)' }),
			animate('.5s ease-out', style({ opacity: 0, transform: 'translateY(-40%)' }))
		], { optional: true })
	]))
])