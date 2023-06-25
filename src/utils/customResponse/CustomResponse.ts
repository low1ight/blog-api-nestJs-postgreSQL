import { CustomResponseEnum } from './CustomResponseEnum';

export class CustomResponse<T> {
  constructor(
    public readonly isSuccess: boolean,
    public readonly errStatusCode: CustomResponseEnum | null = null,
    public readonly content: T | null = null,
  ) {}
}
