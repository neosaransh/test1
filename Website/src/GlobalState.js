class GlobalState {
    getValue(key) {
        return JSON.parse(localStorage.getItem(key)) || undefined;
    }

    setValue(key, value) {
        if (value === undefined) {
            localStorage.removeItem(key);
        } else {
            localStorage.setItem(key, JSON.stringify(value));
        }
        GlobalState._handlers.forEach(entry => {
            if (!entry.key) {
                entry.handler(key, value);
            } else if (entry.key == key) {
                entry.handler(value);
            }
        });
    }

    clear() {
        localStorage.clear();
        GlobalState._handlers.forEach(entry => {
            entry.handler();
        });
    }

    subscribe(handler, key) {
        GlobalState._handlers.push({key, handler});
    }

    notifyAll() {
        GlobalState._handlers.forEach(entry => {
            if (!entry.key) {
                for (var i = 0; i < localStorage.length; i++) {
                    var key = localStorage.key(i);
                    entry.handler(key, this.getValue(key));
                }
            } else {
                entry.handler(this.getValue(entry.key));
            }
        });
    }
}

GlobalState._handlers = [];

export default GlobalState;
