// Neural Network Canvas Background
const canvas = document.getElementById('neural-bg');
const ctx = canvas.getContext('2d');

let width, height;
let nodes = [];
const nodeCount = 80;
const connectionDistance = 150;
const nodeSpeed = 0.5;

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);
resize();

class Node {
  constructor() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5) * nodeSpeed;
    this.vy = (Math.random() - 0.5) * nodeSpeed;
    this.radius = Math.random() * 2 + 1;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    // Bounce off edges
    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(56, 189, 248, 0.8)';
    ctx.fill();
  }
}

// Initialize nodes
for (let i = 0; i < nodeCount; i++) {
  nodes.push(new Node());
}

// Add mouse interaction
let mouse = { x: null, y: null, radius: 150 };
window.addEventListener('mousemove', (e) => {
  mouse.x = e.x;
  mouse.y = e.y;
});

function animate() {
  ctx.clearRect(0, 0, width, height);
  
  // Update and draw nodes
  for (let i = 0; i < nodes.length; i++) {
    nodes[i].update();
    nodes[i].draw();
    
    // Connect to other nodes
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < connectionDistance) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(192, 132, 252, ${1 - distance / connectionDistance})`;
        ctx.lineWidth = 1;
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.stroke();
      }
    }

    // Connect to mouse
    if (mouse.x != null && mouse.y != null) {
      const dx = nodes[i].x - mouse.x;
      const dy = nodes[i].y - mouse.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < mouse.radius) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(56, 189, 248, ${1 - distance / mouse.radius})`;
        ctx.lineWidth = 1.5;
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
      }
    }
  }
  
  requestAnimationFrame(animate);
}
animate();

// Intersection Observer for Scroll Reveals
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.05
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      observer.unobserve(entry.target); // Only reveal once
    }
  });
}, observerOptions);

document.querySelectorAll('.hidden-reveal').forEach((el) => {
  observer.observe(el);
});

// Update active nav link on scroll
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (scrollY >= (sectionTop - 200)) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href').includes(current)) {
      link.classList.add('active');
    }
  });
});