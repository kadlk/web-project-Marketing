// Функция для обновления списка изображений в панели
function updateImagePreview(preview, slideIndex, slideElement, additionalSlides) {
    preview.innerHTML = '';
    
    // Получаем все изображения со слайда
    const allImages = slideElement.querySelectorAll('.slide-image-container img, .uploaded-image-wrapper img');
    const imageList = document.createElement('div');
    imageList.className = 'image-list';
    imageList.style.display = 'flex';
    imageList.style.flexDirection = 'column';
    imageList.style.gap = '10px';
    imageList.style.maxHeight = '300px';
    imageList.style.overflowY = 'auto';
    
    if (allImages.length === 0) {
        const emptyMsg = document.createElement('div');
        emptyMsg.textContent = 'Нет изображений';
        emptyMsg.style.color = '#999';
        emptyMsg.style.textAlign = 'center';
        emptyMsg.style.padding = '20px';
        imageList.appendChild(emptyMsg);
    } else {
        allImages.forEach((img, idx) => {
            const imageItem = document.createElement('div');
            imageItem.className = 'image-item';
            imageItem.style.display = 'flex';
            imageItem.style.alignItems = 'center';
            imageItem.style.gap = '10px';
            imageItem.style.padding = '8px';
            imageItem.style.background = 'rgba(255, 255, 255, 0.05)';
            imageItem.style.borderRadius = '8px';
            imageItem.style.cursor = 'pointer';

            imageItem.addEventListener('click', (e) => {
                if (e.target.tagName === 'BUTTON' && e.target.textContent === '×') return; // Don't trigger if delete button is clicked
                e.stopPropagation();
                // Find visible container and this image on the slide
                // Use the first active slide (slide-1 or whatever is previewed)
                // Actually `slideElement` passed here is usually slide11
                const container = slideElement.querySelector('.slide-image-container');
                if (container) {
                    // We need to find the specific image element to get its sizeKey
                    // The img passed to this function is the one on the slide
                    showContainerSettingsPanel(container, slideIndex, img);
                } else {
                    // If there's no container, it's a single image directly on the slide
                    showContainerSettingsPanel(img.closest('.uploaded-image-wrapper'), slideIndex, img);
                }
            });
            
            const imgPreview = document.createElement('img');
            imgPreview.src = img.src;
            imgPreview.style.width = '60px';
            imgPreview.style.height = '60px';
            imgPreview.style.objectFit = 'cover';
            imgPreview.style.borderRadius = '4px';
            
            const replaceBtn = document.createElement('button');
            replaceBtn.textContent = '🔄';
            replaceBtn.style.background = '#3b82f6';
            replaceBtn.style.color = 'white';
            replaceBtn.style.border = 'none';
            replaceBtn.style.borderRadius = '4px';
            replaceBtn.style.width = '24px';
            replaceBtn.style.height = '24px';
            replaceBtn.style.cursor = 'pointer';
            replaceBtn.style.flexShrink = '0';
            replaceBtn.style.fontSize = '12px';
            replaceBtn.style.marginLeft = '4px';
            replaceBtn.title = 'Заменить изображение';

            replaceBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                replaceImageWithUpload(img, slideIndex, img.closest('.uploaded-image-wrapper'));
            });

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = '×';
            deleteBtn.style.background = '#ef4444';
            deleteBtn.style.color = 'white';
            deleteBtn.style.border = 'none';
            deleteBtn.style.borderRadius = '4px';
            deleteBtn.style.width = '24px';
            deleteBtn.style.height = '24px';
            deleteBtn.style.cursor = 'pointer';
            deleteBtn.style.flexShrink = '0';
            deleteBtn.title = 'Удалить изображение';

            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                saveStateForUndo();
                
                // Находим sizeKey изображения
                const sizeKey = img.dataset.sizeKey;
                const imageWrapper = img.closest('.uploaded-image-wrapper');
                
                // Удаляем из всех слайдов
                const allSlides = document.querySelectorAll('.slide');
                allSlides.forEach(slide => {
                    const relatedImg = slide.querySelector(`img[data-size-key="${sizeKey}"]`);
                    if (relatedImg) {
                        relatedImg.closest('.uploaded-image-wrapper')?.remove();
                    }
                });
                
                // Удаляем из slideImages
                if (slideImages[slideIndex]) {
                    const imgSrc = img.src;
                    slideImages[slideIndex] = slideImages[slideIndex].filter(imgData => imgData !== imgSrc);
                    if (slideImages[slideIndex].length === 0) {
                        delete slideImages[slideIndex];
                    }
                }
                
                // Удаляем размер
                if (sizeKey) {
                    delete imageSizes[sizeKey];
                }
                
                saveToLocalStorage();
                updateImagePreview(preview, slideIndex, slideElement, additionalSlides);
            });
            
            const buttonContainer = document.createElement('div');
            buttonContainer.style.display = 'flex';
            buttonContainer.style.gap = '4px';
            buttonContainer.style.flexShrink = '0';

            buttonContainer.appendChild(replaceBtn);
            buttonContainer.appendChild(deleteBtn);

            imageItem.appendChild(imgPreview);
            imageItem.appendChild(buttonContainer);
            imageList.appendChild(imageItem);
        });
    }
    
    preview.appendChild(imageList);
}

