import { NestFactory } from '@nestjs/core';
import { Request } from './entities/Request';
import { Response } from './entities/Response';
import { MockConfig } from './entities/MockConfig';
import { createConnection } from 'typeorm';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import * as bodyParser from 'body-parser';

async function bootstrap() {
	config();

	await createConnection({
		type: 'postgres',
		host: process.env.DB_HOST,
		port: process.env.DB_PORT as unknown as number,
		database: process.env.DB_NAME,
		username: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		synchronize: true,
		entities: [Request, Response, MockConfig],
	});

	const configOpenApi = new DocumentBuilder()
		.setTitle('Mock-Request Documentación')
		.setDescription(
			'Docuemtación sobre los distintos endpoints de la herramienta',
		)
		.setVersion('1.0')
		.addTag('mocks')
		.build();
	const app = await NestFactory.create(AppModule);
	app.use(bodyParser.json({ limit: '5000mb' }));
	app.use(bodyParser.urlencoded({ limit: '5000mb', extended: true }));
	app.enableCors();
	const document = SwaggerModule.createDocument(app, configOpenApi);
	SwaggerModule.setup('api', app, document);

	await app.listen(process.env.PORT as string | 3000);
}
bootstrap();
