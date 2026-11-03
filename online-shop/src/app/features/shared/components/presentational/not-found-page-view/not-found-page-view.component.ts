import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  imports: [MatButtonModule, RouterLink],
  selector: 'app-not-found-page-view',
  styleUrl: './not-found-page-view.component.scss',
  templateUrl: './not-found-page-view.component.html',
})
export class NotFoundPageViewComponent {}
