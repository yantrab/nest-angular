import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewChild,
} from '@angular/core';
import { ContactNameDirection, Contacts, Source } from 'shared/models/tador/panels';
import { ColumnDef } from 'mat-virtual-table';
import { XLSXData, XLSXService } from '../../../shared/services/xlsx.service';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActionType } from 'shared/models/tador/enum';
@Component({
    selector: 'p-contacts',
    templateUrl: './contacts.component.html',
    styleUrls: ['./contacts.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactsComponent implements OnInit {
    ActionType = ActionType;
    @Input() inProgress: boolean;
    ContactNameDirection = ContactNameDirection;
    @Input() contacts: Contacts;
    @Output() fieldChange = new EventEmitter();
    @Output() sendStatus = new EventEmitter();
    complete$ = new Subject<any>();
    @ViewChild('myFileInput') myFileInput;
    @ViewChild('ref', { static: true }) set refField(ref) {
        if (!ref) {
            return;
        }
        setTimeout(() => ref.nativeElement.focus());
    }

    contactColumns: ColumnDef[] = [{ field: 'id', title: '', isSortable: false }];
    Source = Source;

    constructor(private xlsxService: XLSXService, private ref: ChangeDetectorRef) {
    }

    ngOnInit() {
        fromEvent(document, 'keypress').pipe(
            takeUntil(this.complete$),
        ).subscribe((e: KeyboardEvent) => {
            if (this.contacts.nameDirection === ContactNameDirection.LTR && e.keyCode >= 1488) {
                e.preventDefault();
            }
        });

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

    export() {
        const data: XLSXData[] = [{ rows: this.contacts.list }];
        this.xlsxService.export(data, ['contacts'], 'contacts.xlsx');
    }

    handleFileInput(files: FileList) {
        const file = files.item(0);
        const reader = new FileReader();
        reader.onload = e => {
            this.inProgress = true;
            const asd: any[] = this.xlsxService.import(reader.result);
            const props = this.contacts.contactFields.map(c => c.property);
            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < this.contacts.list.length; i++) {
                props.forEach(prop => {
                    const val = asd[i] ? asd[i][prop] : '';
                    this.contacts.list[i][prop] = val;
                });
            }
            this.contacts.list = [...this.contacts.list];
            this.ref.detectChanges();
            this.myFileInput.nativeElement.value = '';
            this.inProgress = false;
        };
        reader.readAsArrayBuffer(file);
    }

    // tslint:disable-next-line:use-lifecycle-interface
    ngOnDestroy(): void {
        this.complete$.next();
    }
}
