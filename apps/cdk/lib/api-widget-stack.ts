import { Cors, IResource, LambdaIntegration, MockIntegration, PassthroughBehavior, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { App, Stack } from 'aws-cdk-lib';
import { NodejsFunction, NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path'
import { createWidgetTable } from './database/tables';

const { NODE_ENV } = process.env;

function getTableName(env: string = 'develop') {
  return `widgets-manager-${env}-WidgetTable`
}

// optimised for just locally testing the api in 'develop' mode
export class ApiWidgetStack extends Stack {
  constructor(app: App, id: string) {
    super(app, id);

    const dynamoTable = createWidgetTable(this, {
      tableName: getTableName(NODE_ENV),
      env: NODE_ENV || 'develop',
    });

    const nodeJsFunctionProps: NodejsFunctionProps = {
      environment: {
        PRIMARY_KEY: 'id',
        TABLE_NAME: getTableName(NODE_ENV),
      },
      runtime: Runtime.NODEJS_18_X,
    }

    const pathToApiFunctions = '../../api/src/functions'
    // Create a Lambda function for each of the CRUD operations
    const getOneLambda = new NodejsFunction(this, 'getOneItemFunction', {
      entry: join(__dirname, pathToApiFunctions, 'getWidget.ts'),
      ...nodeJsFunctionProps,
    });
    const getAllLambda = new NodejsFunction(this, 'getAllItemsFunction', {
      entry: join(__dirname, pathToApiFunctions, 'getAllWidgets.ts'),
      ...nodeJsFunctionProps,
    });
    const createOneLambda = new NodejsFunction(this, 'createItemFunction', {
      entry: join(__dirname, pathToApiFunctions, 'createWidget.ts'),
      ...nodeJsFunctionProps,
    });
    const updateOneLambda = new NodejsFunction(this, 'updateItemFunction', {
      entry: join(__dirname, pathToApiFunctions, 'updateWidget.ts'),
      ...nodeJsFunctionProps,
    });
    const deleteOneLambda = new NodejsFunction(this, 'deleteItemFunction', {
      entry: join(__dirname, pathToApiFunctions, 'deleteWidget.ts'),
      ...nodeJsFunctionProps,
    });

    // Grant the Lambda function read access to the DynamoDB table
    dynamoTable.grantReadWriteData(getAllLambda);
    dynamoTable.grantReadWriteData(getOneLambda);
    dynamoTable.grantReadWriteData(createOneLambda);
    dynamoTable.grantReadWriteData(updateOneLambda);
    dynamoTable.grantReadWriteData(deleteOneLambda);

    // Integrate the Lambda functions with the API Gateway resource
    const getAllIntegration = new LambdaIntegration(getAllLambda);
    const getOneIntegration = new LambdaIntegration(getOneLambda);
    const createOneIntegration = new LambdaIntegration(createOneLambda);
    const updateOneIntegration = new LambdaIntegration(updateOneLambda);
    const deleteOneIntegration = new LambdaIntegration(deleteOneLambda);

    // Create an API Gateway resource for each of the CRUD operations
    const api = new RestApi(this, 'widgetsApi', {
      restApiName: 'Widgets Service',
      // In case you want to manage binary types, uncomment the following
      // binaryMediaTypes: ["*/*"],
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS
      }
    });

    const widgets = api.root.addResource('widgets');
    widgets.addMethod('GET', getAllIntegration);
    widgets.addMethod('POST', createOneIntegration);

    const singleItem = widgets.addResource('{id}');
    singleItem.addMethod('GET', getOneIntegration);
    singleItem.addMethod('PUT', updateOneIntegration);
    singleItem.addMethod('PATCH', updateOneIntegration);
    singleItem.addMethod('DELETE', deleteOneIntegration);
  }
}
