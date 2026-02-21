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
