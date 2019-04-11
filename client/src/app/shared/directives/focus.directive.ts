
import { Directive, Input, EventEmitter, ElementRef, Inject, OnInit } from '@angular/core';

@Directive({
    selector: '[p-focus]'
})
export class FocusDirective implements OnInit {
    @Input('p-focus') focusEvent: EventEmitter<boolean>;

    constructor(@Inject(ElementRef) private element: ElementRef) {
    }
    ngOnInit() {
        this.focusEvent.subscribe(event => {
            this.element.nativeElement.focus();
        });
    }
}
