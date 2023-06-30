export type UsersEmailConfirmationDbModel = {
  ownerId: number;
  confirmationCode: string;
  expirationDate: Date;
  isConfirmed: boolean;
};
