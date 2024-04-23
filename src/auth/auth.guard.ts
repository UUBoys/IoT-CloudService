import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { IncomingHttpHeaders } from "http";
import {GqlExecutionContext} from "@nestjs/graphql";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const gqlContext = GqlExecutionContext.create(context);
    const { req } = gqlContext.getContext();
    const token = this.extractTokenFromHeader(req);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token);

      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      req["user"] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const headers = request?.headers as unknown as IncomingHttpHeaders;
    const [type, token] = headers?.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
