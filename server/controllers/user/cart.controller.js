import mongoose from "mongoose";
import { Cart } from "../../models/cart.model.js";
import { Product } from "../../models/product.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { Order } from "../../models/order.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const userId = req.user?._id;
  const guestSessionId = req.headers["x-guest-session-id"];

  if (!req.user && !guestSessionId) {
    return res.status(400).json({
      success: false,
      message: "Session ID missing for guest cart.",
    });
  }

  if (!productId) {
    // validate required fields:
    throw new ApiError(400, "Product Id is required");
  }

  // validate quantity :
  const qty = parseInt(quantity);
  if (isNaN(qty) || qty < 1) {
    throw new ApiError(400, "Quantity must be a positive number");
  }

  if (qty > 100) {
    throw new ApiError(400, "Quantity cannot exceed 100");
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  if (!product.isActive) {
    throw new ApiError(400, "This product currently unavailable");
  }

  // check stock availability :
  const stockQuantity = product?.stock;

  if (stockQuantity < qty) {
    throw new ApiError(400, `Only ${stockQuantity} items available in stock`);
  }

  // get current price
  const currentPrice =
    product?.discountPrice && product?.discountPrice < product?.price
      ? product?.discountPrice
      : product?.price;

  const originalPrice = product?.price;

  // calculate discount percentage :
  const discount =
    originalPrice > currentPrice
      ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
      : 0;
  // product snapshot for cart display incase product details change :
  const productSnapshot = {
    name: product?.name,
    image: product?.images[0]?.url || "",
    sku: product?.sku || "",
  };

  const cartQuery = userId
    ? { userId, status: "active" }
    : { sessionId: guestSessionId, status: "active" };

  // find or create cart for user:
  let cart = await Cart.findOne(cartQuery);

  // create new cart :
  if (!cart) {
    cart = new Cart({
      ...(userId ? { userId } : { sessionId: guestSessionId }),
      status: "active",
      items: [],
    });
  }

  const existingItemIndex = cart?.items.findIndex(
    (item) => item.productId.toString() === productId.toString(),
  );

  if (existingItemIndex > -1) {
    const newQuantity = cart.items[existingItemIndex].quantity + qty;
    if (newQuantity > stockQuantity) {
      throw new ApiError(
        400,
        `Cannot add ${qty} more items. You already have ${cart.items[existingItemIndex].quantity} in cart and only ${stockQuantity} available in stock`,
      );
    }
    if (newQuantity > 100) {
      throw new ApiError(400, "Total quantity cannot exceed 100");
    }

    cart.items[existingItemIndex].quantity = newQuantity;
    cart.items[existingItemIndex].price = currentPrice;
    cart.items[existingItemIndex].originalPrice = originalPrice;
    cart.items[existingItemIndex].discount = discount;
    cart.items[existingItemIndex].productSnapshot = productSnapshot;
  } else {
    // add new item to cart
    cart.items.push({
      productId,
      quantity: qty,
      price: currentPrice,
      originalPrice,
      discount,
      productSnapshot,
      addedAt: new Date(),
    });
  }

  // update last activity :
  cart.lastActivityAt = new Date();

  // save cart :
  await cart.save();

  // populate product detail for response :
  await cart.populate({
    path: "items.productId",
    select: "name images price discountPrice stock quantity isActive slug",
  });

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      data: {
        cart: formatCartResponse(cart),
        addedItem: {
          productId,
          name: product?.name,
          quantity: qty,
          price: currentPrice,
          originalPrice,
          discount,
          image: product?.images[0],
        },
      },
      message:
        existingItemIndex > -1
          ? "Cart updated successfully"
          : "Item added to cart successfully",
    }),
  );
});

