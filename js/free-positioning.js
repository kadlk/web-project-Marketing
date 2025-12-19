// Свободное позиционирование изображений с использованием interact.js
// ПОЛНОСТЬЮ ПЕРЕРАБОТАННАЯ АРХИТЕКТУРА: Изображения удаляются из flex контейнера
// и помещаются в независимый слой позиционирования на уровне слайда

// Хранилище позиций и размеров изображений
const imagePositions = {};
const imageScales = {};
const freePositioningLayers = {}; // Хранилище слоев позиционирования

// Включить режим свободного позиционирования для всех изображений на слайде
function enableFreePositioning(slideIndex) {
    const allSlides = document.querySelectorAll(`.slide[data-slide-index="${slideIndex}"]`);

    allSlides.forEach(slide => {
        // Создаем независимый слой позиционирования на уровне слайда
        let freePositioningLayer = slide.querySelector('.free-positioning-layer');
        if (!freePositioningLayer) {
            freePositioningLayer = document.createElement('div');
            freePositioningLayer.className = 'free-positioning-layer';
            freePositioningLayer.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 200;
            `;
            // Вставляем слой после контента, но перед логотипом/водяным знаком
            const contentWrapper = slide.querySelector('.slide-content-wrapper');
            if (contentWrapper) {
                contentWrapper.parentNode.insertBefore(freePositioningLayer, contentWrapper.nextSibling);
            } else {
                slide.appendChild(freePositioningLayer);
            }
        }

        const container = slide.querySelector('.slide-image-container');
        if (!container) return;

        const imageWrappers = Array.from(container.querySelectorAll('.uploaded-image-wrapper'));

        imageWrappers.forEach(wrapper => {
            const img = wrapper.querySelector('img');
            const sizeKey = img?.dataset.sizeKey;
            if (!sizeKey) return;

            // КЛЮЧЕВОЙ ШАГ: Клонируем обёртку и добавляем в слой позиционирования
            const clonedWrapper = wrapper.cloneNode(true);
            clonedWrapper.className = 'free-positioned-image';
            clonedWrapper.style.cssText = `
                position: absolute;
                pointer-events: auto;
                z-index: 50;
                cursor: grab;
            `;

            // Загружаем сохранённую позицию и масштаб
            const posKey = `${slideIndex}_${sizeKey}`;
            const scaleKey = `${slideIndex}_${sizeKey}_scale`;
            const savedScale = imageScales[scaleKey] || 1;

            // Получаем размеры из клонированного элемента
            const originalWidth = wrapper.offsetWidth;
            const originalHeight = wrapper.offsetHeight;

            clonedWrapper.dataset.originalWidth = originalWidth;
            clonedWrapper.dataset.originalHeight = originalHeight;
            clonedWrapper.dataset.slideIndex = slideIndex;
            clonedWrapper.dataset.sizeKey = sizeKey;

            // Устанавливаем позицию и масштаб
            const visualWidth = originalWidth * savedScale;
            const visualHeight = originalHeight * savedScale;

            let x, y;
            if (imagePositions[posKey]) {
                x = imagePositions[posKey].x;
                y = imagePositions[posKey].y;
            } else {
                // Центрируем по умолчанию
                const slideRect = slide.getBoundingClientRect();
                const slideComputedStyle = window.getComputedStyle(slide);
                const slideRelativeX = slide.offsetLeft;
                const slideRelativeY = slide.offsetTop;

                x = (slide.offsetWidth - visualWidth) / 2;
                y = (slide.offsetHeight - visualHeight) / 2;
                imagePositions[posKey] = { x, y };
            }

            clonedWrapper.style.left = x + 'px';
            clonedWrapper.style.top = y + 'px';
            clonedWrapper.style.transform = `scale(${savedScale})`;
            clonedWrapper.style.transformOrigin = '0 0';
            clonedWrapper.style.width = originalWidth + 'px';
            clonedWrapper.style.height = originalHeight + 'px';

            // Добавляем в слой позиционирования
            freePositioningLayer.appendChild(clonedWrapper);

            // Инициализируем interact.js для свободного перетаскивания
            setupFreePositioningInteract(clonedWrapper, slideIndex, sizeKey, slide);

            // Скрываем оригинальную обёртку в контейнере
            wrapper.style.display = 'none';
        });

        // Сохраняем ссылку на слой
        const layerKey = `layer_${slideIndex}`;
        freePositioningLayers[layerKey] = freePositioningLayer;
    });
}

// НОВАЯ ФУНКЦИЯ: Настройка interact.js для свободного позиционирования
// БЕЗ ОГРАНИЧЕНИЙ на движение и перетаскивание за границы слайда
function setupFreePositioningInteract(imageWrapper, slideIndex, sizeKey, slide) {
    const posKey = `${slideIndex}_${sizeKey}`;
    const scaleKey = `${slideIndex}_${sizeKey}_scale`;

    // КЛЮЧЕВАЯ РАЗНИЦА: Нет никаких modifiers/restriction
    // Элемент может двигаться абсолютно свободно
    interact(imageWrapper)
        .draggable({
            inertia: false,
            listeners: {
                start(event) {
                    imageWrapper.style.opacity = '0.8';
                    imageWrapper.style.zIndex = '1000';
                    imageWrapper.style.cursor = 'grabbing';
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

                        const slideWidth = slide.offsetWidth;
                        const slideHeight = slide.offsetHeight;
                        const wrapperWidth = imageWrapper.offsetWidth;
                        const wrapperHeight = imageWrapper.offsetHeight;

                        const slideCenter = {
                            x: (slideWidth - wrapperWidth) / 2,
                            y: (slideHeight - wrapperHeight) / 2
                        };

                        const snapThreshold = 30;

                        // Snap по X
                        if (Math.abs(x - slideCenter.x) < snapThreshold) {
                            x = slideCenter.x;
                            isSnapped = true;
                        }

                        // Snap по Y
                        if (Math.abs(y - slideCenter.y) < snapThreshold) {
                            y = slideCenter.y;
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
                    imageWrapper.style.zIndex = '50';
                    imageWrapper.style.cursor = 'grab';
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

// Оставляем старую функцию для обратной совместимости
function setupInteractJS(imageWrapper, slideIndex, sizeKey) {
    const slide = imageWrapper.closest('.slide');
    if (!slide) return;

    // Перенаправляем на новую функцию
    setupFreePositioningInteract(imageWrapper, slideIndex, sizeKey, slide);
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
        // Ищем элемент в слое свободного позиционирования
        const freePositioningLayer = slide.querySelector('.free-positioning-layer');
        if (freePositioningLayer) {
            const wrapper = freePositioningLayer.querySelector(`.free-positioned-image img[data-size-key="${sizeKey}"]`)?.closest('.free-positioned-image');
            if (wrapper) {
                wrapper.style.left = x + 'px';
                wrapper.style.top = y + 'px';
            }
        }
    });
}

// Синхронизация масштаба между форматами
function syncScaleAcrossFormats(slideIndex, sizeKey, scale) {
    const allSlides = document.querySelectorAll(`.slide[data-slide-index="${slideIndex}"]`);
    const scaleKey = `${slideIndex}_${sizeKey}_scale`;
    imageScales[scaleKey] = scale;

    allSlides.forEach(slide => {
        // Ищем элемент в слое свободного позиционирования
        const freePositioningLayer = slide.querySelector('.free-positioning-layer');
        if (freePositioningLayer) {
            const wrapper = freePositioningLayer.querySelector(`.free-positioned-image img[data-size-key="${sizeKey}"]`)?.closest('.free-positioned-image');
            if (wrapper) {
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

// НОВАЯ ФУНКЦИЯ: Переключение режима свободного позиционирования
// Использует независимый слой позиционирования вместо переопределения стилей контейнера
function toggleFreePositioningMode(slideIndex, enable) {
    const allSlides = document.querySelectorAll(`.slide[data-slide-index="${slideIndex}"]`);

    allSlides.forEach(slide => {
        const container = slide.querySelector('.slide-image-container');
        const wrappers = slide.querySelectorAll('.uploaded-image-wrapper');

        if (enable) {
            // ВКЛЮЧАЕМ свободное позиционирование
            // Используем новую архитектуру с независимым слоем
            enableFreePositioning(slideIndex);

            // Скрываем оригинальный контейнер или скрываем контейнер визуально
            if (container) {
                container.style.visibility = 'hidden';
                container.style.pointerEvents = 'none';
                container.style.height = '0';
                container.style.margin = '0';
                container.style.padding = '0';
            }
        } else {
            // ОТКЛЮЧАЕМ свободное позиционирование
            // Восстанавливаем контейнер и удаляем слой позиционирования
            const layerKey = `layer_${slideIndex}`;
            const freePositioningLayer = freePositioningLayers[layerKey];

            if (freePositioningLayer) {
                freePositioningLayer.remove();
                delete freePositioningLayers[layerKey];
            }

            // Восстанавливаем видимость контейнера
            if (container) {
                container.style.visibility = 'visible';
                container.style.pointerEvents = 'auto';
                container.style.height = 'auto';
                container.style.margin = '15px 0';
                container.style.padding = '10px';
            }

            // Восстанавливаем видимость обёрток
            wrappers.forEach(wrapper => {
                wrapper.style.display = '';
                // Отключаем interact.js
                interact(wrapper).unset();
                // Удаляем ручки resize
                wrapper.querySelectorAll('.resize-handle').forEach(h => h.remove());
            });
        }
    });
}

// Старая функция centerImageGroup удалена - используется новая архитектура с независимым слоем позиционирования

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

// Вспомогательная функция для поиска обёртки с изображением
// Ищет как в flex контейнере, так и в слое свободного позиционирования
function findImageWrapperBySizeKey(slide, sizeKey) {
    if (!slide || !sizeKey) return null;

    // Сначала ищем в слое свободного позиционирования
    const freeLayer = slide.querySelector('.free-positioning-layer');
    if (freeLayer) {
        const freeImage = freeLayer.querySelector(`img[data-size-key="${sizeKey}"]`);
        if (freeImage) {
            return freeImage.closest('.free-positioned-image');
        }
    }

    // Если не найдено в свободном слое, ищем в flex контейнере
    const flexImage = slide.querySelector(`.uploaded-image-wrapper img[data-size-key="${sizeKey}"]`);
    if (flexImage) {
        return flexImage.closest('.uploaded-image-wrapper');
    }

    return null;
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    loadImagePositions();
});
