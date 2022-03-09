import { createConnection, getConnection } from 'typeorm';
import ResponseService from '../services/response.service';
import { Request as RequestModel } from '../../../entities/Request';
import { Response as ResponseModel } from '../../../entities/Response';
import { MockConfig as RequestConfigModel } from '../../../entities/MockConfig';
import { Test, TestingModule } from '@nestjs/testing';
import { rest } from 'msw';
import { setupServer, SetupServerApi } from 'msw/node';
import { ResponseData } from '../types/ResponseData.type';

describe('ResponseService.ts', () => {
	let responseService: ResponseService;
	const server: SetupServerApi = setupServer(
		rest.get('http://localhost/testhost/test/success', (_, res, ctx) => {
			return res(ctx.status(200), ctx.json({ name: 'test' }));
		}),
		rest.post('http://localhost/testhost/test/success', (_, res, ctx) => {
			return res(ctx.status(200), ctx.json({ name: 'test' }));
		}),
		rest.get(
			'http://localhost/testhost/test/bad-request',
			(_, res, ctx) => {
				return res(ctx.status(400), ctx.json({ name: 'test' }));
			},
		),
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

		const app: TestingModule = await Test.createTestingModule({
			providers: [ResponseService],
		}).compile();

		responseService = app.get<ResponseService>(ResponseService);
	});

	afterEach(() => {
		server.resetHandlers();
		const conn = getConnection();
		return conn.close();
	});

	it('buildResponse_singlerRequestGet_success', async () => {
		// Given
		const domain = 'http://localhost/testhost';
		const requestId = 1;
		const req: RequestModel = new RequestModel();
		req.id_md5 = '1';
		req.url = 'test/success';
		req.method = 'GET';
		req.headers = {};
		req.queryParams = {};
		req.body = '"{}"';

		// Prepare
		await getConnection().getRepository(RequestModel).save(req);

		// Run
		const response: ResponseModel = await responseService.buildResponse(
			requestId,
			domain,
		);

		// Validate
		expect(response).toBeTruthy();
		expect(response.status).toBe(200);
		expect(response.content).toStrictEqual({ name: 'test' });
		expect(response.headers).toStrictEqual({
			'content-type': 'application/json',
			'x-powered-by': 'msw',
		});
	});

	it('buildResponse_moreRequestGet_success', async () => {
		// Given
		const domain = 'http://localhost/testhost';
		const requestId = 1;
		const req: RequestModel = new RequestModel();
		req.id_md5 = '1';
		req.url = 'test/success';
		req.method = 'GET';
		req.headers = {};
		req.queryParams = {};
		req.body = '"{}"';

		// Prepare
		await getConnection().getRepository(RequestModel).save(req);

		// Run
		await responseService.buildResponse(1, domain);
		const response: ResponseModel = await responseService.buildResponse(
			requestId,
			domain,
		);

		// Validate
		expect(response).toBeTruthy();
		expect(response.status).toBe(200);
		expect(response.content).toStrictEqual({ name: 'test' });
		expect(response.headers).toStrictEqual({
			'content-type': 'application/json',
			'x-powered-by': 'msw',
		});
	});
	it('buildResponse_moreRequestGet_success', async () => {
		// Given
		const domain = 'http://localhost/testhost';
		const requestId = 1;
		const req: RequestModel = new RequestModel();
		req.id_md5 = '1';
		req.url = 'test/success';
		req.method = 'POST';
		req.headers = {};
		req.queryParams = {};
		req.body = '"{}"';

		// Prepare
		await getConnection().getRepository(RequestModel).save(req);

		// Run
		await responseService.buildResponse(requestId, domain);
		const response: ResponseModel = await responseService.buildResponse(
			requestId,
			domain,
		);

		// Validate
		expect(response).toBeTruthy();
		expect(response.status).toBe(200);
		expect(response.content).toStrictEqual({ name: 'test' });
		expect(response.headers).toStrictEqual({
			'content-type': 'application/json',
			'x-powered-by': 'msw',
		});
	});

	it('buildResponse_singlerRequest_badRequest', async () => {
		// Given
		const domain = 'http://localhost/testhost';
		const requestId = 1;
		const req: RequestModel = new RequestModel();
		req.id_md5 = '1';
		req.url = 'test/bad-request';
		req.method = 'GET';
		req.headers = {};
		req.queryParams = {};
		req.body = '"{}"';

		// Prepare
		await getConnection().getRepository(RequestModel).save(req);

		// Run
		const response: ResponseModel = await responseService.buildResponse(
			requestId,
			domain,
		);

		// Validate
		expect(response).toBeTruthy();
		expect(response.status).toBe(400);
		expect(response.content).toStrictEqual({ name: 'test' });
		expect(response.headers).toStrictEqual({
			'content-type': 'application/json',
			'x-powered-by': 'msw',
		});
	});

	it('buildResponse_RequestNotFound_empty', async () => {
		// Given
		const domain = 'http://localhost/testhost';
		const requestId = 1;

		// Run
		const response: ResponseModel = await responseService.buildResponse(
			requestId,
			domain,
		);

		// Validate
		expect(response).toBeFalsy();
	});

	it('createResponse_createResponse_success', async () => {
		// Given
		const requestId = 1;
		const req: RequestModel = new RequestModel();
		req.id_md5 = '1';
		req.url = 'test/bad-request';
		req.method = 'GET';
		req.headers = {};
		req.queryParams = {};
		req.body = '"{}"';
		const responseData: ResponseData = {
			content: {
				name: 'test',
			},
			headers: {
				'content-type': 'application/json',
			},
			status: 200,
		};

		// Prepare
		await getConnection().getRepository(RequestModel).save(req);

		// Run
		const response: ResponseModel = await responseService.createResponse(
			requestId,
			responseData,
		);

		// Validate
		expect(response).toBeTruthy();
		expect(response.status).toBe(responseData.status);
		expect(response.content).toStrictEqual(responseData.content);
		expect(response.headers).toStrictEqual(responseData.headers);
	});

	it('createResponse_recreateResponse_success', async () => {
		// Given
		const requestId = 1;
		const req: RequestModel = new RequestModel();
		req.id_md5 = '1';
		req.url = 'test/bad-request';
		req.method = 'GET';
		req.headers = {};
		req.queryParams = {};
		req.body = '"{}"';
		const responseData: ResponseData = {
			content: {
				name: 'test',
			},
			headers: {
				'content-type': 'application/json',
			},
			status: 200,
		};

		// Prepare
		await getConnection().getRepository(RequestModel).save(req);

		// Run
		await responseService.createResponse(requestId, responseData);
		const response: ResponseModel = await responseService.createResponse(
			requestId,
			responseData,
		);

		// Validate
		expect(response).toBeTruthy();
		expect(response.status).toBe(responseData.status);
		expect(response.content).toStrictEqual(responseData.content);
		expect(response.headers).toStrictEqual(responseData.headers);
		expect(response.limitTimeout).toStrictEqual(90000);
		expect(response.responseTime).toStrictEqual(1);
	});

	it('createResponse_requestNotFound_empty', async () => {
		// Given
		const requestId = 1;
		const responseData: ResponseData = {
			content: {
				name: 'test',
			},
			headers: {
				'content-type': 'application/json',
			},
			status: 200,
		};

		// Run
		const response: ResponseModel = await responseService.createResponse(
			requestId,
			responseData,
		);

		// Validate
		expect(response).toBeFalsy();
	});

	it('deleteResponse_deleted_success', async () => {
		// Given
		const requestId = 1;
		const req: RequestModel = new RequestModel();
		req.id_md5 = '1';
		req.url = 'test/bad-request';
		req.method = 'GET';
		req.headers = {};
		req.queryParams = {};
		req.body = '"{}"';

		const res: ResponseModel = new ResponseModel();
		res.status = 200;
		res.headers = {};
		res.content = '"{}"';

		// Prepare
		const request: RequestModel = await getConnection()
			.getRepository(RequestModel)
			.save(req);
		res.request = request;
		await getConnection().getRepository(ResponseModel).save(res);

		// Run
		const result: RequestModel = await responseService.deleteResponse(
			requestId,
		);
		const responseList: ResponseModel[] = await getConnection()
			.getRepository(ResponseModel)
			.find();

		// Validate
		expect(result).toBeTruthy();
		expect(result).toStrictEqual(request);
		expect(responseList.length).toBe(0);
	});

	it('deleteResponse_requestNotFound_empty', async () => {
		// Given
		const requestId = 1;

		// Run
		const response: RequestModel = await responseService.deleteResponse(
			requestId,
		);

		// Validate
		expect(response).toBeFalsy();
	});
});
