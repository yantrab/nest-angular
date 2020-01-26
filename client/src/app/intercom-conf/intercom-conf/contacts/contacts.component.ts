import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Contacts, Source } from 'shared/models/tador/panels';
import { ColumnDef } from 'mat-virtual-table';

@Component({
    selector: 'p-contacts',
    templateUrl: './contacts.component.html',
    styleUrls: ['./contacts.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactsComponent implements OnInit {
    @Input() contacts: Contacts;
    @Output() fieldChange = new EventEmitter();
    @ViewChild('ref', { static: true }) set refField(ref) {
        if (!ref) {
            return;
        }
        setTimeout(() => ref.nativeElement.focus());
    }

    contactColumns: ColumnDef[] = [{ field: 'id', title: '', isSortable: false }];
    Source = Source;

    ngOnInit() {
        this.contactColumns.push(
            ...this.contacts.contactFields.map(f => ({
                field: f.property,
                title: f.title,
            })),
        );
    }
    getColor(index, property: string) {
        // console.log(index + property);
        const source: Source = this.contacts.changesList
            ? this.contacts.changesList[index]
                ? this.contacts.changesList[index][property]
                : undefined
            : undefined;
        if (source === Source.client) {
            return 'yellow';
        }
        if (source === Source.Panel) {
            return 'greenyellow';
        }

        if (source === Source.PanelProgress) {
            return 'orangered';
        }
    }

    signChange(index, field) {
        this.contacts.changesList = this.contacts.changesList || [];
        this.contacts.changesList[index] = this.contacts.changesList[index] || {};

        this.contacts.changesList[index][field.property] = Source.client;
    }
}
