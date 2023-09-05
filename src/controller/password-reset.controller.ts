import { BadRequestException, Body, Controller, Get, Post } from '@nestjs/common';
import { ResetTokenInterface } from '../domain/interface/reset.token.interface';
import { PasswordResetService } from '../service/password-reset.service';
import { PasswordResetTokenRequestDTO } from './dto/password-reset-token-request.dto';
import { PasswordUpdateRequestDTO } from './dto/password-update-request.dto';

@Controller('reset-password')
export class PasswordResetController {
    constructor(private readonly passwordResetService: PasswordResetService) {}

    @Post('/generate-token')
    async generateToken(
        @Body() passwordResetTokenRequestDTO: PasswordResetTokenRequestDTO,
    ): Promise<{ data: ResetTokenInterface }> {
        const data = await this.passwordResetService.generateResetToken(
            passwordResetTokenRequestDTO.userId,
        );
        return { data };
    }

    @Get('/update-password')
    async updatePassword(
        @Body() passwordUpdateRequestDTO: PasswordUpdateRequestDTO,
    ): Promise<void> {
        //Check if the token is valid
        const userId = await this.passwordResetService.getTokenUserId(
            passwordUpdateRequestDTO.token,
        );
        if (userId) {
            //TODO Update the user password
            console.log('Password updated successfully');
        } else {
            throw new BadRequestException('Invalid token');
        }
    }
}
