import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

import { MaterialElevationDirective } from './material-elevation.directive';
import { MatCheckboxModule } from '@angular/material/checkbox';

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
		MaterialElevationDirective,
		MatDialogModule,
		MatSelectModule,
		NgxMatSelectSearchModule,
		MatCheckboxModule,
		MatProgressSpinnerModule,
		DragDropModule
	],
	declarations: [MaterialElevationDirective]
})
export class MaterialModule { }
