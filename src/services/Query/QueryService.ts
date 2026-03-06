// @ts-expect-error - no type declarations available
import stageValidator from "mongodb-stage-validator";
import { createRequire } from "module";
import { inject, singleton } from "tsyringe";
import { MongoConnectionService } from "../Mongo";
// Bun doesn't resolve named ESM exports from this CJS package
const { parseFilter } = createRequire(import.meta.url)("mongodb-query-parser");
import type { PipelineStage } from "mongoose";
import type { ParsePipelineResult, QueryResult } from "./QueryService.types";
import { QueryErrorType } from "./QueryService.types";

@singleton()
export class QueryService {
  constructor(
    @inject(MongoConnectionService)
    private mongoConnection: MongoConnectionService,
  ) {}

  async executeAggregation(
    collectionName: string,
    pipeline: string[],
  ): Promise<QueryResult> {
    try {
      const parsedPipeline = this.parsePipeline(pipeline);

      if (!parsedPipeline.success) {
        return parsedPipeline;
      }

      const model = this.mongoConnection.getModel(collectionName);
      const results = await model
        .aggregate(parsedPipeline.stages as PipelineStage[])
        .option({ maxTimeMS: 30000 })
        .exec();

      return {
        success: true,
        results,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        success: false,
        error: QueryErrorType.EXECUTION_ERROR,
        message,
        hint: "Check that the collection name is correct and the pipeline stages are valid for your schema.",
      };
    }
  }

  private parsePipeline(pipeline: string[]): ParsePipelineResult {
    const parsedStages: object[] = [];

    for (let i = 0; i < pipeline.length; i++) {
      const stageString = pipeline[i];

      const isValid = stageValidator.accepts(stageString);

      if (!isValid) {
        return {
          success: false,
          error: QueryErrorType.INVALID_STAGE_SYNTAX,
          message: `Stage ${i} is invalid or uses unsupported operators.`,
          hint: 'Ensure each stage is valid MongoDB aggregation syntax. Examples: {"$match": {"status": "active"}}, {"$group": {"_id": "$category", "count": {"$sum": 1}}}',
          stageIndex: i,
        };
      }

      try {
        const parsedStage = parseFilter(stageString);
        parsedStages.push(parsedStage);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          success: false,
          error: QueryErrorType.PARSE_ERROR,
          message,
          hint: "Check MongoDB aggregation syntax. Common issues: missing quotes, invalid ObjectId/ISODate format, incorrect stage operators.",
          stageIndex: i,
        };
      }
    }

    return { success: true, stages: parsedStages };
  }
}
