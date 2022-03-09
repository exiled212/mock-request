import { Module } from '@nestjs/common';
import AdminController from './controllers/admin.controller';
import DataController from './controllers/data.controller';
import RequestService from './services/request.service';
import ResponseService from './services/response.service';

@Module({
	imports: [],
	controllers: [AdminController, DataController],
	providers: [RequestService, ResponseService],
})
export class AdminModule {}
