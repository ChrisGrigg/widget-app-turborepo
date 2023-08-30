import { DocumentClient } from "aws-sdk/clients/dynamodb";
import Widget from "../../models/Widget";

class WidgetService {
  constructor(
    private readonly docClient: DocumentClient,
    private readonly tableName: string
  ) { }

  async getAllWidgets(): Promise<Widget[]> {
    const result = await this.docClient
      .scan({
        TableName: this.tableName,
      })
      .promise();

    return result.Items as Widget[];
  }

  async getWidget(id: string): Promise<Widget> {
    const result = await this.docClient
      .get({
        TableName: this.tableName,
        Key: { id },
      })
      .promise();

    return result.Item as Widget;
  }

  async createWidget(widget: Widget): Promise<Widget> {
    await this.docClient
      .put({
        TableName: this.tableName,
        Item: widget,
      })
      .promise();
    return widget;
  }

  async updateWidget(id: string, partialWidget: Partial<Widget>): Promise<Widget> {
    const updated = await this.docClient
      .update({
        TableName: this.tableName,
        Key: { id },
        UpdateExpression:
          "set #name = :name, manufacturer = :manufacturer, stockLevel = :stockLevel",
        ExpressionAttributeNames: {
          "#name": "name",
        },
        ExpressionAttributeValues: {
          ":name": partialWidget.name,
          ":manufacturer": partialWidget.manufacturer,
          ":stockLevel": partialWidget.stockLevel,
        },
        ReturnValues: "ALL_NEW",
      })
      .promise();

    return updated.Attributes as Widget;
  }

  async deleteWidget(id: string) {
    return this.docClient
      .delete({
        TableName: this.tableName,
        Key: { id },
      })
      .promise();
  }
}

export default WidgetService;
