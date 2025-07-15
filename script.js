// Navegação suave
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

// Header transparente/opaco baseado no scroll
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(0, 0, 0, 0.98)';
    } else {
        header.style.background = 'rgba(0, 0, 0, 0.95)';
    }
});

// Menu mobile
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Fechar menu mobile ao clicar em um link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// Animação de entrada dos elementos
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

// Aplicar animação aos elementos
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.service-card, .product-showcase, .about-content, .contact-content');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Formulário de contato
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validar campos obrigatórios
        const requiredFields = this.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });
        
        if (isValid) {
            // Simulação de envio
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Enviando...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
                this.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        }
    });
}

// Validação em tempo real do formulário
const formInputs = document.querySelectorAll('.contact-form input, .contact-form select, .contact-form textarea');

formInputs.forEach(input => {
    input.addEventListener('blur', function() {
        validateField(this);
    });
    
    input.addEventListener('input', function() {
        if (this.classList.contains('error')) {
            validateField(this);
        }
    });
});

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    
    // Remover classes de erro anteriores
    field.classList.remove('error');
    
    // Validações específicas
    if (field.hasAttribute('required') && !value) {
        isValid = false;
    }
    
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
        }
    }
    
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[\d\s\-\(\)\+]+$/;
        if (!phoneRegex.test(value)) {
            isValid = false;
        }
    }
    
    // Aplicar estilo de erro se necessário
    if (!isValid) {
        field.classList.add('error');
        field.style.borderColor = '#ff4444';
    } else {
        field.style.borderColor = '#333333';
    }
    
    return isValid;
}

// Scroll suave para o botão de scroll do hero
const heroScroll = document.querySelector('.hero-scroll');
if (heroScroll) {
    heroScroll.addEventListener('click', function() {
        document.querySelector('#servicos').scrollIntoView({
            behavior: 'smooth'
        });
    });
}

// Contador animado para as estatísticas
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            const currentValue = Math.floor(start);
            const suffix = element.textContent.includes('+') ? '+' : 
                          element.textContent.includes('%') ? '%' : '';
            element.textContent = currentValue + suffix;
            requestAnimationFrame(updateCounter);
        } else {
            const suffix = element.textContent.includes('+') ? '+' : 
                          element.textContent.includes('%') ? '%' : '';
            element.textContent = target + suffix;
        }
    }
    
    updateCounter();
}

// Observar estatísticas para animação
const statsObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumber = entry.target.querySelector('.stat-number');
            if (statNumber && !statNumber.classList.contains('animated')) {
                const text = statNumber.textContent;
                const number = parseInt(text.replace(/\D/g, ''));
                
                if (number) {
                    statNumber.classList.add('animated');
                    animateCounter(statNumber, number);
                }
            }
        }
    });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', function() {
    const stats = document.querySelectorAll('.stat');
    stats.forEach(stat => statsObserver.observe(stat));
});

// Efeito parallax sutil no hero
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const heroBackground = document.querySelector('.background-video');
    
    if (heroBackground && scrolled < window.innerHeight) {
        heroBackground.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
});

// Controle do vídeo de fundo
document.addEventListener('DOMContentLoaded', function() {
    const backgroundVideo = document.querySelector('.background-video');
    
    if (backgroundVideo) {
        // Garantir que o vídeo está configurado corretamente
        backgroundVideo.muted = true;
        backgroundVideo.loop = true;
        backgroundVideo.autoplay = true;
        backgroundVideo.playsInline = true;
        
        // Tentar reproduzir o vídeo
        backgroundVideo.play().catch(function(error) {
            console.log('Erro ao reproduzir vídeo:', error);
        });
        
        // Pausar vídeo quando não estiver visível para economizar recursos
        const heroObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    backgroundVideo.pause();
                } else {
                    backgroundVideo.play().catch(function(error) {
                        console.log('Erro ao reproduzir vídeo:', error);
                    });
                }
            });
        });
        
        heroObserver.observe(document.querySelector('.hero'));
    }
});

// Smooth scroll para navegação
document.addEventListener('DOMContentLoaded', function() {
    // Adicionar classe ativa ao link de navegação baseado na seção atual
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const navObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentSection = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${currentSection}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { threshold: 0.3 });
    
    sections.forEach(section => navObserver.observe(section));
});

// Otimização de performance para dispositivos móveis
if (window.innerWidth <= 768) {
    // Reduzir qualidade do vídeo em dispositivos móveis
    const backgroundVideo = document.querySelector('.background-video');
    if (backgroundVideo) {
        backgroundVideo.style.opacity = '0.4';
    }
}

