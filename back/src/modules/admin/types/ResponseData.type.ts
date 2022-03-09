import { ApiProperty } from '@nestjs/swagger';

export interface ResponseData {
	status: number;
	headers: any;
	content: any;
}

export class ResponseDataDto implements ResponseData {
	@ApiProperty()
	status: number;

	@ApiProperty()
	headers: any;

	@ApiProperty()
	content: any;
}
