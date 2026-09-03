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
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useProducts } from "../hooks/useProducts";
import { useSettings } from "../hooks/useSettings";

/* =========================================================
   HELPERS
========================================================= */

const getStatusFromStock = (stock) => {
  if (stock <= 0) return "Out of stock";
  if (stock <= 4) return "Low stock";
  return "In stock";
};

const formatPrice = (price, currency = "GHS") => {
  return `${currency} ${Number(price).toLocaleString()}`;
};

const statusStyles = {
  "In stock":
    "bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-900/25 dark:text-emerald-300 dark:border-emerald-800",
  "Low stock":
    "bg-amber-50 text-amber-700 border border-amber-100 dark:bg-amber-900/25 dark:text-amber-300 dark:border-amber-800",
  "Out of stock":
    "bg-red-50 text-red-700 border border-red-100 dark:bg-red-900/25 dark:text-red-300 dark:border-red-800",
};

const categoryStyles = {
  Dresses:
    "bg-pink-50 text-pink-700 border border-pink-100 dark:bg-pink-900/25 dark:text-pink-300 dark:border-pink-800",
  Men:
    "bg-blue-50 text-blue-700 border border-blue-100 dark:bg-blue-900/25 dark:text-blue-300 dark:border-blue-800",
  Shoes:
    "bg-orange-50 text-orange-700 border border-orange-100 dark:bg-orange-900/25 dark:text-orange-300 dark:border-orange-800",
  Accessories:
    "bg-violet-50 text-violet-700 border border-violet-100 dark:bg-violet-900/25 dark:text-violet-300 dark:border-violet-800",
};

/* =========================================================
   PRODUCTS
========================================================= */

