import { HttpException, HttpStatus } from '@nestjs/common';

const httpStatus = {
  1: { status: HttpStatus.NOT_FOUND, message: 'Not found' },
  2: { status: HttpStatus.BAD_REQUEST, message: 'Bad request' },
  3: { status: HttpStatus.FORBIDDEN, message: 'Forbidden' },
};

export class Exceptions {
  static throwHttpException(
    code,
    errMessage: any = null,
    errField: string = null,
  ) {
    const error = {
      message: errMessage || httpStatus[code].message,
    };

    //if err include errField
    if (errField) error['field'] = errField;

    const errorsObj = {
      message: [error],
    };

    throw new HttpException(errorsObj, httpStatus[code].status);
  }
}
