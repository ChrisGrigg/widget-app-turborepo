import {
  APIGatewayEvent,
  Handler,
  APIGatewayProxyResult,
} from "aws-lambda";
import * as uuid from "uuid";
import middify from "../core/middify";
import formatJSONResponse from "../core/formatJsonResponse";
import widgetService from "../database/services";
import CreateWidget from "../dtos/createWidgetDto";
import { ErrorResponse } from "api-utils";

export const createWidget: Handler = middify(
  async (
    event: APIGatewayEvent & CreateWidget
  ): Promise<APIGatewayProxyResult> => {
    const { name, manufacturer, stockLevel } = event.body;
    try {
      const id: string = uuid.v4();

      const widget = await widgetService.createWidget({
        id,
        name,
        manufacturer,
        stockLevel,
        createdAt: new Date().toISOString(),
      });

      return formatJSONResponse(201, widget);
    } catch (err) {
      if (!(err instanceof ErrorResponse)) {
        console.error(err);
        err = new ErrorResponse();
      }
      return err;
    }
  }
);
