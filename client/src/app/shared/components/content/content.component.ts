import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'p-section-content',
    templateUrl: './content.component.html',
    styleUrls: ['./content.component.scss'],
})
export class ContentComponent {
    @Input() moreTitle: string;
    @Input() lessTitle: string;
    @Input() content: string;
    @Input() contentMore: string;
    @Input() contentMoreFooter: string;
    @Output() open = new EventEmitter();
    @Output() close = new EventEmitter();
    more = false;
    ngOnChanges() {
        this.more = false;
        this.close.emit();
    }
}
