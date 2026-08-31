import React, { useMemo, useState } from "react";
import {
  Search,
  MessageCircle,
  Package,
  Bot,
  Users,
  ShoppingBag,
  BarChart3,
  Settings,
  ChevronRight,
  ChevronDown,
  Mail,
  ExternalLink,
  LifeBuoy,
  Zap,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  X,
  BookOpen,
  Copy,
  Check,
} from "lucide-react";

/* =========================================================
   DOCUMENTATION DATA
========================================================= */

const helpCategories = [
  {
    id: "getting-started",
    title: "Getting Started",
    description:
      "Set up your store and start using ThreadOS AI.",
    icon: Zap,
    articles: [
      {
        id: "setup-store",
        title: "Set up your store",
        description:
          "Configure your store and prepare your customer experience.",
        content: {
          intro:
            "Set up your workspace before you start managing customer conversations, products and AI automation.",
          sections: [
            {
              title: "Getting started",
              paragraphs: [
                "Your store is the foundation of your ThreadOS AI workspace. It contains the business information, products, customer channels and settings that power your customer experience.",
                "Complete the initial setup before connecting your customer channels or enabling the AI assistant.",
              ],
            },
            {
              title: "Setup checklist",
              steps: [
                "Open Settings from the sidebar.",
                "Enter your business and store information.",
                "Add your products and make sure pricing and inventory are accurate.",
                "Connect the channels your customers use to contact your business.",
                "Configure your AI assistant and knowledge base.",
                "Send a test customer message to confirm everything works correctly.",
              ],
            },
            {
              title: "Keep your information accurate",
              paragraphs: [
                "ThreadOS AI can use your product information and business knowledge when responding to customers. Incorrect product prices, stock information or policies can therefore result in incorrect customer responses.",
                "Review your store information regularly, especially when products, prices, delivery policies or business hours change.",
              ],
            },
          ],
        },
      },
      {
        id: "first-product",
        title: "Add your first product",
        description:
          "Create your first product with pricing, stock, sizes and colours.",
        content: {
          intro:
            "Products provide the information your team and AI assistant need to answer customer questions about what you sell.",
          sections: [
            {
              title: "Add a product",
              steps: [
                "Open Products from the sidebar.",
                "Click Add Product.",
                "Enter the product name.",
                "Add a clear product description.",
                "Enter the selling price.",
                "Add available sizes and colours if applicable.",
                "Enter the available stock.",
                "Upload product images.",
                "Save the product.",
              ],
            },
            {
              title: "Product information",
              paragraphs: [
                "Try to provide complete and accurate information for every product. Customers may ask about price, availability, colour, size, material and other product details.",
                "Use clear names and descriptions so your team can quickly identify products when responding to customers.",
              ],
            },
            {
              title: "Important",
              paragraphs: [
                "Keep stock quantities updated. If an item is unavailable, customers should not be told that it is currently in stock.",
              ],
            },
          ],
        },
      },
      {
        id: "connect-channels",
        title: "Connect your customer channels",
        description:
          "Connect the channels your customers use to contact your business.",
        content: {
          intro:
            "ThreadOS AI is designed to bring customer conversations into one workspace.",
          sections: [
            {
              title: "Why connect your channels?",
              paragraphs: [
                "Social commerce businesses often receive customer questions through multiple channels. Connecting those channels allows your team to manage conversations from one place.",
                "Depending on your configuration, customers can contact your business through channels such as your website, WhatsApp or social messaging channels.",
              ],
            },
            {
              title: "Connect a channel",
              steps: [
                "Open Settings.",
                "Find the Channels or Integrations section.",
                "Choose the channel you want to connect.",
                "Follow the connection instructions.",
                "Confirm that the channel shows as connected.",
                "Send a test message from the customer side.",
              ],
            },
            {
              title: "Test the connection",
              paragraphs: [
                "Always send a test message after connecting a channel. Confirm that the message appears in Inbox and that your team can respond.",
              ],
            },
          ],
        },
      },
      {
        id: "setup-ai",
        title: "Set up your AI assistant",
        description:
          "Configure your AI assistant so it can answer customer questions.",
        content: {
          intro:
            "Your AI assistant helps handle repetitive customer enquiries and can reduce the amount of manual work your team needs to perform.",
          sections: [
            {
              title: "Before enabling the AI",
              paragraphs: [
                "Make sure your product catalog, business information, FAQs and customer policies are accurate.",
                "The quality of the information available to the assistant directly affects the quality of its responses.",
              ],
            },
            {
              title: "Configure the assistant",
              steps: [
                "Open Settings.",
                "Open the AI Assistant settings.",
                "Define the assistant's tone and behaviour.",
                "Add your business information and frequently asked questions.",
                "Connect or configure your knowledge base.",
                "Define when conversations should be handed to a human.",
                "Save your settings.",
                "Test the assistant using realistic customer questions.",
              ],
            },
            {
              title: "Test before going live",
              paragraphs: [
                "Ask the assistant common questions about price, sizes, colours, delivery and availability. Check that the answers are accurate and appropriate for your customers.",
              ],
            },
          ],
        },
      },
    ],
  },

  {
    id: "inbox",
    title: "Inbox",
    description:
      "Manage customer conversations and support requests.",
    icon: MessageCircle,
    articles: [
      {
        id: "managing-conversations",
        title: "Managing conversations",
        description:
          "Read, respond to and organize customer conversations.",
        content: {
          intro:
            "Inbox is your central workspace for managing customer conversations.",
          sections: [
            {
              title: "Understanding Inbox",
              paragraphs: [
                "Inbox brings customer conversations into one workspace so your team can see incoming requests, respond to customers and manage conversations.",
                "Each conversation can contain customer messages, previous interactions and information that helps your team understand the customer's request.",
              ],
            },
            {
              title: "Respond to a customer",
              steps: [
                "Open Inbox from the sidebar.",
                "Select a conversation.",
                "Read the customer's latest message and conversation history.",
                "Type your response in the message composer.",
                "Review the response.",
                "Send the message.",
              ],
            },
            {
              title: "Organize conversations",
              paragraphs: [
                "Use conversation status, assignments and other available controls to keep your inbox organized.",
                "Resolve conversations when the customer's issue has been successfully handled.",
              ],
            },
          ],
        },
      },
      {
        id: "assign-conversation",
        title: "Assign a conversation",
        description:
          "Send a conversation to the right team member.",
        content: {
          intro:
            "Assigning conversations helps ensure that customer requests reach the right person.",
          sections: [
            {
              title: "Assign a conversation",
              steps: [
                "Open the conversation in Inbox.",
                "Open the conversation assignment control.",
                "Select the appropriate team member.",
                "Confirm the assignment.",
              ],
            },
            {
              title: "When to assign conversations",
              paragraphs: [
                "Assign a conversation when a particular team member or department needs to handle the request.",
                "Examples include payment issues, order problems, product questions requiring specialist knowledge and customer complaints.",
              ],
            },
          ],
        },
      },
      {
        id: "human-handoff",
        title: "Human handoff",
        description:
          "Take over a conversation when the AI needs human assistance.",
        content: {
          intro:
            "Human handoff allows a team member to take control of a conversation when automated assistance is not enough.",
          sections: [
            {
              title: "When should a handoff happen?",
              paragraphs: [
                "A conversation should be handed to a human when the customer needs a decision, exception, sensitive assistance or support that the AI should not handle.",
                "Examples include complaints, unusual order problems, refunds requiring approval and situations where the customer explicitly asks for a human.",
              ],
            },
            {
              title: "Take over a conversation",
              steps: [
                "Open the conversation in Inbox.",
                "Review the conversation history.",
                "Select the human handoff or takeover option.",
                "Review what the customer needs.",
                "Send a personal response.",
                "Continue managing the conversation until the issue is resolved.",
              ],
            },
          ],
        },
      },
      {
        id: "creating-tickets",
        title: "Creating tickets",
        description:
          "Turn customer issues into trackable support tickets.",
        content: {
          intro:
            "Tickets help your team track customer issues that require follow-up.",
          sections: [
            {
              title: "Create a ticket",
              steps: [
                "Open the relevant customer conversation.",
                "Identify the issue that requires follow-up.",
                "Create a support ticket.",
                "Add a clear title and description.",
                "Assign the ticket to the appropriate team member.",
                "Set the appropriate status or priority.",
                "Save the ticket.",
              ],
            },
            {
              title: "Why tickets are useful",
              paragraphs: [
                "Tickets prevent important customer issues from being forgotten and make it easier for your team to track work that cannot be resolved immediately.",
              ],
            },
          ],
        },
      },
    ],
  },

  {
    id: "products",
    title: "Products",
    description:
      "Manage your products, inventory and catalog.",
    icon: Package,
    articles: [
      {
        id: "adding-products",
        title: "Adding products",
        description:
          "Add product information, pricing, stock and images.",
        content: {
          intro:
            "Your product catalog contains the information customers and your AI assistant use when discussing your products.",
          sections: [
            {
              title: "Add a product",
              steps: [
                "Open Products from the sidebar.",
                "Click Add Product.",
                "Enter the product name.",
                "Add the product description.",
                "Enter the price.",
                "Select available sizes and colours.",
                "Enter the stock quantity.",
                "Upload product images.",
                "Save the product.",
              ],
            },
            {
              title: "What should you include?",
              paragraphs: [
                "Use accurate names, prices, descriptions, sizes, colours and stock quantities.",
                "Good product information makes it easier for customers to make purchase decisions and helps the AI provide useful answers.",
              ],
            },
          ],
        },
      },
      {
        id: "inventory",
        title: "Managing inventory",
        description:
          "Keep stock information accurate for customers and AI.",
        content: {
          intro:
            "Inventory keeps track of how many units of each product are available.",
          sections: [
            {
              title: "Update stock",
              steps: [
                "Open Products.",
                "Select the product you want to update.",
                "Find the inventory or stock field.",
                "Enter the current quantity.",
                "Save the changes.",
              ],
            },
            {
              title: "Why inventory matters",
              paragraphs: [
                "Customers often ask whether an item is available before purchasing. Keeping inventory accurate helps your team and AI provide reliable availability information.",
              ],
            },
            {
              title: "Best practice",
              paragraphs: [
                "Update inventory as soon as products are sold, restocked or become unavailable.",
              ],
            },
          ],
        },
      },
      {
        id: "sizes-colours",
        title: "Managing sizes and colours",
        description:
          "Add product variations to help customers make decisions.",
        content: {
          intro:
            "Fashion products often have multiple variations. Sizes and colours should be clearly defined for each product.",
          sections: [
            {
              title: "Add variations",
              steps: [
                "Open the product.",
                "Find the Variations, Sizes or Colours section.",
                "Add the available sizes.",
                "Add the available colours.",
                "Set stock information for each variation where supported.",
                "Save the product.",
              ],
            },
            {
              title: "Keep variations accurate",
              paragraphs: [
                "If a particular size or colour is unavailable, update the product information so customers receive accurate information.",
              ],
            },
          ],
        },
      },
      {
        id: "edit-delete-products",
        title: "Editing or deleting products",
        description:
          "Update product information or remove products from your catalog.",
        content: {
          intro:
            "Products can be updated whenever information changes.",
          sections: [
            {
              title: "Edit a product",
              steps: [
                "Open Products.",
                "Select the product.",
                "Choose Edit.",
                "Update the required information.",
                "Review the changes.",
                "Save the product.",
              ],
            },
            {
              title: "Delete a product",
              paragraphs: [
                "Only remove a product when it should no longer appear in your catalog. If the product is temporarily unavailable, updating its stock may be more appropriate than deleting it.",
              ],
            },
          ],
        },
      },
    ],
  },

  {
    id: "ai",
    title: "AI Assistant",
    description:
      "Understand and configure your AI customer assistant.",
    icon: Bot,
    articles: [
      {
        id: "how-ai-works",
        title: "How the AI assistant works",
        description:
          "Understand how AI handles repetitive customer enquiries.",
        content: {
          intro:
            "The AI assistant is designed to handle repetitive customer questions while allowing your team to take over when human assistance is needed.",
          sections: [
            {
              title: "The basic workflow",
              steps: [
                "A customer sends a message.",
                "The AI identifies what the customer is asking.",
                "The assistant searches the available business and product information.",
                "The AI generates a response based on the available information.",
                "The response is sent to the customer.",
                "If the request requires human assistance, the conversation can be handed to a team member.",
              ],
            },
            {
              title: "Common questions AI can handle",
              paragraphs: [
                "Examples include product prices, available sizes, colours, stock availability, delivery information, store policies and frequently asked questions.",
              ],
            },
            {
              title: "What AI should not do",
              paragraphs: [
                "The assistant should not invent information. When it does not have enough reliable information to answer a question, the conversation should be escalated or the customer should be told that more information is needed.",
              ],
            },
          ],
        },
      },
      {
        id: "training-ai",
        title: "Training your AI assistant",
        description:
          "Provide information that helps your AI give accurate answers.",
        content: {
          intro:
            "The AI assistant becomes more useful when the information available to it is complete, accurate and well organized.",
          sections: [
            {
              title: "Information to provide",
              paragraphs: [
                "Add information about your business, products, pricing, delivery, returns, payment methods, opening hours, FAQs and other customer-facing policies.",
              ],
            },
            {
              title: "Improve AI responses",
              steps: [
                "Review common customer questions.",
                "Identify questions that receive poor or incomplete answers.",
                "Add the missing information to your knowledge base.",
                "Test the assistant again.",
                "Continue improving the information based on real customer conversations.",
              ],
            },
          ],
        },
      },
      {
        id: "knowledge-base",
        title: "Knowledge base",
        description:
          "Manage the information your AI uses when answering customers.",
        content: {
          intro:
            "The knowledge base stores business information that can be used by the AI assistant when responding to customers.",
          sections: [
            {
              title: "What belongs in the knowledge base?",
              paragraphs: [
                "Useful information includes product information, store policies, delivery rules, payment instructions, return policies, frequently asked questions and business information.",
              ],
            },
            {
              title: "Add useful information",
              steps: [
                "Open the AI or Knowledge Base settings.",
                "Add a document, FAQ or business information source.",
                "Make sure the information is accurate.",
                "Save or publish the information.",
                "Test the AI using questions based on the new information.",
              ],
            },
            {
              title: "Keep it updated",
              paragraphs: [
                "When your policies, prices, products or delivery rules change, update the knowledge base so the AI does not rely on outdated information.",
              ],
            },
          ],
        },
      },
      {
        id: "ai-handoff",
        title: "AI human handoff",
        description:
          "Understand when conversations should be transferred to a person.",
        content: {
          intro:
            "Human handoff is an important part of safe and effective AI customer support.",
          sections: [
            {
              title: "Good handoff situations",
              paragraphs: [
                "A handoff is appropriate when a customer requests a human, when the AI cannot confidently answer, when a complaint requires personal attention or when a decision requires a team member.",
              ],
            },
            {
              title: "Configure handoff rules",
              steps: [
                "Open AI Assistant settings.",
                "Find the Human Handoff settings.",
                "Define the situations that should trigger a handoff.",
                "Choose how the conversation should be assigned.",
                "Save the configuration.",
                "Test the handoff using a realistic customer conversation.",
              ],
            },
          ],
        },
      },
    ],
  },

  {
    id: "customers",
    title: "Customers",
    description:
      "Understand and manage your customer relationships.",
    icon: Users,
    articles: [
      {
        id: "customer-profiles",
        title: "Customer profiles",
        description:
          "View customer information and conversation history.",
        content: {
          intro:
            "Customer profiles give your team a central place to understand individual customers.",
          sections: [
            {
              title: "View a customer",
              steps: [
                "Open Customers from the sidebar.",
                "Search for the customer.",
                "Open the customer's profile.",
                "Review available customer information.",
                "Review the customer's conversation history.",
              ],
            },
            {
              title: "Why profiles matter",
              paragraphs: [
                "Customer history helps your team understand previous interactions and provide more consistent support.",
              ],
            },
          ],
        },
      },
      {
        id: "conversation-history",
        title: "Customer conversation history",
        description:
          "Review previous interactions with a customer.",
        content: {
          intro:
            "Conversation history helps your team understand what has already been discussed with a customer.",
          sections: [
            {
              title: "Review history",
              steps: [
                "Open the customer profile.",
                "Find the conversation history.",
                "Open previous conversations.",
                "Review the customer's questions, responses and previous support interactions.",
              ],
            },
            {
              title: "Use history carefully",
              paragraphs: [
                "Use previous conversations to provide continuity, but always verify current product, pricing and order information before responding.",
              ],
            },
          ],
        },
      },
      {
        id: "customer-information",
        title: "Managing customer information",
        description:
          "Keep customer information organized and useful.",
        content: {
          intro:
            "Accurate customer information helps your team provide better support.",
          sections: [
            {
              title: "Keep information current",
              steps: [
                "Open the customer profile.",
                "Review the available information.",
                "Update information when appropriate.",
                "Save the changes.",
              ],
            },
            {
              title: "Data quality",
              paragraphs: [
                "Avoid adding unnecessary information. Keep customer records relevant to providing customer service and fulfilling business operations.",
              ],
            },
          ],
        },
      },
    ],
  },

  {
    id: "orders",
    title: "Orders",
    description:
      "Manage customer orders and order information.",
    icon: ShoppingBag,
    articles: [
      {
        id: "managing-orders",
        title: "Managing orders",
        description:
          "View and manage orders received from customers.",
        content: {
          intro:
            "Orders allow your team to track purchases and keep customers informed.",
          sections: [
            {
              title: "View an order",
              steps: [
                "Open Orders from the workspace.",
                "Search for the order.",
                "Open the order details.",
                "Review the customer, products, quantities and order status.",
              ],
            },
            {
              title: "Order information",
              paragraphs: [
                "Review order information carefully before responding to customer questions about purchases.",
              ],
            },
          ],
        },
      },
      {
        id: "order-status",
        title: "Updating order status",
        description:
          "Keep customers informed about the progress of their orders.",
        content: {
          intro:
            "Order status tells your team and customers where an order is in the fulfillment process.",
          sections: [
            {
              title: "Update an order",
              steps: [
                "Open the order.",
                "Review the current status.",
                "Select the new status.",
                "Confirm the change.",
                "Notify the customer when appropriate.",
              ],
            },
            {
              title: "Keep statuses accurate",
              paragraphs: [
                "Only update an order when the status accurately reflects what has happened with the order.",
              ],
            },
          ],
        },
      },
      {
        id: "order-notifications",
        title: "Order notifications",
        description:
          "Understand how customers receive order updates.",
        content: {
          intro:
            "Notifications help customers stay informed about important changes to their orders.",
          sections: [
            {
              title: "Common notifications",
              paragraphs: [
                "Depending on your configuration, customers may receive updates when an order is confirmed, processed, shipped, delivered or otherwise changed.",
              ],
            },
            {
              title: "Best practice",
              paragraphs: [
                "Make sure order statuses are updated promptly so customers receive accurate information.",
              ],
            },
          ],
        },
      },
    ],
  },

  {
    id: "analytics",
    title: "Analytics",
    description:
      "Understand your customer experience performance.",
    icon: BarChart3,
    articles: [
      {
        id: "analytics-dashboard",
        title: "Understanding your dashboard",
        description:
          "Learn what the main customer experience metrics mean.",
        content: {
          intro:
            "Analytics helps you understand how your customer support operation is performing.",
          sections: [
            {
              title: "What to look for",
              paragraphs: [
                "Look at conversation volume, response times, resolution activity, AI performance and other available metrics.",
              ],
            },
            {
              title: "Use analytics to improve",
              steps: [
                "Review your most important customer experience metrics.",
                "Identify areas that are slowing down your team.",
                "Look for repetitive questions that could be automated.",
                "Review AI conversations that required human intervention.",
                "Improve your knowledge base and workflows.",
                "Measure the results over time.",
              ],
            },
          ],
        },
      },
      {
        id: "response-time",
        title: "Response time",
        description:
          "Understand how quickly customers receive responses.",
        content: {
          intro:
            "Response time measures how quickly customer messages receive responses.",
          sections: [
            {
              title: "Why response time matters",
              paragraphs: [
                "Customers are more likely to continue a conversation when they receive timely responses. Slow responses can lead to customer drop-off and lost sales opportunities.",
              ],
            },
            {
              title: "Improve response time",
              steps: [
                "Identify conversations that wait the longest.",
                "Look for repetitive questions.",
                "Automate suitable questions with AI.",
                "Improve team assignment and routing.",
                "Monitor response time regularly.",
              ],
            },
          ],
        },
      },
      {
        id: "ai-performance",
        title: "AI performance",
        description:
          "Measure how effectively your AI handles customer enquiries.",
        content: {
          intro:
            "AI performance helps you understand whether your assistant is successfully handling customer enquiries.",
          sections: [
            {
              title: "What to review",
              paragraphs: [
                "Look at how many conversations the AI handles, how often conversations require human handoff and where customers may need additional assistance.",
              ],
            },
            {
              title: "Improve AI performance",
              steps: [
                "Review conversations handled by the AI.",
                "Identify incorrect or incomplete responses.",
                "Find missing information in your knowledge base.",
                "Update your product and business information.",
                "Test the assistant again.",
                "Monitor the results.",
              ],
            },
          ],
        },
      },
    ],
  },

  {
    id: "settings",
    title: "Settings",
    description:
      "Configure your workspace and account.",
    icon: Settings,
    articles: [
      {
        id: "workspace-settings",
        title: "Workspace settings",
        description:
          "Configure your workspace and business information.",
        content: {
          intro:
            "Workspace settings control important information about your business and ThreadOS AI workspace.",
          sections: [
            {
              title: "Common workspace settings",
              paragraphs: [
                "Depending on your configuration, workspace settings may include business information, store details, channels, AI configuration and other operational settings.",
              ],
            },
            {
              title: "Make changes",
              steps: [
                "Open Settings.",
                "Choose the relevant settings section.",
                "Update the required information.",
                "Review the changes.",
                "Save the settings.",
                "Test any customer-facing changes.",
              ],
            },
          ],
        },
      },
      {
        id: "team-members",
        title: "Team members",
        description:
          "Manage the people who can access your workspace.",
        content: {
          intro:
            "Team member settings control who can access and work inside your workspace.",
          sections: [
            {
              title: "Manage your team",
              steps: [
                "Open Settings.",
                "Open Team Members.",
                "Invite a new team member or select an existing member.",
                "Assign the appropriate role or permissions.",
                "Save the changes.",
              ],
            },
            {
              title: "Access control",
              paragraphs: [
                "Give team members only the access they need to perform their responsibilities.",
              ],
            },
          ],
        },
      },
      {
        id: "notifications",
        title: "Notifications",
        description:
          "Configure how you receive important notifications.",
        content: {
          intro:
            "Notifications keep your team informed about important activity.",
          sections: [
            {
              title: "Configure notifications",
              steps: [
                "Open Settings.",
                "Open Notifications.",
                "Review the available notification types.",
                "Enable or disable the notifications you need.",
                "Save your preferences.",
              ],
            },
            {
              title: "Best practice",
              paragraphs: [
                "Enable notifications for events that require timely action, while avoiding unnecessary notifications that can distract your team.",
              ],
            },
          ],
        },
      },
    ],
  },
];

