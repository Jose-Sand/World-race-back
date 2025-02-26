import { SetMetadata } from '@nestjs/common';
import { ValidRoles } from 'src/common/constant/validRoles';

export const META_ROLES = 'roles';

export const RoleProtected = (...args: ValidRoles[]) =>
  SetMetadata(META_ROLES, args);
