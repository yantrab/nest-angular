import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './auth.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ComponentsModule } from '../components/components.modules'
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [AuthComponent],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    ComponentsModule,
    RouterModule.forRoot([{ path: 'login', component: AuthComponent },
    ])
  ],
  bootstrap: [AuthComponent]
})
export class AuthModule { }
