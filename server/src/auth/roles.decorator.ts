import { SetMetadata } from '@nestjs/common';
import { App, Permission } from 'shared';

export const ControllerRole = (role: App) => SetMetadata('controllerRole', role);
export const MethodRoles = (permisisons: Permission[]) => SetMetadata('methodRoles', permisisons);
