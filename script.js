// Three.js Scene Setup
let scene, camera, renderer, glasses, arElements = [];
let mouseX = 0, mouseY = 0;
let time = 0;

function initThree() {
    const container = document.getElementById('three-container');
    
    // Scene
    scene = new THREE.Scene();
    
    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    
    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0x00e0ff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    const pointLight = new THREE.PointLight(0x6e4eff, 1);
    pointLight.position.set(-5, -5, 5);
    scene.add(pointLight);
    
    // Create glasses geometry
    createGlasses();
    
    // Mouse movement
    document.addEventListener('mousemove', onMouseMove);
    
    // Resize handler
    window.addEventListener('resize', onWindowResize);
    
    // Animation loop
    animate();
}

function createGlasses() {
    const glassesGroup = new THREE.Group();
    
    // Frame
    const frameGeometry = new THREE.TorusGeometry(1, 0.1, 8, 30);
    const frameMaterial = new THREE.MeshPhongMaterial({
        color: 0x00e0ff,
        emissive: 0x00e0ff,
        emissiveIntensity: 0.2,
        shininess: 100
    });
    
    // Left lens
    const leftLens = new THREE.Mesh(frameGeometry, frameMaterial);
    leftLens.position.x = -1.2;
    glassesGroup.add(leftLens);
    
    // Right lens
    const rightLens = new THREE.Mesh(frameGeometry, frameMaterial);
    rightLens.position.x = 1.2;
    glassesGroup.add(rightLens);
    
    // Bridge
    const bridgeGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.5);
    const bridge = new THREE.Mesh(bridgeGeometry, frameMaterial);
    bridge.rotation.z = Math.PI / 2;
    bridge.position.y = 0;
    glassesGroup.add(bridge);
    
    // Temple arms
    const templeGeometry = new THREE.BoxGeometry(2, 0.1, 0.1);
    const leftTemple = new THREE.Mesh(templeGeometry, frameMaterial);
    leftTemple.position.set(-2.2, 0, -0.5);
    leftTemple.rotation.y = -0.3;
    glassesGroup.add(leftTemple);
    
    const rightTemple = new THREE.Mesh(templeGeometry, frameMaterial);
    rightTemple.position.set(2.2, 0, -0.5);
    rightTemple.rotation.y = 0.3;
    glassesGroup.add(rightTemple);
    
    // Add holographic effect
    const hologramGeometry = new THREE.PlaneGeometry(4, 2);
    const hologramMaterial = new THREE.MeshBasicMaterial({
        color: 0x00e0ff,
        transparent: true,
        opacity: 0.1,
        side: THREE.DoubleSide
    });
    
    const hologram = new THREE.Mesh(hologramGeometry, hologramMaterial);
    hologram.position.z = 1;
    glassesGroup.add(hologram);
    
    glasses = glassesGroup;
    scene.add(glasses);
    
    // Create AR overlay elements
    createARElements();
}

function onMouseMove(event) {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function createARElements() {
    // AR Data visualization elements
    const arGroup = new THREE.Group();
    
    // Create floating UI panels
    const panelGeometry = new THREE.PlaneGeometry(1, 0.6);
    const panelMaterial = new THREE.MeshBasicMaterial({
        color: 0x00d4ff,
        transparent: true,
        opacity: 0.2,
        side: THREE.DoubleSide
    });
    
    // Left panel - Object Detection
    const leftPanel = new THREE.Mesh(panelGeometry, panelMaterial);
    leftPanel.position.set(-2.5, 1, 0);
    leftPanel.rotation.y = 0.3;
    arGroup.add(leftPanel);
    
    // Right panel - Navigation
    const rightPanel = new THREE.Mesh(panelGeometry, panelMaterial);
    rightPanel.position.set(2.5, 1, 0);
    rightPanel.rotation.y = -0.3;
    arGroup.add(rightPanel);
    
    // Create floating data points
    for (let i = 0; i < 20; i++) {
        const dotGeometry = new THREE.SphereGeometry(0.02, 8, 8);
        const dotMaterial = new THREE.MeshBasicMaterial({
            color: Math.random() > 0.5 ? 0x00e0ff : 0x6e4eff,
            emissive: Math.random() > 0.5 ? 0x00e0ff : 0x6e4eff,
            emissiveIntensity: 0.5
        });
        
        const dot = new THREE.Mesh(dotGeometry, dotMaterial);
        dot.position.set(
            (Math.random() - 0.5) * 6,
            (Math.random() - 0.5) * 3,
            (Math.random() - 0.5) * 2
        );
        
        arElements.push({
            mesh: dot,
            velocity: {
                x: (Math.random() - 0.5) * 0.01,
                y: (Math.random() - 0.5) * 0.01,
                z: (Math.random() - 0.5) * 0.01
            }
        });
        
        arGroup.add(dot);
    }
    
    // Create wireframe grid
    const gridHelper = new THREE.GridHelper(10, 20, 0x00e0ff, 0x00e0ff);
    gridHelper.position.y = -2;
    gridHelper.material.opacity = 0.1;
    gridHelper.material.transparent = true;
    scene.add(gridHelper);
    
    scene.add(arGroup);
}

function animate() {
    requestAnimationFrame(animate);
    time += 0.01;
    
    if (glasses) {
        glasses.rotation.y = mouseX * 0.5;
        glasses.rotation.x = mouseY * 0.3;
        glasses.rotation.z += 0.005;
    }
    
    // Animate AR elements
    arElements.forEach((element, index) => {
        element.mesh.position.x += element.velocity.x;
        element.mesh.position.y += element.velocity.y;
        element.mesh.position.z += element.velocity.z;
        
        // Bounce off boundaries
        if (Math.abs(element.mesh.position.x) > 3) element.velocity.x *= -1;
        if (Math.abs(element.mesh.position.y) > 2) element.velocity.y *= -1;
        if (Math.abs(element.mesh.position.z) > 1) element.velocity.z *= -1;
        
        // Pulsing effect
        element.mesh.scale.setScalar(1 + Math.sin(time * 2 + index) * 0.2);
    });
    
    renderer.render(scene, camera);
}

// Initialize Three.js when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize loading screen
    const loadingScreen = document.getElementById('loading-screen');
    
    // Initialize Particle.js
    initParticles();
    
    // Initialize Three.js
    initThree();
    
    // Smooth scrolling
    initSmoothScrolling();
    
    // Scroll animations
    initScrollAnimations();
    
    // Mobile menu
    initMobileMenu();
    
    // Form handling
    initFormHandling();
    
    // Button animations
    initButtonAnimations();
    
    // Hide loading screen after everything is loaded
    setTimeout(() => {
        loadingScreen.classList.add('fade-out');
    }, 1500);
});

