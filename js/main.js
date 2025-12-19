document.addEventListener('DOMContentLoaded', () => {
    // Загружаем данные из localStorage
    loadFromLocalStorage();
    
    // Если есть сохраненные проекты, восстанавливаем их
    if (projectsData.length > 0) {
        if (currentProjectId) {
            const project = projectsData.find(p => p.id === currentProjectId);
            if (project) {
                generateSlides(project);
            } else if (projectsData.length > 0) {
                // Если текущий проект не найден, загружаем первый
                generateSlides(projectsData[0]);
                currentProjectId = projectsData[0].id;
            }
        } else if (projectsData.length > 0) {
            generateSlides(projectsData[0]);
            currentProjectId = projectsData[0].id;
        }
        renderProjectsList();
        
        // Render slides navigation after slides are generated
        setTimeout(() => {
            renderSlidesNav();
        }, 600);
        
        showNotification('Данные восстановлены из сохранения', 'success');
    }
    
    initFormatButtons();
    initImportJSON();
    initSaveJSON();
    initEditJSON();
    initExport();
    initTextEditing();
    initAddElements();
    initWatermarkButton();
    initKeyboardShortcuts();
    initFontScaleSlider();
});

function initWatermarkButton() {
    const watermarkBtn = document.getElementById('watermark-btn');
    if (watermarkBtn) {
        watermarkBtn.addEventListener('click', () => {
            if (typeof WatermarkSystem !== 'undefined') {
                WatermarkSystem.createWatermarkPanel();
            }
        });
    }
}

function initFontScaleSlider() {
    const slider = document.getElementById('font-scale-slider');
    const valueDisplay = document.getElementById('font-scale-value');

    if (!slider || !valueDisplay) return;

    // Load saved value from localStorage
    const savedScale = localStorage.getItem('fontScale') || '100';
    slider.value = savedScale;
    valueDisplay.textContent = savedScale + '%';
    applyFontScale(parseFloat(savedScale));

    slider.addEventListener('input', (e) => {
        const scalePercent = e.target.value;
        valueDisplay.textContent = scalePercent + '%';

        // Save to localStorage
        localStorage.setItem('fontScale', scalePercent);

        // Apply the scale
        applyFontScale(parseFloat(scalePercent));
    });
}

function applyFontScale(percent) {
    const scale = percent / 100;
    const root = document.documentElement;

    // Set CSS variable for font scale
    root.style.setProperty('--font-scale', scale);

    // Base sizes for 1:1 format (reference point)
    const BASE_HEADING_SIZE = 38;
    const BASE_SUBTITLE_SIZE = 16;
    const BASE_EMOJI_SIZE = 80;

    // Apply scale to all text elements across all slides
    const slides = document.querySelectorAll('.slide');
    slides.forEach(slide => {
        // Scale headings - calculate from 1:1 base size
        const headings = slide.querySelectorAll('h1, h2');
        headings.forEach(h => {
            // Start from 1:1 base and apply scale
            const scaledSize = BASE_HEADING_SIZE * scale;
            h.style.fontSize = scaledSize + 'px';
        });

        // Scale subtitle and paragraphs - calculate from 1:1 base size
        const textElements = slide.querySelectorAll('.subtitle, p');
        textElements.forEach(el => {
            // Start from 1:1 base and apply scale
            const scaledSize = BASE_SUBTITLE_SIZE * scale;
            el.style.fontSize = scaledSize + 'px';
        });

        // Scale emoji - calculate from 1:1 base size
        const emojis = slide.querySelectorAll('.emoji');
        emojis.forEach(emoji => {
            // Start from 1:1 base and apply scale
            const scaledSize = BASE_EMOJI_SIZE * scale;
            emoji.style.fontSize = scaledSize + 'px';
        });
    });
}

function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Проверяем, активен ли CodeMirror редактор (не должны работать в редакторе)
        const isCodeMirrorActive = document.querySelector('.CodeMirror-focused');
        if (isCodeMirrorActive) return;

        // Проверяем, редактируется ли текст
        const isTextEditing = document.activeElement.contentEditable === 'true' ||
                             document.activeElement.tagName === 'TEXTAREA' ||
                             document.activeElement.tagName === 'INPUT';

        if (isTextEditing && e.key !== 'z' && e.key !== 'Z') return;

        // Cmd+Z или Ctrl+Z для отмены
        if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
            e.preventDefault();
            undo();
        }

        // Cmd+Shift+Z или Ctrl+Shift+Z для повтора
        if ((e.metaKey || e.ctrlKey) && e.key === 'z' && e.shiftKey) {
            e.preventDefault();
            redo();
        }

        // Cmd+Y или Ctrl+Y для повтора (альтернативный способ)
        if ((e.metaKey || e.ctrlKey) && e.key === 'y') {
            e.preventDefault();
            redo();
        }
    });
}

// Глобальная переменная для отслеживания активного слайда
let activeSlideIndex = 0;

