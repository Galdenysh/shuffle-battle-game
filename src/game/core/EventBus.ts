import { Events } from 'phaser';

class ReadyEventEmitter extends Events.EventEmitter {
  private isReady: boolean = false;
  private pendingEvents: Array<[string | symbol, any[]]> = [];

  constructor() {
    super();
  }

  public ready() {
    if (!this.isReady) {
      this.isReady = true;

      if (this.pendingEvents.length) {
        console.log(
          '✅ EventBus готов. 📨 Количество обрабатываемых событий из очереди:',
          this.pendingEvents.length
        );
      } else {
        console.log('✅ EventBus готов');
      }

      this.pendingEvents.forEach(([event, args]) => super.emit(event, ...args));
      this.pendingEvents.length = 0;
    }
  }

  public override emit(event: string | symbol, ...args: any[]): boolean {
    if (!this.isReady) {
      this.pendingEvents.push([event, args]);

      console.log(`📥 Событие ${event.toString()} добавлено в очередь`);

      return true;
    }
    return super.emit(event, ...args);
  }

  public getStatus() {
    return {
      isReady: this.isReady,
      pendingEvents: this.pendingEvents.length,
    };
  }
}

export const EventBus = new ReadyEventEmitter();
