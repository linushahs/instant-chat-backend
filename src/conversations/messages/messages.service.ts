import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessagesService {
  constructor(private prismaService: PrismaService, private eventEmitter: EventEmitter2) {
  }

  async getAllMessages(user: { senderId: string, receiverId: string }) {
    const messages = await this.prismaService.message.findMany({
      where: {
        OR: [
          { senderId: user.senderId, receiverId: user.receiverId },
          { senderId: user.receiverId, receiverId: user.senderId }]
      }
    })

    return JSON.stringify(messages);
  }

  async create(createMessageDto: CreateMessageDto) {
    const message = await this.prismaService.message.create({
      data: {
        content: createMessageDto.content,
        senderId: createMessageDto.senderId,
        receiverId: createMessageDto.receiverId,
      }
    })

    this.eventEmitter.emit("message.created", message);
    return "Successfully added message to database: " + message.content;
  }

  async update(id: string, content: string) {
    const message = await this.prismaService.message.update({
      where: { id },
      data: {
        content
      }
    })

    this.eventEmitter.emit("message.updated", message);
    return `This action updates a #${message.content} message`;
  }

  async remove(id: string) {
    const message = await this.prismaService.message.delete({
      where: { id },
    })

    this.eventEmitter.emit("message.removed", message);
    return `This action removes a #${message.content} message`;
  }
}
