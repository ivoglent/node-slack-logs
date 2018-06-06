const { IncomingWebhook } = require('@slack/client');
export class SlackLogger {

    /**
     * App name
     * @type {string}
     * @private
     */
    _appName : string = 'App';
    /**
     * Default type of console log
     * @type {string[]}
     * @private
     */
    _types = ['error', 'warn'];
    /**
     * Slack channel webhook
     * @type {null}
     * @private
     */
    _hookUrl = null;
    /**
     * Just backup of default console
     * @type {Console}
     * @private
     */
    _console : any = {};
    /**
     * Slack instance
     * @type {null}
     * @private
     */
    _slack: any = null;
    /**
     * Format of message. Default is JSON
     * @type {string}
     * @private
     */
    _format = 'json'; //line

    /**
     *
     * @param {string} appName
     */
    constructor(appName : string) {
        this._appName = appName;
        for(let k in console) {
            this._console[k] = console[k];
        }
    }

    /**
    *
    * Get local IP address
    **/
    private getIpAddress() {
        var
            // Local ip address that we're trying to calculate
            address
            // Provides a few basic operating-system related utility functions (built-in)
            ,os = require('os')
            // Network interfaces
            ,ifaces = os.networkInterfaces();


        // Iterate over interfaces ...
        for (var dev in ifaces) {
            var iface = ifaces[dev].filter(function(details) {
                return details.family === 'IPv4' && details.internal === false;
            });

            if(iface.length > 0) address = iface[0].address;
        }
        return address;
    }

    /**
     *
     * @param hookUrl
     * @param {any[]} types
     * @param format
     */
    public register(hookUrl, types = [], format) {
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
        })
    }

    /**
     *
     * @param message
     * @param params
     * @returns {string}
     * @private
     */
    _serilizeMessage(message, params : any = []): string {
        let data = [];
        data.push(message);
        params.forEach(function (p) {
            data.push(p)
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
                } else {
                    d = JSON.stringify(d);
                    lines.push(d);
                }
            } else {
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
        let ip = this.getIpAddress();
        this._slack.send(`*[${new Date().toISOString()}] : Log [${type}] from : ${this._appName} [${ip}]` + ':*\n--------------------------------------------\n' + message, function(err, res) {
            //Done
        });

    }

    /**
     *
     * @param value
     * @param {string} message
     * @param optionalParams
     */
    assert(value: any, message?: string, ...optionalParams: any[]): void {

    };

    /**
     *
     * @param obj
     * @param {NodeJS.InspectOptions} options
     */
    dir(obj: any, options?: NodeJS.InspectOptions): void {

    }

    /**
     *
     * @param message
     * @param optionalParams
     */
    debug(message?: any, ...optionalParams: any[]): void {
        this._sendToSlack(this._serilizeMessage(message, optionalParams), 'DEBUG');
        this._console.debug(message, optionalParams);
    }

    /**
     *
     * @param message
     * @param optionalParams
     */
    error(message?: any, ...optionalParams: any[]): void {
        this._sendToSlack(this._serilizeMessage(message, optionalParams), 'ERROR');
        this._console.error(message, optionalParams);
    }

    /**
     *
     * @param message
     * @param optionalParams
     */
    info(message?: any, ...optionalParams: any[]): void {
        this._sendToSlack(this._serilizeMessage(message, optionalParams), 'INFO');
        this._console.info(message, optionalParams);
    }

    /**
     *
     * @param message
     * @param optionalParams
     */
    log(message?: any, ...optionalParams: any[]): void {
        this._sendToSlack(this._serilizeMessage(message, optionalParams), 'LOG');
        this._console.log(message, optionalParams);
    }

    /**
     *
     * @param {string} label
     */
    time(label: string): void {
        this._sendToSlack(label, 'TIME');
    }

    /**
     *
     * @param {string} label
     */
    timeEnd(label: string): void {
        this._sendToSlack(label, 'TIME_END');
    }

    /**
     *
     * @param message
     * @param optionalParams
     */
    trace(message?: any, ...optionalParams: any[]): void {
        this._sendToSlack(this._serilizeMessage(message, optionalParams), 'TRACE');
        this._console.trace(message, optionalParams);
    }

    /**
     *
     * @param message
     * @param optionalParams
     */
    warn(message?: any, ...optionalParams: any[]): void {
        this._sendToSlack(this._serilizeMessage(message, optionalParams), 'WARN');
        this._console.warn(message, optionalParams);
    }


}
