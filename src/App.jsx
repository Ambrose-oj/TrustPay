import { useState } from "react";
import "./App.css";

// ─── Constants ────────────────────────────────────────────────────────────────

const SCREENS = {
  CREATE:   "CREATE",
  SUMMARY:  "SUMMARY",
  DELIVERY: "DELIVERY",
  CONFIRM:  "CONFIRM",
};

const RIDER_POOL = [
  { name: "Emeka F.",  emoji: "🏍️", eta: "10–15 mins" },
  { name: "Tunde A.",  emoji: "🛵", eta: "8–12 mins"  },
  { name: "James O.",  emoji: "🏍️", eta: "15–20 mins" },
  { name: "David N.",  emoji: "🛵", eta: "5–10 mins"  },
  { name: "Chinedu K.",  emoji: "🏍️", eta: "12–18 mins" },
  { name: "Akin E.", emoji: "🛵", eta: "7–11 mins"  },
];

const randomRider = () =>
  RIDER_POOL[Math.floor(Math.random() * RIDER_POOL.length)];

const fmt = (val) =>
  `₦${Number(val).toLocaleString("en-NG")}`;

// ─── Tiny SVG Icons ───────────────────────────────────────────────────────────

const ChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18l6-6-6-6"/>
  </svg>
);

const CheckIcon = ({ size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6L9 17l-5-5"/>
  </svg>
);

const LockIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/>
    <path d="M7 11V7a5 5 0 0110 0v4"/>
  </svg>
);

const ShieldIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const UserIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const AlertIcon = ({ size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

const BigCheck = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

// ─── Shared Components ────────────────────────────────────────────────────────

function StepTrack({ current }) {
  const steps = ["Order", "Summary", "Delivery", "Confirm"];
  const keys  = [SCREENS.CREATE, SCREENS.SUMMARY, SCREENS.DELIVERY, SCREENS.CONFIRM];
  const idx   = keys.indexOf(current);

  return (
    <div className="step-track">
      {steps.map((label, i) => (
        <div key={label} style={{ display: "flex", alignItems: "center" }}>
          <div className="step-item">
            <div className={`step-circle ${i < idx ? "done" : i === idx ? "active" : ""}`}>
              {i < idx ? <CheckIcon size={11} /> : i + 1}
            </div>
            <span className={`step-label ${i < idx ? "done" : i === idx ? "active" : ""}`}>
              {label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`step-line ${i < idx ? "done" : ""}`} />
          )}
        </div>
      ))}
    </div>
  );
}

function Field({ label, type = "text", value, onChange, placeholder, error, className = "" }) {
  return (
    <div className={`field ${className}`}>
      <label className="field-label">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`field-input${error ? " field-error-state" : ""}`}
      />
      {error && (
        <span className="field-error-msg">
          <AlertIcon size={12} /> {error}
        </span>
      )}
    </div>
  );
}

function Row({ label, value, green, mono }) {
  return (
    <div className="detail-row">
      <span className="row-key">{label}</span>
      <span className={`row-val${green ? " row-green" : ""}${mono ? " row-mono" : ""}`}>
        {value}
      </span>
    </div>
  );
}

// ─── Screen 1: Create Order ───────────────────────────────────────────────────

function CreateOrderScreen({ onSubmit }) {
  const [form, setForm] = useState({ itemName: "", amount: "", buyerName: "", sellerName: "" });
  const [errors, setErrors] = useState({});

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const validate = () => {
    const err = {};
    if (!form.itemName.trim())                                err.itemName   = "Required";
    if (!form.amount || isNaN(form.amount) || +form.amount <= 0) err.amount = "Enter a valid amount";
    if (!form.buyerName.trim())                               err.buyerName  = "Required";
    if (!form.sellerName.trim())                              err.sellerName = "Required";
    setErrors(err);
    return !Object.keys(err).length;
  };

  return (
    <div className="card screen-enter">
      <div className="card-head">
        <h2 className="card-title">New Transaction</h2>
        <p className="card-sub">Your payment is held in escrow — protected until you confirm delivery.</p>
      </div>

      <div className="form-stack">
        <Field label="Item Name" value={form.itemName} onChange={set("itemName")}
          placeholder="e.g. iPhone 15 Pro Max" error={errors.itemName} />
        <Field label="Amount (₦)" type="number" value={form.amount} onChange={set("amount")}
          placeholder="e.g. 850000" error={errors.amount} />
        <div className="form-row">
          <Field label="Buyer Name" value={form.buyerName} onChange={set("buyerName")}
            placeholder="e.g. Tunde" error={errors.buyerName} />
          <Field label="Seller Name" value={form.sellerName} onChange={set("sellerName")}
            placeholder="e.g. Amara" error={errors.sellerName} />
        </div>
      </div>

      <div className="escrow-note">
        <LockIcon size={14} />
        <span>Funds are locked in escrow until you confirm receipt</span>
      </div>

      <button className="btn btn-dark" onClick={() => validate() && onSubmit(form)}>
        Create Order <ChevronRight />
      </button>
    </div>
  );
}

