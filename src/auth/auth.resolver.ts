import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/auth.dto';
import { AuthResult } from '../graphql.schema';

@Resolver('Auth')
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query('ping')
  async ping() {
    return 'pong';
  }

  @Mutation('register')
  async register(
    @Args('registerInput') args: RegisterDto,
  ): Promise<AuthResult> {
    return this.authService.register(args);
  }

  @Mutation('login')
  async login(@Args('loginInput') args: RegisterDto): Promise<AuthResult> {
    return this.authService.login(args);
  }
}
