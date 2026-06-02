document.addEventListener('DOMContentLoaded', () => {
  // Menu Hamburguer Mobile
  const burgerMenu = document.querySelector('.burger-menu');
  const navMenu = document.querySelector('.nav-menu');

  if (burgerMenu && navMenu) {
    burgerMenu.addEventListener('click', () => {
      burgerMenu.classList.toggle('open');
      navMenu.classList.toggle('open');
      
      // Impedir scroll quando menu estiver aberto
      if (navMenu.classList.contains('open')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });

    // Fechar menu ao clicar em links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        burgerMenu.classList.remove('open');
        navMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Revelação de Elementos ao Scroll (Scroll Reveal)
  const revealElements = document.querySelectorAll('.reveal');
  
  const checkReveal = () => {
    const triggerBottom = window.innerHeight * 0.85;
    
    revealElements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      
      if (elementTop < triggerBottom) {
        element.classList.add('active');
      }
    });
  };

  // Executa uma vez no início
  checkReveal();
  
  // Executa ao scrollar
  window.addEventListener('scroll', checkReveal);
});
