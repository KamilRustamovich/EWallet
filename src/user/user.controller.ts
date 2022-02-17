import { 
	Body, 
	Controller, 
	Delete, 
	Get, 
	HttpCode, 
	HttpStatus, 
	Param, 
	Post, 
	UsePipes, 
	ValidationPipe 
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { Wallet } from 'src/wallet/entitites/wallet.entity';


@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}


	@UsePipes(new ValidationPipe())
	@Post('create')
	@HttpCode(HttpStatus.CREATED)
	async createUser(@Body() userDto: CreateUserDto): Promise<User> {
		return await this.userService.createUser(userDto);
	}


	@Get(':id')
	async findUserById(@Param() id: number): Promise<User> {
		return await this.userService.findUserById(id);
	}

	@Get('wallet/:account_number')
	async findUserByAccountNumber(@Param() account_number: number): Promise<Wallet> {
		return await this.userService.findUserByAccountNumber(account_number);
	}


	@Delete(':id')
	async deleteUserById(@Param() id: number): Promise<void> {
		return await this.userService.deleteUserById(id);
	}
}
