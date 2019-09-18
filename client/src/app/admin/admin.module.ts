import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin/admin.component';
import { RouterModule } from '@angular/router';
import { ComponentsModule } from '../shared/components/components.module';
import { AdminController } from '../../api/admin.controller';

@NgModule({
    declarations: [AdminComponent],
    entryComponents: [AdminComponent],
    imports: [CommonModule, ComponentsModule, RouterModule.forChild([{ path: '', component: AdminComponent }])],
    providers: [AdminController, { provide: 'baseUrlI18n', useValue: '../../assets/i18n/login' }],
})
export class AdminModule {}
