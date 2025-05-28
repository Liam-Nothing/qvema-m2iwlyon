import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Interest } from '../interests/entities/interest.entity';
import { UserRole } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('UsersService', () => {
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
    findOneOrFail: jest.fn(),
  };

  const mockUser = {
    id: '1',
    email: 'test@example.com',
    password: 'hashedPassword',
    firstname: 'John',
    lastname: 'Doe',
    role: UserRole.ENTREPRENEUR,
    interests: [],
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<UsersService>(UsersService);
  });

  describe('create', () => {
    it('should create a new user successfully', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
        firstname: 'John',
        lastname: 'Doe',
        role: UserRole.ENTREPRENEUR,
      };

      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.create.mockReturnValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword' as never);

      const result = await service.create(createUserDto);
      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: createUserDto.email },
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.password, 10);
    });

    it('should throw ConflictException if email already exists', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
        firstname: 'John',
        lastname: 'Doe',
        role: UserRole.ENTREPRENEUR,
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);

      await expect(service.create(createUserDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [mockUser];
      mockUserRepository.find.mockResolvedValue(users);

      const result = await service.findAll();
      expect(result).toEqual(users);
      expect(mockUserRepository.find).toHaveBeenCalledWith({
        relations: ['interests'],
      });
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findOne('1');
      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['interests'],
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findByEmail('test@example.com');
      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
        relations: ['interests'],
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.findByEmail('test@example.com')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a user successfully', async () => {
      const updateUserDto: UpdateUserDto = {
        firstname: 'Jane',
      };
      const updatedUser = { ...mockUser, ...updateUserDto };

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockUserRepository.save.mockResolvedValue(updatedUser);

      const result = await service.update('1', updateUserDto);
      expect(result).toEqual(updatedUser);
      expect(mockUserRepository.save).toHaveBeenCalled();
    });

    it('should hash password if included in update', async () => {
      const updateUserDto: UpdateUserDto = {
        password: 'newPassword',
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('newHashedPassword' as never);
      mockUserRepository.save.mockResolvedValue({ ...mockUser, password: 'newHashedPassword' });

      await service.update('1', updateUserDto);
      expect(bcrypt.hash).toHaveBeenCalledWith('newPassword', 10);
    });
  });

  describe('remove', () => {
    it('should remove a user successfully', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockUserRepository.remove.mockResolvedValue(mockUser);

      await service.remove('1');
      expect(mockUserRepository.remove).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('addInterest', () => {
    it('should add an interest to a user', async () => {
      const userWithoutInterest = { ...mockUser, interests: [] };
      const interest = { id: '1', name: 'Tech' };
      const userWithInterest = { ...mockUser, interests: [interest] };

      mockUserRepository.findOne.mockResolvedValue(userWithoutInterest);
      mockInterestRepository.findOneOrFail.mockResolvedValue(interest);
      mockUserRepository.save.mockResolvedValue(userWithInterest);

      const result = await service.addInterest('1', '1');
      expect(result).toEqual(userWithInterest);
      expect(mockUserRepository.save).toHaveBeenCalled();
      expect(mockInterestRepository.findOneOrFail).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should return user without saving when interest already exists', async () => {
      const interest = { id: '1', name: 'Tech' };
      const userWithInterest = { ...mockUser, interests: [interest] };

      mockUserRepository.findOne.mockResolvedValue(userWithInterest);
      mockInterestRepository.findOneOrFail.mockResolvedValue(interest);

      const result = await service.addInterest('1', '1');
      expect(result).toEqual(userWithInterest);
      expect(mockUserRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('removeInterest', () => {
    it('should remove an interest from a user', async () => {
      const interest = { id: '1', name: 'Tech' };
      const userWithInterest = { ...mockUser, interests: [interest] };
      const userWithoutInterest = { ...mockUser, interests: [] };

      mockUserRepository.findOne.mockResolvedValue(userWithInterest);
      mockUserRepository.save.mockResolvedValue(userWithoutInterest);

      const result = await service.removeInterest('1', '1');
      expect(result).toEqual(userWithoutInterest);
      expect(mockUserRepository.save).toHaveBeenCalled();
    });
  });
});
