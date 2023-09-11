import {
  APIGatewayEvent,
  Handler,
  APIGatewayProxyResult,
} from "aws-lambda";
import middify from "../core/middify";
import formatJSONResponse from "../core/formatJsonResponse";
import widgetService from "../database/services";
import { ErrorResponse } from "api-utils";

export const handler: Handler = middify(
  async (
    event: APIGatewayEvent,
  ): Promise<APIGatewayProxyResult> => {
    const id: string = event.pathParameters.id;
    try {
      const widget = await widgetService.getWidget(id);

      return formatJSONResponse(200, widget);
    } catch (err) {
      if (!(err instanceof ErrorResponse)) {
        console.error(err);
        err = new ErrorResponse();
      }
      return err;
    }
  }
);
