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
} from '@nestjs/common';
import { Request as RequestModel } from '../../entities/Request';
import { Response as ResponseModel } from '../../entities/Response';
import { Response } from 'express';
import { RequestService } from './request.service';
import { ResponseService } from './response.service';
import { BuildResponseBody } from './types/BuildResponseBody.type';
import { ResponseData } from './types/ResponseData.type';
import { MockConfigData } from './types/MockConfigData.type';

@Controller('/admin')
export class AdminController {
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
		try {
			const requestList: RequestMode[] =
				await this.requestService.getPendingRequest();
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
		try {
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
		} catch (error) {
			return response.status(HttpStatus.INTERNAL_SERVER_ERROR).end();
		}
	}

	@Post('/request/:requestId')
	async buildResponse(
		@Res() response: Response,
		@Param('requestId') requestId: number,
		@Body() body: BuildResponseBody,
	) {
		try {
			const result: ResponseModel =
				await this.responseService.buildResponse(
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
		} catch (error) {
			return response.status(HttpStatus.INTERNAL_SERVER_ERROR).end();
		}
	}

	@Put('/request/:requestId')
	async insertResponse(
		@Res() response: Response,
		@Param('requestId') requestId: number,
		@Body() body: ResponseData,
	) {
		this.logger.log(
			`[requestId: ${requestId}] insert response: ${JSON.stringify(
				body,
			)}`,
		);
		try {
			const result: ResponseModel =
				await this.responseService.createResponse(requestId, body);
			this.logger.log(`[requestId: ${requestId}] Find response.`);
			if (result) {
				return response.status(HttpStatus.CREATED).json(result);
			} else {
				this.logger.warn(
					`[requestId: ${requestId}] Response not found.`,
				);
				return response.status(HttpStatus.NOT_FOUND).json({
					message: `Request id '${requestId}' not found`,
				});
			}
		} catch (error) {
			return response
				.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.json(error);
		}
	}

	@Delete('/request/:requestId')
	async removeRequest(
		@Res() response: Response,
		@Param('requestId') requestId: number,
	) {
		try {
			const result: string = await this.responseService.deleteRequest(
				requestId,
			);
			if (result) {
				return response.status(HttpStatus.OK).json(result);
			} else {
				return response.status(HttpStatus.NOT_FOUND).json({
					message: `Request id '${requestId}' not found`,
				});
			}
		} catch (error) {
			return response.status(HttpStatus.INTERNAL_SERVER_ERROR).end();
		}
	}

	@Delete('/response/:requestId')
	async removeResponse(
		@Res() response: Response,
		@Param('requestId') requestId: number,
	) {
		try {
			const result: RequestModel =
				await this.responseService.deleteResponse(requestId);
			if (result) {
				return response.status(HttpStatus.OK).json(result);
			} else {
				return response.status(HttpStatus.NOT_FOUND).json({
					message: `Request id '${requestId}' not found`,
				});
			}
		} catch (error) {
			return response.status(HttpStatus.INTERNAL_SERVER_ERROR).end();
		}
	}
}
