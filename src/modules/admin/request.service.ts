import { Injectable } from '@nestjs/common';
import { getConnection } from 'typeorm';
import { Request as RequestModel } from '../../entities/Request';
import { Response as ResponseModel } from '../../entities/Response';

@Injectable()
export class RequestService {
	connection: any;

	constructor() {
		this.connection = getConnection();
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
}