// Update active slide on click
document.addEventListener('click', (e) => {
    // Ignore clicks on panels and their controls
    if (e.target.closest('.image-size-panel') || 
        e.target.closest('.text-edit-panel') ||
        e.target.closest('.add-element-btn')) {
        return;
    }
    
    const slide = e.target.closest('.slide');
    if (slide) {
        // Only select slide if NOT clicking on editable text or interactive elements
        const isEditableText = e.target.classList.contains('editable-text') || e.target.closest('.editable-text');
        const isButton = e.target.tagName === 'BUTTON' || e.target.closest('button');
        const isInput = e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT';
        const isImage = e.target.classList.contains('uploaded-image') || e.target.closest('.uploaded-image-wrapper');
        
        // Select slide only if clicking on background or non-interactive content
        if (!isEditableText && !isButton && !isInput && !isImage) {
            // Parse index from data attribute
            if (slide.dataset.slideIndex !== undefined) {
                 activeSlideIndex = parseInt(slide.dataset.slideIndex);
            } else {
                 // Fallback
                 const formatClass = slide.classList.contains('format-9-16') ? '.slide.format-9-16' : 
                                     slide.classList.contains('format-4-5') ? '.slide.format-4-5' : '.slide.format-1-1';
                 const slides = Array.from(document.querySelectorAll(formatClass));
                 activeSlideIndex = slides.indexOf(slide);
            }
            
            // Remove old labels
            document.querySelectorAll('.active-slide-label').forEach(el => el.remove());
            
            // Add label to all slides of this index
            const allSlidesOfIndex = document.querySelectorAll(`.slide[data-slide-index="${activeSlideIndex}"]`);
            allSlidesOfIndex.forEach(s => {
                const label = document.createElement('div');
                label.className = 'active-slide-label';
                label.textContent = `Слайд ${activeSlideIndex + 1}`;
                label.setAttribute('data-html2canvas-ignore', 'true');
                s.appendChild(label);
            });
            
            // Update layers panel
            if (typeof renderLayersPanel === 'function') {
                renderLayersPanel();
            }
        }
    }
});

// Инициализация редактирования текста и глобальных обработчиков кликов
function initTextEditing() {
    // Используем делегирование событий для динамически созданных элементов
    document.addEventListener('click', (e) => {
        // ПЕРВЫМ ДЕЛОМ проверяем кнопки закрытия - до всех остальных проверок
        // Проверяем напрямую по классу и родительской панели class exists
        if (e.target.classList.contains('close-panel-btn') || e.target.closest('.close-panel-btn')) {
            const closeBtn = e.target.classList.contains('close-panel-btn') ? e.target : e.target.closest('.close-panel-btn');
            
            // Определяем, какая панель закрывается
            const textPanel = closeBtn.closest('#text-edit-panel');
            const sizePanel = closeBtn.closest('#image-size-panel'); // Note: container-settings-panel has this class too? No, it has id logic below generally
            const gapPanel = closeBtn.closest('#image-gap-panel');
            const containerSettingsPanel = closeBtn.closest('#container-settings-panel');
            const logoSettingsPanel = closeBtn.closest('#logo-settings-panel');
            
            if (textPanel) {
                textPanel.style.display = 'none';
                selectedTextElement = null;
                e.stopPropagation();
                e.preventDefault();
                e.stopImmediatePropagation();
                return false;
            }
            
            if (sizePanel && sizePanel.id === 'image-size-panel') { // Legacy or other panel
                sizePanel.style.display = 'none';
                selectedImage = null;
                e.stopPropagation();
                e.preventDefault();
                e.stopImmediatePropagation();
                return false;
            }
            
            if (gapPanel) {
                gapPanel.style.display = 'none';
                selectedImageContainer = null;
                e.stopPropagation();
                e.preventDefault();
                e.stopImmediatePropagation();
                return false;
            }
            
            if (containerSettingsPanel) {
                containerSettingsPanel.style.display = 'none';
                selectedImageContainer = null;
                selectedImage = null;
                e.stopPropagation();
                e.preventDefault();
                e.stopImmediatePropagation();
                return false;
            }
            
            if (logoSettingsPanel) {
                logoSettingsPanel.style.display = 'none';
                e.stopPropagation();
                e.preventDefault();
                e.stopImmediatePropagation();
                return false;
            }
        }
        
        // Проверяем, кликнули ли на редактируемый текстовый элемент
        const textElement = e.target.closest('.editable-text');
        
        // Игнорируем клики внутри панелей и меню (кроме кнопки закрытия и удаления, которые обработали выше)
        if (e.target.closest('.text-edit-panel') || 
            e.target.closest('.image-size-panel') || // Covers container-settings and logo-settings if they have this class
            e.target.closest('#image-gap-panel') ||
            e.target.closest('#container-settings-panel') ||
            e.target.closest('#logo-settings-panel') ||
            e.target.closest('.image-context-menu') ||
            e.target.closest('.uploaded-image-wrapper') ||
            e.target.closest('.apply-text-btn') ||
            e.target.closest('.apply-size-btn') ||
            e.target.closest('.menu-btn') ||
            e.target.closest('.align-container-btn') ||
            e.target.closest('input') ||
            e.target.closest('select') ||
            (e.target.closest('button') && !e.target.closest('.close-panel-btn') && !e.target.closest('#delete-text-btn'))) {
            return;
        }
        
        // Закрываем панель редактирования при клике вне её
        const textPanel = document.getElementById('text-edit-panel');
        if (textPanel && textPanel.style.display !== 'none' && !textPanel.contains(e.target) && !textElement) {
            textPanel.style.display = 'none';
            selectedTextElement = null;
        }
        
        // Закрываем панель контейнера при клике вне её
        const containerPanel = document.getElementById('container-settings-panel');
        if (containerPanel && containerPanel.style.display !== 'none' && !containerPanel.contains(e.target)) {
            // Also check if we clicked a gap-btn or something that opens it?
            // Usually valid opens check event bubbling stopping.
            containerPanel.style.display = 'none';
            selectedImageContainer = null;
            selectedImage = null;
        }

        // Закрываем панель логотипа
        const logoPanel = document.getElementById('logo-settings-panel');
        if (logoPanel && logoPanel.style.display !== 'none' && !logoPanel.contains(e.target) && !e.target.closest('.logo')) {
            logoPanel.style.display = 'none';
        }
        
        if (textElement) {
            e.stopPropagation();
            e.preventDefault();
            // Закрываем другие панели
            document.querySelectorAll('.image-size-panel').forEach(p => p.style.display = 'none');
             
            showTextEditPanel(textElement);
        }
    });

    // Обработка ввода текста
    document.addEventListener('input', (e) => {
        if (e.target.classList.contains('editable-text')) {
            // Реальное масштабирование при вводе
            const slide = e.target.closest('.slide');
            if (slide && window.fitSlideContent) {
                window.fitSlideContent(slide);
            }

            // Сохраняем только при потере фокуса или паузе, чтобы не забивать стек undo
            // Но пока можно просто обновлять модель при сохранении (saveToLocalStorage вызывается при переключении слайдов/проектов)
            // Реализуем debounce сохранение
            if (this.saveTimeout) clearTimeout(this.saveTimeout);
            this.saveTimeout = setTimeout(() => {
                // Обновляем данные в projectsData
                // Это сложно сделать эффективно, проще обновлять при сохранении JSON или переключении
                // Но autoSave делает это
                autoSave();
            }, 1000);
        }
    });


    // Обработка масштабирования при изменении размера окна
    window.addEventListener('resize', () => {
         const slides = document.querySelectorAll('.slide');
         if (window.fitSlideContent) {
             slides.forEach(slide => window.fitSlideContent(slide));
         }
    });
}

