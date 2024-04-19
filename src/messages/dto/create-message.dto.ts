import { IsNotEmpty, IsString } from "class-validator";

export class CreateMessageDto {
    @IsString()
    @IsNotEmpty()
    content;

    @IsString()
    @IsNotEmpty()
    senderId;

    @IsString()
    @IsNotEmpty()
    receiverId;

}
