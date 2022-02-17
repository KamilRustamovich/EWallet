import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Wallet } from '../../wallet/entitites/wallet.entity';


@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	email: string;

	@Column()
	passwordHash: string;

	@OneToMany(() => Wallet, wallet => wallet.users)
	wallets: Wallet[];
}