import { Module, Global } from '@nestjs/common';
import { CommonService } from './common.service';

@Global()
@Module({
  exports: [CommonService],
  providers: [CommonService],
  imports: [],
})
export class CommonModule {}
