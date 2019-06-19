import { Component, EventEmitter, Input } from '@angular/core';

@Component({
    selector: 'p-customize-template',
    templateUrl: './customize-template.component.html',
    styleUrls: ['./customize-template.component.scss'],
})
export class CustomizeTemplateComponent {
    @Input() tTitle: string;
    @Input() back: EventEmitter<undefined>;
}
