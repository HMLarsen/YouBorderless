import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';

@Injectable({
	providedIn: 'root'
})
export class UtilsService {

	constructor() { }

	searchInNormalizedStrings(s1: string, s2: string) {
		function normalize(s: string) {
			return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
		}
		return normalize(s1).indexOf(normalize(s2)) > -1;
	}

	scrollTop() {
		document.body.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
	}

	noWhitespaceFormValidator(control: FormControl) {
		const isWhitespace = (control.value || '').trim().length === 0;
		const isValid = !isWhitespace;
		return isValid ? null : { 'whitespace': true };
	}

	isTouchDevice() {
		return (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
	}

	makeLandscape() {
		// this works on android, not iOS
		if (screen.orientation && screen.orientation.lock) {
			screen.orientation.lock('landscape');
		}
	}

}
