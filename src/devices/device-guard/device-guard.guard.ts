import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { DevicesService } from '../devices.service';
import { IncomingHttpHeaders } from 'http';
import { SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const NO_TOKEN = 'noToken';
export const NoToken = () => SetMetadata(NO_TOKEN, true);

@Injectable()
export class DeviceGuard implements CanActivate {
  constructor(private readonly deviceService: DevicesService, private readonly reflector: Reflector) {}
  
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const isNoTokenRoute = this.reflector.getAllAndOverride<boolean>(NO_TOKEN, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isNoTokenRoute) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException("No token provided");
    }

    try {
      const plant = await this.deviceService.getByToken(token);
      
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      await this.deviceService.heartbeat(plant.id)
      request["plant"] = plant;
    } catch {
      // Log that device tried to access but is missing from database?
      throw new UnauthorizedException("Plant is not present in the database");
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const headers = request.headers as unknown as IncomingHttpHeaders;
    const [type, token] = headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