// Initialize Particle.js background
function initParticles() {
    particlesJS('particles-js', {
        particles: {
            number: {
                value: 50,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: '#00e0ff'
            },
            shape: {
                type: 'circle',
                stroke: {
                    width: 0,
                    color: '#000000'
                }
            },
            opacity: {
                value: 0.3,
                random: true,
                anim: {
                    enable: true,
                    speed: 1,
                    opacity_min: 0.1,
                    sync: false
                }
            },
            size: {
                value: 3,
                random: true,
                anim: {
                    enable: true,
                    speed: 2,
                    size_min: 0.1,
                    sync: false
                }
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: '#00e0ff',
                opacity: 0.2,
                width: 1
            },
            move: {
                enable: true,
                speed: 1,
                direction: 'none',
                random: true,
                straight: false,
                out_mode: 'out',
                bounce: false,
                attract: {
                    enable: true,
                    rotateX: 600,
                    rotateY: 1200
                }
            }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: {
                    enable: true,
                    mode: 'grab'
                },
                onclick: {
                    enable: true,
                    mode: 'push'
                },
                resize: true
            },
            modes: {
                grab: {
                    distance: 140,
                    line_linked: {
                        opacity: 0.5
                    }
                },
                push: {
                    particles_nb: 4
                }
            }
        },
        retina_detect: true
    });
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Scroll-triggered animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Animate progress bars
                if (entry.target.classList.contains('tech-item')) {
                    const progressBar = entry.target.querySelector('.progress');
                    if (progressBar) {
                        const width = progressBar.style.width;
                        progressBar.style.width = '0';
                        setTimeout(() => {
                            progressBar.style.width = width;
                        }, 100);
                    }
                }
            }
        });
    }, observerOptions);
    
    // Observe elements
    document.querySelectorAll('.feature-card, .tech-item, .access-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

// Mobile menu toggle
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
    
    // Close menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
}

// Form handling
function initFormHandling() {
    const form = document.querySelector('.contact-form');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = form.querySelector('input[type="email"]').value;
        
        // Simulate form submission
        const button = form.querySelector('button');
        const originalText = button.textContent;
        
        button.textContent = 'Joining...';
        button.disabled = true;
        
        setTimeout(() => {
            button.textContent = 'Welcome aboard!';
            form.reset();
            
            setTimeout(() => {
                button.textContent = originalText;
                button.disabled = false;
            }, 2000);
        }, 1500);
    });
}

// Button hover animations
function initButtonAnimations() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function(e) {
            const x = e.clientX - e.target.offsetLeft;
            const y = e.clientY - e.target.offsetTop;
            
            const ripple = document.createElement('span');
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Explore Technology button
    document.querySelector('.btn-primary').addEventListener('click', () => {
        document.querySelector('#technology').scrollIntoView({
            behavior: 'smooth'
        });
    });
    
    // Join Waitlist button
    document.querySelector('.hero .btn-secondary').addEventListener('click', () => {
        document.querySelector('#contact').scrollIntoView({
            behavior: 'smooth'
        });
    });
}

// Add ripple effect styles dynamically
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .nav-menu.active {
        display: flex;
        position: fixed;
        top: 60px;
        right: 0;
        flex-direction: column;
        background: rgba(10, 10, 10, 0.98);
        width: 100%;
        text-align: center;
        padding: 2rem 0;
        backdrop-filter: blur(10px);
    }
    
    .hamburger.active span:nth-child(1) {
        transform: rotate(-45deg) translate(-5px, 6px);
    }
    
    .hamburger.active span:nth-child(2) {
        opacity: 0;
    }
    
    .hamburger.active span:nth-child(3) {
        transform: rotate(45deg) translate(-5px, -6px);
    }
`;
document.head.appendChild(style);

// Parallax effect on scroll
let ticking = false;
function updateParallax() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.hero-content, .floating-card');
    
    parallaxElements.forEach(el => {
        const speed = el.dataset.speed || 0.5;
        const yPos = -(scrolled * speed);
        el.style.transform = `translateY(${yPos}px)`;
    });
    
    ticking = false;
}

function requestTick() {
    if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
    }
}

window.addEventListener('scroll', requestTick);