const Products = () => {
  const {
    products,
    loading,
    error,
    refetch,
    createProduct,
    updateProduct,
    deleteProduct: apiDeleteProduct,
  } = useProducts();

  const { settings } = useSettings();

  const currency = settings?.general?.currency || "GHS";
  const formatPriceWithCurrency = (price) =>
    formatPrice(price, currency);

  const showAvailability =
    settings?.customer?.showAvailability ?? true;

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
      product.stock > 0 &&
      product.stock <= 4
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

  const handleSaveProduct = async (event) => {
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

    try {
      if (editingProduct) {
        const updated = await updateProduct(
          editingProduct.id,
          productData
        );

        if (
          selectedProduct?.id ===
          editingProduct.id
        ) {
          setSelectedProduct(updated);
        }
      } else {
        const newProduct =
          await createProduct(productData);

        setSelectedProduct(newProduct);
      }

      closeForm();
    } catch (err) {
      console.error(
        "Failed to save product:",
        err
      );
    }
  };

  /* =======================================================
     DELETE
  ======================================================= */

  const deleteProduct = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      await apiDeleteProduct(id);

      if (selectedProduct?.id === id) {
        setSelectedProduct(null);
      }
    } catch (err) {
      console.error(
        "Failed to delete product:",
        err
      );
    }
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-gradient-to-br from-violet-50/70 via-white to-pink-50/60 dark:from-surface-950 dark:via-surface-950 dark:to-violet-950/20">

      {/* =================================================
          HEADER
      ================================================== */}

      <header className="shrink-0 border-b border-violet-100/80 bg-white/95 px-4 py-4 shadow-sm backdrop-blur dark:border-violet-900/40 dark:bg-surface-900/95 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div className="min-w-0">
            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 shadow-lg shadow-orange-500/20">
                <ShoppingBag
                  size={19}
                  strokeWidth={2}
                  className="text-white"
                />
              </div>

              <div>
                <h1 className="truncate bg-gradient-to-r from-violet-700 via-purple-600 to-pink-600 bg-clip-text text-lg font-bold text-transparent dark:from-violet-300 dark:via-purple-300 dark:to-pink-300">
                  Products
                </h1>

                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  Manage your products, prices and inventory.
                </p>
              </div>

            </div>
          </div>

          <button
            type="button"
            onClick={openAddForm}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-pink-500 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet-500/25 active:translate-y-0"
          >
            <Plus size={16} />
            Add product
          </button>

        </div>
      </header>

      {/* =================================================
          SUMMARY
      ================================================== */}

      <div className="shrink-0 border-b border-violet-100/70 bg-white/80 px-4 py-4 backdrop-blur dark:border-violet-900/30 dark:bg-surface-900/80 sm:px-6">

        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">

          <SummaryCard
            icon={Package}
            label="Total products"
            value={totalProducts}
            accent="primary"
          />

          <SummaryCard
            icon={CheckCircle2}
            label="In stock"
            value={inStockProducts}
            accent="success"
          />

          <SummaryCard
            icon={AlertTriangle}
            label="Low stock"
            value={lowStockProducts}
            accent="warning"
          />

          <SummaryCard
            icon={XCircle}
            label="Out of stock"
            value={outOfStockProducts}
            accent="error"
          />

        </div>
      </div>

      {/* =================================================
          WORKSPACE
      ================================================== */}

      <div className="min-h-0 flex-1 overflow-hidden p-3 sm:p-4 lg:p-5">

        <div className="flex h-full min-h-0 overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-sm dark:border-violet-900/40 dark:bg-surface-900">

          {/* =================================================
              PRODUCT CATALOG
          ================================================== */}

          <section className="flex h-full min-h-0 min-w-0 flex-1 flex-col">

            {/* Controls */}

            <div className="shrink-0 border-b border-violet-100 bg-gradient-to-r from-violet-50/40 via-white to-pink-50/40 px-4 py-4 dark:border-violet-900/30 dark:from-violet-950/20 dark:via-surface-900 dark:to-pink-950/20 sm:px-5">

              <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">

                {/* Search */}

                <div className="relative w-full xl:max-w-md">

                  <Search
                    size={17}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-violet-400"
                  />

                  <input
                    type="text"
                    value={search}
                    onChange={(event) =>
                      setSearch(event.target.value)
                    }
                    placeholder="Search products"
                    className="h-10 w-full rounded-xl border border-violet-100 bg-white pl-10 pr-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:ring-2 focus:ring-violet-100 dark:border-violet-900/50 dark:bg-surface-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-violet-600 dark:focus:ring-violet-900/30"
                  />

                </div>

                {/* Filters */}

                <div className="flex min-w-0 items-center gap-2 overflow-x-auto pb-1">

                  <div className="flex shrink-0 items-center gap-1.5 text-xs font-medium text-violet-500">
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
                  ].map((filter) => {

                    const filterStyles = {
                      All:
                        activeFilter === filter
                          ? "bg-violet-600 text-white shadow-violet-500/20"
                          : "bg-violet-50 text-violet-700 hover:bg-violet-100 dark:bg-violet-900/20 dark:text-violet-300",

                      "In stock":
                        activeFilter === filter
                          ? "bg-emerald-500 text-white shadow-emerald-500/20"
                          : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-300",

                      "Low stock":
                        activeFilter === filter
                          ? "bg-amber-500 text-white shadow-amber-500/20"
                          : "bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-900/20 dark:text-amber-300",

                      "Out of stock":
                        activeFilter === filter
                          ? "bg-red-500 text-white shadow-red-500/20"
                          : "bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-300",
                    };

                    return (
                      <button
                        key={filter}
                        type="button"
                        onClick={() =>
                          setActiveFilter(filter)
                        }
                        className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm transition hover:-translate-y-0.5 ${filterStyles[filter]}`}
                      >
                        {filter}
                      </button>
                    );
                  })}

                </div>
              </div>
            </div>

            {/* Product Grid */}

            <div className="products-list-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-contain">

              {loading ? (

                <div className="flex min-h-full items-center justify-center px-6 py-16">

                  <div className="text-center">

                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 dark:bg-violet-900/20">
                      <Loader2
                        size={28}
                        className="animate-spin text-violet-500"
                      />
                    </div>

                    <p className="mt-3 text-sm font-medium text-violet-700 dark:text-violet-300">
                      Loading products...
                    </p>

                  </div>

                </div>

              ) : error ? (

                <div className="flex min-h-full items-center justify-center px-6 py-16">

                  <div className="max-w-sm text-center">

                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-900/20">
                      <AlertCircle
                        size={28}
                        className="text-red-500"
                      />
                    </div>

                    <h3 className="mt-3 text-sm font-semibold text-red-700 dark:text-red-300">
                      Failed to load products
                    </h3>

                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {error}
                    </p>

                    <button
                      onClick={refetch}
                      className="mt-3 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600 transition hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-300"
                    >
                      Retry
                    </button>

                  </div>

                </div>

              ) : filteredProducts.length === 0 ? (

                <div className="flex min-h-full items-center justify-center px-6 py-16">

                  <div className="max-w-sm text-center">

                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-50 to-pink-50 dark:from-violet-900/20 dark:to-pink-900/20">
                      <Package
                        size={24}
                        className="text-violet-400"
                      />
                    </div>

                    <h3 className="mt-4 text-sm font-semibold text-slate-700 dark:text-slate-200">
                      No products found
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-slate-400">
                      Try another search or stock filter.
                    </p>

                  </div>

                </div>

              ) : (

                <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 sm:p-5">

                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      currency={currency}
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
            <aside className="hidden h-full min-h-0 w-[350px] shrink-0 flex-col border-l border-violet-100 bg-white dark:border-violet-900/40 dark:bg-surface-900 xl:flex 2xl:w-[380px]">

              {/* Header */}

              <div className="flex shrink-0 items-center justify-between border-b border-violet-100 bg-gradient-to-r from-violet-50/60 to-pink-50/60 px-4 py-4 dark:border-violet-900/30 dark:from-violet-950/20 dark:to-pink-950/20">

                <div>

                  <h2 className="text-sm font-bold text-violet-800 dark:text-violet-200">
                    Product details
                  </h2>

                  <p className="mt-0.5 text-[10px] text-slate-400">
                    Seller management view
                  </p>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedProduct(null)
                  }
                  className="rounded-lg bg-white p-2 text-slate-400 shadow-sm transition hover:bg-red-50 hover:text-red-500 dark:bg-surface-800 dark:hover:bg-red-900/20"
                >
                  <X size={16} />
                </button>

              </div>

              {/* Details */}

              <div className="products-detail-scrollbar min-h-0 flex-1 overflow-y-auto">

                <div className="space-y-5 p-5">

                  <ProductLargeImage
                    product={selectedProduct}
                  />

                  {/* Product title */}

                  <div>

                    <div className="flex flex-wrap items-center gap-2">

                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        {selectedProduct.name}
                      </h3>

                      <span
                        className={`rounded-full px-2 py-1 text-[9px] font-semibold ${statusStyles[selectedProduct.status]}`}
                      >
                        {selectedProduct.status}
                      </span>

                    </div>

                    <p className="mt-2 text-lg font-bold bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent">
                      {formatPriceWithCurrency(
                        selectedProduct.price
                      )}
                    </p>

                  </div>

                  {/* Description */}

                  <div>

                    <SectionLabel label="Description" />

                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      {selectedProduct.description}
                    </p>

                  </div>

                  {/* Product information */}

                  <div>

                    <SectionLabel label="Product information" />

                    <div className="mt-3 overflow-hidden rounded-xl border border-violet-100 dark:border-violet-900/40">

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
                            ? selectedProduct.sizes.join(", ")
                            : "Not specified"
                        }
                      />

                      <InfoRow
                        label="Colours"
                        value={
                          selectedProduct.colors.length
                            ? selectedProduct.colors.join(", ")
                            : "Not specified"
                        }
                      />

                    </div>

                  </div>

                  {/* Customer preview */}

                  <div>

                    <SectionLabel label="Customer storefront preview" />

                    <div className="mt-3 overflow-hidden rounded-2xl border border-pink-100 bg-white shadow-sm dark:border-pink-900/30 dark:bg-surface-800">

                      <ProductLargeImage
                        product={selectedProduct}
                        small
                      />

                      <div className="p-4">

                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {selectedProduct.name}
                        </h4>

                        <p className="mt-1 text-sm font-bold text-pink-600 dark:text-pink-300">
                          {formatPriceWithCurrency(
                            selectedProduct.price
                          )}
                        </p>

                        {showAvailability && (
                          <p className="mt-1 text-[10px] text-emerald-600 dark:text-emerald-300">
                            {selectedProduct.stock}{" "}
                            {selectedProduct.stock === 1
                              ? "item"
                              : "items"}{" "}
                            in stock
                          </p>
                        )}

                        <div className="mt-3 flex flex-wrap gap-1.5">

                          {selectedProduct.sizes.map(
                            (size) => (
                              <span
                                key={size}
                                className="rounded-md border border-violet-100 bg-violet-50 px-2 py-1 text-[10px] font-medium text-violet-700 dark:border-violet-900/40 dark:bg-violet-900/20 dark:text-violet-300"
                              >
                                {size}
                              </span>
                            )
                          )}

                        </div>

                        <button
                          type="button"
                          className="mt-4 w-full rounded-lg bg-gradient-to-r from-violet-600 to-pink-500 py-2.5 text-xs font-semibold text-white shadow-md shadow-violet-500/20 transition hover:-translate-y-0.5 hover:shadow-lg"
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
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-violet-200 bg-violet-50 py-2.5 text-xs font-semibold text-violet-700 transition hover:bg-violet-100 dark:border-violet-800 dark:bg-violet-900/20 dark:text-violet-300 dark:hover:bg-violet-900/40"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-violet-950/40 p-4 backdrop-blur-sm">

          <div className="flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-2xl dark:border-violet-900/40 dark:bg-surface-900">

            {/* Header */}

            <div className="flex shrink-0 items-center justify-between border-b border-violet-100 bg-gradient-to-r from-violet-50 to-pink-50 px-5 py-4 dark:border-violet-900/30 dark:from-violet-950/30 dark:to-pink-950/20">

              <div>

                <h2 className="text-sm font-bold bg-gradient-to-r from-violet-700 to-pink-600 bg-clip-text text-transparent dark:from-violet-300 dark:to-pink-300">
                  {editingProduct
                    ? "Edit product"
                    : "Add product"}
                </h2>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  This information will be used by your storefront and AI assistant.
                </p>

              </div>

              <button
                type="button"
                onClick={closeForm}
                className="rounded-lg bg-white p-2 text-slate-400 shadow-sm transition hover:bg-red-50 hover:text-red-500 dark:bg-surface-800 dark:hover:bg-red-900/20"
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

                  <label className="group relative block cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed border-violet-200 bg-gradient-to-br from-violet-50 to-pink-50 dark:border-violet-800 dark:from-violet-950/20 dark:to-pink-950/20">

                    {formData.image ? (

                      <div className="relative h-56 w-full">

                        <img
                          src={formData.image}
                          alt="Product preview"
                          className="h-full w-full object-cover"
                        />

                        <div className="absolute inset-0 flex items-center justify-center bg-violet-950/40 opacity-0 transition group-hover:opacity-100">

                          <span className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-violet-700 shadow-lg">
                            Change image
                          </span>

                        </div>

                      </div>

                    ) : (

                      <div className="flex h-48 flex-col items-center justify-center">

                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 shadow-lg shadow-violet-500/20">
                          <ImageIcon
                            size={21}
                            className="text-white"
                          />
                        </div>

                        <p className="mt-3 text-xs font-semibold text-violet-700 dark:text-violet-300">
                          Upload product image
                        </p>

                        <p className="mt-1 text-[10px] text-slate-400">
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

                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-violet-500">
                        {currency}
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

                  <p className="mt-1 text-[10px] text-violet-400">
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

                  <p className="mt-1 text-[10px] text-pink-400">
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

              <div className="flex shrink-0 justify-end gap-2 border-t border-violet-100 bg-gradient-to-r from-violet-50/50 to-pink-50/50 px-5 py-4 dark:border-violet-900/30 dark:from-violet-950/20 dark:to-pink-950/20">

                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-surface-800 dark:text-slate-300"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-violet-600 to-pink-500 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-violet-500/20 transition hover:-translate-y-0.5 hover:shadow-lg"
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
  currency = "GHS",
}) => {
  return (
    <article className="group overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl hover:shadow-violet-500/10 dark:border-violet-900/40 dark:bg-surface-900 dark:hover:border-violet-700">

      {/* Product image */}

      <div
        role="button"
        tabIndex={0}
        onClick={onView}
        onKeyDown={(e) => {
          if (
            e.key === "Enter" ||
            e.key === " "
          ) {
            e.preventDefault();
            onView();
          }
        }}
        className="relative block aspect-[4/5] w-full cursor-pointer overflow-hidden bg-gradient-to-br from-violet-100 via-pink-50 to-orange-50 dark:from-violet-950/30 dark:via-pink-950/20 dark:to-orange-950/20"
      >

        {product.image ? (

          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />

        ) : (

          <div className="flex h-full w-full items-center justify-center">

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/80 shadow-lg backdrop-blur dark:bg-surface-800/80">
              <Package
                size={35}
                className="text-violet-400"
              />
            </div>

          </div>
        )}

        {/* Status */}

        <span
          className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[9px] font-semibold shadow-md ${statusStyles[product.status]}`}
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

      </div>

      {/* Product information */}

      <div className="p-4">

        <div className="flex items-start justify-between gap-3">

          <div className="min-w-0">

            <span
              className={`inline-flex rounded-full px-2 py-1 text-[9px] font-semibold ${
                categoryStyles[
                  product.category
                ] ||
                "border border-slate-200 bg-slate-50 text-slate-600"
              }`}
            >
              {product.category}
            </span>

            <h3 className="mt-2 truncate text-sm font-bold text-slate-900 dark:text-white">
              {product.name}
            </h3>

          </div>

        </div>

        <div className="mt-3 flex items-end justify-between gap-3">

          <div>

            <p className="text-base font-bold bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent dark:from-violet-300 dark:to-pink-300">
              {formatPrice(
                product.price,
                currency
              )}
            </p>

            <p className="mt-1 text-[10px] text-slate-400">
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
            className="rounded-lg border border-violet-100 bg-violet-50 px-3 py-2 text-[10px] font-semibold text-violet-700 transition hover:bg-violet-100 dark:border-violet-900/40 dark:bg-violet-900/20 dark:text-violet-300"
          >
            View
          </button>

        </div>

        {/* Sizes */}

        {product.sizes.length > 0 && (

          <div className="mt-3 flex items-center gap-1.5 overflow-hidden">

            {product.sizes
              .slice(0, 4)
              .map((size) => (

                <span
                  key={size}
                  className="rounded-md border border-pink-100 bg-pink-50 px-2 py-1 text-[9px] font-medium text-pink-600 dark:border-pink-900/40 dark:bg-pink-900/20 dark:text-pink-300"
                >
                  {size}
                </span>

              ))}

            {product.sizes.length > 4 && (

              <span className="text-[9px] font-medium text-violet-400">
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
        className="rounded-lg border border-white/80 bg-white/95 p-2 text-violet-500 shadow-md backdrop-blur transition hover:bg-violet-50 hover:text-violet-700 dark:border-surface-700 dark:bg-surface-900/95 dark:text-violet-300 dark:hover:bg-violet-900/30"
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

          <div className="absolute right-0 top-10 z-40 w-36 overflow-hidden rounded-xl border border-violet-100 bg-white py-1 shadow-xl dark:border-violet-900/40 dark:bg-surface-900">

            <button
              type="button"
              onClick={() => {
                onView();
                setOpen(false);
              }}
              className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-xs font-medium text-blue-600 transition hover:bg-blue-50 dark:text-blue-300 dark:hover:bg-blue-900/20"
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
              className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-xs font-medium text-violet-600 transition hover:bg-violet-50 dark:text-violet-300 dark:hover:bg-violet-900/20"
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
              className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-xs font-medium text-red-600 transition hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-900/20"
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
      className={`relative flex w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-violet-100 via-pink-50 to-orange-50 dark:from-violet-950/30 dark:via-pink-950/20 dark:to-orange-950/20 ${
        small
          ? "h-40"
          : "aspect-[4/5]"
      }`}
    >

      {product.image ? (

        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover"
        />

      ) : (

        <div className="text-center">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/80 shadow-lg backdrop-blur dark:bg-surface-800/80">

            <Package
              size={small ? 30 : 40}
              className="text-violet-400"
            />

          </div>

          <p className="mt-2 text-[10px] font-medium text-violet-400">
            Product image
          </p>

        </div>
      )}

      <span
        className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[9px] font-semibold shadow-md ${statusStyles[product.status]}`}
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
  accent = "primary",
}) => {

  const accentMap = {
    primary: {
      card: "from-violet-50 to-purple-50 border-violet-100 dark:from-violet-950/20 dark:to-purple-950/20 dark:border-violet-900/40",
      iconBg: "bg-violet-500",
      iconColor: "text-white",
      value: "text-violet-700 dark:text-violet-300",
    },

    success: {
      card: "from-emerald-50 to-teal-50 border-emerald-100 dark:from-emerald-950/20 dark:to-teal-950/20 dark:border-emerald-900/40",
      iconBg: "bg-emerald-500",
      iconColor: "text-white",
      value: "text-emerald-700 dark:text-emerald-300",
    },

    warning: {
      card: "from-amber-50 to-orange-50 border-amber-100 dark:from-amber-950/20 dark:to-orange-950/20 dark:border-amber-900/40",
      iconBg: "bg-amber-500",
      iconColor: "text-white",
      value: "text-amber-700 dark:text-amber-300",
    },

    error: {
      card: "from-red-50 to-pink-50 border-red-100 dark:from-red-950/20 dark:to-pink-950/20 dark:border-red-900/40",
      iconBg: "bg-red-500",
      iconColor: "text-white",
      value: "text-red-700 dark:text-red-300",
    },
  };

  const accentStyles =
    accentMap[accent] ||
    accentMap.primary;

  return (
    <div
      className={`rounded-2xl border bg-gradient-to-br p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${accentStyles.card}`}
    >

      <div className="flex items-center justify-between">

        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          {label}
        </p>

        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl shadow-md ${accentStyles.iconBg}`}
        >
          <Icon
            size={17}
            strokeWidth={2}
            className={accentStyles.iconColor}
          />
        </div>

      </div>

      <p
        className={`mt-2 text-2xl font-bold ${accentStyles.value}`}
      >
        {value}
      </p>

    </div>
  );
};

const SectionLabel = ({ label }) => {
  return (
    <p className="text-xs font-bold uppercase tracking-wide text-violet-500 dark:text-violet-400">
      {label}
    </p>
  );
};

const InfoRow = ({
  label,
  value,
}) => {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-violet-50 px-3 py-3 last:border-b-0 dark:border-violet-900/20">

      <span className="text-xs text-slate-400">
        {label}
      </span>

      <span className="max-w-[65%] text-right text-xs font-semibold text-slate-700 dark:text-slate-200">
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

      <label className="mb-1.5 block text-xs font-semibold text-violet-700 dark:text-violet-300">
        {label}
      </label>

      {children}

    </div>
  );
};

const inputClass =
  "h-10 w-full rounded-xl border border-violet-100 bg-violet-50/40 px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100 dark:border-violet-900/50 dark:bg-violet-950/10 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-violet-600 dark:focus:bg-surface-800 dark:focus:ring-violet-900/30";

export default Products;