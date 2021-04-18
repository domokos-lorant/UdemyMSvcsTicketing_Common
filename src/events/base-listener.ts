import { Message, Stan, SubscriptionOptions } from "node-nats-streaming";
import { Subjects } from "./subjects";

export interface Event {
  subject: Subjects;
  data: unknown;
}

export abstract class Listener<T extends Event> {
  abstract subject: T["subject"];
  abstract queueGroupName: string;
  abstract onMessage(data: T["data"], msg: Message): void;
  private client: Stan;
  protected ackWait = 5 * 1000; // Seconds.

  constructor(client: Stan) {
    this.client = client;
  }

  subscriptionOptions(): SubscriptionOptions {
    return (
      this.client
        .subscriptionOptions()
        // Keep a list of undelivered msgs per durable name.
        .setDeliverAllAvailable()
        // Ensure that the msg is processed by a listener.
        .setManualAckMode(true)
        .setAckWait(this.ackWait)
        // Set the durable name so that the service gets missed msgs.
        .setDurableName(this.queueGroupName)
    );
  }

  listen(): void {
    const subscription = this.client.subscribe(
      this.subject,
      // Set queue group so that msg goes only to one
      // of many and deliver all list is not cleared.
      this.queueGroupName,
      this.subscriptionOptions()
    );

    subscription.on("message", (msg: Message) => {
      console.log(`Message received ${this.subject} / ${this.queueGroupName}`);

      const parsedData = this.parseMessage(msg);
      this.onMessage(parsedData, msg);
    });
  }

  parseMessage(msg: Message): unknown {
    const data = msg.getData();
    return typeof data === "string"
      ? JSON.parse(data)
      : JSON.parse(data.toString("utf8"));
  }
}
