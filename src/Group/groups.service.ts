import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateGroupDto } from '../dtos/create-group.dto';
import { Group, GroupDocument } from '../schemas/group.schema';
import { User, UserDocument } from '../schemas/user.schema';
import { HttpStatus, HttpException } from '@nestjs/common';
import { error } from 'console';


@Injectable()
export class GroupsService {
    constructor(
        @InjectModel(Group.name) private groupModel: Model<GroupDocument>,
        @InjectModel(User.name) private userModel: Model<UserDocument>
    ) { }
    async createGroupService(createGroupDto: CreateGroupDto): Promise<Group> {
        if (createGroupDto.owner) {
            try {
                const user = await this.userModel.findById(createGroupDto.owner).exec();
                const createdGroup = new this.groupModel(createGroupDto);
                return createdGroup.save();
            } catch (e) {
                throw new HttpException({
                    status: HttpStatus.FORBIDDEN,
                    error: 'The user is not found please try to login in again',
                }, HttpStatus.FORBIDDEN, {
                    cause: e
                });
            }
        }
    }

    async getALLGroups(): Promise<Group[]> {
        try {
            const allgroups = await this.groupModel.find();
            if (!allgroups) {
                throw new NotFoundException('No groups available');
            }
            return allgroups;
        } catch (e) {
            throw new HttpException({
                status: HttpStatus.NOT_FOUND,
                error: 'No groups available',
            }, HttpStatus.FORBIDDEN, {
                cause: e
            });
        }

    }
}

