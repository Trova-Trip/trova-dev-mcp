export enum QueryErrorType {
  INVALID_STAGE_SYNTAX = "invalidStageSyntax",
  EXECUTION_ERROR = "executionError",
  PARSE_ERROR = "parseError",
}

export type QueryErrorResult = {
  success: false;
  error: QueryErrorType;
  message: string;
  hint: string;
  stageIndex?: number;
};

export type QuerySuccessResult = {
  success: true;
  results: unknown[];
};

export type QueryResult = QuerySuccessResult | QueryErrorResult;

export type ParsePipelineSuccess = {
  success: true;
  stages: object[];
};

export type ParsePipelineResult = ParsePipelineSuccess | QueryErrorResult;
