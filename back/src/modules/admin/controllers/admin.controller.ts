import {
	Controller,
	Get,
	HttpStatus,
	Post,
	Res,
	Param,
	Body,
	Put,
	Delete,
	Logger,
	Query,
} from '@nestjs/common';
import { Request as RequestModel } from '../../../entities/Request';
import { Response as ResponseModel } from '../../../entities/Response';
import { Response } from 'express';
import RequestService from '../services/request.service';
import ResponseService from '../services/response.service';
import {
	BuildResponseBody,
	BuildResponseBodyDto,
} from '../types/BuildResponseBody.type';
import { ResponseData, ResponseDataDto } from '../types/ResponseData.type';
import {
	MockConfigData,
	MockConfigDataDto,
} from '../types/MockConfigData.type';
import { ApiBody } from '@nestjs/swagger';

@Controller('/admin')
export default class AdminController {
	private readonly logger = new Logger(AdminController.name);

	constructor(
		private readonly requestService: RequestService,
		private readonly responseService: ResponseService,
	) {}

	@Get('/request')
	async getRequest(@Res() response: Response) {
		try {
			const requestList: any = await this.requestService.getRequest();
			if (requestList.length > 0) {
				return response.status(HttpStatus.OK).json(requestList);
			} else {
				return response.status(HttpStatus.NO_CONTENT).end();
			}
		} catch (error) {
			return response
				.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.json(error);
		}
	}

	@Get('/request/pending')
	async getPendingsRequest(@Res() response: Response) {
		const requestList: RequestMode[] =
			await this.requestService.getPendingRequest();
		if (requestList.length > 0) {
			return response.status(HttpStatus.OK).json(requestList);
		} else {
			return response.status(HttpStatus.NO_CONTENT).end();
		}
	}

	@Delete('/request/pending')
	async deletePendingsRequest(@Res() response: Response) {
		await this.requestService.deletePendings();
		return response.status(HttpStatus.OK).end();
	}

	@ApiBody({ type: MockConfigDataDto })
	@Put('/request/config')
	async setConfig(@Res() response: Response, @Body() body: MockConfigData) {
		return response
			.status(201)
			.json(await this.requestService.createMockConfig(body));
	}

	@Delete('/request/config/:configId')
	async removeConfig(
		@Res() response: Response,
		@Param('configId') configId: number,
	) {
		const result: boolean = await this.requestService.deleteMockConfig(
			configId,
		);
		if (result) {
			return response.status(HttpStatus.OK).json(result);
		} else {
			return response.status(HttpStatus.NOT_FOUND).json({
				message: `Config id '${configId}' not found`,
			});
		}
	}

	@ApiBody({ type: BuildResponseBodyDto })
	@Post('/request/:requestId')
	async buildResponse(
		@Res() response: Response,
		@Param('requestId') requestId: number,
		@Body() body: BuildResponseBody,
	) {
		const result: ResponseModel = await this.responseService.buildResponse(
			requestId,
			body.domain,
		);
		if (result) {
			return response.status(HttpStatus.CREATED).json(result);
		} else {
			return response.status(HttpStatus.NOT_FOUND).json({
				message: `Request id '${requestId}' not found`,
			});
		}
	}

	@ApiBody({ type: ResponseDataDto })
	@Put('/request/:requestId')
	async insertResponse(
		@Res() response: Response,
		@Param('requestId') requestId: number,
		@Body() body: ResponseData,
		@Query('responseTime') responseTime: number,
		@Query('limitTimeout') limitTimeout: number,
	) {
		const result: ResponseModel = await this.responseService.createResponse(
			requestId,
			body,
			responseTime,
			limitTimeout,
		);
		this.logger.log(`[requestId: ${requestId}] Find response.`);
		if (result) {
			return response.status(HttpStatus.CREATED).json(result);
		} else {
			this.logger.warn(`[requestId: ${requestId}] Response not found.`);
			return response.status(HttpStatus.NOT_FOUND).json({
				message: `Request id '${requestId}' not found`,
			});
		}
	}

	@Delete('/request')
	async removeRequest(
		@Res() response: Response,
		@Body() requestIds: number[],
	) {
		const result: string = await this.requestService.deleteRequest(
			requestIds,
		);
		if (result) {
			return response.status(HttpStatus.OK).json(result);
		} else {
			return response.status(HttpStatus.NOT_FOUND).json({
				message: `Request ids '${requestIds}' not found`,
			});
		}
	}

	@Delete('/response/:requestId')
	async removeResponse(
		@Res() response: Response,
		@Param('requestId') requestId: number,
	) {
		const result: RequestModel = await this.responseService.deleteResponse(
			requestId,
		);
		if (result) {
			return response.status(HttpStatus.OK).json(result);
		} else {
			return response.status(HttpStatus.NOT_FOUND).json({
				message: `Request id '${requestId}' not found`,
			});
		}
	}
}
