// Galeria interativa de imagens
class GaleriaInterativa {
    constructor() {
        this.currentSlide = 0;
        this.slides = document.querySelectorAll('.galeria-slide');
        this.indicators = document.querySelectorAll('.indicator');
        this.btnPrev = document.getElementById('btn-prev');
        this.btnNext = document.getElementById('btn-next');
        this.currentSlideElement = document.getElementById('current-slide');
        this.totalSlidesElement = document.getElementById('total-slides');
        
        this.init();
    }
    
    init() {
        // Configurar total de slides
        this.totalSlidesElement.textContent = this.slides.length;
        
        // Otimizar imagens baseado no aspect ratio
        this.optimizeImages();
        
        // Event listeners para botões
        this.btnPrev.addEventListener('click', () => this.previousSlide());
        this.btnNext.addEventListener('click', () => this.nextSlide());
        
        // Event listeners para indicadores
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Navegação por teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.previousSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });
        
        // Touch/swipe para dispositivos móveis
        this.setupTouchEvents();
        
        // Auto-play opcional (comentado por padrão)
        // this.startAutoPlay();
    }
    
    goToSlide(slideIndex) {
        // Remove todas as classes de todos os slides e indicadores
        this.slides.forEach(slide => {
            slide.classList.remove('active', 'prev', 'next');
        });
        this.indicators.forEach(indicator => indicator.classList.remove('active'));
        
        // Calcula índices da imagem anterior e próxima
        const prevIndex = slideIndex === 0 ? this.slides.length - 1 : slideIndex - 1;
        const nextIndex = (slideIndex + 1) % this.slides.length;
        
        // Adiciona classes apropriadas
        this.slides[slideIndex].classList.add('active');
        this.slides[prevIndex].classList.add('prev');
        this.slides[nextIndex].classList.add('next');
        this.indicators[slideIndex].classList.add('active');
        
        // Atualiza slide atual
        this.currentSlide = slideIndex;
        this.currentSlideElement.textContent = slideIndex + 1;
    }
    
    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.slides.length;
        this.goToSlide(nextIndex);
    }
    
    previousSlide() {
        const prevIndex = this.currentSlide === 0 ? this.slides.length - 1 : this.currentSlide - 1;
        this.goToSlide(prevIndex);
    }
    
    setupTouchEvents() {
        let startX = 0;
        let endX = 0;
        const galeriaWrapper = document.querySelector('.galeria-wrapper');
        
        galeriaWrapper.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
        
        galeriaWrapper.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            this.handleSwipe();
        });
        
        // Mouse events para desktop
        galeriaWrapper.addEventListener('mousedown', (e) => {
            startX = e.clientX;
            galeriaWrapper.style.cursor = 'grabbing';
        });
        
        galeriaWrapper.addEventListener('mouseup', (e) => {
            endX = e.clientX;
            this.handleSwipe();
            galeriaWrapper.style.cursor = 'grab';
        });
    }
    
    handleSwipe() {
        const swipeThreshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe para esquerda - próximo slide
                this.nextSlide();
            } else {
                // Swipe para direita - slide anterior
                this.previousSlide();
            }
        }
    }
    
    // Função para auto-play (opcional)
    startAutoPlay(interval = 5000) {
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, interval);
        
        // Pausar auto-play quando hover
        const galeriaContainer = document.querySelector('.galeria-container');
        galeriaContainer.addEventListener('mouseenter', () => {
            clearInterval(this.autoPlayInterval);
        });
        
        galeriaContainer.addEventListener('mouseleave', () => {
            this.startAutoPlay(interval);
        });
    }
    
    optimizeImages() {
        this.slides.forEach(slide => {
            const img = slide.querySelector('img');
            if (img) {
                // Aguardar o carregamento da imagem para obter dimensões corretas
                if (img.complete) {
                    this.adjustImageDisplay(img);
                } else {
                    img.addEventListener('load', () => {
                        this.adjustImageDisplay(img);
                    });
                }
            }
        });
    }
    
    adjustImageDisplay(img) {
        const aspectRatio = img.naturalWidth / img.naturalHeight;
        const containerAspectRatio = 1.4; // Aproximadamente 70rem / 50rem
        
        // Remove classes anteriores
        img.classList.remove('portrait-image', 'landscape-image', 'square-image');
        
        if (aspectRatio < 0.7) {
            // Imagem muito estreita (portrait)
            img.classList.add('portrait-image');
            img.style.width = 'auto';
            img.style.height = '90%';
        } else if (aspectRatio > 2) {
            // Imagem muito larga (panorâmica)
            img.classList.add('landscape-image');
            img.style.width = '90%';
            img.style.height = 'auto';
        } else {
            // Imagem com proporção normal
            img.classList.add('square-image');
            img.style.width = 'auto';
            img.style.height = 'auto';
        }
    }
}

// Inicializar a galeria quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    new GaleriaInterativa();
});

// Adicionar cursor personalizado para a galeria
document.addEventListener('DOMContentLoaded', () => {
    const galeriaWrapper = document.querySelector('.galeria-wrapper');
    if (galeriaWrapper) {
        galeriaWrapper.style.cursor = 'grab';
    }
});