export const getCart = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const guestSessionId = req.headers["x-guest-session-id"];

  if (!userId && !guestSessionId) {
    return res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        data: {
          cart: {
            _id: null,
            items: [],
            totalItems: 0,
            uniqueItems: 0,
            subtotal: 0,
            discount: 0,
            total: 0,
            couponCode: null,
            currency: "USD",
            isEmpty: true,
          },
        },
        message: "Cart is empty",
      }),
    );
  }

  // dynamic cart query for user vs guest session :
  const cartQuery = userId
    ? { userId, status: "active" }
    : { sessionId: guestSessionId, status: "active" };

  let cart = await Cart.findOne(cartQuery).populate({
    path: "items.productId",
    select: "name images price stock isActive discountPrice",
  });

  if (!cart) {
    // Return empty cart structure
    return res.status(200).json(
      new ApiResponse({
        data: {
          cart: {
            _id: null,
            items: [],
            totalItems: 0,
            uniqueItems: 0,
            subtotal: 0,
            discount: 0,
            total: 0,
            couponCode: null,
            currency: "USD",
            isEmpty: true,
          },
        },
        message: "Cart is empty",
      }),
    );
  }

  // validate cart items (remove items with deleted/inactive products)
  const validItems = [];
  const invalidItems = [];

  for (const item of cart.items) {
    if (!item.productId || !item.productId.isActive) {
      invalidItems.push(item);
    } else {
      // update price if changed
      const product = item.productId;
      const currentPrice =
        product.discountPrice && product.discountPrice < product.price
          ? product.discountPrice
          : product.price;

      if (item.price !== currentPrice) {
        item.price = currentPrice;
        item.originalPrice = product.price;
      }

      validItems.push(item);
    }
  }

  // if invalid items found, update cart
  if (invalidItems.length > 0) {
    cart.items = validItems;
    await cart.save();

    // re-populate after save
    await cart.populate({
      path: "items.productId",
      select: "name images price discountPrice stock isActive sizes colors",
    });
  }

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      data: {
        cart: formatCartResponse(cart),
        invalidItemsRemoved: invalidItems.length,
      },
      message: "Cart data fetched successfully",
    }),
  );
});

export const clearCart = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const guestSessionId = req.headers["x-guest-session-id"];

  if (!userId && !guestSessionId) {
    throw new ApiError(
      400,
      "Authentication token or Guest Session ID is required to clear cart.",
    );
  }

  const cartQuery = userId
    ? { userId, status: "active" }
    : { sessionId: guestSessionId };

  const cart = await Cart.findOne(cartQuery);

  if (!cart) {
    return res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        message: "Cart is already empty",
        data: {
          cart: {
            _id: null,
            items: [],
            totalItems: 0,
            uniqueItems: 0,
            subtotal: 0,
            discount: 0,
            total: 0,
            couponCode: null,
            currency: "INR",
            isEmpty: true,
          },
        },
      }),
    );
  }

  cart.items = [];
  cart.couponCode = undefined;
  cart.couponDiscount = 0;
  cart.lastActivityAt = new Date();
  await cart.save();

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      data: { cart: formatCartResponse(cart) },
      message: "Cart cleared successfully",
    }),
  );
});

export const removeFromCart = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const userId = req.user?._id;
  const guestSessionId = req.headers["x-guest-session-id"];

  if (!userId && !guestSessionId) {
    throw new ApiError(
      400,
      "Authentication token or Guest Session ID is required to remove item from cart.",
    );
  }

  const cartQuery = userId
    ? { userId, status: "active" }
    : { sessionId: guestSessionId, status: "active" };

  const cart = await Cart.findOne(cartQuery);

  if (!cart) {
    throw new ApiError(404, "Cart not found!");
  }

  // check if item is exists :
  const itemExists = cart.items.some((item) => item?._id.toString() === itemId);

  if (!itemExists) {
    throw new ApiError(404, "Item not found in cart");
  }

  // remove item :
  cart.items = cart.items.filter((item) => item._id.toString() !== itemId);
  cart.lastActivityAt = new Date();
  await cart.save();

  // populate for response :
  await cart.populate({
    path: "items.productId",
    select: "name images image price originalPrice stock isActive",
  });

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Item removed from cart",
      data: {
        cart: formatCartResponse(cart),
      },
    }),
  );
});

