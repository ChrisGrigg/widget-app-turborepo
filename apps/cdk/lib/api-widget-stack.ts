import { Cors, LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { App, Stack } from 'aws-cdk-lib';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path'
import { createWidgetTable } from './database/tables';

// ** WIP - untested **
export interface ApiWidgetStackProps {
  nodeEnv: string;
}

function getTableName(env: string = 'develop') {
  return `widgets-manager-${env}-WidgetTable`
}

// optimised for just locally testing the api in 'develop' mode
export class ApiWidgetStack extends Stack {
  constructor(app: App, id: string, props: ApiWidgetStackProps) {
    super(app, id);

    const dynamoTable = createWidgetTable(this, {
      tableName: getTableName(props.nodeEnv),
      env: props.nodeEnv,
    });

    // Create a Lambda function for each of the CRUD operations
    const lambda = new NodejsFunction(this, 'widgetsCrudFunction', {
      entry: join(__dirname, '../../api/src/functions', 'index.ts'),
      environment: {
        PRIMARY_KEY: 'id',
        TABLE_NAME: getTableName(props.nodeEnv),
      },
      runtime: Runtime.NODEJS_18_X,
    });

    // Grant the Lambda function read access to the DynamoDB table
    dynamoTable.grantReadWriteData(lambda);

    // Integrate the Lambda functions with the API Gateway resource
    const lambdaIntegration = new LambdaIntegration(lambda);

    // Create an API Gateway resource for each of the CRUD operations
    const api = new RestApi(this, 'widgetsApi', {
      restApiName: 'Widgets Service',
      // In case you want to manage binary types, uncomment the following
      // binaryMediaTypes: ["*/*"],
      defaultCorsPreflightOptions: {
        allowOrigins: props.nodeEnv === 'develop' ? Cors.ALL_ORIGINS : [''],
        allowMethods: props.nodeEnv === 'develop' ? Cors.ALL_METHODS : [''],
      }
    });

    const widgets = api.root.addResource('widgets');
    widgets.addMethod('GET', lambdaIntegration);
    widgets.addMethod('POST', lambdaIntegration);

    const singleWidget = widgets.addResource('{id}');
    singleWidget.addMethod('GET', lambdaIntegration);
    singleWidget.addMethod('PUT', lambdaIntegration);
    singleWidget.addMethod('PATCH', lambdaIntegration);
    singleWidget.addMethod('DELETE', lambdaIntegration);
  }
}
