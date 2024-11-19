import { GroupsService } from './groups.service';
import { CreateGroupDto } from '../dtos/create-group.dto';
import { Controller, Post, Body, Get, Res } from '@nestjs/common';
import { response } from 'express';



@Controller('group')
export class GroupsController {
    constructor(private readonly groupsService: GroupsService) {}

    @Post()
    create(@Body() createGroupDto: CreateGroupDto) {
        return this.groupsService.createGroupService(createGroupDto);
    }

    @Get('/all')
    async getAllGroups(@Res() response){
        try{
            let groups = await this.groupsService.getALLGroups();
            return response.json({message: "The available groups are", groups})
        }catch(e){
            console.log(e);
            return response.json("smth bad happend");
        }
    }
    


}
