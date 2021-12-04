import { Module } from '@nestjs/common';
import { MockModule } from './modules/mock/mock.module';
import { AdminModule } from './modules/admin/admin.module';

@Module({
	imports: [MockModule, AdminModule],
})
export class AppModule {}
