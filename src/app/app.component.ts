import { Component } from '@angular/core';
import { CirclePackingComponent } from './components/circle-packing/circle-packing.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CirclePackingComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'itonics-circle-packing';
}
