const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

const detailStatus = document.getElementById("detail-status");
const productDetails = document.getElementById("product-details");
const reloadProductButton = document.getElementById("reload-product");
const cartStatus = document.getElementById("cart-status");

let isLoadingDetails = false;

async function loadProductDetails() {
  if (isLoadingDetails) {
    return;
  }

  if (!productId) {
    detailStatus.textContent = "No product selected. Go back to products.";
    return;
  }

  const numericProductId = Number(productId);

  if (!Number.isSafeInteger(numericProductId) || numericProductId <= 0) {
    detailStatus.textContent = "Invalid product link. Go back to products.";
    return;
  }

  reloadProductButton.hidden = false;
  isLoadingDetails = true;

  reloadProductButton.setAttribute("aria-disabled", "true");

  productDetails.replaceChildren();
  cartStatus.textContent = "";
  detailStatus.textContent = "Loading product...";

  try {
    const response = await fetch(
      `https://dummyjson.com/products/${numericProductId}`,
    );

    if (response.status === 404) {
      detailStatus.textContent = "Product not found. Go back to products.";
      return;
    }

    if (!response.ok) {
      throw new Error("Couldn't fetch product details.");
    }

    const product = await response.json();

    renderProductDetails(product);
    detailStatus.textContent = "";
  } catch (error) {
    console.error(error);
    detailStatus.textContent = "Couldn't load this product. Please try again.";
  } finally {
    isLoadingDetails = false;
    reloadProductButton.setAttribute("aria-disabled", "false");
  }
}

function renderProductDetails(product) {
  productDetails.replaceChildren();

  cartStatus.textContent = "";

  const article = document.createElement("article");
  article.classList.add("product-detail");

  const image = document.createElement("img");
  image.src = product.thumbnail;
  image.alt = product.title;

  const info = document.createElement("div");
  info.classList.add("product-detail-info");

  const heading = document.createElement("h3");
  heading.textContent = product.title;

  const price = document.createElement("p");
  price.classList.add("product-price");
  const priceInPaise = Math.round(product.price * 100);
  price.textContent = `Price: ${currencyFormatter.format(priceInPaise / 100)}`;

  const description = document.createElement("p");
  description.textContent = `Description: ${product.description}`;

  const category = document.createElement("p");
  category.textContent = `Category: ${product.category.replaceAll("-", " ")}`;

  const rating = document.createElement("p");
  rating.textContent = `Rating: ${product.rating}`;

  const stock = document.createElement("p");
  stock.textContent = `Stock: ${product.stock}`;

  const addToCartButton = document.createElement("button");
  addToCartButton.type = "button";
  addToCartButton.classList.add("blue-button");
  addToCartButton.textContent = "Add to Cart";

  addToCartButton.addEventListener("click", () => {
    const saved = addToCart(product);

    if (saved) {
      cartStatus.textContent = "Added to cart.";
    } else if (cartLoadFailed) {
      cartStatus.textContent =
        "Couldn't load your saved cart. Changes weren't saved.";
    } else {
      cartStatus.textContent = "Couldn't save your cart. Please try again.";
    }
  });

  info.append(
    heading,
    price,
    description,
    category,
    rating,
    stock,
    addToCartButton,
  );
  article.append(image, info);
  productDetails.append(article);
}

reloadProductButton.addEventListener("click", loadProductDetails);

loadProductDetails();
