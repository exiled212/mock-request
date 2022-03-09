import { ApiProperty } from '@nestjs/swagger';

export type BuildResponseBody = {
	domain: string;
};

export class BuildResponseBodyDto {
	@ApiProperty()
	domain: string;
}
