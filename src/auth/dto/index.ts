import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class AuthDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class SignupAuthDto extends AuthDto {
  @IsString()
  @IsNotEmpty()
  fullname: string;
}
