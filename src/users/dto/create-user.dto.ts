import * as classValidator from 'class-validator';

export class CreateUserDto {
  @classValidator.IsString()
  @classValidator.MinLength(4)
  username: string;

  @classValidator.IsEmail()
  email: string;

  @classValidator.IsString()
  @classValidator.MinLength(6)
  password: string;

  @classValidator.IsString()
  @classValidator.IsOptional()
  fullName?: string;
}
