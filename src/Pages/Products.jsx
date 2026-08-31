import React, { useMemo, useState } from "react";
import {
  Search,
  MoreHorizontal,
  Plus,
  Package,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  Edit3,
  Trash2,
  Eye,
  Image as ImageIcon,
  ChevronDown,
  SlidersHorizontal,
  X,
  ShoppingBag,
} from "lucide-react";

/* =========================================================
   DEMO PRODUCTS
========================================================= */

const initialProducts = [
  {
    id: 1,
    name: "Black Evening Dress",
    category: "Dresses",
    price: 450,
    stock: 12,
    sizes: ["S", "M", "L"],
    colors: ["Black"],
    status: "In stock",
    description:
      "Elegant black evening dress suitable for weddings, parties and formal events.",
    image:
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=900&q=80",
  },

  {
    id: 2,
    name: "Red Summer Dress",
    category: "Dresses",
    price: 380,
    stock: 7,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Red"],
    status: "In stock",
    description:
      "Lightweight summer dress designed for casual and outdoor occasions.",
    image:
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=900&q=80",
  },

  {
    id: 3,
    name: "Black Shirt",
    category: "Men",
    price: 180,
    stock: 4,
    sizes: ["M", "L", "XL"],
    colors: ["Black"],
    status: "Low stock",
    description:
      "Classic black shirt with a clean modern fit.",
    image:
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80",
  },

  {
    id: 4,
    name: "Blue Kaftan",
    category: "Men",
    price: 500,
    stock: 0,
    sizes: ["M", "L", "XL"],
    colors: ["Blue"],
    status: "Out of stock",
    description:
      "Premium blue kaftan for traditional and formal occasions.",
    image:
      "https://images.unsplash.com/photo-1610652492500-ded49ceeb378?auto=format&fit=crop&w=900&q=80",
  },

  {
    id: 5,
    name: "White Heels",
    category: "Shoes",
    price: 250,
    stock: 9,
    sizes: ["38", "39", "40", "41"],
    colors: ["White"],
    status: "In stock",
    description:
      "Elegant white heels designed for formal and evening wear.",
    image:
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&q=80",
  },

  {
    id: 6,
    name: "Gold Heels",
    category: "Shoes",
    price: 550,
    stock: 3,
    sizes: ["38", "39", "40"],
    colors: ["Gold"],
    status: "Low stock",
    description:
      "Premium gold heels for special occasions.",
    image:
      "https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=900&q=80",
  },

  {
    id: 7,
    name: "Silk Dress",
    category: "Dresses",
    price: 900,
    stock: 6,
    sizes: ["S", "M", "L"],
    colors: ["Cream"],
    status: "In stock",
    description:
      "Premium silk dress with a refined finish.",
    image:
      "https://images.unsplash.com/photo-1566479179817-c0f6d85a3b4f?auto=format&fit=crop&w=900&q=80",
  },

  {
    id: 8,
    name: "Designer Bag",
    category: "Accessories",
    price: 700,
    stock: 2,
    sizes: [],
    colors: ["Brown"],
    status: "Low stock",
    description:
      "Premium designer-style handbag for everyday and formal use.",
    image:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80",
  },

  {
    id: 9,
    name: "White Shirt",
    category: "Men",
    price: 350,
    stock: 15,
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["White"],
    status: "In stock",
    description:
      "Classic white shirt suitable for formal and casual styling.",
    image:
      "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=900&q=80",
  },
];

/* =========================================================
   HELPERS
========================================================= */

const getStatusFromStock = (stock) => {
  if (stock <= 0) return "Out of stock";
  if (stock <= 4) return "Low stock";
  return "In stock";
};

const formatPrice = (price) => {
  return `GHS ${Number(price).toLocaleString()}`;
};

const statusStyles = {
  "In stock": "bg-green-50 text-green-700",
  "Low stock": "bg-amber-50 text-amber-700",
  "Out of stock": "bg-red-50 text-red-700",
};

const categoryStyles = {
  Dresses: "bg-purple-50 text-purple-700",
  Men: "bg-blue-50 text-blue-700",
  Shoes: "bg-orange-50 text-orange-700",
  Accessories: "bg-pink-50 text-pink-700",
};

