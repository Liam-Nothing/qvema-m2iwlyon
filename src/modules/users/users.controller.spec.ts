import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Interest } from '../interests/entities/interest.entity';
import { UserRole } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUserRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  const mockInterestRepository = {
    findOne: jest.fn(),
  };

  const mockUser = {
    id: '1',
    email: 'test@example.com',
    firstname: 'John',
    lastname: 'Doe',
    role: UserRole.ENTREPRENEUR,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(Interest),
          useValue: mockInterestRepository,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
        firstname: 'John',
        lastname: 'Doe',
        role: UserRole.ENTREPRENEUR,
      };

      jest.spyOn(service, 'create').mockResolvedValue(mockUser as User);

      const result = await controller.create(createUserDto);
      expect(result).toEqual(mockUser);
      expect(service.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [mockUser];
      jest.spyOn(service, 'findAll').mockResolvedValue(users as User[]);

      const result = await controller.findAll();
      expect(result).toEqual(users);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockUser as User);

      const result = await controller.findOne('1');
      expect(result).toEqual(mockUser);
      expect(service.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = {
        firstname: 'Jane',
      };
      const updatedUser = { ...mockUser, ...updateUserDto };

      jest.spyOn(service, 'update').mockResolvedValue(updatedUser as User);

      const result = await controller.update('1', updateUserDto);
      expect(result).toEqual(updatedUser);
      expect(service.update).toHaveBeenCalledWith('1', updateUserDto);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      await controller.remove('1');
      expect(service.remove).toHaveBeenCalledWith('1');
    });
  });

  describe('addInterest', () => {
    it('should add an interest to a user', async () => {
      const userWithInterest = { ...mockUser, interests: [{ id: '1', name: 'Tech' }] };
      jest.spyOn(service, 'addInterest').mockResolvedValue(userWithInterest as User);

      const result = await controller.addInterest('1', '1');
      expect(result).toEqual(userWithInterest);
      expect(service.addInterest).toHaveBeenCalledWith('1', '1');
    });
  });

  describe('removeInterest', () => {
    it('should remove an interest from a user', async () => {
      jest.spyOn(service, 'removeInterest').mockResolvedValue(mockUser as User);

      const result = await controller.removeInterest('1', '1');
      expect(result).toEqual(mockUser);
      expect(service.removeInterest).toHaveBeenCalledWith('1', '1');
    });
  });
});
