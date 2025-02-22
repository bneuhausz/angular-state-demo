import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { GlobalStateService } from './shared/global-state.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  template: `
    <div [style.backgroundColor]="globalState.backgroundColor()" [style.color]="globalState.fontColor()">
      <h1>State demo</h1>
      <a routerLink="native-features">native</a>
      <a routerLink="ngrx-signal-store">ngrx-signal-store</a>
      <button (click)="globalState.backgroundColorChanged$.next()">Change color</button>
      <router-outlet />
    </div>
  `,
  styles: [],
})
export class AppComponent {
  globalState = inject(GlobalStateService);
}
