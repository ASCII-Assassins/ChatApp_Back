import { Test, TestingModule } from '@nestjs/testing';
import { GroupsService } from './groups.service';
import { getModelToken } from '@nestjs/mongoose';
import { Group } from '../schemas/group.schema';
import { User } from '../schemas/user.schema';
import { NotFoundException, ForbiddenException, HttpException, HttpStatus } from '@nestjs/common';
import { Model } from 'mongoose';

describe('GroupsService', () => {
  let service: GroupsService;
  let groupModel: Model<Group>;
  let userModel: Model<User>;

  const mockGroup = {
    _id: 'group-id',
    name: 'Group 1',
    description: 'Test group',
    owner: '673bceff14caf9eb1dc74e2c',
    members: ['673bceff14caf9eb1dc74e2c'],
    invitations: [],
    isPrivate: false,
    save: jest.fn(),
  };

  const mockUser = {
    _id: '673bceff14caf9eb1dc74e2c',
    name: 'John Doe',
    email: 'johndoe@example.com',
    password: 'password',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroupsService,
        {
          provide: getModelToken(Group.name),
          useValue: {
            find: jest.fn().mockResolvedValue([mockGroup]),
            findById: jest.fn().mockResolvedValue(mockGroup),
            findByIdAndUpdate: jest.fn().mockResolvedValue(mockGroup),
            save: jest.fn().mockResolvedValue(mockGroup),
          },
        },
        {
          provide: getModelToken(User.name),
          useValue: {
            findById: jest.fn().mockResolvedValue(mockUser),
          },
        },
      ],
    }).compile();

    service = module.get<GroupsService>(GroupsService);
    groupModel = module.get<Model<Group>>(getModelToken(Group.name));
    userModel = module.get<Model<User>>(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createGroupService', () => {
    it('should create a new group', async () => {
      const createGroupDto = { name: 'Teeeeeeeeeeest', description: 'Another group', owner: '673bceff14caf9eb1dc74e2c' };
      const result = await service.createGroupService(createGroupDto);
      expect(groupModel.save).toHaveBeenCalled();
      expect(result).toEqual(mockGroup);
    });

    it('should throw an error if the user is not found', async () => {
      userModel.findById = jest.fn().mockResolvedValueOnce(null);
      const createGroupDto = { name: 'Group 3', description: 'Another group', owner: '673bceff14caf9eb1dc74e2c' };
      await expect(service.createGroupService(createGroupDto))
        .rejects
        .toThrow(new HttpException('The user is not found please try to login again', HttpStatus.FORBIDDEN));
    });

    it('should throw an error if the group name is already used', async () => {
      groupModel.save = jest.fn().mockRejectedValueOnce({ name: 'MongoServerError', code: 11000 });
      const createGroupDto = { name: 'Group 1', description: 'Another group', owner: '673bceff14caf9eb1dc74e2c' };
      await expect(service.createGroupService(createGroupDto))
        .rejects
        .toThrow(new HttpException('This name is already used choose another name of group', HttpStatus.CONFLICT));
    });
  });

  describe('getALLGroups', () => {
    it('should return all groups', async () => {
      const groups = await service.getALLGroups();
      expect(groups).toEqual([mockGroup]);
    });

    it('should throw an error if no groups are found', async () => {
      groupModel.find = jest.fn().mockResolvedValueOnce([]);
      await expect(service.getALLGroups())
        .rejects
        .toThrow(new HttpException('No groups available', HttpStatus.FORBIDDEN));
    });
  });

  describe('deleteGroup', () => {
    it('should delete a group', async () => {
      groupModel.findById = jest.fn().mockResolvedValueOnce(mockGroup);
      const result = await service.deleteGroup('group-id');
      expect(result.message).toBe('The group was deleted successfully');
    });

    it('should throw an error if group not found', async () => {
      groupModel.findById = jest.fn().mockResolvedValueOnce(null);
      await expect(service.deleteGroup('non-existing-group-id'))
        .rejects
        .toThrow(new NotFoundException('group not found Please try again'));
    });
  });

  describe('updateGroup', () => {
    it('should update a group', async () => {
      const updateGroupDto = { name: 'Updated Group' };
      groupModel.findByIdAndUpdate = jest.fn().mockResolvedValueOnce({ ...mockGroup, ...updateGroupDto });
      const result = await service.updateGroup('group-id', updateGroupDto);
      expect(result.message).toBe('The group was updated successfully');
      expect(result.data.name).toBe('Updated Group');
    });

    it('should throw an error if group not found', async () => {
      groupModel.findByIdAndUpdate = jest.fn().mockResolvedValueOnce(null);
      await expect(service.updateGroup('non-existing-group-id', {}))
        .rejects
        .toThrow(new NotFoundException('the group is not found'));
    });
  });

  describe('getGroup', () => {
    it('should return group details if the user is a member', async () => {
      const result = await service.getGroup('group-id', 'user-id');
      expect(result).toHaveProperty('name', mockGroup.name);
      expect(result).toHaveProperty('members');
    });

    it('should return group search details if the user is not a member', async () => {
      const result = await service.getGroup('group-id', 'non-member-id');
      expect(result).toHaveProperty('name', mockGroup.name);
      expect(result).not.toHaveProperty('members');
    });

    it('should throw an error if the group is not found', async () => {
      groupModel.findById = jest.fn().mockResolvedValueOnce(null);
      await expect(service.getGroup('non-existing-group-id', 'user-id'))
        .rejects
        .toThrow(new NotFoundException('the group is not found'));
    });

    it('should throw an error if userId is not provided', async () => {
      await expect(service.getGroup('group-id', null))
        .rejects
        .toThrow(new ForbiddenException('can you login again'));
    });
  });

  describe('sendInvation', () => {
    it('should add a user to group if the group is not private', async () => {
      const result = await service.sendInvation('group-id', 'user-id');
      expect(result.members).toContain('user-id');
    });

    it('should add an invitation if the group is private', async () => {
      mockGroup.isPrivate = true;
      const result = await service.sendInvation('group-id', 'user-id');
      expect(result.invitations).toHaveLength(1);
    });

    it('should throw an error if the user is already a member', async () => {
      groupModel.findById = jest.fn().mockResolvedValueOnce({ ...mockGroup, members: ['user-id'] });
      await expect(service.sendInvation('group-id', 'user-id'))
        .rejects
        .toThrow(new HttpException('you are already a member of the group', HttpStatus.BAD_REQUEST));
    });

  describe('getUserGroups', () => {
    it('should return the user\'s groups', async () => {
      const result = await service.getUserGroups({ headers: { 'x-user-id': 'user-id' } });
      expect(result).toContain(mockGroup);
    });


})
  })
})
