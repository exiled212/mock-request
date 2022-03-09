import { Test, TestingModule } from '@nestjs/testing';
import { createConnection, getConnection } from 'typeorm';
import { MockController } from './mock.controller';
import { DomainService } from './domain.service';
import { Request as RequestModel } from '../../entities/Request';
import { Response as ResponseModel } from '../../entities/Response';
import { MockConfig as MockConfigModel } from '../../entities/MockConfig';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';

describe('DomainController.ts', () => {
	let app: INestApplication;
	let domainService: DomainService;

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
			controllers: [MockController],
			providers: [DomainService],
		}).compile();

		app = TestModule.createNestApplication();
		domainService = await TestModule.get(DomainService);
		await app.init();
	});

	afterEach(() => {
		const conn = getConnection();
		return conn.close();
	});

	it('request_singlerGet_NotFound', async () => {
		// Given
		const url = 'some/url/test';

		// When
		const requestFunc = jest.spyOn(domainService, 'request');
		requestFunc.mockReturnValue(
			new Promise((res) => {
				res(null);
			}),
		);

		// start
		await request(app.getHttpServer())
			.get(`/mock/${url}`)
			.expect(HttpStatus.NOT_FOUND)
			.expect({});

		expect(requestFunc).toBeCalledTimes(1);
	});

	it('request_singlerGet_ok', async () => {
		// Given
		const url = 'some/url/test';
		const responseModel = new ResponseModel();
		responseModel.id = 1;
		responseModel.status = 200;
		responseModel.content = '{}';
		responseModel.headers = {
			'Content-Type': 'application/json',
		};
		responseModel.request = new RequestModel();
		responseModel.responseTime = 1;
		responseModel.limitTimeout = 90000;

		// When
		const requestFunc = jest.spyOn(domainService, 'request');
		requestFunc.mockReturnValue(
			new Promise((res) => {
				res(responseModel);
			}),
		);

		// start
		await request(app.getHttpServer())
			.get(`/mock/${url}`)
			.expect(HttpStatus.OK)
			.expect('"{}"');

		expect(requestFunc).toBeCalledTimes(1);
	});

	it('request_singlerGet_badRequest', async () => {
		// Given
		const url = 'some/url/test';
		const responseModel = new ResponseModel();
		responseModel.id = 1;
		responseModel.status = 400;
		responseModel.content = '{}';
		responseModel.headers = {
			'Content-Type': 'application/json',
		};
		responseModel.request = new RequestModel();
		responseModel.responseTime = 1;
		responseModel.limitTimeout = 90000;

		// When
		const requestFunc = jest.spyOn(domainService, 'request');
		requestFunc.mockReturnValue(
			new Promise((res) => {
				res(responseModel);
			}),
		);

		// start
		await request(app.getHttpServer())
			.get(`/mock/${url}`)
			.expect(HttpStatus.BAD_REQUEST)
			.expect('"{}"');

		expect(requestFunc).toBeCalledTimes(1);
	});

	it('request_singlerGet_internalError', async () => {
		// Given
		const url = 'some/url/test';

		// When
		const requestFunc = jest.spyOn(domainService, 'request');
		requestFunc.mockReturnValue(
			new Promise((res) => {
				res([] as any);
			}),
		);

		// start
		await request(app.getHttpServer())
			.get(`/mock/${url}`)
			.expect(HttpStatus.INTERNAL_SERVER_ERROR)
			.expect('{"statusCode":500,"message":"Internal server error"}');
	});
});
