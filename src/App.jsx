import { useState } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────

const SCREENS = {
  CREATE: "CREATE",
  SUMMARY: "SUMMARY",
  DELIVERY: "DELIVERY",
  CONFIRM: "CONFIRM",
};

const RIDER_NAMES = [
  "James O.", "Chinedu K.", "David N.", "Akin E.",
  "Tunde A.", "Nnamdi B.", "Emeka F.", "Ahmed M.",
];

const randomRider = () =>
  RIDER_NAMES[Math.floor(Math.random() * RIDER_NAMES.length)];

// ─── Shared UI Components ─────────────────────────────────────────────────────

function StepIndicator({ current }) {
  const steps = ["Order", "Summary", "Delivery", "Confirm"];
  const currentIndex = [
    SCREENS.CREATE, SCREENS.SUMMARY, SCREENS.DELIVERY, SCREENS.CONFIRM,
  ].indexOf(current);

  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {steps.map((label, i) => (
        <div key={label} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-500
                ${i < currentIndex
                  ? "bg-emerald-500 border-emerald-500 text-white"
                  : i === currentIndex
                  ? "bg-slate-800 border-slate-800 text-white"
                  : "bg-white border-slate-200 text-slate-400"
                }`}
            >
              {i < currentIndex ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                i + 1
              )}
            </div>
            <span
              className={`text-[10px] mt-1 font-medium tracking-wide transition-colors duration-300
                ${i === currentIndex ? "text-slate-800" : i < currentIndex ? "text-emerald-500" : "text-slate-300"}`}
            >
              {label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={`w-12 h-0.5 mx-1 mb-4 rounded transition-all duration-500
                ${i < currentIndex ? "bg-emerald-400" : "bg-slate-200"}`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-lg shadow-slate-100 border border-slate-100 p-8 animate-fadeIn ${className}`}
    >
      {children}
    </div>
  );
}

function InputField({ label, type = "text", value, onChange, placeholder, error }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-4 py-3 rounded-xl border text-slate-800 text-sm placeholder:text-slate-300
          focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent transition-all duration-200
          ${error ? "border-rose-400 bg-rose-50" : "border-slate-200 bg-slate-50 hover:border-slate-300"}`}
      />
      {error && (
        <p className="text-xs text-rose-500 flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}

function PrimaryButton({ children, onClick, disabled = false, variant = "dark" }) {
  const variants = {
    dark: "bg-slate-800 text-white hover:bg-slate-700 active:bg-slate-900",
    green: "bg-emerald-500 text-white hover:bg-emerald-600 active:bg-emerald-700",
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-3.5 px-6 rounded-xl font-semibold text-sm tracking-wide
        transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98]
        disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-sm
        ${variants[variant]}`}
    >
      {children}
    </button>
  );
}

function DetailRow({ label, value, highlight = false }) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-slate-100 last:border-0">
      <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{label}</span>
      <span className={`text-sm font-semibold ${highlight ? "text-emerald-600" : "text-slate-800"}`}>
        {value}
      </span>
    </div>
  );
}

function StatusBadge({ label, color = "emerald" }) {
  const colors = {
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${colors[color]}`}>
      <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${color === "emerald" ? "bg-emerald-500" : color === "amber" ? "bg-amber-500" : "bg-blue-500"}`} />
      {label}
    </span>
  );
}

// ─── Screen 1: Create Order ───────────────────────────────────────────────────

function CreateOrderScreen({ onSubmit }) {
  const [form, setForm] = useState({
    itemName: "", amount: "", buyerName: "", sellerName: "",
  });
  const [errors, setErrors] = useState({});

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const newErrors = {};
    if (!form.itemName.trim()) newErrors.itemName = "Item name is required";
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0)
      newErrors.amount = "Enter a valid amount";
    if (!form.buyerName.trim()) newErrors.buyerName = "Buyer name is required";
    if (!form.sellerName.trim()) newErrors.sellerName = "Seller name is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) onSubmit(form);
  };

  return (
    <Card>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">New Transaction</h2>
        <p className="text-sm text-slate-400 mt-1">Fill in the details to create a secure escrow order.</p>
      </div>

      <div className="flex flex-col gap-4">
        <InputField
          label="Item Name"
          value={form.itemName}
          onChange={set("itemName")}
          placeholder="e.g. MacBook Pro 14-inch"
          error={errors.itemName}
        />
        <InputField
          label="Amount (₦)"
          type="number"
          value={form.amount}
          onChange={set("amount")}
          placeholder="e.g. 350000"
          error={errors.amount}
        />
        <div className="grid grid-cols-2 gap-3">
          <InputField
            label="Buyer Name"
            value={form.buyerName}
            onChange={set("buyerName")}
            placeholder="e.g. Tunde"
            error={errors.buyerName}
          />
          <InputField
            label="Seller Name"
            value={form.sellerName}
            onChange={set("sellerName")}
            placeholder="e.g. Amara"
            error={errors.sellerName}
          />
        </div>
      </div>

      <div className="mt-7">
        <PrimaryButton onClick={handleSubmit}>Create Order →</PrimaryButton>
      </div>
    </Card>
  );
}

// ─── Screen 2: Order Summary ──────────────────────────────────────────────────