// ─── Screen 2: Order Summary ──────────────────────────────────────────────────

function OrderSummaryScreen({ order, onProceed }) {
  return (
    <div className="card screen-enter">
      <div className="card-head row-between">
        <div>
          <h2 className="card-title">Order Summary</h2>
          <p className="card-sub">Here's where your money is right now.</p>
        </div>
        <span className="badge badge-green">
          <span className="pulse-dot green" /> Secured
        </span>
      </div>

      {/* ── Money Flow Visual ── */}
      <div className="money-flow">
        <div className="flow-node">
          <div className="flow-icon flow-icon-muted">
            <UserIcon size={17} />
          </div>
          <span className="flow-node-role">Buyer</span>
          <span className="flow-node-name">{order.buyerName}</span>
        </div>

        <div className="flow-arrow">
          <div className="flow-arrow-track">
            <div className="flow-arrow-anim" />
          </div>
          <div className="flow-arrow-tip" />
        </div>

        {/* Active escrow node */}
        <div className="flow-node">
          <div className="flow-icon flow-icon-active">
            <ShieldIcon size={19} />
          </div>
          <span className="flow-node-role">Escrow</span>
          <span className="flow-node-held">Funds held here</span>
          <span className="flow-node-amount">{fmt(order.amount)}</span>
        </div>

        <div className="flow-arrow flow-arrow-inactive">
          <div className="flow-arrow-track inactive" />
          <div className="flow-arrow-tip inactive" />
        </div>

        <div className="flow-node">
          <div className="flow-icon flow-icon-locked">
            <UserIcon size={17} />
          </div>
          <span className="flow-node-role">Seller</span>
          <span className="flow-node-name">{order.sellerName}</span>
        </div>
      </div>

      <p className="flow-caption">
        💡 Funds move to the seller only after you inspect and confirm delivery.
      </p>

      {/* ── Details ── */}
      <div className="detail-box">
        <Row label="Item"   value={order.itemName} />
        <Row label="Amount" value={fmt(order.amount)} green />
        <Row label="Status" value="Payment Secured ✓" green />
      </div>

      <button className="btn btn-dark" onClick={onProceed} style={{ marginTop: "1.25rem" }}>
        Proceed to Delivery <ChevronRight />
      </button>
    </div>
  );
}

// ─── Screen 3: Delivery ───────────────────────────────────────────────────────

function DeliveryScreen({ order, rider, onConfirm }) {
  return (
    <div className="card screen-enter">
      <div className="card-head row-between">
        <div>
          <h2 className="card-title">Delivery</h2>
          <p className="card-sub">Your item is on the way.</p>
        </div>
        <span className="badge badge-amber">
          <span className="pulse-dot amber" /> On the Way
        </span>
      </div>

      {/* ── Rider Card ── */}
      <div className="rider-card">
        <div className="rider-avatar">{rider.emoji}</div>
        <div className="rider-info">
          <p className="rider-label">Assigned Rider</p>
          <p className="rider-name">{rider.name}</p>
          <p className="rider-eta">⏱ Arriving in {rider.eta}</p>
        </div>
        <div className="rider-item-tag">
          <p className="rider-item-label">Carrying</p>
          <p className="rider-item-name">{order.itemName}</p>
        </div>
      </div>

      {/* ── Delivery Steps ── */}
      <div className="delivery-steps">
        {/* Step 1: Packed — done */}
        <div className="d-step">
          <div className="d-step-left">
            <div className="d-icon d-icon-done"><CheckIcon size={12} /></div>
            <div className="d-line d-line-done" />
          </div>
          <div className="d-content">
            <p className="d-title">Order Packed</p>
            <p className="d-time">Completed · Handed to rider</p>
          </div>
        </div>

        {/* Step 2: Out for delivery — active */}
        <div className="d-step">
          <div className="d-step-left">
            <div className="d-icon d-icon-active">🛵</div>
            <div className="d-line" />
          </div>
          <div className="d-content">
            <p className="d-title">Out for Delivery</p>
            <p className="d-time d-time-active">En route · {rider.eta} away</p>
          </div>
        </div>

        {/* Step 3: Arriving — pending */}
        <div className="d-step">
          <div className="d-step-left">
            <div className="d-icon d-icon-pending">📍</div>
          </div>
          <div className="d-content">
            <p className="d-title d-title-muted">Arriving Soon</p>
            <p className="d-time">Waiting for your confirmation</p>
          </div>
        </div>
      </div>

      <div className="escrow-note" style={{ marginBottom: "1.25rem" }}>
        <LockIcon size={14} />
        <span>Payment stays in escrow until you confirm receipt below</span>
      </div>

      <button className="btn btn-dark" onClick={onConfirm}>
        Confirm Delivery <ChevronRight />
      </button>
    </div>
  );
}

// ─── Screen 4: Inspection + PIN ───────────────────────────────────────────────

const CHECKS = [
  { id: "received",  label: "Item received",             sub: "I have the item in hand"              },
  { id: "matches",   label: "Item matches description",  sub: "Looks exactly as described by seller" },
  { id: "condition", label: "Item is in good condition", sub: "No damage or missing parts"           },
];

