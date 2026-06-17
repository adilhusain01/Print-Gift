import { OrderStatus } from "@/components/order-status";
import { getOrders } from "@/lib/data";
import { formatPrice } from "@/lib/format";

export default async function OrdersPage() {
  const orders = await getOrders();
  return (
    <>
      <div>
        <h1 className="mt-4 font-heading text-4xl tracking-[-0.04em] sm:text-5xl">
          Orders
        </h1>
        <p className="mt-2 text-muted-foreground">
          Review customer details and move work through the queue.
        </p>
      </div>
      <div className="mt-8 grid gap-4">
        {orders.map((order) => (
          <article
            key={order.orderNumber}
            className="surface min-w-0 p-5 sm:p-6"
          >
            <div className="grid gap-4 sm:flex sm:flex-wrap sm:items-start sm:justify-between">
              <div className="min-w-0">
                <h2 className="break-words font-heading text-2xl">
                  {order.orderNumber}
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  {new Date(order.createdAt).toLocaleString("en-IN")}
                </p>
              </div>
              <OrderStatus
                orderNumber={order.orderNumber}
                status={order.status}
              />
            </div>
            <div className="mt-5 grid min-w-0 gap-6 border-t border-border pt-5 md:grid-cols-3">
              <div className="min-w-0">
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Customer
                </p>
                <p className="mt-3 break-words font-semibold">
                  {order.customer.name}
                </p>
                <p className="mt-1 break-all text-sm">{order.customer.phone}</p>
                <p className="mt-2 break-words text-sm leading-6 text-muted-foreground">
                  {order.customer.address}, {order.customer.city} -{" "}
                  {order.customer.postalCode}
                </p>
              </div>
              <div className="min-w-0">
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Items
                </p>
                <div className="mt-3 grid gap-2 text-sm">
                  {order.items.map((item) => (
                    <p key={item.slug} className="break-words">
                      {item.quantity} × {item.name}
                    </p>
                  ))}
                </div>
              </div>
              <div className="min-w-0">
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Total
                </p>
                <p className="mt-3 break-words font-heading text-3xl">
                  {formatPrice(order.total)}
                </p>
                {order.customer.notes ? (
                  <p className="mt-3 break-words text-sm leading-6 text-muted-foreground">
                    Notes: {order.customer.notes}
                  </p>
                ) : null}
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
