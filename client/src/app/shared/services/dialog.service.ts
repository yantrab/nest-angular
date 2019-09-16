import { Component, Injectable, TemplateRef } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { I18nService } from './i18n.service';
import { ComponentType } from '@angular/cdk/portal';

@Injectable()
export class DialogService {
    constructor(private i18nService: I18nService, private dialog: MatDialog) {}
    open<T, D = any, R = any>(
        componentOrTemplateRef: ComponentType<T> | TemplateRef<T>,
        config?: MatDialogConfig<D> & { title?: string },
    ): MatDialogRef<T, R> {
        const ref = this.dialog.open(componentOrTemplateRef, Object.assign(config, { direction: this.i18nService.dir }));
        if (config.title) {
            const el = document.createElement('span');
            el.textContent = config.title;
            el.className = 'dialogTitle';
            document.getElementsByTagName('mat-dialog-container')[0].prepend(el);
        }
        return ref;
    }
}
