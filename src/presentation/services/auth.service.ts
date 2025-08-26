import { bcryptAdapter, JwtAdapter } from "../../config"
import { UserModel } from "../../data"
import {
  CustomError,
  LoginUserDto,
  RegisterUserDto,
  UserEntity,
} from "../../domain"

export class AuthService {
  public async registerUser(registerUserDto: RegisterUserDto) {
    const existUser = await UserModel.findOne({ email: registerUserDto.email });

    if (existUser) {
      throw CustomError.badRequest("Email already exists");
    }

    try {
      const user = new UserModel(registerUserDto);

      //Encriptar password
      user.password = bcryptAdapter.hash(registerUserDto.password);

      await user.save();

      const { password, ...rest } = UserEntity.fromObject(user);

      return { user: { ...rest }, token: "ABC" };
    } catch (error) {
      throw CustomError.internalServerError(`${error}`);
    }
  }

  public async loginUser(loginUserDto: LoginUserDto) {
    const user = await UserModel.findOne({ email: loginUserDto.email });

    if (!user) {
      throw CustomError.badRequest("User not found");
    }

    if (!bcryptAdapter.compare(loginUserDto.password, user.password)) {
      throw CustomError.badRequest("Password not valid");
    }

    const { password, ...rest } = UserEntity.fromObject(user);

    const token = await JwtAdapter.generateToken({
      id: user.id,
      email: user.email,
    });

    if (!token) {
      throw CustomError.internalServerError("Error generating token");
    }

    return { user: { ...rest }, token: "ABC" };
  }
}
