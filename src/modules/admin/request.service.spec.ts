import { createConnection, getConnection } from 'typeorm';
import { RequestService } from './request.service';
import { Request as RequestModel } from '../../entities/Request';
import { Response as ResponseModel } from '../../entities/Response';
import { IgnoreConfig as IgnoreConfigModel } from '../../entities/IgnoreConfig';
import { Test, TestingModule } from '@nestjs/testing';

describe('RequestService.ts', () => {
	let requestService: RequestService;

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
			providers: [RequestService],
		}).compile();

		requestService = app.get<RequestService>(RequestService);
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
