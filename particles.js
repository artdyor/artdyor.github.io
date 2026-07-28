// Lightweight canvas particle field for the hero visual.
// Nodes drift slowly and draw a connecting line to nearby neighbors,
// approximating a constellation without the cost of a full 3D scene.
(function () {
  var canvas = document.getElementById('particle-field');
  if (!canvas || !canvas.getContext) return;

  var ctx = canvas.getContext('2d');
  var particles = [];
  var width, height, dpr;

  var VIOLET = '128, 82, 255';
  var WHITE = '255, 255, 255';
  var LINK_DISTANCE = 130;
  var PARTICLE_COUNT = 60;

  function resize() {
    var rect = canvas.getBoundingClientRect();
    dpr = window.devicePixelRatio || 1;
    width = rect.width;
    height = rect.height;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function makeParticles() {
    particles = [];
    for (var i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.6 + 0.6
      });
    }
  }

  function step() {
    ctx.clearRect(0, 0, width, height);

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      for (var j = i + 1; j < particles.length; j++) {
        var q = particles[j];
        var dx = p.x - q.x;
        var dy = p.y - q.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < LINK_DISTANCE) {
          var alpha = (1 - dist / LINK_DISTANCE) * 0.35;
          ctx.strokeStyle = 'rgba(' + VIOLET + ', ' + alpha + ')';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }
    }

    for (var k = 0; k < particles.length; k++) {
      var n = particles[k];
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + WHITE + ', 0.85)';
      ctx.fill();
    }

    requestAnimationFrame(step);
  }

  function start() {
    resize();
    makeParticles();
    step();
  }

  window.addEventListener('resize', function () {
    resize();
    makeParticles();
  });

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    start();
  } else {
    resize();
  }
})();
