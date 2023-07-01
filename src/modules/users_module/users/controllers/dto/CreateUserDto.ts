import {
  IsEmail,
  IsNotEmpty,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  IsEmailAlreadyExist,
  IsLoginAlreadyExist,
} from '../../../../../common/customValidators/IsUserFieldsExist';

export class CreateUserDto {
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(10)
  @IsLoginAlreadyExist({
    message: 'User $value already exists. Choose another name.',
  })
  @Matches('^[a-zA-Z0-9_-]*$')
  login: string;

  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  password: string;

  @IsEmailAlreadyExist({
    message: 'User with $value email already exists. Choose another email.',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
