// elasticsearch.service.ts
import { Injectable } from '@nestjs/common';
import { ElasticsearchService as NestElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class ElasticsearchService {
  constructor(
    private readonly elasticsearchService: NestElasticsearchService,
  ) {}

  async searchMovie(
    title: string = '',
    overview: string = '',
  ): Promise<Record<any, any>[]> {
    const body = {
      query: {
        bool: {
          should: [
            {
              match: {
                title: {
                  query: title,
                  minimum_should_match: '2<50%',
                  // max_expansions: 10,
                  // fuzziness: 'AUTO',
                },
              },
            },
            {
              match: {
                overview: {
                  query: overview,
                  minimum_should_match: '2<50%',
                },
              },
            },
          ],
        },
      },
    };
    try {
      const res = await this.elasticsearchService.search({
        index: 'movie',
        body,
      });
      return res.hits.hits;
    } catch (error) {
      // Handle error
      throw new Error(error);
    }
  }

  // async createOrUpdateIndex(index: string, body: any): Promise<any> {
  async createOrUpdateIndex(index: string): Promise<any> {
    try {
      const res = await this.elasticsearchService.indices.create({
        index,
        body: {},
      });
      return res;
    } catch (error) {
      // Handle error
      throw new Error(error);
    }
  }

  async createdDoc(id: string, document): Promise<any> {
    try {
      const res = await this.elasticsearchService.create({
        id,
        index: 'movie',
        document,
      });
      return res;
    } catch (error) {
      // Handle error
      console.error(error);
    }
  }
}