/* =========================================================
   POPULAR ARTICLES
========================================================= */

const popularArticles = [
  {
    articleId: "first-product",
    title: "How to add a product",
    category: "Products",
    icon: Package,
  },
  {
    articleId: "managing-conversations",
    title: "How to manage customer conversations",
    category: "Inbox",
    icon: MessageCircle,
  },
  {
    articleId: "training-ai",
    title: "How to train your AI assistant",
    category: "AI Assistant",
    icon: Bot,
  },
  {
    articleId: "connect-channels",
    title: "How to connect your channels",
    category: "Getting Started",
    icon: Zap,
  },
];

/* =========================================================
   HELP PAGE
========================================================= */

const Help = () => {
  const [search, setSearch] = useState("");
  const [expandedCategory, setExpandedCategory] =
    useState("getting-started");
  const [selectedArticle, setSelectedArticle] = useState(null);

  /* =======================================================
     FIND ARTICLE
  ======================================================= */

  const findArticle = (articleId) => {
    for (const category of helpCategories) {
      const article = category.articles.find(
        (item) => item.id === articleId
      );

      if (article) {
        return {
          ...article,
          category: category.title,
        };
      }
    }

    return null;
  };

  /* =======================================================
     FILTER SEARCH
  ======================================================= */

  const filteredCategories = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) {
      return helpCategories;
    }

    return helpCategories
      .map((category) => {
        const categoryMatches =
          category.title.toLowerCase().includes(value) ||
          category.description.toLowerCase().includes(value);

        const matchingArticles = category.articles.filter(
          (article) =>
            article.title.toLowerCase().includes(value) ||
            article.description.toLowerCase().includes(value)
        );

        if (categoryMatches) {
          return category;
        }

        if (matchingArticles.length > 0) {
          return {
            ...category,
            articles: matchingArticles,
          };
        }

        return null;
      })
      .filter(Boolean);
  }, [search]);

  /* =======================================================
     CATEGORY TOGGLE
  ======================================================= */

  const handleCategoryToggle = (id) => {
    setExpandedCategory((current) =>
      current === id ? null : id
    );
  };

  /* =======================================================
     OPEN ARTICLE
  ======================================================= */

  const openArticle = (article) => {
    setSelectedArticle(article);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =======================================================
     ARTICLE VIEW
  ======================================================= */

  if (selectedArticle) {
    return (
      <ArticlePage
        article={selectedArticle}
        onBack={() => setSelectedArticle(null)}
        onOpenArticle={openArticle}
        findArticle={findArticle}
      />
    );
  }

  /* =======================================================
     MAIN HELP CENTER
  ======================================================= */

  return (
    <div className="h-full min-h-0 w-full overflow-y-auto bg-gray-50">
      {/* =================================================
          HEADER
      ================================================== */}

      <header className="border-b border-gray-200 bg-white px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-900">
              <LifeBuoy
                size={18}
                className="text-white"
              />
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-lg font-semibold text-gray-900">
                Help & Docs
              </h1>

              <p className="mt-0.5 text-xs text-gray-500">
                Learn how to use ThreadOS AI.
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* =================================================
          HERO / SEARCH
      ================================================== */}

      <section className="border-b border-gray-200 bg-white px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Documentation
          </p>

          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            How can we help?
          </h2>

          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-gray-500">
            Search the documentation for answers about your
            inbox, products, AI assistant, customers and more.
          </p>

          <div className="relative mx-auto mt-6 max-w-2xl">
            <Search
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search documentation..."
              className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-10 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-300 focus:bg-white focus:ring-2 focus:ring-gray-100"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              >
                <X size={15} />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* =================================================
          MAIN
      ================================================== */}

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* =================================================
            POPULAR
        ================================================== */}

        {!search && (
          <section>
            <div>
              <h2 className="text-sm font-semibold text-gray-900">
                Popular documentation
              </h2>

              <p className="mt-1 text-xs text-gray-400">
                Start with the most commonly used guides.
              </p>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {popularArticles.map((article) => {
                const Icon = article.icon;

                return (
                  <button
                    key={article.articleId}
                    type="button"
                    onClick={() => {
                      const found = findArticle(
                        article.articleId
                      );

                      if (found) {
                        openArticle(found);
                      }
                    }}
                    className="group rounded-xl border border-gray-200 bg-white p-4 text-left transition hover:border-gray-300 hover:shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">
                        <Icon
                          size={16}
                          className="text-gray-600"
                        />
                      </div>

                      <ArrowRightIcon />
                    </div>

                    <h3 className="mt-4 text-xs font-semibold text-gray-900">
                      {article.title}
                    </h3>

                    <p className="mt-1 text-[10px] text-gray-400">
                      {article.category}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* =================================================
            CATEGORIES
        ================================================== */}

        <section className={search ? "" : "mt-10"}>
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-gray-900">
              Browse documentation
            </h2>

            <p className="mt-1 text-xs text-gray-400">
              Find guides and answers by topic.
            </p>
          </div>

          {filteredCategories.length === 0 ? (
            <EmptySearch search={search} />
          ) : (
            <div className="space-y-3">
              {filteredCategories.map((category) => {
                const Icon = category.icon;

                const isOpen =
                  Boolean(search) ||
                  expandedCategory === category.id;

                return (
                  <div
                    key={category.id}
                    className="overflow-hidden rounded-xl border border-gray-200 bg-white"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        handleCategoryToggle(category.id)
                      }
                      className="flex w-full items-center justify-between gap-4 p-4 text-left transition hover:bg-gray-50"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                          <Icon
                            size={16}
                            className="text-gray-600"
                          />
                        </div>

                        <div className="min-w-0">
                          <h3 className="text-xs font-semibold text-gray-900">
                            {category.title}
                          </h3>

                          <p className="mt-1 truncate text-[10px] text-gray-400">
                            {category.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-3">
                        <span className="hidden rounded-full bg-gray-100 px-2 py-1 text-[9px] font-medium text-gray-500 sm:inline-flex">
                          {category.articles.length}{" "}
                          {category.articles.length === 1
                            ? "article"
                            : "articles"}
                        </span>

                        {isOpen ? (
                          <ChevronDown
                            size={16}
                            className="text-gray-400"
                          />
                        ) : (
                          <ChevronRight
                            size={16}
                            className="text-gray-400"
                          />
                        )}
                      </div>
                    </button>

                    {isOpen && (
                      <div className="border-t border-gray-100">
                        {category.articles.map(
                          (article, index) => (
                            <button
                              key={article.id}
                              type="button"
                              onClick={() =>
                                openArticle({
                                  ...article,
                                  category:
                                    category.title,
                                })
                              }
                              className={`flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition hover:bg-gray-50 ${
                                index !==
                                category.articles.length - 1
                                  ? "border-b border-gray-100"
                                  : ""
                              }`}
                            >
                              <div className="min-w-0">
                                <p className="text-xs font-medium text-gray-700">
                                  {article.title}
                                </p>

                                <p className="mt-1 text-[10px] leading-5 text-gray-400">
                                  {article.description}
                                </p>
                              </div>

                              <ChevronRight
                                size={15}
                                className="shrink-0 text-gray-300"
                              />
                            </button>
                          )
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* =================================================
            SUPPORT
        ================================================== */}

        <section className="mt-10">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-900">
                  <MessageCircle
                    size={18}
                    className="text-white"
                  />
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-gray-900">
                    Still need help?
                  </h2>

                  <p className="mt-1 max-w-lg text-xs leading-5 text-gray-500">
                    Can't find what you're looking for?
                    Contact the support team for assistance.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-xs font-medium text-white transition hover:bg-gray-800"
                >
                  <MessageCircle size={14} />
                  Chat with support
                </button>

                <button
                  type="button"
                  className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-xs font-medium text-gray-600 transition hover:bg-gray-50"
                >
                  <Mail size={14} />
                  Contact us
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================
            STATUS
        ================================================== */}

        <section className="mt-4 pb-8">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[10px] text-gray-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2
                size={12}
                className="text-green-500"
              />
              All systems operational
            </span>

            <button
              type="button"
              className="flex items-center gap-1.5 hover:text-gray-700"
            >
              System status
              <ExternalLink size={10} />
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

/* =========================================================
   ARTICLE PAGE
========================================================= */

const ArticlePage = ({
  article,
  onBack,
  onOpenArticle,
  findArticle,
}) => {
  const [copied, setCopied] = useState(false);

  const currentCategoryIndex = helpCategories.findIndex(
    (category) => category.title === article.category
  );

  const currentCategory =
    currentCategoryIndex >= 0
      ? helpCategories[currentCategoryIndex]
      : null;

  const currentArticleIndex =
    currentCategory?.articles.findIndex(
      (item) => item.id === article.id
    ) ?? -1;

  const previousArticle =
    currentCategory && currentArticleIndex > 0
      ? currentCategory.articles[currentArticleIndex - 1]
      : null;

  const nextArticle =
    currentCategory &&
    currentArticleIndex >= 0 &&
    currentArticleIndex <
      currentCategory.articles.length - 1
      ? currentCategory.articles[currentArticleIndex + 1]
      : null;

  const copyArticleLink = async () => {
    try {
      await navigator.clipboard.writeText(
        window.location.href
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="h-full min-h-0 w-full overflow-y-auto bg-gray-50">
      {/* =================================================
          ARTICLE HEADER
      ================================================== */}

      <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 rounded-lg px-2 py-2 text-xs font-medium text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
          >
            <ArrowLeft size={15} />
            Back to Help & Docs
          </button>

          <button
            type="button"
            onClick={copyArticleLink}
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-500 transition hover:bg-gray-50 hover:text-gray-900"
          >
            {copied ? (
              <>
                <Check size={13} />
                Copied
              </>
            ) : (
              <>
                <Copy size={13} />
                Copy link
              </>
            )}
          </button>
        </div>
      </header>

      {/* =================================================
          ARTICLE CONTENT
      ================================================== */}

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,720px)_220px]">
          {/* =================================================
              LEFT ARTICLE NAV
          ================================================== */}

          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                Documentation
              </p>

              <div className="max-h-[calc(100vh-140px)] overflow-y-auto pr-2">
                {helpCategories.map((category) => {
                  const Icon = category.icon;

                  return (
                    <div key={category.id} className="mb-4">
                      <div className="mb-1 flex items-center gap-2 px-2 py-1.5 text-xs font-semibold text-gray-700">
                        <Icon size={13} />
                        {category.title}
                      </div>

                      <div className="space-y-0.5">
                        {category.articles.map(
                          (item) => (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => {
                                const found =
                                  findArticle(item.id);

                                if (found) {
                                  onOpenArticle(found);
                                }
                              }}
                              className={`block w-full rounded-lg px-2 py-2 text-left text-[10px] leading-4 transition ${
                                item.id === article.id
                                  ? "bg-gray-900 font-medium text-white"
                                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                              }`}
                            >
                              {item.title}
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* =================================================
              DOCUMENT
          ================================================== */}

          <article className="min-w-0">
            <div className="rounded-2xl border border-gray-200 bg-white px-5 py-7 shadow-sm sm:px-8 sm:py-9">
              {/* Breadcrumb */}

              <div className="flex flex-wrap items-center gap-2 text-[10px] text-gray-400">
                <span>Help & Docs</span>
                <ChevronRight size={11} />
                <span>{article.category}</span>
              </div>

              {/* Title */}

              <h1 className="mt-5 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                {article.title}
              </h1>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                {article.description}
              </p>

              {/* Intro */}

              {article.content?.intro && (
                <div className="mt-7 rounded-xl bg-gray-50 p-4">
                  <div className="flex gap-3">
                    <BookOpen
                      size={16}
                      className="mt-0.5 shrink-0 text-gray-500"
                    />

                    <p className="text-xs leading-6 text-gray-600">
                      {article.content.intro}
                    </p>
                  </div>
                </div>
              )}

              {/* Sections */}

              <div className="mt-8">
                {article.content?.sections?.map(
                  (section, index) => (
                    <DocSection
                      key={`${section.title}-${index}`}
                      section={section}
                    />
                  )
                )}
              </div>

              {/* Important note */}

              <div className="mt-8 rounded-xl border border-amber-100 bg-amber-50 p-4">
                <div className="flex gap-3">
                  <AlertCircle
                    size={16}
                    className="mt-0.5 shrink-0 text-amber-600"
                  />

                  <div>
                    <p className="text-xs font-semibold text-amber-800">
                      Keep your information up to date
                    </p>

                    <p className="mt-1 text-[10px] leading-5 text-amber-700">
                      Product information, policies,
                      inventory and AI knowledge should be
                      reviewed whenever your business changes.
                    </p>
                  </div>
                </div>
              </div>

              {/* Article navigation */}

              <div className="mt-10 grid gap-3 border-t border-gray-100 pt-6 sm:grid-cols-2">
                {previousArticle ? (
                  <ArticleNavigation
                    direction="Previous"
                    article={previousArticle}
                    onClick={() => {
                      const found = findArticle(
                        previousArticle.id
                      );

                      if (found) {
                        onOpenArticle(found);
                      }
                    }}
                  />
                ) : (
                  <div />
                )}

                {nextArticle && (
                  <ArticleNavigation
                    direction="Next"
                    article={nextArticle}
                    align="right"
                    onClick={() => {
                      const found = findArticle(
                        nextArticle.id
                      );

                      if (found) {
                        onOpenArticle(found);
                      }
                    }}
                  />
                )}
              </div>
            </div>
          </article>

          {/* =================================================
              RIGHT ON THIS PAGE
          ================================================== */}

          <aside className="hidden xl:block">
            <div className="sticky top-24">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                On this page
              </p>

              <div className="space-y-1">
                {article.content?.sections?.map(
                  (section, index) => (
                    <div
                      key={`${section.title}-toc-${index}`}
                      className="rounded-lg px-2 py-1.5 text-[10px] leading-4 text-gray-500"
                    >
                      {section.title}
                    </div>
                  )
                )}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

/* =========================================================
   DOCUMENT SECTION
========================================================= */

const DocSection = ({ section }) => {
  return (
    <section className="mb-9 last:mb-0">
      <h2 className="text-base font-semibold text-gray-900">
        {section.title}
      </h2>

      {section.paragraphs &&
        section.paragraphs.map((paragraph, index) => (
          <p
            key={index}
            className="mt-3 text-xs leading-6 text-gray-600"
          >
            {paragraph}
          </p>
        ))}

      {section.steps && (
        <div className="mt-4 space-y-3">
          {section.steps.map((step, index) => (
            <div
              key={index}
              className="flex items-start gap-3"
            >
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-900 text-[10px] font-semibold text-white">
                {index + 1}
              </div>

              <p className="pt-0.5 text-xs leading-6 text-gray-600">
                {step}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

/* =========================================================
   ARTICLE NAVIGATION
========================================================= */

const ArticleNavigation = ({
  direction,
  article,
  onClick,
  align = "left",
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group rounded-xl border border-gray-200 p-4 text-left transition hover:border-gray-300 hover:bg-gray-50 ${
        align === "right"
          ? "text-right"
          : "text-left"
      }`}
    >
      <p className="text-[10px] font-medium text-gray-400">
        {direction}
      </p>

      <div
        className={`mt-2 flex items-center gap-2 ${
          align === "right"
            ? "justify-end"
            : "justify-start"
        }`}
      >
        {align !== "right" && (
          <ChevronRight
            size={14}
            className="rotate-180 text-gray-300 transition group-hover:-translate-x-0.5"
          />
        )}

        <span className="text-xs font-semibold text-gray-700 group-hover:text-gray-900">
          {article.title}
        </span>

        {align === "right" && (
          <ChevronRight
            size={14}
            className="text-gray-300 transition group-hover:translate-x-0.5"
          />
        )}
      </div>
    </button>
  );
};

/* =========================================================
   EMPTY SEARCH
========================================================= */

const EmptySearch = ({ search }) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-6 py-14 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
        <Search size={20} className="text-gray-400" />
      </div>

      <h3 className="mt-4 text-sm font-semibold text-gray-800">
        No documentation found
      </h3>

      <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-gray-400">
        We couldn't find anything matching "
        {search}". Try searching for another topic.
      </p>
    </div>
  );
};

/* =========================================================
   ARROW ICON
========================================================= */

const ArrowRightIcon = () => {
  return (
    <ChevronRight
      size={15}
      className="text-gray-300 transition group-hover:translate-x-0.5 group-hover:text-gray-600"
    />
  );
};

export default Help;