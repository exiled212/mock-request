import { Module, CacheModule } from '@nestjs/common';
import { MockModule } from './modules/mock/mock.module';
import { AdminModule } from './modules/admin/admin.module';

@Module({
	imports: [MockModule, AdminModule, CacheModule.register()],
})
export class AppModule {}
