window.dataLayer = window.dataLayer || [];
function gtag() {
  dataLayer.push(arguments);
}
gtag('js', new Date());
gtag('config', 'G-5T2PQELT0T');

document.addEventListener('DOMContentLoaded', function() {
  var countdownElement = document.getElementById('countdown');

  function updateCountdown() {
    var now = new Date();
    var options = { timeZone: 'Asia/Bangkok', hour12: false };
    var bangkokTime = now.toLocaleString('en-GB', options);
    countdownElement.textContent = bangkokTime;
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  var welcomeModal = new bootstrap.Modal(document.getElementById('welcomeModal'));
  welcomeModal.show();
});