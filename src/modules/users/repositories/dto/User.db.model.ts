export type UserDbModel = {
  id: number;
  login: string;
  password: string;
  passwordRecoveryCode: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};
