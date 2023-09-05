import { Module } from '@nestjs/common';
import { AppController } from './controller/app.controller';
import { PasswordResetController } from './controller/password-reset.controller';
import { ProductController } from './controller/product.controller';
import { RedisModule } from './infrastructure/redis/redis.module';
import { AppService } from './service/app.service';
import { PasswordResetService } from './service/password-reset.service';
import { ProductService } from './service/product.service';

@Module({
    imports: [RedisModule],
    controllers: [AppController, ProductController, PasswordResetController],
    providers: [AppService, ProductService, PasswordResetService],
})
export class AppModule {}