// Функция для отображения списка проектов
function renderProjectsList() {
    const list = document.getElementById('projects-list');
    list.innerHTML = '';
    
    projectsData.forEach(project => {
        const item = document.createElement('div');
        item.className = `project-item ${currentProjectId === project.id ? 'active' : ''}`;
        item.textContent = project.name;
        item.addEventListener('click', () => {
            currentProjectId = project.id;
            generateSlides(project);
            renderProjectsList();
            renderSlidesNav(); // Update slides nav
            saveToLocalStorage();
        });
        list.appendChild(item);
    });
}

// Функция для отображения навигации по слайдам
function renderSlidesNav() {
    const nav = document.getElementById('slides-nav');
    if (!nav) return;
    
    nav.innerHTML = '';
    
    // Get all slides from current project (use 1:1 format as reference)
    const slides = document.querySelectorAll('.slide-format-1-1');
    
    slides.forEach((slide, index) => {
        const navItem = document.createElement('div');
        navItem.className = 'slide-nav-item';
        navItem.style.cssText = `
            padding: 8px 12px;
            background: rgba(255,255,255,0.1);
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            gap: 10px;
            color: white;
            font-size: 14px;
        `;
        
        // Get slide title or use default
        const titleEl = slide.querySelector('h1, h2');
        const titleText = titleEl ? titleEl.textContent.substring(0, 30) : `Слайд ${index + 1}`;
        
        navItem.innerHTML = `
            <span style="font-weight: 600; min-width: 25px;">${index + 1}</span>
            <span style="opacity: 0.8; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${titleText}</span>
        `;
        
        // Highlight active slide
        if (index === activeSlideIndex) {
            navItem.style.background = 'white';
            navItem.style.color = '#1a1a1a';
        }
        
        // Click to scroll and select
        navItem.addEventListener('click', (e) => {
            e.stopPropagation();
            activeSlideIndex = index;
            
            console.log('Selecting slide index:', index);
            
            // Try to find slide by data-slide-index first
            let targetSlide = document.querySelector(`.slide[data-slide-index="${index}"]`);
            
            // If not found, try by position in format-1-1 slides
            if (!targetSlide) {
                const allSlides = document.querySelectorAll('.slide-format-1-1');
                targetSlide = allSlides[index];
            }
            
            console.log('Target slide found:', !!targetSlide);
            
            if (targetSlide) {
                // Scroll to slide
                targetSlide.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                // Trigger selection visual on ALL formats of this slide
                document.querySelectorAll('.active-slide-label').forEach(el => el.remove());
                
                // Find all slides with same index (all formats)
                let allSlidesOfIndex = document.querySelectorAll(`.slide[data-slide-index="${index}"]`);
                
                // Fallback: if data-slide-index not set, select by position
                if (allSlidesOfIndex.length === 0) {
                    const formats = ['.slide-format-1-1', '.slide-format-4-5', '.slide-format-9-16'];
                    formats.forEach(format => {
                        const formatSlides = document.querySelectorAll(format);
                        if (formatSlides[index]) {
                            const label = document.createElement('div');
                            label.className = 'active-slide-label';
                            label.textContent = `Слайд ${index + 1}`;
                            label.setAttribute('data-html2canvas-ignore', 'true');
                            formatSlides[index].appendChild(label);
                        }
                    });
                } else {
                    allSlidesOfIndex.forEach(s => {
                        const label = document.createElement('div');
                        label.className = 'active-slide-label';
                        label.textContent = `Слайд ${index + 1}`;
                        label.setAttribute('data-html2canvas-ignore', 'true');
                        s.appendChild(label);
                    });
                }
            }
            
            renderSlidesNav(); // Update highlight
            
            // Update layers panel
            if (typeof renderLayersPanel === 'function') {
                renderLayersPanel();
            }
        });
        
        // Hover effect
        navItem.addEventListener('mouseenter', () => {
            if (index !== activeSlideIndex) {
                navItem.style.background = 'rgba(255,255,255,0.2)';
            }
        });
        navItem.addEventListener('mouseleave', () => {
            if (index !== activeSlideIndex) {
                navItem.style.background = 'rgba(255,255,255,0.1)';
            }
        });
        
        nav.appendChild(navItem);
    });
}

// Функция для обработки данных JSON (после парсинга)
function applyJSONData(data) {
    try {
        if (data.projects && Array.isArray(data.projects)) {
            projectsData = data.projects;
            if (projectsData.length > 0) {
                currentProjectId = projectsData[0].id;
                generateSlides(projectsData[0]);
                renderProjectsList();
                renderSlidesNav();
                saveToLocalStorage();
                showNotification(`Импортировано проектов: ${projectsData.length}`, 'success');
            }
        } else {
            showNotification('Неверный формат JSON. Ожидается объект с полем "projects"', 'error');
        }
    } catch (error) {
        showNotification('Ошибка при обработке JSON: ' + error.message, 'error');
        console.error(error);
    }
}

