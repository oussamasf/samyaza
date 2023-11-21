// elasticsearch.module.ts
import { Global, Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ElasticsearchService } from './search.service';

@Global()
@Module({
  imports: [
    ElasticsearchModule.register({
      node: 'http://localhost:9201',
    }),
  ],
  providers: [ElasticsearchService],
  exports: [ElasticsearchService],
})
export class EsSearchModule {}
