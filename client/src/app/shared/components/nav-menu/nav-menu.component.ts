import { Component, OnInit, Input } from '@angular/core';
import { IMenuItem } from './menu.interface';

@Component({
  selector: 'p-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss']
})
export class NavMenuComponent {
  @Input()
  items: IMenuItem[];
}
