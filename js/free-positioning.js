// Свободное позиционирование изображений с использованием interact.js
// Хранилище позиций и размеров изображений
const imagePositions = {};
const imageScales = {};

// Включить режим свободного позиционирования для изображения
function enableFreePositioning(imageWrapper, slideIndex) {
    const img = imageWrapper.querySelector('img');
    const sizeKey = img?.dataset.sizeKey;
    if (!sizeKey) return;

    const slide = imageWrapper.closest('.slide');
    if (!slide) return;

    // Делаем обёртку абсолютно позиционируемой
    imageWrapper.style.position = 'absolute';
    imageWrapper.style.zIndex = '50'; // Base z-index so images appear above content
    imageWrapper.classList.add('free-positioning-active');

    // Загружаем сохранённые координаты и масштаб
    const posKey = `${slideIndex}_${sizeKey}`;
    const scaleKey = `${slideIndex}_${sizeKey}_scale`;

    // Сохраняем исходные размеры (100% от размера картинки)
    const originalWidth = imageWrapper.offsetWidth;
    const originalHeight = imageWrapper.offsetHeight;

    imageWrapper.dataset.originalWidth = originalWidth;
    imageWrapper.dataset.originalHeight = originalHeight;

    // Инициализируем координаты и масштаб
    const savedScale = imageScales[scaleKey] || 1;
    let x = 0;
    let y = 0;

    // Вычисляем итоговые размеры с учетом scale для центрирования
    const visualWidth = originalWidth * savedScale;
    const visualHeight = originalHeight * savedScale;

    if (imagePositions[posKey]) {
        // Загружаем сохранённую позицию
        x = imagePositions[posKey].x;
        y = imagePositions[posKey].y;
    } else {
        // Центрируем по умолчанию с учетом визуальных размеров после scale
        const slideRect = slide.getBoundingClientRect();
        x = (slideRect.width - visualWidth) / 2;
        y = (slideRect.height - visualHeight) / 2;
        imagePositions[posKey] = { x, y };
    }

    // Устанавливаем позицию через left/top
    imageWrapper.style.left = x + 'px';
    imageWrapper.style.top = y + 'px';

    // Применяем scale через transform
    imageWrapper.style.transform = `scale(${savedScale})`;
    imageWrapper.style.transformOrigin = '0 0';

    // Отключаем Sortable если был активирован
    imageWrapper.draggable = false;

    // Инициализируем interact.js для этого элемента
    setupInteractJS(imageWrapper, slideIndex, sizeKey);
}

