"use client";

interface Props {
  onClose: () => void;
}

const CHECKOUT_URL = process.env.NEXT_PUBLIC_LEMONSQUEEZY_CHECKOUT_URL ?? "#";

export default function UpgradeModal({ onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl max-w-sm w-full p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-400 text-xl"
          aria-label="Close"
        >
          ×
        </button>
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">⚡</div>
          <h2 className="text-xl font-bold text-white mb-2">Upgrade to Unlimited</h2>
          <p className="text-gray-400 text-sm">
            Unlimited code reviews for just{" "}
            <strong className="text-white">$5/month</strong>. Cancel anytime.
          </p>
        </div>
        <ul className="space-y-2 mb-6 text-sm text-gray-400">
          {[
            "Unlimited code reviews",
            "All languages supported",
            "Priority AI processing",
          ].map((f) => (
            <li key={f} className="flex items-center gap-2">
              <span className="text-violet-400">✓</span> {f}
            </li>
          ))}
        </ul>
        {/* LemonSqueezy overlay checkout — Lemon.js intercepts clicks on .lemonsqueezy-button */}
        <a
          href={`${CHECKOUT_URL}?embed=1`}
          className="lemonsqueezy-button block w-full text-center bg-violet-600 hover:bg-violet-500 text-white py-3 rounded-xl font-semibold transition-colors cursor-pointer"
        >
          Upgrade for $5/mo
        </a>
        <p className="text-xs text-gray-600 text-center mt-3">
          Powered by LemonSqueezy · Secure checkout
        </p>
      </div>
    </div>
  );
}