function ConfirmationScreen({ order }) {
  const [checked, setChecked] = useState({});
  const [pin,     setPin]     = useState("");
  const [pinErr,  setPinErr]  = useState("");
  const [done,    setDone]    = useState(false);

  const count    = Object.values(checked).filter(Boolean).length;
  const allDone  = count === CHECKS.length;
  const anyDone  = count > 0;

  const toggle = (id) => setChecked((p) => ({ ...p, [id]: !p[id] }));

  const release = () => {
    if (!pin.trim()) { setPinErr("Enter your PIN to continue"); return; }
    setDone(true);
  };

  /* ── Success ── */
  if (done) {
    return (
      <div className="card screen-enter">
        <div className="success-wrap">
          <div className="success-ring">
            <BigCheck size={38} />
          </div>
          <h2 className="success-title">Payment Released!</h2>
          <p className="success-sub">
            {fmt(order.amount)} has been sent to <strong>{order.sellerName}</strong>.
            <br />Transaction complete.
          </p>
        </div>

        <div className="success-detail">
          <Row label="Item"    value={order.itemName} />
          <Row label="Amount"  value={fmt(order.amount)} green />
          <Row label="Paid to" value={order.sellerName} />
          <Row label="Buyer"   value={order.buyerName} />
        </div>

        <div className="success-banner">
          ✅ Payment Released Successfully
        </div>
      </div>
    );
  }

  /* ── Confirm Flow ── */
  return (
    <div className="card screen-enter">
      <div className="card-head">
        <h2 className="card-title">Inspect Your Item</h2>
        <p className="card-sub">
          Check each condition before releasing payment to {order.sellerName}.
        </p>
      </div>

      {/* inspection notice */}
      <div className="inspect-notice">
        <ShieldIcon size={16} />
        <div>
          <p className="inspect-notice-title">Buyer Protection Active</p>
          <p className="inspect-notice-sub">
            Your {fmt(order.amount)} is still held safely in escrow. Inspect first — release when satisfied.
          </p>
        </div>
      </div>

      {/* checklist */}
      <p className="section-label">{count}/{CHECKS.length} conditions confirmed</p>
      <div className="checklist">
        {CHECKS.map((item) => (
          <div
            key={item.id}
            className={`check-item${checked[item.id] ? " checked" : ""}`}
            onClick={() => toggle(item.id)}
          >
            <div className="check-box">
              {checked[item.id] && <CheckIcon size={11} />}
            </div>
            <div>
              <p className="check-label">{item.label}</p>
              <p className="check-sub">{item.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* PIN — reveals after at least one check */}
      {anyDone && (
        <div className="pin-section">
          <div className="pin-amount-row">
            <span className="pin-amount-label">Releasing</span>
            <span className="pin-amount-value">{fmt(order.amount)}</span>
            <span className="pin-amount-to">to {order.sellerName}</span>
          </div>

          <Field
            label="Enter PIN to Release"
            type="password"
            value={pin}
            onChange={(e) => { setPin(e.target.value); setPinErr(""); }}
            placeholder="••••••"
            error={pinErr}
            className="pin-field"
          />

          <button
            className={`btn ${allDone && pin.trim() ? "btn-green" : "btn-disabled"}`}
            onClick={release}
            disabled={!allDone || !pin.trim()}
          >
            <LockIcon size={15} />
            {allDone ? "Confirm & Release Payment" : `${CHECKS.length - count} check${CHECKS.length - count > 1 ? "s" : ""} remaining`}
          </button>
        </div>
      )}

      {!anyDone && (
        <button className="btn btn-disabled" disabled>
          <LockIcon size={15} /> Complete inspection to release
        </button>
      )}
    </div>
  );
}

// ─── App Root ─────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState(SCREENS.CREATE);
  const [order,  setOrder]  = useState(null);
  const [rider]             = useState(randomRider);

  const go = (s) => setScreen(s);

  return (
    <div className="app-root">
      <div className="app-shell">

        <div className="brand">
          <div className="brand-pill">
            <span className="pulse-dot green" />
            <span>Secure Escrow</span>
          </div>
          <h1 className="brand-name">Trust<span>Pay</span></h1>
          <p className="brand-tag">Safe. Simple. Secure.</p>
        </div>

        <StepTrack current={screen} />

        {screen === SCREENS.CREATE && (
          <CreateOrderScreen onSubmit={(d) => { setOrder(d); go(SCREENS.SUMMARY); }} />
        )}
        {screen === SCREENS.SUMMARY && order && (
          <OrderSummaryScreen order={order} onProceed={() => go(SCREENS.DELIVERY)} />
        )}
        {screen === SCREENS.DELIVERY && order && (
          <DeliveryScreen order={order} rider={rider} onConfirm={() => go(SCREENS.CONFIRM)} />
        )}
        {screen === SCREENS.CONFIRM && order && (
          <ConfirmationScreen order={order} />
        )}

        <p className="app-footer">
          <LockIcon size={11} /> End-to-end escrow protection
        </p>
      </div>
    </div>
  );
}