// Настройка interact.js для элемента
function setupInteractJS(imageWrapper, slideIndex, sizeKey) {
    const slide = imageWrapper.closest('.slide');
    if (!slide) return;

    const posKey = `${slideIndex}_${sizeKey}`;
    const scaleKey = `${slideIndex}_${sizeKey}_scale`;

    // Настройка перетаскивания и изменения размера
    interact(imageWrapper)
        .draggable({
            inertia: false,
            listeners: {
                start(event) {
                    imageWrapper.style.opacity = '0.8';
                    imageWrapper.style.zIndex = '1000';
                    imageWrapper.classList.add('dragging');

                    // Показываем направляющие при зажатом Shift
                    if (event.shiftKey) {
                        showCenterGuide(slide);
                    }
                },
                move(event) {
                    const target = event.target;
                    let x = (parseFloat(target.style.left) || 0) + event.dx;
                    let y = (parseFloat(target.style.top) || 0) + event.dy;

                    // Snap to center при зажатом Shift
                    let isSnapped = false;

                    if (event.shiftKey) {
                        showCenterGuide(slide);

                        const slideRect = slide.getBoundingClientRect();
                        const wrapperRect = target.getBoundingClientRect();
                        const slideCenter = {
                            x: slideRect.width / 2,
                            y: slideRect.height / 2
                        };

                        const snapThreshold = 30;

                        // Snap по X
                        const targetCenterX = slideCenter.x - wrapperRect.width / 2;
                        if (Math.abs(x - targetCenterX) < snapThreshold) {
                            x = targetCenterX;
                            isSnapped = true;
                        }

                        // Snap по Y
                        const targetCenterY = slideCenter.y - wrapperRect.height / 2;
                        if (Math.abs(y - targetCenterY) < snapThreshold) {
                            y = targetCenterY;
                            isSnapped = true;
                        }
                    } else {
                        hideCenterGuide(slide);
                    }

                    target.style.left = x + 'px';
                    target.style.top = y + 'px';

                    // Визуальная обратная связь при snap
                    if (isSnapped) {
                        target.style.boxShadow = '0 0 0 3px #3b82f6';
                    } else {
                        target.style.boxShadow = '';
                    }
                },
                end(event) {
                    imageWrapper.style.opacity = '1';
                    imageWrapper.style.zIndex = '';
                    imageWrapper.style.boxShadow = '';
                    imageWrapper.classList.remove('dragging');

                    hideCenterGuide(slide);

                    // Сохраняем позицию
                    const x = parseFloat(imageWrapper.style.left) || 0;
                    const y = parseFloat(imageWrapper.style.top) || 0;

                    imagePositions[posKey] = { x, y };
                    syncPositionAcrossFormats(slideIndex, sizeKey, x, y);
                    saveImagePositions();
                }
            }
        })
        .resizable({
            edges: { left: true, right: true, bottom: true, top: true },
            listeners: {
                start(event) {
                    imageWrapper.classList.add('resizing');
                },
                move(event) {
                    const target = event.target;
                    let x = parseFloat(target.style.left) || 0;
                    let y = parseFloat(target.style.top) || 0;

                    // Корректируем позицию при изменении размера с углов
                    x += event.deltaRect.left;
                    y += event.deltaRect.top;

                    // Применяем новые размеры и позицию
                    target.style.width = event.rect.width + 'px';
                    target.style.height = event.rect.height + 'px';
                    target.style.left = x + 'px';
                    target.style.top = y + 'px';

                    // Вычисляем масштаб
                    const originalWidth = parseFloat(target.dataset.originalWidth) || target.offsetWidth;
                    const scale = event.rect.width / originalWidth;
                    imageScales[scaleKey] = scale;
                },
                end(event) {
                    imageWrapper.classList.remove('resizing');

                    const x = parseFloat(imageWrapper.style.left) || 0;
                    const y = parseFloat(imageWrapper.style.top) || 0;
                    const scale = imageScales[scaleKey] || 1;

                    imagePositions[posKey] = { x, y };
                    syncScaleAcrossFormats(slideIndex, sizeKey, scale);
                    syncPositionAcrossFormats(slideIndex, sizeKey, x, y);
                    saveImagePositions();
                }
            },
            modifiers: [
                interact.modifiers.restrictSize({
                    min: { width: 50, height: 50 }
                })
            ]
        });

    // Добавляем визуальные ручки для resize
    addVisualResizeHandles(imageWrapper);
}

// Добавление визуальных ручек для изменения размера
function addVisualResizeHandles(imageWrapper) {
    // Удаляем старые ручки если есть
    imageWrapper.querySelectorAll('.resize-handle').forEach(h => h.remove());

    const corners = ['nw', 'ne', 'sw', 'se'];
    corners.forEach(corner => {
        const handle = document.createElement('div');
        handle.className = `resize-handle resize-handle-${corner}`;
        handle.style.cssText = `
            position: absolute;
            width: 14px;
            height: 14px;
            background: #3b82f6;
            border: 2px solid white;
            border-radius: 50%;
            cursor: ${corner === 'nw' || corner === 'se' ? 'nwse-resize' : 'nesw-resize'};
            z-index: 10;
            opacity: 0;
            transition: opacity 0.2s, transform 0.1s;
            pointer-events: none;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        `;

        // Позиционируем ручки по углам
        switch(corner) {
            case 'nw': handle.style.top = '-7px'; handle.style.left = '-7px'; break;
            case 'ne': handle.style.top = '-7px'; handle.style.right = '-7px'; break;
            case 'sw': handle.style.bottom = '-7px'; handle.style.left = '-7px'; break;
            case 'se': handle.style.bottom = '-7px'; handle.style.right = '-7px'; break;
        }

        imageWrapper.appendChild(handle);
    });

    // Показываем ручки при наведении
    imageWrapper.addEventListener('mouseenter', () => {
        imageWrapper.querySelectorAll('.resize-handle').forEach(h => {
            h.style.opacity = '1';
        });
    });

    imageWrapper.addEventListener('mouseleave', () => {
        if (!imageWrapper.classList.contains('resizing')) {
            imageWrapper.querySelectorAll('.resize-handle').forEach(h => {
                h.style.opacity = '0';
            });
        }
    });
}

