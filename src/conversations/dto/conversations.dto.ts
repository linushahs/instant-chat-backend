import { IsString } from "class-validator";

export class CreateConversationDto{
    @IsString()
    name

    @IsString()
    description

    @IsString()
    profilePic

}