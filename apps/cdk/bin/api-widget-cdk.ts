#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { ApiWidgetStack } from '../lib/api-widget-stack';

const app = new cdk.App();

let env  = app.node.tryGetContext('config');
let unparsedEnv = app.node.tryGetContext(env);

new ApiWidgetStack(app, 'ApiWidget', {
  nodeEnv: unparsedEnv.NodeEnv,
});

app.synth();
