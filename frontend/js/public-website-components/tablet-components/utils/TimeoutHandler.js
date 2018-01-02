/* @flow */

type TimeoutType = {
    [string]: {
        time: number,
        autoClearTimeout?: () => null,
        timeout: number
    }
};

class TimeoutHandlerImpl {
    _timeouts: TimeoutType = {};

    createTimeout(key: string, interval: number, f: () => null) {
        this.clearTimeout(key);
        this._timeouts[key] = {
            time: (new Date).getTime(),
            timeout: interval,
        };
        this._timeouts[key].autoClearTimeout = f;
    }

    clearTimeout(key: string) {
        if (key in this._timeouts) {
            clearTimeout(this._timeouts[key]);
            delete this._timeouts[key];
        }
    }

    getTimeout(key: string) : ?TimeoutType {
        return this._timeouts[key];
    }
};

module.exports = {
    TimeoutHandler: new TimeoutHandlerImpl()
};
