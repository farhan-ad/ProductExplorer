const CART_STORAGE_KEY = "product-explorer-cart";
let cart = [];
let cartLoadFailed = false;

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
});

function getCartAfterAdding(currentCart, product) {
  const existingItem = currentCart.find((item) => item.id === product.id);

  if (existingItem) {
    return currentCart.map((item) =>
      item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
    );
  }

  return [
    ...currentCart,
    {
      id: product.id,
      title: product.title,
      price: product.price,
      thumbnail: product.thumbnail,
      quantity: 1,
    },
  ];
}

function isValidCartItem(item) {
  if (typeof item !== "object" || item === null || Array.isArray(item)) {
    return false;
  }

  return (
    Number.isSafeInteger(item.id) &&
    item.id > 0 &&
    Number.isSafeInteger(item.quantity) &&
    item.quantity > 0 &&
    Number.isFinite(item.price) &&
    item.price >= 0 &&
    typeof item.title === "string" &&
    item.title.trim() !== "" &&
    typeof item.thumbnail === "string" &&
    item.thumbnail.trim() !== ""
  );
}

function loadCart() {
  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);

    if (savedCart === null) {
      cart = [];
      cartLoadFailed = false;
      return;
    }

    const parsedCart = JSON.parse(savedCart);
    if (!Array.isArray(parsedCart) || !parsedCart.every(isValidCartItem)) {
      throw new Error("Saved cart data is invalid");
    }

    const uniqueIds = new Set(parsedCart.map((item) => item.id));

    if (uniqueIds.size !== parsedCart.length) {
      throw new Error("Saved cart contains duplicate product IDs");
    }

    cart = parsedCart;
    cartLoadFailed = false;
  } catch (error) {
    console.error("Couldn't load the saved cart:", error);
    cartLoadFailed = true;
  }
}

function saveCart(nextCart) {
  if (cartLoadFailed) {
    return false;
  }

  try {
    if (!Array.isArray(nextCart) || !nextCart.every(isValidCartItem)) {
      throw new Error("Saved cart data is invalid");
    }

    const uniqueIds = new Set(nextCart.map((item) => item.id));

    if (uniqueIds.size !== nextCart.length) {
      throw new Error("Saved cart contains duplicate product IDs");
    }

    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(nextCart));

    return true;
  } catch (error) {
    console.error("Couldn't save the cart: ", error);
    return false;
  }
}

function addToCart(product) {
  const nextCart = getCartAfterAdding(cart, product);

  const saved = saveCart(nextCart);

  if (saved) {
    cart = nextCart;

    return true;
  }

  return false;
}

function updateCartQuantity(productId, nextQuantity) {
  if (!Number.isSafeInteger(nextQuantity) || nextQuantity <= 0) {
    return false;
  }

  if (!cart.some((item) => item.id === productId)) {
    return false;
  }

  const nextCart = cart.map((item) =>
    item.id === productId ? { ...item, quantity: nextQuantity } : item,
  );

  const saved = saveCart(nextCart);

  if (!saved) {
    return false;
  }

  cart = nextCart;
  return true;
}

function removeFromCart(productId) {
  if (!cart.some((item) => item.id === productId)) {
    return false;
  }

  const nextCart = cart.filter((item) => item.id !== productId);

  const saved = saveCart(nextCart);

  if (!saved) {
    return false;
  }

  cart = nextCart;
  return true;
}

function getCartTotalInPaise(cartItems) {
  return cartItems.reduce((totalPaise, item) => {
    const priceInPaise = Math.round(item.price * 100);
    const lineTotalPaise = priceInPaise * item.quantity;

    return totalPaise + lineTotalPaise;
  }, 0);
}

loadCart();

window.addEventListener("pageshow", (event) => {
  if (event.persisted) {
    loadCart();
  }
});
