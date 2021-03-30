import { trigger, style, transition, animate } from '@angular/animations';

export const Animations = {
	inOutAnimation: trigger('inOutAnimation', [
		transition(':enter', [
			style({ height: 0, opacity: 0 }),
			animate('200ms ease-out', style({ height: 300, opacity: 1 }))
		]),
		transition(':leave', [
			style({ height: 300, opacity: 1 }),
			animate('200ms ease-in', style({ height: 0, opacity: 0 }))
		])
	])
}