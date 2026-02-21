document.addEventListener('DOMContentLoaded', () => {

    // 1. Анимация появления при скролле
    const revealElements = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 100; // Отступ снизу, когда элемент начинает появляться

        revealElements.forEach((element) => {
            const elementTop = element.getBoundingClientRect().top;

            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    };

    // Запускаем при загрузке и при скролле
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Чтобы верхние элементы появились сразу

    // 2. Временная заглушка для кнопок покупки
    const buyButtons = document.querySelectorAll('.buy-btn');

    buyButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // В будущем здесь будет код открытия платежного виджета
            alert('Здесь будет открываться окно оплаты! Сейчас сайт в демо-режиме.');
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('product-modal');
    if (!modal) return;

    const galleryContainer = modal.querySelector('.modal-gallery');
    const galleryTrack = modal.querySelector('.gallery-track');
    const descContainer = document.getElementById('modal-desc');
    const modalWindow = modal.querySelector('.modal-window');
    
    let sliderInterval;

    // 1. Функция расчета ширины
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

            // Лимиты
            const maxWidth = modalWindow.offsetWidth * 0.65;
            if (targetWidth > maxWidth) targetWidth = maxWidth;
            if (targetWidth < 380) targetWidth = 380;

            galleryContainer.style.width = `${targetWidth}px`;
        };

        if (activeImg.complete) calculate();
        else activeImg.onload = calculate;
    };

    // 2. Открытие
    document.querySelectorAll('.open-modal-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();

            // Заполняем текст
            document.getElementById('modal-title').textContent = btn.dataset.title;
            document.getElementById('modal-price').textContent = btn.dataset.price;
            descContainer.innerHTML = btn.dataset.desc;
            descContainer.scrollTop = 0; // Скролл в начало

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

            // Настраиваем ширину и запускаем слайдер
            setTimeout(adjustWidth, 50);
            startSlider();
        });
    });

    // 3. Слайдер
    function startSlider() {
        clearInterval(sliderInterval);
        sliderInterval = setInterval(() => {
            const imgs = galleryTrack.querySelectorAll('img');
            if (imgs.length < 2) return;

            let idx = Array.from(imgs).findIndex(i => i.classList.contains('active'));
            imgs[idx].classList.remove('active');
            let next = (idx + 1) % imgs.length;
            imgs[next].classList.add('active');

            adjustWidth(); // Подстраиваем ширину под новый слайд
        }, 4000);
    }

    // 4. Закрытие
    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        clearInterval(sliderInterval);
    };

    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.querySelector('.modal-overlay').addEventListener('click', closeModal);
    window.addEventListener('keydown', (e) => { if(e.key === 'Escape') closeModal(); });
});

