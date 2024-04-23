import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

const port = process.env.PORT || 8080;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
  );

  const config = new DocumentBuilder()
      .setTitle('IoT plant API')
      .setDescription('The IoT plant API description')
      .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(port);
}

bootstrap();
