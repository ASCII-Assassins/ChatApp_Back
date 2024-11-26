import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateGroupDto } from '../dtos/create-group.dto';
import { UpdateGroupDto } from '../dtos/update-group-dto';
import { SearchGroupDto } from 'src/dtos/search-group.dto';
import { GroupDetailsDto } from 'src/dtos/details-group.dto';
import { Group, GroupDocument } from '../schemas/group.schema';
import { User, UserDocument } from '../schemas/user.schema';
import { HttpStatus, HttpException, ForbiddenException } from '@nestjs/common';

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
                return await createdGroup.save();
            } catch (e) {
                if (e.name === "MongoServerError" && e.code === 11000) {
                    throw new HttpException({
                        status: HttpStatus.CONFLICT,
                        message: "This name is already used choose another name of group",
                    }, HttpStatus.CONFLICT)
                } else {
                    throw new HttpException({
                        status: HttpStatus.FORBIDDEN,
                        error: 'The user is not found please try to login in again',
                    }, HttpStatus.FORBIDDEN, {
                        cause: e
                    });
                }

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

    async deleteGroup(id: string) {
        //check the owner before deleting
        const deleteGroup = await this.groupModel.findById(id);
        console.log(deleteGroup.owner)
        if (!deleteGroup) {
            throw new NotFoundException('group not found Please try again');
        }
        // if(deleteGroup.owner.toString() = request.headers['x-user-id']){
        //     deleteGroup.deleteOne();
        // }
        return {
            stauts: HttpStatus.ACCEPTED,
            message: "The group was deleted successfully"
        }
    }

    async updateGroup(id: string, updateGroupDto: UpdateGroupDto): Promise<{ status: HttpStatus; message: string; data: Group }> {
        //check the owner before updating
        const group = await this.groupModel.findById(id);
        if (!group) {
            throw new NotFoundException('Group not found');
        }
        // const userId = request.headers['x-user-id'];

        // if (group.owner.toString() !== userId) {
        //     throw new ForbiddenException('You are not authorized to update this group');
        // }

        const updateGroup = await this.groupModel.findByIdAndUpdate(id, updateGroupDto, { new: true });
        if (!updateGroup) {
            throw new NotFoundException('the group is not found');
        }
        return {
            status: HttpStatus.ACCEPTED,
            message: "The group was updated successfully",
            data: updateGroup
        }
    }

    async getGroup(id: string, userId): Promise<SearchGroupDto | GroupDetailsDto> {
        //make a DTOS of it search==> name description owner dail gae groups
        //if you are memeber o  itla3 lik kolshy mn fost l group + "members" 
        if (!userId) {
            throw new ForbiddenException('can you login again');
        }

        const existingGroup = await this.groupModel.findById(id).exec();
        if (!existingGroup) {
            throw new NotFoundException(`the group is not found`);
        }
        // const userObjectId = new Types.ObjectId(userId);
        const isMember = existingGroup.members.includes(userId);
        if (isMember) {
            const groupDetails: GroupDetailsDto = {
                name: existingGroup.name,
                description: existingGroup.description,
                owner: existingGroup.owner,
                isPrivate: existingGroup.isPrivate || false,
                members: existingGroup.members,
            };
            return groupDetails;
        } else {
            const groupSearch: SearchGroupDto = {
                name: existingGroup.name,
                description: existingGroup.description,
                owner: existingGroup.owner,
                isPrivate: existingGroup.isPrivate || false,

            };
            return groupSearch;
        }
    }


    async sendInvation(GroupId: string, userId: string) {
        const group = await this.groupModel.findById(GroupId);
        if (!group) {
            throw new NotFoundException('Group not found');
        }
        const useruniqueId = new Types.ObjectId(userId);

        if (group.members.includes(useruniqueId)) {
            throw new HttpException('you are already a member of the group', HttpStatus.BAD_REQUEST);
        }

        if (!group.isPrivate) {
            group.members.push(new Types.ObjectId(userId));
            await group.save();
            return group;
        } else {
            group.invitations.push({ userId: new Types.ObjectId(userId), status: 'pending' });
            await group.save();
            return group;
        }
    }

    async getAllInvitations(GroupId: string) {
        let groupInfo = await this.groupModel.findById(GroupId);
        if (!groupInfo) {
            return {
                status: HttpStatus.NOT_FOUND,
                message: "the group is not found"
            }
        }
        //userId bringed from request
        let uuserId = "673d1da054f2cb0494998e50";
        let userId = new Types.ObjectId(uuserId)
        if (groupInfo.owner == userId) {
            console.log('heeeeeeeeeeeeeeeeeeeey')
            let allInvitation = await this.groupModel.find({ owner: GroupId });
            console.log("invitaaaations", allInvitation);
            if (!allInvitation) {
                return "Invitation not found"
            }
            return allInvitation
        }

    }

    async getUserGroups(request: Request):Promise <Group[]>{
        // const userId = request.headers['x-user-id'] as string;
        // if (!userId) {
        //   throw new ForbiddenException('User ID is missing in headers');
        // }
        const userId = "673d1da054f2cb0494998e50"
        const groups = await this.groupModel.find({ members: userId }).exec();
        console.log(groups)
        if (!groups || groups.length === 0) {
            throw new NotFoundException(`User is not a member of any groups.`);
        }
        return groups;

    }
}

