import cdk = require('aws-cdk-lib');
import { CfnGraphQLApi, CfnApiKey, CfnGraphQLSchema, CfnDataSource, CfnResolver } from 'aws-cdk-lib/aws-appsync';
import { Table, AttributeType, StreamViewType, BillingMode } from 'aws-cdk-lib/aws-dynamodb';
import { Role, ServicePrincipal, ManagedPolicy } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class AppSyncCdkStack extends cdk.Stack {

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const tableName = 'widgets'

    const widgetsGraphQLApi = new CfnGraphQLApi(this, 'WidgetsApi', {
      name: 'widgets-api',
      authenticationType: 'API_KEY'
    });

    new CfnApiKey(this, 'WidgetsApiKey', {
      apiId: widgetsGraphQLApi.attrApiId
    });

    const apiSchema = new CfnGraphQLSchema(this, 'WidgetsSchema', {
      apiId: widgetsGraphQLApi.attrApiId,
      definition: `type ${tableName} {
        ${tableName}Id: ID!
        name: String
      }
      type Paginated${tableName} {
        widgets: [${tableName}!]!
        nextToken: String
      }
      type Query {
        all(limit: Int, nextToken: String): Paginated${tableName}!
        getOne(${tableName}Id: ID!): ${tableName}
      }
      type Mutation {
        save(name: String!): ${tableName}
        delete(${tableName}Id: ID!): ${tableName}
      }
      type Schema {
        query: Query
        mutation: Mutation
      }`
    });

    const widgetsTable = new Table(this, 'WidgetsTable', {
      tableName: tableName,
      partitionKey: {
        name: `${tableName}Id`,
        type: AttributeType.STRING
      },
      billingMode: BillingMode.PAY_PER_REQUEST,
      stream: StreamViewType.NEW_IMAGE,

      // The default removal policy is RETAIN, which means that cdk destroy will not attempt to delete
      // the new table, and it will remain in your account until manually deleted. By setting the policy to
      // DESTROY, cdk destroy will delete the table (even if it has data in it)
      removalPolicy: cdk.RemovalPolicy.DESTROY, // NOT recommended for production code
    });

    const widgetsTableRole = new Role(this, 'WidgetsDynamoDBRole', {
      assumedBy: new ServicePrincipal('appsync.amazonaws.com')
    });

    widgetsTableRole.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('AmazonDynamoDBFullAccess'));

    const dataSource = new CfnDataSource(this, 'WidgetsDataSource', {
      apiId: widgetsGraphQLApi.attrApiId,
      name: 'WidgetsDynamoDataSource',
      type: 'AMAZON_DYNAMODB',
      dynamoDbConfig: {
        tableName: widgetsTable.tableName,
        awsRegion: this.region
      },
      serviceRoleArn: widgetsTableRole.roleArn
    });

    const getOneResolver = new CfnResolver(this, 'GetOneQueryResolver', {
      apiId: widgetsGraphQLApi.attrApiId,
      typeName: 'Query',
      fieldName: 'getOne',
      dataSourceName: dataSource.name,
      requestMappingTemplate: `{
        "version": "2017-02-28",
        "operation": "GetItem",
        "key": {
          "${tableName}Id": $util.dynamodb.toDynamoDBJson($ctx.args.${tableName}Id)
        }
      }`,
      responseMappingTemplate: `$util.toJson($ctx.result)`
    });
    getOneResolver.addDependency(apiSchema);

    const getAllResolver = new CfnResolver(this, 'GetAllQueryResolver', {
      apiId: widgetsGraphQLApi.attrApiId,
      typeName: 'Query',
      fieldName: 'all',
      dataSourceName: dataSource.name,
      requestMappingTemplate: `{
        "version": "2017-02-28",
        "operation": "Scan",
        "limit": $util.defaultIfNull($ctx.args.limit, 20),
        "nextToken": $util.toJson($util.defaultIfNullOrEmpty($ctx.args.nextToken, null))
      }`,
      responseMappingTemplate: `$util.toJson($ctx.result)`
    });
    getAllResolver.addDependency(apiSchema);

    const saveResolver = new CfnResolver(this, 'SaveMutationResolver', {
      apiId: widgetsGraphQLApi.attrApiId,
      typeName: 'Mutation',
      fieldName: 'save',
      dataSourceName: dataSource.name,
      requestMappingTemplate: `{
        "version": "2017-02-28",
        "operation": "PutItem",
        "key": {
          "${tableName}Id": { "S": "$util.autoId()" }
        },
        "attributeValues": {
          "name": $util.dynamodb.toDynamoDBJson($ctx.args.name)
        }
      }`,
      responseMappingTemplate: `$util.toJson($ctx.result)`
    });
    saveResolver.addDependency(apiSchema);

    const deleteResolver = new CfnResolver(this, 'DeleteMutationResolver', {
      apiId: widgetsGraphQLApi.attrApiId,
      typeName: 'Mutation',
      fieldName: 'delete',
      dataSourceName: dataSource.name,
      requestMappingTemplate: `{
        "version": "2017-02-28",
        "operation": "DeleteItem",
        "key": {
          "${tableName}Id": $util.dynamodb.toDynamoDBJson($ctx.args.${tableName}Id)
        }
      }`,
      responseMappingTemplate: `$util.toJson($ctx.result)`
    });
    deleteResolver.addDependency(apiSchema);

  }
}

const app = new cdk.App();
new AppSyncCdkStack(app, 'AppSyncGraphQLDynamoDBExample');
app.synth();

// import { CDKContext } from './../cdk.context.d'
// import * as cdk from 'aws-cdk-lib'
// import { Construct } from 'constructs'
// import { createWidgetTable } from './database/tables'
// import { createAddWidgetPostConfirmation } from './functions/addWidgetPostConfirmation/construct'

// export class BackendTripPostStack extends cdk.Stack {
//   constructor(
//     scope: Construct,
//     id: string,
//     props: cdk.StackProps,
//     context: CDKContext
//   ) {
//     super(scope, id, props)
//     const widgetDB = createWidgetTable(this, {
//       appName: context.appName,
//       env: context.environment,
//     })

//     const addWidgetFunc = createAddWidgetPostConfirmation(this, {
//       appName: context.appName,
//       env: context.environment,
//       widgetTable: widgetDB
//     })
//   }
// }
