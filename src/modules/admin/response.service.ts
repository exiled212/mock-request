import { Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { getConnection } from 'typeorm';
import { Request as RequestModel } from '../../entities/Request';
import { Response as ResponseModel } from '../../entities/Response';
import { ResponseData } from './types/ResponseData.type';

@Injectable()
export class ResponseService {
	connection: any;
	requestRepository: any;
	responseRepository: any;

	constructor() {
		this.connection = getConnection();
		this.requestRepository = this.connection.getRepository(RequestModel);
		this.responseRepository = this.connection.getRepository(ResponseModel);
	}

	async buildResponse(
		requestId: number,
		domain: string,
	): Promise<ResponseModel> {
		let result: ResponseModel;
		const request: RequestModel = await this.requestRepository.findOne({
			where: { id: requestId },
		});
		if (request) {
			const resultCall: AxiosResponse = await this.call(request, domain);
			const response: ResponseModel =
				await this.responseRepository.findOne({
					where: { request: request },
				});
			if (response) {
				response.status = resultCall.status;
				response.headers = resultCall.headers;
				response.content = resultCall.data as any;
				result = await this.responseRepository.save(response);
			} else {
				result = await this.responseRepository.save({
					request: request,
					status: resultCall.status,
					headers: resultCall.headers,
					content: resultCall.data,
				});
			}
		}

		return result;
	}

	async createResponse(
		requestId: number,
		responseData: ResponseData,
	): Promise<ResponseModel> {
		let response: ResponseModel;
		const request: RequestModel = await this.requestRepository.findOne({
			where: { id: requestId },
		});

		if (request) {
			response = await this.responseRepository.findOne({
				where: { request: request },
			});

			if (response) {
				response.status = responseData.status;
				response.headers = responseData.headers;
				response.content = responseData.content;
				response = await this.responseRepository.save(response);
			} else {
				response = await this.responseRepository.save({
					request: request,
					status: responseData.status,
					headers: responseData.headers,
					content: responseData.content,
				});
			}
		}

		return response;
	}

	async deleteRequest(requestId: number): Promise<string> {
		let result: string;
		const request: RequestModel = await this.requestRepository.findOne({
			where: { id: requestId },
		});
		if (request) {
			await this.requestRepository.delete({ id: requestId });
			result = `Request ${requestId} removed`;
		}

		return result;
	}

	async deleteResponse(requestId: number): Promise<RequestModel> {
		let result: RequestModel;
		const request: RequestModel = await this.requestRepository.findOne({
			where: { id: requestId },
		});
		if (request) {
			await this.responseRepository.delete({ request: request });
			result = request;
		}

		return result;
	}

	private call(
		request: RequestModel,
		domain: string,
	): Promise<AxiosResponse> {
		return new Promise((resolve) => {
			axios({
				url: `${domain}/${request.url}`,
				method: request.method as any,
				data: request.body,
				headers: request.headers,
				params: request.queryParams,
			})
				.then((response) => {
					resolve(response);
				})
				.catch((error) => {
					resolve(error.response);
				});
		});
	}
}
