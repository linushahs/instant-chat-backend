import { Module } from '@nestjs/common';
import { VideoAudioGateway } from './video-audio.gateway';

@Module({
  providers: [VideoAudioGateway]
})
export class VideoAudioModule {}
