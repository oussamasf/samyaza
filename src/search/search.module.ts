// elasticsearch.module.ts
import { Global, Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ElasticsearchService } from './search.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    ConfigModule,
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        node: configService.get('ELS_HOST'),
      }),
      inject: [ConfigService],
    }),
  ],

  providers: [ElasticsearchService],
  exports: [ElasticsearchService],
})
export class EsSearchModule {}
