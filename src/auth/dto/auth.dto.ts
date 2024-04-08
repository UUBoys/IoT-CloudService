import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import {
  LoginInput,
  RegisterInput,
} from '../../graphql.schema';

export class RegisterDto extends RegisterInput {
  @IsEmail()
  email: string;
  @Length(6)
  password: string;
  @Length(3)
  name: string;
}

export class LoginDto extends LoginInput {
  @IsEmail()
  email: string;
  @IsNotEmpty()
  password: string;
}