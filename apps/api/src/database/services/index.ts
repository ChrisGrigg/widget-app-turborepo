import createDynamoDBClient from "../db";
import WidgetService from "./widgetService";

const { TABLE_NAME } = process.env;

const widgetService = new WidgetService(createDynamoDBClient(), TABLE_NAME);

export default widgetService;
