import {Request} from '../../domain/Request';
import {WebhookRepository} from '../Repositories/WebhookRepository';
/**
 * Implement WebhookRepository from request api
 */
export class MookRequestImp implements WebhookRepository {
  DOMAIN_URL: string;

  /**
   * constructor
   */
  constructor() {
    this.DOMAIN_URL = 'http://localhost:3001';
  }

  /**
   * Find pendings request from api
   * @return {Promise}
   */
  async findPending(): Promise<Request[]> {
    let result: Request[] = [];
    const res = await window.fetch(`${this.DOMAIN_URL}/admin/requests`);
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
        `${this.DOMAIN_URL}/admin/remove-request/${requestId}`,
        {method: 'delete'},
    );
    if (res.status === 200) {
      result = true;
    }
    return Promise.resolve(result);
  }
}
