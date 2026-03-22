document.addEventListener('DOMContentLoaded', () => {

    // ===== СЛАЙД-ПЕРЕХОД МЕЖДУ СТРАНИЦАМИ =====

    const wrapper = document.querySelector('.pages-wrapper');
    const goToEvents = document.getElementById('go-to-events');
    const goToMain = document.getElementById('go-to-main');
    const mobileGoMain = document.getElementById('mobile-go-main');
    const mobileGoEvents = document.getElementById('mobile-go-events');

    // Переход на страницу мероприятий (главная уходит влево)
    const showEvents = () => {
        wrapper.classList.add('show-events');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Возврат на главную
    const showMain = () => {
        wrapper.classList.remove('show-events');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (goToEvents) goToEvents.addEventListener('click', showEvents);
    if (goToMain) goToMain.addEventListener('click', showMain);
    if (mobileGoMain) mobileGoMain.addEventListener('click', (e) => { e.preventDefault(); showMain(); closeMobileMenu(); });
    if (mobileGoEvents) mobileGoEvents.addEventListener('click', (e) => { e.preventDefault(); showEvents(); closeMobileMenu(); });

    // Логотип возвращает на главную
    const navLogo = document.getElementById('nav-logo');
    if (navLogo) navLogo.addEventListener('click', (e) => { e.preventDefault(); showMain(); });


    // ===== АНИМАЦИЯ ПОЯВЛЕНИЯ ПРИ СКРОЛЛЕ =====

    const revealElements = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
        revealElements.forEach((el) => {
            if (el.getBoundingClientRect().top < window.innerHeight - 100) {
                el.classList.add('active');
            }
        });
    };
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();


    // ===== КНОПКИ "КУПИТЬ" — TELEGRAM =====

    const buyButtons = document.querySelectorAll('.buy-btn, .modal-footer .btn--primary');
    buyButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            window.open('https://t.me/shameychat_bot', '_blank');
        });
    });


    // ===== МОДАЛЬНОЕ ОКНО =====

    const modal = document.getElementById('product-modal');
    if (!modal) return;

    const galleryContainer = modal.querySelector('.modal-gallery');
    const galleryTrack = modal.querySelector('.gallery-track');
    const descContainer = document.getElementById('modal-desc');
    const modalWindow = modal.querySelector('.modal-window');
    let sliderInterval;

    // Подгоняем ширину галереи под пропорции активной картинки
    const adjustWidth = () => {
        const activeImg = galleryTrack.querySelector('img.active');
        if (!activeImg || window.innerWidth <= 768) {
            galleryContainer.style.width = "";
            return;
        }
        const calculate = () => {
            const ratio = activeImg.naturalWidth / activeImg.naturalHeight;
            const containerHeight = modalWindow.offsetHeight;
            let targetWidth = containerHeight * ratio;
            const maxWidth = modalWindow.offsetWidth * 0.65;
            if (targetWidth > maxWidth) targetWidth = maxWidth;
            if (targetWidth < 380) targetWidth = 380;
            galleryContainer.style.width = `${targetWidth}px`;
        };
        if (activeImg.complete) calculate();
        else activeImg.onload = calculate;
    };

    // Открытие модалки — заполняем данными из кнопки товара
    const openProductModal = (btn) => {
        document.getElementById('modal-title').textContent = btn.dataset.title;
        document.getElementById('modal-price').textContent = btn.dataset.price;
        descContainer.innerHTML = btn.dataset.desc;
        descContainer.scrollTop = 0;

        const images = JSON.parse(btn.dataset.images || '[]');
        galleryTrack.innerHTML = '';
        images.forEach((src, idx) => {
            const img = document.createElement('img');
            img.src = src;
            if (idx === 0) img.classList.add('active');
            galleryTrack.appendChild(img);
        });

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        setTimeout(adjustWidth, 50);
        startSlider();
    };

    // Клик по "Подробнее" или по картинке карточки
    document.querySelectorAll('.product-card').forEach(card => {
        const openBtn = card.querySelector('.open-modal-btn');
        const cardImg = card.querySelector('.product-card__image');
        if (openBtn) {
            openBtn.addEventListener('click', (e) => { e.preventDefault(); openProductModal(openBtn); });
            if (cardImg) cardImg.addEventListener('click', () => openProductModal(openBtn));
        }
    });


    // ===== СЛАЙДЕР В МОДАЛКЕ =====

    function changeSlide(direction = 'next') {
        const imgs = galleryTrack.querySelectorAll('img');
        if (imgs.length < 2) return;
        let idx = Array.from(imgs).findIndex(i => i.classList.contains('active'));
        imgs[idx].classList.remove('active');
        let nextIdx = direction === 'next'
            ? (idx + 1) % imgs.length
            : (idx - 1 + imgs.length) % imgs.length;
        imgs[nextIdx].classList.add('active');
        adjustWidth();
    }

    function startSlider() {
        clearInterval(sliderInterval);
        sliderInterval = setInterval(() => changeSlide('next'), 4000);
    }

    modal.querySelector('.gallery-nav.next').addEventListener('click', (e) => { e.stopPropagation(); changeSlide('next'); startSlider(); });
    modal.querySelector('.gallery-nav.prev').addEventListener('click', (e) => { e.stopPropagation(); changeSlide('prev'); startSlider(); });

    // Закрытие модалки
    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        clearInterval(sliderInterval);
    };

    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.querySelector('.modal-overlay').addEventListener('click', closeModal);
    window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });


    // ===== БУРГЕР-МЕНЮ =====

    const burgerBtn = document.querySelector('.menu-icon');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeMenuBtn = document.querySelector('.mobile-menu__close');
    const menuOverlay = document.querySelector('.mobile-menu__overlay');

    const closeMobileMenu = () => {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    };

    if (burgerBtn && mobileMenu) {
        burgerBtn.addEventListener('click', () => {
            mobileMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        closeMenuBtn.addEventListener('click', closeMobileMenu);
        menuOverlay.addEventListener('click', closeMobileMenu);
    }


    // ===== ТЁМНАЯ ТЕМА =====

    const themeBtn = document.getElementById('theme-toggle');
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme');
    }

    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
    });

});