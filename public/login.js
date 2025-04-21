document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault();
  
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();
  
    try {
      const res = await fetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
  
      const data = await res.json();
  
      if (!res.ok) throw new Error(data.error || "Login failed");
  
      // Save token
      localStorage.setItem("token", data.token);
  
      alert("Login successful!");
      window.location.href = "products.html"; // Or wherever
    } catch (err) {
      alert("Error: " + err.message);
    }
  });
  