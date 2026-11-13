import React from "react";

interface MascotProps {
  className?: string;
  size?: number;
  mood?: "curious" | "happy" | "reading" | "thoughtful";
  caption?: string;
  variant?: "3d" | "vector";
}

/**
  * Monkey Mascot — Curiosity & Discovery
  * Rendered as an expressive 3D Pixar/clay character explorer.
  */
export function MascotMonkey({ className = "", size = 120, caption, variant = "3d" }: MascotProps) {
  if (variant === "3d") {
    return (
      <div className={`inline-flex flex-col items-center select-none ${className}`}>
        <div
          style={{ width: size, height: size }}
          className="relative rounded-2xl overflow-hidden soft-surface border border-theme/80 bg-surface-secondary/40 shadow-sm transition-transform duration-300 hover:scale-105 p-1 flex items-center justify-center"
        >
          <img
            src="/images/mascot-monkey.jpg"
            alt="Monkey Mascot: Curiosity and Discovery"
            className="w-full h-full object-contain rounded-xl"
            loading="lazy"
          />
        </div>
        {caption && (
          <span className="text-xs font-semibold text-secondary-token text-center mt-1.5 max-w-[140px] tracking-tight">
            {caption}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`inline-flex flex-col items-center select-none ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Friendly Claymorphic Monkey Mascot: Curiosity and Discovery"
        className="filter drop-shadow-[0_8px_16px_rgba(35,71,53,0.18)] transition-transform duration-300 hover:scale-105"
      >
        <defs>
          <radialGradient id="monkey-body-clay" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#C48454" />
            <stop offset="60%" stopColor="#A86E45" />
            <stop offset="100%" stopColor="#7D4E2C" />
          </radialGradient>
          <radialGradient id="monkey-belly-clay" cx="45%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#F9E6D0" />
            <stop offset="80%" stopColor="#E8C7A3" />
            <stop offset="100%" stopColor="#CCA47D" />
          </radialGradient>
          <radialGradient id="monkey-face-clay" cx="50%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FFF2E2" />
            <stop offset="85%" stopColor="#F2DFC7" />
            <stop offset="100%" stopColor="#D9BEA0" />
          </radialGradient>
          <linearGradient id="brass-clay" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#E2BE76" />
            <stop offset="60%" stopColor="#BE9A56" />
            <stop offset="100%" stopColor="#8A6A2C" />
          </linearGradient>
        </defs>

        {/* Ambient Ground Shadow */}
        <ellipse cx="80" cy="148" rx="46" ry="7" fill="#24352B" fillOpacity="0.16" />

        {/* Tail with clay depth */}
        <path
          d="M48 116C36 120 20 108 26 94C30 84 46 88 44 98"
          stroke="#7D4E2C"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path
          d="M48 116C36 120 20 108 26 94C30 84 46 88 44 98"
          stroke="#C48454"
          strokeWidth="4"
          strokeLinecap="round"
          strokeOpacity="0.6"
        />

        {/* Sculpted Clay Body */}
        <ellipse cx="80" cy="108" rx="34" ry="32" fill="url(#monkey-body-clay)" />
        {/* Soft specular highlight on body shoulder */}
        <path
          d="M62 88C68 84 76 83 82 84"
          stroke="#FFFFFF"
          strokeWidth="3"
          strokeLinecap="round"
          strokeOpacity="0.4"
        />

        {/* Tummy */}
        <ellipse cx="80" cy="112" rx="22" ry="22" fill="url(#monkey-belly-clay)" />

        {/* Explorer Satchel Strap & Brass Buckle */}
        <path d="M60 88L98 126" stroke="#234735" strokeWidth="5" strokeLinecap="round" />
        <rect x="92" y="118" width="16" height="14" rx="4" fill="url(#brass-clay)" />
        <rect x="95" y="121" width="10" height="8" rx="2" fill="#234735" fillOpacity="0.3" />

        {/* Ears with clay depth */}
        <circle cx="44" cy="62" r="16" fill="url(#monkey-body-clay)" />
        <circle cx="44" cy="62" r="10" fill="url(#monkey-belly-clay)" />
        <circle cx="116" cy="62" r="16" fill="url(#monkey-body-clay)" />
        <circle cx="116" cy="62" r="10" fill="url(#monkey-belly-clay)" />

        {/* Sculpted Head */}
        <circle cx="80" cy="64" r="32" fill="url(#monkey-body-clay)" />
        {/* Head specular rim light */}
        <path
          d="M60 42C68 37 80 36 92 39"
          stroke="#FFFFFF"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeOpacity="0.5"
        />

        {/* Face Mask Plate */}
        <path
          d="M60 56C56 46 68 42 78 48C80 49 82 49 84 48C94 42 106 46 102 56C99 68 96 78 80 82C64 78 61 68 60 56Z"
          fill="url(#monkey-face-clay)"
        />

        {/* Expressive Curious Eyes */}
        <ellipse cx="71" cy="58" rx="4.5" ry="6" fill="#24352B" />
        <circle cx="73" cy="56" r="1.8" fill="#FFFFFF" />
        <circle cx="70" cy="60" r="0.8" fill="#FFFFFF" fillOpacity="0.6" />

        <ellipse cx="89" cy="58" rx="4.5" ry="6" fill="#24352B" />
        <circle cx="91" cy="56" r="1.8" fill="#FFFFFF" />
        <circle cx="88" cy="60" r="0.8" fill="#FFFFFF" fillOpacity="0.6" />

        {/* Friendly Snout and Smile */}
        <ellipse cx="80" cy="71" rx="4" ry="2.5" fill="#5D3316" />
        <path
          d="M74 74C77 78 83 78 86 74"
          stroke="#4F301A"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Cheek Blush */}
        <ellipse cx="64" cy="66" rx="4.5" ry="3" fill="#DF8A76" fillOpacity="0.5" />
        <ellipse cx="96" cy="66" rx="4.5" ry="3" fill="#DF8A76" fillOpacity="0.5" />

        {/* Hand holding a mini brass spyglass */}
        <ellipse cx="110" cy="88" rx="7" ry="7" fill="url(#monkey-body-clay)" />
        <rect
          x="108"
          y="74"
          width="18"
          height="8"
          rx="3"
          transform="rotate(-20 108 74)"
          fill="url(#brass-clay)"
        />
        <circle cx="125" cy="71" r="5" fill="#7F9E68" />
        <circle cx="125" cy="71" r="2.5" fill="#FFFFFF" fillOpacity="0.7" />
      </svg>
      {caption && (
        <span className="text-xs font-semibold text-secondary-token text-center mt-1.5 max-w-[140px] tracking-tight">
          {caption}
        </span>
      )}
    </div>
  );
}

/**
  * Lion Mascot — Leadership & Confidence
  * Rendered as an expressive 3D Pixar/clay character leader.
  */
export function MascotLion({ className = "", size = 120, caption, variant = "3d" }: MascotProps) {
  if (variant === "3d") {
    return (
      <div className={`inline-flex flex-col items-center select-none ${className}`}>
        <div
          style={{ width: size, height: size }}
          className="relative rounded-2xl overflow-hidden soft-surface border border-theme/80 bg-surface-secondary/40 shadow-sm transition-transform duration-300 hover:scale-105 p-1 flex items-center justify-center"
        >
          <img
            src="/images/mascot-lion.jpg"
            alt="Lion Mascot: Leadership and Confidence"
            className="w-full h-full object-contain rounded-xl"
            loading="lazy"
          />
        </div>
        {caption && (
          <span className="text-xs font-semibold text-secondary-token text-center mt-1.5 max-w-[140px] tracking-tight">
            {caption}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`inline-flex flex-col items-center select-none ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Friendly Claymorphic Lion Mascot: Leadership and Confidence"
        className="filter drop-shadow-[0_8px_16px_rgba(35,71,53,0.18)] transition-transform duration-300 hover:scale-105"
      >
        <defs>
          <radialGradient id="lion-mane-outer" cx="45%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#E5994A" />
            <stop offset="70%" stopColor="#C97524" />
            <stop offset="100%" stopColor="#9C5212" />
          </radialGradient>
          <radialGradient id="lion-head-clay" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#F9CE84" />
            <stop offset="75%" stopColor="#F0BA69" />
            <stop offset="100%" stopColor="#D19438" />
          </radialGradient>
          <radialGradient id="lion-snout-clay" cx="50%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="80%" stopColor="#FDF3DC" />
            <stop offset="100%" stopColor="#E8D5B0" />
          </radialGradient>
        </defs>

        {/* Ambient Ground Shadow */}
        <ellipse cx="80" cy="148" rx="48" ry="7" fill="#24352B" fillOpacity="0.16" />

        {/* Sculpted Cloud-Soft Mane */}
        <path
          d="M80 20C92 20 102 24 111 31C122 34 132 42 136 53C142 66 142 79 138 92C138 104 130 115 119 121C109 128 95 130 80 130C65 130 51 128 41 121C30 115 22 104 22 92C18 79 18 66 24 53C28 42 38 34 49 31C58 24 68 20 80 20Z"
          fill="url(#lion-mane-outer)"
        />
        {/* Specular Mane Highlight */}
        <path
          d="M60 26C72 22 88 22 100 26"
          stroke="#FFFFFF"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeOpacity="0.45"
        />

        {/* Inner Mane Ring */}
        <circle cx="80" cy="75" r="42" fill="#E5994A" />

        {/* Body */}
        <ellipse cx="80" cy="120" rx="30" ry="24" fill="url(#lion-head-clay)" />
        <ellipse cx="80" cy="124" rx="18" ry="16" fill="url(#lion-snout-clay)" />

        {/* Executive Collar Detail (Forest Green & Brass) */}
        <path d="M68 114L80 126L92 114" fill="#234735" />
        <circle cx="80" cy="122" r="3.5" fill="#BE9A56" />

        {/* Ears */}
        <circle cx="50" cy="46" r="11" fill="#E5994A" />
        <circle cx="50" cy="46" r="6" fill="#F7DCB0" />
        <circle cx="110" cy="46" r="11" fill="#E5994A" />
        <circle cx="110" cy="46" r="6" fill="#F7DCB0" />

        {/* Head */}
        <ellipse cx="80" cy="74" rx="29" ry="27" fill="url(#lion-head-clay)" />
        {/* Head highlight */}
        <path
          d="M68 53C75 50 85 50 92 53"
          stroke="#FFFFFF"
          strokeWidth="3"
          strokeLinecap="round"
          strokeOpacity="0.4"
        />

        {/* Snout / Cheeks with soft clay curves */}
        <ellipse cx="73" cy="82" rx="10" ry="8" fill="url(#lion-snout-clay)" />
        <ellipse cx="87" cy="82" rx="10" ry="8" fill="url(#lion-snout-clay)" />

        {/* Intelligent, Calm Eyes */}
        <ellipse cx="69" cy="68" rx="4.5" ry="6" fill="#24352B" />
        <circle cx="71" cy="66" r="1.8" fill="#FFFFFF" />
        <ellipse cx="91" cy="68" rx="4.5" ry="6" fill="#24352B" />
        <circle cx="93" cy="66" r="1.8" fill="#FFFFFF" />

        {/* Soft Eyebrows */}
        <path d="M64 61C68 59 73 60 75 62" stroke="#9A561D" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M96 61C92 59 87 60 85 62" stroke="#9A561D" strokeWidth="2.5" strokeLinecap="round" />

        {/* Regal Nose and Confident Smile */}
        <path d="M76 77C76 74 84 74 84 77C84 80 81 82 80 82C79 82 76 80 76 77Z" fill="#753B18" />
        <path d="M75 84C78 86 82 86 85 84" stroke="#753B18" strokeWidth="2" strokeLinecap="round" />
      </svg>
      {caption && (
        <span className="text-xs font-semibold text-secondary-token text-center mt-1.5 max-w-[140px] tracking-tight">
          {caption}
        </span>
      )}
    </div>
  );
}

/**
  * Elephant Mascot — Wisdom & Knowledge
  * Rendered as an expressive 3D Pixar/clay character scholar with glasses and green scarf holding books.
  */
export function MascotElephant({ className = "", size = 120, caption, variant = "3d" }: MascotProps) {
  if (variant === "3d") {
    return (
      <div className={`inline-flex flex-col items-center select-none ${className}`}>
        <div
          style={{ width: size, height: size }}
          className="relative rounded-2xl overflow-hidden soft-surface border border-theme/80 bg-surface-secondary/40 shadow-sm transition-transform duration-300 hover:scale-105 p-1 flex items-center justify-center"
        >
          <img
            src="/images/mascot-elephant-avatar.png"
            alt="Elephant Mascot: Wisdom and Knowledge"
            className="w-full h-full object-contain filter drop-shadow-sm"
            loading="lazy"
          />
        </div>
        {caption && (
          <span className="text-xs font-semibold text-secondary-token text-center mt-1.5 max-w-[140px] tracking-tight">
            {caption}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`inline-flex flex-col items-center select-none ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Friendly Claymorphic Elephant Mascot: Wisdom and Knowledge"
        className="filter drop-shadow-[0_8px_16px_rgba(35,71,53,0.18)] transition-transform duration-300 hover:scale-105"
      >
        <defs>
          <radialGradient id="elephant-clay" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#B4C7BF" />
            <stop offset="70%" stopColor="#9FB2A9" />
            <stop offset="100%" stopColor="#7A8E85" />
          </radialGradient>
          <radialGradient id="elephant-ear-inner" cx="45%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#E2ECE8" />
            <stop offset="85%" stopColor="#BCCEC6" />
            <stop offset="100%" stopColor="#A2B7AE" />
          </radialGradient>
        </defs>

        {/* Ambient Ground Shadow */}
        <ellipse cx="80" cy="148" rx="46" ry="7" fill="#24352B" fillOpacity="0.16" />

        {/* Huge Gentle Sculpted Ears */}
        <ellipse cx="40" cy="72" rx="24" ry="28" fill="url(#elephant-clay)" />
        <ellipse cx="42" cy="72" rx="16" ry="20" fill="url(#elephant-ear-inner)" />
        <ellipse cx="120" cy="72" rx="24" ry="28" fill="url(#elephant-clay)" />
        <ellipse cx="118" cy="72" rx="16" ry="20" fill="url(#elephant-ear-inner)" />

        {/* Body */}
        <ellipse cx="80" cy="116" rx="34" ry="28" fill="url(#elephant-clay)" />
        <ellipse cx="80" cy="120" rx="20" ry="18" fill="url(#elephant-ear-inner)" />

        {/* Head */}
        <ellipse cx="80" cy="68" rx="30" ry="28" fill="url(#elephant-clay)" />
        {/* Specular forehead light */}
        <path
          d="M68 46C74 43 86 43 92 46"
          stroke="#FFFFFF"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeOpacity="0.45"
        />

        {/* Thoughtful, Friendly Eyes with Scholar Glasses */}
        <circle cx="69" cy="63" r="8.5" fill="#FFFFFF" stroke="#234735" strokeWidth="2.5" />
        <circle cx="69" cy="63" r="4" fill="#24352B" />
        <circle cx="71" cy="61" r="1.5" fill="#FFFFFF" />

        <circle cx="91" cy="63" r="8.5" fill="#FFFFFF" stroke="#234735" strokeWidth="2.5" />
        <circle cx="91" cy="63" r="4" fill="#24352B" />
        <circle cx="93" cy="61" r="1.5" fill="#FFFFFF" />

        {/* Glasses bridge with brass accent */}
        <path d="M77.5 63H82.5" stroke="#BE9A56" strokeWidth="3" strokeLinecap="round" />

        {/* Gentle Trunk holding a leather bound book */}
        <path
          d="M75 75C74 86 73 98 80 106C84 110 92 108 92 101C92 95 86 93 84 96"
          stroke="#8EA39A"
          strokeWidth="11"
          strokeLinecap="round"
        />

        {/* Book in trunk with 3D spine */}
        <rect x="74" y="104" width="28" height="20" rx="4" fill="#BE9A56" />
        <rect x="72" y="106" width="5" height="16" rx="2" fill="#234735" />
        <line x1="82" y1="110" x2="98" y2="110" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        <line x1="82" y1="115" x2="95" y2="115" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />

        {/* Rosy Cheeks */}
        <ellipse cx="58" cy="72" rx="4.5" ry="3" fill="#E89F8B" fillOpacity="0.45" />
        <ellipse cx="102" cy="72" rx="4.5" ry="3" fill="#E89F8B" fillOpacity="0.45" />
      </svg>
      {caption && (
        <span className="text-xs font-semibold text-secondary-token text-center mt-1.5 max-w-[140px] tracking-tight">
          {caption}
        </span>
      )}
    </div>
  );
}

/**
  * Wolf Mascot — Strategy & Adventure
  * Rendered as an expressive 3D Pixar/clay character strategist with forest green headphones.
  */
export function MascotWolf({ className = "", size = 120, caption, variant = "3d" }: MascotProps) {
  if (variant === "3d") {
    return (
      <div className={`inline-flex flex-col items-center select-none ${className}`}>
        <div
          style={{ width: size, height: size }}
          className="relative rounded-2xl overflow-hidden soft-surface border border-theme/80 bg-surface-secondary/40 shadow-sm transition-transform duration-300 hover:scale-105 p-1 flex items-center justify-center"
        >
          <img
            src="/images/mascot-wolf-transparent.png"
            alt="Wolf Mascot: Strategy and Adventure"
            className="w-full h-full object-contain filter drop-shadow-sm"
            loading="lazy"
          />
        </div>
        {caption && (
          <span className="text-xs font-semibold text-secondary-token text-center mt-1.5 max-w-[140px] tracking-tight">
            {caption}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`inline-flex flex-col items-center select-none ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Friendly Claymorphic Wolf Mascot: Strategy and Adventure"
        className="filter drop-shadow-[0_8px_16px_rgba(35,71,53,0.18)] transition-transform duration-300 hover:scale-105"
      >
        <defs>
          <radialGradient id="wolf-fur-clay" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#8796A8" />
            <stop offset="70%" stopColor="#6B7A8C" />
            <stop offset="100%" stopColor="#4A5666" />
          </radialGradient>
          <radialGradient id="wolf-white-clay" cx="45%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="85%" stopColor="#F1F5F8" />
            <stop offset="100%" stopColor="#D5DFE8" />
          </radialGradient>
        </defs>

        {/* Ambient Ground Shadow */}
        <ellipse cx="80" cy="148" rx="44" ry="7" fill="#24352B" fillOpacity="0.16" />

        {/* Pointy Alert Ears */}
        <polygon points="52,48 40,16 64,34" fill="#4A5666" />
        <polygon points="52,44 45,24 60,34" fill="url(#wolf-white-clay)" />

        <polygon points="108,48 120,16 96,34" fill="#4A5666" />
        <polygon points="108,44 115,24 100,34" fill="url(#wolf-white-clay)" />

        {/* Body */}
        <ellipse cx="80" cy="118" rx="32" ry="26" fill="url(#wolf-fur-clay)" />
        <ellipse cx="80" cy="122" rx="18" ry="16" fill="url(#wolf-white-clay)" />

        {/* Head */}
        <path
          d="M48 64C48 48 62 38 80 38C98 38 112 48 112 64C112 76 104 88 80 94C56 88 48 76 48 64Z"
          fill="url(#wolf-fur-clay)"
        />
        {/* Forehead Specular */}
        <path
          d="M66 43C74 40 86 40 94 43"
          stroke="#FFFFFF"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeOpacity="0.4"
        />

        {/* Cheeks Tuft */}
        <polygon points="46,68 34,74 48,80" fill="#4A5666" />
        <polygon points="114,68 126,74 112,80" fill="#4A5666" />

        {/* Face Muzzle / Mask */}
        <path
          d="M62 60C62 54 69 50 80 50C91 50 98 54 98 60C98 72 90 84 80 86C70 84 62 72 62 60Z"
          fill="url(#wolf-white-clay)"
        />

        {/* Clever, Composed Amber Eyes */}
        <ellipse cx="71" cy="58" rx="4.5" ry="6" fill="#BE9A56" />
        <ellipse cx="71" cy="58" rx="2.5" ry="4" fill="#24352B" />
        <circle cx="72.5" cy="56" r="1.5" fill="#FFFFFF" />

        <ellipse cx="89" cy="58" rx="4.5" ry="6" fill="#BE9A56" />
        <ellipse cx="89" cy="58" rx="2.5" ry="4" fill="#24352B" />
        <circle cx="90.5" cy="56" r="1.5" fill="#FFFFFF" />

        {/* Nose and Clever Smile */}
        <ellipse cx="80" cy="73" rx="4.5" ry="3.5" fill="#24352B" />
        <path d="M76 77C78 79 82 79 84 77" stroke="#24352B" strokeWidth="2" strokeLinecap="round" />

        {/* Adventure Compass Pouch */}
        <circle cx="80" cy="120" r="8.5" fill="#BE9A56" stroke="#234735" strokeWidth="2" />
        <line x1="80" y1="115" x2="80" y2="125" stroke="#FFFFFF" strokeWidth="1.5" />
        <line x1="75" y1="120" x2="85" y2="120" stroke="#FFFFFF" strokeWidth="1.5" />
      </svg>
      {caption && (
        <span className="text-xs font-semibold text-secondary-token text-center mt-1.5 max-w-[140px] tracking-tight">
          {caption}
        </span>
      )}
    </div>
  );
}