/* =========================================================
   PRODUCTS
========================================================= */

const Products = () => {
  const [products, setProducts] = useState(initialProducts);

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const [selectedProduct, setSelectedProduct] =
    useState(null);

  const [showProductForm, setShowProductForm] =
    useState(false);

  const [editingProduct, setEditingProduct] =
    useState(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "Dresses",
    price: "",
    stock: "",
    sizes: "",
    colors: "",
    description: "",
    image: "",
  });

  /* =======================================================
     COUNTS
  ======================================================= */

  const totalProducts = products.length;

  const inStockProducts = products.filter(
    (product) => product.stock > 4
  ).length;

  const lowStockProducts = products.filter(
    (product) =>
      product.stock > 0 && product.stock <= 4
  ).length;

  const outOfStockProducts = products.filter(
    (product) => product.stock <= 0
  ).length;

  /* =======================================================
     FILTERING
  ======================================================= */

  const filteredProducts = useMemo(() => {
    const value = search.toLowerCase().trim();

    return products.filter((product) => {
      const matchesSearch =
        !value ||
        product.name
          .toLowerCase()
          .includes(value) ||
        product.category
          .toLowerCase()
          .includes(value);

      let matchesFilter = true;

      if (activeFilter === "In stock") {
        matchesFilter = product.stock > 4;
      }

      if (activeFilter === "Low stock") {
        matchesFilter =
          product.stock > 0 &&
          product.stock <= 4;
      }

      if (activeFilter === "Out of stock") {
        matchesFilter = product.stock <= 0;
      }

      return matchesSearch && matchesFilter;
    });
  }, [products, search, activeFilter]);

  /* =======================================================
     FORM
  ======================================================= */

  const resetForm = () => {
    setFormData({
      name: "",
      category: "Dresses",
      price: "",
      stock: "",
      sizes: "",
      colors: "",
      description: "",
      image: "",
    });

    setEditingProduct(null);
  };

  const openAddForm = () => {
    resetForm();
    setShowProductForm(true);
  };

  const openEditForm = (product) => {
    setEditingProduct(product);

    setFormData({
      name: product.name,
      category: product.category,
      price: String(product.price),
      stock: String(product.stock),
      sizes: product.sizes.join(", "),
      colors: product.colors.join(", "),
      description: product.description,
      image: product.image || "",
    });

    setShowProductForm(true);
  };

  const closeForm = () => {
    setShowProductForm(false);
    resetForm();
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const imageUrl = URL.createObjectURL(file);

    setFormData((current) => ({
      ...current,
      image: imageUrl,
    }));
  };

  const handleSaveProduct = (event) => {
    event.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.price ||
      formData.stock === ""
    ) {
      return;
    }

    const price = Number(formData.price);
    const stock = Number(formData.stock);

    const productData = {
      name: formData.name.trim(),
      category: formData.category,
      price,
      stock,
      sizes: formData.sizes
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      colors: formData.colors
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      description: formData.description.trim(),
      status: getStatusFromStock(stock),
      image: formData.image || null,
    };

    if (editingProduct) {
      setProducts((current) =>
        current.map((product) =>
          product.id === editingProduct.id
            ? {
                ...product,
                ...productData,
              }
            : product
        )
      );

      if (
        selectedProduct?.id === editingProduct.id
      ) {
        setSelectedProduct({
          ...editingProduct,
          ...productData,
        });
      }
    } else {
      const newProduct = {
        id: Date.now(),
        ...productData,
      };

      setProducts((current) => [
        ...current,
        newProduct,
      ]);

      setSelectedProduct(newProduct);
    }

    closeForm();
  };

  /* =======================================================
     DELETE
  ======================================================= */

  const deleteProduct = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    setProducts((current) =>
      current.filter(
        (product) => product.id !== id
      )
    );

    if (selectedProduct?.id === id) {
      setSelectedProduct(null);
    }
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-gray-50">
      {/* =================================================
          HEADER
      ================================================== */}

      <header className="shrink-0 border-b border-gray-200 bg-white px-4 py-4 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <ShoppingBag
                size={19}
                strokeWidth={1.8}
                className="shrink-0 text-gray-700"
              />

              <h1 className="truncate text-lg font-semibold text-gray-900">
                Products
              </h1>
            </div>

            <p className="mt-1 text-xs text-gray-500">
              Manage your products, prices and inventory.
            </p>
          </div>

          <button
            type="button"
            onClick={openAddForm}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 sm:w-auto"
          >
            <Plus size={16} />
            Add product
          </button>
        </div>
      </header>

      {/* =================================================
          SUMMARY
      ================================================== */}

      <div className="shrink-0 border-b border-gray-200 bg-white px-4 py-4 sm:px-6">
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          <SummaryCard
            icon={Package}
            label="Total products"
            value={totalProducts}
          />

          <SummaryCard
            icon={CheckCircle2}
            label="In stock"
            value={inStockProducts}
          />

          <SummaryCard
            icon={AlertTriangle}
            label="Low stock"
            value={lowStockProducts}
          />

          <SummaryCard
            icon={XCircle}
            label="Out of stock"
            value={outOfStockProducts}
          />
        </div>
      </div>

      {/* =================================================
          WORKSPACE
      ================================================== */}

      <div className="min-h-0 flex-1 overflow-hidden p-3 sm:p-4 lg:p-5">
        <div className="flex h-full min-h-0 overflow-hidden rounded-2xl border border-gray-200 bg-white">

          {/* =================================================
              PRODUCT CATALOG
          ================================================== */}

          <section className="flex h-full min-h-0 min-w-0 flex-1 flex-col">
            {/* Controls */}
            <div className="shrink-0 border-b border-gray-200 bg-white px-4 py-4 sm:px-5">
              <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                {/* Search */}
                <div className="relative w-full xl:max-w-md">
                  <Search
                    size={17}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    value={search}
                    onChange={(event) =>
                      setSearch(event.target.value)
                    }
                    placeholder="Search products"
                    className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 pl-9 pr-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-300 focus:bg-white"
                  />
                </div>

                {/* Filters */}
                <div className="flex min-w-0 items-center gap-2 overflow-x-auto pb-1">
                  <div className="flex shrink-0 items-center gap-1.5 text-xs text-gray-400">
                    <SlidersHorizontal size={14} />
                    <span className="hidden sm:inline">
                      Filter
                    </span>
                  </div>

                  {[
                    "All",
                    "In stock",
                    "Low stock",
                    "Out of stock",
                  ].map((filter) => (
                    <button
                      key={filter}
                      type="button"
                      onClick={() =>
                        setActiveFilter(filter)
                      }
                      className={`
                        shrink-0 rounded-full
                        px-3 py-1.5
                        text-xs font-medium
                        transition
                        ${
                          activeFilter === filter
                            ? "bg-gray-900 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }
                      `}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* =================================================
                ONLY PRODUCT GRID SCROLLS
            ================================================== */}

            <div className="products-list-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-contain">
              {filteredProducts.length === 0 ? (
                <div className="flex min-h-full items-center justify-center px-6 py-16">
                  <div className="max-w-sm text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                      <Package
                        size={24}
                        className="text-gray-400"
                      />
                    </div>

                    <h3 className="mt-4 text-sm font-semibold text-gray-700">
                      No products found
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-gray-400">
                      Try another search or stock filter.
                    </p>
                  </div>
                </div>
              ) : (
                <div
                  className="
                    grid
                    grid-cols-1
                    gap-4
                    p-4
                    sm:grid-cols-2
                    lg:grid-cols-2
                    xl:grid-cols-3
                    2xl:grid-cols-4
                    sm:p-5
                  "
                >
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onView={() =>
                        setSelectedProduct(product)
                      }
                      onEdit={() =>
                        openEditForm(product)
                      }
                      onDelete={() =>
                        deleteProduct(product.id)
                      }
                    />
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* =================================================
              DESKTOP PRODUCT DETAILS
          ================================================== */}

          {selectedProduct && (
            <aside className="hidden h-full min-h-0 w-[350px] shrink-0 flex-col border-l border-gray-200 bg-white xl:flex 2xl:w-[380px]">
              {/* Header */}
              <div className="flex shrink-0 items-center justify-between border-b border-gray-200 px-4 py-4">
                <div>
                  <h2 className="text-sm font-semibold text-gray-900">
                    Product details
                  </h2>

                  <p className="mt-0.5 text-[10px] text-gray-400">
                    Seller management view
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedProduct(null)
                  }
                  className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Only details scroll */}
              <div className="products-detail-scrollbar min-h-0 flex-1 overflow-y-auto">
                <div className="space-y-5 p-5">
                  {/* Image */}
                  <ProductLargeImage
                    product={selectedProduct}
                  />

                  {/* Product title */}
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {selectedProduct.name}
                      </h3>

                      <span
                        className={`rounded-full px-2 py-1 text-[9px] font-medium ${
                          statusStyles[
                            selectedProduct.status
                          ]
                        }`}
                      >
                        {selectedProduct.status}
                      </span>
                    </div>

                    <p className="mt-2 text-base font-semibold text-gray-900">
                      {formatPrice(
                        selectedProduct.price
                      )}
                    </p>
                  </div>

                  {/* Description */}
                  <div>
                    <SectionLabel label="Description" />

                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      {selectedProduct.description}
                    </p>
                  </div>

                  {/* Product information */}
                  <div>
                    <SectionLabel label="Product information" />

                    <div className="mt-3 overflow-hidden rounded-xl border border-gray-100">
                      <InfoRow
                        label="Category"
                        value={selectedProduct.category}
                      />

                      <InfoRow
                        label="Stock"
                        value={`${selectedProduct.stock} ${
                          selectedProduct.stock === 1
                            ? "item"
                            : "items"
                        }`}
                      />

                      <InfoRow
                        label="Status"
                        value={selectedProduct.status}
                      />

                      <InfoRow
                        label="Sizes"
                        value={
                          selectedProduct.sizes.length
                            ? selectedProduct.sizes.join(
                                ", "
                              )
                            : "Not specified"
                        }
                      />

                      <InfoRow
                        label="Colours"
                        value={
                          selectedProduct.colors.length
                            ? selectedProduct.colors.join(
                                ", "
                              )
                            : "Not specified"
                        }
                      />
                    </div>
                  </div>

                  {/* Customer preview */}
                  <div>
                    <SectionLabel label="Customer storefront preview" />

                    <div className="mt-3 overflow-hidden rounded-2xl border border-gray-200 bg-white">
                      <ProductLargeImage
                        product={selectedProduct}
                        small
                      />

                      <div className="p-4">
                        <h4 className="text-sm font-semibold text-gray-900">
                          {selectedProduct.name}
                        </h4>

                        <p className="mt-1 text-sm font-semibold text-gray-700">
                          {formatPrice(
                            selectedProduct.price
                          )}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {selectedProduct.sizes.map(
                            (size) => (
                              <span
                                key={size}
                                className="rounded-md border border-gray-200 px-2 py-1 text-[10px] text-gray-600"
                              >
                                {size}
                              </span>
                            )
                          )}
                        </div>

                        <button
                          type="button"
                          className="mt-4 w-full rounded-lg bg-gray-900 py-2.5 text-xs font-medium text-white"
                        >
                          View product
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Edit */}
                  <button
                    type="button"
                    onClick={() =>
                      openEditForm(selectedProduct)
                    }
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 py-2.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    <Edit3 size={14} />
                    Edit product
                  </button>
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>

      {/* =================================================
          PRODUCT FORM
      ================================================== */}

      {showProductForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-gray-200 px-5 py-4">
              <div>
                <h2 className="text-sm font-semibold text-gray-900">
                  {editingProduct
                    ? "Edit product"
                    : "Add product"}
                </h2>

                <p className="mt-1 text-xs text-gray-400">
                  This information will be used by your storefront and AI assistant.
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              >
                <X size={17} />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSaveProduct}
              className="min-h-0 flex-1 overflow-y-auto"
            >
              <div className="space-y-5 p-5">
                {/* Image upload */}
                <FormField label="Product image">
                  <label className="group relative block cursor-pointer overflow-hidden rounded-2xl border border-dashed border-gray-300 bg-gray-50">
                    {formData.image ? (
                      <div className="relative h-56 w-full">
                        <img
                          src={formData.image}
                          alt="Product preview"
                          className="h-full w-full object-cover"
                        />

                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition group-hover:opacity-100">
                          <span className="rounded-lg bg-white px-3 py-2 text-xs font-medium text-gray-700">
                            Change image
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex h-48 flex-col items-center justify-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
                          <ImageIcon
                            size={21}
                            className="text-gray-400"
                          />
                        </div>

                        <p className="mt-3 text-xs font-medium text-gray-700">
                          Upload product image
                        </p>

                        <p className="mt-1 text-[10px] text-gray-400">
                          PNG, JPG or WEBP
                        </p>
                      </div>
                    )}

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </FormField>

                {/* Name */}
                <FormField label="Product name">
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    placeholder="Black Evening Dress"
                    className={inputClass}
                    required
                  />
                </FormField>

                {/* Category + price */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField label="Category">
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleFormChange}
                      className={inputClass}
                    >
                      <option>Dresses</option>
                      <option>Men</option>
                      <option>Shoes</option>
                      <option>Accessories</option>
                    </select>
                  </FormField>

                  <FormField label="Price">
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                        GHS
                      </span>

                      <input
                        name="price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.price}
                        onChange={handleFormChange}
                        placeholder="450"
                        className={`${inputClass} pl-12`}
                        required
                      />
                    </div>
                  </FormField>
                </div>

                {/* Stock */}
                <FormField label="Stock quantity">
                  <input
                    name="stock"
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={handleFormChange}
                    placeholder="10"
                    className={inputClass}
                    required
                  />
                </FormField>

                {/* Sizes */}
                <FormField label="Sizes">
                  <input
                    name="sizes"
                    value={formData.sizes}
                    onChange={handleFormChange}
                    placeholder="S, M, L, XL"
                    className={inputClass}
                  />

                  <p className="mt-1 text-[10px] text-gray-400">
                    Separate sizes with commas.
                  </p>
                </FormField>

                {/* Colours */}
                <FormField label="Colours">
                  <input
                    name="colors"
                    value={formData.colors}
                    onChange={handleFormChange}
                    placeholder="Black, Red"
                    className={inputClass}
                  />

                  <p className="mt-1 text-[10px] text-gray-400">
                    Separate colours with commas.
                  </p>
                </FormField>

                {/* Description */}
                <FormField label="Description">
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    rows={4}
                    placeholder="Describe the product..."
                    className={`${inputClass} h-auto resize-none py-3`}
                  />
                </FormField>
              </div>

              {/* Footer */}
              <div className="flex shrink-0 justify-end gap-2 border-t border-gray-200 bg-white px-5 py-4">
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-xs font-medium text-gray-600 transition hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-gray-900 px-4 py-2 text-xs font-medium text-white transition hover:bg-gray-800"
                >
                  {editingProduct
                    ? "Save changes"
                    : "Add product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

/* =========================================================
   PRODUCT CARD
========================================================= */

const ProductCard = ({
  product,
  onView,
  onEdit,
  onDelete,
}) => {
  return (
    <article className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
      {/* Product image */}
      <button
        type="button"
        onClick={onView}
        className="relative block aspect-[4/5] w-full overflow-hidden bg-gray-100"
      >
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Package
              size={35}
              className="text-gray-300"
            />
          </div>
        )}

        {/* Status */}
        <span
          className={`
            absolute left-3 top-3
            rounded-full px-2.5 py-1
            text-[9px] font-medium
            shadow-sm
            ${statusStyles[product.status]}
          `}
        >
          {product.status}
        </span>

        {/* Menu */}
        <div
          className="absolute right-3 top-3"
          onClick={(event) =>
            event.stopPropagation()
          }
        >
          <ProductActions
            product={product}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      </button>

      {/* Product information */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <span
              className={`
                inline-flex rounded-full
                px-2 py-1
                text-[9px] font-medium
                ${
                  categoryStyles[
                    product.category
                  ] ||
                  "bg-gray-100 text-gray-700"
                }
              `}
            >
              {product.category}
            </span>

            <h3 className="mt-2 truncate text-sm font-semibold text-gray-900">
              {product.name}
            </h3>
          </div>
        </div>

        <div className="mt-3 flex items-end justify-between gap-3">
          <div>
            <p className="text-base font-semibold text-gray-900">
              {formatPrice(product.price)}
            </p>

            <p className="mt-1 text-[10px] text-gray-400">
              {product.stock}{" "}
              {product.stock === 1
                ? "item"
                : "items"}{" "}
              in stock
            </p>
          </div>

          <button
            type="button"
            onClick={onView}
            className="rounded-lg border border-gray-200 px-3 py-2 text-[10px] font-medium text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
          >
            View
          </button>
        </div>

        {/* Sizes */}
        {product.sizes.length > 0 && (
          <div className="mt-3 flex items-center gap-1.5 overflow-hidden">
            {product.sizes.slice(0, 4).map((size) => (
              <span
                key={size}
                className="rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-[9px] text-gray-500"
              >
                {size}
              </span>
            ))}

            {product.sizes.length > 4 && (
              <span className="text-[9px] text-gray-400">
                +{product.sizes.length - 4}
              </span>
            )}
          </div>
        )}
      </div>
    </article>
  );
};

/* =========================================================
   ACTION MENU
========================================================= */

const ProductActions = ({
  product,
  onView,
  onEdit,
  onDelete,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          setOpen((value) => !value);
        }}
        className="rounded-lg bg-white/95 p-2 text-gray-500 shadow-sm backdrop-blur transition hover:bg-white hover:text-gray-900"
        aria-label={`Actions for ${product.name}`}
      >
        <MoreHorizontal size={16} />
      </button>

      {open && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-30 cursor-default"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          />

          <div className="absolute right-0 top-10 z-40 w-36 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-xl">
            <button
              type="button"
              onClick={() => {
                onView();
                setOpen(false);
              }}
              className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-xs text-gray-600 transition hover:bg-gray-50"
            >
              <Eye size={14} />
              View
            </button>

            <button
              type="button"
              onClick={() => {
                onEdit();
                setOpen(false);
              }}
              className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-xs text-gray-600 transition hover:bg-gray-50"
            >
              <Edit3 size={14} />
              Edit
            </button>

            <button
              type="button"
              onClick={() => {
                onDelete();
                setOpen(false);
              }}
              className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-xs text-red-600 transition hover:bg-red-50"
            >
              <Trash2 size={14} />
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
};

/* =========================================================
   LARGE IMAGE
========================================================= */

const ProductLargeImage = ({
  product,
  small = false,
}) => {
  return (
    <div
      className={`
        relative
        flex w-full items-center justify-center
        overflow-hidden rounded-2xl bg-gray-100
        ${small ? "h-40" : "aspect-[4/5]"}
      `}
    >
      {product.image ? (
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="text-center">
          <Package
            size={small ? 30 : 40}
            className="mx-auto text-gray-300"
          />

          <p className="mt-2 text-[10px] text-gray-400">
            Product image
          </p>
        </div>
      )}

      <span
        className={`
          absolute left-3 top-3
          rounded-full px-2.5 py-1
          text-[9px] font-medium
          ${statusStyles[product.status]}
        `}
      >
        {product.status}
      </span>
    </div>
  );
};

/* =========================================================
   SMALL COMPONENTS
========================================================= */

const SummaryCard = ({
  icon: Icon,
  label,
  value,
}) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-gray-500">
          {label}
        </p>

        <Icon
          size={17}
          strokeWidth={1.8}
          className="text-gray-400"
        />
      </div>

      <p className="mt-2 text-xl font-semibold text-gray-900">
        {value}
      </p>
    </div>
  );
};

const SectionLabel = ({ label }) => {
  return (
    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
      {label}
    </p>
  );
};

const InfoRow = ({
  label,
  value,
}) => {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-gray-100 px-3 py-3 last:border-b-0">
      <span className="text-xs text-gray-400">
        {label}
      </span>

      <span className="max-w-[65%] text-right text-xs font-medium text-gray-700">
        {value}
      </span>
    </div>
  );
};

const FormField = ({
  label,
  children,
}) => {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-gray-700">
        {label}
      </label>

      {children}
    </div>
  );
};

const inputClass =
  "h-10 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-300 focus:bg-white focus:ring-1 focus:ring-gray-200";

export default Products;