import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PageHeaderComponent } from './features/shared/components/containers/page-header/page-header.component';

@Component({
  imports: [RouterOutlet, PageHeaderComponent],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('online-shop');
}