// Функция для обработки JSON файла
function processJSONFile(file) {
    if (!file) return;

    if (!file.name.endsWith('.json')) {
        showNotification('Пожалуйста, выберите JSON файл', 'warning');
        return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const data = JSON.parse(event.target.result);
            applyJSONData(data);
        } catch (error) {
            showNotification('Ошибка при парсинге JSON: ' + error.message, 'error');
            console.error(error);
        }
    };
    reader.readAsText(file);
}

// Импорт JSON
function initImportJSON() {
    const importBtn = document.getElementById('import-json-btn');
    const importInput = document.getElementById('import-json-input');
    const importArea = document.getElementById('import-json-area');
    const jsonTextInput = document.getElementById('json-text-input');

    if (!importBtn || !importInput || !importArea) {
        console.error('Элементы импорта JSON не найдены');
        return;
    }

    // Клик по кнопке
    importBtn.addEventListener('click', () => {
        importInput.click();
    });

    // Выбор файла через input
    importInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        processJSONFile(file);
    });

    // Обработка текстового ввода
    if (jsonTextInput) {
        jsonTextInput.addEventListener('blur', () => {
            const text = jsonTextInput.value.trim();
            if (text) {
                try {
                    const data = JSON.parse(text);
                    applyJSONData(data);
                    jsonTextInput.value = ''; // Очищаем поле после успешной загрузки
                } catch (error) {
                    showNotification('Ошибка при парсинге JSON текста: ' + error.message, 'error');
                    console.error(error);
                }
            }
        });
    }

    // Drag and Drop
    importArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.stopPropagation();
        importArea.classList.add('drag-over');
    });

    importArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        e.stopPropagation();
        importArea.classList.remove('drag-over');
    });

    importArea.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        importArea.classList.remove('drag-over');

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            processJSONFile(files[0]);
        }
    });
}

