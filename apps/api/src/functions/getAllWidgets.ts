import {
  Handler,
  APIGatewayProxyResult,
} from "aws-lambda";
import middify from "../core/middify";
import formatJSONResponse from "../core/formatJsonResponse";
import widgetService from "../database/services";

export const handler: Handler = middify(
  async (): Promise<APIGatewayProxyResult> => {
    try {
      const widgets = await widgetService.getAllWidgets();

      return formatJSONResponse(200, widgets);
    } catch (err) {
      return formatJSONResponse(400, err);
    }
  }
);
