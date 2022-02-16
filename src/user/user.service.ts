import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { genSalt, hash } from 'bcryptjs';
import { ALREADY_REGISTERED_ERROR, USER_NOT_FOUND_ERROR } from 'src/auth/auth.constants';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { Currency, Wallet } from './entities/wallet.entity';


@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private readonly userRepo: Repository<User>,

		@InjectRepository(Wallet)
		private readonly walletRepo: Repository<Wallet>,
	) {}

	getRandomInt(min = 100000000, max = 999999999) : number {
		min = Math.ceil(min);
		max = Math.floor(max);

		return Math.floor(Math.random() * (max - min + 1)) + min; 
	}

	async createUser(userDto: CreateUserDto): Promise<User> {
		try {
			await this.findRegisteredUser(userDto.email);

			const rubWallet = new Wallet(this.getRandomInt(), Currency.RUB, 10000);
			await this.walletRepo.save(rubWallet);

			const usdWallet = new Wallet(this.getRandomInt(), Currency.USD, 10000);
			await this.walletRepo.save(usdWallet);
			
			const eurWallet = new Wallet(this.getRandomInt(), Currency.EUR, 10000);
			await this.walletRepo.save(eurWallet);

			const salt = await genSalt(10);
			const passHash = await hash(userDto.password, salt);

			const newUser = new User();
			newUser.email = userDto.email;
			newUser.passwordHash = passHash;
			newUser.wallets = [rubWallet, usdWallet, eurWallet];

			await this.userRepo.save(newUser);

			return newUser;
		} catch (error) {
			console.log(error, '\ncreateUser method error\n');

			throw error;
		}
	}


	async findRegisteredUser(email: string): Promise<void> {
		try {
			const registeredUser = await this.userRepo.findOne({ email });

			if (registeredUser) {
				throw new BadRequestException(ALREADY_REGISTERED_ERROR);
			}
		} catch (error) {
			console.log(error, '\nfindRegisteredUser method error\n');

			throw error;
		}
	}


	async findUserById(id: number): Promise<User>  {
		try {
			const user = await this.userRepo.findOneOrFail(id, {
				relations: ['wallets']
			});
			
			if(!user) {
				throw new BadRequestException(USER_NOT_FOUND_ERROR);
			}

			return user;
		} catch (error) {
			console.log(error, '\nfindUserById method error\n');

			throw error;
		}
	}


	async deleteUserById(id: number): Promise<void> {
		try {
			const user = await this.findUserById(id);

			if(!user) {
				throw new BadRequestException(USER_NOT_FOUND_ERROR);
			}

			await this.userRepo.delete(user);
		} catch (error) {
			console.log(error, '\ndeleteUserById method error\n');

			throw error;
		}
	}
}
