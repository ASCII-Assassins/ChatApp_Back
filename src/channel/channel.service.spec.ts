import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ChannelService } from './channel.service';
import { NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { Channel } from '../schemas/channel.schema';

describe('ChannelService', () => {
  let service: ChannelService;
  let channelModel: Model<Channel>;

  const mockChannelModel = {
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChannelService,
        {
          provide: getModelToken('Channel'),
          useValue: mockChannelModel,
        },
      ],
    }).compile();

    service = module.get<ChannelService>(ChannelService);
    channelModel = module.get<Model<Channel>>(getModelToken('Channel'));
  });

  it('should return all channels if available', async () => {
    const channels = [
      { name: 'Channel1', description: 'Test Channel 1' },
      { name: 'Channel2', description: 'Test Channel 2' },
    ];
    mockChannelModel.find.mockResolvedValueOnce(channels);

    const result = await service.getallChannel();
    expect(result).toEqual(channels);
    expect(mockChannelModel.find).toHaveBeenCalled();
  });

  it('should throw NotFoundException when no channels are available', async () => {
    mockChannelModel.find.mockResolvedValueOnce(null);

    await expect(service.getallChannel()).rejects.toThrow(NotFoundException);
    expect(mockChannelModel.find).toHaveBeenCalled();
  });
});
