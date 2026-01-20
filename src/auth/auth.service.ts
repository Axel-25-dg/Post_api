import { Injectable, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) { }

  async login(loginDto: LoginDto): Promise<string | null> {
    try {
      const user: User | null = await this.usersService.findByEmail(loginDto.email);
      if (!user) return null;
      const isValid = await bcrypt.compare(loginDto.password, user.password);
      if (!isValid) return null;
      const payload = { id: user.id, username: user.username, email: user.email, role: user.role };
      return this.jwtService.sign(payload);
    } catch (err) {
      console.error('Unexpected login error:', err);
      return null;
    }
  }

  async register(createUserDto: CreateUserDto): Promise<{ access_token: string } | null> {
    try {
      // Check if username already exists
      const existingByUsername = await this.usersService.findByUsername(createUserDto.username);
      if (existingByUsername) {
        throw new ConflictException('Username already exists');
      }
      
      // Check if email already exists
      const existingByEmail = await this.usersService.findByEmail(createUserDto.email);
      if (existingByEmail) {
        throw new ConflictException('Email already exists');
      }
      
      // Create the new user
      const user = await this.usersService.create(createUserDto);
      if (!user) return null;
      
      // Generate JWT token
      const payload = { 
        id: user.id, 
        username: user.username, 
        email: user.email, 
        role: user.role 
      };
      
      return {
        access_token: this.jwtService.sign(payload)
      };
    } catch (err) {
      if (err instanceof ConflictException) {
        throw err;
      }
      console.error('Registration error:', err);
      return null;
    }
  }
}