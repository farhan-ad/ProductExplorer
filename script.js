const productList = document.getElementById("product-list");
const productStatus = document.getElementById("product-status");
const reloadButton = document.getElementById("reload-products");
const productSearch = document.getElementById("product-search");

let isLoading = false;
let allProducts = null;

async function loadProducts() {
  if (isLoading) {
    return;
  }

  allProducts = null;
  isLoading = true;
  reloadButton.setAttribute("aria-disabled", "true");

  productList.replaceChildren();
  productStatus.textContent = "Loading Products...";

  try {
    const response = await fetch(
      "https://dummyjson.com/products?limit=0&select=id,title,price,thumbnail,category",
    );

    if (!response.ok) {
      throw new Error("Couldn't load Products.");
    }

    const data = await response.json();

    allProducts = data.products;
    applyProductFilters();
  } catch (error) {
    console.error(error);
    productStatus.textContent = "Couldn't load products. Please try again.";
  } finally {
    isLoading = false;
    reloadButton.setAttribute("aria-disabled", "false");
  }
}

reloadButton.addEventListener("click", loadProducts);
productSearch.addEventListener("input", applyProductFilters);

function applyProductFilters() {
  if (allProducts === null) {
    return;
  }

  const searchItem = productSearch.value.trim().toLowerCase();

  const filteredProducts = allProducts.filter((product) => {
    return product.title.toLowerCase().includes(searchItem);
  });

  renderProducts(filteredProducts);

  if (filteredProducts.length === 0) {
    productStatus.textContent = "No products found";
  } else {
    productStatus.textContent = "";
  }
}

function renderProducts(products) {
  productList.replaceChildren();

  for (const product of products) {
    const li = document.createElement("li");
    li.classList.add("product-card");

    const img = document.createElement("img");
    img.loading = "lazy";
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
