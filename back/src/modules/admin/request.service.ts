import { Injectable } from '@nestjs/common';
import { MockConfig as MockConfigModel } from '../../entities/MockConfig';
import { getConnection } from 'typeorm';
import { Request as RequestModel } from '../../entities/Request';
import { Response as ResponseModel } from '../../entities/Response';
import { MockConfigData } from './types/MockConfigData.type';

@Injectable()
export class RequestService {
	connection: any;
	mockConfigRepository: any;

	constructor() {
		this.connection = getConnection();
		this.mockConfigRepository =
			this.connection.getRepository(MockConfigModel);
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
			const deletedResult = await this.mockConfigRepository.delete({
				id: mockConfig.id,
			});
			result = deletedResult ? true : false;
		}
		return result;
	}
}
