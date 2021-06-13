export enum OrderStatus {
  // When the order has been created, but the
  // ticket it is trying to order has not been reserved yet.
  Created = "created",

  // The ticket the order is trying to reserve has already
  // been reserved, the user was cancelled the order, the order
  // expired before payment.
  Cancelled = "cancelled",

  // The order has successfully reserved the ticket.
  AwaitingPayment = "awaiting:payment",

  // Reserved and payed for.
  Complete = "complete"
}