// Theme toggle (sets a data-theme on <html>)
(function () {
  const root = document.documentElement;
  const toggle = document.querySelector(".theme-toggle");
  const saved = localStorage.getItem("theme");
  function applyTheme(t) {
    root.setAttribute("data-theme", t);
  }
  applyTheme(saved || "dark");
  toggle.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    localStorage.setItem("theme", next);
    toggle.textContent = next === "dark" ? "🌙" : "☀️";
  });
  // set initial icon
  toggle.textContent =
    document.documentElement.getAttribute("data-theme") === "dark"
      ? "🌙"
      : "☀️";
  // set year
  document.getElementById("year").textContent = new Date().getFullYear();

  // Newsletter form handling: posts to Formspree (replace action URL with your form endpoint)
  const form = document.getElementById("newsletter-form");
  if (form) {
    form.addEventListener("submit", async (ev) => {
      ev.preventDefault();
      const msg = document.getElementById("newsletter-msg");
      const email = form.querySelector('input[name="email"]')?.value?.trim();
      if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        msg.textContent = "Please enter a valid email address.";
        msg.className = "newsletter-msg error";
        return;
      }
      msg.textContent = "Sending…";
      msg.className = "newsletter-msg";

      // Try to POST via fetch to the form action. If user hasn't configured a service, fall back to a local save.
      const action = form.getAttribute("action");
      try {
        const res = await fetch(action, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });
        if (res.ok) {
          msg.textContent = "Thanks — you are subscribed!";
          msg.className = "newsletter-msg success";
          form.reset();
          return;
        }
        // non-OK response: try to parse JSON for error message
        let data;
        try {
          data = await res.json();
        } catch (e) {}
        msg.textContent =
          data && data.error
            ? data.error
            : "Submission failed. Please try again later.";
        msg.className = "newsletter-msg error";
      } catch (err) {
        // fallback: save locally and show success message so the UX isn't broken.
        try {
          const stored = JSON.parse(
            localStorage.getItem("newsletter-signups") || "[]"
          );
          stored.push({ email: email, when: new Date().toISOString() });
          localStorage.setItem("newsletter-signups", JSON.stringify(stored));
          msg.textContent =
            "Saved locally — replace the form action with a mailing-service endpoint to enable real signups.";
          msg.className = "newsletter-msg success";
          form.reset();
        } catch (e2) {
          msg.textContent = "Could not save signup. Please try again later.";
          msg.className = "newsletter-msg error";
        }
      }
    });
  }
})()(
  // Random twinkling star that moves in a fixed radius
  (function () {
    const radius = 80; // pixels
    const baseX = window.innerWidth * 0.2;
    const baseY = window.innerHeight * 3;

    function getRandomPosition() {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * radius;
      return {
        x: baseX + Math.cos(angle) * distance,
        y: baseY + Math.sin(angle) * distance,
      };
    }

    function updateStar() {
      const pos = getRandomPosition();
      const opacity = 0.3 + Math.random() * 0.7;
      const duration = 1 + Math.random() * 2;

      document.documentElement.style.setProperty("--star-x", pos.x + "px");
      document.documentElement.style.setProperty("--star-y", pos.y + "px");
      document.documentElement.style.setProperty("--star-opacity", opacity);
      document.documentElement.style.setProperty(
        "--star-duration",
        duration + "s"
      );
    }

    // Initial position
    updateStar();

    // Update every 2-4 seconds
    setInterval(() => {
      updateStar();
    }, 2000 + Math.random() * 2000);
  })()
);
