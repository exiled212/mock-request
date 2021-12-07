import { All, Controller, HttpStatus, Logger, Req, Res } from '@nestjs/common';
import { DomainService } from './domain.service';
import { Request, Response } from 'express';
import { Response as ResponseModel } from '../../entities/Response';
import { RequestData } from './types/RequestData.type';

@Controller('/mock')
export class MockController {
	private readonly logger = new Logger(MockController.name);

	constructor(private readonly domainService: DomainService) {}

	@All('/*')
	async request(@Req() request: Request, @Res() response: Response) {
		let code: number = HttpStatus.NOT_FOUND;
		let headers: any = null;
		let body: any = null;
		try {
			const requestData: RequestData =
				this.domainService.getRequestDataFromRequest(request);
			this.logger.log(
				`Get RequestData from Request: ${JSON.stringify(requestData)}`,
			);
			const responseData: ResponseModel =
				await this.domainService.request(requestData);
			this.logger.log(
				`Get ResponseModel from RequestData: ${JSON.stringify(
					responseData,
				)}`,
			);
			if (responseData) {
				code = responseData.status;
				headers = responseData.headers;
				body = responseData.content;
			}
		} catch (error) {
			this.logger.error(`Mock Error: ${JSON.stringify(error)}`);
			code = HttpStatus.INTERNAL_SERVER_ERROR;
			body = `System error: ${error}`;
		} finally {
			this.logger.log(
				`Mock response: [${JSON.stringify({ code, headers, body })}]`,
			);
			const result = response.status(code).set(headers);

			if (body) {
				return result.json(body);
			} else {
				return result.end();
			}
		}
	}
}
