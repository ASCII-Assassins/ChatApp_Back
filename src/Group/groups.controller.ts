import { GroupsService } from './groups.service';
import { CreateGroupDto } from '../dtos/create-group.dto';
import { UpdateGroupDto } from '../dtos/update-group-dto';

import { Controller, Post, Body, Get, Res, Put, Param, Delete, HttpStatus, Req, NotFoundException } from '@nestjs/common';
import { response } from 'express';



@Controller('group')
export class GroupsController {
    constructor(private readonly groupsService: GroupsService) { }

    @Post()
    create(@Body() createGroupDto: CreateGroupDto) {
        return this.groupsService.createGroupService(createGroupDto);
    }


    @Get('/all')
    async getAllGroups(@Res() response) {
        try {
            let groups = await this.groupsService.getALLGroups();
            return response.json({ message: "The available groups are", groups })
        } catch (e) {
            console.log(e);
            return response.json("smth bad happend");
        }
    }



    @Put('/:id')
    async updateGroup(@Res() response, @Param('id') id: string,
        @Body() UpdateGroupDto: UpdateGroupDto) {
        try {
            const updatedGroup = await this.groupsService.updateGroup(id, UpdateGroupDto);
            return response.json({
                message: 'group has been successfully updated',
                updatedGroup,
            });
        } catch (err) {
            return response.status(err.status).json(err.response);
        }
    }


    @Get('/:id')
    async getGroup(    @Res() response: Response,
    @Param('id') id: string,
    @Req() request: Request, ) {
        // try {
            const userId = request.headers['x-user-id'] as string;
            if (!userId) {
              throw new NotFoundException('User ID is not found');
            }
            const existingGroup = await this.groupsService.getGroup(id, userId);
            return existingGroup;
        // } catch (e) {
        //     return response.status(e.status).json(e.response);
        // }
    }

    @Delete('/:id')
    async deleteGroup(@Res() response, @Param('id') id: string) {
        try {
            const deletedGroup = await this.groupsService.deleteGroup(id);
            return response.json({
                message: 'Group deleted successfully',
                deletedGroup,
            });
        } catch (e) {
            return response.status(e.status).json(e.response);
        }
    }

    @Post(':userId/:groupId/join')
    async joinGroup(@Param('groupId') groupId: string, @Param('userId') userId: string) {
        return this.groupsService.sendInvation(groupId, userId);
    }

    @Get('invitations/:groupId')
    async getAllInvitations(@Res() response, @Param('groupId') GroupId: string) {
        try {
            const invitations = await this.groupsService.getAllInvitations(GroupId);
            return response.json({
                invitations
            })
        }catch(e){
            return response.status(e.status).json(e.response);
        }

    }

    @Get('mygroups')
    async getUserGroups(@Req() request: Request){
        try {
            const userGroups= await this.groupsService.getUserGroups(request);
            return response.status(200).json({
              message: 'Groups fetched successfully',
              userGroups,
            });
          } catch (err) {
            return response.status(err.status || 500).json({
              message: err.message || 'Internal server error',
              response: err.response || 'No additional information',
            });
          }
        }
    }