// Сохранение JSON
function initSaveJSON() {
    const saveJsonBtn = document.getElementById('save-json-btn');
    if (!saveJsonBtn) {
        console.error('Кнопка сохранения JSON не найдена');
        return;
    }
    
    saveJsonBtn.addEventListener('click', () => {
    if (!currentProjectId || projectsData.length === 0) {
        showNotification('Нет загруженных проектов для сохранения.', 'warning');
        return;
    }
    
    const currentProject = projectsData.find(p => p.id === currentProjectId);
    if (!currentProject) {
        showNotification('Текущий проект не найден.', 'error');
        return;
    }
    
    // Обновляем данные проекта из текущих слайдов
    const slides = document.querySelectorAll('.slide');
    const updatedSlides = [];
    
    // We only want to save distinct slides (e.g. 1-1 or whatever is source of truth).
    // Actually our model is that the project has 'slides' data, and we generate 1-1 and 9-16 views from it.
    // So we should pick ONE set of slides (e.g. 1-1 format) and extract data from them.
    // Or we iterate through the 'slides' data structure and update it?
    // The current implementation iterates DOM nodes.
    // We should pick slides of one format to avoid duplication.
    // Let's take 1-1 slides.
    const slides11 = document.querySelectorAll('.slide:not(.format-9-16)');
    
    slides11.forEach((slide, index) => {
        const bgData = extractColorsFromBackground(slide.style.background);
        const slideData = {
            id: index + 1,
            background: bgData,
            emoji: null,
            title: null,
            subtitle: null,
            paragraph: null,
            images: [],
            cta: null
        };
        
        // Эмоджи
        const emojiEl = slide.querySelector('.emoji');
        if (emojiEl) {
            slideData.emoji = emojiEl.textContent.trim();
        }
        
        // Функция для конвертации цвета в HEX
        const rgbToHex = (rgb) => {
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
        };
        
        // Заголовок
        const titleEl = slide.querySelector('h1') || slide.querySelector('h2');
        if (titleEl) {
            const computedStyle = window.getComputedStyle(titleEl);
            slideData.title = {
                text: titleEl.innerText,
                tag: titleEl.tagName.toLowerCase(),
                style: {
                    fontFamily: computedStyle.fontFamily || null,
                    fontSize: computedStyle.fontSize || null,
                    textAlign: computedStyle.textAlign || null,
                    color: rgbToHex(computedStyle.color)
                }
            };
        }
        
        // Подзаголовок
        const subtitleEl = slide.querySelector('.subtitle');
        if (subtitleEl) {
            const computedStyle = window.getComputedStyle(subtitleEl);
            slideData.subtitle = {
                text: subtitleEl.innerText,
                style: {
                    fontFamily: computedStyle.fontFamily || null,
                    fontSize: computedStyle.fontSize || null,
                    textAlign: computedStyle.textAlign || null,
                    color: rgbToHex(computedStyle.color)
                }
            };
        }
        
        // Параграф
        const paragraphEl = slide.querySelector('p');
        if (paragraphEl && !subtitleEl) {
            const computedStyle = window.getComputedStyle(paragraphEl);
            slideData.paragraph = {
                text: paragraphEl.innerText,
                style: {
                    fontFamily: computedStyle.fontFamily || null,
                    fontSize: computedStyle.fontSize || null,
                    textAlign: computedStyle.textAlign || null,
                    color: rgbToHex(computedStyle.color)
                }
            };
        }
        
        // Изображения (from JSON structure perspective)
        // Note: This logic might capture uploaded images as 'images' in JSON which might be desired
        // But we store uploaded in 'slideImages' separately usually?
        // Let's stick to original logic:
        const imageEls = slide.querySelectorAll('.slide-image');
        imageEls.forEach(img => {
            // Check if it's an uploaded image (we treat them same for export usually)
            // But original code:
            // It iterated slide-image.
            // Then it checked slideImages array to ADD to it.
            // This causes duplication if uploaded images are in DOM.
            
            // Refined logic:
            // JSON images are usually static ones from template.
            // Uploaded are separate.
            // If we want to save full state, we should probably save everything.
            
            // For now, let's just stick to the original code logic I read in Step 145
            // But be careful about duplication if I can't see the original logic fully.
            // Original code (Step 145, line 3227):
            /*
            const imageEls = slide.querySelectorAll('.slide-image');
            imageEls.forEach(img => {
                const sizeKey = img.dataset.sizeKey;
                const size = sizeKey ? (imageSizes[sizeKey] || null) : null;
                slideData.images.push({
                    src: img.src,
                    alt: img.alt || '',
                    size: size
                });
            });
            */
           // AND THEN
           /*
            if (slideImages[index]) { ... add them ... }
           */
           // This DEFINITELY checks for duplication in the original code? 
           // Probably the original code assumed 'slide-image' class was only for template images?
           // But `addImageToSlide` adds `slide-image` class to uploaded images too.
           // So `slide.querySelectorAll('.slide-image')` gets ALL images.
           
           // I will FILTER OUT uploaded images from the first loop if they are handled by the second loop.
           // Uploaded images have class 'uploaded-image'.
           
           if (!img.classList.contains('uploaded-image')) {
                const sizeKey = img.dataset.sizeKey;
                const size = sizeKey ? (imageSizes[sizeKey] || null) : null;
                slideData.images.push({
                    src: img.src,
                    alt: img.alt || '',
                    size: size
                });
           }
        });
        
        // Now add uploaded images (which are stored in global state)
        // But wait, if I add them to 'images' array in JSON, next time they load as template images?
        // That might be fine.
        if (slideImages[index]) {
            const images = Array.isArray(slideImages[index]) ? slideImages[index] : [slideImages[index]];
            images.forEach(imgSrc => {
                const sizeKey = `${index}_${imgSrc.substring(0, 50)}`;
                // Check format-specific size
                const formatSizeKey = `${sizeKey}_1-1`; // saving from 1-1 slide context
                const size = imageSizes[formatSizeKey] || imageSizes[sizeKey] || null;
                slideData.images.push({
                    src: imgSrc,
                    alt: 'Загруженное изображение',
                    size: size
                });
            });
        }
        
        // CTA
        const ctaEl = slide.querySelector('.cta');
        if (ctaEl) {
            slideData.cta = {
                text: ctaEl.textContent.trim(),
                color: ctaEl.style.color || null
            };
        }

        // Container Settings
        const imageContainer = slide.querySelector('.slide-image-container');
        if (imageContainer) {
            const settingsKey = `container_${index}_1-1`;
            const savedSettings = containerSettings[settingsKey];

            if (savedSettings) {
                slideData.containerSettings = {
                    gap: savedSettings.gap || 15,
                    align: savedSettings.align || 'center',
                    direction: savedSettings.direction || 'row',
                    radius: savedSettings.radius || 0,
                    preset: savedSettings.preset
                };
            } else {
                // Default settings if not customized
                const gap = parseInt(imageContainer.style.gap) || 15;
                const align = imageContainer.style.justifyContent || 'center';
                const direction = imageContainer.style.flexDirection || 'row';
                const radius = parseInt(imageContainer.style.borderRadius) || 0;

                slideData.containerSettings = {
                    gap: gap,
                    align: align,
                    direction: direction,
                    radius: radius
                };
            }
        }

        updatedSlides.push(slideData);
    });
    
    // Обновляем проект
    currentProject.slides = updatedSlides;
    
    // Формируем JSON для сохранения
    const jsonData = {
        projects: projectsData
    };
    
        // Скачиваем файл
        const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `project_${currentProjectId}_${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // Сохраняем в localStorage после сохранения JSON
        saveToLocalStorage();
        
        showNotification('JSON файл сохранён!', 'success');
    });
}

// Функция для извлечения цветов из background
function extractColorsFromBackground(background) {
    if (!background) return ['#1e3a8a', '#3b82f6'];
    
    if (background.includes('gradient')) {
        // Извлекаем все hex цвета
        const matches = background.match(/#[0-9a-fA-F]{6}/g);
        if (matches && matches.length >= 2) {
            // Извлекаем направление градиента
            const directionMatch = background.match(/(\d+)deg/);
            const direction = directionMatch ? parseInt(directionMatch[1]) : 135;
            return {
                type: 'gradient',
                colors: matches,
                direction: direction
            };
        }
        return {
            type: 'gradient',
            colors: ['#1e3a8a', '#3b82f6'],
            direction: 135
        };
    } else {
        // Сплошной цвет
        const match = background.match(/#[0-9a-fA-F]{6}/);
        return {
            type: 'solid',
            colors: match ? [match[0]] : ['#1e3a8a']
        };
    }
}

// Редактирование JSON
let codeMirrorEditor = null;

function initEditJSON() {
    const editJsonBtn = document.getElementById('edit-json-btn');
    const panel = document.getElementById('json-editor-panel');
    const overlay = document.getElementById('json-editor-overlay');
    const container = document.getElementById('json-editor-container');
    const errorMessage = document.getElementById('json-error-message');
    const applyBtn = document.getElementById('apply-json-btn');
    const formatBtn = document.getElementById('format-json-btn');
    const closeBtn = document.getElementById('close-json-editor');

    if (!editJsonBtn || !panel || !overlay || !container || !applyBtn || !formatBtn || !closeBtn) {
        console.error('Элементы редактора JSON не найдены');
        return;
    }

    // Инициализация CodeMirror
    if (!codeMirrorEditor) {
        codeMirrorEditor = CodeMirror(container, {
            mode: { name: 'javascript', json: true },
            theme: 'dracula',
            lineNumbers: true,
            lineWrapping: true,
            matchBrackets: true,
            autoCloseBrackets: true,
            indentUnit: 2,
            tabSize: 2,
            viewportMargin: Infinity
        });

        // Live preview при изменении
        let debounceTimer;
        codeMirrorEditor.on('change', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                tryApplyLivePreview();
            }, 1000); // Применяем через 1 секунду после остановки печатания
        });
    }

    // Функция live preview
    function tryApplyLivePreview() {
        try {
            const jsonText = codeMirrorEditor.getValue();
            const data = JSON.parse(jsonText);

            if (!data.projects || !Array.isArray(data.projects) || data.projects.length === 0) {
                return; // Невалидный JSON, не применяем
            }

            // Загружаем ВСЕ проекты для live preview
            projectsData = data.projects;
            currentProjectId = projectsData[0].id;

            // Перегенерируем слайды БЕЗ сохранения в localStorage (только preview)
            generateSlides(projectsData[0]);
            renderProjectsList();
            renderSlidesNav();
            errorMessage.textContent = `✓ Live preview обновлён (${projectsData.length} проектов)`;
            errorMessage.style.color = '#50fa7b';

        } catch (error) {
            // Игнорируем ошибки парсинга во время печатания
            errorMessage.textContent = '';
        }
    }

    // Изменение размера панели
    const resizeHandle = document.getElementById('json-resize-handle');
    let isResizing = false;
    let startX = 0;
    let startWidth = 0;

    resizeHandle.addEventListener('mousedown', (e) => {
        isResizing = true;
        startX = e.clientX;
        startWidth = panel.offsetWidth;
        panel.style.transition = 'none'; // Отключаем transition при ресайзе
        document.body.style.cursor = 'ew-resize';
        document.body.style.userSelect = 'none';
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isResizing) return;

        const deltaX = startX - e.clientX;
        const newWidth = startWidth + deltaX;
        const minWidth = 400; // Минимальная ширина
        const maxWidth = window.innerWidth * 0.8; // Максимум 80% экрана

        if (newWidth >= minWidth && newWidth <= maxWidth) {
            panel.style.width = newWidth + 'px';
            codeMirrorEditor.refresh(); // Обновляем CodeMirror при изменении размера
        }
    });

    document.addEventListener('mouseup', () => {
        if (isResizing) {
            isResizing = false;
            panel.style.transition = 'right 0.3s ease';
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        }
    });

    // Hover эффект для resize handle
    resizeHandle.addEventListener('mouseenter', () => {
        resizeHandle.style.background = 'linear-gradient(90deg, rgba(139, 233, 253, 0.6) 0%, transparent 100%)';
    });

    resizeHandle.addEventListener('mouseleave', () => {
        if (!isResizing) {
            resizeHandle.style.background = 'linear-gradient(90deg, rgba(139, 233, 253, 0.3) 0%, transparent 100%)';
        }
    });

    // Открыть редактор
    editJsonBtn.addEventListener('click', () => {
        if (!currentProjectId || projectsData.length === 0) {
            showNotification('Нет загруженных проектов для редактирования.', 'warning');
            return;
        }

        const currentProject = projectsData.find(p => p.id === currentProjectId);
        if (!currentProject) {
            showNotification('Текущий проект не найден.', 'error');
            return;
        }

        // Получаем актуальный JSON (используем логику из initSaveJSON)
        const updatedProject = JSON.parse(JSON.stringify(currentProject));

        // Обновляем слайды из DOM
        const slides11 = document.querySelectorAll('.slide:not(.format-9-16):not(.format-4-5)');
        updatedProject.slides = [];

        slides11.forEach((slide, index) => {
            const bgData = extractColorsFromBackground(slide.style.background);
            const slideData = {
                id: index + 1,
                background: bgData,
                emoji: null,
                title: null,
                subtitle: null,
                paragraph: null,
                images: [],
                cta: null
            };

            // Эмоджи
            const emojiEl = slide.querySelector('.emoji');
            if (emojiEl) slideData.emoji = emojiEl.textContent.trim();

            // Заголовок
            const titleEl = slide.querySelector('h1, h2');
            if (titleEl) {
                slideData.title = {
                    text: titleEl.textContent.trim(),
                    tag: titleEl.tagName.toLowerCase()
                };
            }

            // Подзаголовок
            const subtitleEl = slide.querySelector('.subtitle');
            if (subtitleEl) slideData.subtitle = { text: subtitleEl.textContent.trim() };

            // Параграф
            const paragraphEl = slide.querySelector('p:not(.subtitle)');
            if (paragraphEl) slideData.paragraph = { text: paragraphEl.textContent.trim() };

            // Изображения
            const imageContainer = slide.querySelector('.slide-image-container');
            if (imageContainer) {
                const images = imageContainer.querySelectorAll('img');
                images.forEach(img => {
                    const sizeKey = img.dataset.sizeKey;
                    const settingsKey = `${sizeKey}_1-1`;
                    const savedSize = imageSizes[settingsKey] || 50;

                    slideData.images.push({
                        src: img.src.split('/').slice(-2).join('/'),
                        alt: img.alt || '',
                        size: savedSize
                    });
                });

                // containerSettings
                const settingsKey = `container_${index}_1-1`;
                const savedSettings = containerSettings[settingsKey] || {};
                slideData.containerSettings = {
                    gap: savedSettings.gap || 15,
                    align: savedSettings.align || 'center',
                    direction: savedSettings.direction || 'row',
                    radius: savedSettings.radius || 0,
                    preset: savedSettings.preset
                };
            }

            // CTA
            const ctaEl = slide.querySelector('.cta');
            if (ctaEl) {
                slideData.cta = {
                    text: ctaEl.textContent.trim(),
                    color: rgbToHex(ctaEl.style.color) || currentProject.slides[index]?.cta?.color || '#0f766e'
                };
            }

            updatedProject.slides.push(slideData);
        });

        // Форматируем JSON с отступами
        const jsonText = JSON.stringify({ projects: [updatedProject] }, null, 2);
        codeMirrorEditor.setValue(jsonText);
        errorMessage.textContent = '';

        // Показываем панель и overlay
        overlay.style.display = 'block';
        setTimeout(() => {
            overlay.style.opacity = '1';
            panel.style.right = '0';
        }, 10);
    });

    // Применить изменения
    applyBtn.addEventListener('click', () => {
        try {
            const jsonText = codeMirrorEditor.getValue();
            const data = JSON.parse(jsonText);

            if (!data.projects || !Array.isArray(data.projects) || data.projects.length === 0) {
                throw new Error('JSON должен содержать массив "projects" с хотя бы одним проектом');
            }

            // Заменяем ВСЕ проекты на загруженные из JSON
            projectsData = data.projects;
            currentProjectId = projectsData[0].id;

            // Сохраняем и перегенерируем
            saveToLocalStorage();
            generateSlides(projectsData[0]);
            renderProjectsList();
            renderSlidesNav();

            // Закрываем панель
            closeEditor();
            showNotification(`✓ Загружено проектов: ${projectsData.length}`, 'success');

        } catch (error) {
            errorMessage.textContent = `❌ Ошибка: ${error.message}`;
            console.error('JSON parse error:', error);
        }
    });

    // Форматировать JSON
    formatBtn.addEventListener('click', () => {
        try {
            const jsonText = codeMirrorEditor.getValue();
            const data = JSON.parse(jsonText);
            const formatted = JSON.stringify(data, null, 2);
            codeMirrorEditor.setValue(formatted);
            errorMessage.textContent = '';
            showNotification('✓ JSON отформатирован', 'success');
        } catch (error) {
            errorMessage.textContent = `❌ Ошибка форматирования: ${error.message}`;
        }
    });

    // Закрытие редактора
    const closeEditor = () => {
        panel.style.right = '-50%';
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 300);
        errorMessage.textContent = '';
    };

    closeBtn.addEventListener('click', closeEditor);
    overlay.addEventListener('click', closeEditor);
}

// Экспорт
function initExport() {
    const exportBtn = document.getElementById('export-btn');
    if (!exportBtn) {
        console.error('Кнопка экспорта не найдена');
        return;
    }
    
    exportBtn.addEventListener('click', async () => {
        const need1 = document.getElementById('export-1-1').checked;
        const need45 = document.getElementById('export-4-5').checked;
        const need916 = document.getElementById('export-9-16').checked;
    
    if (!need1 && !need916 && !need45) {
        showNotification('Выберите хотя бы один формат для экспорта.', 'warning');
        return;
    }
    
    showNotification('Начинаю экспорт... Это может занять время.', 'info');
    
    try {
        const zip = new JSZip();
        const currentProject = projectsData.find(p => p.id === currentProjectId) || projectsData[0];
        const projectTitle = currentProject.name || 'Untitled_Project';
        
        // Папка проекта
        const projectFolder = zip.folder(projectTitle);
        
        // Получаем "первые 4 слова первого слайда" для названия папок
        // Берем первый слайд (index 0)
        let titleFirst4Words = 'Untitled';
        const firstSlide = document.querySelector('.slide-format-1-1'); // Берем 1-1 как референс контента
        if (firstSlide) {
            const h1 = firstSlide.querySelector('h1') || firstSlide.querySelector('h2');
            if (h1) {
                const text = h1.innerText.trim();
                const words = text.split(/\s+/).slice(0, 4);
                titleFirst4Words = words.join(' ').replace(/[^\w\u0400-\u04FF\s-]/g, '').trim().replace(/\s+/g, '_');
            }
        }
        if (!titleFirst4Words) titleFirst4Words = 'Slide_1';

        // Определяем форматы для экспорта
        const tasks = [];
        if (need1) tasks.push({ format: '1-1', selector: '.slide-format-1-1', ratio: '1:1' });
        if (need45) tasks.push({ format: '4-5', selector: '.slide-format-4-5', ratio: '4:5' });
        if (need916) tasks.push({ format: '9-16', selector: '.slide-format-9-16', ratio: '9:16' });
        
        // Временно показываем все слайды для рендеринга
        const originalStyles = [];
        tasks.forEach(task => {
            const slides = document.querySelectorAll(task.selector);
            slides.forEach(s => {
                originalStyles.push({ el: s, display: s.style.display });
                s.style.display = 'flex'; // Делаем видимым для html2canvas
            });
        });
        
        // Ждем отрисовки
        await new Promise(resolve => setTimeout(resolve, 100));
        
        for (const task of tasks) {
            // Папка формата: {формат}_{заголовок}
            // Формат в названии папки: user said "{формат}_заголовок" e.g. "1-1_Заголовок..."
            // Let's use clean format name e.g. "1-1", "9-16", "4-5"
            const formatFolderName = `${task.format}_${titleFirst4Words}`;
            const formatFolder = projectFolder.folder(formatFolderName);
            
            const slides = document.querySelectorAll(task.selector);
            
            for (let i = 0; i < slides.length; i++) {
                const node = slides[i];
                const indexStr = String(i + 1).padStart(3, '0'); // 001
                
                // Filename: {формат}_{заголовок}_{001}.jpg
                const filename = `${task.format}_${titleFirst4Words}_${indexStr}.jpg`;
                
                // Рендер
                const canvas = await html2canvas(node, {
                    scale: 3, // Maximum quality (3x resolution)
                    useCORS: true,
                    backgroundColor: null, // Transparent if needed, but slides have background
                    logging: false,
                    allowTaint: false,
                    removeContainer: true
                });

                const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 1.0));
                formatFolder.file(filename, blob);
            }
        }
        
        // Восстанавливаем видимость
        originalStyles.forEach(item => {
            item.el.style.display = item.display;
        });
        
        // Генерируем zip
        const content = await zip.generateAsync({ type: 'blob' });
        saveAs(content, `${projectTitle}.zip`);
        
        showNotification('Экспорт успешно завершен!', 'success');
        
    } catch (e) {
        console.error(e);
        showNotification('Ошибка экспорта: ' + e.message, 'error');
         // На всякий случай восстанавливаем стили если упало
         updatePreviewMode();
    }
    });
}

// Инициализация панели добавления элементов
function initAddElements() {
    const buttons = document.querySelectorAll('.add-element-btn');
    
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.dataset.type;
            
            console.log('Add element clicked, type:', type, 'activeSlideIndex:', activeSlideIndex);
            
            // Находим все слайды с активным индексом
            // Note: createSlideFromJSON sets data-slide-index on the slide element.
            let slides = document.querySelectorAll(`.slide[data-slide-index="${activeSlideIndex}"]`);
            
            console.log('Slides found by data-slide-index:', slides.length);
            
            // Fallback: if data-slide-index not found, try by position
            if (slides.length === 0) {
                const formats = ['.slide-format-1-1', '.slide-format-4-5', '.slide-format-9-16'];
                const allSlides = [];
                
                formats.forEach(format => {
                    const formatSlides = document.querySelectorAll(format);
                    if (formatSlides[activeSlideIndex]) {
                        allSlides.push(formatSlides[activeSlideIndex]);
                    }
                });
                
                slides = allSlides;
                console.log('Slides found by position fallback:', slides.length);
            }
            
            if (slides.length === 0) {
                console.warn('No slides found for index:', activeSlideIndex);
                showNotification('Сначала выберите слайд (кликните по нему)', 'warning');
                return;
            }
            
            slides.forEach(slide => {
                const contentWrapper = slide.querySelector('.slide-content-wrapper') || slide;
                
                let newElement;
                if (type === 'emoji') {
                    newElement = document.createElement('div');
                    newElement.className = 'emoji editable-text';
                    newElement.dataset.textType = 'emoji';
                    newElement.textContent = '😊';
                    newElement.style.fontSize = '80px';
                } else if (type === 'title') {
                    newElement = document.createElement('h2');
                    newElement.className = 'editable-text'; 
                    newElement.dataset.textType = 'title';
                    newElement.textContent = 'Новый Заголовок';
                    newElement.style.fontSize = '36px';
                    newElement.style.color = '#ffffff';
                    newElement.style.marginBottom = '10px';
                } else if (type === 'text') {
                    newElement = document.createElement('p');
                    newElement.className = 'subtitle editable-text';
                    newElement.dataset.textType = 'subtitle';
                    newElement.textContent = 'Текст описания';
                    newElement.style.fontSize = '18px';
                    newElement.style.color = '#ffffff';
                    newElement.style.marginBottom = '10px';
                } else if (type === 'image') {
                    // Create hidden file input for image upload
                    const fileInput = document.createElement('input');
                    fileInput.type = 'file';
                    fileInput.accept = 'image/*';
                    fileInput.style.display = 'none';

                    fileInput.addEventListener('change', (e) => {
                        const file = e.target.files[0];
                        if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                                const imageData = event.target.result;
                                const allSlides = document.querySelectorAll(`.slide[data-slide-index="${activeSlideIndex}"]`);
                                if (allSlides.length > 0 && typeof addImageToSlide === 'function') {
                                    allSlides.forEach(slide => {
                                        addImageToSlide(slide, imageData, activeSlideIndex);
                                    });
                                    saveToLocalStorage();
                                }
                            };
                            reader.readAsDataURL(file);
                        }
                    });

                    // Trigger file selection dialog
                    fileInput.click();
                }
                
                if (newElement) {
                    contentWrapper.appendChild(newElement);
                }
            });
            
            showNotification('Элемент добавлен', 'success');
            saveToLocalStorage();
            
            // Update layers panel
            if (typeof renderLayersPanel === 'function') {
                renderLayersPanel();
            }
        });
    });
}
function updatePreviewMode() {
    const previewBoth = document.getElementById('preview-both');
    const slides11 = document.querySelectorAll('.slide-format-1-1');
    const slides45 = document.querySelectorAll('.slide-format-4-5');
    const slides916 = document.querySelectorAll('.slide-format-9-16');
    
    const show11 = (show) => slides11.forEach(s => s.style.display = show ? 'flex' : 'none');
    const show45 = (show) => slides45.forEach(s => s.style.display = show ? 'flex' : 'none');
    const show916 = (show) => slides916.forEach(s => s.style.display = show ? 'flex' : 'none');
    
    if (previewBoth && previewBoth.checked) {
        // Показываем ВСЕ форматы
        show11(true);
        show45(true);
        show916(true);
        
        // Убеждаемся, что контейнер в горизонтальном режиме
        document.querySelectorAll('.slides-preview-container').forEach(container => {
            container.style.flexDirection = 'row';
        });
    } else {
        // Показываем только активный формат
        const activeFormat = document.querySelector('.format-btn.active[data-format]');
        const format = activeFormat ? activeFormat.dataset.format : '1-1';
        
        show11(format === '1-1');
        show45(format === '4-5');
        show916(format === '9-16');
    }
}

// Инициализация кнопок формата
function initFormatButtons() {
    const formatButtons = document.querySelectorAll('.format-btn[data-format]');
    const previewBoth = document.getElementById('preview-both');
    
    formatButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            formatButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            updatePreviewMode();
        });
    });
    
    // Обработчик чекбокса превью
    if (previewBoth) {
        previewBoth.addEventListener('change', () => {
            updatePreviewMode();
        });
    }
}

// Функция для обновления кнопок формата
function updateFormatButtons() {
    // Кнопки уже инициализированы, просто обновляем формат слайдов
    updatePreviewMode();
}
