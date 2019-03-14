import { Component, Input } from '@angular/core';
import { ITopBarModel } from './topbar.interface';

@Component({
  selector: 'p-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent {
  @Input()
  model: ITopBarModel;
}
