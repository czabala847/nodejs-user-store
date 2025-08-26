import { regularExps } from "../../../config"

export class LoginUserDto {
  private constructor(public email: string, public password: string) {}

  static create(object: { [key: string]: any }): [string?, LoginUserDto?] {
    const { email, password } = object;

    if (!email) return ["Email is required", undefined];
    if (!password) return ["Password is required", undefined];

    if (!regularExps.email.test(email)) {
      return ["Email is not valid", undefined];
    }

    return [undefined, new LoginUserDto(email, password)];
  }
}
