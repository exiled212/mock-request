import {Request} from '../../domain/Request';
import {WebhookRepository} from '../Repositories/WebhookRepository';
import {Utils} from '../Utils';
/**
 * Implement WebhookRepository from request api
 */
export class MookRequestImp implements WebhookRepository {
  PENDING_PATH: string;
  REQUEST_PATH: string;

  /**
   * constructor
   */
  constructor() {
    this.PENDING_PATH = Utils.getEnvs('PENDING_PATH');
    this.REQUEST_PATH = Utils.getEnvs('REQUEST_PATH');
  }

  /**
   * Find pendings request from api
   * @return {Promise}
   */
  async findPending(): Promise<Request[]> {
    let result: Request[] = [];
    const res = await window.fetch(this.PENDING_PATH);
    if (res.status === 200) {
      result = await res.json();
    }
    return result;
  }

  /**
   * Delete request from id
   * @param {number} requestId
   * @return {Promise}
   */
  async deleteRequestByRequestId(requestId: number): Promise<boolean> {
    let result = false;
    const res = await window.fetch(
        `${this.REQUEST_PATH}/${requestId}`,
        {method: 'delete'},
    );
    if (res.status === 200) {
      result = true;
    }
    return Promise.resolve(result);
  }


  /**
   * create response
   * @param {number} requestId
   * @param {Response} response
   * @return {promise}
   */
  async createResponseByRequestId(
      requestId: number,
      response: Response,
  ): Promise<boolean> {
    let result = false;
    const res = await window.fetch(
        `${this.REQUEST_PATH}/${requestId}`,
        {method: 'put', body: JSON.stringify(response)},
    );
    if (res.status === 201) {
      result = true;
    }
    return Promise.resolve(result);
  }
}
