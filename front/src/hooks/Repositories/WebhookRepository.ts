import {Request} from '../../domain/Request';
export interface WebhookRepository {
  findPending(): Promise<Request[]>;
  createResponseByRequestId(id: number, response: Response): Promise<boolean>;
  deleteRequestByRequestId(id: number): Promise<boolean>;
}
