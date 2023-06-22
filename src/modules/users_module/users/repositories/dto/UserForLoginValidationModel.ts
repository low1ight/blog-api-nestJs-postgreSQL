export type UserForLoginValidationModel = {
  id: number;
  login: string;
  email: string;
  password: string;
  isBanned: boolean;
  isConfirmed: boolean;
};
