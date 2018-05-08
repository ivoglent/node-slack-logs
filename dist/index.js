"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { IncomingWebhook } = require('@slack/client');
class SlackLogger {
    /**
     *
     * @param {string} appName
     */
    constructor(appName) {
        /**
         * App name
         * @type {string}
         * @private
         */
        this._appName = 'App';
        /**
         * Default type of console log
         * @type {string[]}
         * @private
         */
        this._types = ['error', 'warn'];
        /**
         * Slack channel webhook
         * @type {null}
         * @private
         */
        this._hookUrl = null;
        /**
         * Just backup of default console
         * @type {Console}
         * @private
         */
        this._console = {};
        /**
         * Slack instance
         * @type {null}
         * @private
         */
        this._slack = null;
        /**
         * Format of message. Default is JSON
         * @type {string}
         * @private
         */
        this._format = 'json'; //line
        this._appName = appName;
        for (let k in console) {
            this._console[k] = console[k];
        }
    }
    /**
     *
     * @param hookUrl
     * @param {any[]} types
     * @param format
     */
    register(hookUrl, types = [], format) {
        if (format) {
            this._format = format;
        }
        if (hookUrl) {
            this._hookUrl = hookUrl;
            if (types.length > 0) {
                this._types = types;
            }
            this._slack = new IncomingWebhook(this._hookUrl);
            this._registerPrototypes();
        }
    }
    /**
     * Override some method of default console object
     * @private
     */
    _registerPrototypes() {
        let self = this;
        this._types.forEach((type) => {
            if (console[type]) {
                console[type] = self[type].bind(this);
            }
        });
    }
    /**
     *
     * @param message
     * @param params
     * @returns {string}
     * @private
     */
    _serilizeMessage(message, params = []) {
        let data = [];
        data.push(message);
        params.forEach(function (p) {
            data.push(p);
        });
        if (this._format === 'json') {
            return JSON.stringify(data);
        }
        let lines = [];
        data.forEach(function (d) {
            if (typeof (d) === 'object') {
                if (Array.isArray(d)) {
                    d.forEach(function (_d) {
                        if (typeof (_d) === 'object') {
                            _d = JSON.stringify(_d);
                        }
                        lines.push('\t' + _d + '\n');
                    });
                }
                else {
                    d = JSON.stringify(d);
                    lines.push(d);
                }
            }
            else {
                lines.push(d);
            }
        });
        return lines.join('\n');
    }
    /**
     *
     * @param message
     * @private
     */
    _sendToSlack(message, type) {
        this._slack.send(`*[${new Date().toISOString()}] : Log [${type}] from : ${this._appName}` + ':*\n--------------------------------------------\n' + message, function (err, res) {
            //Done
        });
    }
    /**
     *
     * @param value
     * @param {string} message
     * @param optionalParams
     */
    assert(value, message, ...optionalParams) {
    }
    ;
    /**
     *
     * @param obj
     * @param {NodeJS.InspectOptions} options
     */
    dir(obj, options) {
    }
    /**
     *
     * @param message
     * @param optionalParams
     */
    debug(message, ...optionalParams) {
        this._sendToSlack(this._serilizeMessage(message, optionalParams), 'DEBUG');
        this._console.debug(message, optionalParams);
    }
    /**
     *
     * @param message
     * @param optionalParams
     */
    error(message, ...optionalParams) {
        this._sendToSlack(this._serilizeMessage(message, optionalParams), 'ERROR');
        this._console.error(message, optionalParams);
    }
    /**
     *
     * @param message
     * @param optionalParams
     */
    info(message, ...optionalParams) {
        this._sendToSlack(this._serilizeMessage(message, optionalParams), 'INFO');
        this._console.info(message, optionalParams);
    }
    /**
     *
     * @param message
     * @param optionalParams
     */
    log(message, ...optionalParams) {
        this._sendToSlack(this._serilizeMessage(message, optionalParams), 'LOG');
        this._console.log(message, optionalParams);
    }
    /**
     *
     * @param {string} label
     */
    time(label) {
        this._sendToSlack(label, 'TIME');
    }
    /**
     *
     * @param {string} label
     */
    timeEnd(label) {
        this._sendToSlack(label, 'TIME_END');
    }
    /**
     *
     * @param message
     * @param optionalParams
     */
    trace(message, ...optionalParams) {
        this._sendToSlack(this._serilizeMessage(message, optionalParams), 'TRACE');
        this._console.trace(message, optionalParams);
    }
    /**
     *
     * @param message
     * @param optionalParams
     */
    warn(message, ...optionalParams) {
        this._sendToSlack(this._serilizeMessage(message, optionalParams), 'WARN');
        this._console.warn(message, optionalParams);
    }
}
exports.SlackLogger = SlackLogger;
//# sourceMappingURL=index.js.map