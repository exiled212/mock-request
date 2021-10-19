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
} from '@nestjs/common';
import { Request as RequestModel } from '../../entities/Request';
import { Response as ResponseModel } from '../../entities/Response';
import { Response } from 'express';
import { RequestService } from './request.service';
import { ResponseService } from './response.service';
import { BuildResponseBody } from './types/BuildResponseBody.type';
import { ResponseData } from './types/ResponseData.type';

@Controller('/admin')
export class AdminController {
	constructor(
		private readonly requestService: RequestService,
		private readonly responseService: ResponseService,
	) {}

	@Get('/pendings')
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

	@Post('/build-response/:requestId')
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

	@Put('/insert-response/:requestId')
	async insertResponse(
		@Res() response: Response,
		@Param('requestId') requestId: number,
		@Body() body: ResponseData,
	) {
		try {
			const result: ResponseModel =
				await this.responseService.createResponse(requestId, body);
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

	@Delete('remove-request/:requestId')
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

	@Delete('remove-response/:requestId')
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
