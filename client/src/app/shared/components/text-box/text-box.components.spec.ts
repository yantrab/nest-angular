import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { TextBoxComponent } from './text-box.component';
import { DebugElement } from '@angular/core';
import { materialModule } from '../material/material.module'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { DynaFormBuilder } from '../../../../dyna-form/dyna-form.builder'
import { IsEmail } from 'class-validator';

class user {
    @IsEmail()
    email: string;
}
describe('AppComponent', () => {
    let component = TextBoxComponent;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [component],
            imports:
                [materialModule,
                    FormsModule,
                    ReactiveFormsModule,
                    CommonModule,
                    BrowserModule,
                    BrowserAnimationsModule]
        }).compileComponents();

    }));

    it('should show placeholder', async () => {
        // const fixture = TestBed.createComponent(component);
        // let comp = fixture.componentInstance;
        // const el: HTMLElement = fixture.nativeElement;
        // comp.name = 'email'
        // comp.form = (await new DynaFormBuilder(new FormBuilder()).buildFormFromClass(user)).controls['email']
        // comp.placeholder = 'placeholder works!'
        // fixture.detectChanges();
        // const p = el.querySelector('input');
        // expect(p.placeholder).toEqual('placeholder works!');
    });


});
