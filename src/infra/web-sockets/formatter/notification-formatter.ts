export class NotificationFormatter {
  static notifyPaymentPending(titlesOrderList: string[]) {
    return {
      title: "Pedido realizado a espera de um pagamento.",
      content: `O pedido: ${titlesOrderList.join(", ")}, esta aguardando o pagamento.`,
    };
  }

  static notifyPaymentSuccess(titlesOrderList: string[]) {
    return {
      title: "Pagamento recebido!",
      content: `Pagamento realizado com sucesso para o pedido: ${titlesOrderList.join(", ")}.`,
    };
  }
}
