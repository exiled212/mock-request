import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { setupServer, SetupServerApi } from 'msw/node';
import * as request from 'supertest';
import { createConnection, getConnection } from 'typeorm';
import { AppModule } from '../src/app.module';
import { Request as RequestModel } from '../src/entities/Request';
import { Response as ResponseModel } from '../src/entities/Response';
import { MockConfig as RequestConfigModel } from '../src/entities/MockConfig';
import { rest } from 'msw';

describe('DomainController E2E', () => {
	let app: INestApplication;
	const domain = 'http://localhost/mockTest';
	const endpoint = 'some/test';

	const server: SetupServerApi = setupServer(
		rest.get(`${domain}/${endpoint}`, (_, res, ctx) => {
			return res(ctx.status(200), ctx.json({ name: 'test' }));
		}),
	);

	afterAll(() => server.close());
	beforeAll(() => server.listen());

	beforeEach(async () => {
		await createConnection({
			type: 'sqlite',
			database: ':memory:',
			dropSchema: true,
			entities: [RequestModel, ResponseModel, RequestConfigModel],
			synchronize: true,
			logging: false,
		});

		const TestModule: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();
		app = TestModule.createNestApplication();
		await app.init();
	});

	afterEach(() => {
		const conn = getConnection();
		server.resetHandlers();
		return conn.close();
	});
	it('Singler flow request - build Response', async () => {
		// Send Request
		await request(app.getHttpServer())
			.get(`/mock/${endpoint}`)
			.expect(HttpStatus.NOT_FOUND);

		// Get Request
		const pendings = await request(app.getHttpServer())
			.get(`/admin/request/pending`)
			.expect(HttpStatus.OK)
			.send();

		const requestList: RequestModel[] = pendings.body;

		// Create Response
		await request(app.getHttpServer())
			.post(`/admin/request/${requestList[0].id}`)
			.send({
				domain,
			})
			.expect(HttpStatus.CREATED);

		await request(app.getHttpServer())
			.get(`/mock/${endpoint}`)
			.expect(HttpStatus.OK)
			.expect({ name: 'test' });

		return;
	});

	it('Singler flow request - insert Response', async () => {
		// Send Request
		await request(app.getHttpServer())
			.get(`/mock/${endpoint}`)
			.expect(HttpStatus.NOT_FOUND);

		// Get Request
		const pendings = await request(app.getHttpServer())
			.get(`/admin/request/pending`)
			.expect(HttpStatus.OK)
			.send();

		const requestList: RequestModel[] = pendings.body;

		// Create Response
		await request(app.getHttpServer())
			.put(`/admin/request/${requestList[0].id}`)
			.send({
				content: { name: 'test 2' },
				headers: {},
				status: 201,
			})
			.expect(HttpStatus.CREATED);

		await request(app.getHttpServer())
			.get(`/mock/${endpoint}`)
			.expect(HttpStatus.CREATED)
			.expect({ name: 'test 2' });

		return;
	});

	it('delete flow', async () => {
		// Send Request
		await request(app.getHttpServer())
			.get(`/mock/${endpoint}`)
			.expect(HttpStatus.NOT_FOUND);

		// Get Request
		const pendings = await request(app.getHttpServer())
			.get(`/admin/request/pending`)
			.expect(HttpStatus.OK)
			.send();

		const requestList: RequestModel[] = pendings.body;

		// Create Response
		await request(app.getHttpServer())
			.put(`/admin/request/${requestList[0].id}`)
			.send({
				content: { name: 'test 2' },
				headers: {},
				status: 201,
			})
			.expect(HttpStatus.CREATED);

		await request(app.getHttpServer())
			.delete(`/admin/response/${requestList[0].id}`)
			.expect(HttpStatus.OK);

		await request(app.getHttpServer())
			.get(`/mock/${endpoint}`)
			.expect(HttpStatus.NOT_FOUND);

		await request(app.getHttpServer())
			.delete(`/admin/request/${requestList[0].id}`)
			.expect(HttpStatus.OK);

		await request(app.getHttpServer())
			.get(`/admin/request/pending`)
			.expect(HttpStatus.NO_CONTENT)
			.send();

		return;
	});
});
