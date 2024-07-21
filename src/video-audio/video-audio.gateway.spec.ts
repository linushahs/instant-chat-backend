import { Test, TestingModule } from '@nestjs/testing';
import { VideoAudioGateway } from './video-audio.gateway';

describe('VideoAudioGateway', () => {
  let gateway: VideoAudioGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VideoAudioGateway],
    }).compile();

    gateway = module.get<VideoAudioGateway>(VideoAudioGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
