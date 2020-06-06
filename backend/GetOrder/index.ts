import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { orders } from "../data";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const orderId = context.bindingData.id;

  context.log("GetOrder executed for order", orderId);

  if (!orderId) {
    context.res = {
      status: 400,
      body: "Missing order ID",
    };
  } else {
    const found = orders.find((o) => o.id === orderId);
    context.res = {
      statis: found ? 200 : 404,
      body: orders.find((o) => o.id === orderId),
    };
  }
};

export default httpTrigger;
