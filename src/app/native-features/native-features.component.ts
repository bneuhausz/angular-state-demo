import { Component, inject } from '@angular/core';
import { NativeFeaturesService } from './native-features.service';
import { JsonPipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-native-features',
  imports: [JsonPipe, ReactiveFormsModule],
  providers: [NativeFeaturesService],
  template: `
    <p>
      <input [formControl]="service.filterControl" />
      <select [formControl]="service.orderControl">
        <option value="asc">asc</option>
        <option value="desc">desc</option>
      </select>
    </p>
    <p>
      {{ service.isLoading() ? 'loading...' : (service.books() | json) }}
    </p>
    <p>
      Total books: {{ service.booksCount() }}
    </p>
  `,
  styles: ``
})
export default class NativeFeaturesComponent {
  service = inject(NativeFeaturesService);
}
