import { ApiProperty } from '@nestjs/swagger';

export type MockConfigData = {
	url: string;
	method: string;
	request_elements: string[];
};

export class MockConfigDataDto {
	@ApiProperty()
	url: string;

	@ApiProperty()
	method: string;

	@ApiProperty({
		enum: ['headers', 'queryParams', 'body'],
		default: [],
	})
	request_elements: string[];
}
