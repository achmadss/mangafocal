import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {

    const appOpt = { bodyParser: true }
    const app = await NestFactory.create(AppModule, appOpt);

    app.enableCors()

    const config = new DocumentBuilder()
        .setTitle("Mangafocal API")
        .setDescription("This is the Mangafocal API")
        .setVersion("1.0")
        .build()

    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('api', app, document)

    const validationPipeOpt = { whitelist: true }
    app.useGlobalPipes(new ValidationPipe(validationPipeOpt))

    await app.listen(3000);
}
bootstrap();
