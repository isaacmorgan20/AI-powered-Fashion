import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  ShoppingBag,
  MessageCircle,
  Bot,
  Search,
  Package,
  Loader2,
  X,
  Send,
  Lock,
} from "lucide-react";
import { api } from "../service/api";

/* =========================================================
   HELPERS
========================================================= */

const formatPrice = (price, currency = "GHS") => {
  return `${currency} ${Number(price).toLocaleString()}`;
};

const getStatusFromStock = (stock) => {
  if (stock <= 0) return "Out of stock";
  if (stock <= 4) return "Low stock";
  return "In stock";
};

const statusStyles = {
  "In stock": "bg-green-50 text-green-700",
  "Low stock": "bg-amber-50 text-amber-700",
  "Out of stock": "bg-red-50 text-red-700",
};

/* =========================================================
   PUBLIC STOREFRONT
========================================================= */

const PublicStorefront = () => {
  const { sellerId } = useParams();
  const [storefront, setStorefront] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);

  /* =======================================================
     LOAD STOREFRONT DATA
  ======================================================= */

  useEffect(() => {
    const loadStorefront = async () => {
      try {
        setLoading(true);
        setError(null);

        const storefrontData = await api.storefront.get(sellerId);
        setStorefront(storefrontData);

        const productsData = await api.storefront.products(sellerId);
        setProducts(productsData);
      } catch (err) {
        setError(err.message || "Failed to load storefront");
      } finally {
        setLoading(false);
      }
    };

    loadStorefront();
  }, [sellerId]);

  /* =======================================================
     FILTER PRODUCTS
  ======================================================= */

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  /* =======================================================
     CHAT HANDLERS
  ======================================================= */

  const handleSendMessage = async () => {
    if (!chatMessage.trim() || chatLoading) return;

    const userMessage = chatMessage;
    setChatMessages((prev) => [
      ...prev,
      { sender: "customer", content: userMessage },
    ]);
    setChatMessage("");
    setChatLoading(true);

    try {
      if (storefront?.showAiAssistant) {
        // Use real AI endpoint
        const response = await api.storefront.chat(sellerId, {
          message: userMessage,
          conversationId: null,
        });

        if (response.response) {
          setChatMessages((prev) => [
            ...prev,
            { sender: "ai", content: response.response },
          ]);
        } else if (response.requiresHandoff) {
          setChatMessages((prev) => [
            ...prev,
            {
              sender: "system",
              content: "A team member will be with you shortly.",
            },
          ]);
        }
      } else {
        // Human-only mode - no AI
        setChatMessages((prev) => [
          ...prev,
          {
            sender: "system",
            content: "Your message has been received. Our team will respond shortly.",
          },
        ]);
      }
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "system",
          content: "Unable to send message. Please try again later.",
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  /* =======================================================
     LOADING STATE
  ======================================================= */

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-gray-400" />
          <p className="mt-2 text-sm text-gray-500">Loading storefront...</p>
        </div>
      </div>
    );
  }

  /* =======================================================
     ERROR STATE
  ======================================================= */

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
          <h1 className="mt-4 text-xl font-semibold text-gray-900">
            Storefront Unavailable
          </h1>
          <p className="mt-2 text-sm text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  /* =======================================================
     STOREFRONT DISABLED
  ======================================================= */

  if (!storefront?.enabled) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
          <h1 className="mt-4 text-xl font-semibold text-gray-900">
            Storefront Unavailable
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            This storefront is currently not available.
          </p>
        </div>
      </div>
    );
  }

  /* =======================================================
     GUEST BROWSING DISABLED
  ======================================================= */

  if (!storefront.allowGuestBrowsing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Lock className="mx-auto h-12 w-12 text-gray-400" />
          <h1 className="mt-4 text-xl font-semibold text-gray-900">
            Login Required
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Please log in to browse this store.
          </p>
          <button
            onClick={() => (window.location.href = "/login")}
            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  /* =======================================================
     MAIN STOREFRONT RENDER
  ======================================================= */

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {storefront.storeName || "Store"}
              </h1>
              {storefront.storeDescription && (
                <p className="mt-1 text-sm text-gray-500">
                  {storefront.storeDescription}
                </p>
              )}
            </div>
            <div className="flex items-center gap-4">
              {storefront.showCustomerChat && (
                <button
                  onClick={() => setChatOpen(true)}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  <MessageCircle size={16} />
                  Chat with us
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No products found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {search
                ? "Try adjusting your search terms."
                : "This store hasn't added any products yet."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
                onClick={() => setSelectedProduct(product)}
              >
                {/* Product Image */}
                <div className="aspect-square bg-gray-100">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Package className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="text-sm font-medium text-gray-900">
                    {product.name}
                  </h3>
                  <p className="mt-1 text-xs text-gray-500">
                    {product.category}
                  </p>

                  {/* Price - controlled by showPrices */}
                  {storefront.showPrices && (
                    <p className="mt-2 text-lg font-semibold text-gray-900">
                      {formatPrice(product.price)}
                    </p>
                  )}

                  {/* Stock - controlled by showStock */}
                  {storefront.showStock && (
                    <div className="mt-2 flex items-center gap-2">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          statusStyles[getStatusFromStock(product.stock)]
                        }`}
                      >
                        {getStatusFromStock(product.stock)}
                      </span>
                      {product.stock > 0 && (
                        <span className="text-xs text-gray-500">
                          {product.stock} in stock
                        </span>
                      )}
                    </div>
                  )}

                  {/* Sizes */}
                  {product.sizes && product.sizes.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {product.sizes.map((size) => (
                        <span
                          key={size}
                          className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-600"
                        >
                          {size}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setSelectedProduct(null)}
            />

            <div className="relative transform overflow-hidden rounded-xl bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <div className="aspect-square w-full bg-gray-100">
                      {selectedProduct.image ? (
                        <img
                          src={selectedProduct.image}
                          alt={selectedProduct.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Package className="h-16 w-16 text-gray-400" />
                        </div>
                      )}
                    </div>

                    <div className="mt-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {selectedProduct.name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {selectedProduct.category}
                      </p>

                      {selectedProduct.description && (
                        <p className="mt-2 text-sm text-gray-600">
                          {selectedProduct.description}
                        </p>
                      )}

                      {/* Price - controlled by showPrices */}
                      {storefront.showPrices && (
                        <p className="mt-3 text-2xl font-bold text-gray-900">
                          {formatPrice(selectedProduct.price)}
                        </p>
                      )}

                      {/* Stock - controlled by showStock */}
                      {storefront.showStock && (
                        <div className="mt-3 flex items-center gap-2">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                              statusStyles[
                                getStatusFromStock(selectedProduct.stock)
                              ]
                            }`}
                          >
                            {getStatusFromStock(selectedProduct.stock)}
                          </span>
                          {selectedProduct.stock > 0 && (
                            <span className="text-sm text-gray-500">
                              {selectedProduct.stock} in stock
                            </span>
                          )}
                        </div>
                      )}

                      {/* Sizes */}
                      {selectedProduct.sizes &&
                        selectedProduct.sizes.length > 0 && (
                          <div className="mt-3">
                            <p className="text-sm font-medium text-gray-700">
                              Sizes:
                            </p>
                            <div className="mt-1 flex flex-wrap gap-2">
                              {selectedProduct.sizes.map((size) => (
                                <span
                                  key={size}
                                  className="rounded-lg border border-gray-300 px-3 py-1 text-sm text-gray-700"
                                >
                                  {size}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                      {/* Colors */}
                      {selectedProduct.colors &&
                        selectedProduct.colors.length > 0 && (
                          <div className="mt-3">
                            <p className="text-sm font-medium text-gray-700">
                              Colors:
                            </p>
                            <div className="mt-1 flex flex-wrap gap-2">
                              {selectedProduct.colors.map((color) => (
                                <span
                                  key={color}
                                  className="rounded-lg border border-gray-300 px-3 py-1 text-sm text-gray-700"
                                >
                                  {color}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                      {/* Order Button - controlled by allowOrdering */}
                      {storefront.allowOrdering &&
                        selectedProduct.stock > 0 && (
                          <button className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                            Add to Order
                          </button>
                        )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="mt-3 inline-flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat Widget - controlled by showCustomerChat */}
      {storefront.showCustomerChat && chatOpen && (
        <div className="fixed bottom-4 right-4 z-50 w-80 rounded-xl border border-gray-200 bg-white shadow-xl">
          {/* Chat Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-gray-900">
                Chat with us
              </h3>
              {/* Show AI indicator when AI assistant is enabled */}
              {storefront.showAiAssistant && (
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-600">
                  <Bot size={10} />
                  AI
                </span>
              )}
            </div>
            <button
              onClick={() => setChatOpen(false)}
              className="text-gray-400 hover:text-gray-500"
            >
              <X size={16} />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="h-64 overflow-y-auto p-4">
            {chatMessages.length === 0 ? (
              <div className="text-center text-sm text-gray-500">
                <p>Hi! How can we help you today?</p>
                {!storefront.showAiAssistant && (
                  <p className="mt-2 text-xs text-gray-400">
                    Our team typically responds within a few hours.
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {chatMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      msg.sender === "customer"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                        msg.sender === "customer"
                          ? "bg-blue-600 text-white"
                          : msg.sender === "system"
                          ? "bg-gray-200 text-gray-600 italic"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-500">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div className="border-t border-gray-200 p-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder={
                  storefront.showAiAssistant
                    ? "Ask our AI assistant..."
                    : "Type a message..."
                }
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                disabled={chatLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={chatLoading || !chatMessage.trim()}
                className="rounded-lg bg-blue-600 px-3 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicStorefront;
