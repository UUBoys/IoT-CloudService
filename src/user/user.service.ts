import { BadRequestException, Injectable } from '@nestjs/common';
import { prisma } from '../util/db/client';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  async create(user: Prisma.UserCreateInput) {
    try {
      let savedUser = await prisma.user.create({
        data: user
      })

      return savedUser;
    } catch (error) {
      // if user already exists
      if (error.code === 'P2002') {
        throw new BadRequestException('User already exists', { cause: error })
      }
    } 
  }

  async findOneByEmail(email: string) {
    return prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async findOneById(uuid: string) { 
    return prisma.user.findUnique({
      where: {
        id: uuid,
      },
    });
  }
}
