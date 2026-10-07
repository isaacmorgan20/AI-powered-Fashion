    import React, { useEffect, useMemo, useState, useRef } from "react";
    import { useParams } from "react-router-dom";
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
        X,
        ShoppingBag,
        AlertCircle,
        ExternalLink,
        ChevronDown,
        Sparkles,
        RefreshCw,
        Wand2,
        ArrowUpRight,
        TrendingUp,
        TrendingDown,
        Camera,
        Check,
        SlidersHorizontal,
    } from "lucide-react";

    import { useProducts } from "../hooks/useProducts";
    import { useSettings } from "../hooks/useSettings";
    import { uploadProductImage } from "../service/Cloudinary";
    import { Spinner } from "../Components/ui";

    /* -------------------------------------------------------------------------- */
    /* Constants                                                                  */
    /* -------------------------------------------------------------------------- */

    const FILTER_TABS = ["All", "In stock", "Low stock", "Out of stock"];

    const AI_FASHION_PRESETS = [
        {
            label: "Classic Blazer",
            prompt:
                "Luxury tailored beige blazer on modern studio background, editorial fashion shot",
            image:
                "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1200&auto=format&fit=crop",
        },
        {
            label: "White Sneakers",
            prompt:
                "Clean minimalist luxury leather sneakers, bright studio lighting, commercial product shot",
            image:
                "https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=1200&auto=format&fit=crop",
        },
        {
            label: "Leather Handbag",
            prompt:
                "Handcrafted black structured leather tote bag, gold hardware, luxury fashion campaign",
            image:
                "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1200&auto=format&fit=crop",
        },
        {
            label: "Hoodie Jacket",
            prompt:
                "Streetwear charcoal hoodie jacket on clean backdrop, contemporary urban apparel",
            image:
                "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1200&auto=format&fit=crop",
        },
        {
            label: "Summer Dress",
            prompt:
                "Flowing terracotta summer dress, gentle natural lighting, resort fashion aesthetic",
            image:
                "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=1200&auto=format&fit=crop",
        },
        {
            label: "Linen Shirt",
            prompt:
                "Crisp blue tailored linen shirt, premium cotton texture, menswear lookbook",
            image:
                "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1200&auto=format&fit=crop",
        },
    ];

    /* -------------------------------------------------------------------------- */
    /* Helpers                                                                    */
    /* -------------------------------------------------------------------------- */

    const getStatusFromStock = (stock) => {
        const value = Number(stock || 0);

        if (value <= 0) return "Out of stock";
        if (value <= 4) return "Low stock";

        return "In stock";
    };

    const formatPrice = (price, currency = "GHS") =>
        `${currency} ${Number(price || 0).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;

    const toArray = (value, fallback = []) => {
        if (Array.isArray(value)) {
            return value.filter(Boolean);
        }

        if (typeof value === "string") {
            return value
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean);
        }

        return fallback;
    };

    const getProductId = (product) => String(product?.id || "");

    /* -------------------------------------------------------------------------- */
    /* Product Status Badge                                                       */
    /* -------------------------------------------------------------------------- */

    const ProductStatusBadge = ({ stock, compact = false }) => {
        const status = getStatusFromStock(stock);

        const styles = {
            "In stock": "border-emerald-200 bg-emerald-50 text-emerald-700",
            "Low stock": "border-amber-200 bg-amber-50 text-amber-700",
            "Out of stock": "border-rose-200 bg-rose-50 text-rose-700",
        };

        const dots = {
            "In stock": "bg-emerald-500",
            "Low stock": "bg-amber-500",
            "Out of stock": "bg-rose-500",
        };

        return (
            <span
                className={`inline-flex items-center gap-1.5 rounded-full border font-semibold ${
                    compact
                        ? "px-2 py-0.5 text-[10px]"
                        : "px-2.5 py-1 text-[11px]"
                } ${styles[status]}`}
            >
                <span className={`h-1.5 w-1.5 rounded-full ${dots[status]}`} />
                {status}
            </span>
        );
    };

    /* -------------------------------------------------------------------------- */
    /* Product Image                                                              */
    /* -------------------------------------------------------------------------- */

    const ProductImage = ({
        src,
        alt,
        className = "",
        iconSize = 30,
    }) => {
        const [failed, setFailed] = useState(false);

        useEffect(() => {
            setFailed(false);
        }, [src]);

        if (!src || failed) {
            return (
                <div
                    className={`flex h-full w-full items-center justify-center bg-slate-100 text-slate-400 ${className}`}
                >
                    <ShoppingBag size={iconSize} strokeWidth={1.7} />
                </div>
            );
        }

        return (
            <img
                src={src}
                alt={alt || "Product"}
                onError={() => setFailed(true)}
                className={`h-full w-full object-cover ${className}`}
            />
        );
    };

    /* -------------------------------------------------------------------------- */
    /* Stat Card                                                                  */
    /* -------------------------------------------------------------------------- */

    const StatCard = ({
        label,
        value,
        helper,
        icon: Icon,
        tone = "blue",
        trend,
    }) => {
        const toneClasses = {
            blue: "bg-blue-50 text-blue-600",
            green: "bg-emerald-50 text-emerald-600",
            amber: "bg-amber-50 text-amber-600",
            red: "bg-rose-50 text-rose-600",
        };

        return (
            <div className="group rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_1px_3px_rgba(15,23,42,0.04)] transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_8px_24px_rgba(15,23,42,0.06)] sm:p-5">
                <div className="flex items-start justify-between gap-3">
                    <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${toneClasses[tone]}`}
                    >
                        <Icon size={19} strokeWidth={2} />
                    </div>

                    {trend ? (
                        <span
                            className={`inline-flex items-center gap-1 text-[10px] font-semibold ${
                                trend.direction === "down"
                                    ? "text-rose-500"
                                    : "text-emerald-600"
                            }`}
                        >
                            {trend.direction === "down" ? (
                                <TrendingDown size={12} />
                            ) : (
                                <TrendingUp size={12} />
                            )}
                            {trend.value}
                        </span>
                    ) : null}
                </div>

                <div className="mt-4">
                    <p className="text-xs font-medium text-slate-500">{label}</p>

                    <p className="mt-0.5 text-2xl font-extrabold tracking-tight text-slate-900">
                        {value}
                    </p>

                    {helper ? (
                        <p className="mt-1 text-[10px] font-medium text-slate-400">
                            {helper}
                        </p>
                    ) : null}
                </div>
            </div>
        );
    };

    /* -------------------------------------------------------------------------- */
    /* Product Dropdown Menu                                                      */
    /* -------------------------------------------------------------------------- */

    const ProductDropdownMenu = ({
        onView,
        onEdit,
        onDelete,
    }) => {
        const [open, setOpen] = useState(false);

        return (
            <div className="relative">
                <button
                    type="button"
                    aria-label="Product actions"
                    onClick={(event) => {
                        event.stopPropagation();
                        setOpen((value) => !value);
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200/80 bg-white/95 text-slate-600 shadow-sm backdrop-blur transition duration-150 hover:bg-white hover:text-slate-900"
                >
                    <MoreHorizontal size={16} />
                </button>

                {open ? (
                    <>
                        <button
                            type="button"
                            aria-label="Close product actions"
                            className="fixed inset-0 z-40 h-full w-full cursor-default"
                            onClick={(event) => {
                                event.stopPropagation();
                                setOpen(false);
                            }}
                        />

                        <div
                            className="absolute right-0 top-10 z-50 w-40 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 text-xs font-medium shadow-[0_12px_35px_rgba(15,23,42,0.14)]"
                            onClick={(event) => event.stopPropagation()}
                        >
                            <button
                                type="button"
                                onClick={() => {
                                    onView();
                                    setOpen(false);
                                }}
                                className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-slate-700 transition hover:bg-slate-50"
                            >
                                <Eye size={13} />
                                View details
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    onEdit();
                                    setOpen(false);
                                }}
                                className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-slate-700 transition hover:bg-slate-50"
                            >
                                <Edit3 size={13} />
                                Edit product
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    onDelete();
                                    setOpen(false);
                                }}
                                className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-rose-600 transition hover:bg-rose-50"
                            >
                                <Trash2 size={13} />
                                Delete product
                            </button>
                        </div>
                    </>
                ) : null}
            </div>
        );
    };

    /* -------------------------------------------------------------------------- */
    /* Main Products Page                                                         */
    /* -------------------------------------------------------------------------- */

    const Products = () => {
        const {
            products: apiProducts,
            loading,
            error,
            refetch,
            createProduct,
            updateProduct,
            deleteProduct: apiDeleteProduct,
            isOnline,
        } = useProducts();

        const { settings } = useSettings();

        const products = Array.isArray(apiProducts) ? apiProducts : [];

        const currency = settings?.general?.currency || "GHS";
        const sellerId = settings?.general?.sellerId || "store";
        const showAvailability =
            settings?.customer?.showAvailability ?? true;

        /* ---------------------------------------------------------------------- */
        /* Page State                                                             */
        /* ---------------------------------------------------------------------- */

        const [search, setSearch] = useState("");
        const [activeFilter, setActiveFilter] = useState("All");
        const [sortBy, setSortBy] = useState("Newest");
        const [selectedProduct, setSelectedProduct] = useState(null);

        // Deep link: /products/:id (used by notification clicks)
        const { id: routeProductId } = useParams();
        const appliedRouteProductRef = useRef(null);

        /* ---------------------------------------------------------------------- */
        /* Product Form State                                                     */
        /* ---------------------------------------------------------------------- */

        const [showProductForm, setShowProductForm] = useState(false);
        const [editingProduct, setEditingProduct] = useState(null);
        const [saving, setSaving] = useState(false);
        const [formError, setFormError] = useState("");

        /* ---------------------------------------------------------------------- */
        /* Image / AI State                                                       */
        /* ---------------------------------------------------------------------- */

        const [imageMode, setImageMode] = useState("upload");
        const [aiPrompt, setAiPrompt] = useState("");
        const [isGeneratingAI, setIsGeneratingAI] = useState(false);

        const [formData, setFormData] = useState({
            name: "",
            category: "Women's Fashion",
            price: "",
            stock: "",
            sizes: "",
            colors: "",
            description: "",
            image: "",
        });

        const [imageFile, setImageFile] = useState(null);
        const [imagePreview, setImagePreview] = useState(null);
        const [imageUploading, setImageUploading] = useState(false);
        const [imageUploadError, setImageUploadError] = useState("");
        const [activeThumbnailIndex, setActiveThumbnailIndex] = useState(0);

        /* ---------------------------------------------------------------------- */
        /* Inventory Stats                                                        */
        /* ---------------------------------------------------------------------- */

        const totalCount = products.length;

        const inStockCount = products.filter(
            (product) => Number(product.stock) > 4
        ).length;

        const lowStockCount = products.filter(
            (product) =>
                Number(product.stock) > 0 &&
                Number(product.stock) <= 4
        ).length;

        const outOfStockCount = products.filter(
            (product) => Number(product.stock) <= 0
        ).length;

        /* ---------------------------------------------------------------------- */
        /* Filter + Search + Sort                                                 */
        /* ---------------------------------------------------------------------- */

        const filteredProducts = useMemo(() => {
            const query = search.toLowerCase().trim();

            const list = products.filter((product) => {
                const name = String(product.name || "").toLowerCase();
                const category = String(product.category || "").toLowerCase();
                const stock = Number(product.stock || 0);

                const matchesSearch =
                    !query ||
                    name.includes(query) ||
                    category.includes(query);

                let matchesFilter = true;

                if (activeFilter === "In stock") {
                    matchesFilter = stock > 4;
                }

                if (activeFilter === "Low stock") {
                    matchesFilter = stock > 0 && stock <= 4;
                }

                if (activeFilter === "Out of stock") {
                    matchesFilter = stock <= 0;
                }

                return matchesSearch && matchesFilter;
            });

            return [...list].sort((a, b) => {
                if (sortBy === "Price: Low to High") {
                    return (
                        Number(a.price || 0) -
                        Number(b.price || 0)
                    );
                }

                if (sortBy === "Price: High to Low") {
                    return (
                        Number(b.price || 0) -
                        Number(a.price || 0)
                    );
                }

                if (sortBy === "Name A-Z") {
                    return String(a.name || "").localeCompare(
                        String(b.name || "")
                    );
                }

                if (sortBy === "Stock Level") {
                    return (
                        Number(b.stock || 0) -
                        Number(a.stock || 0)
                    );
                }

                const dateA = new Date(
                    a.createdAt?.seconds
                        ? a.createdAt.seconds * 1000
                        : a.createdAt || 0
                ).getTime();

                const dateB = new Date(
                    b.createdAt?.seconds
                        ? b.createdAt.seconds * 1000
                        : b.createdAt || 0
                ).getTime();

                return dateB - dateA;
            });
        }, [
            products,
            search,
            activeFilter,
            sortBy,
        ]);

        /* ---------------------------------------------------------------------- */
        /* Keep Selected Product In Sync                                          */
        /* ---------------------------------------------------------------------- */

        useEffect(() => {
            // Deep linked product (/products/:id) takes priority over auto-select
            if (
                routeProductId &&
                appliedRouteProductRef.current !== routeProductId
            ) {
                const deepLinked = products.find(
                    (product) =>
                        getProductId(product) === routeProductId
                );

                if (deepLinked) {
                    appliedRouteProductRef.current = routeProductId;
                    setSelectedProduct(deepLinked);
                    return;
                }
            }

            if (!selectedProduct) {
                if (filteredProducts.length > 0) {
                    setSelectedProduct(filteredProducts[0]);
                }

                return;
            }

            const freshSelected = products.find(
                (product) =>
                    getProductId(product) ===
                    getProductId(selectedProduct)
            );

            if (!freshSelected) {
                setSelectedProduct(
                    filteredProducts[0] || null
                );
            } else if (freshSelected !== selectedProduct) {
                setSelectedProduct(freshSelected);
            }
        }, [
            products,
            filteredProducts,
            selectedProduct,
            routeProductId,
        ]);

        useEffect(() => {
            setActiveThumbnailIndex(0);
        }, [selectedProduct?.id]);

        /* ---------------------------------------------------------------------- */
        /* Cleanup Image Preview                                                  */
        /* ---------------------------------------------------------------------- */

        useEffect(() => {
            return () => {
                if (
                    imagePreview?.startsWith("blob:")
                ) {
                    URL.revokeObjectURL(imagePreview);
                }
            };
        }, [imagePreview]);

        /* ---------------------------------------------------------------------- */
        /* Product Gallery                                                        */
        /* ---------------------------------------------------------------------- */

        const currentThumbnails = useMemo(() => {
            if (!selectedProduct) return [];

            if (
                Array.isArray(selectedProduct.thumbnails) &&
                selectedProduct.thumbnails.length
            ) {
                return selectedProduct.thumbnails.filter(Boolean);
            }

            if (selectedProduct.image) {
                return [selectedProduct.image];
            }

            return [];
        }, [selectedProduct]);

        const activeMainImage =
            currentThumbnails[activeThumbnailIndex] ||
            selectedProduct?.image ||
            "";

        /* ---------------------------------------------------------------------- */
        /* Form Helpers                                                           */
        /* ---------------------------------------------------------------------- */

        const resetForm = () => {
            setFormData({
                name: "",
                category: "Women's Fashion",
                price: "",
                stock: "",
                sizes: "",
                colors: "",
                description: "",
                image: "",
            });

            setEditingProduct(null);
            setImageFile(null);
            setImagePreview(null);
            setImageUploading(false);
            setImageUploadError("");
            setFormError("");
            setSaving(false);
            setImageMode("upload");
            setAiPrompt("");
            setIsGeneratingAI(false);
        };

        const openAddForm = () => {
            resetForm();
            setShowProductForm(true);
        };

        const openEditForm = (product) => {
            setEditingProduct(product);

            setFormData({
                name: product.name || "",
                category:
                    product.category || "Women's Fashion",
                price: String(product.price ?? ""),
                stock: String(product.stock ?? ""),
                sizes: toArray(product.sizes).join(", "),
                colors: toArray(product.colors).join(", "),
                description: product.description || "",
                image: product.image || "",
            });

            setImageFile(null);
            setImagePreview(product.image || null);
            setImageUploading(false);
            setImageUploadError("");
            setFormError("");
            setSaving(false);
            setImageMode("upload");
            setAiPrompt("");
            setShowProductForm(true);
        };

        const closeForm = () => {
            if (
                saving ||
                imageUploading ||
                isGeneratingAI
            ) {
                return;
            }

            setShowProductForm(false);
            resetForm();
        };

        const handleFormChange = (event) => {
            const { name, value } = event.target;

            setFormData((previous) => ({
                ...previous,
                [name]: value,
            }));

            if (formError) {
                setFormError("");
            }
        };

        /* ---------------------------------------------------------------------- */
        /* Image Upload                                                           */
        /* ---------------------------------------------------------------------- */

        const handleImageUpload = (event) => {
            const file = event.target.files?.[0];

            if (!file) return;

            if (!file.type.startsWith("image/")) {
                setImageUploadError(
                    "Please select a valid image file."
                );
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                setImageUploadError(
                    "Image size must be less than 5MB."
                );
                return;
            }

            setImageUploadError("");
            setImageFile(file);

            if (imagePreview?.startsWith("blob:")) {
                URL.revokeObjectURL(imagePreview);
            }

            setImagePreview(
                URL.createObjectURL(file)
            );

            setFormData((previous) => ({
                ...previous,
                image: "",
            }));
        };

        /* ---------------------------------------------------------------------- */
        /* AI Image Studio                                                        */
        /* ---------------------------------------------------------------------- */

        const handleGenerateAIImage = (
            presetPrompt,
            presetImage
        ) => {
            const promptToUse =
                presetPrompt || aiPrompt;

            if (
                !promptToUse.trim() &&
                !presetImage
            ) {
                setImageUploadError(
                    "Select a style preset or enter a description for the image."
                );
                return;
            }

            setIsGeneratingAI(true);
            setImageUploadError("");

            window.setTimeout(() => {
                const found =
                    AI_FASHION_PRESETS.find((preset) =>
                        promptToUse
                            .toLowerCase()
                            .includes(
                                preset.label.toLowerCase()
                            )
                    );

                const chosenUrl =
                    presetImage ||
                    found?.image ||
                    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop";

                setImagePreview(chosenUrl);

                setFormData((previous) => ({
                    ...previous,
                    image: chosenUrl,
                }));

                setImageFile(null);
                setIsGeneratingAI(false);
            }, 900);
        };

        /* ---------------------------------------------------------------------- */
        /* Prepare Product Data                                                   */
        /* ---------------------------------------------------------------------- */

        const prepareProductData = (imageUrl) => {
            const price = Number(formData.price);
            const stock = Number(formData.stock);

            return {
                name: formData.name.trim(),
                category: formData.category,
                price,
                stock,
                sizes: toArray(
                    formData.sizes,
                    ["One Size"]
                ),
                colors: toArray(
                    formData.colors,
                    ["#1e293b"]
                ),
                description:
                    formData.description.trim(),
                status: getStatusFromStock(stock),
                image: imageUrl || null,
            };
        };

        /* ---------------------------------------------------------------------- */
        /* Save Product                                                           */
        /* ---------------------------------------------------------------------- */

        const handleSaveProduct = async (event) => {
            event.preventDefault();

            setFormError("");
            setImageUploadError("");

            if (
                !formData.name.trim() ||
                !formData.price ||
                formData.stock === ""
            ) {
                setFormError(
                    "Please enter the product name, price and stock quantity."
                );
                return;
            }

            const price = Number(formData.price);
            const stock = Number(formData.stock);

            if (
                !Number.isFinite(price) ||
                price < 0
            ) {
                setFormError(
                    "Please enter a valid product price."
                );
                return;
            }

            if (
                !Number.isFinite(stock) ||
                stock < 0
            ) {
                setFormError(
                    "Please enter a valid stock quantity."
                );
                return;
            }

            if (
                imagePreview?.startsWith("blob:") &&
                !imageFile
            ) {
                setFormError(
                    "Please select the product image again before saving."
                );
                return;
            }

            try {
                setSaving(true);

                /*
                * Upload a new local image BEFORE creating/updating Firestore.
                * This prevents blob: URLs from ever being saved.
                */
                let imageUrl =
                    formData.image ||
                    editingProduct?.image ||
                    "";

                if (imageFile) {
                    setImageUploading(true);

                    try {
                        imageUrl =
                            await uploadProductImage(
                                imageFile
                            );

                        if (
                            !imageUrl ||
                            imageUrl.startsWith("blob:")
                        ) {
                            throw new Error(
                                "Cloudinary did not return a valid image URL."
                            );
                        }

                        setFormData(
                            (previous) => ({
                                ...previous,
                                image: imageUrl,
                            })
                        );

                        setImagePreview(imageUrl);
                    } catch (uploadError) {
                        console.error(
                            "Cloudinary upload failed:",
                            uploadError
                        );

                        setFormError(
                            uploadError?.message ||
                                "Image upload failed. The product was not saved."
                        );

                        return;
                    } finally {
                        setImageUploading(false);
                    }
                }

                const productData =
                    prepareProductData(imageUrl);

                let savedProduct;

                if (editingProduct) {
                    savedProduct =
                        await updateProduct(
                            editingProduct.id,
                            productData
                        );
                } else {
                    savedProduct =
                        await createProduct(
                            productData
                        );
                }

                if (!savedProduct) {
                    throw new Error(
                        "The product could not be saved."
                    );
                }

                if (refetch) {
                    await refetch();
                }

                setSelectedProduct(
                    savedProduct
                );

                setShowProductForm(false);
                resetForm();
            } catch (saveError) {
                console.error(
                    "Failed to save product:",
                    saveError
                );

                setFormError(
                    saveError?.response?.data
                        ?.detail ||
                        saveError?.message ||
                        "Failed to save product. Please try again."
                );
            } finally {
                setSaving(false);
            }
        };

        /* ---------------------------------------------------------------------- */
        /* Delete Product                                                         */
        /* ---------------------------------------------------------------------- */

        const handleDeleteProduct = async (id) => {
            const product = products.find(
                (item) =>
                    getProductId(item) ===
                    String(id)
            );

            if (
                !window.confirm(
                    `Delete "${
                        product?.name ||
                        "this product"
                    }"? This action cannot be undone.`
                )
            ) {
                return;
            }

            try {
                await apiDeleteProduct(id);

                if (
                    selectedProduct?.id === id
                ) {
                    setSelectedProduct(null);
                }

                if (refetch) {
                    await refetch();
                }
            } catch (deleteError) {
                console.error(
                    "Failed to delete product:",
                    deleteError
                );

                window.alert(
                    deleteError?.response
                        ?.data?.detail ||
                        deleteError?.message ||
                        "Failed to delete product. Please try again."
                );
            }
        };

        /* ---------------------------------------------------------------------- */
        /* Render                                                                 */
        /* ---------------------------------------------------------------------- */

        return (
            <div className="min-h-full w-full scroll-smooth bg-[#f7f9fc] text-slate-900 [scroll-behavior:smooth]">
                <div className="mx-auto flex min-h-full w-full max-w-[1800px] flex-col xl:flex-row">
                    {/* ================================================================== */}
                    {/* MAIN CONTENT                                                       */}
                    {/* ================================================================== */}

                    <main className="min-w-0 flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 lg:p-7">
                        <div className="space-y-6">
                            {/* ========================================================== */}
                            {/* HEADER                                                      */}
                            {/* ========================================================== */}

                            <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex min-w-0 items-center gap-3.5">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-[0_8px_20px_rgba(37,99,235,0.18)]">
                                        <ShoppingBag
                                            size={23}
                                            strokeWidth={2.1}
                                        />
                                    </div>

                                    <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h1 className="text-2xl font-extrabold tracking-tight text-slate-950">
                                                Products
                                            </h1>

                                            <span className="rounded-full border border-blue-100 bg-blue-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-blue-600">
                                                Fashion & Apparel
                                            </span>
                                        </div>

                                        <p className="mt-0.5 max-w-2xl text-xs leading-5 text-slate-500 sm:text-sm">
                                            Manage your fashion catalog,
                                            inventory and storefront
                                            products.
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={openAddForm}
                                    className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-[0_4px_12px_rgba(37,99,235,0.16)] transition duration-200 hover:bg-blue-700 hover:shadow-[0_6px_16px_rgba(37,99,235,0.2)] active:scale-[0.98] active:bg-blue-800"
                                >
                                    <Plus
                                        size={18}
                                        strokeWidth={2.4}
                                    />
                                    Add Product
                                </button>
                            </header>

                            {/* ========================================================== */}
                            {/* STATS                                                        */}
                            {/* ========================================================== */}

                            <section className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
                                <StatCard
                                    label="Total Products"
                                    value={totalCount}
                                    helper="Products in your catalog"
                                    icon={Package}
                                    tone="blue"
                                />

                                <StatCard
                                    label="In Stock"
                                    value={inStockCount}
                                    helper="More than 4 units"
                                    icon={CheckCircle2}
                                    tone="green"
                                />

                                <StatCard
                                    label="Low Stock"
                                    value={lowStockCount}
                                    helper="1–4 units remaining"
                                    icon={AlertTriangle}
                                    tone="amber"
                                />

                                <StatCard
                                    label="Out of Stock"
                                    value={outOfStockCount}
                                    helper="Needs replenishment"
                                    icon={XCircle}
                                    tone="red"
                                />
                            </section>

                            {/* ========================================================== */}
                            {/* SEARCH + FILTERS                                            */}
                            {/* ========================================================== */}

                            <section className="rounded-2xl border border-slate-200/80 bg-white p-3 shadow-[0_1px_3px_rgba(15,23,42,0.03)] sm:p-3.5">
                                <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                                    <div className="relative min-w-0 flex-1 xl:max-w-md">
                                        <Search
                                            size={16}
                                            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                        />

                                        <input
                                            type="search"
                                            value={search}
                                            onChange={(event) =>
                                                setSearch(
                                                    event.target.value
                                                )
                                            }
                                            placeholder="Search products or categories..."
                                            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-9 text-xs font-medium text-slate-800 outline-none transition duration-200 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10"
                                        />

                                        {search ? (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setSearch("")
                                                }
                                                className="absolute right-2.5 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
                                                aria-label="Clear search"
                                            >
                                                <X size={13} />
                                            </button>
                                        ) : null}
                                    </div>

                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                                        <div className="scrollbar-thin flex max-w-full items-center gap-1 overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 p-1 [scroll-behavior:smooth]">
                                            {FILTER_TABS.map(
                                                (tab) => (
                                                    <button
                                                        key={tab}
                                                        type="button"
                                                        onClick={() =>
                                                            setActiveFilter(
                                                                tab
                                                            )
                                                        }
                                                        className={`shrink-0 rounded-lg px-3 py-1.5 text-[11px] font-semibold transition duration-150 ${
                                                            activeFilter ===
                                                            tab
                                                                ? "bg-blue-600 text-white shadow-sm"
                                                                : "text-slate-500 hover:bg-white hover:text-slate-800"
                                                        }`}
                                                    >
                                                        {tab}
                                                    </button>
                                                )
                                            )}
                                        </div>

                                        <div className="relative shrink-0">
                                            <SlidersHorizontal
                                                size={14}
                                                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                            />

                                            <select
                                                value={sortBy}
                                                onChange={(event) =>
                                                    setSortBy(
                                                        event.target.value
                                                    )
                                                }
                                                className="h-9 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-8 pr-8 text-[11px] font-semibold text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 sm:w-auto"
                                            >
                                                <option value="Newest">
                                                    Newest
                                                </option>

                                                <option value="Price: Low to High">
                                                    Price: Low to High
                                                </option>

                                                <option value="Price: High to Low">
                                                    Price: High to Low
                                                </option>

                                                <option value="Name A-Z">
                                                    Name A-Z
                                                </option>

                                                <option value="Stock Level">
                                                    Stock Level
                                                </option>
                                            </select>

                                            <ChevronDown
                                                size={13}
                                                className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* ========================================================== */}
                            {/* ERROR / OFFLINE STATE                                      */}
                            {/* ========================================================== */}

                            {error &&
                            products.length === 0 ? (
                                <div className="flex flex-col gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-800 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex items-start gap-2.5">
                                        <AlertCircle
                                            size={17}
                                            className="mt-0.5 shrink-0"
                                        />

                                        <div>
                                            <p className="text-xs font-bold">
                                                Unable to load
                                                your products
                                            </p>

                                            <p className="mt-0.5 text-[11px] leading-5 opacity-80">
                                                {error?.message ||
                                                    "Please try again."}
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            refetch?.()
                                        }
                                        className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-rose-200 bg-white px-3 text-xs font-semibold text-rose-700 transition hover:bg-rose-50"
                                    >
                                        <RefreshCw
                                            size={13}
                                        />
                                        Retry
                                    </button>
                                </div>
                            ) : (
                                <>
                                    {(error ||
                                        !isOnline) &&
                                    products.length > 0 ? (
                                        <div className="flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-800 sm:flex-row sm:items-center sm:justify-between">
                                            <div className="flex items-start gap-2.5">
                                                <AlertTriangle
                                                    size={17}
                                                    className="mt-0.5 shrink-0"
                                                />

                                                <div>
                                                    <p className="text-xs font-bold">
                                                        {!isOnline
                                                            ? "Offline — showing saved data"
                                                            : "Connection issue"}
                                                    </p>

                                                    <p className="mt-0.5 text-[11px] leading-5 opacity-80">
                                                        {error?.message ||
                                                            "Using cached product data"}
                                                    </p>
                                                </div>
                                            </div>

                                            {isOnline &&
                                            error ? (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        refetch?.()
                                                    }
                                                    className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-amber-200 bg-white px-3 text-xs font-semibold text-amber-700 transition hover:bg-amber-50"
                                                >
                                                    <RefreshCw
                                                        size={13}
                                                    />
                                                    Retry
                                                </button>
                                            ) : null}
                                        </div>
                                    ) : null}

                                    {/* ================================================== */}
                                    {/* LOADING                                            */}
                                    {/* ================================================== */}

                                    {loading ? (
                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                                            {Array.from({
                                                length: 8,
                                            }).map(
                                                (_, index) => (
                                                    <div
                                                        key={
                                                            index
                                                        }
                                                        className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                                                    >
                                                        <div className="aspect-[4/3] animate-pulse bg-slate-100" />

                                                        <div className="space-y-3 p-4">
                                                            <div className="h-3 w-2/3 animate-pulse rounded bg-slate-100" />
                                                            <div className="h-3 w-1/2 animate-pulse rounded bg-slate-100" />
                                                            <div className="h-4 w-1/3 animate-pulse rounded bg-slate-100" />
                                                            <div className="h-8 w-full animate-pulse rounded-xl bg-slate-100" />
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    ) : filteredProducts.length ===
                                    0 ? (
                                        /* ============================================== */
                                        /* EMPTY STATE                                     */
                                        /* ============================================== */

                                        <div className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center">
                                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                                                {search ||
                                                activeFilter !==
                                                    "All" ? (
                                                    <Search
                                                        size={25}
                                                    />
                                                ) : (
                                                    <Package
                                                        size={25}
                                                    />
                                                )}
                                            </div>

                                            <h3 className="mt-4 text-base font-bold text-slate-900">
                                                {search ||
                                                activeFilter !==
                                                    "All"
                                                    ? "No matching products"
                                                    : "Your catalog is empty"}
                                            </h3>

                                            <p className="mt-1 max-w-md text-xs leading-5 text-slate-500">
                                                {search ||
                                                activeFilter !==
                                                    "All"
                                                    ? "Try a different search term or clear the stock filter."
                                                    : "Add your first fashion product to start building your ThreadOS catalog."}
                                            </p>

                                            {search ||
                                            activeFilter !==
                                                "All" ? (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setSearch(
                                                            ""
                                                        );
                                                        setActiveFilter(
                                                            "All"
                                                        );
                                                    }}
                                                    className="mt-4 inline-flex h-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                                                >
                                                    Clear filters
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={
                                                        openAddForm
                                                    }
                                                    className="mt-4 inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-xs font-semibold text-white transition hover:bg-blue-700"
                                                >
                                                    <Plus
                                                        size={14}
                                                    />
                                                    Add Product
                                                </button>
                                            )}
                                        </div>
                                    ) : (
                                        /* ============================================== */
                                        /* PRODUCT GRID                                    */
                                        /* ============================================== */

                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                                            {filteredProducts.map(
                                                (product) => {
                                                    const stock =
                                                        Number(
                                                            product.stock ||
                                                                0
                                                        );

                                                    const isSelected =
                                                        getProductId(
                                                            selectedProduct
                                                        ) ===
                                                        getProductId(
                                                            product
                                                        );

                                                    const sizes =
                                                        toArray(
                                                            product.sizes
                                                        );

                                                    return (
                                                        <article
                                                            key={getProductId(
                                                                product
                                                            )}
                                                            onClick={() =>
                                                                setSelectedProduct(
                                                                    product
                                                                )
                                                            }
                                                            className={`group cursor-pointer overflow-hidden rounded-2xl border bg-white transition duration-200 ${
                                                                isSelected
                                                                    ? "border-blue-500 shadow-[0_8px_25px_rgba(37,99,235,0.12)] ring-2 ring-blue-500/10"
                                                                    : "border-slate-200/90 shadow-[0_1px_3px_rgba(15,23,42,0.04)] hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_10px_28px_rgba(15,23,42,0.08)]"
                                                            }`}
                                                        >
                                                            <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                                                                <ProductImage
                                                                    src={
                                                                        product.image
                                                                    }
                                                                    alt={
                                                                        product.name
                                                                    }
                                                                    className="transition duration-500 group-hover:scale-[1.035]"
                                                                />

                                                                <div className="absolute left-3 top-3">
                                                                    <ProductStatusBadge
                                                                        stock={
                                                                            stock
                                                                        }
                                                                        compact
                                                                    />
                                                                </div>

                                                                <div
                                                                    className="absolute right-3 top-3"
                                                                    onClick={(
                                                                        event
                                                                    ) =>
                                                                        event.stopPropagation()
                                                                    }
                                                                >
                                                                    <ProductDropdownMenu
                                                                        onView={() =>
                                                                            setSelectedProduct(
                                                                                product
                                                                            )
                                                                        }
                                                                        onEdit={() =>
                                                                            openEditForm(
                                                                                product
                                                                            )
                                                                        }
                                                                        onDelete={() =>
                                                                            handleDeleteProduct(
                                                                                product.id
                                                                            )
                                                                        }
                                                                    />
                                                                </div>

                                                                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/35 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
                                                            </div>

                                                            <div className="p-4">
                                                                <div className="flex items-start justify-between gap-3">
                                                                    <div className="min-w-0">
                                                                        <h3 className="truncate text-sm font-bold text-slate-900">
                                                                            {product.name ||
                                                                                "Untitled product"}
                                                                        </h3>

                                                                        <p className="mt-0.5 truncate text-[11px] font-medium text-blue-600">
                                                                            {product.category ||
                                                                                "Fashion"}
                                                                        </p>
                                                                    </div>

                                                                    <p className="shrink-0 text-sm font-extrabold text-blue-600">
                                                                        {formatPrice(
                                                                            product.price,
                                                                            currency
                                                                        )}
                                                                    </p>
                                                                </div>

                                                                <div className="mt-3 flex items-center justify-between gap-3">
                                                                    <p
                                                                        className={`text-[11px] font-semibold ${
                                                                            stock <=
                                                                            0
                                                                                ? "text-rose-600"
                                                                                : stock <=
                                                                                    4
                                                                                ? "text-amber-600"
                                                                                : "text-emerald-600"
                                                                        }`}
                                                                    >
                                                                        {showAvailability
                                                                            ? stock >
                                                                            0
                                                                                ? `${stock} in stock`
                                                                                : "Out of stock"
                                                                            : "Availability hidden"}
                                                                    </p>

                                                                    {sizes.length >
                                                                    0 ? (
                                                                        <div className="flex min-w-0 items-center gap-1">
                                                                            {sizes
                                                                                .slice(
                                                                                    0,
                                                                                    3
                                                                                )
                                                                                .map(
                                                                                    (
                                                                                        size,
                                                                                        index
                                                                                    ) => (
                                                                                        <span
                                                                                            key={`${size}-${index}`}
                                                                                            className="rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[9px] font-semibold text-slate-600"
                                                                                        >
                                                                                            {
                                                                                                size
                                                                                            }
                                                                                        </span>
                                                                                    )
                                                                                )}

                                                                            {sizes.length >
                                                                            3 ? (
                                                                                <span className="text-[9px] font-semibold text-slate-400">
                                                                                    +
                                                                                    {sizes.length -
                                                                                        3}
                                                                                </span>
                                                                            ) : null}
                                                                        </div>
                                                                    ) : null}
                                                                </div>

                                                                <div
                                                                    className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3"
                                                                    onClick={(
                                                                        event
                                                                    ) =>
                                                                        event.stopPropagation()
                                                                    }
                                                                >
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            openEditForm(
                                                                                product
                                                                            )
                                                                        }
                                                                        className="inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-3 text-[11px] font-semibold text-white transition duration-150 hover:bg-blue-700 active:scale-[0.98]"
                                                                    >
                                                                        <Edit3
                                                                            size={
                                                                                13
                                                                            }
                                                                            className="text-white"
                                                                        />
                                                                        Edit
                                                                    </button>

                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            handleDeleteProduct(
                                                                                product.id
                                                                            )
                                                                        }
                                                                        aria-label={`Delete ${
                                                                            product.name ||
                                                                            "product"
                                                                        }`}
                                                                        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-rose-200 text-rose-500 transition duration-150 hover:bg-rose-50 active:scale-[0.96]"
                                                                    >
                                                                        <Trash2
                                                                            size={
                                                                                14
                                                                            }
                                                                        />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </article>
                                                    );
                                                }
                                            )}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </main>

                    {/* ================================================================== */}
                    {/* PRODUCT DETAILS PANEL                                               */}
                    {/* ================================================================== */}

                    {selectedProduct ? (
                        <aside className="w-full shrink-0 border-t border-slate-200 bg-white xl:w-[400px] xl:border-l xl:border-t-0">
                            <div className="flex max-h-none min-h-0 flex-col xl:sticky xl:top-0 xl:h-screen xl:max-h-screen">
                                <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-5 py-4">
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                                            Product details
                                        </p>

                                        <p className="mt-0.5 text-xs font-medium text-slate-500">
                                            Catalog and storefront
                                            view
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setSelectedProduct(
                                                null
                                            )
                                        }
                                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition duration-150 hover:bg-slate-100 hover:text-slate-700"
                                        aria-label="Close product details"
                                    >
                                        <X size={17} />
                                    </button>
                                </div>

                                <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-5 scroll-smooth [scroll-behavior:smooth]">
                                    {/* -------------------------------------------------- */}
                                    {/* IMAGE GALLERY                                      */}
                                    {/* -------------------------------------------------- */}

                                    <div className="flex gap-2.5">
                                        <div className="flex w-14 shrink-0 flex-col gap-2">
                                            {currentThumbnails
                                                .slice(0, 3)
                                                .map(
                                                    (
                                                        thumbnail,
                                                        index
                                                    ) => (
                                                        <button
                                                            key={`${thumbnail}-${index}`}
                                                            type="button"
                                                            onClick={() =>
                                                                setActiveThumbnailIndex(
                                                                    index
                                                                )
                                                            }
                                                            className={`h-14 w-14 overflow-hidden rounded-xl border-2 bg-slate-100 transition duration-150 ${
                                                                activeThumbnailIndex ===
                                                                index
                                                                    ? "border-blue-600 ring-2 ring-blue-500/10"
                                                                    : "border-slate-200 opacity-70 hover:opacity-100"
                                                            }`}
                                                        >
                                                            <ProductImage
                                                                src={
                                                                    thumbnail
                                                                }
                                                                alt={`${selectedProduct.name || "Product"} thumbnail ${
                                                                    index +
                                                                    1
                                                                }`}
                                                                iconSize={
                                                                    18
                                                                }
                                                            />
                                                        </button>
                                                    )
                                                )}
                                        </div>

                                        <div className="relative aspect-[4/5] min-w-0 flex-1 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                                            <ProductImage
                                                src={
                                                    activeMainImage
                                                }
                                                alt={
                                                    selectedProduct.name
                                                }
                                                className="object-cover"
                                                iconSize={38}
                                            />

                                            <div className="absolute right-3 top-3">
                                                <ProductStatusBadge
                                                    stock={
                                                        selectedProduct.stock
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* -------------------------------------------------- */}
                                    {/* PRODUCT TITLE                                      */}
                                    {/* -------------------------------------------------- */}

                                    <div className="mt-5">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <h2 className="text-xl font-extrabold tracking-tight text-slate-950">
                                                    {selectedProduct.name ||
                                                        "Untitled product"}
                                                </h2>

                                                <span className="mt-1.5 inline-flex rounded-md bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-700">
                                                    {selectedProduct.category ||
                                                        "Fashion"}
                                                </span>
                                            </div>

                                            <p className="shrink-0 text-lg font-extrabold text-blue-600">
                                                {formatPrice(
                                                    selectedProduct.price,
                                                    currency
                                                )}
                                            </p>
                                        </div>

                                        <p className="mt-3 text-xs leading-5 text-slate-500">
                                            {selectedProduct.description ||
                                                "No product description has been added yet."}
                                        </p>
                                    </div>

                                    {/* -------------------------------------------------- */}
                                    {/* PRODUCT INFORMATION                                */}
                                    {/* -------------------------------------------------- */}

                                    <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                                        <div className="mb-2.5 flex items-center justify-between">
                                            <h3 className="text-xs font-bold text-slate-900">
                                                Product
                                                information
                                            </h3>

                                            <ProductStatusBadge
                                                stock={
                                                    selectedProduct.stock
                                                }
                                                compact
                                            />
                                        </div>

                                        <div className="divide-y divide-slate-200/80">
                                            <InfoRow
                                                label="Category"
                                                value={
                                                    selectedProduct.category ||
                                                    "Fashion"
                                                }
                                            />

                                            <InfoRow
                                                label="Stock"
                                                value={`${Number(
                                                    selectedProduct.stock ||
                                                        0
                                                )} units`}
                                            />

                                            <InfoRow
                                                label="Sizes"
                                                value={
                                                    toArray(
                                                        selectedProduct.sizes,
                                                        [
                                                            "One Size",
                                                        ]
                                                    ).join(
                                                        ", "
                                                    ) ||
                                                    "One Size"
                                                }
                                            />

                                            <InfoRow
                                                label="Colours"
                                                value={
                                                    toArray(
                                                        selectedProduct.colors
                                                    ).length
                                                        ? `${toArray(
                                                            selectedProduct.colors
                                                        ).length} available`
                                                        : "Not specified"
                                                }
                                            />
                                        </div>
                                    </div>

                                    {/* -------------------------------------------------- */}
                                    {/* STOREFRONT PREVIEW                                */}
                                    {/* -------------------------------------------------- */}

                                    <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_3px_rgba(15,23,42,0.03)]">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-xs font-bold text-slate-900">
                                                Customer storefront
                                                preview
                                            </h3>

                                            <ArrowUpRight
                                                size={14}
                                                className="text-slate-400"
                                            />
                                        </div>

                                        <div className="mt-3 flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-2.5">
                                            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                                                <ProductImage
                                                    src={
                                                        selectedProduct.image
                                                    }
                                                    alt={
                                                        selectedProduct.name
                                                    }
                                                    iconSize={
                                                        18
                                                    }
                                                />
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-xs font-bold text-slate-900">
                                                    {selectedProduct.name ||
                                                        "Untitled product"}
                                                </p>

                                                <p className="mt-0.5 text-xs font-extrabold text-blue-600">
                                                    {formatPrice(
                                                        selectedProduct.price,
                                                        currency
                                                    )}
                                                </p>

                                                <p className="mt-1 text-[10px] font-medium text-slate-400">
                                                    {showAvailability
                                                        ? `${Number(
                                                            selectedProduct.stock ||
                                                                0
                                                        )} available`
                                                        : "Availability hidden"}
                                                </p>
                                            </div>
                                        </div>

                                        <a
                                            href={`/store/${sellerId}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="mt-3 inline-flex h-9 w-full items-center justify-center gap-2 rounded-xl bg-blue-700 text-xs font-semibold text-white transition duration-150 hover:bg-blue-900 active:scale-[0.99]"
                                        >
                                            View storefront
                                            <ExternalLink
                                                size={13}
                                            />
                                        </a>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            openEditForm(
                                                selectedProduct
                                            )
                                        }
                                        className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 transition duration-150 hover:bg-slate-50 active:scale-[0.99]"
                                    >
                                        <Edit3 size={14} />
                                        Edit product
                                    </button>

                                    <div className="h-5" />
                                </div>
                            </div>
                        </aside>
                    ) : null}
                </div>

                {/* ====================================================================== */}
                {/* PRODUCT FORM MODAL                                                     */}
                {/* ====================================================================== */}

                {showProductForm ? (
                    <div
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-sm sm:p-5"
                        role="dialog"
                        aria-modal="true"
                        aria-label={
                            editingProduct
                                ? "Edit product"
                                : "Add product"
                        }
                        onMouseDown={(event) => {
                            if (
                                event.target ===
                                event.currentTarget
                            ) {
                                closeForm();
                            }
                        }}
                    >
                        <div className="flex max-h-[94vh] w-full max-w-3xl min-h-0 flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.25)]">
                            {/* ========================================================== */}
                            {/* MODAL HEADER                                                 */}
                            {/* ========================================================== */}

                            <div className="flex shrink-0 items-center justify-between border-b border-slate-100 bg-slate-50/80 px-5 py-4 sm:px-6">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                        <ShoppingBag
                                            size={18}
                                        />
                                    </div>

                                    <div>
                                        <h2 className="text-base font-bold text-slate-950">
                                            {editingProduct
                                                ? "Edit Product"
                                                : "Add New Product"}
                                        </h2>

                                        <p className="text-[11px] text-slate-500">
                                            Product details,
                                            inventory and
                                            storefront image
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={closeForm}
                                    disabled={
                                        saving ||
                                        imageUploading ||
                                        isGeneratingAI
                                    }
                                    className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-200 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                                    aria-label="Close form"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* ========================================================== */}
                            {/* FORM                                                         */}
                            {/* ========================================================== */}

                            <form
                                onSubmit={handleSaveProduct}
                                className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-5 scroll-smooth [scroll-behavior:smooth] sm:p-6"
                            >
                                <div className="space-y-6">
                                    {/* ================================================== */}
                                    {/* PRODUCT IMAGE                                      */}
                                    {/* ================================================== */}

                                    <section>
                                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                            <div>
                                                <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-700">
                                                    Product image
                                                </p>

                                                <p className="mt-0.5 text-[11px] text-slate-400">
                                                    Upload a product
                                                    photo or use
                                                    the studio
                                                    presets.
                                                </p>
                                            </div>

                                            <div className="inline-flex self-start rounded-xl border border-slate-200 bg-slate-50 p-1">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setImageMode(
                                                            "upload"
                                                        )
                                                    }
                                                    className={`rounded-lg px-3 py-1.5 text-[11px] font-semibold transition ${
                                                        imageMode ===
                                                        "upload"
                                                            ? "bg-white text-slate-900 shadow-sm"
                                                            : "text-slate-500 hover:text-slate-800"
                                                    }`}
                                                >
                                                    Upload
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setImageMode(
                                                            "ai"
                                                        )
                                                    }
                                                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-semibold transition ${
                                                        imageMode ===
                                                        "ai"
                                                            ? "bg-blue-600 text-white"
                                                            : "text-blue-600 hover:text-blue-800"
                                                    }`}
                                                >
                                                    <Sparkles
                                                        size={
                                                            12
                                                        }
                                                    />
                                                    AI Studio
                                                </button>
                                            </div>
                                        </div>

                                        {/* -------------------------------------------------- */}
                                        {/* AI STUDIO                                         */}
                                        {/* -------------------------------------------------- */}

                                        {imageMode ===
                                        "ai" ? (
                                            <div className="mt-3 rounded-2xl border border-blue-200 bg-blue-50/60 p-4">
                                                <div className="flex items-start gap-2">
                                                    <Wand2
                                                        size={
                                                            16
                                                        }
                                                        className="mt-0.5 shrink-0 text-blue-600"
                                                    />

                                                    <p className="text-xs leading-5 text-blue-950">
                                                        Choose a
                                                        fashion
                                                        style
                                                        preset or
                                                        enter a
                                                        description
                                                        to prepare
                                                        the product
                                                        image.
                                                    </p>
                                                </div>

                                                <div className="mt-3 flex flex-wrap gap-1.5">
                                                    {AI_FASHION_PRESETS.map(
                                                        (
                                                            preset
                                                        ) => (
                                                            <button
                                                                key={
                                                                    preset.label
                                                                }
                                                                type="button"
                                                                onClick={() =>
                                                                    handleGenerateAIImage(
                                                                        preset.prompt,
                                                                        preset.image
                                                                    )
                                                                }
                                                                className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-white px-2.5 py-1.5 text-[10px] font-semibold text-slate-700 transition hover:border-blue-400 hover:bg-blue-50"
                                                            >
                                                                <Sparkles
                                                                    size={
                                                                        10
                                                                    }
                                                                    className="text-blue-500"
                                                                />
                                                                {
                                                                    preset.label
                                                                }
                                                            </button>
                                                        )
                                                    )}
                                                </div>

                                                <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                                                    <input
                                                        type="text"
                                                        value={
                                                            aiPrompt
                                                        }
                                                        onChange={(
                                                            event
                                                        ) =>
                                                            setAiPrompt(
                                                                event
                                                                    .target
                                                                    .value
                                                            )
                                                        }
                                                        placeholder="Describe the fashion image..."
                                                        className="h-9 min-w-0 flex-1 rounded-xl border border-blue-200 bg-white px-3 text-xs text-slate-800 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                                                    />

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleGenerateAIImage(
                                                                aiPrompt
                                                            )
                                                        }
                                                        disabled={
                                                            isGeneratingAI
                                                        }
                                                        className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-3 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                                                    >
                                                        {isGeneratingAI ? (
                                                            <RefreshCw
                                                                size={
                                                                    13
                                                                }
                                                                className="animate-spin"
                                                            />
                                                        ) : (
                                                            <Wand2
                                                                size={
                                                                    13
                                                                }
                                                            />
                                                        )}

                                                        {isGeneratingAI
                                                            ? "Preparing..."
                                                            : "Generate"}
                                                    </button>
                                                </div>
                                            </div>
                                        ) : null}

                                        {/* -------------------------------------------------- */}
                                        {/* IMAGE UPLOAD                                      */}
                                        {/* -------------------------------------------------- */}

                                        <label
                                            htmlFor="product-image-input"
                                            className="group mt-3 block cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 transition duration-200 hover:border-blue-400 hover:bg-blue-50/30"
                                        >
                                            {imagePreview ? (
                                                <div className="relative h-52 sm:h-60">
                                                    <ProductImage
                                                        src={
                                                            imagePreview
                                                        }
                                                        alt="Product preview"
                                                        className="bg-white object-contain"
                                                        iconSize={
                                                            34
                                                        }
                                                    />

                                                    <div className="absolute inset-0 flex items-center justify-center bg-slate-950/45 opacity-0 transition duration-200 group-hover:opacity-100">
                                                        <span className="rounded-xl bg-white px-3 py-2 text-[11px] font-bold text-slate-800 shadow-lg">
                                                            Click to
                                                            change
                                                            image
                                                        </span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex h-48 flex-col items-center justify-center px-6 text-center">
                                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                                                        <Camera
                                                            size={
                                                                23
                                                            }
                                                        />
                                                    </div>

                                                    <p className="mt-3 text-xs font-bold text-slate-800">
                                                        Upload
                                                        product
                                                        image
                                                    </p>

                                                    <p className="mt-1 text-[10px] leading-5 text-slate-400">
                                                        PNG, JPG or
                                                        WEBP ·
                                                        Maximum 5MB
                                                    </p>
                                                </div>
                                            )}

                                            <input
                                                id="product-image-input"
                                                type="file"
                                                accept="image/*"
                                                onChange={
                                                    handleImageUpload
                                                }
                                                className="hidden"
                                            />
                                        </label>

                                        {imageUploadError ? (
                                            <p className="mt-2 flex items-start gap-1.5 text-[11px] font-medium text-rose-600">
                                                <AlertCircle
                                                    size={
                                                        13
                                                    }
                                                    className="mt-0.5 shrink-0"
                                                />

                                                {
                                                    imageUploadError
                                                }
                                            </p>
                                        ) : null}

                                        {imageUploading ? (
                                            <div className="mt-2 flex items-center gap-2 text-[11px] font-semibold text-blue-600">
                                                <Spinner size="sm" />
                                                Uploading image
                                                securely to
                                                Cloudinary...
                                            </div>
                                        ) : null}
                                    </section>

                                    {/* ================================================== */}
                                    {/* PRODUCT DETAILS                                    */}
                                    {/* ================================================== */}

                                    <section>
                                        <div className="mb-3">
                                            <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-700">
                                                Product details
                                            </p>

                                            <p className="mt-0.5 text-[11px] text-slate-400">
                                                These details are
                                                used across your
                                                catalog and
                                                customer
                                                conversations.
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            <FormField
                                                label="Product name"
                                                required
                                            >
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={
                                                        formData.name
                                                    }
                                                    onChange={
                                                        handleFormChange
                                                    }
                                                    placeholder="Classic Blazer"
                                                    required
                                                    className={
                                                        fieldClass
                                                    }
                                                />
                                            </FormField>

                                            <FormField
                                                label="Category"
                                                required
                                            >
                                                <select
                                                    name="category"
                                                    value={
                                                        formData.category
                                                    }
                                                    onChange={
                                                        handleFormChange
                                                    }
                                                    className={
                                                        fieldClass
                                                    }
                                                >
                                                    <option value="Women's Fashion">
                                                        Women's
                                                        Fashion
                                                    </option>

                                                    <option value="Men's Fashion">
                                                        Men's Fashion
                                                    </option>

                                                    <option value="Footwear">
                                                        Footwear
                                                    </option>

                                                    <option value="Bags & Accessories">
                                                        Bags &
                                                        Accessories
                                                    </option>

                                                    <option value="Accessories">
                                                        Accessories
                                                    </option>
                                                </select>
                                            </FormField>

                                            <FormField
                                                label={`Price (${currency})`}
                                                required
                                            >
                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    name="price"
                                                    value={
                                                        formData.price
                                                    }
                                                    onChange={
                                                        handleFormChange
                                                    }
                                                    placeholder="299.00"
                                                    required
                                                    className={
                                                        fieldClass
                                                    }
                                                />
                                            </FormField>

                                            <FormField
                                                label="Stock quantity"
                                                required
                                            >
                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="1"
                                                    name="stock"
                                                    value={
                                                        formData.stock
                                                    }
                                                    onChange={
                                                        handleFormChange
                                                    }
                                                    placeholder="12"
                                                    required
                                                    className={
                                                        fieldClass
                                                    }
                                                />
                                            </FormField>

                                            <FormField
                                                label="Sizes"
                                                hint="Separate values with commas"
                                            >
                                                <input
                                                    type="text"
                                                    name="sizes"
                                                    value={
                                                        formData.sizes
                                                    }
                                                    onChange={
                                                        handleFormChange
                                                    }
                                                    placeholder="S, M, L, XL"
                                                    className={
                                                        fieldClass
                                                    }
                                                />
                                            </FormField>

                                            <FormField
                                                label="Colours"
                                                hint="Separate values with commas"
                                            >
                                                <input
                                                    type="text"
                                                    name="colors"
                                                    value={
                                                        formData.colors
                                                    }
                                                    onChange={
                                                        handleFormChange
                                                    }
                                                    placeholder="Beige, Black, Navy"
                                                    className={
                                                        fieldClass
                                                    }
                                                />
                                            </FormField>
                                        </div>

                                        <div className="mt-4">
                                            <FormField
                                                label="Description"
                                                hint="Mention fabric, fit, occasion or styling details."
                                            >
                                                <textarea
                                                    name="description"
                                                    value={
                                                        formData.description
                                                    }
                                                    onChange={
                                                        handleFormChange
                                                    }
                                                    rows={4}
                                                    placeholder="Describe the product for customers and the ThreadOS AI assistant..."
                                                    className={`${fieldClass} h-auto resize-none py-3`}
                                                />
                                            </FormField>
                                        </div>
                                    </section>

                                    {/* ================================================== */}
                                    {/* FORM ERROR                                        */}
                                    {/* ================================================== */}

                                    {formError ? (
                                        <div className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-rose-700">
                                            <AlertCircle
                                                size={16}
                                                className="mt-0.5 shrink-0"
                                            />

                                            <p className="text-xs font-medium leading-5">
                                                {formError}
                                            </p>
                                        </div>
                                    ) : null}

                                    {/* ================================================== */}
                                    {/* FORM ACTIONS                                       */}
                                    {/* ================================================== */}

                                    <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
                                        <button
                                            type="button"
                                            onClick={closeForm}
                                            disabled={
                                                saving ||
                                                imageUploading ||
                                                isGeneratingAI
                                            }
                                            className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            type="submit"
                                            disabled={
                                                saving ||
                                                imageUploading ||
                                                isGeneratingAI
                                            }
                                            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-xs font-semibold text-white shadow-sm transition duration-150 hover:bg-blue-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            {saving ? (
                                                <Spinner size="sm" />
                                            ) : (
                                                <Check
                                                    size={14}
                                                />
                                            )}

                                            {saving
                                                ? "Saving..."
                                                : editingProduct
                                                ? "Save Changes"
                                                : "Add Product"}
                                        </button>
                                    </div>

                                    <div className="h-2" />
                                </div>
                            </form>
                        </div>
                    </div>
                ) : null}
            </div>
        );
    };

    /* -------------------------------------------------------------------------- */
    /* Form Field                                                                 */
    /* -------------------------------------------------------------------------- */

    const fieldClass =
        "mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-800 outline-none transition duration-150 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10";

    const FormField = ({
        label,
        required = false,
        hint,
        children,
    }) => (
        <div>
            <label className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-700">
                {label}{" "}
                {required ? (
                    <span className="text-rose-500">
                        *
                    </span>
                ) : null}
            </label>

            {children}

            {hint ? (
                <p className="mt-1 text-[10px] text-slate-400">
                    {hint}
                </p>
            ) : null}
        </div>
    );

    /* -------------------------------------------------------------------------- */
    /* Information Row                                                            */
    /* -------------------------------------------------------------------------- */

    const InfoRow = ({ label, value }) => (
        <div className="flex items-center justify-between gap-4 py-2.5">
            <span className="shrink-0 text-[11px] font-medium text-slate-500">
                {label}
            </span>

            <span className="min-w-0 truncate text-right text-[11px] font-semibold text-slate-800">
                {value}
            </span>
        </div>
    );

    export default Products;
