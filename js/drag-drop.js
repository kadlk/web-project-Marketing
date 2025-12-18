// Инициализация drag and drop для всех слайдов при генерации
function initDragDropForSlides(slideIndex) {
    const allSlides = document.querySelectorAll(`.slide-wrapper:nth-child(${slideIndex + 1}) .slide`);
    allSlides.forEach((slide) => {
        if (slide) {
            makeDropZone(slide, slideIndex);
            initSortableForImageContainer(slide, slideIndex);
        }
    });
}

// Инициализация Sortable.js для контейнеров изображений
function initSortableForImageContainer(slide, slideIndex) {
    const imageContainer = slide.querySelector('.slide-image-container');
    if (!imageContainer) return;

    // Проверяем, не инициализирован ли уже Sortable
    if (imageContainer.sortableInstance) return;

    const sortable = Sortable.create(imageContainer, {
        animation: 200,
        ghostClass: 'sortable-ghost',
        dragClass: 'sortable-drag',
        handle: '.uploaded-image-wrapper',
        draggable: '.uploaded-image-wrapper',
        onEnd: function(evt) {
            // Синхронизируем порядок с другими форматами слайда
            syncImageOrderAcrossFormats(slideIndex, imageContainer);
        }
    });

    imageContainer.sortableInstance = sortable;
}

// Синхронизация порядка изображений между форматами
function syncImageOrderAcrossFormats(slideIndex, sourceContainer) {
    const sourceWrappers = Array.from(sourceContainer.querySelectorAll('.uploaded-image-wrapper'));
    const sizeKeys = sourceWrappers.map(w => w.querySelector('img')?.dataset.sizeKey).filter(Boolean);

    // Находим все слайды с таким же индексом
    const allSlides = document.querySelectorAll(`.slide[data-slide-index="${slideIndex}"]`);

    allSlides.forEach(slide => {
        const container = slide.querySelector('.slide-image-container');
        if (!container || container === sourceContainer) return;

        // Переупорядочиваем элементы в соответствии с новым порядком
        sizeKeys.forEach(sizeKey => {
            const wrapper = container.querySelector(`.uploaded-image-wrapper img[data-size-key="${sizeKey}"]`)?.closest('.uploaded-image-wrapper');
            if (wrapper) {
                container.appendChild(wrapper);
            }
        });
    });
}

// Функция для настройки drag and drop изображений
function setupImageDragDrop(imageWrapper, slideIndex) {
    imageWrapper.addEventListener('dragstart', (e) => {
        e.stopPropagation();
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', imageWrapper.outerHTML);
        e.dataTransfer.setData('text/plain', imageWrapper.querySelector('img').dataset.sizeKey);
        imageWrapper.style.opacity = '0.5';
        imageWrapper.classList.add('dragging');
        draggedElement = imageWrapper;
    });
    
    imageWrapper.addEventListener('dragend', (e) => {
        imageWrapper.style.opacity = '1';
        imageWrapper.classList.remove('dragging');
        document.querySelectorAll('.drop-zone-active').forEach(zone => {
            zone.classList.remove('drop-zone-active');
        });
    });
}

let draggedElement = null;

const dropZoneHandlers = new WeakMap();

function makeDropZone(element, slideIndex) {
    // Проверяем, не добавлены ли уже обработчики
    if (dropZoneHandlers.has(element)) {
        return;
    }
    
    const dragoverHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer) {
            e.dataTransfer.dropEffect = 'move';
        }
        element.classList.add('drop-zone-active');
    };
    
    const dragleaveHandler = (e) => {
        if (!element.contains(e.relatedTarget)) {
            element.classList.remove('drop-zone-active');
        }
    };
    
    const dropHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();
        element.classList.remove('drop-zone-active');
        
        if (draggedElement && draggedElement.parentNode) {
            const afterElement = getDragAfterElement(element, e.clientY);
            
            if (afterElement == null) {
                element.appendChild(draggedElement);
            } else {
                element.insertBefore(draggedElement, afterElement);
            }
            
            // Синхронизируем с другими слайдами (все форматы)
            const slideWrapper = element.closest('.slide-wrapper');
            if (slideWrapper) {
                const allSlides = slideWrapper.querySelectorAll('.slide');
                allSlides.forEach(slide => {
                    if (slide !== element && draggedElement) {
                        const sizeKey = draggedElement.querySelector('img')?.dataset.sizeKey;
                        if (sizeKey) {
                            const relatedWrapper = slide.querySelector(`.uploaded-image-wrapper img[data-size-key="${sizeKey}"]`);
                            if (relatedWrapper) {
                                const relatedWrapperParent = relatedWrapper.closest('.uploaded-image-wrapper');
                                const afterElementRelated = getDragAfterElement(slide, e.clientY);
                                if (afterElementRelated == null) {
                                    slide.appendChild(relatedWrapperParent);
                                } else {
                                    slide.insertBefore(relatedWrapperParent, afterElementRelated);
                                }
                            }
                        }
                    }
                });
            }
        }
    };
    
    element.addEventListener('dragover', dragoverHandler);
    element.addEventListener('dragleave', dragleaveHandler);
    element.addEventListener('drop', dropHandler);
    
    dropZoneHandlers.set(element, { dragoverHandler, dragleaveHandler, dropHandler });
}

function getDragAfterElement(container, y) {
    // Получаем все элементы, которые могут быть точками вставки
    const children = [...container.children].filter(child => {
        // Исключаем абсолютно позиционированные элементы (логотип, номер слайда, водяной знак)
        return !child.classList.contains('logo') && 
               !child.classList.contains('slide-number') &&
               !child.classList.contains('emoji') &&
               child.tagName !== 'STYLE';
    });
    
    return children.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}
