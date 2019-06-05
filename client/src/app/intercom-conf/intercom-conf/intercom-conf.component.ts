import { Component, ViewEncapsulation } from '@angular/core';
import { TadorController } from 'src/api/tador.controller';
import { I18nService } from 'src/app/shared/services/i18n.service';
import { ITopBarModel } from '../../shared/components/topbar/topbar.interface';

import { ContactField, Contacts, FieldType, Panel, SettingField } from 'shared/models/tador.model';
import { AutocompleteFilter } from 'shared/models';

@Component({
    selector: 'p-intercom-conf',
    templateUrl: './intercom-conf.component.html',
    styleUrls: ['./intercom-conf.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class IntercomConfComponent {
    FieldType = FieldType;

    topbarModel: ITopBarModel = {
        logoutTitle: 'logout',
        routerLinks: [],
        menuItems: [],
    };

    constructor(private api: TadorController, public i18nService: I18nService) {
        this.panels = Array(10)
            .fill(0)
            .map(
                (_, i) =>
                    new Panel({
                        _id: i.toString(),
                        address: '1600 Amphitheatre Pkwy',
                        name: 'פאנל ' + i,
                        type: 'MP',
                        version: 1.1,
                        contacts: new Contacts({
                            index: 5000,
                            count: 250,
                            contactFields: [
                                new ContactField({ property: 'name1', title: 'שם 1', length: 10 }),
                                new ContactField({ property: 'phone1', title: 'טלפון 1', length: 10 }),
                                new ContactField({ property: 'phone2', title: 'טלפון 2', length: 10 }),
                                new ContactField({ property: 'phone3', title: 'טלפון 3', length: 10 }),
                                new ContactField({ property: 'phone4', title: 'טלפון 4', length: 10 }),
                                new ContactField({ property: 'phone5', title: 'טלפון 5', length: 10 }),
                                new ContactField({ property: 'phone6', title: 'טלפון 6', length: 10 }),
                                new ContactField({ property: 'code', title: 'קוד', length: 10 }),
                                new ContactField({ property: 'reff', title: 'reff', length: 10 }),
                                new ContactField({ property: 'apartment', title: 'apartment', length: 10 }),
                            ],
                        }),
                        settings: [
                            {
                                name: 'general',
                                fields: [
                                    new SettingField({
                                        index: 10,
                                        length: 10,
                                        default: '123456',
                                        type: FieldType.text,
                                        name: 'masterCode',
                                    }),
                                    new SettingField({
                                        index: 10,
                                        length: 10,
                                        default: '252525',
                                        type: FieldType.text,
                                        name: 'tecUserCode',
                                    }),
                                    new SettingField({
                                        index: 10,
                                        length: 10,
                                        default: '00',
                                        type: FieldType.text,
                                        name: 'extKeys',
                                    }),
                                    new SettingField({
                                        index: 10,
                                        length: 10,
                                        default: '1',
                                        type: FieldType.text,
                                        name: 'faststep',
                                    }),
                                    new SettingField({
                                        index: 10,
                                        length: 10,
                                        default: '0000',
                                        type: FieldType.text,
                                        name: 'ofset',
                                    }),
                                    new SettingField({
                                        index: 10,
                                        length: 10,
                                        default: '2',
                                        type: FieldType.text,
                                        name: 'commSpd',
                                    }),
                                    new SettingField({
                                        index: 10,
                                        length: 10,
                                        default: '0',
                                        type: FieldType.text,
                                        name: 'familyNo',
                                    }),
                                    new SettingField({ index: 10, length: 10, default: '', type: FieldType.text, name: 'ofset' }),
                                    new SettingField({
                                        index: 10,
                                        length: 10,
                                        default: 1,
                                        options: () => new Array(250).fill(0).map((_, j) => j),
                                        type: FieldType.list,
                                        name: 'relay1',
                                    }),
                                    new SettingField({
                                        index: 10,
                                        length: 10,
                                        default: 2,
                                        options: () => new Array(250).fill(0).map((_, j) => j),
                                        type: FieldType.list,
                                        name: 'relay2',
                                    }),
                                ],
                            },
                            {
                                name: 'times',
                                fields: [
                                    new SettingField({
                                        index: 10,
                                        length: 10,
                                        default: '00',
                                        type: FieldType.list,
                                        name: 'DelayT',
                                        options: () =>
                                            Array.from(Array(100).keys()).map(a => {
                                                return ('0' + a.toString()).slice(-2);
                                            }),
                                    }),
                                    new SettingField({
                                        index: 10,
                                        length: 10,
                                        default: '00',
                                        type: FieldType.list,
                                        name: 'DoorT',
                                        options: () =>
                                            Array.from(Array(100).keys()).map(a => {
                                                return ('0' + a.toString()).slice(-2);
                                            }),
                                    }),
                                    new SettingField({
                                        index: 10,
                                        length: 10,
                                        default: '00',
                                        type: FieldType.list,
                                        name: 'DelayT',
                                        options: () =>
                                            Array.from(Array(100).keys()).map(a => {
                                                return ('0' + a.toString()).slice(-2);
                                            }),
                                    }),
                                    new SettingField({
                                        index: 10,
                                        length: 10,
                                        default: '00',
                                        type: FieldType.list,
                                        name: 'DelayT2',
                                        options: () =>
                                            Array.from(Array(100).keys()).map(a => {
                                                return ('0' + a.toString()).slice(-2);
                                            }),
                                    }),
                                    new SettingField({
                                        index: 10,
                                        length: 10,
                                        default: '00',
                                        type: FieldType.list,
                                        name: 'DoorT2',
                                        options: () =>
                                            Array.from(Array(100).keys()).map(a => {
                                                return ('0' + a.toString()).slice(-2);
                                            }),
                                    }),
                                    new SettingField({
                                        index: 10,
                                        length: 10,
                                        default: '00',
                                        type: FieldType.list,
                                        name: 'IlluminationT',
                                        options: () =>
                                            Array.from(Array(100).keys()).map(a => {
                                                return ('0' + a.toString()).slice(-2);
                                            }),
                                    }),
                                    new SettingField({
                                        index: 10,
                                        length: 10,
                                        default: '00',
                                        type: FieldType.list,
                                        name: 'RingT',
                                        options: () =>
                                            Array.from(Array(100).keys()).map(a => {
                                                return ('0' + a.toString()).slice(-2);
                                            }),
                                    }),
                                    new SettingField({
                                        index: 10,
                                        length: 10,
                                        default: '00',
                                        type: FieldType.list,
                                        name: 'CameraT',
                                        options: () =>
                                            Array.from(Array(100).keys()).map(a => {
                                                return ('0' + a.toString()).slice(-2);
                                            }),
                                    }),
                                    new SettingField({
                                        index: 10,
                                        length: 10,
                                        default: '00',
                                        type: FieldType.list,
                                        name: 'ProxyT',
                                        options: () =>
                                            Array.from(Array(100).keys()).map(a => {
                                                return ('0' + a.toString()).slice(-2);
                                            }),
                                    }),
                                    new SettingField({
                                        index: 10,
                                        length: 10,
                                        default: '00',
                                        type: FieldType.list,
                                        name: 'FDooR',
                                        options: () =>
                                            Array.from(Array(100).keys()).map(a => {
                                                return ('0' + a.toString()).slice(-2);
                                            }),
                                    }),
                                    new SettingField({
                                        index: 10,
                                        length: 10,
                                        default: '00',
                                        type: FieldType.list,
                                        name: 'DetAnN',
                                        options: () =>
                                            Array.from(Array(100).keys()).map(a => {
                                                return ('0' + a.toString()).slice(-2);
                                            }),
                                    }),
                                    new SettingField({
                                        index: 10,
                                        length: 10,
                                        default: '00',
                                        type: FieldType.list,
                                        name: 'NameAnN',
                                        options: () =>
                                            Array.from(Array(100).keys()).map(a => {
                                                return ('0' + a.toString()).slice(-2);
                                            }),
                                    }),
                                    new SettingField({
                                        index: 10,
                                        length: 10,
                                        default: '00',
                                        type: FieldType.list,
                                        name: 'FloorAnN',
                                        options: () =>
                                            Array.from(Array(100).keys()).map(a => {
                                                return ('0' + a.toString()).slice(-2);
                                            }),
                                    }),
                                    new SettingField({
                                        index: 10,
                                        length: 10,
                                        default: '00',
                                        type: FieldType.list,
                                        name: 'NameLisT',
                                        options: () =>
                                            Array.from(Array(100).keys()).map(a => {
                                                return ('0' + a.toString()).slice(-2);
                                            }),
                                    }),
                                    new SettingField({
                                        index: 10,
                                        length: 10,
                                        default: '00',
                                        type: FieldType.list,
                                        name: 'SelNamE',
                                        options: () =>
                                            Array.from(Array(100).keys()).map(a => {
                                                return ('0' + a.toString()).slice(-2);
                                            }),
                                    }),
                                    new SettingField({
                                        index: 10,
                                        length: 10,
                                        default: '00',
                                        type: FieldType.list,
                                        name: 'SelCleaR',
                                        options: () =>
                                            Array.from(Array(100).keys()).map(a => {
                                                return ('0' + a.toString()).slice(-2);
                                            }),
                                    }),
                                    new SettingField({
                                        index: 10,
                                        length: 10,
                                        default: '00',
                                        type: FieldType.list,
                                        name: 'SpeachT',
                                        options: () =>
                                            Array.from(Array(100).keys()).map(a => {
                                                return ('0' + a.toString()).slice(-2);
                                            }),
                                    }),
                                    new SettingField({
                                        index: 10,
                                        length: 10,
                                        default: '00',
                                        type: FieldType.list,
                                        name: 'BussyRinG',
                                        options: () =>
                                            Array.from(Array(100).keys()).map(a => {
                                                return ('0' + a.toString()).slice(-2);
                                            }),
                                    }),
                                    new SettingField({
                                        index: 10,
                                        length: 10,
                                        default: '00',
                                        type: FieldType.list,
                                        name: 'ConfirM',
                                        options: () =>
                                            Array.from(Array(100).keys()).map(a => {
                                                return ('0' + a.toString()).slice(-2);
                                            }),
                                    }),
                                ],
                            },
                            {
                                name: 'answerY_N',
                                fields: [
                                    new SettingField({
                                        index: 10,
                                        length: 10,
                                        default: '123456',
                                        type: FieldType.text,
                                        name: 'masterCode',
                                    }),
                                ],
                            },
                        ],
                        userId: '',
                    }),
            );
        this.autocompleteSettings = new AutocompleteFilter({ options: this.panels });
        this.selectedPanel = this.panels[0];
    }

    panels: Panel[];
    autocompleteSettings: AutocompleteFilter;
    selectedPanel: Panel;
    contacts: ContactField[];
}
