import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'chorusAssignment';
  videoId = '4d79041e-f25f-421d-9e5f-3462459b9934';
  // Pass invalidId into the id parameter below to test error handling
  // For video does not exist
  invalidId = '9041e-f25f-421d-9e5f-3462459b9934';
  constructor(
    private router: Router
  ) {
    this.router.navigate([''], {
      queryParams: {
        id: this.invalidId
      }
    });
  }
}
