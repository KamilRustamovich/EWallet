import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

export enum Currency {
	RUB = 'RUB',
	USD = 'USD',
	EUR = 'EUR'
}


@Entity()
export class Wallet {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({unique: true})
	account_number: number;

	@Column()
	currency: Currency;

	@Column()
	balance: number;

	@ManyToOne(() => User, user => user.wallets)
	user: User;

	constructor(acc_number: number, curr: Currency, bal: number) {
		this.account_number = acc_number;
		this.currency = curr;
		this.balance = bal;
	}
}