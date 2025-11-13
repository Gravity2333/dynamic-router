interface EventCenterType<F extends Function> {
    length: number;
    listen: (e: F) => (() => void);
    call: (arg: any) => void;
}
declare class EventCenter<F extends Function> implements EventCenterType<F> {
    events: F[];
    get length(): number;
    listen(event: F): () => void;
    call(arg: any): void;
}
export default EventCenter;