// Функция для вычисления оптимального размера изображения
function calculateOptimalImageSize(img, slideElement) {
    return new Promise((resolve) => {
        const checkSize = () => {
            if (!slideElement) {
                resolve(60);
                return;
            }
            
            const slideRect = slideElement.getBoundingClientRect();
            const slideWidth = slideRect.width;
            const slideHeight = slideRect.height;
            
            // Учитываем padding слайда (примерно 10% с каждой стороны)
            const padding = slideWidth * 0.2; // 20% отступы
            const availableWidth = slideWidth - padding;
            const availableHeight = slideHeight - padding;
            
            if (img.naturalWidth && img.naturalHeight) {
                const imgWidth = img.naturalWidth;
                const imgHeight = img.naturalHeight;
                
                // Вычисляем процент, чтобы изображение поместилось
                const widthRatio = (availableWidth / imgWidth) * 100;
                const heightRatio = (availableHeight / imgHeight) * 100;
                
                // Берем меньший процент, чтобы изображение точно поместилось
                const optimalSize = Math.min(widthRatio, heightRatio, 75); // максимум 75%
                
                resolve(Math.max(optimalSize, 20)); // минимум 20%
            } else {
                // Если размеры еще не загружены, используем дефолт
                resolve(60);
            }
        };
        
        if (img.complete && img.naturalWidth > 0) {
            checkSize();
        } else {
            img.onload = checkSize;
            img.onerror = () => resolve(60);
        }
    });
}

