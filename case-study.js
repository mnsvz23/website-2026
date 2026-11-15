// Case-study videos: load and play only while on screen, so a page with a dozen
// clips doesn't download them all up front. With reduced motion, nothing plays
// on its own; every clip gets controls instead.
(function () {
  var vids = document.querySelectorAll('video[data-src]');
  var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function load(v) {
    if (v.src) return;
    v.src = v.getAttribute('data-src');
    v.load();
  }

  if (still || !('IntersectionObserver' in window)) {
    vids.forEach(function (v) {
      v.removeAttribute('autoplay');
      v.controls = true;
      v.preload = 'metadata';
      load(v);
    });
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      var v = e.target;
      if (e.isIntersecting) {
        load(v);
        var p = v.play();
        if (p && p.catch) p.catch(function () { v.controls = true; });
      } else if (v.src) {
        v.pause();
      }
    });
  }, { rootMargin: '200px 0px' });

  vids.forEach(function (v) { io.observe(v); });
})();
