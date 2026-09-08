with open('src/Pages/Settings.jsx', 'r') as f:
    content = f.read()

# Find the exact text to replace
old_text = '''  };

  /* =======================================================
     STOREFRONT UPDATE
===================================================== */

  const [storefrontSaving, setStorefrontSaving] = useState(false);'''

new_text = '''  };

  const handleTelegramSetup = async () => {
    setTelegramSetupError("");
    setTelegramSetupLoading(true);
    try {
      if (!telegramCredentials.bot_token?.trim()) {
        throw new Error("Telegram Bot token is required");
      }
      
      // Validate token format (basic check - should contain a colon)
      if (!telegramCredentials.bot_token.includes(":")) {
        throw new Error("Invalid Telegram Bot token format");
      }
      
      const result = await api.channels.telegram.setup({
        credentials: {
          bot_token: telegramCredentials.bot_token,
        },
      });
      
      setChannels((prev) => ({
        ...prev,
        telegram: {
          enabled: result.channel.enabled,
          status: result.channel.status,
          displayName: result.channel.displayName || "",
          lastConnectedAt: result.channel.lastConnectedAt,
        },
      });
      setTelegramWebhookUrl(result.webhook_url || "");
      setShowTelegramSetup(false);
      setTelegramCredentials({
        bot_token: "",
      });
    } catch (err) {
      setTelegramSetupError(err.message || "Failed to setup Telegram");
    } finally {
      setTelegramSetupLoading(false);
    }
  };

  /* =======================================================
     STOREFRONT UPDATE
===================================================== */

  const [storefrontSaving, setStorefrontSaving] = useState(false);'''

if old_text in content:
    content = content.replace(old_text, new_text)
    with open('src/Pages/Settings.jsx', 'w') as f:
        f.write(content)
    print('Successfully replaced!')
else:
    print('Text not found!')