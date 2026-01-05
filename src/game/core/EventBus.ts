import { GameEvent } from '@/types/events';
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

class TypedEventEmitter extends ReadyEventEmitter {
  constructor() {
    super();
  }

  /**
   * Типизированная отправка события
   * @param eventType Тип события из EmitEvents.
   * @param eventData Данные из GameEvent.
   * @param timestamp Временная метка.
   */
  public emit<T extends GameEvent['type']>(
    eventType: T,
    eventData: Extract<GameEvent, { type: T }>['data'],
    timestamp?: Extract<GameEvent, { type: T }>['timestamp']
  ): boolean {
    return super.emit(eventType, eventData, timestamp);
  }

  /**
   * Типизированная подписка на событие
   * @param eventType Тип события из EmitEvents.
   * @param handler Обработчик.
   * @param context Контекст, в котором будет вызываться обработчик.
   */
  public on<T extends GameEvent['type']>(
    eventType: T,
    handler: (
      eventData: Extract<GameEvent, { type: T }>['data'],
      timestamp?: Extract<GameEvent, { type: T }>['timestamp']
    ) => void,
    context?: any
  ): this {
    return super.on(eventType, handler, context);
  }

  /**
   * Типизированная подписка на событие (один раз)
   * @param eventType Тип события из EmitEvents.
   * @param handler Обработчик.
   * @param context Контекст, в котором будет вызываться обработчик.
   */
  public once<T extends GameEvent['type']>(
    eventType: T,
    handler: (
      eventData: Extract<GameEvent, { type: T }>['data'],
      timestamp?: Extract<GameEvent, { type: T }>['timestamp']
    ) => void,
    context?: any
  ): this {
    return super.once(eventType, handler, context);
  }

  /**
   * Типизированная отписка от события
   * @param eventType Тип события из EmitEvents.
   * @param handler Удаляет слушатели с этим обработчиком.
   * @param context Удаляет слушатели с этим контекстом.
   * @param once Удаляет только одноразовые слушатели.
   */
  public off<T extends GameEvent['type']>(
    eventType: T,
    handler: (
      eventData: Extract<GameEvent, { type: T }>['data'],
      timestamp?: Extract<GameEvent, { type: T }>['timestamp']
    ) => void,
    context?: any,
    once?: boolean
  ): this {
    return super.off(eventType, handler, context, once);
  }
}

export const EventBus = new TypedEventEmitter();
