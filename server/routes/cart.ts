import { Request, Response } from "express";
import { db, cart, products } from "../storage";
import { eq, and } from "drizzle-orm";

// Get cart items for a user
export async function getCart(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    
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

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => {
      const price = parseFloat(item.product.price);
      return sum + (price * item.quantity);
    }, 0);

    res.json({
      items: cartItems,
      subtotal: subtotal.toFixed(2),
      itemCount: cartItems.length,
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
}

// Add item to cart
export async function addToCart(req: Request, res: Response) {
  try {
    const { userId, productId, quantity = 1 } = req.body;

    // Check if item already exists in cart
    const existingItem = await db.query.cart.findFirst({
      where: and(
        eq(cart.userId, Number(userId)),
        eq(cart.productId, Number(productId))
      ),
    });

    if (existingItem) {
      // Update quantity
      const [updated] = await db.update(cart)
        .set({
          quantity: existingItem.quantity + Number(quantity),
          updatedAt: new Date(),
        })
        .where(eq(cart.id, existingItem.id))
        .returning();

      return res.json(updated);
    }

    // Add new item
    const [newItem] = await db.insert(cart)
      .values({
        userId: Number(userId),
        productId: Number(productId),
        quantity: Number(quantity),
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    res.status(201).json(newItem);
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ error: "Failed to add to cart" });
  }
}

// Update cart item quantity
export async function updateCartItem(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const [updated] = await db.update(cart)
      .set({
        quantity: Number(quantity),
        updatedAt: new Date(),
      })
      .where(eq(cart.id, Number(id)))
      .returning();

    if (!updated) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    res.json(updated);
  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(500).json({ error: "Failed to update cart item" });
  }
}

// Remove item from cart
export async function removeFromCart(req: Request, res: Response) {
  try {
    const { id } = req.params;

    await db.delete(cart).where(eq(cart.id, Number(id)));

    res.json({ message: "Item removed from cart" });
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({ error: "Failed to remove from cart" });
  }
}

// Clear cart
export async function clearCart(req: Request, res: Response) {
  try {
    const { userId } = req.params;

    await db.delete(cart).where(eq(cart.userId, Number(userId)));

    res.json({ message: "Cart cleared" });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ error: "Failed to clear cart" });
  }
}
