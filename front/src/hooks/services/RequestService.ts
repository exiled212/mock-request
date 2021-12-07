import {Request} from '../../domain/Request';
import {WebhookRepository} from '../Repositories/WebhookRepository';
import {MookRequestImp} from '../implement/MookRequestImp';
import {RequestTable} from '../../domain/RequestTable';

/**
 * Request service
 */
export class RequestService {
  webhookRepository: WebhookRepository;

  /**
   * RequestService constructor
   */
  constructor() {
    this.webhookRepository = new MookRequestImp();
  }

  /**
   * Get pendings request for response
   * @return {Promise}
   */
  async getPendings(): Promise<RequestTable[]> {
    const requestList: Request[] = await this.webhookRepository.findPending();
    return requestList.map((i)=>i as unknown as RequestTable);
  }

  /**
   * Set response data from reuqest
   * @param {Request} pending
   * @param {Response} response
   */
  async createResponse(
      pending: Request,
      response: Response,
  ): Promise<boolean> {
    return this.webhookRepository
        .createResponseByRequestId(pending.id, response);
  }

  /**
   * Delete request
   * @param {Request} pending
   */
  async deleteRequest(pending: Request): Promise<boolean> {
    return this.webhookRepository.deleteRequestByRequestId(pending.id);
  }
}
