import { NestFactory } from '@nestjs/core';
import { Request } from './entities/Request';
import { Response } from './entities/Response';
import { createConnection, getConnection } from 'typeorm';
import { AppModule } from './app.module';
import { config } from 'dotenv';

async function bootstrap() {
	config();

	const env = process.env.NODE_ENV;

	if (env) {
		await createConnection({
			type: 'postgres',
			host: process.env.DB_HOST,
			port: process.env.DB_PORT as unknown as number,
			database: process.env.DB_NAME,
			username: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			synchronize: true,
			entities: [Request, Response],
		});
	}
	getConnection();

	const app = await NestFactory.create(AppModule);
	await app.listen(3000);
}
bootstrap();
