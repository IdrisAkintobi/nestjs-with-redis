import { Module } from '@nestjs/common';
import { AppService } from './application/app.service';
import { AppController } from './controller/app.controller';
import { RedisModule } from './infrastructure/redis/redis.module';

@Module({
    imports: [RedisModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