// Вспомогательная функция для создания контекстного меню изображения
function createImageContextMenu(img, imageWrapper, deleteBtn, slideIndex) {
    const contextMenu = document.createElement('div');
    contextMenu.className = 'image-context-menu';
    contextMenu.innerHTML = `
        <button class="menu-btn replace-btn">🔄 Заменить</button>
        <button class="menu-btn size-btn">📏 Изменить размер</button>
        <button class="menu-btn gap-btn">⚙️ Настройки контейнера</button>
        <button class="menu-btn delete-btn">🗑️ Удалить</button>
    `;
    contextMenu.style.display = 'none';

    // Показываем меню при клике на изображение
    img.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();

        // Убираем selected класс со всех остальных изображений
        document.querySelectorAll('.uploaded-image-wrapper.selected').forEach(wrapper => {
            if (wrapper !== imageWrapper) {
                wrapper.classList.remove('selected');
            }
        });

        // Добавляем selected класс текущему изображению
        imageWrapper.classList.add('selected');

        // Закрываем другие меню и панели
        document.querySelectorAll('.image-context-menu').forEach(menu => {
            if (menu !== contextMenu) menu.style.display = 'none';
        });
        document.querySelectorAll('.text-edit-panel').forEach(panel => {
            panel.style.display = 'none';
        });

        // Переключаем видимость меню
        if (contextMenu.style.display === 'none') {
            contextMenu.style.display = 'block';
            const rect = img.getBoundingClientRect();
            contextMenu.style.top = rect.top + 'px';
            contextMenu.style.left = (rect.right + 10) + 'px';

            // Если меню выходит за правый край, показываем слева
            if (rect.right + 200 > window.innerWidth) {
                contextMenu.style.left = (rect.left - 190) + 'px';
            }
        } else {
            contextMenu.style.display = 'none';
        }
    });

    // Кнопка замены изображения
    contextMenu.querySelector('.replace-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        contextMenu.style.display = 'none';
        replaceImageWithUpload(img, slideIndex, imageWrapper);
    });

    // Кнопки меню
    contextMenu.querySelector('.delete-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        contextMenu.style.display = 'none';
        deleteBtn.click();
    });

    contextMenu.querySelector('.size-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        contextMenu.style.display = 'none';
        showSizeControlPanel(img, slideIndex);
    });

    contextMenu.querySelector('.gap-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        contextMenu.style.display = 'none';
        const container = img.closest('.slide-image-container');
        if (container) {
            showContainerSettingsPanel(container, slideIndex, img);
        }
    });

    // Закрываем меню при клике вне его
    const closeMenuHandler = (e) => {
        if (!imageWrapper.contains(e.target) && !e.target.closest('.image-context-menu')) {
            contextMenu.style.display = 'none';
            document.removeEventListener('click', closeMenuHandler);
        }
    };

    // Используем setTimeout, чтобы клик, открывший меню, не закрыл его сразу
    setTimeout(() => {
        document.addEventListener('click', closeMenuHandler);
    }, 100);

    return contextMenu;
}

// Функция для замены изображения
function replaceImageWithUpload(img, slideIndex, imageWrapper) {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const sizeKey = img.dataset.sizeKey;
            const oldSrc = img.src;

            // Сохраняем размер
            const savedSize = imageSizes[sizeKey];

            // Обновляем src во всех слайдах
            const allSlides = document.querySelectorAll('.slide');
            allSlides.forEach(slide => {
                const relatedImg = slide.querySelector(`img[data-size-key="${sizeKey}"]`);
                if (relatedImg) {
                    relatedImg.src = event.target.result;
                    relatedImg.dataset.originalSrc = event.target.result;
                }
            });

            // Обновляем в slideImages хранилище
            if (slideImages[slideIndex]) {
                slideImages[slideIndex] = slideImages[slideIndex].map(src =>
                    src === oldSrc ? event.target.result : src
                );
            }

            // Сохраняем
            saveToLocalStorage();
            showNotification('✓ Изображение заменено', 'success');
        };
        reader.readAsDataURL(file);
    });

    fileInput.click();
}

