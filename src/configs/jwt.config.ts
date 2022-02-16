import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export const getJWTConfig = async (configServise: ConfigService): Promise<JwtModuleOptions> => {
	return {
		secret: configServise.get('JWT_SECRET')
	};
};