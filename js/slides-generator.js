// Функция для масштабирования контента слайда
function fitSlideContent(slide) {
    const wrapper = slide.querySelector('.slide-content-wrapper');
    if (!wrapper) return;
    
    // Сбрасываем масштаб перед измерением
    wrapper.style.transform = 'none';
    wrapper.style.width = '100%';
    
    // Получаем доступную высоту контента (высота слайда минус паддинги)
    const slideStyle = window.getComputedStyle(slide);
    const paddingTop = parseFloat(slideStyle.paddingTop);
    const paddingBottom = parseFloat(slideStyle.paddingBottom);
    const availableHeight = slide.clientHeight - paddingTop - paddingBottom;
    
    // Получаем реальную высоту контента
    const contentHeight = wrapper.scrollHeight;
    
    // Если контент не влазит
    if (contentHeight > availableHeight) {
        const scale = availableHeight / contentHeight;
        // Ограничиваем минимальный масштаб, чтобы не было слишком мелко (по желанию, но пользователь просил "всё")
        // scale = Math.max(scale, 0.5); 
        
        // Применяем масштаб
        // Используем transform-origin: center center, так как align-items: center
        // Но для вертикального переполнения лучше top center, если контент прижат к верху?
        // В стилях .slide есть padding, и justify-content: center.
        // Если мы скэйлим, контент уменьшается.
        wrapper.style.transform = `scale(${scale * 0.95})`; // Чуть меньше для запаса
        wrapper.style.transformOrigin = 'center center';
    }
}

// Функция для создания контейнера с изображениями
function createImageContainer(slideData, slideIndex) {
    const container = document.createElement('div');
    container.className = 'slide-image-container';
    container.dataset.slideIndex = slideIndex;

    // Применяем настройки контейнера из JSON или значения по умолчанию
    const containerSettingsData = slideData.containerSettings || {};
    const gap = containerSettingsData.gap || 15;
    const align = containerSettingsData.align || 'center';
    const direction = containerSettingsData.direction || 'row';
    const radius = containerSettingsData.radius || 0;

    container.style.gap = gap + 'px';
    container.style.flexDirection = direction;
    container.style.borderRadius = radius + 'px';

    // Сохраняем в dataset для правильной работы панели настроек
    container.dataset.justifyContent = align;
    container.dataset.direction = direction;

    // Применяем выравнивание в зависимости от direction
    if (direction === 'row') {
        container.style.justifyContent = align;
        container.style.alignItems = 'center';
    } else { // column
        container.style.alignItems = 'center';
        container.style.justifyContent = align;
    }

    const preset = containerSettingsData.preset;
    container.classList.remove('layout-side', 'layout-top', 'layout-bottom');
    if (preset === 'image-left' || preset === 'image-right') {
        container.classList.add('layout-side');
    } else if (preset === 'image-top') {
        container.classList.add('layout-top');
    } else if (preset === 'image-bottom') {
        container.classList.add('layout-bottom');
    }

    // Сохраняем настройки контейнера в глобальное хранилище для всех форматов
    const settingsKey11 = `container_${slideIndex}_1-1`;
    const settingsKey916 = `container_${slideIndex}_9-16`;
    const settingsKey45 = `container_${slideIndex}_4-5`;

    containerSettings[settingsKey11] = {
        gap: gap,
        align: align,
        direction: direction,
        radius: radius,
        preset: preset
    };
    containerSettings[settingsKey916] = {
        gap: gap,
        align: align,
        direction: direction,
        radius: radius,
        preset: preset
    };
    containerSettings[settingsKey45] = {
        gap: gap,
        align: align,
        direction: direction,
        radius: radius,
        preset: preset
    };

    slideData.images.forEach(imgData => {
        // Support both 'src' (new) and 'url' (old) formats
        const imageSrc = imgData.src || imgData.url;
        if (imageSrc && typeof imageSrc === 'string') {
            // Create temporary slide element for addImageToSlide
            const tempSlide = document.createElement('div');
            tempSlide.className = 'slide';
            tempSlide.appendChild(container);
            addImageToSlide(tempSlide, imageSrc, slideIndex, false, imgData.size || null);
        }
    });

    // Применяем borderRadius к изображениям
    const containerImages = container.querySelectorAll('img');
    containerImages.forEach(img => {
        img.style.borderRadius = radius + 'px';
    });

    return container;
}

