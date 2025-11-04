// Button click
document.getElementById("getStarted").addEventListener("click", function() {
  document.getElementById("specialists").scrollIntoView({ behavior: "smooth" });
});

// Contact form
document.getElementById("contactForm").addEventListener("submit", function(e) {
  e.preventDefault();
  alert("Thank you! Your message has been sent successfully.");
  this.reset();
});
//fetch urls
// script.js (frontend)
const apiBase = "http://127.0.0.1:8000/api";

async function loadSpecialists() {
  try {
    const res = await fetch(`${apiBase}/specialists/`);
    const data = await res.json();
    const container = document.querySelector('.card-container');
    container.innerHTML = '';

    data.forEach(s => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <img src="${s.photo_url || 'https://via.placeholder.com/300x200'}" alt="${s.first_name}">
        <h3>${s.first_name} ${s.last_name}</h3>
        <p>${s.role} — ${s.location}</p>
        <div class="rating">⭐️ ${s.rating || '5.0'}</div>
        <button class="book-btn" data-id="${s.id}">Book</button>
      `;
      container.appendChild(card);
    });

    // Add booking click listeners
    document.querySelectorAll('.book-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const name = prompt("Enter mother's name for booking:");
        const phone = prompt("Enter phone:");
        const address = prompt("Address:");
        const when = prompt("Scheduled datetime (YYYY-MM-DDTHH:MM):");

        if (name && phone && address && when) {
          fetch(`${apiBase}/bookings/`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              specialist: id,
              mother_name: name,
              mother_phone: phone,
              address: address,
              scheduled_time: when
            })
          }).then(r => {
            if (r.ok) alert("Booking created!");
            else alert("Booking failed.");
          });
        }
      });
    });

  } catch (err) {
    console.error('Failed to load specialists', err);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // existing handlers
  document.getElementById("getStarted").addEventListener("click", () => {
    document.getElementById("specialists").scrollIntoView({ behavior: "smooth" });
  });

  document.getElementById("contactForm").addEventListener("submit", function(e) {
    e.preventDefault();
    alert("Thank you! Your message has been sent successfully.");
    this.reset();
  });

  // load specialists from API
  loadSpecialists();
});

