import { Body, Controller, Get, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { Wallet } from './entities/wallet.entity';


@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}


	@UsePipes(new ValidationPipe())
	@Post('create')
	async createUser(@Body() userDto: CreateUserDto): Promise<User> {
		return this.userService.createUser(userDto);
	}

	@Get(':id')
	async findUserById(@Param() id: number) {
		return this.userService.findUserById(id);
	}
}