// Функция для создания слайда из JSON
function createSlideFromJSON(slideData, slideIndex, totalSlides, logo, watermark) {
    const slide = document.createElement('div');
    slide.className = `slide slide-${slideData.id}`;
    slide.style.background = createBackgroundStyle(slideData.background);
    
    // Логотип (вне масштабируемой области)
    if (logo) {
        const logoImg = document.createElement('img');
        logoImg.src = logo;
        logoImg.alt = 'Logo';
        logoImg.className = 'logo';
        logoImg.style.cursor = 'pointer';
        logoImg.title = 'Кликните для настройки логотипа';
        
        // Применяем сохраненные настройки логотипа
        const projectId = projectsData.find(p => p.logo === logo)?.id || currentProjectId;
        if (projectId && logoSettings[projectId]) {
            const settings = logoSettings[projectId];
            const slideHeight = slide.offsetHeight;
            const slideWidth = slide.offsetWidth;

            // Процентная система (новое)
            if (settings.heightPercent !== undefined) {
                logoImg.style.height = (slideHeight * settings.heightPercent / 100) + 'px';
            }
            if (settings.topPercent !== undefined) {
                logoImg.style.top = (slideHeight * settings.topPercent / 100) + 'px';
            }
            if (settings.leftPercent !== undefined) {
                logoImg.style.left = (slideWidth * settings.leftPercent / 100) + 'px';
            }

            // Обратная совместимость со старой системой в пикселях
            if (settings.heightPercent === undefined && settings.height) {
                logoImg.style.height = settings.height + 'px';
            }
            if (settings.topPercent === undefined && settings.top !== undefined) {
                logoImg.style.top = settings.top + 'px';
            }
            if (settings.leftPercent === undefined && settings.left !== undefined) {
                logoImg.style.left = settings.left + 'px';
            }

            if (settings.opacity !== undefined) logoImg.style.opacity = settings.opacity;
            if (settings.shadow) logoImg.style.filter = `drop-shadow(${settings.shadow})`;
            if (settings.border && settings.borderWidth > 0) {
                logoImg.style.border = `${settings.borderWidth}px solid ${settings.borderColor || '#ffffff'}`;
                logoImg.style.borderRadius = (settings.borderRadius || 0) + 'px';
            }
        }
        
        // Обработчик клика для открытия панели настроек
        logoImg.addEventListener('click', (e) => {
            e.stopPropagation();
            const projectId = projectsData.find(p => p.logo === logo)?.id || currentProjectId;
            if (projectId) {
                showLogoSettingsPanel(projectId);
            }
        });
        
        slide.appendChild(logoImg);
    }
    
    // Номер слайда (вне масштабируемой области)
    const slideNumber = document.createElement('div');
    slideNumber.className = 'slide-number';
    slideNumber.textContent = `${slideData.id}/${totalSlides}`;
    slideNumber.style.cursor = 'pointer';
    slideNumber.title = 'Настроить номер слайда';
    slideNumber.addEventListener('click', (e) => {
        e.stopPropagation();
        showSlideNumberSettingsPanel();
    });
    
    // Apply initial settings if available (visual default)
    if (slideNumberSettings && slideNumberSettings.fontSize) {
         slideNumber.style.fontSize = slideNumberSettings.fontSize + 'px';
         slideNumber.style.opacity = slideNumberSettings.opacity;
         slideNumber.style.color = slideNumberSettings.color;
         // Position logic handled in generateSlides/apply loop usually, but good to have base
    }
    
    slide.appendChild(slideNumber);
    
    // Обертка для контента, который нужно масштабировать
    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'slide-content-wrapper';
    contentWrapper.style.width = '100%';
    contentWrapper.style.display = 'flex';
    contentWrapper.style.flexDirection = 'column';
    contentWrapper.style.alignItems = 'center';
    contentWrapper.style.justifyContent = 'center'; // По умолчанию

    // Определяем позицию для изображений (default: 'after-all')
    const imagePosition = slideData.imagePosition || 'after-all';

    // Функция для создания текстового элемента
    const createTextElement = (textData, textType) => {
        let element;
        if (textType === 'title') {
            element = document.createElement(textData.tag || 'h2');
            element.innerHTML = textData.text.replace(/\n/g, '<br>');
            element.style.fontFamily = textData.style?.fontFamily || "'Comfortaa', cursive";
            element.style.color = textData.style?.color || '#ffffff';
        } else if (textType === 'subtitle') {
            element = document.createElement('div');
            element.innerHTML = textData.text.replace(/\n/g, '<br>');
            element.className = 'subtitle';
            element.style.fontFamily = textData.style?.fontFamily || "'Comfortaa', cursive";
            element.style.color = textData.style?.color || '#ffffff';
        } else if (textType === 'paragraph') {
            element = document.createElement('p');
            element.innerHTML = textData.text.replace(/\n/g, '<br>');
            element.style.fontFamily = textData.style?.fontFamily || "'Comfortaa', cursive";
            element.style.color = textData.style?.color || '#ffffff';
        }

        if (element) {
            element.className = (element.className ? element.className + ' ' : '') + 'editable-text';
            element.dataset.textType = textType;
            element.contentEditable = 'true';

            // Apply all style properties if available
            if (textData.style) {
                if (textData.style.fontSize) element.style.fontSize = textData.style.fontSize;
                if (textData.style.textAlign) element.style.textAlign = textData.style.textAlign;
            }
        }
        return element;
    };

    // Эмоджи
    if (slideData.emoji) {
        const emoji = document.createElement('span');
        emoji.className = 'emoji editable-text';
        emoji.dataset.textType = 'emoji';
        emoji.contentEditable = 'true';
        emoji.textContent = slideData.emoji;
        contentWrapper.appendChild(emoji);
    }

    // Заголовок
    if (slideData.title) {
        const title = createTextElement(slideData.title, 'title');
        contentWrapper.appendChild(title);
    }

    // Изображения после заголовка (if requested)
    if (imagePosition === 'after-title' && slideData.images && slideData.images.length > 0) {
        const container = createImageContainer(slideData, slideIndex);
        contentWrapper.appendChild(container);
    }

    // Подзаголовок
    if (slideData.subtitle && slideData.subtitle.text) {
        const subtitle = createTextElement(slideData.subtitle, 'subtitle');
        contentWrapper.appendChild(subtitle);
    }

    // Изображения после подзаголовка (if requested)
    if (imagePosition === 'after-subtitle' && slideData.images && slideData.images.length > 0) {
        const container = createImageContainer(slideData, slideIndex);
        contentWrapper.appendChild(container);
    }

    // Параграф
    if (slideData.paragraph && slideData.paragraph.text) {
        const paragraph = createTextElement(slideData.paragraph, 'paragraph');
        contentWrapper.appendChild(paragraph);
    }

    // Изображения после параграфа (if requested)
    if (imagePosition === 'after-paragraph' && slideData.images && slideData.images.length > 0) {
        const container = createImageContainer(slideData, slideIndex);
        contentWrapper.appendChild(container);
    }

    // CTA
    if (slideData.cta && slideData.cta.text) {
        const cta = document.createElement('div');
        cta.className = 'cta';
        cta.textContent = slideData.cta.text;
        if (slideData.cta.color) {
            cta.style.color = slideData.cta.color;
        }
        contentWrapper.appendChild(cta);
    }

    // Изображения в конце (default position)
    if ((imagePosition === 'after-all' || !['after-title', 'after-subtitle', 'after-paragraph'].includes(imagePosition)) && slideData.images && slideData.images.length > 0) {
        const container = createImageContainer(slideData, slideIndex);

        const preset = slideData.containerSettings?.preset;
        if (preset === 'image-left' || preset === 'image-right') {
            slide.classList.add('layout-side-slide');
            if (preset === 'image-left') {
                slide.classList.add('image-left');
            } else {
                slide.classList.add('image-right');
            }
            slide.appendChild(container);
        } else {
            contentWrapper.appendChild(container);
        }
    }

    slide.appendChild(contentWrapper);
    
    /// Водяной знак (gameinvitation.com)
    const wm = document.createElement('div');
    wm.className = 'watermark-layer';
    wm.textContent = (watermarkSettings && watermarkSettings.text) || watermark || 'GameInvitation.com';
    wm.title = 'Настроить водяной знак';

    wm.addEventListener('click', (e) => {
        e.stopPropagation();
        showWatermarkSettingsPanel();
    });

    slide.appendChild(wm);
    
    return slide;
}

