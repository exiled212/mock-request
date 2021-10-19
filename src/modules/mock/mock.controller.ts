import { All, Controller, HttpStatus, Req, Res } from '@nestjs/common';
import { DomainService } from './domain.service';
import { Request, Response } from 'express';
import { Response as ResponseModel } from '../../entities/Response';
import { RequestData } from './types/RequestData.type';

@Controller('/mock')
export class MockController {
	constructor(private readonly domainService: DomainService) {}

	@All('/*')
	async request(@Req() request: Request, @Res() response: Response) {
		let code: number = HttpStatus.NOT_FOUND;
		let headers: any = null;
		let body: any = null;
		try {
			const requestData: RequestData =
				this.domainService.getRequestDataFromRequest(request);
			const responseData: ResponseModel =
				await this.domainService.request(requestData);
			if (responseData) {
				code = responseData.status;
				headers = responseData.headers;
				body = responseData.content;
			}
		} catch (error) {
			code = HttpStatus.INTERNAL_SERVER_ERROR;
			body = `System error: ${error}`;
		} finally {
			const result = response.status(code).set(headers);

			if (body) {
				return result.json(body);
			} else {
				return result.end();
			}
		}
	}
}
