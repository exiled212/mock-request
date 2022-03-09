import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { createConnection, getConnection } from 'typeorm';
import { Request as RequestModel } from '../../../entities/Request';
import { Response as ResponseModel } from '../../../entities/Response';
import { MockConfig as MockConfigModel } from '../../../entities/MockConfig';
import DataController from './data.controller';
import RequestService from '../services/request.service';
import ResponseService from '../services/response.service';
import * as request from 'supertest';
import { rest } from 'msw';
import { setupServer, SetupServerApi } from 'msw/node';

describe('DataController.ts', () => {
	let app: INestApplication;
	let requestService: RequestService;
	const REQUEST_PATH = '/data/request';

	const server: SetupServerApi = setupServer(
		rest.get('http://localhost/mockTest/some/test', (_, res, ctx) => {
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
			entities: [RequestModel, ResponseModel, MockConfigModel],
			synchronize: true,
			logging: false,
		});

		const TestModule: TestingModule = await Test.createTestingModule({
			controllers: [DataController],
			providers: [RequestService, ResponseService],
		}).compile();

		app = TestModule.createNestApplication();
		requestService = await TestModule.get(RequestService);
		server.resetHandlers();
		await app.init();
	});

	afterEach(() => {
		const conn = getConnection();
		return conn.close();
	});

	it('getRequest_emptyData_paginate', async () => {
		// Start
		await request(app.getHttpServer())
			.post(REQUEST_PATH)
			.send([])
			.expect(HttpStatus.OK)
			.expect({ total: 0, data: [] });
	});

	it('getRequest_all_paginate', async () => {
		// Given
		const saves = [];

		// When
		for (let i = 1; i <= 100; i++) {
			const url = getRandomString();
			const model: RequestModel = new RequestModel();
			model.id_md5 = `md5_${i}`;
			model.url = `/test/${url}`;
			model.method = getRandomMethod();
			model.queryParams = {};
			model.headers = {};
			const save = getConnection()
				.getRepository(RequestModel)
				.save(model);
			saves.push(save);
		}
		await Promise.all(saves);

		// Start
		const result = await request(app.getHttpServer())
			.post(REQUEST_PATH)
			.send([])
			.expect(HttpStatus.OK);

		expect(result.body.total).toStrictEqual(100);
		expect(result.body.data.length).toStrictEqual(10);
	});

	it('getRequest_withLimitAndOffset_paginate', async () => {
		// Given
		const saves = [];

		// When
		for (let i = 1; i <= 100; i++) {
			const url = getRandomString();
			const model: RequestModel = new RequestModel();
			model.id_md5 = `md5_${i}`;
			model.url = `/test/${url}`;
			model.method = getRandomMethod();
			model.queryParams = {};
			model.headers = {};
			const save = getConnection()
				.getRepository(RequestModel)
				.save(model);
			saves.push(save);
		}
		await Promise.all(saves);

		// Start
		const result = await request(app.getHttpServer())
			.post(`${REQUEST_PATH}?limit=50&offset=20`)
			.send([])
			.expect(HttpStatus.OK);

		expect(result.body.total).toStrictEqual(100);
		expect(result.body.data.length).toStrictEqual(50);
	});

	it('getRequest_withFilters_paginate', async () => {
		// Given
		const saves = [];

		// When
		for (let i = 1; i <= 100; i++) {
			const url = getRandomString();
			const model: RequestModel = new RequestModel();
			model.id_md5 = `md5_${i}`;
			model.url = `/test/${url}`;
			model.method = getRandomMethod();
			model.queryParams = {};
			model.headers = {};
			const save = getConnection()
				.getRepository(RequestModel)
				.save(model);
			saves.push(save);
		}
		await Promise.all(saves);

		// Start
		const result = await request(app.getHttpServer())
			.post(REQUEST_PATH)
			.send(['req.id>20', 'req.id<60'])
			.expect(HttpStatus.OK);

		expect(result.body.total).toStrictEqual(39);
		expect(result.body.data.length).toStrictEqual(10);
	});

	function getRandomString() {
		return (Math.random() + 1).toString(36).substring(7);
	}

	function getRandomMethod() {
		const methods: string[] = ['GET', 'POST', 'PUT', 'DELETE'];
		return methods[getRandomNumber(0, methods.length - 1)];
	}

	function getRandomNumber(min: number, max: number) {
		return Math.round(Math.random() * (max - min) + min);
	}
});
