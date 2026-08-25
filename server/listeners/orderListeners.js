import { Product } from "../models/product.model.js";
import { Order } from "../models/order.model.js";

export const initOrderChangeStream = () => {
  const changeStream = Order.watch(
    [
      {
        $match: { operationType: { $in: ["delete", "replace", "update"] } },
      },
    ],
    { fullDocumentBeforeChange: "whenAvailable" },
  );

  changeStream.on("change", async (change) => {
    try {
      if (change.operationType === "delete") {
        const deletedOrder = change.fullDocumentBeforeChange;

        if (deletedOrder && deletedOrder.paymentStatus === "pending") {
          await restoreInventory(deletedOrder.items, deletedOrder._id);
        }
      }

      if (change.operationType === "update") {
        const updatedFields = change.updateDescription?.updatedFields || {};

        if (
          updatedFields.status === "cancelled" ||
          updatedFields.paymentStatus === "failed"
        ) {
          const order = await Order.findById(change.documentKey._id);

          if (order && order.stockRestored !== true) {
            await restoreInventory(order.items, order._id);

            order.stockRestored = true;
            await order.save();
          }
        }
      }
    } catch (error) {
      console.error("CRITICAL ERROR inside Order Change Stream Worker:", error);
    }
  });

  changeStream.on("error", (error) => {
    console.error("Order Change Stream Listener Error:", error);
  });

  console.log("System Change Streams: Watching Order expirations active.");
};

async function restoreInventory(items, orderId) {
  if (!items || items.length === 0) return;

  const bulkOps = items.map((item) => ({
    updateOne: {
      filter: { _id: item.productId },
      update: { $inc: { stock: item.quantity } },
    },
  }));

  await Product.bulkWrite(bulkOps);
  console.log(`📦 Inventory successfully restored for Order ID: ${orderId}`);
}
