export const ModeOfSale = {
  SELLS_ONLY_IN_THE_REGION: "SELLS_ONLY_IN_THE_REGION",
  ONLINE_STORE: "ONLINE_STORE",
} as const;

export type ModeOfSale = (typeof ModeOfSale)[keyof typeof ModeOfSale];
