import {
	Controller,
	Post,
	HttpStatus,
	Res,
	Logger,
	Query,
	Body,
	Get,
	Param,
} from '@nestjs/common';

import { Response } from 'express';
import RequestService from '../services/request.service';
import { ResponsePaginate } from '../types/ResponsePaginate.type';
import { Request as RequestModel } from '../../../entities/Request';

@Controller('/data')
export default class DataController {
	private readonly logger = new Logger(DataController.name);

	constructor(private readonly requestService: RequestService) {}

	@Post('/request')
	async getRequest(
		@Res() response: Response,
		@Query('limit') limit = 10,
		@Query('offset') offset = 0,
		@Body() filters: string[] = [],
	) {
		const result: ResponsePaginate =
			await this.requestService.getRequestWithPagination(
				offset,
				limit,
				filters,
			);
		return response.status(HttpStatus.OK).json(result);
	}

	@Get('/request/:requestId')
	async getRequestOne(
		@Res() response: Response,
		@Param('requestId') requestId: number,
	) {
		const result: RequestModel = await this.requestService.getRequestById(
			requestId,
		);
		return response.status(HttpStatus.OK).json(result);
	}
}
