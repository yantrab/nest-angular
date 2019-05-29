import { IMenuItem } from '../nav-menu/menu.interface';
export interface ITopBarModel {
    menuItems: IMenuItem[];
    logoutTitle: string;
    routerLinks: Array<{ link: string; title: string }>;
    logo?: string;
}
