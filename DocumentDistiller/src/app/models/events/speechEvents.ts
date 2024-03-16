export class BaseDto<T> {
  eventType: string;

  constructor(init?: Partial<T>) {
    this.eventType = this.constructor.name;
    Object.assign(this, init);
  }
}

export class ServerWillSendSpeech extends BaseDto<ServerWillSendSpeech> {
  type?: string;
  length?: number;
  data?: string;
}

export class ClientWantsTextToSpeech extends BaseDto<ClientWantsTextToSpeech> {
  text?: string;
}
