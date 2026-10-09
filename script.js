const productList = document.getElementById("product-list");
const productStatus = document.getElementById("product-status");
const reloadButton = document.getElementById("reload-products");
const productSearch = document.getElementById("product-search");
const productCategory = document.getElementById("product-category");

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

    const categories = [
      ...new Set(allProducts.map((product) => product.category)),
    ];

    renderCategoryOptions(categories);
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
productCategory.addEventListener("change", applyProductFilters);

function applyProductFilters() {
  if (allProducts === null) {
    return;
  }

  const searchItem = productSearch.value.trim().toLowerCase();
  const selectedCategory = productCategory.value;

  const filteredProducts = allProducts.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(searchItem);

    const matchesCategory =
      selectedCategory === "" || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
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

function renderCategoryOptions(categories) {
  const selectedCategory = productCategory.value;

  productCategory.replaceChildren();

  const allOption = document.createElement("option");
  allOption.value = "";
  allOption.textContent = "All categories";
  productCategory.append(allOption);

  for (const category of categories) {
    const option = document.createElement("option");

    option.value = category;
    option.textContent = category.replaceAll("-", " ");

    productCategory.append(option);
  }

  if (categories.includes(selectedCategory)) {
    productCategory.value = selectedCategory;
  } else {
    productCategory.value = "";
  }
}

loadProducts();
