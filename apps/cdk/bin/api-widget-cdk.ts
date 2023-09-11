#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { ApiWidgetStack } from '../lib/api-widget-stack';

const app = new cdk.App();

new ApiWidgetStack(app, 'ApiWidget');

app.synth();