function OrderSummaryScreen({ order, onProceed }) {
  return (
    <Card>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Order Summary</h2>
          <StatusBadge label="Payment Secured" color="emerald" />
        </div>
        <p className="text-sm text-slate-400 mt-1">Funds are held in escrow until delivery is confirmed.</p>
      </div>

      <div className="bg-slate-50 rounded-xl p-4 mb-6">
        <DetailRow label="Item" value={order.itemName} />
        <DetailRow
          label="Amount"
          value={`₦${Number(order.amount).toLocaleString()}`}
          highlight
        />
        <DetailRow label="Buyer" value={order.buyerName} />
        <DetailRow label="Seller" value={order.sellerName} />
        <DetailRow label="Status" value="Payment Secured" highlight />
      </div>

      <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-100 rounded-xl p-4 mb-6">
        <svg className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        <p className="text-xs text-emerald-700 leading-relaxed">
          Your payment is securely held in escrow. Funds will only be released to the seller once you confirm receipt of the item.
        </p>
      </div>

      <PrimaryButton onClick={onProceed}>Proceed to Delivery →</PrimaryButton>
    </Card>
  );
}

// ─── Screen 3: Delivery ───────────────────────────────────────────────────────

function DeliveryScreen({ order, rider, onConfirm }) {
  return (
    <Card>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800 tracking-normal">Delivery</h2>
          <StatusBadge label="Out for Delivery" color="amber" />
        </div>
        <p className="text-sm text-slate-400 mt-1 tracking-wide">Your item is on its way.</p>
      </div>

      {/* Delivery illustration */}
      <div className="flex flex-col items-center py-6 mb-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-100">
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-3">
          <svg className="w-8 h-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
          </svg>
        </div>
        <p className="text-xs font-semibold text-amber-600 uppercase tracking-widest mb-1">Assigned Rider</p>
        <p className="text-xl font-bold text-slate-800">{rider}</p>
      </div>

      <div className="bg-slate-50 rounded-xl p-4 mb-6">
        <DetailRow label="Item" value={order.itemName} />
        <DetailRow label="Delivering to" value={order.buyerName} />
      </div>

      <PrimaryButton onClick={onConfirm}>Confirm Delivery →</PrimaryButton>
    </Card>
  );
}

// ─── Screen 4: Confirmation ───────────────────────────────────────────────────

function ConfirmationScreen({ order }) {
  const [pin, setPin] = useState("");
  const [released, setReleased] = useState(false);
  const [error, setError] = useState("");

  const handleRelease = () => {
    if (!pin.trim()) {
      setError("PIN cannot be empty");
      return;
    }
    setError("");
    setReleased(true);
  };

  if (released) {
    return (
      <Card>
        <div className="flex flex-col items-center text-center py-4 animate-fadeIn">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-10 h-10 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight mb-2">
            Payment Released Successfully!
          </h2>
          <p className="text-sm text-slate-400 mb-6 leading-relaxed">
            ₦{Number(order.amount).toLocaleString()} has been released to <span className="font-semibold text-slate-600">{order.sellerName}</span>. The transaction is now complete.
          </p>

          <div className="w-full bg-emerald-50 border border-emerald-100 rounded-xl p-4">
            <DetailRow label="Item" value={order.itemName} />
            <DetailRow label="Amount" value={`₦${Number(order.amount).toLocaleString()}`} highlight />
            <DetailRow label="Paid to" value={order.sellerName} />
            <DetailRow label="Status" value="Completed ✓" highlight />
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Release Payment</h2>
        <p className="text-sm text-slate-400 mt-1">
          Enter your secure PIN to release funds to {order.sellerName}.
        </p>
      </div>

      <div className="flex flex-col items-center bg-slate-50 rounded-xl p-6 mb-6">
        <svg className="w-10 h-10 text-slate-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
        </svg>
        <p className="text-xs text-slate-500 text-center">
          Amount to release: <span className="font-bold text-slate-800">₦{Number(order.amount).toLocaleString()}</span>
        </p>
      </div>

      <div className="mb-6">
        <InputField
          label="Enter PIN"
          type="password"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          placeholder="••••••"
          error={error}
        />
      </div>

      <PrimaryButton onClick={handleRelease} variant="green">
        Release Payment
      </PrimaryButton>
    </Card>
  );
}

// ─── App Root ─────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState(SCREENS.CREATE);
  const [order, setOrder] = useState(null);
  const [rider] = useState(randomRider);

  const handleCreateOrder = (formData) => {
    setOrder(formData);
    setScreen(SCREENS.SUMMARY);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-gray-100 flex items-center justify-center px-4 py-12 font-sans">
      {/* Subtle background texture */}
      <div className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 20%, rgba(148,163,184,0.08) 0%, transparent 60%),
                            radial-gradient(circle at 80% 80%, rgba(100,116,139,0.06) 0%, transparent 60%)`,
        }}
      />

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-1.5 shadow-sm mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-slate-600 tracking-wide">Secure Escrow</span>
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">TrustPay</h1>
          <p className="text-sm text-slate-400 mt-1">Safe. Simple. Secure.</p>
        </div>

        {/* Step Indicator */}
        <StepIndicator current={screen} />

        {/* Screens */}
        {screen === SCREENS.CREATE && (
          <CreateOrderScreen onSubmit={handleCreateOrder} />
        )}
        {screen === SCREENS.SUMMARY && order && (
          <OrderSummaryScreen order={order} onProceed={() => setScreen(SCREENS.DELIVERY)} />
        )}
        {screen === SCREENS.DELIVERY && order && (
          <DeliveryScreen order={order} rider={rider} onConfirm={() => setScreen(SCREENS.CONFIRM)} />
        )}
        {screen === SCREENS.CONFIRM && order && (
          <ConfirmationScreen order={order} />
        )}

        {/* Footer */}
        <p className="text-center text-xs text-slate-300 mt-6">
          Protected by end-to-end escrow encryption
        </p>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.35s ease-out both;
        }
      `}</style>
    </div>
  );
}
