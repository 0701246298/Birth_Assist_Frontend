const apiBase = "http://127.0.0.1:8000/api";

// Scroll to specialists section
document.getElementById("getStarted").addEventListener("click", () => {
  document.getElementById("specialists").scrollIntoView({ behavior: "smooth" });
});

// Contact form submission
document.getElementById("contactForm").addEventListener("submit", function(e) {
  e.preventDefault();
  alert("Thank you! Your message has been sent successfully.");
  this.reset();
});

// Load specialists from API
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
        <img src="${s.photo_url || 'Images/placeholder.jpg'}" alt="${s.first_name} ${s.last_name}">
        <h3>${s.first_name} ${s.last_name}</h3>
        <p>${s.role} — ${s.location}</p>
        <div class="rating">⭐️ ${s.rating || '5.0'}</div>
        <button class="book-btn" data-id="${s.id}">Book</button>
      `;
      container.appendChild(card);

      // Add click toggle for active card highlight
      card.addEventListener('click', () => {
        // Remove active from all cards if only one can be active
        container.querySelectorAll('.card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
      });
    });

    // Add booking click listeners
    document.querySelectorAll('.book-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation(); // prevent triggering card click
        const id = btn.dataset.id;
        const name = prompt("Enter mother's name for booking:");
        const phone = prompt("Enter phone:");
        const address = prompt("Enter address:");
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
          })
          .then(r => r.ok ? alert("Booking created!") : alert("Booking failed."))
          .catch(err => console.error(err));
        }
      });
    });

  } catch (err) {
    console.error('Failed to load specialists', err);
  }
}

// Hero slideshow
function initHeroSlideshow() {
  const hero = document.getElementById("home");
  const images = [
    "Images/1.jpg",
    "Images/2.jpg",
    "Images/3.jpg",
    "Images/4.jpg",
    "Images/5.jpg"
  ];

  let current = 0;

  function changeBackground() {
    hero.style.opacity = 0; // fade out
    setTimeout(() => {
      hero.style.backgroundImage = `url('${images[current]}')`;
      hero.style.opacity = 1; // fade in
      current = (current + 1) % images.length;
    }, 1000);
  }

  // initialize
  hero.style.backgroundImage = `url('${images[0]}')`;
  setInterval(changeBackground, 5000);
}

// Initialize everything on DOM load
document.addEventListener('DOMContentLoaded', () => {
  loadSpecialists();
  initHeroSlideshow();
});
