import { Module } from '@nestjs/common';
import { AppController } from './controller/app.controller';
import { RedisModule } from './infrastructure/redis/redis.module';
import { AppService } from './service/app.service';

@Module({
    imports: [RedisModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
