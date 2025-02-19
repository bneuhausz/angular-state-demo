import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  template: `
    <h1>Welcome to {{title}}!</h1>
    <a routerLink="native-features">native</a>
    <router-outlet />
  `,
  styles: [],
})
export class AppComponent {
  title = 'state-demo';
}
