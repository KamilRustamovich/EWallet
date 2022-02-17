import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { genSalt, hash } from 'bcryptjs';
import { ALREADY_REGISTERED_ERROR, USER_NOT_FOUND_ERROR } from 'src/auth/auth.constants';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { Currency, Wallet } from '../wallet/entitites/wallet.entity';
import { ACCOUNT_NUMBER_NOT_FOUND_ERROR } from './user.constants';


@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private readonly userRepo: Repository<User>,

		@InjectRepository(Wallet)
		private readonly walletRepo: Repository<Wallet>,
	) {}


	async createUser(userDto: CreateUserDto): Promise<User> {
		try {
			await this.findRegisteredUser(userDto.email);

			const newUser = new User();

			newUser.email = userDto.email;
			newUser.passwordHash = await this.passwordHash(userDto.password);
			newUser.wallets = await this.createWallets();

			await this.userRepo.save(newUser);

			if (!newUser) {
				console.log('createUser method error');
			}

			return newUser;
		} catch (error) {
			console.log(error, 'createUser method error');

			throw error;
		}
	}

	
	async passwordHash(password: string): Promise<string> {
		const salt = await genSalt(10);
		const pwdHash = await hash(password, salt);

		return pwdHash;
	}


	// Не мапинг, потому что возвращает : Promise<Promise<Wallet>[]>
	async createWallets(): Promise<Wallet[]> {
		try {
			const currency = [Currency.RUB, Currency.USD, Currency.EUR];
			let wallets = [];

			for (let i = 0; i < 3; i++) {
				const newWallet = new Wallet(this.getRandomInt(), currency[i], 0);

				await this.walletRepo.save(newWallet);

				wallets.push(newWallet);
			}

			if (wallets.length != 3) {
				throw new BadRequestException('createWallets method error');
			}

			return wallets;
		} catch (error) {
			console.log(error, 'reateWallets method error');

			throw error;
		}
	}


	getRandomInt(min = 100000000, max = 999999999) : number {
		min = Math.ceil(min);
		max = Math.floor(max);

		return Math.floor(Math.random() * (max - min + 1)) + min; 
	}


	async findRegisteredUser(email: string): Promise<void> {
		try {
			const registeredUser = await this.userRepo.findOne({ email });

			if (registeredUser) {
				throw new BadRequestException(ALREADY_REGISTERED_ERROR);
			}
		} catch (error) {
			console.log(error, 'findRegisteredUser method error');

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
			console.log(error, 'findUserById method error');

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
			console.log(error, 'deleteUserById method error');

			throw error;
		}
	}


	async findUserByAccountNumber(account_number: number): Promise<Wallet> {
		try {
			const user = await this.walletRepo.findOne(account_number, {
				relations: ['users']
			})

			if (!user) {
				throw new BadRequestException(ACCOUNT_NUMBER_NOT_FOUND_ERROR);
			}

			return user;
		} catch (error) {
			console.log(error, 'findUserByAccountNumber method error');

			throw error;
		}
	}
}
