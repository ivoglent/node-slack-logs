import {SlackLogger} from "./index";

let slackLogger = new SlackLogger('Testing');
slackLogger.register('https://hooks.slack.com/services/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', ['error', 'warn'], 'line');

setTimeout(function () {
    console.log('Start slacking...');
    console.error('Error!', new Error('Error'));
    console.warn('Warning!', new Error('Warning'));
    console.info('Done');
}, 3000);
