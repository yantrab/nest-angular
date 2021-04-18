import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ConfService } from '../conf.service';
import { ContactNameDirection, MPPanel, Panel } from 'shared/models/tador/panels';
import { ColumnDef } from 'mat-virtual-table';
import { FormComponent, FormModel } from 'ng-dyna-form';
import { AddPanelRequest } from 'shared/models/tador/add-panel-request';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgDialogAnimationService } from 'ng-dialog-animation';

@Component({
  selector: 'p-panels',
  templateUrl: './panels.component.html',
  styleUrls: ['./panels.component.scss']
})
export class PanelsComponent implements OnInit {
  constructor(public api: ConfService,
              private dialog: NgDialogAnimationService,
              private snackBar: MatSnackBar,
              private ref: ChangeDetectorRef) { }
  panels: Panel[];
  columns: ColumnDef[] = [
    { field: 'edit', title: ' ', width: '150px', isSortable: false },
    { field: 'userId', title: 'טכנאי' },
    { field: 'panelId', title: 'מזהה פנל' },
    { field: 'phoneNumber', title: 'טלפון פנל' },
    { field: 'Address', title: 'כתובת' },
    { field: 'contactName', title: 'שם איש קשר' },
    { field: 'contactPhone', title: 'טלפון איש קשר' },
    { field: 'type', title: 'סוג' },
    { field: 'version', title: 'גירסה' },
  ];

  addPanelFormModel: FormModel<AddPanelRequest> = {
    fields: [
      { placeHolder: 'iemi', key: 'panelId' },
      { placeHolder: 'id', key: 'id' },
      { placeHolder: 'Lang', key: 'direction', type: 'radio',
        options: [{title: 'Hebrew', value: ContactNameDirection.RTL}, {title: 'English', value: ContactNameDirection.LTR}]},
      {key: 'address', placeHolder: 'כתובת'},
      {key: 'contactName', placeHolder: 'שם איש קשר'},
      {key: 'contactPhone', placeHolder: 'טלפון איש קשר'},
      {key: 'phoneNumber', placeHolder: 'טלפון פנל'},
    ],
    modelConstructor: AddPanelRequest,
    formTitle: 'הוספת פאנל',
    model: new AddPanelRequest(),
  };

  editPanelFormModel: FormModel<Panel> = {
    fields: [
      {key: 'address', placeHolder: 'כתובת'},
      {key: 'contactName', placeHolder: 'שם איש קשר'},
      {key: 'contactPhone', placeHolder: 'טלפון איש קשר'},
      {key: 'phoneNumber', placeHolder: 'טלפון פנל'},
    ],
    modelConstructor: Panel,
    formTitle: 'עריכת פאנל',
  };

  ngOnInit() {
    this.api.dataSub.subscribe(async data => {
      this.panels = undefined;
      this.ref.detectChanges();
      this.panels = data.panels;
      this.ref.detectChanges();
    });
  }

  openEditPanelDialog(panel) {
    const model = this.editPanelFormModel;
    model.model = panel;
    const dialogRef = this.dialog.open(FormComponent, {
      width: '80%',
      maxWidth: '450px',
      height: '350px',
      data: model,
      direction: 'rtl',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {return; }
      this.api.savePanel(result).then((saveResult: any) => {
          if (!saveResult.ok) {
            // tslint:disable-next-line:no-console
            console.error('not saved!');
            return;
          }

          this.snackBar.open('נשמר', 'בטל', {
            duration: 2000,
          });
        });
    });
  }
  openCreatePanelDialog() {
    const model = this.addPanelFormModel;

    const dialogRef = this.dialog.open(FormComponent, {
      width: '80%',
      maxWidth: '540px',
      data: model
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {return; }
      result = Object.assign(new AddPanelRequest(), result);
      if (!result.isMatch) {
        this.addPanelFormModel.model = result;
        return this.openCreatePanelDialog();
      }

      this.api.addNewPanel(result).then(saveResult => {
        this.snackBar.open('נשמר', 'בטל', {
          duration: 2000,
        });
      }).catch(e =>{
        this.snackBar.open(e, 'סבבה', {
          duration: 10000,
        });
      });
    });
  }
}
