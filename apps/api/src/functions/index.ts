import { APIGatewayEvent, Callback, Context } from "aws-lambda";
import { deleteWidget } from "./deleteWidget";
import { getWidget } from "./getWidget";
import { getAllWidgets } from "./getAllWidgets";
import { updateWidget } from "./updateWidget";
import { ErrorResponse } from "api-utils";
import { createWidget } from "./createWidget";

exports.handler = async (event: APIGatewayEvent, context: Context, callback: Callback) => {
    let response;

    try {
        switch (event.path.split('/')[1]) {
            case "delete-widget":
                response = await deleteWidget(event, context, callback);
                break;
            case "get-widget":
                response = await getWidget(event, context, callback);
                break;
            case "get-widgets":
                response = await getAllWidgets(event, context, callback);
                break;
            case "create-widget":
                response = await createWidget(event, context, callback);
                break;
            case "update-widget":
                response = await updateWidget(event, context, callback);
                break;
            default:
                throw new Error(`Unsupported path: "${event.path}"`);
        }
    } catch (err) {
        if (!(err instanceof ErrorResponse)) {
            console.error(err);
            err = new ErrorResponse();
        }
        return err;
    }

    return response;
};
