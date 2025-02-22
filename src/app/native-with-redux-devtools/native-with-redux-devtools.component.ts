import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NativeWithReduxDevtoolsFeaturesService } from './native-with-redux-devtools-features.service';

@Component({
  selector: 'app-native-with-redux-devtools',
  imports: [JsonPipe, ReactiveFormsModule],
  providers: [NativeWithReduxDevtoolsFeaturesService],
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
  service = inject(NativeWithReduxDevtoolsFeaturesService);
}
