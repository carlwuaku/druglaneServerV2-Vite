import { EventEmitter } from "events";

class ServerEvents extends EventEmitter {
    constructor() {
        super();
    }


}

const serverEventEmitter = new ServerEvents();
export default serverEventEmitter;