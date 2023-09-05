
import { Construct } from 'constructs'
import * as awsDynamodb from 'aws-cdk-lib/aws-dynamodb'
import { RemovalPolicy } from 'aws-cdk-lib'
import { envNameContext } from '../../cdk.context'

type BaseTableProps = {
  appName: string
  env: envNameContext
}
type createWidgetTableProps = BaseTableProps & {}

export function createWidgetTable(
  scope: Construct,
  props: createWidgetTableProps
): awsDynamodb.Table {
  const widgetTable = new awsDynamodb.Table(scope, 'WidgetTable', {
    tableName: `${props.appName}-${props.env}-WidgetTable`,
    removalPolicy:
      props.env === 'develop' ? RemovalPolicy.DESTROY : RemovalPolicy.RETAIN,
    billingMode: awsDynamodb.BillingMode.PAY_PER_REQUEST,
    partitionKey: { name: 'id', type: awsDynamodb.AttributeType.STRING },
  })

  return widgetTable
}
