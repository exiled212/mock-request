import { Module } from '@nestjs/common';
import { MockController } from './mock.controller';
import { DomainService } from './domain.service';

@Module({
	imports: [],
	controllers: [MockController],
	providers: [DomainService],
})
export class MockModule {}
