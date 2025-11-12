// home.js

// -----------------------
// 1️⃣ Product Data Array
// -----------------------
let products = [
  {
    id: Date.now(),
    name: "Laptop",
    category: "Electronics",
    price: 1200,
    image: "https://cdn-icons-png.flaticon.com/512/1048/1048953.png",
    addedAt: new Date().toISOString(),
  },
  {
    id: Date.now() + 1,
    name: "Headphones",
    category: "Accessories",
    price: 200,
    image: "https://cdn-icons-png.flaticon.com/512/2907/2907436.png",
    addedAt: new Date().toISOString(),
  },
  {
    id: Date.now() + 2,
    name: "Sneakers",
    category: "Fashion",
    price: 90,
    image: "https://cdn-icons-png.flaticon.com/512/862/862905.png",
    addedAt: new Date().toISOString(),
  },
];

// -----------------------
// 2️⃣ DOM Elements
// -----------------------
const productsSection = document.getElementById("products");
let modal, form;
let searchInput, categoryFilter, priceFilter, sortFilter, recentFilter;

// -----------------------
// 3️⃣ Render Product Cards
// -----------------------
const renderProducts = (list = products) => {
  let container = document.getElementById("productGrid");
  if (!container) {
    container = document.createElement("div");
    container.id = "productGrid";
    container.className =
      "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8";
    productsSection.appendChild(container);
  }

  container.innerHTML = "";

  if (list.length === 0) {
    container.innerHTML =
      '<p class="col-span-full text-center text-gray-500">No products found</p>';
    return;
  }

  list.forEach((p) => {
    const card = document.createElement("div");
    card.className =
      "bg-white dark:bg-gray-800 shadow-lg rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 transition-transform hover:scale-105 duration-200";

    card.innerHTML = `
      <img src="${p.image}" alt="${p.name}" class="w-full h-48 object-contain bg-gray-100 p-4">
      <div class="p-5 text-center">
        <h3 class="text-xl font-bold text-[#6505fa] mb-2">${p.name}</h3>
        <p class="text-gray-500 dark:text-gray-300 mb-1">${p.category}</p>
        <p class="text-lg font-semibold text-[#fa05b8] mb-3">$${p.price}</p>
        <div class="flex justify-center gap-2">
          <button class="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-md edit-btn" data-id="${p.id}">Edit</button>
          <button class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md delete-btn" data-id="${p.id}">Delete</button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });

  attachButtonListeners();
};

// -----------------------
// 4️⃣ Add Product
// -----------------------
const addProduct = (e) => {
  e.preventDefault();
  const name = form.name.value.trim();
  const category = form.category.value.trim();
  const price = parseFloat(form.price.value.trim());
  const image = form.image.value.trim();

  if (!name || !category || !price || !image || isNaN(price)) {
    alert("⚠️ Please fill all fields correctly!");
    return;
  }

  const newProduct = {
    id: Date.now(),
    name,
    category,
    price,
    image,
    addedAt: new Date().toISOString(),
  };

  products.push(newProduct);
  saveToLocalStorage();
  renderProducts();
  form.reset();
  modal.close();
};

// -----------------------
// 5️⃣ Delete Product
// -----------------------
const deleteProduct = (id) => {
  const confirmDelete = confirm("🗑️ Are you sure you want to delete this product?");
  if (confirmDelete) {
    products = products.filter((p) => p.id !== id);
    saveToLocalStorage();
    renderProducts();
  }
};

// -----------------------
// 6️⃣ Edit Product
// -----------------------
const editProduct = (id) => {
  const product = products.find((p) => p.id === id);
  if (!product) return;

  form.name.value = product.name;
  form.category.value = product.category;
  form.price.value = product.price;
  form.image.value = product.image;

  modal.showModal();

  form.onsubmit = (e) => {
    e.preventDefault();
    const confirmUpdate = confirm("✏️ Confirm update to this product?");
    if (!confirmUpdate) return;

    product.name = form.name.value.trim();
    product.category = form.category.value.trim();
    product.price = parseFloat(form.price.value.trim());
    product.image = form.image.value.trim();

    saveToLocalStorage();
    renderProducts();
    modal.close();
    form.reset();
    form.onsubmit = addProduct;
  };
};

// -----------------------
// 7️⃣ Button Listeners
// -----------------------
const attachButtonListeners = () => {
  document.querySelectorAll(".delete-btn").forEach((btn) =>
    btn.addEventListener("click", () => deleteProduct(parseInt(btn.dataset.id)))
  );

  document.querySelectorAll(".edit-btn").forEach((btn) =>
    btn.addEventListener("click", () => editProduct(parseInt(btn.dataset.id)))
  );
};

// -----------------------
// 8️⃣ Modal Setup
// -----------------------
const createModal = () => {
  const modalHTML = `
  <dialog id="productModal" class="rounded-xl p-6 bg-white dark:bg-gray-800 shadow-xl">
    <h2 class="text-2xl font-bold mb-4 text-[#6505fa]">Add / Edit Product</h2>
    <form id="productForm" class="flex flex-col gap-4">
      <input type="text" name="name" placeholder="Product Name" class="border p-2 rounded-md" required />
      <input type="text" name="category" placeholder="Category" class="border p-2 rounded-md" required />
      <input type="number" name="price" placeholder="Price" class="border p-2 rounded-md" required />
      <input type="url" name="image" placeholder="Image URL" class="border p-2 rounded-md" required />
      <div class="flex justify-between mt-4">
        <button type="submit" class="bg-[#6505fa] text-white px-4 py-2 rounded-md hover:bg-[#fa05b8]">Save</button>
        <button type="button" id="cancelBtn" class="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500">Cancel</button>
      </div>
    </form>
  </dialog>
  `;
  document.body.insertAdjacentHTML("beforeend", modalHTML);
  modal = document.getElementById("productModal");
  form = document.getElementById("productForm");

  document.getElementById("cancelBtn").addEventListener("click", () => {
    modal.close();
    form.reset();
    form.onsubmit = addProduct;
  });

  form.onsubmit = addProduct;
};

// -----------------------
// 9️⃣ Floating Add Button
// -----------------------
const addFloatingButton = () => {
  const btn = document.createElement("button");
  btn.textContent = "+ Add Product";
  btn.className =
    "fixed bottom-10 right-10 bg-[#6505fa] hover:bg-[#fa05b8] text-white px-5 py-3 rounded-full shadow-lg font-semibold";
  btn.addEventListener("click", () => modal.showModal());
  document.body.appendChild(btn);
};

// -----------------------
// 🔟 Search & Filters (5 total)
// -----------------------
const createSearchFilters = () => {
  const filterContainer = document.createElement("div");
  filterContainer.className =
    "flex flex-wrap justify-center gap-4 mb-8";

  filterContainer.innerHTML = `
    <input id="searchInput" type="text" placeholder="🔍 Search by name..." class="border p-2 rounded-md w-60" />
    <select id="categoryFilter" class="border p-2 rounded-md">
      <option value="all">All Categories</option>
      <option value="Electronics">Electronics</option>
      <option value="Accessories">Accessories</option>
      <option value="Fashion">Fashion</option>
    </select>
    <select id="priceFilter" class="border p-2 rounded-md">
      <option value="all">All Prices</option>
      <option value="low">Below $200</option>
      <option value="mid">$200 - $800</option>
      <option value="high">Above $800</option>
    </select>
    <select id="sortFilter" class="border p-2 rounded-md">
      <option value="default">Sort By</option>
      <option value="lowToHigh">Price: Low to High</option>
      <option value="highToLow">Price: High to Low</option>
    </select>
    <select id="recentFilter" class="border p-2 rounded-md">
      <option value="default">All Items</option>
      <option value="recent">Recently Added</option>
    </select>
  `;

  productsSection.prepend(filterContainer);

  searchInput = document.getElementById("searchInput");
  categoryFilter = document.getElementById("categoryFilter");
  priceFilter = document.getElementById("priceFilter");
  sortFilter = document.getElementById("sortFilter");
  recentFilter = document.getElementById("recentFilter");

  [searchInput, categoryFilter, priceFilter, sortFilter, recentFilter].forEach((el) =>
    el.addEventListener("input", applyFilters)
  );
};

// -----------------------
// 1️⃣1️⃣ Apply Filters
// -----------------------
const applyFilters = () => {
  let filtered = [...products];

  const searchTerm = searchInput.value.toLowerCase();
  const categoryValue = categoryFilter.value;
  const priceValue = priceFilter.value;
  const sortValue = sortFilter.value;
  const recentValue = recentFilter.value;

  // 🔍 Search filter
  filtered = filtered.filter((p) => p.name.toLowerCase().includes(searchTerm));

  // 🧩 Category filter
  if (categoryValue !== "all") {
    filtered = filtered.filter((p) => p.category === categoryValue);
  }

  // 💰 Price filter
  if (priceValue === "low") filtered = filtered.filter((p) => p.price < 200);
  else if (priceValue === "mid")
    filtered = filtered.filter((p) => p.price >= 200 && p.price <= 800);
  else if (priceValue === "high")
    filtered = filtered.filter((p) => p.price > 800);

  // 🕒 Recently added filter
  if (recentValue === "recent") {
    filtered = filtered.sort(
      (a, b) => new Date(b.addedAt) - new Date(a.addedAt)
    );
  }

  // 🔢 Sort by price
  if (sortValue === "lowToHigh") filtered = filtered.sort((a, b) => a.price - b.price);
  else if (sortValue === "highToLow") filtered = filtered.sort((a, b) => b.price - a.price);

  renderProducts(filtered);
};

// -----------------------
// 1️⃣2️⃣ Local Storage (Persist Data)
// -----------------------
const saveToLocalStorage = () =>
  localStorage.setItem("products", JSON.stringify(products));

const loadFromLocalStorage = () => {
  const stored = localStorage.getItem("products");
  if (stored) products = JSON.parse(stored);
};

// -----------------------
// 1️⃣3️⃣ Initialize
// -----------------------
document.addEventListener("DOMContentLoaded", () => {
  loadFromLocalStorage();
  createModal();
  createSearchFilters();
  renderProducts();
  addFloatingButton();
});
