window.dataLayer = window.dataLayer || [];
function gtag() {
  dataLayer.push(arguments);
}
gtag('js', new Date());
gtag('config', 'G-5T2PQELT0T');

// Add dynamic year to footer
document.addEventListener('DOMContentLoaded', (event) => {
  document.getElementById('year').textContent = new Date().getFullYear();
});