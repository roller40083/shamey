document.addEventListener('DOMContentLoaded', () => {

    // --- 1. АНИМАЦИЯ ПОЯВЛЕНИЯ ПРИ СКРОЛЛЕ ---
    const revealElements = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 100;
        revealElements.forEach((element) => {
            const elementTop = element.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    };
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();

    // --- 2. ЛОГИКА КНОПОК "КУПИТЬ" (ТЕЛЕГРАМ) ---
    const buyButtons = document.querySelectorAll('.buy-btn, .modal-footer .btn--primary');
    buyButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            window.open('https://t.me/shameychat_bot', '_blank');
        });
    });

    // --- 3. РАБОТА С МОДАЛЬНЫМ ОКНОМ ---
    const modal = document.getElementById('product-modal');
    if (!modal) return;

    const galleryContainer = modal.querySelector('.modal-gallery');
    const galleryTrack = modal.querySelector('.gallery-track');
    const descContainer = document.getElementById('modal-desc');
    const modalWindow = modal.querySelector('.modal-window');
    let sliderInterval;

    // Расчет ширины под картинку
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

    // ГЛАВНАЯ ФУНКЦИЯ ОТКРЫТИЯ (теперь вызывается отовсюду)
    const openProductModal = (btn) => {
        // Заполняем текст
        document.getElementById('modal-title').textContent = btn.dataset.title;
        document.getElementById('modal-price').textContent = btn.dataset.price;
        descContainer.innerHTML = btn.dataset.desc;
        descContainer.scrollTop = 0;

        // Рендерим картинки
        const images = JSON.parse(btn.dataset.images || '[]');
        galleryTrack.innerHTML = '';
        images.forEach((src, idx) => {
            const img = document.createElement('img');
            img.src = src;
            if (idx === 0) img.classList.add('active');
            galleryTrack.appendChild(img);
        });

        // Показываем
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        setTimeout(adjustWidth, 50);
        startSlider();
    };

    // Находим все карточки и вешаем клики
    const cards = document.querySelectorAll('.product-card');
    cards.forEach(card => {
        const openBtn = card.querySelector('.open-modal-btn');
        const cardImg = card.querySelector('.product-card__image');

        if (openBtn) {
            // Клик по кнопке "Подробнее"
            openBtn.addEventListener('click', (e) => {
                e.preventDefault();
                openProductModal(openBtn);
            });

            // ВОТ ОНО: Клик по самой картинке в карточке
            if (cardImg) {
                cardImg.addEventListener('click', () => {
                    openProductModal(openBtn); // Используем данные из кнопки этой же карточки
                });
            }
        }
    });

    // --- 4. СЛАЙДЕР ВНУТРИ МОДАЛКИ ---
    function changeSlide(direction = 'next') {
        const imgs = galleryTrack.querySelectorAll('img');
        if (imgs.length < 2) return;
        let idx = Array.from(imgs).findIndex(i => i.classList.contains('active'));
        imgs[idx].classList.remove('active');
        let nextIdx = direction === 'next' ? (idx + 1) % imgs.length : (idx - 1 + imgs.length) % imgs.length;
        imgs[nextIdx].classList.add('active');
        adjustWidth();
    }

    function startSlider() {
        clearInterval(sliderInterval);
        sliderInterval = setInterval(() => changeSlide('next'), 4000);
    }

    modal.querySelector('.gallery-nav.next').addEventListener('click', (e) => {
        e.stopPropagation();
        changeSlide('next');
        startSlider();
    });

    modal.querySelector('.gallery-nav.prev').addEventListener('click', (e) => {
        e.stopPropagation();
        changeSlide('prev');
        startSlider();
    });

    // --- 5. ЗАКРЫТИЕ ---
    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        clearInterval(sliderInterval);
    };

    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.querySelector('.modal-overlay').addEventListener('click', closeModal);
    window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });


    // --- 6. ЛОГИКА БУРГЕР-МЕНЮ ---
    const burgerBtn = document.querySelector('.menu-icon');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeMenuBtn = document.querySelector('.mobile-menu__close');
    const menuOverlay = document.querySelector('.mobile-menu__overlay');

    if (burgerBtn && mobileMenu) {
        const openMenu = () => {
            mobileMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
        };

        const closeMenu = () => {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        };

        burgerBtn.addEventListener('click', openMenu);
        closeMenuBtn.addEventListener('click', closeMenu);
        menuOverlay.addEventListener('click', closeMenu);
    }

    // --- 7. ТЕМНАЯ ТЕМА ---
    const themeBtn = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme');

    // Проверяем, была ли сохранена тема
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }

    themeBtn.addEventListener('click', () => {
        // Переключаем класс
        document.body.classList.toggle('dark-theme');

        // Сохраняем выбор в память браузера
        let theme = 'light';
        if (document.body.classList.contains('dark-theme')) {
            theme = 'dark';
        }
        localStorage.setItem('theme', theme);
    });
});