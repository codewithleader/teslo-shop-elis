export interface DashboardSummaryResponse {
  paidOrders:              number;
  lowInventory:            number;
  notPaidOrders:           number;
  numberOfOrders:          number;
  numberOfClients:         number;
  numberOfProducts:        number;
  productsWithNoInventory: number;
}
