# node-slack-logs
Console log integrate with Slack application

## Installation

Easy by :
```
npm i --save node-slack-logs
```

## Usage :

Example :

```javascript
import {SlackLogger} from "node-slack-logs/dist";

let slackLogger = new SlackLogger('APP_NAME');
//Register slack log for console error and warn
slackLogger.register('CHANNEL_WEBHOOK', ['error', 'warn'], 'line');

//Send log by using console only for [error/warn]

console.log('Start slacking...');
console.error('Error!', new Error('Error'));
console.warn('Warning!', new Error('Warning'));
console.info('Done');
```
