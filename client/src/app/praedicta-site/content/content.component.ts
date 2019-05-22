import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'p-content',
    templateUrl: './content.component.html',
    styleUrls: ['./content.component.scss'],
})
export class ContentComponent implements OnInit {
    @Input() model: { title: string; content: string };

    ngOnInit() {
        // console.log('x');
    }
}
