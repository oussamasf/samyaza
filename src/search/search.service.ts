// elasticsearch.service.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import { ElasticsearchService as NestElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class ElasticsearchService {
  constructor(
    private readonly elasticsearchService: NestElasticsearchService,
  ) {}

  /**
   * Create or update an Elasticsearch index with the provided name.
   *
   * This asynchronous function attempts to create or update an Elasticsearch index using the specified name. It sends a request to create or update the index and returns the response from Elasticsearch if successful.
   *
   * @param {string} index - The name of the Elasticsearch index to be created or updated.
   *
   * @throws {Error} Throws an error if there is an issue during the index creation or update process. The specific error message may vary based on the encountered error.
   *
   * @returns {Promise<any>} A Promise that resolves to the response object from Elasticsearch if the index creation or update is successful.
   */
  async createOrUpdateIndex(index: string): Promise<any> {
    try {
      const res = await this.elasticsearchService.indices.create({
        index,
      });
      return res;
    } catch (error) {
      // Handle error
      throw new BadRequestException(error.message.split('\n')[0]);
    }
  }

  /**
   * Delete an index from Elasticsearch by its name.
   *
   * This asynchronous function attempts to delete an index specified by its name from Elasticsearch. If successful, it returns the response from the deletion operation. If an error occurs during the deletion process, it catches the error and throws a BadRequestException with a message extracted from the error to provide more specific details about the issue encountered.
   *
   * @param {string} index - The name of the index to be deleted from Elasticsearch.
   *
   * @throws {BadRequestException} Throws a BadRequestException with a message extracted from the error encountered during the index deletion process.
   *
   * @returns {Promise<any>} A Promise that resolves to the response from the deletion operation if successful.
   */
  async deleteIndex(index: string): Promise<any> {
    try {
      const res = await this.elasticsearchService.indices.delete({
        index,
      });
      return res;
    } catch (error) {
      // Handle error
      throw new BadRequestException(error.message.split('\n')[0]);
    }
  }

  /**
   * Create a new document in Elasticsearch within the specified index.
   *
   * This asynchronous function attempts to create a new document with the provided data in a specified Elasticsearch index. If successful, it returns the response from the creation operation. If an error occurs during the creation process, it catches the error and throws a BadRequestException with a message extracted from the error to provide more specific details about the issue encountered.
   *
   * @param {string} id - The unique identifier for the new document.
   * @param {string} index - The name of the index in Elasticsearch where the document will be created.
   * @param {any} document - The data representing the document to be created.
   *
   * @throws {BadRequestException} Throws a BadRequestException with a message extracted from the error encountered during the document creation process.
   *
   * @returns {Promise<any>} A Promise that resolves to the response from the document creation operation if successful.
   */
  async createdDoc(id: string, index: string, document): Promise<any> {
    try {
      const res = await this.elasticsearchService.create({
        id,
        index,
        document,
      });
      return res;
    } catch (error) {
      // Handle error
      throw new BadRequestException(error.message.split('\n')[0]);
    }
  }

  /**
   * Delete all documents within a specified Elasticsearch index.
   *
   * This asynchronous function attempts to delete all documents within the specified Elasticsearch index. It uses a query that matches all documents in the index and removes them. Upon successful deletion, it logs a message confirming the deletion. If an error occurs during the deletion process, it logs an error message.
   *
   * @param {string} indexName - The name of the Elasticsearch index from which all documents will be deleted.
   *
   * @returns {Promise<void>} A Promise that resolves after attempting to delete all documents from the specified index.
   */
  async deleteAllDocuments(indexName) {
    try {
      await this.elasticsearchService.deleteByQuery({
        index: indexName,
        body: {
          query: {
            match_all: {}, // Matches all documents in the index
          },
        },
      });

      console.log(`Deleted documents from ${indexName}.`);
    } catch (error) {
      console.error(`Error deleting documents: ${error}`);
    }
  }

  /**
   * Perform a search operation in Elasticsearch based on a specific index and query body.
   *
   * This asynchronous function performs a search operation in Elasticsearch on a specified index using a provided query body. It sends the query to Elasticsearch and returns an array of records representing the search hits if successful. If an error occurs during the search operation, it catches the error and throws a new Error with the error message.
   *
   * @param {string} index - The name of the Elasticsearch index where the search operation will be executed.
   * @param {any} body - The query body used for the search operation.
   *
   * @throws {Error} Throws an Error with the error message if there's an issue during the search operation in Elasticsearch.
   *
   * @returns {Promise<Record<any, any>[]>} A Promise that resolves to an array of records representing the search hits retrieved from Elasticsearch.
   */
  async search(index, body): Promise<Record<any, any>[]> {
    try {
      const res = await this.elasticsearchService.search({
        index,
        body,
      });
      return res.hits.hits;
    } catch (error) {
      // Handle error
      throw new Error(error);
    }
  }
}
