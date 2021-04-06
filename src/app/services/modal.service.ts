import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LiveOptionsModalComponent } from '../live/live-options-modal/live-options-modal.component';

@Injectable({
	providedIn: 'root'
})
export class ModalService {

	constructor(private dialog: MatDialog) { }

	openLiveOptionsModel(videoId: string) {
		return this.dialog.open(LiveOptionsModalComponent, {
			panelClass: 'config-live-dialog',
			width: '21.875rem',
			data: { videoId }
		});
	}

}
