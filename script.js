// Función para descargar CV en PDF
function downloadCV() {
    // Mostrar opciones al usuario
    const userChoice = confirm('¿Quieres generar un PDF automáticamente? \n\n' +
        'SÍ = Generar PDF automático\n' +
        'NO = Abrir ventana para imprimir/guardar como PDF');
    
    if (userChoice) {
        generatePDF();
    } else {
        printCV();
    }
}

// Función mejorada para generar PDF
function generatePDF() {
    // Verificar si html2pdf está disponible
    if (typeof html2pdf === 'undefined') {
        console.error('html2pdf library not loaded');
        alert('Biblioteca PDF no encontrada. Se abrirá la ventana de impresión.');
        printCV();
        return;
    }

    const element = safeQuerySelector('.cv-card');
    
    if (!element) {
        console.error('No se encontró el elemento .cv-card para generar PDF');
        alert('Error: No se puede generar el PDF. Elemento no encontrado.');
        return;
    }

    // Mostrar indicador de carga
    showLoadingIndicator();

    // Configuración mejorada para PDF
    const opt = {
        margin: [0.5, 0.5, 0.5, 0.5],
        filename: 'mi-cv.pdf',
        image: { 
            type: 'jpeg', 
            quality: 0.95 
        },
        html2canvas: { 
            scale: 2,
            useCORS: true,
            letterRendering: true,
            allowTaint: false,
            backgroundColor: '#ffffff'
        },
        jsPDF: { 
            unit: 'in', 
            format: 'a4', 
            orientation: 'portrait',
            compress: true
        }
    };

    // Preparar elemento para PDF
    prepareElementForPDF(element);

    // Generar PDF
    html2pdf()
        .set(opt)
        .from(element)
        .save()
        .then(() => {
            hideLoadingIndicator();
            restoreElementAfterPDF(element);
        })
        .catch((error) => {
            console.error('Error al generar PDF:', error);
            hideLoadingIndicator();
            restoreElementAfterPDF(element);
            alert('Error al generar PDF. Se abrirá la ventana de impresión.');
            printCV();
        });
}

// Función alternativa: usar la funcionalidad nativa de impresión
function printCV() {
    // Crear estilos específicos para impresión
    const printStyles = `
        <style>
            @media print {
                body * { visibility: hidden; }
                .cv-card, .cv-card * { visibility: visible; }
                .cv-card { 
                    position: absolute; 
                    left: 0; 
                    top: 0; 
                    width: 100%; 
                    box-shadow: none;
                    border-radius: 0;
                }
                .download-btn { display: none !important; }
                .header { page-break-inside: avoid; }
                .section { page-break-inside: avoid; }
                .experience-item, .education-item { 
                    page-break-inside: avoid; 
                    margin-bottom: 15px;
                }
            }
        </style>
    `;
    
    // Agregar estilos temporalmente
    const styleElement = document.createElement('style');
    styleElement.innerHTML = printStyles;
    document.head.appendChild(styleElement);
    
    // Abrir diálogo de impresión
    window.print();
    
    // Remover estilos después de 1 segundo
    setTimeout(() => {
        document.head.removeChild(styleElement);
    }, 1000);
}

// Función para preparar elemento para PDF
function prepareElementForPDF(element) {
    // Ocultar botón de descarga
    const downloadBtn = safeQuerySelector('.download-btn', element);
    if (downloadBtn) {
        downloadBtn.style.display = 'none';
    }
    
    // Ajustar tamaños para PDF
    element.style.maxWidth = 'none';
    element.style.margin = '0';
    element.style.padding = '20px';
}

// Función para restaurar elemento después de PDF
function restoreElementAfterPDF(element) {
    // Mostrar botón de descarga
    const downloadBtn = safeQuerySelector('.download-btn', element);
    if (downloadBtn) {
        downloadBtn.style.display = 'block';
    }
    
    // Restaurar estilos originales
    element.style.maxWidth = '';
    element.style.margin = '';
    element.style.padding = '';
}

