import { Test, TestingModule } from '@nestjs/testing';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';
import { NotFoundException } from '@nestjs/common';

const mockGroupsService = {
  createGroupService: jest.fn().mockResolvedValue({}),
  getALLGroups: jest.fn().mockResolvedValue([]),
  updateGroup: jest.fn().mockResolvedValue({}),
  getGroup: jest.fn().mockResolvedValue({}),
  deleteGroup: jest.fn().mockResolvedValue({}),
  sendInvation: jest.fn().mockResolvedValue({}),
  getAllInvitations: jest.fn().mockResolvedValue([]),
  getUserGroups: jest.fn().mockResolvedValue([]),
};

describe('GroupsController', () => {
  let controller: GroupsController;
  let service: GroupsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupsController],
      providers: [
        {
          provide: GroupsService,
          useValue: mockGroupsService,
        },
      ],
    }).compile();

    controller = module.get<GroupsController>(GroupsController);
    service = module.get<GroupsService>(GroupsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call createGroupService and return a result', async () => {
      const createGroupDto = { name: 'Group 1', description: 'Test Group' }; // Sample DTO
      await controller.create(createGroupDto);
      expect(service.createGroupService).toHaveBeenCalledWith(createGroupDto);
    });
  });

  describe('getAllGroups', () => {
    it('should return a list of groups', async () => {
      const result = await controller.getAllGroups({ json: jest.fn() });
      expect(result.message).toBe('The available groups are');
      expect(result.groups).toBeInstanceOf(Array);
    });

    it('should handle errors', async () => {
      mockGroupsService.getALLGroups.mockRejectedValueOnce(new Error('Error'));
      const response = await controller.getAllGroups({ json: jest.fn() });
      expect(response.message).toBe('smth bad happend');
    });
  });

  describe('updateGroup', () => {
    it('should update a group successfully', async () => {
      const updateGroupDto = { name: 'Updated Group', description: 'Updated description' };
      const groupId = '123';
      const result = await controller.updateGroup({ json: jest.fn() }, groupId, updateGroupDto);
      expect(service.updateGroup).toHaveBeenCalledWith(groupId, updateGroupDto);
    });
  });

  describe('getGroup', () => {
    it('should return a group by id', async () => {
      const userId = 'user-123';
      const groupId = 'group-123';
      const req = { headers: { 'x-user-id': userId } };
      const group = await controller.getGroup({ json: jest.fn() }, groupId, req);
      expect(service.getGroup).toHaveBeenCalledWith(groupId, userId);
      expect(group).toBeDefined();
    });

    it('should throw NotFoundException if no userId is provided in request', async () => {
      const groupId = 'group-123';
      const req = { headers: {} };
      await expect(controller.getGroup({ json: jest.fn() }, groupId, req))
        .rejects
        .toThrow(NotFoundException);
    });
  });

  describe('deleteGroup', () => {
    it('should delete a group successfully', async () => {
      const groupId = 'group-123';
      await controller.deleteGroup({ json: jest.fn() }, groupId);
      expect(service.deleteGroup).toHaveBeenCalledWith(groupId);
    });
  });

  describe('joinGroup', () => {
    it('should call sendInvation with correct params', async () => {
      const groupId = 'group-123';
      const userId = 'user-123';
      await controller.joinGroup(groupId, userId);
      expect(service.sendInvation).toHaveBeenCalledWith(groupId, userId);
    });
  });

  describe('getAllInvitations', () => {
    it('should return invitations for a group', async () => {
      const groupId = 'group-123';
      const result = await controller.getAllInvitations({ json: jest.fn() }, groupId);
      expect(service.getAllInvitations).toHaveBeenCalledWith(groupId);
    });
  });

  describe('getUserGroups', () => {
    it('should return a list of user groups', async () => {
      const req = { headers: { 'x-user-id': 'user-123' } };
      const result = await controller.getUserGroups(req);
      expect(service.getUserGroups).toHaveBeenCalledWith(req);
      expect(result.message).toBe('Groups fetched successfully');
    });
  });
});
