import React from "react";

/**
 * High quality, authentic, brand-accurate Social Media icons
 * Supports color modes: 'colored' (brand colors), 'monochrome' (uses text color), or custom classes.
 */

export const WhatsAppIcon = ({ size = 20, className = "", colorMode = "colored" }) => {
 const isColored = colorMode === "colored";
 return (
 <svg
 width={size}
 height={size}
 viewBox="0 0 24 24"
 fill="currentColor"
 className={`${isColored ? "text-[#25D366]" : ""} ${className}`}
 aria-label="WhatsApp"
 >
 <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.458l-.009.001h-.005a10.875 10.875 0 0 1-5.539-1.512l-.397-.236-4.12 1.08 1.1-4.018-.26-.413A10.865 10.865 0 0 1 1.644 10.8c0-6.001 4.882-10.884 10.885-10.884 2.909 0 5.643 1.133 7.699 3.192A10.824 10.824 0 0 1 23.42 10.8c0 6.002-4.883 10.884-10.884 10.884M12.047 0C6.066 0 1.205 4.86 1.205 10.839c0 1.954.524 3.861 1.518 5.535L0 24l7.854-2.06c1.62.884 3.449 1.35 5.275 1.35 5.98 0 10.842-4.861 10.842-10.84C23.971 4.86 19.028 0 12.047 0z" />
 </svg>
 );
};

export const InstagramIcon = ({ size = 20, className = "", colorMode = "colored" }) => {
 const isColored = colorMode === "colored";
 return (
 <svg
 width={size}
 height={size}
 viewBox="0 0 24 24"
 fill="none"
 className={className}
 aria-label="Instagram"
 >
 <defs>
 <linearGradient id="igGradient" x1="0%" y1="100%" x2="100%" y2="0%">
 <stop offset="0%" stopColor="#fdf497" />
 <stop offset="5%" stopColor="#fdf497" />
 <stop offset="45%" stopColor="#fd5949" />
 <stop offset="60%" stopColor="#d6249f" />
 <stop offset="100%" stopColor="#285AEB" />
 </linearGradient>
 </defs>
 <rect
 x="2"
 y="2"
 width="20"
 height="20"
 rx="5"
 ry="5"
 fill="none"
 stroke={isColored ? "url(#igGradient)" : "currentColor"}
 strokeWidth="2"
 />
 <path
 d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"
 fill="none"
 stroke={isColored ? "url(#igGradient)" : "currentColor"}
 strokeWidth="2"
 />
 <circle
 cx="17.5"
 cy="6.5"
 r="1.5"
 fill={isColored ? "#d6249f" : "currentColor"}
 />
 </svg>
 );
};

export const FacebookIcon = ({ size = 20, className = "", colorMode = "colored" }) => {
 const isColored = colorMode === "colored";
 return (
 <svg
 width={size}
 height={size}
 viewBox="0 0 24 24"
 fill="currentColor"
 className={`${isColored ? "text-[#1877F2]" : ""} ${className}`}
 aria-label="Facebook"
 >
 <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
 </svg>
 );
};

export const TelegramIcon = ({ size = 20, className = "", colorMode = "colored" }) => {
 const isColored = colorMode === "colored";
 return (
 <svg
 width={size}
 height={size}
 viewBox="0 0 24 24"
 fill="currentColor"
 className={`${isColored ? "text-[#229ED9]" : ""} ${className}`}
 aria-label="Telegram"
 >
 <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.25-5.54 3.69-.52.36-1 .53-1.42.52-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.24.37-.49 1.03-.75 4.03-1.76 6.72-2.92 8.07-3.48 3.84-1.6 4.64-1.88 5.16-1.89.11 0 .37.03.54.17.14.12.18.28.2.45-.01.07.01.23 0 .38z" />
 </svg>
 );
};

export const TikTokIcon = ({ size = 20, className = "", colorMode = "colored" }) => {
 const isColored = colorMode === "colored";
 return (
 <svg
 width={size}
 height={size}
 viewBox="0 0 24 24"
 fill="currentColor"
 className={`${isColored ? "text-slate-900" : ""} ${className}`}
 aria-label="TikTok"
 >
 <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 1 1-2.896-2.896c.244 0 .48.032.707.086V9.336a6.34 6.34 0 0 0-.707-.04 6.341 6.341 0 1 0 6.341 6.341V8.657a8.21 8.21 0 0 0 4.77 1.519V6.731a4.795 4.795 0 0 1-1.000-.045z" />
 </svg>
 );
};