// Función para mostrar indicador de carga
function showLoadingIndicator() {
    const indicator = document.createElement('div');
    indicator.id = 'pdf-loading';
    indicator.innerHTML = `
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            color: white;
            font-size: 18px;
        ">
            <div style="text-align: center;">
                <div style="
                    border: 4px solid #f3f3f3;
                    border-top: 4px solid #3498db;
                    border-radius: 50%;
                    width: 50px;
                    height: 50px;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 20px;
                "></div>
                Generando PDF...
            </div>
        </div>
        <style>
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
    `;
    document.body.appendChild(indicator);
}

// Función para ocultar indicador de carga
function hideLoadingIndicator() {
    const indicator = safeQuerySelector('#pdf-loading');
    if (indicator) {
        document.body.removeChild(indicator);
    }
}

// Animación suave al hacer scroll
function initScrollAnimations() {
    const sections = safeQuerySelectorAll('.section');
    
    if (sections.length === 0) {
        console.warn('No se encontraron secciones para animar');
        return;
    }
    
    // Configurar observer para animaciones de scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Inicializar secciones para animación
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
}

// Efectos hover para las tarjetas de experiencia y educación
function initHoverEffects() {
    const items = safeQuerySelectorAll('.experience-item, .education-item');
    
    if (items.length === 0) {
        console.warn('No se encontraron items de experiencia/educación');
        return;
    }
    
    items.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.borderLeftColor = '#e74c3c';
            this.style.borderLeftWidth = '6px';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.borderLeftColor = '#3498db';
            this.style.borderLeftWidth = '5px';
        });
    });
}

// Función para smooth scroll hacia secciones
function initSmoothScroll() {
    // Si decides agregar navegación interna, esta función manejará el scroll suave
    const links = safeQuerySelectorAll('a[href^="#"]');
    
    if (links.length === 0) {
        return; // No hay enlaces internos, no hacer nada
    }
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Verificar que el href no sea solo "#" y que exista el elemento
            if (targetId && targetId !== '#' && targetId.length > 1) {
                const targetElement = safeQuerySelector(targetId);
                
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// Función para validar el formulario de contacto (si decides agregar uno)
function validateContactForm(formData) {
    const errors = [];
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        errors.push('Email inválido');
    }
    
    // Validar teléfono colombiano
    const phoneRegex = /^(\+57|57)?[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
        errors.push('Número de teléfono inválido');
    }
    
    return errors;
}

// Función para copiar información de contacto
function copyToClipboard(text, element) {
    navigator.clipboard.writeText(text).then(function() {
        // Mostrar feedback visual
        const originalText = element.innerHTML;
        element.innerHTML = '✓ Copiado!';
        element.style.color = '#27ae60';
        
        setTimeout(() => {
            element.innerHTML = originalText;
            element.style.color = '';
        }, 2000);
    }).catch(function(err) {
        console.error('Error al copiar: ', err);
        // Fallback para navegadores que no soportan clipboard API
        fallbackCopyTextToClipboard(text);
    });
}

// Función fallback para copiar texto
function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        document.execCommand('copy');
    } catch (err) {
        console.error('Fallback: No se pudo copiar', err);
    }

    document.body.removeChild(textArea);
}

// Función para hacer clickeable la información de contacto
function initContactInteractions() {
    const contactItems = safeQuerySelectorAll('.contact-item');
    
    if (contactItems.length === 0) {
        console.warn('No se encontraron elementos de contacto');
        return;
    }
    
    contactItems.forEach(item => {
        const textElement = safeQuerySelector('span', item);
        
        if (!textElement) {
            console.warn('No se encontró span en item de contacto');
            return;
        }
        
        const text = textElement.textContent;
        
        // Hacer los elementos clickeables para copiar
        item.style.cursor = 'pointer';
        item.title = 'Click para copiar';
        
        item.addEventListener('click', function() {
            copyToClipboard(text, textElement);
        });
        
        // Efecto hover
        item.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#e3f2fd';
            this.style.borderRadius = '8px';
            this.style.padding = '5px';
            this.style.transition = 'all 0.3s ease';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '';
            this.style.padding = '';
        });
    });
}

