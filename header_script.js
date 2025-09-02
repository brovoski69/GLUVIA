document.addEventListener("DOMContentLoaded", function() {
  const headerPlaceholder = document.getElementById("header-placeholder");
  
  if (headerPlaceholder) {
    fetch("header.html")
      .then(response => response.text())
      .then(data => {
        headerPlaceholder.innerHTML = data;
        //Call the function to highlight the active link
        setActiveLink();
      })
      .catch(error => {
        console.error("Error loading the header:", error);
        headerPlaceholder.innerHTML = "<p>Error loading navigation bar.</p>";
      });
  }
});

function setActiveLink() {
  const currentPage = window.location.pathname.split("/").pop();
  const navLinks = document.querySelectorAll(".section-bar a");
  navLinks.forEach(link => {
    const linkPage = link.getAttribute("href").split("/").pop();
    if (linkPage === currentPage) {
      link.classList.add("active");
    }
  });
}