// Функция для добавления изображения в слайд
function addImageToSlide(slideElement, imageSrc, slideIndex, replaceExisting = false, initialSize = null) {
    // Если нужно заменить существующее загруженное изображение
    if (replaceExisting) {
        const existingUploadedImg = slideElement.querySelector('.uploaded-image');
        if (existingUploadedImg) {
            existingUploadedImg.src = imageSrc;
            return existingUploadedImg;
        }
    }
    
    // Ищем контейнер для изображений или создаем новый
    let imageContainer = slideElement.querySelector('.slide-image-container');
    const allImages = slideElement.querySelectorAll('.slide-image');
    
    // Создаем обертку для изображения с контролами
    const imageWrapper = document.createElement('div');
    imageWrapper.className = 'uploaded-image-wrapper';
    
    const img = document.createElement('img');
    img.src = imageSrc;
    img.alt = 'Загруженное изображение';
    img.className = 'slide-image uploaded-image';
    
    // Устанавливаем размер
    const sizeKey = `${slideIndex}_${imageSrc.substring(0, 50)}`;
    let savedSize = initialSize || imageSizes[sizeKey];
    
    // Если размер не задан, вычисляем оптимальный
    if (!savedSize) {
        calculateOptimalImageSize(img, slideElement).then(size => {
            savedSize = size;
            imageSizes[sizeKey] = size;
            img.style.setProperty('max-width', size + '%', 'important');
            img.style.setProperty('max-height', 'none', 'important');
            img.style.setProperty('width', 'auto', 'important');
            
            // Обновляем во всех связанных слайдах (все форматы)
            const allSlides = document.querySelectorAll('.slide');
            allSlides.forEach(slide => {
                const relatedImg = slide.querySelector(`img[data-size-key="${sizeKey}"]`);
                if (relatedImg) {
                    relatedImg.style.setProperty('max-width', size + '%', 'important');
                    relatedImg.style.setProperty('max-height', 'none', 'important');
                    relatedImg.style.setProperty('width', 'auto', 'important');
                }
            });
        });
        savedSize = 60; // Временный размер
    }
    
    imageSizes[sizeKey] = savedSize;
    img.style.setProperty('max-width', savedSize + '%', 'important');
    img.style.setProperty('max-height', 'none', 'important');
    img.style.setProperty('width', 'auto', 'important');
    img.dataset.sizeKey = sizeKey;
    img.dataset.originalSrc = imageSrc;
    
    // Кнопка удаления (скрыта по умолчанию)
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-image-btn';
    deleteBtn.textContent = '×';
    deleteBtn.title = 'Удалить изображение';
    deleteBtn.style.display = 'none';
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        saveStateForUndo();
        imageWrapper.remove();
        // Удаляем из всех связанных слайдов (все форматы)
        const allSlides = document.querySelectorAll('.slide');
        allSlides.forEach(slide => {
            const wrapper = slide.querySelector(`.uploaded-image-wrapper img[data-size-key="${sizeKey}"]`);
            if (wrapper) {
                wrapper.closest('.uploaded-image-wrapper').remove();
            }
        });
        // Удаляем размер из хранилища
        delete imageSizes[sizeKey];
    });
    
    // Создаем контекстное меню с помощью новой функции
    const contextMenu = createImageContextMenu(img, imageWrapper, deleteBtn, slideIndex);
    
    imageWrapper.appendChild(img);
    imageWrapper.appendChild(deleteBtn);
    imageWrapper.appendChild(contextMenu);
    
    // Drag and Drop
    imageWrapper.draggable = true;
    imageWrapper.dataset.slideIndex = slideIndex;
    setupImageDragDrop(imageWrapper, slideIndex);
    
    // Всегда используем контейнер для изображений (для центрирования и управления отступами)
    if (!imageContainer) {
        // Создаем новый контейнер
        imageContainer = document.createElement('div');
        imageContainer.className = 'slide-image-container';
        imageContainer.dataset.slideIndex = slideIndex;
        
        // Устанавливаем gap из сохраненных данных или по умолчанию
        const containerGapKey = `gap_${slideIndex}`;
        const savedGap = imageGaps[containerGapKey] || 15;
        imageContainer.style.gap = savedGap + 'px';
        
        // Применяем сохраненные настройки контейнера
        const settingsKey = `container_${slideIndex}`;
        const savedSettings = containerSettings[settingsKey];
        if (savedSettings) {
            imageContainer.style.justifyContent = savedSettings.align || 'center';
            imageContainer.style.borderRadius = (savedSettings.radius || 0) + 'px';
            // Применяем округление к изображениям
            const images = imageContainer.querySelectorAll('img');
            images.forEach(img => {
                img.style.borderRadius = (savedSettings.radius || 0) + 'px';
            });
        }
        
        // Перемещаем все существующие изображения в контейнер
        allImages.forEach(existingImg => {
            const existingWrapper = existingImg.closest('.uploaded-image-wrapper');
            if (existingWrapper && existingWrapper.parentElement !== imageContainer) {
                // Находим место для вставки контейнера
                const insertBefore = existingWrapper;
                existingWrapper.parentNode.insertBefore(imageContainer, insertBefore);
                imageContainer.appendChild(existingWrapper);
            }
        });
        
        // Если контейнер еще не добавлен в слайд, добавляем его
        if (!imageContainer.parentElement) {
            // Find content wrapper or use slide element
            const contentWrapper = slideElement.querySelector('.slide-content-wrapper') || slideElement;
            
            // Вставляем контейнер в подходящее место
            const title = contentWrapper.querySelector('h1') || contentWrapper.querySelector('h2');
            const subtitle = contentWrapper.querySelector('.subtitle');
            const paragraph = contentWrapper.querySelector('p');
            const cta = contentWrapper.querySelector('.cta');
            
            // Simply append to content wrapper - let CSS handle layout
            contentWrapper.appendChild(imageContainer);
        }
    }
    
    // Добавляем новое изображение в контейнер
    if (imageContainer.dataset && imageContainer.style.flexDirection === 'column') {
        imageContainer.appendChild(imageWrapper);
    } else {
       imageContainer.appendChild(imageWrapper);
    }
    
    return img;
}

