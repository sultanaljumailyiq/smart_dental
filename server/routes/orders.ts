import { Request, Response } from "express";
import { db, orders, orderItems, cart, products, suppliers, commissionSettings } from "../storage";
import { eq, desc, and, inArray } from "drizzle-orm";

// Get orders for a user
export async function getOrders(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    const { status } = req.query;

    let query = db.query.orders.findMany({
      where: eq(orders.customerId, Number(userId)),
      with: {
        items: {
          with: {
            product: true,
            supplier: true,
          },
        },
      },
      orderBy: desc(orders.createdAt),
    });

    const userOrders = await query;

    res.json({ orders: userOrders, count: userOrders.length });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
}

// Get orders for a supplier
export async function getSupplierOrders(req: Request, res: Response) {
  try {
    const { supplierId } = req.params;
    const { status } = req.query;

    // Get all order items for this supplier
    const items = await db.query.orderItems.findMany({
      where: eq(orderItems.supplierId, Number(supplierId)),
      with: {
        order: {
          with: {
            customer: true,
          },
        },
        product: true,
      },
      orderBy: desc(orderItems.createdAt),
    });

    // Group by order
    const orderMap = new Map();
    items.forEach(item => {
      if (!orderMap.has(item.orderId)) {
        orderMap.set(item.orderId, {
          ...item.order,
          items: [],
        });
      }
      orderMap.get(item.orderId).items.push(item);
    });

    const supplierOrders = Array.from(orderMap.values());

    res.json({ orders: supplierOrders, count: supplierOrders.length });
  } catch (error) {
    console.error("Error fetching supplier orders:", error);
    res.status(500).json({ error: "Failed to fetch supplier orders" });
  }
}

// Get order by ID
export async function getOrderById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const order = await db.query.orders.findFirst({
      where: eq(orders.id, Number(id)),
      with: {
        items: {
          with: {
            product: true,
            supplier: true,
          },
        },
        customer: true,
      },
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ error: "Failed to fetch order" });
  }
}

// Create order from cart
export async function createOrder(req: Request, res: Response) {
  try {
    const { userId, shippingAddress, billingAddress, notes } = req.body;

    // Get cart items
    const cartItems = await db.query.cart.findMany({
      where: eq(cart.userId, Number(userId)),
      with: {
        product: {
          with: {
            supplier: true,
          },
        },
      },
    });

    if (cartItems.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => {
      const price = parseFloat(item.product.price);
      return sum + (price * item.quantity);
    }, 0);

    const shippingCost = 5000; // Fixed shipping cost in IQD
    const total = subtotal + shippingCost;

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create order
    const [newOrder] = await db.insert(orders)
      .values({
        orderNumber,
        customerId: Number(userId),
        status: 'pending',
        paymentStatus: 'pending',
        subtotal: subtotal.toString(),
        shippingCost: shippingCost.toString(),
        tax: '0',
        discount: '0',
        total: total.toString(),
        shippingAddress,
        billingAddress: billingAddress || shippingAddress,
        notes,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    // Get commission settings for all suppliers
    const supplierIds = [...new Set(cartItems.map(item => item.product.supplierId))];
    
    const suppliersData = await db
      .select({
        id: suppliers.id,
        unionEndorsed: suppliers.unionEndorsed,
      })
      .from(suppliers)
      .where(inArray(suppliers.id, supplierIds));
    
    const commissionsData = await db
      .select()
      .from(commissionSettings)
      .where(inArray(commissionSettings.supplierId, supplierIds));
    
    const supplierMap = new Map(suppliersData.map(s => [s.id, s]));
    const commissionMap = new Map(commissionsData.map(c => [c.supplierId, c]));

    // Create order items with correct commission calculation
    const orderItemsData = cartItems.map(item => {
      const supplier = supplierMap.get(item.product.supplierId);
      const commissionSetting = commissionMap.get(item.product.supplierId);
      
      const subtotalValue = parseFloat(item.product.price) * item.quantity;
      let commissionRate = "10.00";
      let commissionAmount = 0;
      
      if (supplier?.unionEndorsed) {
        commissionRate = "0.00";
        commissionAmount = 0;
      } else if (commissionSetting) {
        commissionRate = commissionSetting.commissionRate;
        commissionAmount = (subtotalValue * parseFloat(commissionRate)) / 100;
      } else {
        commissionAmount = (subtotalValue * 10) / 100;
      }
      
      return {
        orderId: newOrder.id,
        productId: item.productId,
        supplierId: item.product.supplierId,
        productName: item.product.name,
        productArabicName: item.product.arabicName,
        productImage: item.product.image,
        sku: item.product.sku,
        price: item.product.price,
        quantity: item.quantity,
        subtotal: subtotalValue.toString(),
        commissionRate: commissionRate,
        commissionAmount: commissionAmount.toString(),
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });

    await db.insert(orderItems).values(orderItemsData);

    // Clear cart
    await db.delete(cart).where(eq(cart.userId, Number(userId)));

    // Get complete order with items
    const completeOrder = await db.query.orders.findFirst({
      where: eq(orders.id, newOrder.id),
      with: {
        items: {
          with: {
            product: true,
            supplier: true,
          },
        },
      },
    });

    res.status(201).json(completeOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
}

// Update order status
export async function updateOrderStatus(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { status, trackingNumber } = req.body;

    const updateData: any = {
      status,
      updatedAt: new Date(),
    };

    if (trackingNumber) {
      updateData.trackingNumber = trackingNumber;
    }

    if (status === 'delivered') {
      updateData.deliveredAt = new Date();
    } else if (status === 'cancelled') {
      updateData.cancelledAt = new Date();
    }

    const [updatedOrder] = await db.update(orders)
      .set(updateData)
      .where(eq(orders.id, Number(id)))
      .returning();

    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(updatedOrder);
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ error: "Failed to update order" });
  }
}

// Update order item status
export async function updateOrderItemStatus(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const [updated] = await db.update(orderItems)
      .set({
        status,
        updatedAt: new Date(),
      })
      .where(eq(orderItems.id, Number(id)))
      .returning();

    if (!updated) {
      return res.status(404).json({ error: "Order item not found" });
    }

    res.json(updated);
  } catch (error) {
    console.error("Error updating order item:", error);
    res.status(500).json({ error: "Failed to update order item" });
  }
}
