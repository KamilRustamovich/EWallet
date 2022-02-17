import { IsNumber } from "class-validator";

export class DepositDto {
	@IsNumber()
	account_number: number;

	@IsNumber()
	amount: number
}