export const updateCartItemQuantity = asyncHandler(async (req, res, next) => {
  const { itemId } = req.params;
  const { quantity } = req.body;
  const userId = req.user?._id;
  const guestSessionId = req.headers["x-guest-session-id"];

  if (!userId && !guestSessionId) {
    throw new ApiError(
      400,
      "Authentication token or Guest Session ID is required to update item quantity.",
    );
  }

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    throw new ApiError(400, "Invalid cart id");
  }

  if (!Number.isInteger(quantity)) {
    throw new ApiError(400, "Quantity must be an integer");
  }

  const cartQuery = userId
    ? { userId, status: "active" }
    : { sessionId: guestSessionId, status: "active" };

  const cart = await Cart.findOne(cartQuery);

  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  const cartItem = cart.items.find((item) => item?._id.toString() === itemId);

  if (!cartItem) {
    throw new ApiError(404, "Cart item not found");
  }

  if (quantity === 0) {
    cart.items = cart.items.filter((item) => item._id.toString() !== itemId);
  } else {
    const product = await Product.findById(cartItem.productId).select("stock");

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    if (quantity > product.stock) {
      throw new ApiError(400, `Only ${product.stock} available`);
    }

    cartItem.quantity = quantity;
  }

  let subtotal = 0;
  let totalItems = 0;

  cart.items.forEach((item) => {
    let itemSubtotal = item.price * item.quantity;
    item.subtotal = itemSubtotal;

    subtotal += itemSubtotal;
    totalItems += item.quantity;
  });

  let couponDiscountAmount = 0;

  if (cart.couponCode && cart.couponDiscount > 0) {
    if (cart.couponDiscountType === "percentage") {
      couponDiscountAmount = (subtotal * cart.couponDiscount) / 100;
    } else {
      couponDiscountAmount = cart.couponDiscount;
    }
  }

  const total = Math.max(subtotal - couponDiscountAmount, 0);

  cart.lastActivityAt = new Date();

  cart.set({
    subtotal,
    totalItems,
    total,
    couponDiscountAmount,
    isEmpty: cart.items.length === 0,
  });

  await cart.save();

  await cart.populate({
    path: "items.productId",
    select: "name images image slug stock isActive",
  });

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      data: { cart: formatCartResponse(cart) },
      message: "Cart updated successfully",
    }),
  );
});

export const getCartCount = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const guestSessionId = req.headers["x-guest-session-id"];

  if (!userId && !guestSessionId) {
    return res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        message: "Cart counts retrieved successfully",
        data: { count: 0, uniqueItems: 0 },
      }),
    );
  }

  const cartQuery = userId
    ? { userId, status: "active" }
    : { sessionId: guestSessionId, status: "active" };

  const cart = await Cart.findOne(cartQuery);

  const count = cart
    ? cart.items.reduce((total, item) => total + item.quantity, 0)
    : 0;

  const uniqueItems = cart ? cart.items.length : 0;
  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Cart counts retrieved successfully",
      data: { count, uniqueItems },
    }),
  );
});

// transfering the guest cart items to the user's document upon authentication :
export const mergeGuestCart = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const guestSessionId = req.headers["x-guest-session-id"];

  if (!guestSessionId) {
    return res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        message: "No guest session to merge",
      }),
    );
  }

  const guestCart = await Cart.findOne({
    sessionId: guestSessionId,
    status: "active",
  });

  if (!guestCart || guestCart.items.length === 0) {
    return res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        message: "Guest cart is empty",
      }),
    );
  }

  // find or create user cart :
  const userCart = await Cart.findOne({ userId, status: "active" });
  console.log("userCart", userCart);

  if (!userCart) {
    // re-assign guest cart to user directly
    guestCart.userId = userId;
    guestCart.sessionId = null;
    await guestCart.save();
  } else {
    // merge items into existing user cart
    guestCart.items.forEach((guestItem) => {
      const existingItemIndex = userCart.items.findIndex((item) => {
        return item.productId.toString() === guestItem.productId.toString();
      });

      if (existingItemIndex > -1) {
        console.log("logged1");
        const updatedQty =
          userCart.items[existingItemIndex].quantity + guestItem.quantity;
        userCart.items[existingItemIndex].quantity = Math.min(updatedQty, 100);
      } else {
        console.log("logged2");
        userCart.items.push(guestItem);
      }
    });

    console.log("usercart", userCart);
    await userCart.save();
    // delete converted guest cart document
    await Cart.deleteOne({ _id: guestCart?._id });
  }

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Cart merged successfully",
    }),
  );
});

