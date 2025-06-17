import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from "@nestjs/websockets";

@WebSocketGateway({ cors: true })
export class ConversationsGateway {
  constructor() {}

  @SubscribeMessage("createConversation")
  createConversation(@MessageBody() data) {
    console.log(data);
    return data;
  }
}
