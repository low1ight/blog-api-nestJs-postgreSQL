import * as process from 'process';

export class ExpirationDate {
  static createDateForEmailConfirmation(date) {
    date.setTime(
      date.getTime() +
        +process.env.EMAIL_CONFIRMATION_EXPIRATION * 60 * 60 * 1000,
    );

    return date;
  }
}
