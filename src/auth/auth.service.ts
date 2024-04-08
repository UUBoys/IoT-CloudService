import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { comparePassword } from '../util/bcrypt/hash';
import { AuthResult } from '../graphql.schema';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}
  async login(credentials: LoginDto): Promise<AuthResult> {
    const user = await this.userService.findOneByEmail(credentials.email);

    // User is not found
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Password is not correct
    if (await comparePassword(credentials.password, user.password)) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      uuid: user.id,
      email: user.email,
      sub: user.id,
    };

    return {
      token: this.jwtService.sign(payload),
    };
  }

  async register(credentials: RegisterDto): Promise<AuthResult> {
    const user = await this.userService.create(credentials);

    const payload = {
      uuid: user.id,
      email: user.email,
      sub: user.id,
    };

    return {
      token: this.jwtService.sign(payload),
    };
  }
}