export const reorderItems = asyncHandler(async (req, res) => {
  const { orderId } = req.body;

  const order = await Order.findById(orderId);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  let cart = await Cart.findOne({ userId: req.user?._id });
  if (!cart) cart = new Cart({ userId: req.user?._id, items: [] });

  // add items from order to cart :
  // collect all product Id's :
  const productIds = order.items.map((item) => item.productId);

  // collect all product object from Product document which are matches with the productId's :
  const products = await Product.find({
    _id: { $in: productIds },
  }).lean();

  const productMap = new Map(
    products.map((product) => [product?._id.toString(), product]),
  );

  for (const item of order.items) {
    const product = productMap.get(item.productId?.toString());

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    // find existing cart item:
    const existingItemIndex = cart.items.findIndex(
      (cart) => cart.productId?.toString() === item.productId.toString(),
    );

    if (existingItemIndex > -1) {
      const currentQty = cart.items[existingItemIndex].quantity;
      const requestQty = currentQty + item.quantity;

      if (requestQty > product.stock) {
        throw new ApiError(
          400,
          `${product.name} has only ${product.stock} item(s) available`,
        );
      }

      cart.items[existingItemIndex].quantity = requestQty;
    } else {
      if (item.quantity > product.stock) {
        throw new ApiError(
          400,
          `${product.name} has only ${product.stock} item(s) available`,
        );
      }

      cart.items.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      });
    }
  }

  await cart.save();

  await cart.populate({
    path: "items.productId",
    select: "name images price discountPrice stock quantity isActive slug",
  });

  return res.status(200).json(
    new ApiResponse({
      message: "Items Reordered successfully",
      data: {
        cart: formatCartResponse(cart),
      },
    }),
  );
});

const formatCartResponse = (cart) => {
  return {
    _id: cart._id,
    items: cart.items.map((item) => ({
      _id: item._id,
      productId: item.productId?._id || item.productId,
      product: item.productId
        ? {
            _id: item.productId._id,
            name: item.productId.name || item.productSnapshot?.name,
            image:
              item.productSnapshot?.image ||
              item.productId.images?.[0].url ||
              item.productId.image,
            slug: item.productId.slug,
            stock:
              item.productId?.stock ??
              item.productId?.countInStock ??
              item.productSnapshot?.stock ??
              0,
            isActive: item.productId.isActive,
          }
        : null,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
      price: item.price,
      originalPrice: item.originalPrice,
      discount: item.discount,
      subtotal: Math.round(item.price * item.quantity * 100) / 100,
      savings:
        item.originalPrice > item.price
          ? Math.round(
              (item.originalPrice - item.price) * item.quantity * 100,
            ) / 100
          : 0,
      addedAt: item.addedAt,
    })),
    totalItems: cart.totalItems,
    uniqueItems: cart.uniqueItems,
    subtotal: cart.subtotal,
    couponCode: cart.couponCode || null,
    couponDiscount: cart.couponDiscount || 0,
    couponDiscountType: cart.couponDiscountType || "percentage",
    couponDiscountAmount: cart.couponDiscountAmount || 0,
    total: cart.total,
    totalSavings: cart.totalSavings,
    currency: cart.currency,
    isEmpty: cart.isEmpty,
    lastActivityAt: cart.lastActivityAt,
    updatedAt: cart.updatedAt,
  };
};
