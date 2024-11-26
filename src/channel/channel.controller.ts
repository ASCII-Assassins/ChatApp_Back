
import { ChannelService } from './channel.service';
import { CreateChannelDto } from '../dtos/create-channel.dto';
import { Controller, Post, Body, Get, Res } from '@nestjs/common';
import { response } from 'express';

@Controller('channl')
export class ChannelController {
    constructor(private readonly channelService: ChannelService){}

    @Post()
    create(@Body() CreateChannelDto: CreateChannelDto){
        return this.channelService.createChannelService(CreateChannelDto);
    }

    @Get('/all')
    async getAllChannel(@Res() response){
        try{

            let channel = await this.channelService.getallChannel();
            return response.json({message : "The available channel are", channel})
        }catch(e){
            console.log(e);
            return response.json("smth bad happend");
        }
    }
}

