import { IsString } from 'class-validator';

export class PasswordUpdateRequestDTO {
    @IsString()
    userId: string;

    @IsString()
    password: string;

    @IsString()
    token: string;
}
