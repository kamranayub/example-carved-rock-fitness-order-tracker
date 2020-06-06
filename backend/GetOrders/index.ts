import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { orders } from "../data";

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
