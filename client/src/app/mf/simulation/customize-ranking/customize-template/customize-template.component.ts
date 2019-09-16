import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'p-customize-template',
    templateUrl: './customize-template.component.html',
    styleUrls: ['./customize-template.component.scss'],
})
export class CustomizeTemplateComponent {
    @Input() tTitle: string;
    @Output() back: EventEmitter<any> = new EventEmitter();
}
