import { Body, Controller, HttpCode, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';


@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}


	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('login')
	async login(@Body() { login, password }: AuthDto): Promise<{access_token: string}> {
		const { email } = await this.authService.validateUser(login, password);
		
		return this.authService.login(email);
	}
}
