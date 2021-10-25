import { Request } from 'express';
import { Injectable, Logger } from '@nestjs/common';
import { getConnection } from 'typeorm';
import { Request as RequestModel } from '../../entities/Request';
import { Response as ResponseModel } from '../../entities/Response';
import { RequestData } from './types/RequestData.type';
import * as crypto from 'crypto';

@Injectable()
export class DomainService {
	private readonly logger = new Logger(DomainService.name);

	private HEADERS_BLACKLIST = [
		'Content-Length',
		'Host',
		'connection',
		'user-agent',
		'accept',
	];

	connection: any;
	requestRepository: any;
	responseRepository: any;

	constructor() {
		this.connection = getConnection();
		this.requestRepository = this.connection.getRepository(RequestModel);
		this.responseRepository = this.connection.getRepository(ResponseModel);
	}

	async request(requestData: RequestData): Promise<ResponseModel> {
		const idMd5: string = this.buildRequesSign(requestData);
		this.logger.log(
			`Build md5 ${idMd5} from RequestData ${JSON.stringify(
				requestData,
			)}`,
		);
		let response = null;
		let request = await this.requestRepository.findOne({
			where: { id_md5: idMd5 },
		});
		if (request) {
			response = await this.responseRepository.findOne({
				request: request,
			});
		} else {
			request = await this.requestRepository.save({
				id_md5: idMd5,
				...requestData,
			});
		}
		this.logger.log(`[requestId: ${request.id}] Get request from ${idMd5}`);
		return response;
	}

	getRequestDataFromRequest(request: Request): RequestData {
		const { method, params, headers, query, body } = request;

		return {
			url: this.getUrlFromParam(params),
			method: method,
			headers: this.removeHeadersFromBlacklist(headers),
			queryParams: query,
			body: body,
		};
	}

	private removeHeadersFromBlacklist(headers: any) {
		this.logger.log(`Original headers: ${JSON.stringify(headers)}`);
		const trueHeaders: any = {};
		for (const index in headers) {
			if (
				!this.HEADERS_BLACKLIST.map((i) => i.toLowerCase()).includes(
					index.toLowerCase(),
				)
			) {
				trueHeaders[index] = headers[index];
			}
		}
		this.logger.log(`Filter headers: ${JSON.stringify(trueHeaders)}`);
		return trueHeaders;
	}

	private getUrlFromParam(params: any): string {
		return params[0];
	}

	buildRequesSign(requestData: RequestData): string {
		const url: string = requestData.url;
		const method: string = requestData.method;
		const headers: string = JSON.stringify(requestData.headers);
		const queryParams: string = JSON.stringify(requestData.queryParams);
		const body: string = JSON.stringify(requestData.body);
		const context = `url:${url}|method:${method}|headers:${headers}|queryParams:${queryParams}|body:${body}`;
		return crypto.createHash('md5').update(context).digest('hex');
	}
}
