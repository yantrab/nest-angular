import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { TextBoxComponent } from './text-box.component';
import { MaterialModule } from '../material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { IsEmail } from 'class-validator';

// tslint:disable-next-line: class-name
class user {
    @IsEmail()
    email: string;
}
describe('AppComponent', () => {
    const component = TextBoxComponent;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [component],
            imports:
                [MaterialModule,
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
