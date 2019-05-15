import { Component, ViewEncapsulation } from '@angular/core';
import { ITopBarModel } from '../../shared/components/topbar/topbar.interface';
import { AdminController } from '../../../api/admin.controller';
import { User } from 'shared/models';
import { ColumnDef } from 'mat-virtual-table';
import { MatDialog } from '@angular/material';
import { EditUserComponent } from './edit-user/edit-user.component';

@Component({
    selector: 'p-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class AdminComponent {
    topbarModel: ITopBarModel = { logoutTitle: 'logout', routerLinks: [], menuItems: [] };
    users: User[];
    columns: ColumnDef[] = [
        { field: 'edit', title: ' ', width: '70px', isSortable: false },
        { field: '_id', title: 'מייל' },
        { field: 'company', title: 'חברה' },
        { field: 'name', title: 'שם' },
        { field: 'phone', title: 'טלפון' },
        { field: 'permission', title: 'הרשאה' },
        { field: 'details', title: 'פרטים נוספים' },
    ];
    constructor(private api: AdminController, private dialog: MatDialog) {
        this.api.users().then(users => (this.users = users));
    }

    openEditUserDialog(id: string): void {
        const dialogRef = this.dialog.open(EditUserComponent, {
            width: '80%',
            height: '80%',
            data: this.users.find(user => user._id === id),
            direction: 'rtl',
        });

        dialogRef.afterClosed().subscribe(result => {});
    }
}
