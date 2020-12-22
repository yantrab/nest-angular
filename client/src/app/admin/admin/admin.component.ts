import { Component, Inject, Optional, ViewEncapsulation } from '@angular/core';
import { ITopBarModel } from '../../shared/components/topbar/topbar.interface';
import { AdminController } from '../../../api/admin.controller';
import { App, Permission, User } from 'shared/models';
import { ColumnDef } from 'mat-virtual-table';
import { ActivatedRoute } from '@angular/router';
import { FormComponent, FormModel } from 'ng-dyna-form';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface AdminModel {
    app: App;
    userFormModel: FormModel<User>;
}

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
        { field: 'email', title: 'מייל' },
        { field: 'company', title: 'חברה' },
        { field: 'name', title: 'שם' },
        { field: 'phone', title: 'טלפון' },
        // { field: 'code', title: 'קוד' },
        { field: 'permission', title: 'הרשאה' },
        { field: 'details', title: 'פרטים נוספים' },
    ];

    constructor(
        private api: AdminController,
        private dialog: MatDialog,
        private snackBar: MatSnackBar,
        private route: ActivatedRoute,
        @Optional() @Inject('userEditModel') private readonly model: AdminModel,
    ) {
        if (!model) {
            this.model = {
                app: App.tador,
                userFormModel: {
                    fields: [
                        { placeHolder: 'אמייל', key: 'email' },
                        { placeHolder: 'חברה', key: 'company' },
                        { placeHolder: 'שם פרטי', key: 'fName' },
                        { placeHolder: 'שם משפחה', key: 'lName' },
                        { placeHolder: 'טלפון', key: 'phone' },
                    ],
                    modelConstructor: User,
                    model: undefined,
                },
            };
        }
        this.api.users(this.model.app).then(users => (this.users = users));
    }

    openEditUserDialog(id?: string): void {
        this.model.userFormModel.model = id
            ? { ...this.users.find(user => user.id === id) }
            : new User({ roles: [{ app: this.model.app, permission: Permission.user }] });

        const dialogRef = this.dialog.open(FormComponent, {
            width: '80%',
            maxWidth: '540px',
            data: this.model.userFormModel,
            direction: 'rtl',
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                const relevant = this.users.find(user => user._id === result._id);
                if (!relevant) {
                    this.users = this.users.concat([new User(result)]);
                } else {
                    Object.keys(result).forEach(key => (relevant[key] = result[key]));
                }
                this.api.addUser(result).then(saveResult => {
                    if (!saveResult.ok) {
                        // tslint:disable-next-line:no-console
                        console.error('not saved!');
                        return;
                    }

                    this.snackBar.open('נשמר', 'בטל', {
                        duration: 2000,
                    });
                });
            }
        });
    }
}
