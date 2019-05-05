import { User, App } from './models/user.model';
export const hasPermission = (user: User, app: App) =>
    user &&
    user.roles &&
    user.roles.some(role => role.app === App.admin || role.app === app);
