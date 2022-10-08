import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ProfileDto {
  @Expose()
  @ApiProperty()
  public firstName!: string;

  @Expose()
  @ApiProperty()
  public lastName!: string;

  @Expose()
  @ApiProperty()
  public country!: string;

  @Expose()
  @ApiProperty()
  public email!: string;

  @Expose()
  @ApiProperty()
  public coverUrl!: string;

  @Expose()
  @ApiProperty()
  public avatarUrl!: string;

  @Expose()
  @ApiProperty()
  public phoneNumber!: string;

  @Expose()
  @ApiProperty()
  public invitationCode?: string;

  @Expose()
  @ApiProperty()
  public dateOfBirth!: Date;

  @Expose()
  @ApiPropertyOptional()
  public isPasswordEmpty?: boolean;

  constructor(init?: Partial<ProfileDto>) {
    Object.assign(this, init);
  }
}
