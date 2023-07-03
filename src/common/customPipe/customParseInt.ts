import { HttpStatus, ParseIntPipe } from '@nestjs/common';

export const CustomParseInt = new ParseIntPipe({
  errorHttpStatusCode: HttpStatus.NOT_FOUND,
});
