import { Injectable } from '@angular/core';

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
}
