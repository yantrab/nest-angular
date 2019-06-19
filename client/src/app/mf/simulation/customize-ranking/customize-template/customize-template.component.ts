import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'p-customize-template',
    templateUrl: './customize-template.component.html',
    styleUrls: ['./customize-template.component.scss'],
})
export class CustomizeTemplateComponent {
    @Input() title: string;
    @Input() back: EventEmitter<undefined>;
}
