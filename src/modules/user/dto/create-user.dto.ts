import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, MaxLength, MinLength } from 'class-validator';


export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  public firstName!: string;

  @ApiProperty()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  public lastName!: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(10)
  public country!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  public email!: string;

  @ApiProperty()
  @IsOptional()
  @IsPhoneNumber()
  public phoneNumber!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  public password!: string;

  constructor(init?: Partial<CreateUserDto>) {
    Object.assign(this, init);
  }
}
