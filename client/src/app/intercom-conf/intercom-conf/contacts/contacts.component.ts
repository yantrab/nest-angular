import { Component, Input, OnInit } from '@angular/core';
import { Contact, ContactField } from 'shared/models/tador.model';
import { ColumnDef } from 'mat-virtual-table';

@Component({
  selector: 'p-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss'],
})
export class ContactsComponent implements OnInit {
  @Input() contacts: Contact[];
  contactColumns: ColumnDef[] = [
    {field: '_id', title: '', isSortable: false},
  ];
  constructor() { }

  ngOnInit() {
    this.contactColumns.push(...this.contacts[0].fields.map(f => ({
      field: f.property,
      title: f.title,
    })));
  }
  getField(prop, fields: ContactField[]){
   return fields.find(f => f.property === prop)
  }
}
