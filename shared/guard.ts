import { User, App, Role, Permission } from './models/user.model';
export const hasPermission = (user: User, app: App) =>
    user && user.roles && user.roles.some(role => role.app === App.admin || role.app === app);
export const hasRole = (user: User, app: App, permissions: Permission[]) =>
    user &&
    user.roles.some(role => role.app === App.admin || (role.app === app && permissions.includes(role.permission)));
