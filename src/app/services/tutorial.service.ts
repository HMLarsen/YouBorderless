import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TourService } from 'ngx-tour-md-menu';
import { PwaService } from './pwa.service';

@Injectable({
	providedIn: 'root'
})
export class TutorialService {

	showLiveTutorialLocalStorageName = 'showLiveTutorial';

	constructor(
		public tourService: TourService,
		private translateService: TranslateService,
		private pwaService: PwaService
	) { }

	async initLiveTour() {
		const endBtnTitle = await this.translateService.get('broadcast.tour.end').toPromise();
		const captionsTitle = await this.translateService.get('broadcast.tour.captionsTitle').toPromise();
		const captionsContent = await this.translateService.get('broadcast.tour.captionsContent').toPromise();
		const backwardCaptionsTitle = await this.translateService.get('broadcast.tour.backwardCaptionsTitle').toPromise();
		const backwardCaptionsContent = await this.translateService.get('broadcast.tour.backwardCaptionsContent').toPromise();
		const forwardCaptionsTitle = await this.translateService.get('broadcast.tour.forwardCaptionsTitle').toPromise();
		const forwardCaptionsContent = await this.translateService.get('broadcast.tour.forwardCaptionsContent').toPromise();
		const fullscreenTitle = await this.translateService.get('broadcast.tour.fullscreenTitle').toPromise();
		const fullscreenContent = await this.translateService.get('broadcast.tour.fullscreenContent').toPromise();
		const changeSettingsTitle = await this.translateService.get('broadcast.tour.changeSettingsTitle').toPromise();
		const changeSettingsContent = await this.translateService.get('broadcast.tour.changeSettingsContent').toPromise();

		this.tourService.initialize([
			{ anchorId: 'captionsContainer', title: captionsTitle, content: captionsContent },
			{ anchorId: 'captionsMinusButton', title: backwardCaptionsTitle, content: backwardCaptionsContent },
			{ anchorId: 'captionsPlusButton', title: forwardCaptionsTitle, content: forwardCaptionsContent },
			{ anchorId: 'fullscreenButton', title: fullscreenTitle, content: fullscreenContent },
			{ anchorId: 'settingsButton', title: changeSettingsTitle, content: changeSettingsContent }
		], {
			enableBackdrop: true,
			endBtnTitle: endBtnTitle
		});
		this.showTutorial();
	}

	showTutorial() {
		const isPwaShowing = !!this.pwaService.installComponentSnackElement;
		this.tourService.start$.subscribe(() => this.pwaService.closeInstallComponent());
		this.tourService.end$.subscribe(() => {
			this.saveTutorialEnded();
			if (isPwaShowing) this.pwaService.openInstallComponent();
		});
		this.tourService.start();
	}

	isShowLiveTutorial(): boolean {
		return !localStorage.getItem(this.showLiveTutorialLocalStorageName);
	}

	saveTutorialEnded() {
		localStorage.setItem(this.showLiveTutorialLocalStorageName, 'false');
	}

}
