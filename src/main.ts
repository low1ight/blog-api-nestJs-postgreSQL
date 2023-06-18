import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from '../http-exception.filter';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      exceptionFactory: (errors) => {
        const errorsArr = [];

        errors.forEach((error) => {
          const errorsMessagesKeys = Object.keys(error.constraints);

          errorsMessagesKeys.forEach((key) => {
            errorsArr.push({
              message: error.constraints[key],
              field: error.property,
            });
          });
        });

        throw new BadRequestException(errorsArr);
      },
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
}
bootstrap();
