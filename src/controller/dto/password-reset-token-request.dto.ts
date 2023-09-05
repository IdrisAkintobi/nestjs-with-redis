import { IsNotEmpty, IsString } from 'class-validator';

export class PasswordResetTokenRequestDTO {
    @IsString()
    @IsNotEmpty()
    userId: string;
}