// Функция для генерации слайдов из проекта
function generateSlides(project) {
    const container = document.getElementById('slides-container');
    container.innerHTML = '';
    // Не сбрасываем slideImages, чтобы сохранить загруженные изображения
    // slideImages = {}; // Сбрасываем загруженные изображения
    
    project.slides.forEach((slideData, index) => {
        const slideWrapper = document.createElement('div');
        slideWrapper.className = 'slide-wrapper';
        
        // Создаем слайд в формате 1:1
        const slide11 = createSlideFromJSON(
            slideData,
            index,
            project.slides.length,
            project.logo,
            project.watermark
        );
        slide11.classList.add('slide-format-1-1');

        // Создаем слайд в формате 4:5
        const slide45 = createSlideFromJSON(
            slideData,
            index,
            project.slides.length,
            project.logo,
            project.watermark
        );
        slide45.classList.add('slide-format-4-5', 'format-4-5');
        
        // Создаем слайд в формате 9:16
        const slide916 = createSlideFromJSON(
            slideData,
            index,
            project.slides.length,
            project.logo,
            project.watermark
        );
        slide916.classList.add('slide-format-9-16', 'format-9-16');
        
        // Добавляем кнопку загрузки изображения (привязываем к всем слайдам)
        const uploadButton = createImageUploadButton(index, slide11, [slide45, slide916]);
        
        // Контейнер для слайдов
        const slidesContainer = document.createElement('div');
        slidesContainer.className = 'slides-preview-container';
        slidesContainer.appendChild(slide11);
        slidesContainer.appendChild(slide45);
        slidesContainer.appendChild(slide916);
        
        slideWrapper.appendChild(slidesContainer);
        slideWrapper.appendChild(uploadButton);
        container.appendChild(slideWrapper);
    });
    
    // Инициализируем drag and drop для всех слайдов после добавления в DOM
    setTimeout(() => {
        project.slides.forEach((slideData, index) => {
            initDragDropForSlides(index);
        });
        
        // Apply scaling
        // Also observe for image loading if needed, or simply wait
        // Images might load later and change height. 
        // We can add a simple load listener to images to re-fit
        const imgs = document.querySelectorAll('.slide img');
        imgs.forEach(img => {
            img.onload = () => {
                const slide = img.closest('.slide');
                if (slide) fitSlideContent(slide);
            };
        });
        
        // Применяем сохраненные gap к контейнерам изображений -- DEPRECATED
        Object.keys(imageGaps).forEach(gapKey => {
            const slideIndex = parseInt(gapKey.replace('gap_', ''));
            const gap = imageGaps[gapKey];
            const allSlides = document.querySelectorAll('.slide');
            allSlides.forEach(slide => {
                const container = slide.querySelector(`.slide-image-container[data-slide-index="${slideIndex}"]`);
                if (container) {
                    container.style.gap = gap + 'px';
                }
            });
        });
        
        // Применяем сохраненные настройки контейнеров
        Object.keys(containerSettings).forEach(settingsKey => {
            const parts = settingsKey.split('_');
            if (parts.length >= 2) {
                    const slideIndex = parseInt(parts[1]);
                    const format = parts.length > 2 ? parts[2] : null; 
                    
                    const settings = containerSettings[settingsKey];
                    
                    let selector = '.slide';
                    if (format === '1-1') selector = '.slide:not(.format-9-16)';
                    else if (format === '9-16') selector = '.slide.format-9-16';
                    
                    const targetSlides = document.querySelectorAll(selector);
                    targetSlides.forEach(slide => {
                    const container = slide.querySelector(`.slide-image-container[data-slide-index="${slideIndex}"]`);
                    if (container && settings) {
                        container.style.gap = settings.gap + 'px';
                        container.style.flexDirection = settings.direction || 'row';
                        container.style.borderRadius = (settings.radius || 0) + 'px';
                        container.style.flexWrap = settings.wrap ? 'wrap' : 'nowrap';

                        if (settings.height && settings.height > 0) {
                            container.style.minHeight = settings.height + 'px';
                        } else {
                            container.style.minHeight = '';
                        }

                        container.style.justifyContent = settings.align || 'center';
                        container.style.alignItems = 'center';

                        if (settings.wrap && settings.direction === 'row') {
                            container.style.alignContent = settings.align || 'center';
                        }

                        const images = container.querySelectorAll('img');
                        images.forEach(img => {
                            img.style.borderRadius = (settings.radius || 0) + 'px';
                            if (img.dataset.sizeKey) {
                                const formatSizeKey = `${img.dataset.sizeKey}_${format}`;
                                const size = imageSizes[formatSizeKey];
                                if (size) {
                                        img.style.setProperty('max-width', size + '%', 'important');
                                }
                            }
                        });
                    }
                    });
            }
        });
        
        // Применяем сохраненные настройки логотипов
        Object.keys(logoSettings).forEach(projectId => {
            const settings = logoSettings[projectId];
            const allSlides = document.querySelectorAll('.slide');
            allSlides.forEach(slide => {
                const logoImg = slide.querySelector('.logo');
                if (logoImg && settings) {
                    if (settings.height) logoImg.style.height = settings.height + 'px';
                    if (settings.top !== undefined) logoImg.style.top = settings.top + 'px';
                    if (settings.left !== undefined) logoImg.style.left = settings.left + 'px';
                    if (settings.opacity !== undefined) logoImg.style.opacity = settings.opacity;
                    if (settings.shadow) logoImg.style.filter = `drop-shadow(${settings.shadow})`;
                    if (settings.border && settings.borderWidth > 0) {
                        logoImg.style.border = `${settings.borderWidth}px solid ${settings.borderColor || '#ffffff'}`;
                        logoImg.style.borderRadius = (settings.borderRadius || 0) + 'px';
                    }
                }
            });
        });

        // Применяем сохраненные настройки номера слайда
        if (slideNumberSettings) {
            const s = slideNumberSettings;
            const allSlideNumbers = document.querySelectorAll('.slide-number');
            allSlideNumbers.forEach(sn => {
                if (s.fontSize) sn.style.fontSize = s.fontSize + 'px';
                if (s.opacity !== undefined) sn.style.opacity = s.opacity;
                if (s.color) sn.style.color = s.color;
                
                sn.style.left = 'auto';
                sn.style.right = 'auto';
                sn.style.bottom = (s.offsetY !== undefined ? s.offsetY : 20) + 'px';
                sn.style.transform = 'none';
                
                const pos = s.position || 'bottom-right';
                const offX = s.offsetX !== undefined ? s.offsetX : 20;

                if (pos === 'bottom-left') {
                    sn.style.left = offX + 'px';
                } else if (pos === 'bottom-right') {
                    sn.style.right = offX + 'px';
                } else if (pos === 'bottom-center') {
                    sn.style.left = '50%';
                    sn.style.transform = `translateX(-50%)`;
                    if (offX > 0) sn.style.transform = `translateX(calc(-50% + ${offX}px))`;
                }
            });
        }

        // Применяем сохраненные настройки водяного знака
        if (watermarkSettings) {
             const s = watermarkSettings;
             const allWms = document.querySelectorAll('.watermark-layer');
             allWms.forEach(wm => {
                 if (s.text) wm.textContent = s.text;
                 if (s.fontSize) wm.style.fontSize = s.fontSize + 'px';
                 if (s.opacity !== undefined) wm.style.opacity = s.opacity;
                 if (s.color) wm.style.color = s.color;
                 if (s.rotate !== undefined) wm.style.transform = `translate(-50%, -50%) rotate(${s.rotate}deg)`;
                 if (s.x !== undefined) wm.style.left = s.x + '%';
                 if (s.y !== undefined) wm.style.top = s.y + '%';
             });
        }

        // Масштабируем изображения для узких форматов (9:16)
        const slides916 = document.querySelectorAll('.slide.format-9-16');
        slides916.forEach(slide => {
            const images = slide.querySelectorAll('img.slide-image');
            images.forEach(img => {
                const currentWidth = parseFloat(img.style.maxWidth || 100);
                if (currentWidth > 80) {
                    img.style.setProperty('max-width', '75%', 'important');
                } else if (currentWidth > 50) {
                    img.style.setProperty('max-width', '45%', 'important');
                }
            });
        });

        // Apply scaling LAST, after all layout settings (gaps, flex, etc) are applied
        const allSlides = document.querySelectorAll('.slide');
        allSlides.forEach(slide => fitSlideContent(slide));
        
    }, 500);
    
    currentProjectId = project.id;
    updateFormatButtons();
    updatePreviewMode();
    saveToLocalStorage(); // Сохраняем только при переключении проекта
}
