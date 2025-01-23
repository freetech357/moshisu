import { Component } from '@angular/core';

@Component({
	selector: 'app-superadmin-footer',
	templateUrl: './footer.component.html',
	styleUrls: ['../../../common.css', './footer.component.css'],
})
export class FooterComponent {
	currentYear: any = '';

	ngOnInit() {
		this.currentYear = (new Date()).getFullYear();
	}
}
