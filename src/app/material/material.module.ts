import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';

import { MaterialElevationDirective } from './material-elevation.directive';

@NgModule({
	exports: [
		CommonModule,
		MatFormFieldModule,
		MatIconModule,
		MatButtonModule,
		MatInputModule,
		MatProgressBarModule,
		MatSnackBarModule,
		MatCardModule,
		MaterialElevationDirective
	],
	declarations: [MaterialElevationDirective]
})
export class MaterialModule { }
