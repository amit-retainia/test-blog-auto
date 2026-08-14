/* Dobby Ads — shared page behaviour. Scroll reveal + mobile menu. */
(function () {
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('vis'); obs.unobserve(e.target); }
    });
  }, { threshold: .08, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.r').forEach(function (el) { obs.observe(el); });

  var hb = document.getElementById('hb'), mob = document.getElementById('mob-menu');
  if (hb && mob) {
    hb.addEventListener('click', function () {
      hb.classList.toggle('open'); mob.classList.toggle('open');
    });
  }
})();