// Función para animar las habilidades
function animateSkills() {
    const skillTags = safeQuerySelectorAll('.skill-tag');
    
    if (skillTags.length === 0) {
        console.warn('No se encontraron tags de habilidades');
        return;
    }
    
    skillTags.forEach((tag, index) => {
        tag.style.opacity = '0';
        tag.style.transform = 'scale(0.8)';
        tag.style.transition = 'all 0.3s ease';
        
        setTimeout(() => {
            tag.style.opacity = '1';
            tag.style.transform = 'scale(1)';
        }, index * 100);
    });
}

// Función para detectar el tema preferido del usuario
function detectThemePreference() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (prefersDark) {
    }
}

// Función para optimizar imágenes
function optimizeImages() {
    const images = safeQuerySelectorAll('img');
    
    if (images.length === 0) {
        return; // No hay imágenes, no hacer nada
    }
    
    images.forEach(img => {
        // Lazy loading
        img.loading = 'lazy';
        
        // Agregar fallback si la imagen falla
        img.addEventListener('error', function() {
            this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDE1MCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiBmaWxsPSIjREREIi8+Cjx0ZXh0IHg9Ijc1IiB5PSI3NSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjNjY2Ij5GT1RPPC90ZXh0Pgo8L3N2Zz4=';
        });
    });
}

// Función principal de inicialización
function init() {
    // Configurar manejo de errores primero
    handleErrors();
    
    // Esperar a que el DOM esté completamente cargado
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeCV);
    } else {
        // El DOM ya está cargado
        initializeCV();
    }
}

// Función separada para inicializar el CV
function initializeCV() {
    try {
        // Inicializar todas las funciones con manejo seguro
        initScrollAnimations();
        initHoverEffects();
        initSmoothScroll();
        initContactInteractions();
        detectThemePreference();
        optimizeImages();
        
        // Animar habilidades después de un pequeño delay
        setTimeout(() => {
            try {
                animateSkills();
            } catch (e) {
                console.warn('Error al animar habilidades:', e);
            }
        }, 1000);
        
    } catch (error) {
        console.error('Error al inicializar CV:', error);
    }
}

// Función para manejar errores de manera más específica
function handleErrors() {
    // Capturar errores de JavaScript
    window.addEventListener('error', function(e) {
        console.warn('Error detectado en CV:', {
            message: e.message,
            filename: e.filename,
            lineno: e.lineno,
            colno: e.colno
        });
        // No mostrar errores al usuario para mantener la experiencia
        return true;
    });

    // Capturar promesas rechazadas
    window.addEventListener('unhandledrejection', function(e) {
        console.warn('Promesa rechazada en CV:', e.reason);
        e.preventDefault();
    });
}

// Función para verificar que los elementos existen antes de usarlos
function safeQuerySelector(selector, context = document) {
    try {
        if (!selector || selector.trim() === '' || selector === '#') {
            return null;
        }
        return context.querySelector(selector);
    } catch (e) {
        console.warn(`Selector inválido: ${selector}`, e);
        return null;
    }
}

function safeQuerySelectorAll(selector, context = document) {
    try {
        if (!selector || selector.trim() === '' || selector === '#') {
            return [];
        }
        return context.querySelectorAll(selector);
    } catch (e) {
        console.warn(`Selector inválido: ${selector}`, e);
        return [];
    }
}

// Función para analytics (opcional)
function trackPageView() {
    // Si decides usar Google Analytics u otra herramienta
    if (typeof gtag !== 'undefined') {
        gtag('config', 'GA_MEASUREMENT_ID', {
            page_title: 'CV - Tu Nombre',
            page_location: window.location.href
        });
    }
}

// Inicializar la aplicación
init();

// Exportar funciones para uso externo si es necesario
window.CVApp = {
    downloadCV,
    copyToClipboard,
    generatePDF
};