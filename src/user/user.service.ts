import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getListOfUsers(userId: string) {
    const users = await this.prisma.user.findMany({
      where: {
        id: {
          not: userId,
        },
      },
    });

    return users;
  }
}
