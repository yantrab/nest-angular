import { IMenuItem } from '../nav-menu/menu.interface';
export interface ITopBarModel {
    menuItems: IMenuItem[];
    logoutTitle?: string;
    logout?: () => any;
    routerLinks: Array<{ link: string; title: string }>;
    logo?: string;
}
