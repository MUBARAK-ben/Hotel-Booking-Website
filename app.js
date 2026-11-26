const TAX_RATE = 0.075; // 7.5% VAT

const ROOMS = [
  {
    id: "RM-DLX",
    name: "Deluxe King Room",
    category: "Standard",
    totalUnits: 4,
    maxGuests: 2,
    bedSpec: "1 King Bed",
    sizeSqm: 34,
    nightlyRate: 65000,
    image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=900&q=80",
    description:
      "Warm, quiet room designed for solo travelers and couples, featuring blackout drapes, ergonomic work desk, walk-in rain shower, and complimentary breakfast for two.",
    amenities: ["Free Breakfast", "Fiber Wi-Fi", "24/7 Power", "Work Desk", "Smart TV", "Mini Fridge"]
  },
  {
    id: "RM-TWN",
    name: "Superior Twin Room",
    category: "Standard",
    totalUnits: 3,
    maxGuests: 2,
    bedSpec: "2 Twin Beds",
    sizeSqm: 36,
    nightlyRate: 70000,
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=900&q=80",
    description:
      "Ideal for colleagues, friends, or siblings traveling together, equipped with two comfortable single beds, ample wardrobe space, and daily housekeeping.",
    amenities: ["Free Breakfast", "Fiber Wi-Fi", "24/7 Power", "Coffee Station", "Safe Box", "Rain Shower"]
  },
  {
    id: "RM-EXE",
    name: "Executive Suite",
    category: "Suite",
    totalUnits: 3,
    maxGuests: 3,
    bedSpec: "1 King Bed + Lounge",
    sizeSqm: 58,
    nightlyRate: 115000,
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80",
    description:
      "Separate living area with sofa seating and dining corner, tailored for extended business stays, small meetings, or guests who want extra space to unwind.",
    amenities: ["Free Breakfast", "Separate Lounge", "Express Laundry Credit", "Fiber Wi-Fi", "24/7 Power", "Bathtub"]
  },
  {
    id: "RM-FAM",
    name: "Family Two-Bedroom Residence",
    category: "Family",
    totalUnits: 2,
    maxGuests: 4,
    bedSpec: "1 King + 2 Twins",
    sizeSqm: 82,
    nightlyRate: 165000,
    image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=900&q=80",
    description:
      "Spacious two-bedroom layout with two bathrooms and a shared living room—built for families looking for comfort, privacy, and easy access to dining.",
    amenities: ["Breakfast for 4", "2 Bedrooms & 2 Baths", "Living & Dining Area", "Fiber Wi-Fi", "24/7 Power", "Airport Transfer Option"]
  }
];

const DEFAULT_UNITS = [
  { unitNo: "101", roomId: "RM-DLX", roomName: "Deluxe King", status: "Clean" },
  { unitNo: "102", roomId: "RM-DLX", roomName: "Deluxe King", status: "Occupied" },
  { unitNo: "103", roomId: "RM-DLX", roomName: "Deluxe King", status: "Dirty" },
  { unitNo: "104", roomId: "RM-DLX", roomName: "Deluxe King", status: "Clean" },
  { unitNo: "201", roomId: "RM-TWN", roomName: "Superior Twin", status: "Clean" },
  { unitNo: "202", roomId: "RM-TWN", roomName: "Superior Twin", status: "Clean" },
  { unitNo: "203", roomId: "RM-TWN", roomName: "Superior Twin", status: "Maintenance" },
  { unitNo: "301", roomId: "RM-EXE", roomName: "Executive Suite", status: "Occupied" },
  { unitNo: "302", roomId: "RM-EXE", roomName: "Executive Suite", status: "Clean" },
  { unitNo: "303", roomId: "RM-EXE", roomName: "Executive Suite", status: "Clean" },
  { unitNo: "401", roomId: "RM-FAM", roomName: "Family Residence", status: "Clean" },
  { unitNo: "402", roomId: "RM-FAM", roomName: "Family Residence", status: "Dirty" }
];

const DEFAULT_BOOKINGS = [
  {
    ref: "CW-2026-410",
    roomId: "RM-DLX",
    roomName: "Deluxe King Room",
    guestName: "Musa Abdullahi",
    guestPhone: "0803 222 1190",
    checkIn: "2026-11-23",
    checkOut: "2026-11-25",
    nights: 2,
    roomsBooked: 1,
    totalPaid: 139750,
    status: "Confirmed"
  },
  {
    ref: "CW-2026-412",
    roomId: "RM-EXE",
    roomName: "Executive Suite",
    guestName: "Zainab Suleiman",
    guestPhone: "0812 880 4411",
    checkIn: "2026-11-22",
    checkOut: "2026-11-24",
    nights: 2,
    roomsBooked: 1,
    totalPaid: 247250,
    status: "Checked-In"
  }
];