// Функция для добавления изображения с контролами (для существующих из JSON)
async function addImageWithControls(container, imageSrc, alt, slideIndex, savedSize = null) {
    const imageWrapper = document.createElement('div');
    imageWrapper.className = 'uploaded-image-wrapper';
    imageWrapper.draggable = true;
    imageWrapper.dataset.slideIndex = slideIndex;
    
    const img = document.createElement('img');
    img.src = imageSrc;
    img.alt = alt;
    img.className = 'slide-image';

    // Устанавливаем размер
    const sizeKey = `${slideIndex}_${String(imageSrc || '').substring(0, 50)}`;
    let finalSize = savedSize;
    
    // Если размер не задан, вычисляем оптимальный
    if (!finalSize) {
        const slideElement = container.closest('.slide') || document.querySelector(`.slide-wrapper:nth-child(${slideIndex + 1}) .slide`);
        if (slideElement) {
            finalSize = await calculateOptimalImageSize(img, slideElement);
        } else {
            finalSize = 60;
        }
    }
    
    imageSizes[sizeKey] = finalSize;
    img.style.setProperty('max-width', finalSize + '%', 'important');
    img.style.setProperty('max-height', 'none', 'important');
    img.style.setProperty('width', 'auto', 'important');
    img.dataset.sizeKey = sizeKey;
    img.dataset.originalSrc = imageSrc;
    
    // Кнопка удаления (скрыта по умолчанию)
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-image-btn';
    deleteBtn.textContent = '×';
    deleteBtn.title = 'Удалить изображение';
    deleteBtn.style.display = 'none';
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        saveStateForUndo();
        imageWrapper.remove();
        // Удаляем из всех связанных слайдов (все форматы)
        const allSlides = document.querySelectorAll('.slide');
        allSlides.forEach(slide => {
            const wrapper = slide.querySelector(`.uploaded-image-wrapper img[data-size-key="${sizeKey}"]`);
            if (wrapper) {
                wrapper.closest('.uploaded-image-wrapper').remove();
            }
        });
        // Удаляем размер из хранилища
        delete imageSizes[sizeKey];
    });
    
    // Создаем контекстное меню с помощью новой функции
    const contextMenu = createImageContextMenu(img, imageWrapper, deleteBtn, slideIndex);
    
    imageWrapper.appendChild(img);
    imageWrapper.appendChild(deleteBtn);
    imageWrapper.appendChild(contextMenu);
    
    // Drag and Drop
    imageWrapper.draggable = true;
    imageWrapper.dataset.slideIndex = slideIndex;
    setupImageDragDrop(imageWrapper, slideIndex);
    
    container.appendChild(imageWrapper);
}

