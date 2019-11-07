import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Contacts } from 'shared/models/tador/panels';
import { ColumnDef } from 'mat-virtual-table';

@Component({
    selector: 'p-contacts',
    templateUrl: './contacts.component.html',
    styleUrls: ['./contacts.component.scss'],
})
export class ContactsComponent implements OnInit {
    @Input() contacts: Contacts;
    @ViewChild('ref', { static: true }) set refField(ref) {
        if (!ref) {
            return;
        }
        setTimeout(() => ref.nativeElement.focus());
    }

    contactColumns: ColumnDef[] = [{ field: 'id', title: '', isSortable: false }];

    ngOnInit() {
        this.contactColumns.push(
            ...this.contacts.contactFields.map(f => ({
                field: f.property,
                title: f.title,
            })),
        );
    }
}
