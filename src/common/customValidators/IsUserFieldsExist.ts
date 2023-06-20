import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UsersSaService } from '../../modules/users_module/users/application/users.sa.service';

@Injectable()
@ValidatorConstraint({ async: true })
export class IsUserLoginAlreadyExist implements ValidatorConstraintInterface {
  constructor(protected usersService: UsersSaService) {}

  async validate(login: any) {
    const isLoginExist = await this.usersService.isUserLoginExist(login);

    return !isLoginExist;
  }
}

@Injectable()
@ValidatorConstraint({ async: true })
export class IsUserEmailAlreadyExist implements ValidatorConstraintInterface {
  constructor(protected usersService: UsersSaService) {}

  async validate(email: any) {
    const isEmailExist = await this.usersService.isUserEmailExist(email);

    return !isEmailExist;
  }
}

export function IsLoginAlreadyExist(validationOptions?: ValidationOptions) {
  return function (object: NonNullable<unknown>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUserLoginAlreadyExist,
    });
  };
}

export function IsEmailAlreadyExist(validationOptions?: ValidationOptions) {
  return function (object: NonNullable<unknown>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUserEmailAlreadyExist,
    });
  };
}
