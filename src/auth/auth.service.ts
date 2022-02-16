import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { compare } from 'bcryptjs';
import { USER_NOT_FOUND_ERROR, WRONG_PASSWORD_ERROR } from './auth.constants';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';


@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(User)
		private readonly userRepo: Repository<User>,
		private readonly jwtService: JwtService,
	) {}


	async findUserByEmail(email: string): Promise<User> {
		try {
			const user = await this.userRepo.findOne(email);

			if (!user) {
				throw new NotFoundException(USER_NOT_FOUND_ERROR);
			}

			return user;
		} catch (error) {
			console.log(error, 'findUserByEmail method error');

			throw error;
		}
	}


	async validateUser(email: string, password: string): Promise<Pick<User, 'email'>> {
		try {
			const user = await this.findUserByEmail(email);
			const isCorrectPassword = await compare(password, user.passwordHash);

			if (!isCorrectPassword) {
				throw new UnauthorizedException(WRONG_PASSWORD_ERROR);
			}

			return { email: user.email };
		} catch (error) {
			console.log(error, 'validateUser method error');

			throw error;
		}
	}


	async login(email: string): Promise<{access_token: string}> {
		try {
			const payload = { email };

			return {
				access_token: await this.jwtService.signAsync(payload)
			};
		} catch (error) {
			console.log(error, 'login method error');

			throw error;
		}
	}
}
