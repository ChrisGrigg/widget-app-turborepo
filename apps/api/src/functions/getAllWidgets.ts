import {
  Handler,
  APIGatewayProxyResult,
} from "aws-lambda";
import middify from "../core/middify";
import formatJSONResponse from "../core/formatJsonResponse";
import widgetService from "../database/services";
import { ErrorResponse } from "api-utils";

export const handler: Handler = middify(
  async (): Promise<APIGatewayProxyResult> => {
    try {
      const widgets = await widgetService.getAllWidgets();

      return formatJSONResponse(200, widgets);
    } catch (err) {
      if (!(err instanceof ErrorResponse)) {
        console.error(err);
        err = new ErrorResponse();
      }
      return err;
    }
  }
);
