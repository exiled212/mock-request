import { Request } from 'express';
import { Injectable, Logger } from '@nestjs/common';
import { getConnection } from 'typeorm';
import { Request as RequestModel } from '../../entities/Request';
import { Response as ResponseModel } from '../../entities/Response';
import { MockConfig as MockConfigModel } from '../../entities/MockConfig';
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
	mockConfigRepository: any;

	constructor() {
		this.connection = getConnection();
		this.requestRepository = this.connection.getRepository(RequestModel);
		this.responseRepository = this.connection.getRepository(ResponseModel);
		this.mockConfigRepository =
			this.connection.getRepository(MockConfigModel);
	}

	async request(requestData: RequestData): Promise<ResponseModel> {
		const idMd5: string = await this.buildRequesSign(requestData);
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
		return trueHeaders;
	}

	private getUrlFromParam(params: any): string {
		return params[0];
	}

	async buildRequesSign(requestData: RequestData): Promise<string> {
		const config: MockConfigModel = await this.mockConfigRepository.findOne(
			{
				where: { url: requestData.url, method: requestData.method },
			},
		);
		let context = '';
		let elements = ['url', 'method', 'headers', 'queryParams', 'body'];

		if (config) {
			elements = ['url', 'method', ...config.elements];
		}

		context = elements
			.sort((a, b) => a.localeCompare(b))
			.map((e) => `${e}:${JSON.stringify(requestData[e])}`)
			.join('|');

		return crypto.createHash('md5').update(context).digest('hex');
	}
}
