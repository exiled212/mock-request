import { Test, TestingModule } from '@nestjs/testing';
import { createConnection, getConnection } from 'typeorm';
import { DomainService } from './domain.service';
import { RequestData } from './types/RequestData.type';
import { Request as RequestModel } from '../../entities/Request';
import { Response as ResponseModel } from '../../entities/Response';
import { IgnoreConfig as IgnoreConfigModel } from '../../entities/IgnoreConfig';

describe('DomainService.ts', () => {
	let domainService: DomainService;

	beforeEach(async () => {
		await createConnection({
			type: 'sqlite',
			database: ':memory:',
			dropSchema: true,
			entities: [RequestModel, ResponseModel, IgnoreConfigModel],
			synchronize: true,
			logging: false,
		});
		const app: TestingModule = await Test.createTestingModule({
			providers: [DomainService],
		}).compile();

		domainService = app.get<DomainService>(DomainService);
	});

	afterEach(() => {
		const conn = getConnection();
		return conn.close();
	});

	it('buildRequesSign_basic_md5', () => {
		// Given
		const requestData: RequestData = {
			url: '/test/url',
			body: {},
			headers: {},
			method: 'GET',
			queryParams: {},
		};

		// start
		const result: string = domainService.buildRequesSign(requestData);

		// Validate
		expect(result).toBe('fcf3e6ca4034095905601ee5c0f84ecc');
		return;
	});

	it('buildRequesSign_withHeaders_md5', () => {
		// Given
		const requestData: RequestData = {
			url: '/test/url',
			body: {},
			headers: {
				'1': 'a',
				'2': 'b',
				'3': 'c',
				'4': 'd',
			},
			method: 'GET',
			queryParams: {},
		};

		// start
		const result: string = domainService.buildRequesSign(requestData);

		// Validate
		expect(result).toBe('bef4498ad0c4c3e4c9b81edc64155833');
		return;
	});

	it('buildRequesSign_withHeadersDiferentOrder_md5', () => {
		// Given
		const requestData: RequestData = {
			url: '/test/url',
			body: {},
			headers: {
				'3': 'c',
				'2': 'b',
				'1': 'a',
				'4': 'd',
			},
			method: 'GET',
			queryParams: {},
		};

		// start
		const result: string = domainService.buildRequesSign(requestData);

		// Validate
		expect(result).toBe('bef4498ad0c4c3e4c9b81edc64155833');
		return;
	});

	it('getRequestDataFromRequest_buildFromMock_RequestData', () => {
		// Given
		const request: any = {
			params: ['test/url'],
			method: 'GET',
			headers: {
				'1': 'a',
				'2': 'b',
				'3': 'c',
			},
			query: {},
			body: {},
		};

		// start
		const requestData: RequestData =
			domainService.getRequestDataFromRequest(request);

		// Validate
		expect(requestData.url).toBe('test/url');
		expect(requestData.method).toBe('GET');
		expect(requestData.headers).toStrictEqual({
			'1': 'a',
			'2': 'b',
			'3': 'c',
		});
		expect(requestData.queryParams).toStrictEqual({});
		expect(requestData.body).toStrictEqual({});
		return;
	});

	it('request_singlerCall_save', async () => {
		// Given
		const repo = getConnection().getRepository(RequestModel);
		const requestData: RequestData = {
			url: '/test/url',
			body: {},
			headers: {
				'3': 'c',
				'2': 'b',
				'1': 'a',
				'4': 'd',
			},
			method: 'GET',
			queryParams: {},
		};
		const idMd5: string = domainService.buildRequesSign(requestData);

		// start
		await domainService.request(requestData);
		const responseDb = await repo.findOne({ where: { id_md5: idMd5 } });
		const count = await repo.count();

		// Validate
		expect(responseDb.id).toBe(1);
		expect(count).toBe(1);

		return;
	});

	it('request_moreCalls_saveOne', async () => {
		// Given
		const repo = getConnection().getRepository(RequestModel);
		const requestData: RequestData = {
			url: '/test/url',
			body: {},
			headers: {
				'3': 'c',
				'2': 'b',
				'1': 'a',
				'4': 'd',
			},
			method: 'GET',
			queryParams: {},
		};
		const idMd5: string = await domainService.buildRequesSign(requestData);

		// start
		await domainService.request(requestData);
		await domainService.request(requestData);
		await domainService.request(requestData);
		const responseDb = await repo.findOne({ where: { id_md5: idMd5 } });
		const count = await repo.count();

		// Validate
		expect(responseDb.id).toBe(1);
		expect(responseDb.url).toBe('/test/url');
		expect(responseDb.method).toBe('GET');
		expect(responseDb.headers).toStrictEqual({
			'3': 'c',
			'2': 'b',
			'1': 'a',
			'4': 'd',
		});
		expect(responseDb.queryParams).toStrictEqual({});
		expect(responseDb.body).toStrictEqual({});
		expect(count).toBe(1);

		return;
	});

	it('request_moreCalls_saveOne', async () => {
		// Given
		const repo = getConnection().getRepository(RequestModel);
		const requestData1: RequestData = {
			url: '/test/url/1',
			body: {},
			headers: {
				'3': 'c',
				'2': 'b',
				'1': 'a',
				'4': 'd',
			},
			method: 'POST',
			queryParams: {},
		};
		const requestData2: RequestData = {
			url: '/test/url/2',
			body: {},
			headers: {
				'3': 'c',
				'2': 'b',
				'1': 'a',
				'4': 'd',
			},
			method: 'POST',
			queryParams: {},
		};
		const requestData3: RequestData = {
			url: '/test/url/2',
			body: {
				name: 'test',
			},
			headers: {
				'3': 'c',
				'2': 'b',
				'1': 'a',
				'4': 'd',
			},
			method: 'POST',
			queryParams: {},
		};

		// start
		await domainService.request(requestData1);
		await domainService.request(requestData1);
		await domainService.request(requestData2);
		await domainService.request(requestData3);
		await domainService.request(requestData3);
		await domainService.request(requestData3);
		const responseAll: RequestModel[] = await repo.find();
		const count = await repo.count();

		// Validate
		expect(responseAll.length).toBe(3);
		expect(count).toBe(3);

		return;
	});
});
