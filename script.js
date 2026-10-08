const productList = document.getElementById("product-list");
const productStatus = document.getElementById("product-status");
const reloadButton = document.getElementById("reload-products");

let isLoading = false;

async function loadProducts() {
  if (isLoading) {
    return;
  }

  isLoading = true;
  reloadButton.setAttribute("aria-disabled", "true");

  productList.replaceChildren();
  productStatus.textContent = "Loading Products...";

  try {
    const response = await fetch("https://dummyjson.com/products?limit=6");

    if (!response.ok) {
      throw new Error("Couldn't load Products.");
    }

    const data = await response.json();

    renderProducts(data.products);

    if (data.products.length === 0) {
      productStatus.textContent = "No products found.";
    } else {
      productStatus.textContent = "";
    }
  } catch (error) {
    console.error(error);
    productStatus.textContent = "Couldn't load products. Please try again.";
  } finally {
    isLoading = false;
    reloadButton.setAttribute("aria-disabled", "false");
  }
}

reloadButton.addEventListener("click", loadProducts);

function renderProducts(products) {
  productList.replaceChildren();

  for (const product of products) {
    const li = document.createElement("li");
    li.classList.add("product-card");

    const img = document.createElement("img");
    img.src = product.thumbnail;
    img.alt = product.title;

    const heading = document.createElement("h3");
    heading.textContent = product.title;

    const price = document.createElement("p");
    price.textContent = `Price: ${product.price}`;

    li.append(img, heading, price);
    productList.append(li);
  }
}

loadProducts();
