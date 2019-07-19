import { Component, Injectable, TemplateRef } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { I18nService } from './i18n.service';
import { ComponentType } from '@angular/cdk/portal';

@Injectable()
export class DialogService {
    constructor(private i18nService: I18nService, private dialog: MatDialog) {}
    open<T, D = any, R = any>(
        componentOrTemplateRef: ComponentType<T> | TemplateRef<T>,
        config?: MatDialogConfig<D>,
    ): MatDialogRef<T, R> {
        return this.dialog.open(componentOrTemplateRef, Object.assign(config, { direction: this.i18nService.dir }));
    }
}
