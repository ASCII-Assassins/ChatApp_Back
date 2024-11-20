import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Channel, ChannelDocument } from 'src/schemas/channel.schema';
import { User, UserDocument } from '../schemas/user.schema';
import { HttpStatus, HttpException } from '@nestjs/common';
import { error } from 'console';
import { CreateChannelDto } from '../dtos/create-channel.dto';

import { promises } from 'dns';


@Injectable()
export class ChannelService {

    constructor(
        @InjectModel(Channel.name) private channelModel: Model<ChannelDocument>,
        @InjectModel(User.name) private userModel: Model<UserDocument>
    ) { }

    async createChannelService(createChannelDto: CreateChannelDto): Promise<Channel>{
        if(createChannelDto.owner){
            try {
                const user = await this.userModel.findById(createChannelDto.owner).exec();
                const createCannel = new this.channelModel(createChannelDto);
                return createCannel.save();
            }catch (e) {
                throw new HttpException({
                    status: HttpStatus.FORBIDDEN,
                    error: 'The user is not found please try to login in again',
                }, HttpStatus.FORBIDDEN, {
                    cause: e
                });
            }
            }
        }


        async getallChannel(): Promise<Channel[]>{
            try {
                const allchannel = await this.channelModel.find();
                if(!allchannel){
                    throw new NotFoundException('No channel available');
                }
                return allchannel;
            }catch (e){
                throw new HttpException({
                    status: HttpStatus.NOT_FOUND,
                    error: 'No groups available',
                }, HttpStatus.FORBIDDEN, {
                    cause: e
                });
            }
        }
    }
