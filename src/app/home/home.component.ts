import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { YoutubeService } from '../services/youtube.service';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

	videoId = '';

	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private youtubeService: YoutubeService
	) { }

	ngOnInit(): void {
		this.router.routeReuseStrategy.shouldReuseRoute = () => false;
		this.videoId = this.activatedRoute.firstChild?.snapshot.params['videoId'];
	}

	getLastSearch() {
		return this.youtubeService.getLastSearch();
	}

}
