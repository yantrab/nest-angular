import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Contacts, ContactField } from 'shared/models/tador/tador.model';
import { ColumnDef } from 'mat-virtual-table';

@Component({
    selector: 'p-contacts',
    templateUrl: './contacts.component.html',
    styleUrls: ['./contacts.component.scss'],
})
export class ContactsComponent implements OnInit {
    @Input() contacts: Contacts;
    @ViewChild('ref', null) set refField(ref) {
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
