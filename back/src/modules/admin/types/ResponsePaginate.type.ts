import { ApiProperty } from '@nestjs/swagger';

export interface ResponsePaginate {
	total: number;
	data: any;
}

export class ResponsePaginateDto implements ResponsePaginate {
	@ApiProperty()
	total: number;

	@ApiProperty()
	data: any;
}
