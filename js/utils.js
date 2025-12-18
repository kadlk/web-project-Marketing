// Функция для показа красивых уведомлений
function showNotification(message, type = 'success', duration = 3000) {
    // Удаляем предыдущие уведомления
    const existing = document.querySelectorAll('.custom-notification');
    existing.forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = `custom-notification custom-notification-${type}`;
    
    const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : type === 'warning' ? '⚠' : 'ℹ';
    notification.innerHTML = `
        <div class="notification-icon">${icon}</div>
        <div class="notification-message">${message}</div>
        <button class="notification-close">×</button>
    `;
    
    document.body.appendChild(notification);
    
    // Анимация появления
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Закрытие по клику
    notification.querySelector('.notification-close').addEventListener('click', () => {
        closeNotification(notification);
    });
    
    // Автоматическое закрытие
    if (duration > 0) {
        setTimeout(() => {
            closeNotification(notification);
        }, duration);
    }
}

function closeNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        notification.remove();
    }, 300);
}

// Функция для создания фона слайда
function createBackgroundStyle(background) {
    if (background.type === 'gradient') {
        return `linear-gradient(${background.direction}deg, ${background.colors.join(', ')})`;
    } else {
        return background.colors[0];
    }
}

// Функция для конвертации цвета в HEX
function rgbToHex(rgb) {
    if (!rgb || rgb === 'transparent') return '#ffffff';
    if (rgb.startsWith('#')) return rgb;
    if (rgb.startsWith('rgb')) {
        const matches = rgb.match(/\d+/g);
        if (matches && matches.length >= 3) {
            return '#' + matches.map(x => {
                const hex = parseInt(x).toString(16);
                return hex.length === 1 ? '0' + hex : hex;
            }).join('');
        }
    }
    return '#ffffff';
}
