import {Request} from '../../domain/Request';
export interface WebhookRepository {
  findPending(): Promise<Request[]>;
  deleteRequestByRequestId(id: number): Promise<boolean>;
}