// Функция для создания кнопки загрузки изображения
function createImageUploadButton(slideIndex, slideElement, additionalSlides = []) {
    const wrapper = document.createElement('div');
    wrapper.className = 'slide-image-upload-wrapper';
    wrapper.dataset.slideIndex = slideIndex;
    
    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.gap = '10px';
    header.style.marginBottom = '10px';
    
    const uploadBtn = document.createElement('button');
    uploadBtn.className = 'image-upload-btn';
    uploadBtn.textContent = '📷 Загрузить';
    uploadBtn.type = 'button';
    uploadBtn.style.flex = '1';
    
    const settingsBtn = document.createElement('button');
    settingsBtn.className = 'image-settings-btn';
    settingsBtn.textContent = '⚙️ Настройки';
    settingsBtn.type = 'button';
    settingsBtn.title = 'Настройки контейнера изображений';
    
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    fileInput.multiple = true; // Разрешаем множественный выбор
    
    const preview = document.createElement('div');
    preview.className = 'image-preview';
    
    // Если есть сохраненные изображения, показываем их и добавляем в слайд
    if (slideImages[slideIndex]) {
        const images = Array.isArray(slideImages[slideIndex]) ? slideImages[slideIndex] : [slideImages[slideIndex]];
        images.forEach((imgData) => {
            addImageToSlide(slideElement, imgData, slideIndex);
            additionalSlides.forEach(slide => {
                addImageToSlide(slide, imgData, slideIndex);
            });
        });
    }
    
    // Обновляем preview после небольшой задержки, чтобы изображения успели добавиться
    setTimeout(() => {
        updateImagePreview(preview, slideIndex, slideElement, additionalSlides);
    }, 100);
    
    uploadBtn.addEventListener('click', () => {
        fileInput.click();
    });
    
    fileInput.addEventListener('change', async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;
        
        saveStateForUndo();
        
        for (const file of files) {
            const reader = new FileReader();
            await new Promise((resolve) => {
                reader.onload = async (event) => {
                    const imageData = event.target.result; // base64
                    
                    // Сохраняем изображение (может быть несколько)
                    if (!slideImages[slideIndex]) {
                        slideImages[slideIndex] = [];
                    }
                    if (!Array.isArray(slideImages[slideIndex])) {
                        slideImages[slideIndex] = [slideImages[slideIndex]];
                    }
                    slideImages[slideIndex].push(imageData);
                    
                    // Создаем временное изображение для вычисления размера
                    const tempImg = new Image();
                    tempImg.src = imageData;
                    
                    // Вычисляем оптимальный размер для основного слайда
                    const optimalSize = await calculateOptimalImageSize(tempImg, slideElement);
                    const sizeKey = `${slideIndex}_${imageData.substring(0, 50)}`;
                    imageSizes[sizeKey] = optimalSize;
                    
                    // Добавляем изображение в основной слайд с оптимальным размером
                    addImageToSlide(slideElement, imageData, slideIndex, false, optimalSize);
                    
                    // Добавляем изображение во все дополнительные слайды (для синхронизации форматов)
                    additionalSlides.forEach(slide => {
                        addImageToSlide(slide, imageData, slideIndex, false, optimalSize);
                    });
                    
                    resolve();
                };
                reader.readAsDataURL(file);
            });
        }
        
        saveToLocalStorage();
        updateImagePreview(preview, slideIndex, slideElement, additionalSlides);
        fileInput.value = ''; // Сбрасываем input
    });
    
    // Обработчик кнопки настроек
    settingsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        console.log('Settings button clicked for slide index:', slideIndex);
        const container = slideElement.querySelector('.slide-image-container');
        console.log('Container found:', !!container);
        // Always open panel, passing container if it exists, or just slideIndex and element
        showContainerSettingsPanel(container, slideIndex, null, slideElement);
    });
    
    header.appendChild(uploadBtn);
    header.appendChild(settingsBtn);
    wrapper.appendChild(header);
    wrapper.appendChild(fileInput);
    wrapper.appendChild(preview);
    
    // Обновляем preview при изменениях на слайде
    const observer = new MutationObserver(() => {
        updateImagePreview(preview, slideIndex, slideElement, additionalSlides);
    });
    observer.observe(slideElement, { childList: true, subtree: true });
    
    return wrapper;
}
