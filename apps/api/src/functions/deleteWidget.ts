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
      const widgets = await widgetService.deleteWidget(id);

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