let bookings = JSON.parse(localStorage.getItem("cedarwood_bookings") || "null") || structuredClone(DEFAULT_BOOKINGS);
let roomUnits = JSON.parse(localStorage.getItem("cedarwood_units") || "null") || structuredClone(DEFAULT_UNITS);

function saveState() {
  localStorage.setItem("cedarwood_bookings", JSON.stringify(bookings));
  localStorage.setItem("cedarwood_units", JSON.stringify(roomUnits));
  const activeCount = bookings.filter((b) => b.status === "Confirmed" || b.status === "Checked-In").length;
  document.getElementById("bookingCount").textContent = activeCount;
}

function formatNaira(amount) {
  return "₦" + Math.round(Number(amount || 0)).toLocaleString("en-NG");
}

// Date Helpers
const checkInInput = document.getElementById("checkInDate");
const checkOutInput = document.getElementById("checkOutDate");
const guestsSelect = document.getElementById("guestsCount");
const categorySelect = document.getElementById("roomCategoryFilter");

function toDateStr(offsetDays) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

checkInInput.value = toDateStr(0);
checkOutInput.value = toDateStr(2);
checkInInput.min = toDateStr(0);

function getNights() {
  const start = new Date(checkInInput.value);
  const end = new Date(checkOutInput.value);
  const diff = Math.round((end - start) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 1;
}

function syncCheckOutMin() {
  if (checkOutInput.value <= checkInInput.value) {
    const nextDay = new Date(checkInInput.value);
    nextDay.setDate(nextDay.getDate() + 1);
    checkOutInput.value = nextDay.toISOString().slice(0, 10);
  }
  renderRooms();
}

checkInInput.addEventListener("change", syncCheckOutMin);
checkOutInput.addEventListener("change", syncCheckOutMin);

function datesOverlap(startA, endA, startB, endB) {
  return startA < endB && endA > startB;
}

function getAvailableUnits(room) {
  const inDate = checkInInput.value;
  const outDate = checkOutInput.value;

  const maintenanceUnits = roomUnits.filter((u) => u.roomId === room.id && u.status === "Maintenance").length;
  const reservedUnits = bookings
    .filter(
      (b) =>
        (b.status === "Confirmed" || b.status === "Checked-In") &&
        b.roomId === room.id &&
        datesOverlap(inDate, outDate, b.checkIn, b.checkOut)
    )
    .reduce((sum, b) => sum + b.roomsBooked, 0);

  return Math.max(0, room.totalUnits - maintenanceUnits - reservedUnits);
}

function renderRooms() {
  const nights = getNights();
  const guests = Number(guestsSelect.value);
  const category = categorySelect.value;

  document.getElementById("staySummaryText").textContent =
    `${checkInInput.value} to ${checkOutInput.value} (${nights} ${nights === 1 ? "night" : "nights"}) • ${guests} ${guests === 1 ? "guest" : "guests"}`;

  const visibleRooms = ROOMS.filter((r) => category === "all" || r.category === category);

  document.getElementById("roomsGrid").innerHTML = visibleRooms
    .map((room) => {
      const availableUnits = getAvailableUnits(room);
      const fitsGuests = room.maxGuests >= guests;
      const canBook = availableUnits > 0 && fitsGuests;
      const stayWithTax = room.nightlyRate * nights * (1 + TAX_RATE);

      let stockLabel = `${availableUnits} ${availableUnits === 1 ? "room" : "rooms"} available`;
      let stockCss = "";
      if (availableUnits === 0) {
        stockLabel = "Sold out for dates";
        stockCss = "sold-out";
      } else if (!fitsGuests) {
        stockLabel = `Max ${room.maxGuests} guests`;
        stockCss = "sold-out";
      }

      return `
        <article class="room-card">
          <div class="room-img-wrap">
            <img src="${room.image}" alt="${room.name}" loading="lazy" />
            <span class="room-badge">${room.category}</span>
            <span class="stock-badge ${stockCss}">${stockLabel}</span>
          </div>

          <div class="room-body">
            <h3 class="room-title">${room.name}</h3>
            <p class="room-specs">${room.bedSpec} &bull; Up to ${room.maxGuests} guests &bull; ${room.sizeSqm} m²</p>

            <div class="room-amenities-mini">
              ${room.amenities.slice(0, 4).map((a) => `<span class="mini-tag">${a}</span>`).join("")}
            </div>

            <div class="room-pricing">
              <div class="nightly-price">
                ${formatNaira(room.nightlyRate)} <small>/ night</small>
              </div>
              <div class="stay-total">
                Est. ${nights}n (incl. VAT)
                <strong>${formatNaira(stayWithTax)}</strong>
              </div>
            </div>

            <div class="room-actions">
              <button type="button" class="btn btn-outline" data-details-room="${room.id}">Room Details</button>
              <button type="button" class="btn btn-accent" data-reserve-room="${room.id}" ${!canBook ? "disabled" : ""}>
                ${canBook ? "Reserve Now" : "Unavailable"}
              </button>
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

// Front Desk & Housekeeping Renderer
const UNIT_CYCLE = {
  Clean: "Occupied",
  Occupied: "Dirty",
  Dirty: "Maintenance",
  Maintenance: "Clean"
};

function renderFrontDesk() {
  const totalUnits = roomUnits.length || 1;
  const occupiedCount = roomUnits.filter((u) => u.status === "Occupied").length;
  const cleanCount = roomUnits.filter((u) => u.status === "Clean").length;
  const dirtyCount = roomUnits.filter((u) => u.status === "Dirty").length;
  const occRate = Math.round((occupiedCount / totalUnits) * 100);

  document.getElementById("fdOccupancyRate").textContent = `${occRate}%`;
  document.getElementById("fdOccupiedCount").textContent = occupiedCount;
  document.getElementById("fdCleanCount").textContent = cleanCount;
  document.getElementById("fdDirtyCount").textContent = dirtyCount;

  const queueEl = document.getElementById("fdBookingsQueue");
  const actionableBookings = bookings.filter((b) => b.status === "Confirmed" || b.status === "Checked-In");

  if (actionableBookings.length === 0) {
    queueEl.innerHTML = `<p class="muted-text">No pending arrivals or active in-house guests.</p>`;
  } else {
    queueEl.innerHTML = actionableBookings
      .map((b) => {
        const isConfirmed = b.status === "Confirmed";
        return `
          <div class="fd-queue-row">
            <div>
              <strong>${b.guestName}</strong> <span class="muted-text">(${b.ref})</span>
              <div class="muted-text">${b.roomsBooked} × ${b.roomName} &bull; ${b.checkIn} &rarr; ${b.checkOut}</div>
            </div>
            <div style="display:flex;align-items:center;gap:0.5rem">
              <span class="avail-pill">${b.status}</span>
              ${
                isConfirmed
                  ? `<button type="button" class="btn btn-accent btn-sm" data-checkin-ref="${b.ref}">Check In</button>`
                  : `<button type="button" class="btn btn-primary btn-sm" data-checkout-ref="${b.ref}">Check Out</button>`
              }
            </div>
          </div>
        `;
      })
      .join("");
  }

  document.getElementById("fdRoomsBoard").innerHTML = roomUnits
    .map(
      (u) => `
      <div class="unit-tile ${u.status}" data-cycle-unit="${u.unitNo}" title="Click to cycle cleaning/occupancy status">
        <strong>Rm ${u.unitNo}</strong>
        <span>${u.roomName}</span>
        <span>${u.status}</span>
      </div>
    `
    )
    .join("");
}

// Room Detail & Reservation Modal
const roomModal = document.getElementById("roomModal");
const roomModalBody = document.getElementById("roomModalBody");

function openRoomModal(roomId) {
  const room = ROOMS.find((r) => r.id === roomId);
  if (!room) return;

  const nights = getNights();
  const availUnits = getAvailableUnits(room);
  const maxSelectable = Math.max(1, availUnits);

  roomModalBody.innerHTML = `
    <div class="modal-split">
      <div>
        <img src="${room.image}" alt="${room.name}" class="modal-room-img" />
        <h2 id="roomModalTitle" style="font-size:1.35rem">${room.name}</h2>
        <p class="muted-text" style="margin:0.35rem 0 0.85rem">${room.bedSpec} &bull; Up to ${room.maxGuests} guests &bull; ${room.sizeSqm} m²</p>
        <p style="font-size:0.93rem;margin-bottom:1rem">${room.description}</p>
        <h4 style="font-size:0.92rem;margin-bottom:0.45rem">Included Amenities</h4>
        <div class="room-amenities-mini">
          ${room.amenities.map((a) => `<span class="mini-tag">${a}</span>`).join("")}
        </div>
      </div>

      <div class="booking-panel">
        <h3 style="font-size:1.08rem;margin-bottom:0.25rem">Complete Your Reservation</h3>
        <p class="muted-text" style="font-size:0.82rem;margin-bottom:0.75rem">
          Dates: <strong>${checkInInput.value}</strong> &rarr; <strong>${checkOutInput.value}</strong> (${nights} nights)
        </p>

        <form id="reservationForm" class="booking-form">
          <div class="field">
            <label for="roomsQty">Number of Rooms (${availUnits} available)</label>
            <select id="roomsQty" name="roomsQty">
              ${Array.from({ length: maxSelectable }, (_, i) => i + 1)
                .map((n) => `<option value="${n}">${n} ${n === 1 ? "Room" : "Rooms"}</option>`)
                .join("")}
            </select>
          </div>

          <div id="priceBreakdownBox" class="price-box"></div>

          <div class="field">
            <label for="guestFullName">Guest Full Name *</label>
            <input type="text" id="guestFullName" name="guestName" placeholder="e.g. Aisha Bello" required />
          </div>

          <div class="field">
            <label for="guestPhone">Phone / WhatsApp *</label>
            <input type="tel" id="guestPhone" name="guestPhone" placeholder="e.g. 0803 000 0000" required />
          </div>

          <div class="field">
            <label for="guestEmail">Email Address *</label>
            <input type="email" id="guestEmail" name="guestEmail" placeholder="guest@example.com" required />
          </div>

          <div class="field">
            <label for="guestNote">Special Request (Optional)</label>
            <input type="text" id="guestNote" name="note" placeholder="Late arrival, high floor, extra pillow..." />
          </div>

          <button type="submit" class="btn btn-primary btn-block" ${availUnits === 0 ? "disabled" : ""}>
            Confirm Reservation
          </button>
        </form>

        <div id="bookingConfirmation" class="confirm-box hidden"></div>
      </div>
    </div>
  `;

  const roomsQtySelect = document.getElementById("roomsQty");
  const priceBox = document.getElementById("priceBreakdownBox");

  function updateBreakdown() {
    const qty = Number(roomsQtySelect.value);
    const subtotal = room.nightlyRate * nights * qty;
    const vat = subtotal * TAX_RATE;
    const grandTotal = subtotal + vat;

    priceBox.innerHTML = `
      <div class="price-line"><span>${formatNaira(room.nightlyRate)} × ${nights}n × ${qty} rm</span><span>${formatNaira(subtotal)}</span></div>
      <div class="price-line"><span>VAT (7.5%)</span><span>${formatNaira(vat)}</span></div>
      <div class="price-total"><span>Total Stay</span><span>${formatNaira(grandTotal)}</span></div>
    `;
    return grandTotal;
  }

  let currentTotal = updateBreakdown();
  roomsQtySelect.addEventListener("change", () => {
    currentTotal = updateBreakdown();
  });

  document.getElementById("reservationForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const qty = Number(roomsQtySelect.value);
    const refCode = "CW-2026-" + Math.floor(500 + Math.random() * 499);

    const newBooking = {
      ref: refCode,
      roomId: room.id,
      roomName: room.name,
      guestName: fd.get("guestName").trim(),
      guestPhone: fd.get("guestPhone").trim(),
      checkIn: checkInInput.value,
      checkOut: checkOutInput.value,
      nights,
      roomsBooked: qty,
      totalPaid: currentTotal,
      status: "Confirmed"
    };

    bookings.unshift(newBooking);
    saveState();
    renderRooms();
    renderFrontDesk();

    e.target.classList.add("hidden");
    const confEl = document.getElementById("bookingConfirmation");
    confEl.innerHTML = `
      <strong>Reservation Confirmed!</strong><br />
      Booking Ref: <strong>${newBooking.ref}</strong><br />
      Guest: ${newBooking.guestName} (${newBooking.roomsBooked} × ${newBooking.roomName})<br />
      Stay: ${newBooking.checkIn} to ${newBooking.checkOut} &bull; Total: <strong>${formatNaira(newBooking.totalPaid)}</strong>
    `;
    confEl.classList.remove("hidden");
  });

  roomModal.classList.remove("hidden");
}

// My Bookings Drawer
const bookingsDrawer = document.getElementById("bookingsDrawer");
const bookingsList = document.getElementById("bookingsList");

function renderBookingsDrawer() {
  if (bookings.length === 0) {
    bookingsList.innerHTML = `<p class="muted-text">No reservations found yet.</p>`;
    return;
  }

  bookingsList.innerHTML = bookings
    .map(
      (b) => `
      <div class="booking-item">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.35rem">
          <strong>${b.ref}</strong>
          <span class="avail-pill" style="${b.status === "Cancelled" ? "background:var(--danger-bg);color:var(--danger)" : ""}">${b.status}</span>
        </div>
        <div><strong>${b.roomName}</strong> (${b.roomsBooked} rm &bull; ${b.nights}n)</div>
        <div class="muted-text">${b.checkIn} &rarr; ${b.checkOut}</div>
        <div style="margin-top:0.4rem">Guest: ${b.guestName} &bull; <strong>${formatNaira(b.totalPaid)}</strong></div>
        ${
          b.status === "Confirmed"
            ? `<button type="button" class="btn btn-danger-outline btn-sm" style="margin-top:0.65rem" data-cancel-ref="${b.ref}">Cancel Reservation</button>`
            : ""
        }
      </div>
    `
    )
    .join("");
}

// Front Desk Panel Toggle
const frontDeskSection = document.getElementById("frontDeskSection");
document.getElementById("toggleFrontDeskBtn").addEventListener("click", () => {
  frontDeskSection.classList.toggle("hidden");
  renderFrontDesk();
});
document.getElementById("closeFrontDeskBtn").addEventListener("click", () => {
  frontDeskSection.classList.add("hidden");
});

// Event Listeners
document.getElementById("availabilityForm").addEventListener("submit", (e) => {
  e.preventDefault();
  renderRooms();
  document.getElementById("rooms").scrollIntoView({ behavior: "smooth" });
});

categorySelect.addEventListener("change", renderRooms);
guestsSelect.addEventListener("change", renderRooms);

document.addEventListener("click", (e) => {
  const reserveBtn = e.target.closest("[data-reserve-room]");
  if (reserveBtn) {
    openRoomModal(reserveBtn.dataset.reserveRoom);
    return;
  }

  const detailsBtn = e.target.closest("[data-details-room]");
  if (detailsBtn) {
    openRoomModal(detailsBtn.dataset.detailsRoom);
    return;
  }

  const cancelBtn = e.target.closest("[data-cancel-ref]");
  if (cancelBtn) {
    const target = bookings.find((b) => b.ref === cancelBtn.dataset.cancelRef);
    if (target) {
      target.status = "Cancelled";
      saveState();
      renderBookingsDrawer();
      renderRooms();
      renderFrontDesk();
    }
    return;
  }

  const checkInBtn = e.target.closest("[data-checkin-ref]");
  if (checkInBtn) {
    const target = bookings.find((b) => b.ref === checkInBtn.dataset.checkinRef);
    if (target) {
      target.status = "Checked-In";
      const cleanUnit = roomUnits.find((u) => u.roomId === target.roomId && u.status === "Clean");
      if (cleanUnit) cleanUnit.status = "Occupied";
      saveState();
      renderFrontDesk();
      renderRooms();
    }
    return;
  }

  const checkOutBtn = e.target.closest("[data-checkout-ref]");
  if (checkOutBtn) {
    const target = bookings.find((b) => b.ref === checkOutBtn.dataset.checkoutRef);
    if (target) {
      target.status = "Checked-Out";
      const occUnit = roomUnits.find((u) => u.roomId === target.roomId && u.status === "Occupied");
      if (occUnit) occUnit.status = "Dirty";
      saveState();
      renderFrontDesk();
      renderRooms();
    }
    return;
  }

  const unitTile = e.target.closest("[data-cycle-unit]");
  if (unitTile) {
    const unit = roomUnits.find((u) => u.unitNo === unitTile.dataset.cycleUnit);
    if (unit) {
      unit.status = UNIT_CYCLE[unit.status];
      saveState();
      renderFrontDesk();
      renderRooms();
    }
  }
});

document.getElementById("closeRoomModalBtn").addEventListener("click", () => {
  roomModal.classList.add("hidden");
});

roomModal.addEventListener("click", (e) => {
  if (e.target === roomModal) roomModal.classList.add("hidden");
});

document.getElementById("openBookingsBtn").addEventListener("click", () => {
  renderBookingsDrawer();
  bookingsDrawer.classList.remove("hidden");
});

document.getElementById("closeBookingsDrawerBtn").addEventListener("click", () => {
  bookingsDrawer.classList.add("hidden");
});

bookingsDrawer.addEventListener("click", (e) => {
  if (e.target === bookingsDrawer) bookingsDrawer.classList.add("hidden");
});

saveState();
renderRooms();
renderFrontDesk();