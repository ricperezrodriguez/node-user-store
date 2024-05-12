import { JwtAdapter, bcryptAdapter } from "../../config";
import { UserModel } from "../../data";
import {
  CustomError,
  LoginUserDto,
  RegisterUserDto,
  UserEntity,
} from "../../domain";

export class AuthService {
  constructor() {}

  public async registerUser(registerUserDto: RegisterUserDto) {
    const existUser = await UserModel.findOne({ email: registerUserDto.email });
    if (existUser) throw CustomError.badRequest("Email already exist");

    try {
      const user = new UserModel(registerUserDto);

      //  Encriptar la contraseña
      user.password = bcryptAdapter.hash(registerUserDto.password);
      await user.save();

      const { password, ...userEntity } = UserEntity.fromObject(user);

      return { ...userEntity, token: "abc" };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  public async loginUser(loginUserDto: LoginUserDto) {
    const existUser = await UserModel.findOne({ email: loginUserDto.email });
    if (!existUser) throw CustomError.badRequest("Email not exist");

    const isMatching = bcryptAdapter.compare(
      loginUserDto.password,
      existUser.password
    );

    if (!isMatching) throw CustomError.badRequest("Password is not valid");
    const { password, ...userEntity } = UserEntity.fromObject(existUser);

    const token = await JwtAdapter.generateToken({
      id: existUser.id,
      email: existUser.email,
    });
    if (!token) throw CustomError.internalServer("Error while creating JWT");

    return {
      user: { ...userEntity },
      token: token,
    };
  }
}
