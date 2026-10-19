const cartList = document.getElementById("cart-list");
const cartStatus = document.getElementById("cart-status");
const cartTotal = document.getElementById("cart-total");

function handleQuantityChange(productId, nextQuantity, focusId) {
  const updated = updateCartQuantity(productId, nextQuantity);

  if (!updated) {
    if (cartLoadFailed) {
      cartStatus.textContent =
        "Couldn't load your saved cart. Changes weren't saved.";
    } else {
      cartStatus.textContent = "Couldn't save your cart. Please try again.";
    }

    return;
  }

  renderCart();

  const updatedItem = cart.find((item) => item.id === productId);

  cartStatus.textContent = `${updatedItem.title} quantity updated to ${updatedItem.quantity}`;

  document.getElementById(focusId).focus({ preventScroll: true });
}

function handleRemoveFromCart(productId) {
  const removedIndex = cart.findIndex((item) => item.id === productId);

  const removed = removeFromCart(productId);

  if (!removed) {
    if (cartLoadFailed) {
      cartStatus.textContent =
        "Couldn't load your saved cart. Changes weren't saved.";
    } else {
      cartStatus.textContent = "Couldn't save your cart. Please try again.";
    }

    return;
  }

  renderCart();

  if (cart.length === 0) {
    document.getElementById("continue-shopping").focus({ preventScroll: true });
    return;
  }

  const focusIndex = Math.min(removedIndex, cart.length - 1);
  const focusItem = cart[focusIndex];

  cartStatus.textContent = "Item removed from cart.";

  document
    .getElementById(`cart-remove-${focusItem.id}`)
    .focus({ preventScroll: true });
}

function renderCart() {
  cartList.replaceChildren();
  cartTotal.textContent = "";
  cartTotal.hidden = true;

  if (cartLoadFailed) {
    cartStatus.textContent =
      "Couldn't load your saved cart. Please refresh to try again.";
    return;
  }

  const totalPaise = getCartTotalInPaise(cart);

  cartTotal.textContent = `Total: ${currencyFormatter.format(totalPaise / 100)}`;
  cartTotal.hidden = false;

  if (cart.length === 0) {
    cartStatus.textContent =
      "Your cart is empty. Browse products to get started.";
    return;
  }

  cartStatus.textContent = "";

  for (const item of cart) {
    const li = document.createElement("li");
    li.classList.add("cart-item");

    const image = document.createElement("img");
    image.src = item.thumbnail;
    image.alt = `${item.title} thumbnail`;

    const info = document.createElement("div");
    info.classList.add("cart-item-info");

    const title = document.createElement("a");
    title.id = `cart-title-${item.id}`;
    title.href = `product.html?id=${item.id}`;
    title.textContent = item.title;

    const priceInPaise = Math.round(item.price * 100);

    const price = document.createElement("p");
    price.classList.add("cart-unit-price");
    price.textContent = `Unit price: ${currencyFormatter.format(priceInPaise / 100)}`;

    const quantityControls = document.createElement("div");
    quantityControls.classList.add("cart-quantity-controls");

    const quantity = document.createElement("p");
    quantity.textContent = `Quantity: ${item.quantity}`;

    const decreasedButton = document.createElement("button");
    decreasedButton.type = "button";
    decreasedButton.id = `quantity-decrease-${item.id}`;
    decreasedButton.textContent = "Decrease";
    decreasedButton.setAttribute(
      "aria-label",
      `Decrease quantity for ${item.title}`,
    );
    decreasedButton.setAttribute(
      "aria-disabled",
      item.quantity === 1 ? true : false,
    );

    decreasedButton.addEventListener("click", () => {
      if (item.quantity === 1) {
        return;
      }

      handleQuantityChange(item.id, item.quantity - 1, decreasedButton.id);
    });

    const increaseButton = document.createElement("button");
    increaseButton.type = "button";
    increaseButton.id = `quantity-increase-${item.id}`;
    increaseButton.textContent = "Increase";
    increaseButton.setAttribute(
      "aria-label",
      `Increase quantity for ${item.title}`,
    );

    increaseButton.addEventListener("click", () => {
      handleQuantityChange(item.id, item.quantity + 1, increaseButton.id);
    });

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.classList.add("cart-remove");
    removeButton.id = `cart-remove-${item.id}`;
    removeButton.textContent = "Remove";
    removeButton.setAttribute("aria-label", `Remove ${item.title} from cart`);

    removeButton.addEventListener("click", () => {
      handleRemoveFromCart(item.id);
    });

    const lineTotalPaise = priceInPaise * item.quantity;

    const lineTotal = document.createElement("p");
    lineTotal.classList.add("cart-line-total");
    lineTotal.textContent = `Line Total: ${currencyFormatter.format(lineTotalPaise / 100)}`;

    quantityControls.append(quantity, decreasedButton, increaseButton);
    info.append(title, price, quantityControls, lineTotal, removeButton);
    li.append(image, info);
    cartList.append(li);
  }
}

renderCart();

window.addEventListener("pageshow", (event) => {
  if (!event.persisted) {
    return;
  }

  const focusId = document.activeElement.id;

  renderCart();

  if (focusId) {
    const focusTarget =
      document.getElementById(focusId) ||
      document.getElementById("continue-shopping");

    focusTarget.focus({ preventScroll: true });
  }
});
