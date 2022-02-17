import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Wallet } from '../wallet/entitites/wallet.entity';


@Module({
	providers: [UserService],
	controllers: [UserController],
	imports: [TypeOrmModule.forFeature([User, Wallet])]
})
export class UserModule {}
