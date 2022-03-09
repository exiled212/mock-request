import { Injectable } from '@nestjs/common';
import { MockConfig as MockConfigModel } from '../../../entities/MockConfig';
import { getConnection } from 'typeorm';
import { Request as RequestModel } from '../../../entities/Request';
import { Response as ResponseModel } from '../../../entities/Response';
import { MockConfigData } from '../types/MockConfigData.type';
import { ResponsePaginate } from '../types/ResponsePaginate.type';

@Injectable()
export default class RequestService {
	connection: any;
	mockConfigRepository: any;
	requestRepository: any;

	constructor() {
		this.connection = getConnection();
		this.mockConfigRepository =
			this.connection.getRepository(MockConfigModel);
		this.requestRepository = this.connection.getRepository(RequestModel);
	}

	async getPendingRequest() {
		return await this.connection
			.getRepository(RequestModel)
			.createQueryBuilder('req')
			.leftJoinAndSelect(ResponseModel, 'res', 'res.requestId = req.id')
			.where('res.id is null')
			.orderBy('req.id', 'ASC')
			.getMany();
	}

	async getRequest() {
		return await this.connection
			.getRepository(RequestModel)
			.createQueryBuilder('req')
			.leftJoinAndSelect('req.response', 'response')
			.orderBy('req.id', 'ASC')
			.getMany();
	}

	async createMockConfig(
		mockConfigData: MockConfigData,
	): Promise<MockConfigModel> {
		let result: MockConfigModel;
		const mockConfig = await this.mockConfigRepository.findOne({
			where: { url: mockConfigData.url, method: mockConfigData.method },
		});
		if (!mockConfig) {
			result = await this.mockConfigRepository.save({
				url: mockConfigData.url,
				method: mockConfigData.method,
				elements: mockConfigData.request_elements,
			});
		} else {
			mockConfig.elements = mockConfigData.request_elements;
			result = await this.mockConfigRepository.save(mockConfig);
		}

		return result;
	}

	async deleteMockConfig(id: number): Promise<boolean> {
		let result = false;
		const mockConfig = await this.mockConfigRepository.findOne({
			where: { id },
		});
		if (mockConfig) {
			await this.mockConfigRepository.delete({
				id: mockConfig.id,
			});
			result = true;
		}
		return result;
	}

	async deletePendings(): Promise<string> {
		const pendings = await this.connection
			.getRepository(RequestModel)
			.createQueryBuilder('req')
			.leftJoinAndSelect(ResponseModel, 'res', 'res.requestId = req.id')
			.where('res.id is null')
			.getMany();
		await this.mockConfigRepository.delete(pendings);
		return 'Pendings removed';
	}

	async getRequestWithPagination(
		offset: number,
		limit: number,
		filters: string[] = [],
	): Promise<ResponsePaginate> {
		let query = this.connection
			.getRepository(RequestModel)
			.createQueryBuilder('req')
			.select(['req.id', 'req.url', 'req.method'])
			.leftJoinAndSelect(ResponseModel, 'res', 'res.requestId = req.id')
			.orderBy('req.id', 'ASC')
			.where('true');

		filters.map((filter: string) => {
			query = query.andWhere(filter);
		});

		const total = await query.getCount();
		const data = await query.offset(offset).limit(limit).getMany();

		return {
			total,
			data,
		} as ResponsePaginate;
	}

	async deleteRequest(requestIds: number[]): Promise<string> {
		let result: string;
		const requests: RequestModel[] = await this.requestRepository.findByIds(
			requestIds,
		);
		if (requests && requests.length > 0) {
			await this.requestRepository.delete(requests);
			result = `Request ${JSON.stringify(requestIds)} removed`;
		}

		return result;
	}

	async getRequestById(requestId: number): Promise<RequestModel> {
		return await this.requestRepository.findOne(requestId);
	}
}
