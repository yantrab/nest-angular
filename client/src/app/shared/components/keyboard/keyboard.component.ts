import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'p-keyboard',
  templateUrl: './keyboard.component.html',
  styleUrls: ['./keyboard.component.scss']
})
export class KeyboardComponent {
  @Output() onKeyPress = new EventEmitter();
  keyPress(key) {
    this.onKeyPress.emit(key);
  }
}
