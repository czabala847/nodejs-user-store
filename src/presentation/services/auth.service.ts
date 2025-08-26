import { bcryptAdapter, envs, JwtAdapter } from "../../config"
import { UserModel } from "../../data"
import {
  CustomError,
  LoginUserDto,
  RegisterUserDto,
  UserEntity,
} from "../../domain"
import { EmailService } from "./email.service"

export class AuthService {
  constructor(private readonly emailService: EmailService) {}

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

      // await this.sendEmailValidationLink(user.email);

      const { password, ...rest } = UserEntity.fromObject(user);

      const token = await JwtAdapter.generateToken({
        id: user.id,
        email: user.email,
      });

      if (!token) {
        throw CustomError.internalServerError("Error generating token");
      }

      return { user: { ...rest }, token };
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

    return { user: { ...rest }, token };
  }

  private sendEmailValidationLink = async (email: string) => {
    const token = await JwtAdapter.generateToken({ email });

    if (!token) {
      throw CustomError.internalServerError("Error generating token");
    }

    const link = `${envs.WEBSERVICE_URL}/auth/validate-email/${token}`;
    const html = `<p>Click <a href="${link}">here</a> to validate your email</p>`;

    const options = {
      to: email,
      subject: "Validate your email",
      htmlBody: html,
    };

    const isSet = await this.emailService.sendEmail(options);

    if (!isSet) {
      throw CustomError.internalServerError("Error sending email");
    }

    return true;
  };

  public validEmail = async (token: string) => {
    const decoded = await JwtAdapter.validateToken(token);

    if (!decoded) {
      throw CustomError.unauthorized("Invalid token");
    }

    const { email } = decoded as { email: string };

    if (!email) {
      throw CustomError.internalServerError("Email not in token");
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      throw CustomError.badRequest("User not found");
    }

    if (user.emailValidated) {
      throw CustomError.badRequest("Email already validated");
    }

    user.emailValidated = true;
    await user.save();

    return true
  };
}
