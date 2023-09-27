import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import 'dotenv/config';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe({ transform: true, validateCustomDecorators: true }));
    app.enableShutdownHooks();
    await app.listen(process.env.PORT || 3003);

    console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
