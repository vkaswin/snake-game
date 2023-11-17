export default class Emitter {
  private events = new Map<string, Function[]>();

  addEventListener(event: string, cb: Function) {
    let eventObj = this.events.get(event);
    eventObj ? eventObj.push(cb) : this.events.set(event, [cb]);
  }

  removeAllEventListener(event: string) {
    if (this.events.has(event)) this.events.delete(event);
  }

  removeEventListener(event: string, cb: Function) {
    let callbacks = this.events.get(event);
    if (!callbacks || callbacks.length === 0) return;
    let index = callbacks.findIndex((fn) => fn === cb);
    if (index === -1) return;
    callbacks.splice(index, 1);
  }

  once(event: string, cb: Function) {
    let fn = (...args: any[]) => {
      cb(...args);
      this.removeEventListener(event, fn);
    };
    this.addEventListener(event, fn);
  }

  emit(event: string, ...args: any[]) {
    let callbacks = this.events.get(event);
    if (!callbacks || callbacks.length === 0) return;
    callbacks.forEach((cb) => {
      cb(...args);
    });
  }

  listenerCount(event: string) {
    let callbacks = this.events.get(event);
    return callbacks ? callbacks.length : 0;
  }

  rawListeners(event: string) {
    let callbacks = this.events.get(event);
    return callbacks || null;
  }
}