// Показать направляющие для центра
function showCenterGuide(slide) {
    let guide = slide.querySelector('.center-guide');
    if (!guide) {
        guide = document.createElement('div');
        guide.className = 'center-guide';
        guide.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 999;
        `;

        const verticalLine = document.createElement('div');
        verticalLine.className = 'guide-vertical';
        verticalLine.style.cssText = `
            position: absolute;
            left: 50%;
            top: 0;
            width: 2px;
            height: 100%;
            background: #3b82f6;
            opacity: 0.8;
            transform: translateX(-50%);
        `;

        const horizontalLine = document.createElement('div');
        horizontalLine.className = 'guide-horizontal';
        horizontalLine.style.cssText = `
            position: absolute;
            top: 50%;
            left: 0;
            width: 100%;
            height: 2px;
            background: #3b82f6;
            opacity: 0.8;
            transform: translateY(-50%);
        `;

        guide.appendChild(verticalLine);
        guide.appendChild(horizontalLine);
        slide.appendChild(guide);
    }
    guide.style.display = 'block';
}

// Скрыть направляющие
function hideCenterGuide(slide) {
    const guide = slide.querySelector('.center-guide');
    if (guide) {
        guide.style.display = 'none';
    }
}

// Синхронизация позиции между форматами
function syncPositionAcrossFormats(slideIndex, sizeKey, x, y) {
    const allSlides = document.querySelectorAll(`.slide[data-slide-index="${slideIndex}"]`);

    allSlides.forEach(slide => {
        const wrapper = slide.querySelector(`.uploaded-image-wrapper img[data-size-key="${sizeKey}"]`)?.closest('.uploaded-image-wrapper');
        if (wrapper && wrapper.classList.contains('free-positioning-active')) {
            wrapper.style.left = x + 'px';
            wrapper.style.top = y + 'px';
        }
    });
}

// Синхронизация масштаба между форматами
function syncScaleAcrossFormats(slideIndex, sizeKey, scale) {
    const allSlides = document.querySelectorAll(`.slide[data-slide-index="${slideIndex}"]`);
    const scaleKey = `${slideIndex}_${sizeKey}_scale`;
    imageScales[scaleKey] = scale;

    allSlides.forEach(slide => {
        const wrapper = slide.querySelector(`.uploaded-image-wrapper img[data-size-key="${sizeKey}"]`)?.closest('.uploaded-image-wrapper');
        if (wrapper && wrapper.classList.contains('free-positioning-active')) {
            // Применяем scale через transform
            wrapper.style.transform = `scale(${scale})`;
            wrapper.style.transformOrigin = '0 0';

            // Обновляем визуальные размеры в dataset
            const originalWidth = parseFloat(wrapper.dataset.originalWidth);
            const originalHeight = parseFloat(wrapper.dataset.originalHeight);

            if (originalWidth && originalHeight) {
                wrapper.dataset.visualWidth = originalWidth * scale;
                wrapper.dataset.visualHeight = originalHeight * scale;
            }
        }
    });
}

// Отключить режим свободного позиционирования
function disableFreePositioning(imageWrapper) {
    // Отключаем interact.js
    interact(imageWrapper).unset();

    // Удаляем визуальные ручки
    imageWrapper.querySelectorAll('.resize-handle').forEach(h => h.remove());

    // Сбрасываем стили и классы
    imageWrapper.style.position = '';
    imageWrapper.style.left = '';
    imageWrapper.style.top = '';
    imageWrapper.style.width = '';
    imageWrapper.style.height = '';
    imageWrapper.style.zIndex = '';
    imageWrapper.style.transform = '';
    imageWrapper.style.transformOrigin = '';
    imageWrapper.classList.remove('free-positioning-active');
    imageWrapper.draggable = true;

    // Очищаем data-атрибуты
    delete imageWrapper.dataset.originalWidth;
    delete imageWrapper.dataset.originalHeight;
}

// Переключение режима для всех изображений на слайде
function toggleFreePositioningMode(slideIndex, enable) {
    const allSlides = document.querySelectorAll(`.slide[data-slide-index="${slideIndex}"]`);

    allSlides.forEach(slide => {
        const container = slide.querySelector('.slide-image-container');
        const wrappers = slide.querySelectorAll('.uploaded-image-wrapper');

        if (enable) {
            // Включаем режим свободного позиционирования
            if (container) {
                container.style.border = 'none';
                container.style.padding = '0';
                container.style.display = 'block';
                container.style.position = 'absolute';
                container.style.top = '0';
                container.style.left = '0';
                container.style.right = '0';
                container.style.bottom = '0';
                container.style.height = '100%';
                container.style.width = '100%';
                container.style.zIndex = '100';
                container.style.pointerEvents = 'auto';
            }

            // Центрируем группу изображений как единое целое
            if (wrappers.length > 1) {
                centerImageGroup(wrappers, slide, slideIndex);
            } else {
                wrappers.forEach(wrapper => {
                    enableFreePositioning(wrapper, slideIndex);
                });
            }
        } else {
            // Отключаем режим
            if (container) {
                container.style.border = '';
                container.style.padding = '';
                container.style.display = 'flex';
                container.style.position = '';
                container.style.height = '';
                container.style.width = '';
                container.style.top = '';
                container.style.left = '';
                container.style.right = '';
                container.style.bottom = '';
                container.style.zIndex = '';
                container.style.pointerEvents = '';
            }

            wrappers.forEach(wrapper => {
                disableFreePositioning(wrapper);
            });
        }
    });
}

// Центрировать группу изображений
function centerImageGroup(wrappers, slide, slideIndex) {
    const slideRect = slide.getBoundingClientRect();
    const gap = 15; // Промежуток между изображениями

    // Сначала активируем все изображения чтобы получить их размеры
    wrappers.forEach(wrapper => {
        const img = wrapper.querySelector('img');
        const sizeKey = img?.dataset.sizeKey;
        if (!sizeKey) return;

        const scaleKey = `${slideIndex}_${sizeKey}_scale`;
        const savedScale = imageScales[scaleKey] || 1;

        wrapper.style.position = 'absolute';
        wrapper.style.zIndex = '50'; // Base z-index so images appear above content
        wrapper.classList.add('free-positioning-active');

        const originalWidth = wrapper.offsetWidth;
        const originalHeight = wrapper.offsetHeight;

        wrapper.dataset.originalWidth = originalWidth;
        wrapper.dataset.originalHeight = originalHeight;
        wrapper.dataset.visualWidth = originalWidth * savedScale;
        wrapper.dataset.visualHeight = originalHeight * savedScale;

        wrapper.style.transform = `scale(${savedScale})`;
        wrapper.style.transformOrigin = '0 0';
        wrapper.draggable = false;
    });

    // Вычисляем общую ширину группы
    let totalWidth = 0;
    let maxHeight = 0;

    wrappers.forEach(wrapper => {
        const visualWidth = parseFloat(wrapper.dataset.visualWidth);
        const visualHeight = parseFloat(wrapper.dataset.visualHeight);
        totalWidth += visualWidth;
        maxHeight = Math.max(maxHeight, visualHeight);
    });

    totalWidth += gap * (wrappers.length - 1);

    // Начальная позиция для центрирования группы
    let startX = (slideRect.width - totalWidth) / 2;
    const startY = (slideRect.height - maxHeight) / 2;

    // Размещаем изображения по горизонтали
    wrappers.forEach(wrapper => {
        const img = wrapper.querySelector('img');
        const sizeKey = img?.dataset.sizeKey;
        if (!sizeKey) return;

        const posKey = `${slideIndex}_${sizeKey}`;
        const visualWidth = parseFloat(wrapper.dataset.visualWidth);

        // Проверяем сохранённую позицию
        if (!imagePositions[posKey]) {
            const x = startX;
            const y = startY;

            wrapper.style.left = x + 'px';
            wrapper.style.top = y + 'px';

            imagePositions[posKey] = { x, y };
            startX += visualWidth + gap;
        } else {
            // Используем сохранённую позицию
            wrapper.style.left = imagePositions[posKey].x + 'px';
            wrapper.style.top = imagePositions[posKey].y + 'px';
        }

        // Настраиваем interact.js
        setupInteractJS(wrapper, slideIndex, sizeKey);
    });
}

// Сохранение позиций в localStorage
function saveImagePositions() {
    try {
        localStorage.setItem('imagePositions', JSON.stringify(imagePositions));
        localStorage.setItem('imageScales', JSON.stringify(imageScales));
    } catch (e) {
        console.warn('Failed to save image positions:', e);
    }
}

// Загрузка позиций из localStorage
function loadImagePositions() {
    try {
        const savedPos = localStorage.getItem('imagePositions');
        const savedScales = localStorage.getItem('imageScales');

        if (savedPos) {
            Object.assign(imagePositions, JSON.parse(savedPos));
        }
        if (savedScales) {
            Object.assign(imageScales, JSON.parse(savedScales));
        }
    } catch (e) {
        console.warn('Failed to load image positions:', e);
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    loadImagePositions();
});
