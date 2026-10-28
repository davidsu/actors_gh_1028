import { Actor } from 'base44:runtime/actors';

export default class Counter extends Actor {
  count = 0;

  async handleStart() {
    this.count = (await this.storage.get('count')) || 0;
  }

  async handleConnect(conn) {
    conn.send({ type: 'count', count: this.count });
  }

  async handleMessage(conn, msg) {
    if (typeof msg !== 'object' || msg === null) return;
    if (msg.type === 'increment') {
      this.count += 1;
      await this.storage.put('count', this.count);
      this.broadcast({ type: 'count', count: this.count });
    }
  }
}