class EventCenter {
    constructor() {
        this.events = [];
    }
    get length() {
        return this.events.length;
    }
    listen(event) {
        this.events.push(event);
        return () => {
            this.events = this.events.filter(e => e !== event);
        };
    }
    call(arg) {
        this.events.forEach(fn => fn && fn(arg));
    }
}
export default EventCenter;
