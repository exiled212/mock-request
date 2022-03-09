import { All, Controller, HttpStatus, Logger, Req, Res } from '@nestjs/common';
import { DomainService } from './domain.service';
import { Request, Response } from 'express';
import { Response as ResponseModel } from '../../entities/Response';
import { RequestData } from './types/RequestData.type';

@Controller()
export class MockController {
	private readonly logger = new Logger(MockController.name);

	constructor(private readonly domainService: DomainService) {}

	@All('/mock/*')
	async request(@Req() request: Request, @Res() response: Response) {
		let code: number = HttpStatus.NOT_FOUND;
		let headers: any = null;
		let body: any = null;
		let responseTime = 1;
		let limitTimeout = 90000;
		const requestData: RequestData =
			this.domainService.getRequestDataFromRequest(request);
		try {
			const responseData: ResponseModel =
				await this.domainService.request(requestData);
			if (responseData) {
				code = responseData.status;
				headers = responseData.headers;
				body = responseData.content;
				responseTime = responseData.responseTime;
				limitTimeout = responseData.limitTimeout;
			}
		} catch (error) {
			code = HttpStatus.INTERNAL_SERVER_ERROR;
			body = `System error: ${error}`;
		} finally {
			this.logger.log(
				`Request: [method: ${requestData.method} url: ${requestData.url} code: ${code} responseTime: ${responseTime}ms limitTimeout: ${limitTimeout}ms]`,
			);
			const result = response.status(code).set(headers);
			request.setTimeout(limitTimeout);
			await this.sleep(responseTime);

			if (body) {
				return result.json(body);
			} else {
				return result.end();
			}
		}
	}

	private sleep = (m: number) => new Promise((r) => setTimeout(r, m));
}
