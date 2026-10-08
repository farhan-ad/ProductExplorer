const productList = document.getElementById("product-list");

async function loadProducts() {
  try {
    const response = await fetch("https://dummyjson.com/products?limit=6");

    if (!response.ok) {
      throw new Error("Couldn't load Products.");
    }

    const data = await response.json();

    renderProducts(data.products);
  } catch (error) {
    console.error(error);
  }
}

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
