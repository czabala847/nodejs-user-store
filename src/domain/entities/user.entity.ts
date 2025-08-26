import { CustomError } from "../errors/custom.error"

export class UserEntity {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public emailValidated: boolean,
    public password: string,
    public role: string[],
    public img?: string
  ) {}

  static fromObject(object: { [key: string]: any }) {
    const { id, _id, name, email, emailValidated, password, role, img } =
      object;

    if (!id && !_id) {
      throw CustomError.badRequest("Id is required");
    }

    if (!name) {
      throw CustomError.badRequest("Name is required");
    }

    if (!email) {
      throw CustomError.badRequest("Email is required");
    }

    if (emailValidated === undefined) {
      throw CustomError.badRequest("Email validated is required");
    }

    if (!password) {
      throw CustomError.badRequest("Password is required");
    }

    if (!role) {
      throw CustomError.badRequest("Role is required");
    }

    return new UserEntity(
      _id || id,
      name,
      email,
      emailValidated,
      password,
      role,
      img
    );
  }
}
