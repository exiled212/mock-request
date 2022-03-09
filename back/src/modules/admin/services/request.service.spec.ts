import { createConnection, getConnection } from 'typeorm';
import RequestService from '../services/request.service';
import { Request as RequestModel } from '../../../entities/Request';
import { Response as ResponseModel } from '../../../entities/Response';
import { MockConfig as MockConfigModel } from '../../../entities/MockConfig';
import { Test, TestingModule } from '@nestjs/testing';
import { MockConfigData } from '../types/MockConfigData.type';
import { RequestData } from '../../mock/types/RequestData.type';
import { DomainService } from '../../mock/domain.service';
import { ResponsePaginate } from '../types/ResponsePaginate.type';

describe('RequestService.ts', () => {
	let requestService: RequestService;
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

		const app: TestingModule = await Test.createTestingModule({
			providers: [RequestService, DomainService],
		}).compile();

		requestService = app.get<RequestService>(RequestService);
		domainService = app.get<DomainService>(DomainService);
	});

	afterEach(() => {
		const conn = getConnection();
		return conn.close();
	});

	it('getPendingRequest_randomData_getRequestWithoutResponse', async () => {
		// Given
		const countRequest = getRandomNumber(1, 10);
		const countResponse = getRandomNumber(1, countRequest);

		// When
		for (let i = 1; i <= countRequest; i++) {
			const url = getRandomString();
			const model: RequestModel = new RequestModel();
			model.id_md5 = `md5_${i}`;
			model.url = `/test/${url}`;
			model.method = getRandomMethod();
			model.queryParams = {};
			model.headers = {};
			await getConnection().getRepository(RequestModel).save(model);
		}

		for (let i = 1; i <= countResponse; i++) {
			const requestModel: RequestModel = await getConnection()
				.getRepository(RequestModel)
				.findOne({ where: { id: i } });

			const model: ResponseModel = new ResponseModel();
			model.request = requestModel;
			model.status = 200;
			await getConnection().getRepository(ResponseModel).save(model);
		}

		// Run
		const requestList: RequestModel[] =
			await requestService.getPendingRequest();

		// Validate
		expect(requestList.length).toBe(countRequest - countResponse);
	});

	it('mockConfig_setConfig_save', async () => {
		// Given
		const repo = getConnection().getRepository(MockConfigModel);
		const configData: MockConfigData = {
			url: '/test/url/1',
			method: 'POST',
			request_elements: ['headers', 'queryParams', 'body'],
		};

		// start
		await requestService.createMockConfig(configData);
		const responseAll: MockConfigModel[] = await repo.find();
		const count = await repo.count();

		// Validate
		expect(responseAll.length).toBe(1);
		expect(count).toBe(1);

		return;
	});

	it('mockConfig_setMultiSameConfig_saveOne', async () => {
		// Given
		const repo = getConnection().getRepository(MockConfigModel);
		const configData: MockConfigData = {
			url: '/test/url/1',
			method: 'POST',
			request_elements: ['headers', 'queryParams', 'body'],
		};

		// start
		await requestService.createMockConfig(configData);
		await requestService.createMockConfig(configData);
		const responseAll: MockConfigModel[] = await repo.find();
		const count = await repo.count();

		// Validate
		expect(responseAll.length).toBe(1);
		expect(count).toBe(1);

		return;
	});

	it('mockConfig_removeConfig_deleted', async () => {
		// Given
		const repo = getConnection().getRepository(MockConfigModel);
		const configData: MockConfigData = {
			url: '/test/url/1',
			method: 'POST',
			request_elements: ['headers', 'queryParams', 'body'],
		};

		// start
		const mockConfig: MockConfigModel =
			await requestService.createMockConfig(configData);
		const responseAll1: MockConfigModel[] = await repo.find();
		const count1 = await repo.count();

		// Validate
		expect(responseAll1.length).toBe(1);
		expect(count1).toBe(1);

		// start
		const deleted: boolean = await requestService.deleteMockConfig(
			mockConfig.id,
		);
		const responseAll2: MockConfigModel[] = await repo.find();
		const count2 = await repo.count();

		// Validate
		expect(deleted).toBe(true);
		expect(responseAll2.length).toBe(0);
		expect(count2).toBe(0);

		return;
	});

	it('mockConfig_removeConfig_NotDeleted', async () => {
		// Given
		const repo = getConnection().getRepository(MockConfigModel);

		// start
		const responseAll1: MockConfigModel[] = await repo.find();
		const count1 = await repo.count();

		// Validate
		expect(responseAll1.length).toBe(0);
		expect(count1).toBe(0);

		// start
		const deleted: boolean = await requestService.deleteMockConfig(1);
		const responseAll2: MockConfigModel[] = await repo.find();
		const count2 = await repo.count();

		// Validate
		expect(deleted).toBe(false);
		expect(responseAll2.length).toBe(0);
		expect(count2).toBe(0);

		return;
	});

	it('request_WithConfig_saveOne', async () => {
		// Given
		const repo = getConnection().getRepository(RequestModel);
		const requestData: RequestData = {
			url: '/test/url/1',
			method: 'POST',
			body: {},
			headers: {
				'3': 'c',
				'2': 'b',
				'1': 'a',
				'4': 'd',
			},
			queryParams: {},
		};
		const requestData1: RequestData = {
			url: '/test/url/1',
			method: 'POST',
			body: {},
			headers: {
				'3': 'c',
				'4': 'd',
			},
			queryParams: {},
		};
		const configData: MockConfigData = {
			url: '/test/url/1',
			method: 'POST',
			request_elements: [],
		};

		// start
		await requestService.createMockConfig(configData);
		await domainService.request(requestData);
		await domainService.request(requestData1);
		const responseAll: RequestModel[] = await repo.find();
		const count = await repo.count();

		// Validate
		expect(responseAll.length).toBe(1);
		expect(count).toBe(1);

		return;
	});

	it('request_WithoutConfig_saveOne', async () => {
		// Given
		const repo = getConnection().getRepository(RequestModel);
		const requestData: RequestData = {
			url: '/test/url/1',
			method: 'POST',
			body: {},
			headers: {
				'3': 'c',
				'2': 'b',
				'1': 'a',
				'4': 'd',
			},
			queryParams: {},
		};
		const requestData1: RequestData = {
			url: '/test/url/1',
			method: 'POST',
			body: {},
			headers: {
				'3': 'c',
				'4': 'd',
			},
			queryParams: {},
		};

		// start
		await domainService.request(requestData);
		await domainService.request(requestData1);
		const responseAll: RequestModel[] = await repo.find();
		const count = await repo.count();

		// Validate
		expect(responseAll.length).toBe(2);
		expect(count).toBe(2);

		return;
	});

	it('getRequest_paginate_allData', async () => {
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

		// Run
		const defaultTest: ResponsePaginate =
			await requestService.getRequestWithPagination(0, 10);
		const testWithEmptyFilters: ResponsePaginate =
			await requestService.getRequestWithPagination(1, 10, []);
		const secondPageTest: ResponsePaginate =
			await requestService.getRequestWithPagination(2, 20, [
				'req.id > 20',
			]);
		const moreLimitTest: ResponsePaginate =
			await requestService.getRequestWithPagination(0, 20, [
				'req.id = 20',
			]);
		const withFiltersTest: ResponsePaginate =
			await requestService.getRequestWithPagination(0, 5, [
				'req.id < 20',
				'req.id > 10',
			]);

		expect(defaultTest.total).toBe(100);
		expect(defaultTest.data.length).toBe(10);

		expect(testWithEmptyFilters.total).toBe(100);
		expect(testWithEmptyFilters.data.length).toBe(10);

		expect(secondPageTest.total).toBe(80);
		expect(secondPageTest.data.length).toBe(20);

		expect(moreLimitTest.total).toBe(1);
		expect(moreLimitTest.data.length).toBe(1);

		expect(withFiltersTest.total).toBe(9);
		expect(withFiltersTest.data.length).toBe(5);
	});

	it('deleteRequest_delete_success', async () => {
		// Given
		const requestIds = [1];
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
		const message: string = await requestService.deleteRequest(requestIds);
		const list: RequestModel[] = await getConnection()
			.getRepository(RequestModel)
			.find();

		// Validate
		expect(message).toBeTruthy();
		expect(message).toBe('Request [1] removed');
		expect(list.length).toBe(0);
	});

	it('deleteRequest_requestNotFound_empty', async () => {
		// Given
		const requestIds = [1];

		// Run
		const message: string = await requestService.deleteRequest(requestIds);

		// Validate
		expect(message).toBeFalsy();
	});

	it('getRequestById_findOne_request', async () => {
		// Given
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
		const response: RequestModel = await requestService.getRequestById(
			requestId,
		);

		// Validate
		expect(response).toBeTruthy();
	});

	function getRandomNumber(min: number, max: number) {
		return Math.round(Math.random() * (max - min) + min);
	}

	function getRandomString() {
		return (Math.random() + 1).toString(36).substring(7);
	}

	function getRandomMethod() {
		const methods: string[] = ['GET', 'POST', 'PUT', 'DELETE'];
		return methods[getRandomNumber(0, methods.length - 1)];
	}
});
