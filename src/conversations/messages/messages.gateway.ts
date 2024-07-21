import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessagesService } from './messages.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@WebSocketGateway({ cors: true })
export class MessagesGateway {
  @WebSocketServer() server;

  constructor(private readonly messagesService: MessagesService, private eventEmitter: EventEmitter2) {
    this.eventEmitter.on('message.created', (message) => {
      this.server.emit('message.created', message);
    });

    this.eventEmitter.on('message.updated', (message) => {
      this.server.emit('message.updated', message);
    });

    this.eventEmitter.on('message.removed', (message) => {
      this.server.emit('message.removed', message);
    });
  }

  @SubscribeMessage('getAllMessages')
  getAllMessages(@MessageBody() user: { senderId: string, receiverId: string }) {
    return this.messagesService.getAllMessages(user);
  }

  @SubscribeMessage('createMessage')
  create(@MessageBody() createMessageDto: CreateMessageDto) {
    return this.messagesService.create(createMessageDto);
  }

  @SubscribeMessage('updateMessage')
  update(@MessageBody() data: { id: string, content: string }) {
    return this.messagesService.update(data.id, data.content);
  }

  @SubscribeMessage('removeMessage')
  remove(@MessageBody() id: string) {
    return this.messagesService.remove(id);
  }
}
