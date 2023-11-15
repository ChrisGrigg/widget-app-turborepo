import createDynamoDBClient from "../db";
import WidgetService from "./widgetService";

const { WIDGETS_TABLE } = process.env;

const widgetService = new WidgetService(createDynamoDBClient(), WIDGETS_TABLE);

export default widgetService;
