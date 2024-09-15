export class NotificationFormatter {
  static formatOrderNotification(titlesOrderList: string[]): {
    title: string;
    content: string;
  } {
    return {
      title: "Pedido realizado a espera de um pagamento.",
      content: `O pedido: ${titlesOrderList.join(", ")}, esta aguardando o pagamento.`,
    };
  }
}
