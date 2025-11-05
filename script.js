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
        <button class="book-btn">Book Session</button>

        <div class="booking-form">
          <input type="text" class="patient-name" placeholder="Patient Name" required>
          <input type="text" class="patient-location" placeholder="Location" required>
          <input type="text" class="patient-address" placeholder="Address" required>
          <input type="datetime-local" class="appointment-time" required>
          <button class="submit-booking">Submit Booking</button>
        </div>
      `;
      container.appendChild(card);

      // Toggle active card on click
      card.addEventListener('click', () => {
        container.querySelectorAll('.card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
      });

      // Show/hide booking form
      const bookBtn = card.querySelector('.book-btn');
      const bookingForm = card.querySelector('.booking-form');
      bookBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        bookingForm.style.display = bookingForm.style.display === 'block' ? 'none' : 'block';
      });

      // Submit booking
      const submitBtn = card.querySelector('.submit-booking');
      submitBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        const name = bookingForm.querySelector('.patient-name').value;
        const location = bookingForm.querySelector('.patient-location').value;
        const address = bookingForm.querySelector('.patient-address').value;
        const datetime = bookingForm.querySelector('.appointment-time').value;

        if (name && location && address && datetime) {
          try {
            const response = await fetch(`${apiBase}/bookings/`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                specialist: s.id,
                mother_name: name,
                mother_phone: '', // you can add a phone field if needed
                address: address,
                scheduled_time: datetime
              })
            });

            if (response.ok) {
              alert("Booking created successfully!");
              bookingForm.reset();
              bookingForm.style.display = 'none';
            } else {
              alert("Booking failed. Please try again.");
            }
          } catch (err) {
            console.error(err);
            alert("Error submitting booking.");
          }
        } else {
          alert("Please fill all fields.");
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
    hero.style.opacity = 0;
    setTimeout(() => {
      hero.style.backgroundImage = `url('${images[current]}')`;
      hero.style.opacity = 1;
      current = (current + 1) % images.length;
    }, 1000);
  }

  hero.style.backgroundImage = `url('${images[0]}')`;
  setInterval(changeBackground, 5000);
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
  loadSpecialists();
  initHeroSlideshow();
});
