import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'p-keyboard',
  templateUrl: './keyboard.component.html',
  styleUrls: ['./keyboard.component.scss']
})
export class KeyboardComponent {
// tslint:disable-next-line: no-output-on-prefix
  @Output() onKeyPress = new EventEmitter();
  keyPress(key) {
    this.onKeyPress.emit(key);
  }
}
