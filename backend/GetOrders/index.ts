import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { CarvedRockFitnessApi } from "@carved-rock-fitness/shared";

const orders: CarvedRockFitnessApi.Order[] = [
  {
    id: 1001,
    orderedAt: "2020-05-26T09:00:00-0500",
    status: CarvedRockFitnessApi.OrderStatus.Pending,
    orderItems: [
      {
        productId: 900,
        productName: "XtraTuff Men's Hiking Books",
        price: 35,
        qty: 1,
        image: "",
      },
      {
        productId: 901,
        productName: "Backpacker's Guide to Colorado Hiking Trails",
        price: 21,
        qty: 1,
        image: "",
      },
    ],
    total: 56,
    subTotal: 52,
    tax: 4,
  },
];

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("GetOrders executed");

  context.res = {
    body: orders,
  };
};

export default httpTrigger;
