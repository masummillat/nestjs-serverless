import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private users: CreateUserDto[] = [];
  async create(createUserDto: CreateUserDto): Promise<any> {
    const { username, email, password, fullName } = createUserDto;

    // Check if user already exists
    const existingUser = this.users.find(
      (user) => user.username === username || user.email === email,
    );
    if (existingUser) {
      throw new ConflictException('Username or email already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      userId: this.users.length + 1,
      username,
      email,
      password: hashedPassword,
      fullName,
      roles: ['user'],
    };

    this.users.push(newUser);

    // Return user without password
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...result } = newUser;
    return result;
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(username: string): Promise<CreateUserDto> {
    return this.users.find((user) => user.username === username);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
