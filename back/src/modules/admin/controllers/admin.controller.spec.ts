import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { createConnection, getConnection } from 'typeorm';
import { Request as RequestModel } from '../../../entities/Request';
import { Response as ResponseModel } from '../../../entities/Response';
import { MockConfig as MockConfigModel } from '../../../entities/MockConfig';
import AdminController from './admin.controller';
import RequestService from '../services/request.service';
import ResponseService from '../services/response.service';
import * as request from 'supertest';
import { BuildResponseBody } from '../types/BuildResponseBody.type';
import { rest } from 'msw';
import { setupServer, SetupServerApi } from 'msw/node';
import { ResponseData } from '../types/ResponseData.type';
import { MockConfigData } from '../types/MockConfigData.type';

describe('AdminController.ts', () => {
	let app: INestApplication;
	let requestService: RequestService;
	const REQUEST_PENDING_PATH = '/admin/request/pending';
	const REQUEST_PATH = '/admin/request';
	const CONFIG_PATH = '/admin/request/config';
	const RESPONSE_PATH = '/admin/response';

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
			controllers: [AdminController],
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

	it('getPendingsRequest_getSinglerRequest_success', async () => {
		// Prepare
		const model: RequestModel = new RequestModel();
		model.id_md5 = `md5_1`;
		model.url = `/some/test`;
		model.method = 'GET';
		model.queryParams = {};
		model.headers = {};
		const requestModel: RequestModel = await getConnection()
			.getRepository(RequestModel)
			.save(model);

		// start
		await request(app.getHttpServer())
			.get(REQUEST_PENDING_PATH)
			.expect(HttpStatus.OK)
			.expect([{ ...requestModel }]);
	});

	it('getPendingsRequest_RequestWithResponse_empty', async () => {
		// Prepare
		const requestModel: RequestModel = new RequestModel();
		requestModel.id_md5 = `md5_1`;
		requestModel.url = `/some/test`;
		requestModel.method = 'GET';
		requestModel.queryParams = {};
		requestModel.headers = {};
		const requestResponse: RequestModel = await getConnection()
			.getRepository(RequestModel)
			.save(requestModel);

		const responseModel: ResponseModel = new ResponseModel();
		responseModel.request = requestResponse;
		responseModel.status = 200;
		await getConnection().getRepository(ResponseModel).save(responseModel);

		// start
		await request(app.getHttpServer())
			.get(REQUEST_PENDING_PATH)
			.expect(HttpStatus.NO_CONTENT)
			.expect({});
	});

	it('getRequest_withData_ok', async () => {
		// Prepare
		const requestModel: RequestModel = new RequestModel();
		requestModel.id_md5 = `md5_1`;
		requestModel.url = `/some/test`;
		requestModel.method = 'GET';
		requestModel.queryParams = {};
		requestModel.headers = {};
		const requestResponse: RequestModel = await getConnection()
			.getRepository(RequestModel)
			.save(requestModel);

		const responseModel: ResponseModel = new ResponseModel();
		responseModel.request = requestResponse;
		responseModel.status = 200;
		await getConnection().getRepository(ResponseModel).save(responseModel);

		// start
		await request(app.getHttpServer())
			.get(REQUEST_PATH)
			.expect(HttpStatus.OK);
	});

	it('getRequest_withoutData_empty', async () => {
		// start
		await request(app.getHttpServer())
			.get(REQUEST_PATH)
			.expect(HttpStatus.NO_CONTENT)
			.expect({});
	});

	it('getRequest_withException_error', async () => {
		const getRequestMock = jest.spyOn(requestService, 'getRequest');
		getRequestMock.mockReturnValue(
			new Promise((res) => {
				res(null);
			}),
		);
		// start
		await request(app.getHttpServer())
			.get(REQUEST_PATH)
			.expect(HttpStatus.INTERNAL_SERVER_ERROR)
			.expect({});
	});

	it('buildResponse_responseOk_created', async () => {
		// Given
		const requestModel: RequestModel = new RequestModel();
		requestModel.id_md5 = `md5_1`;
		requestModel.url = `/some/test`;
		requestModel.method = 'GET';
		requestModel.queryParams = {};
		requestModel.headers = {};
		const body: BuildResponseBody = {
			domain: 'http://localhost/mockTest',
		};

		// Prepare
		await getConnection().getRepository(RequestModel).save(requestModel);

		// start
		await request(app.getHttpServer())
			.post(`${REQUEST_PATH}/1?limitTimeout=10`)
			.send(body)
			.expect(HttpStatus.CREATED);
	});

	it('buildResponse_requestIdNotFound_NotFound', async () => {
		// Given
		const body: BuildResponseBody = {
			domain: 'http://localhost/mockTest',
		};

		// start
		await request(app.getHttpServer())
			.post(`${REQUEST_PATH}/1`)
			.send(body)
			.expect(HttpStatus.NOT_FOUND)
			.expect({ message: "Request id '1' not found" });
	});

	it('insertResponse_requestIdNotFound_NotFound', async () => {
		// Given
		const body: ResponseData = {
			content: {},
			headers: {},
			status: 200,
		};

		// start
		await request(app.getHttpServer())
			.put(`${REQUEST_PATH}/1`)
			.send(body)
			.expect(HttpStatus.NOT_FOUND)
			.expect({ message: "Request id '1' not found" });
	});

	it('insertResponse_createResponseFromRequest_created', async () => {
		// Given
		const requestModel: RequestModel = new RequestModel();
		requestModel.id_md5 = `md5_1`;
		requestModel.url = `some/test`;
		requestModel.method = 'GET';
		requestModel.queryParams = {};
		requestModel.headers = {};
		const body: ResponseData = {
			content: {},
			headers: {},
			status: 200,
		};

		// Prepare
		await getConnection().getRepository(RequestModel).save(requestModel);

		// start
		await request(app.getHttpServer())
			.put(`${REQUEST_PATH}/1`)
			.send(body)
			.expect(HttpStatus.CREATED)
			.expect({
				request: {
					id: 1,
					id_md5: 'md5_1',
					url: 'some/test',
					method: 'GET',
					headers: {},
					queryParams: {},
					body: null,
				},
				status: 200,
				headers: {},
				content: {},
				responseTime: 1,
				limitTimeout: 90000,
				id: 1,
			});
	});

	it('deleteResponse_deleted_Ok', async () => {
		// Given
		const requestModel: RequestModel = new RequestModel();
		requestModel.id_md5 = `md5_1`;
		requestModel.url = `some/test`;
		requestModel.method = 'GET';
		requestModel.queryParams = {};
		requestModel.headers = {};

		// Prepare
		await getConnection().getRepository(RequestModel).save(requestModel);

		// start
		await request(app.getHttpServer())
			.delete(`${RESPONSE_PATH}/1`)
			.expect(HttpStatus.OK)
			.expect({
				body: null,
				headers: {},
				id: 1,
				id_md5: 'md5_1',
				method: 'GET',
				queryParams: {},
				url: 'some/test',
			});
	});

	it('deleteResponse_requestIdNotFound_NotFound', async () => {
		// start
		await request(app.getHttpServer())
			.delete(`${RESPONSE_PATH}/1`)
			.expect(HttpStatus.NOT_FOUND)
			.expect(`{"message":"Request id '1' not found"}`);
	});

	it('deleteRequest_deleted_Ok', async () => {
		// Given
		const requestModel: RequestModel = new RequestModel();
		requestModel.id_md5 = `md5_1`;
		requestModel.url = `some/test`;
		requestModel.method = 'GET';
		requestModel.queryParams = {};
		requestModel.headers = {};

		// Prepare
		await getConnection().getRepository(RequestModel).save(requestModel);

		// start
		await request(app.getHttpServer())
			.delete(`${REQUEST_PATH}`)
			.send([1])
			.expect(HttpStatus.OK);
	});

	it('deleteRequest_requestIdNotFound_NotFound', async () => {
		// start
		await request(app.getHttpServer())
			.delete(`${REQUEST_PATH}`)
			.send([1, 2, 3, 4, 5])
			.expect(HttpStatus.NOT_FOUND)
			.expect(`{"message":"Request ids '1,2,3,4,5' not found"}`);
	});

	it('request_setConfig_success', async () => {
		// Given
		const configData: MockConfigData = {
			url: '/test/url/1',
			method: 'POST',
			request_elements: ['headers', 'queryParams', 'body'],
		};

		// start
		await request(app.getHttpServer())
			.put(CONFIG_PATH)
			.send(configData)
			.expect(HttpStatus.CREATED);
	});

	it('request_deleteConfig_success', async () => {
		// Given
		const configData: MockConfigData = {
			url: '/test/url/1',
			method: 'POST',
			request_elements: ['headers', 'queryParams', 'body'],
		};

		// start
		await request(app.getHttpServer())
			.put(CONFIG_PATH)
			.send(configData)
			.expect(HttpStatus.CREATED);

		await request(app.getHttpServer())
			.delete(`${CONFIG_PATH}/1`)
			.send(configData)
			.expect(HttpStatus.OK);
	});

	it('request_deleteConfig_success', async () => {
		// Given
		const configData: MockConfigData = {
			url: '/test/url/1',
			method: 'POST',
			request_elements: ['headers', 'queryParams', 'body'],
		};

		// start
		await request(app.getHttpServer())
			.delete(`${CONFIG_PATH}/1`)
			.send(configData)
			.expect(HttpStatus.NOT_FOUND);
	});

	it('deletePendings_deleted_Ok', async () => {
		// Given
		const requestModel: RequestModel = new RequestModel();
		requestModel.id_md5 = `md5_1`;
		requestModel.url = `some/test`;
		requestModel.method = 'GET';
		requestModel.queryParams = {};
		requestModel.headers = {};

		// Prepare
		await getConnection().getRepository(RequestModel).save(requestModel);

		// start
		await request(app.getHttpServer())
			.delete(`${REQUEST_PENDING_PATH}`)
			.expect(HttpStatus.OK)
			.expect('');
	});
});