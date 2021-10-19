import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { RequestService } from './request.service';
import { ResponseService } from './response.service';

@Module({
	imports: [],
	controllers: [AdminController],
	providers: [RequestService, ResponseService],
})
export class AdminModule {}
