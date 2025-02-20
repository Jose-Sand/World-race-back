import { Reflector } from '@nestjs/core';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from '../entities/user.entity';
import { META_ROLES } from '../decorators/role-protected.decorator';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles: string[] = this.reflector.get(
      META_ROLES,
      context.getHandler(),
    );
    const req = context.switchToHttp().getRequest();
    const user: User = req.user;

    if (!user) throw new BadRequestException('User not Found');

    if (!validRoles) return true;
    if (validRoles.length === 0) return true;

    const isValid = validRoles.includes(user.role.name);
    if (isValid) return true;

    throw new ForbiddenException(
      `User ${user.email} need a valid role [${validRoles}]`,
    );
  }
}