export const XIcon = ({ size = 20, className = "", colorMode = "colored" }) => {
 const isColored = colorMode === "colored";
 return (
 <svg
 width={size}
 height={size}
 viewBox="0 0 24 24"
 fill="currentColor"
 className={`${isColored ? "text-slate-900" : ""} ${className}`}
 aria-label="X (formerly Twitter)"
 >
 <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
 </svg>
 );
};

export const YouTubeIcon = ({ size = 20, className = "", colorMode = "colored" }) => {
 const isColored = colorMode === "colored";
 return (
 <svg
 width={size}
 height={size}
 viewBox="0 0 24 24"
 fill="currentColor"
 className={`${isColored ? "text-[#FF0000]" : ""} ${className}`}
 aria-label="YouTube"
 >
 <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
 </svg>
 );
};

export const PinterestIcon = ({ size = 20, className = "", colorMode = "colored" }) => {
 const isColored = colorMode === "colored";
 return (
 <svg
 width={size}
 height={size}
 viewBox="0 0 24 24"
 fill="currentColor"
 className={`${isColored ? "text-[#E60023]" : ""} ${className}`}
 aria-label="Pinterest"
 >
 <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.02 0 1.513.769 1.513 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.367 18.592 0 12.017 0z" />
 </svg>
 );
};

export const LinkedInIcon = ({ size = 20, className = "", colorMode = "colored" }) => {
 const isColored = colorMode === "colored";
 return (
 <svg
 width={size}
 height={size}
 viewBox="0 0 24 24"
 fill="currentColor"
 className={`${isColored ? "text-[#0A66C2]" : ""} ${className}`}
 aria-label="LinkedIn"
 >
 <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
 </svg>
 );
};

export const WebsiteIcon = ({ size = 20, className = "", colorMode = "colored" }) => {
 const isColored = colorMode === "colored";
 return (
 <svg
 width={size}
 height={size}
 viewBox="0 0 24 24"
 fill="none"
 stroke="currentColor"
 strokeWidth="2"
 strokeLinecap="round"
 strokeLinejoin="round"
 className={`${isColored ? "text-violet-600" : ""} ${className}`}
 aria-label="Website"
 >
 <circle cx="12" cy="12" r="10" />
 <line x1="2" y1="12" x2="22" y2="12" />
 <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
 </svg>
 );
};

/**
 * Universal Dynamic Social Media Icon Component
 */
export const SocialIcon = ({ name = "", channel = "", size = 20, className = "", colorMode = "colored" }) => {
 const channelKey = (name || channel || "").toString().toLowerCase().trim();

 if (channelKey.includes("whatsapp")) {
 return <WhatsAppIcon size={size} className={className} colorMode={colorMode} />;
 }
 if (channelKey.includes("instagram")) {
 return <InstagramIcon size={size} className={className} colorMode={colorMode} />;
 }
 if (channelKey.includes("facebook")) {
 return <FacebookIcon size={size} className={className} colorMode={colorMode} />;
 }
 if (channelKey.includes("telegram")) {
 return <TelegramIcon size={size} className={className} colorMode={colorMode} />;
 }
 if (channelKey.includes("tiktok")) {
 return <TikTokIcon size={size} className={className} colorMode={colorMode} />;
 }
 if (channelKey.includes("twitter") || channelKey === "x" || channelKey.includes("x-social")) {
 return <XIcon size={size} className={className} colorMode={colorMode} />;
 }
 if (channelKey.includes("youtube")) {
 return <YouTubeIcon size={size} className={className} colorMode={colorMode} />;
 }
 if (channelKey.includes("pinterest")) {
 return <PinterestIcon size={size} className={className} colorMode={colorMode} />;
 }
 if (channelKey.includes("linkedin")) {
 return <LinkedInIcon size={size} className={className} colorMode={colorMode} />;
 }

 // Default to Website icon
 return <WebsiteIcon size={size} className={className} colorMode={colorMode} />;
};

export default SocialIcon;

