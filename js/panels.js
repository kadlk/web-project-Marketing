// Функция для создания панели настроек контейнера изображений
function createContainerSettingsPanel() {
    // Удаляем старую панель если есть
    const oldPanel = document.getElementById('container-settings-panel');
    if (oldPanel) {
        oldPanel.remove();
    }
    
    const panel = document.createElement('div');
    panel.id = 'container-settings-panel';
    panel.className = 'image-size-panel';
    panel.style.display = 'none';
    
    panel.innerHTML = `
        <div class="size-panel-header">
            <div style="display: flex; gap: 10px;">
                <button class="panel-tab-btn active" data-tab="layout">Настройки</button>
                <button class="panel-tab-btn" data-tab="background">Фон</button>
            </div>
            <button class="close-panel-btn">×</button>
        </div>
        
        <div class="size-panel-content" style="max-height: 80vh; overflow-y: auto; overflow-x: hidden;">
            <!-- ТАБ 1: Макет (существующие настройки) -->
            <div id="panel-tab-layout" class="panel-tab-content">
                <div id="size-control-group" style="margin-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px;">
                    <label style="font-size: 13px;">Размер: <span id="image-size-value">60</span>%</label>
                    <div style="display: flex; gap: 5px; align-items: center;">
                        <input type="range" id="image-size-slider" min="10" max="100" value="60" style="width: 70%; margin: 5px 0;">
                        <input type="number" id="image-size-input" min="10" max="100" value="60" style="width: 30%; padding: 4px; font-size: 12px;">
                    </div>

                    <label style="font-size: 13px; margin-top: 10px; display: block;">Масштаб: <span id="image-scale-value">100</span>%</label>
                    <div style="display: flex; gap: 5px; align-items: center;">
                        <input type="range" id="image-scale-slider" min="10" max="200" value="100" step="5" style="width: 70%; margin: 5px 0;">
                        <input type="number" id="image-scale-input" min="10" max="200" value="100" step="5" style="width: 30%; padding: 4px; font-size: 12px;">
                    </div>
                </div>
                
                <div style="margin-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px;">
                    <label style="font-size: 13px; font-weight: bold; margin-bottom: 8px; display: block;">Шаблоны раскладки:</label>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; margin-bottom: 8px;">
                        <button class="layout-preset-btn" data-preset="2-row" title="2 в ряд" style="padding: 8px 4px; font-size: 11px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 6px; color: white; cursor: pointer;">
                            <div style="display: flex; gap: 2px; justify-content: center; margin-bottom: 3px;">
                                <div style="width: 16px; height: 12px; background: rgba(255,255,255,0.5); border-radius: 2px;"></div>
                                <div style="width: 16px; height: 12px; background: rgba(255,255,255,0.5); border-radius: 2px;"></div>
                            </div>
                            2 в ряд
                        </button>
                        <button class="layout-preset-btn" data-preset="3-row" title="3 в ряд" style="padding: 8px 4px; font-size: 11px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 6px; color: white; cursor: pointer;">
                            <div style="display: flex; gap: 2px; justify-content: center; margin-bottom: 3px;">
                                <div style="width: 10px; height: 12px; background: rgba(255,255,255,0.5); border-radius: 2px;"></div>
                                <div style="width: 10px; height: 12px; background: rgba(255,255,255,0.5); border-radius: 2px;"></div>
                                <div style="width: 10px; height: 12px; background: rgba(255,255,255,0.5); border-radius: 2px;"></div>
                            </div>
                            3 в ряд
                        </button>
                        <button class="layout-preset-btn" data-preset="4-row" title="4 в ряд" style="padding: 8px 4px; font-size: 11px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 6px; color: white; cursor: pointer;">
                            <div style="display: flex; gap: 2px; justify-content: center; margin-bottom: 3px;">
                                <div style="width: 8px; height: 12px; background: rgba(255,255,255,0.5); border-radius: 2px;"></div>
                                <div style="width: 8px; height: 12px; background: rgba(255,255,255,0.5); border-radius: 2px;"></div>
                                <div style="width: 8px; height: 12px; background: rgba(255,255,255,0.5); border-radius: 2px;"></div>
                                <div style="width: 8px; height: 12px; background: rgba(255,255,255,0.5); border-radius: 2px;"></div>
                            </div>
                            4 в ряд
                        </button>
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px;">
                        <button class="layout-preset-btn" data-preset="1-big-center" title="1 большая по центру" style="padding: 8px 4px; font-size: 11px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 6px; color: white; cursor: pointer;">
                            <div style="display: flex; gap: 2px; justify-content: center; align-items: center; margin-bottom: 3px;">
                                <div style="width: 24px; height: 18px; background: rgba(255,255,255,0.5); border-radius: 2px;"></div>
                            </div>
                            1 большая
                        </button>
                        <button class="layout-preset-btn" data-preset="small-big-small" title="Маленькая-Большая-Маленькая" style="padding: 8px 4px; font-size: 11px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 6px; color: white; cursor: pointer;">
                            <div style="display: flex; gap: 2px; justify-content: center; align-items: center; margin-bottom: 3px;">
                                <div style="width: 8px; height: 10px; background: rgba(255,255,255,0.5); border-radius: 2px;"></div>
                                <div style="width: 16px; height: 14px; background: rgba(255,255,255,0.5); border-radius: 2px;"></div>
                                <div style="width: 8px; height: 10px; background: rgba(255,255,255,0.5); border-radius: 2px;"></div>
                            </div>
                            М-Б-М
                        </button>
                        <button class="layout-preset-btn" data-preset="2x2-grid" title="Сетка 2x2" style="padding: 8px 4px; font-size: 11px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 6px; color: white; cursor: pointer;">
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2px; justify-items: center; margin-bottom: 3px;">
                                <div style="width: 12px; height: 10px; background: rgba(255,255,255,0.5); border-radius: 2px;"></div>
                                <div style="width: 12px; height: 10px; background: rgba(255,255,255,0.5); border-radius: 2px;"></div>
                                <div style="width: 12px; height: 10px; background: rgba(255,255,255,0.5); border-radius: 2px;"></div>
                                <div style="width: 12px; height: 10px; background: rgba(255,255,255,0.5); border-radius: 2px;"></div>
                            </div>
                            Сетка 2x2
                        </button>
                        <button class="layout-preset-btn" data-preset="column" title="В колонку" style="padding: 8px 4px; font-size: 11px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 6px; color: white; cursor: pointer;">
                            <div style="display: flex; flex-direction: column; gap: 2px; align-items: center; margin-bottom: 3px;">
                                <div style="width: 20px; height: 6px; background: rgba(255,255,255,0.5); border-radius: 2px;"></div>
                                <div style="width: 20px; height: 6px; background: rgba(255,255,255,0.5); border-radius: 2px;"></div>
                            </div>
                            Колонка
                        </button>
                    </div>
                </div>

                <div style="margin-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px;">
                    <label style="font-size: 13px; font-weight: bold; margin-bottom: 5px; display: block;">Режим позиционирования:</label>
                    <div style="display: flex; gap: 5px; margin: 5px 0;">
                        <button id="positioning-mode-flex" class="positioning-mode-btn active" title="Flex Layout" style="flex: 1; padding: 8px; font-size: 12px; background: rgba(59, 130, 246, 0.3); border: 1px solid #3b82f6;">📐 Flex Layout</button>
                        <button id="positioning-mode-free" class="positioning-mode-btn" title="Свободное позиционирование" style="flex: 1; padding: 8px; font-size: 12px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.3);">✋ Свободное</button>
                    </div>
                    <p style="font-size: 10px; color: #aaa; margin-top: 5px; line-height: 1.3;">Flex - автоматическое выравнивание. Свободное - перетаскивайте картинки куда хотите.</p>
                </div>

                <div id="flex-mode-controls">
                    <div style="margin-bottom: 10px;">
                        <label style="font-size: 13px;">Направление:</label>
                        <div style="display: flex; gap: 5px; margin: 5px 0;">
                            <button class="align-container-btn dir-btn" data-dir="row" title="В ряд" style="padding: 5px; font-size: 12px;">В ряд ➡</button>
                            <button class="align-container-btn dir-btn" data-dir="column" title="В колонку" style="padding: 5px; font-size: 12px;">В колонку ⬇</button>
                        </div>
                    </div>
                    <div style="margin-bottom: 10px;">
                        <label style="font-size: 13px;">
                            <input type="checkbox" id="container-wrap-checkbox" style="margin-right: 5px;">
                            Перенос на новую строку
                        </label>
                    </div>
                <div style="margin-bottom: 10px;">
                    <label style="font-size: 13px;">Отступы: <span id="container-gap-value">15</span>px</label>
                    <div style="display: flex; gap: 5px; align-items: center;">
                        <input type="range" id="container-gap-slider" min="0" max="100" value="15" style="width: 70%; margin: 5px 0;">
                        <input type="number" id="container-gap-input" min="0" max="100" value="15" style="width: 30%; padding: 4px; font-size: 12px;">
                    </div>
                </div>
                <div style="margin-bottom: 10px;">
                    <label style="font-size: 13px;">Высота области: <span id="container-height-value">auto</span></label>
                    <div style="display: flex; gap: 5px; align-items: center;">
                        <input type="range" id="container-height-slider" min="0" max="500" value="0" style="width: 70%; margin: 5px 0;">
                        <input type="number" id="container-height-input" min="0" max="500" value="0" placeholder="auto" style="width: 30%; padding: 4px; font-size: 12px;">
                    </div>
                    <p style="font-size: 10px; color: #888; margin-top: 2px;">0 = авто, иначе фиксированная высота в px</p>
                </div>
                <div style="margin-bottom: 10px;">
                    <label style="font-size: 13px;" id="align-label">Выравнивание:</label>
                    <div id="align-buttons-row" style="display: flex; gap: 5px; margin: 5px 0;">
                        <button class="align-container-btn align-btn-control" data-align="flex-start" title="В начало" style="padding: 5px; font-size: 12px;">⬅</button>
                        <button class="align-container-btn align-btn-control" data-align="center" title="По центру" style="padding: 5px; font-size: 12px;">⬌</button>
                        <button class="align-container-btn align-btn-control" data-align="flex-end" title="В конец" style="padding: 5px; font-size: 12px;">➡</button>
                        <button class="align-container-btn align-btn-control" data-align="space-between" title="Распределить" style="padding: 5px; font-size: 12px;">⬌⬌</button>
                    </div>
                </div>
                    <div style="margin-bottom: 10px;">
                        <label style="font-size: 13px;">Округление: <span id="container-radius-value">0</span>px</label>
                        <div style="display: flex; gap: 5px; align-items: center;">
                            <input type="range" id="container-radius-slider" min="0" max="50" value="0" style="width: 70%; margin: 5px 0;">
                            <input type="number" id="container-radius-input" min="0" max="50" value="0" style="width: 30%; padding: 4px; font-size: 12px;">
                        </div>
                    </div>
                </div>
            </div>

            <!-- ТАБ 2: Фон и Бэкдроп -->
            <div id="panel-tab-background" class="panel-tab-content" style="display: none;">
                <!-- Основной Фон -->
                <div style="margin-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px;">
                    <label style="font-size: 13px; font-weight: bold; margin-bottom: 5px; display: block;">Основной фон слайда</label>
                    <select id="bg-type-select" style="width: 100%; padding: 5px; margin-bottom: 10px; background: rgba(0,0,0,0.3); color: white; border: 1px solid #555;">
                        <option value="gradient">Градиент</option>
                        <option value="solid">Сплошной цвет</option>
                    </select>
                    
                    <div id="bg-colors-group">
                        <div style="display: flex; gap: 5px; margin-bottom: 5px;">
                            <input type="color" id="bg-color-1" style="flex: 1; height: 30px;">
                            <input type="color" id="bg-color-2" style="flex: 1; height: 30px;">
                        </div>
                        <div id="bg-direction-group">
                             <label style="font-size: 12px;">Угол: <span id="bg-angle-value">135</span>°</label>
                             <input type="range" id="bg-angle-slider" min="0" max="360" value="135" style="width: 100%;">
                        </div>
                    </div>
                    
                    <div id="bg-presets-group" style="margin-top: 15px;">
                        <label style="font-size: 12px; margin-bottom: 8px; display: block; color: #aaa;">ТОП-10 Маркетинг (для белого текста):</label>
                        <div id="gradient-presets-container" style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px;"></div>
                    </div>
                </div>

                <!-- Бэкдроп -->
                <div>
                     <label style="font-size: 13px; font-weight: bold; margin-bottom: 5px; display: block;">Фоновый элемент (Backdrop)</label>
                     <p style="font-size: 11px; color: #aaa; margin-bottom: 8px;">Эмоджи или картинка поверх фона, но под контентом.</p>
                     
                     <select id="backdrop-type-select" style="width: 100%; padding: 5px; margin-bottom: 10px; background: rgba(0,0,0,0.3); color: white; border: 1px solid #555;">
                        <option value="none">Нет</option>
                        <option value="emoji">Эмоджи</option>
                        <option value="image">Картинка</option>
                    </select>
                    
                    <div id="backdrop-emoji-group" style="display: none;">
                        <label style="font-size: 12px;">Символ:</label>
                        <input type="text" id="backdrop-emoji-input" placeholder="🎁" style="width: 100%; padding: 5px; margin-bottom: 10px;">
                    </div>
                    
                    <div id="backdrop-image-group" style="display: none;">
                         <label style="font-size: 12px;">URL Картинки:</label>
                         <input type="text" id="backdrop-image-input" placeholder="https://..." style="width: 100%; padding: 5px; margin-bottom: 5px;">
                         <button id="backdrop-upload-btn" style="width: 100%; padding: 5px; font-size: 12px;">Загрузить файл...</button>
                         <input type="file" id="backdrop-file-hidden" style="display: none;" accept="image/*">
                    </div>
                    
                    <div id="backdrop-settings-group" style="display: none;">
                        <div style="margin-bottom: 5px;">
                            <label style="font-size: 12px;">Размер: <span id="backdrop-size-value">200</span>px</label>
                            <input type="range" id="backdrop-size-slider" min="50" max="1000" value="200" style="width: 100%;">
                        </div>
                        <div style="margin-bottom: 5px;">
                            <label style="font-size: 12px;">Прозрачность: <span id="backdrop-opacity-value">10</span>%</label>
                            <input type="range" id="backdrop-opacity-slider" min="0" max="100" value="10" style="width: 100%;">
                        </div>
                        <div style="margin-bottom: 5px;">
                             <label style="font-size: 12px;">Позиция X/Y (%):</label>
                             <div style="display: flex; gap: 5px;">
                                <input type="number" id="backdrop-x" value="50" min="0" max="100" style="width: 50%;">
                                <input type="number" id="backdrop-y" value="50" min="0" max="100" style="width: 50%;">
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(panel);
    
    // Переключение табов
    const tabBtns = panel.querySelectorAll('.panel-tab-btn');
    const tabContents = panel.querySelectorAll('.panel-tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
             tabBtns.forEach(b => b.classList.remove('active'));
             tabContents.forEach(c => c.style.display = 'none');
             
             btn.classList.add('active');
             const tabName = btn.dataset.tab;
             const content = document.getElementById(`panel-tab-${tabName}`);
             if (content) content.style.display = 'block';
        });
    });

    // Обработчики
    const closeBtn = panel.querySelector('.close-panel-btn');
    
    // Layout Tab Elements
    const sizeSlider = panel.querySelector('#image-size-slider');
    const sizeInput = panel.querySelector('#image-size-input');
    const sizeValue = panel.querySelector('#image-size-value');

    const scaleSlider = panel.querySelector('#image-scale-slider');
    const scaleInput = panel.querySelector('#image-scale-input');
    const scaleValue = panel.querySelector('#image-scale-value');

    const gapSlider = panel.querySelector('#container-gap-slider');
    const gapInput = panel.querySelector('#container-gap-input');
    const gapValue = panel.querySelector('#container-gap-value');
    const radiusSlider = panel.querySelector('#container-radius-slider');
    const radiusInput = panel.querySelector('#container-radius-input');
    const radiusValue = panel.querySelector('#container-radius-value');
    const heightSlider = panel.querySelector('#container-height-slider');
    const heightInput = panel.querySelector('#container-height-input');
    const heightValue = panel.querySelector('#container-height-value');
    const wrapCheckbox = panel.querySelector('#container-wrap-checkbox');
    const alignButtons = panel.querySelectorAll('.align-btn-control');
    const alignButtonsRow = panel.querySelector('#align-buttons-row');
    const dirButtons = panel.querySelectorAll('.dir-btn');
    
    // Background Tab Elements
    const bgTypeSelect = panel.querySelector('#bg-type-select');
    const bgColor1 = panel.querySelector('#bg-color-1');
    const bgColor2 = panel.querySelector('#bg-color-2');
    const bgAngleSlider = panel.querySelector('#bg-angle-slider');
    const bgAngleValue = panel.querySelector('#bg-angle-value');
    
    const backdropTypeSelect = panel.querySelector('#backdrop-type-select');
    
    const backdropEmojiGroup = panel.querySelector('#backdrop-emoji-group');
    const backdropEmojiInput = panel.querySelector('#backdrop-emoji-input');
    
    const backdropImageGroup = panel.querySelector('#backdrop-image-group');
    const backdropImageInput = panel.querySelector('#backdrop-image-input');
    const backdropUploadBtn = panel.querySelector('#backdrop-upload-btn');
    const backdropFileHidden = panel.querySelector('#backdrop-file-hidden');
    
    const backdropSettingsGroup = panel.querySelector('#backdrop-settings-group');
    const backdropSizeSlider = panel.querySelector('#backdrop-size-slider');
    const backdropSizeValue = panel.querySelector('#backdrop-size-value');
    const backdropOpacitySlider = panel.querySelector('#backdrop-opacity-slider');
    const backdropOpacityValue = panel.querySelector('#backdrop-opacity-value');
    const backdropX = panel.querySelector('#backdrop-x');
    const backdropY = panel.querySelector('#backdrop-y');
    
    // Helpers
    const updateSizeValue = (value) => {
        const size = parseInt(value);
        sizeValue.textContent = size;
        sizeSlider.value = size;
        sizeInput.value = size;
    };
    
    const updateGapValue = (value) => {
        const gap = parseInt(value);
        gapValue.textContent = gap;
        gapSlider.value = gap;
        gapInput.value = gap;
    };
    
    const updateRadiusValue = (value) => {
        const radius = parseInt(value);
        radiusValue.textContent = radius;
        radiusSlider.value = radius;
        radiusInput.value = radius;
    };

    const updateScaleValue = (value) => {
        const scale = parseInt(value);
        scaleValue.textContent = scale;
        scaleSlider.value = scale;
        scaleInput.value = scale;
    };

    const updateHeightValue = (value) => {
        const height = parseInt(value);
        heightValue.textContent = height === 0 ? 'auto' : height + 'px';
        heightSlider.value = height;
        heightInput.value = height;
    };

    const updateAlignButtonIcons = (direction) => {
        const btns = alignButtonsRow.querySelectorAll('.align-btn-control');
        btns.forEach(btn => {
            const align = btn.dataset.align;
            if (direction === 'row') {
                if (align === 'flex-start') btn.textContent = '⬅';
                else if (align === 'flex-end') btn.textContent = '➡';
            } else {
                if (align === 'flex-start') btn.textContent = '⬆';
                else if (align === 'flex-end') btn.textContent = '⬇';
            }
        });
    };

    // --- Layout Logic ---
    let settingsStateSaved = false;
    panel._settingsStateSaved = false;
    
    const applyLayoutSettings = () => {
         if (!panel._settingsStateSaved) {
            saveStateForUndo();
            panel._settingsStateSaved = true;
        }

        // Apply Image Size
        if (selectedImage) {
            const size = parseInt(sizeInput.value);
            const finalSize = size < 10 ? 10 : (size > 100 ? 100 : size);
            const slide = selectedImage.closest('.slide');
            const is916 = slide && slide.classList.contains('format-9-16');
            const format = is916 ? '9-16' : '1-1';
            const sizeKey = selectedImage.dataset.sizeKey;

            if (sizeKey) {
                const formatSizeKey = `${sizeKey}_${format}`;
                imageSizes[formatSizeKey] = finalSize;
                selectedImage.style.setProperty('max-width', finalSize + '%', 'important');
            }

            // Apply Image Scale (для режима свободного позиционирования)
            const wrapper = selectedImage.closest('.uploaded-image-wrapper');
            if (wrapper && wrapper.classList.contains('free-positioning-active')) {
                const scale = parseInt(scaleInput.value);
                const finalScale = (scale < 10 ? 10 : (scale > 200 ? 200 : scale)) / 100;

                const slideIndex = slide.dataset.slideIndex;
                const scaleKey = `${slideIndex}_${sizeKey}_scale`;

                // Сохраняем масштаб в глобальную переменную
                if (typeof imageScales !== 'undefined') {
                    imageScales[scaleKey] = finalScale;
                }

                // Применяем scale через transform (не меняем width/height!)
                wrapper.style.transform = `scale(${finalScale})`;
                wrapper.style.transformOrigin = '0 0';

                // Обновляем визуальные размеры в dataset
                const originalWidth = parseFloat(wrapper.dataset.originalWidth) || wrapper.offsetWidth;
                const originalHeight = parseFloat(wrapper.dataset.originalHeight) || wrapper.offsetHeight;

                wrapper.dataset.visualWidth = originalWidth * finalScale;
                wrapper.dataset.visualHeight = originalHeight * finalScale;

                // Синхронизируем с другими форматами
                if (typeof syncScaleAcrossFormats === 'function') {
                    syncScaleAcrossFormats(parseInt(slideIndex), sizeKey, finalScale);
                }

                // Сохраняем позиции
                if (typeof saveImagePositions === 'function') {
                    saveImagePositions();
                }
            }
        }

        // Apply Container
        if (selectedImageContainer) {
            const slide = selectedImageContainer.closest('.slide');
            const is916 = slide && slide.classList.contains('format-9-16');
            const format = is916 ? '9-16' : '1-1';

            const slideIndex = parseInt(selectedImageContainer.dataset.slideIndex);
            const settingsKey = `container_${slideIndex}_${format}`;

            const gap = parseInt(gapInput.value);
            const finalGap = gap < 0 ? 0 : (gap > 100 ? 100 : gap);

            const radius = parseInt(radiusInput.value);
            const finalRadius = radius < 0 ? 0 : (radius > 50 ? 50 : radius);

            const height = parseInt(heightInput.value);
            const finalHeight = height < 0 ? 0 : (height > 500 ? 500 : height);

            const wrap = wrapCheckbox.checked;

            const align = selectedImageContainer.dataset.justifyContent || 'center';
            const direction = selectedImageContainer.dataset.direction || 'row';

            console.log('[APPLY] Applying layout:', { align, direction, slideIndex, height: finalHeight, wrap });

            if (slideIndex !== null) {
                const selector = is916 ? '.slide.format-9-16' : '.slide:not(.format-9-16)';
                const targetSlides = document.querySelectorAll(selector);

                console.log('[APPLY] Found', targetSlides.length, 'target slides');

                targetSlides.forEach(s => {
                    const container = s.querySelector(`.slide-image-container[data-slide-index="${slideIndex}"]`);
                    if (container) {
                        container.style.gap = finalGap + 'px';
                        container.style.flexDirection = direction;
                        container.style.borderRadius = finalRadius + 'px';
                        container.style.flexWrap = wrap ? 'wrap' : 'nowrap';

                        if (finalHeight > 0) {
                            container.style.minHeight = finalHeight + 'px';
                        } else {
                            container.style.minHeight = '';
                        }

                        container.style.justifyContent = align;
                        container.style.alignItems = 'center';

                        if (wrap && direction === 'row') {
                            container.style.alignContent = align;
                        }

                        console.log('[APPLY] Container styles:', container.style.cssText);

                        const images = container.querySelectorAll('img');
                        images.forEach(img => {
                             img.style.borderRadius = finalRadius + 'px';
                        });
                    }
                });

                containerSettings[settingsKey] = {
                    gap: finalGap,
                    radius: finalRadius,
                    align: align,
                    direction: direction,
                    height: finalHeight,
                    wrap: wrap
                };
            }
        }
        
        // Re-run fitSlideContent
        if (selectedImageContainer) {
            const slide = selectedImageContainer.closest('.slide');
            if (slide && window.fitSlideContent) window.fitSlideContent(slide);
        } else if (selectedImage) {
            const slide = selectedImage.closest('.slide');
            if (slide && window.fitSlideContent) window.fitSlideContent(slide);
        }
    };
    
    // --- Background Logic ---
    const updateBackgroundUI = () => {
         const type = bgTypeSelect.value;
         const isGradient = type === 'gradient';
         bgColor2.style.display = isGradient ? 'block' : 'none';
         document.getElementById('bg-direction-group').style.display = isGradient ? 'block' : 'none';
    };
    
    const updateBackdropUI = () => {
        const type = backdropTypeSelect.value;
        backdropEmojiGroup.style.display = type === 'emoji' ? 'block' : 'none';
        backdropImageGroup.style.display = type === 'image' ? 'block' : 'none';
        backdropSettingsGroup.style.display = type === 'none' ? 'none' : 'block';
    };
    
    const applyBackgroundSettings = () => {
        if (!panel._settingsStateSaved) {
            saveStateForUndo();
            panel._settingsStateSaved = true;
        }

        const currentSlideInfo = getCurrentSlideInfo();
        if (!currentSlideInfo) return;
        
        const { id } = currentSlideInfo;
        const key = `${currentProjectId}_${id}`;
        if (!slideSettings[key]) slideSettings[key] = {};
        
        // Background
        const bgType = bgTypeSelect.value;
        const c1 = bgColor1.value;
        const c2 = bgColor2.value;
        const angle = parseInt(bgAngleSlider.value);
        bgAngleValue.textContent = angle;
        
        let bgStyle = '';
        if (bgType === 'solid') {
            bgStyle = c1;
        } else {
            bgStyle = `linear-gradient(${angle}deg, ${c1}, ${c2})`;
        }
        
        // Save
        slideSettings[key].background = bgStyle;
        
        // Apply to current visible slide(s) of this index
        // Since settings are per slide (1-1 and 9-16 usually share content but can be different? No, usually shared visual content)
        // Let's apply to both formats for this slide index
        const slides = document.querySelectorAll('.slide');
        // This logic is tricky because we need to find "Slide X" regardless of format.
        // We can use the 'id' which we found.
        // Assuming slides are generated in order, or we can use the loop index.
        // But 'getCurrentSlideInfo' relies on selection.
        
        // Let's refine getCurrentSlideInfo to give us the DOM element or index.
        const slideIndex = currentSlideInfo.index; // 0-based index
        
        // Apply Background to all formats of this slide
        // We need to target .slide where index == slideIndex
        // But slides are just in DOM list.
        // 1-1 are first, then 9-16 (or interleaved? no, usually consecutive in list or filtered)
        // Wait, 'generateSlides' clears container.
        // `generateSlides` renders:
        // project.slides.forEach((slideData, index) => {
        //    createSlideFromJSON(slideData, index, '1-1');
        //    createSlideFromJSON(slideData, index, '9-16');
        // });
        // So slide 0 is at DOM index 0 and 1. Slide 1 is at 2 and 3.
        
        // So we target all .slide that correspond to this data index.
        // Let's look up all slides and check dataset or something?
        // createSlideFromJSON doesn't set data-index on .slide but on elements inside.
        // Let's check:
        // const slide = document.createElement('div');
        // slide.className = `slide format-${format}`;
        
        // We should add data-slide-index to .slide in generator!
        // But for now, we rely on selection.
        
        // Assuming 'selectedImageContainer' or 'selectedImage' is inside the slide we want to edit.
        let targetSlide = null;
        if (selectedImage) targetSlide = selectedImage.closest('.slide');
        else if (selectedImageContainer) targetSlide = selectedImageContainer.closest('.slide');
        
        if (targetSlide) {
             // Find its index in its format group?
             // Or better, let's assume we modify the specific slide we clicked, AND its counterpart.
             // But simpler: just modify specific slide logic in generateSlides reads from global `slideSettings`.
             // So here we just update `slideSettings` and RE-APPLY simple styles to DOM.
             
             // How to find the index?
             // targetSlide doesn't have index attribute.
             // But we have `currentSlideInfo.index`.
             const idx = currentSlideInfo.index; // verified helper below
             
             // Apply to DOM
             const visualSlides = [];
             // find all slides that seem to match this index
             // This is hacky without 'data-index' on .slide. 
             // Ideally I should add data-index to slide.
             
             // For now, let's just use what we have.
             if (targetSlide) {
                 targetSlide.style.background = bgStyle;
                 visualSlides.push(targetSlide);
             }
             
             // Try to find counterpart
             // ...
        }
        
        // Backdrop
        const bdType = backdropTypeSelect.value;
        const bdEmoji = backdropEmojiInput.value;
        const bdImg = backdropImageInput.value; // Or uploaded file
        const bdSize = parseInt(backdropSizeSlider.value);
        backdropSizeValue.textContent = bdSize;
        const bdOpacity = parseInt(backdropOpacitySlider.value);
        backdropOpacityValue.textContent = bdOpacity;
        const bdX = parseInt(backdropX.value);
        const bdY = parseInt(backdropY.value);
        
        slideSettings[key].backdrop = {
            type: bdType,
            emoji: bdEmoji,
            image: bdImg, // handle upload separately?
            size: bdSize,
            opacity: bdOpacity / 100,
            x: bdX,
            y: bdY
        };
        
        // Apply Backdrop to DOM
        if (targetSlide) updateBackdropDOM(targetSlide, slideSettings[key].backdrop);
    };
    
    // Helper to identify slide index
    const getCurrentSlideInfo = () => {
        let slide = null;
        if (selectedImage) slide = selectedImage.closest('.slide');
        else if (selectedImageContainer) slide = selectedImageContainer.closest('.slide');
        
        if (!slide) return null;
        
        // Determine index. 
        // Iterate all slides of same format to find text index
        const is916 = slide.classList.contains('format-9-16');
        const selector = is916 ? '.slide.format-9-16' : '.slide:not(.format-9-16)';
        const all = Array.from(document.querySelectorAll(selector));
        const index = all.indexOf(slide);
        
        return { index: index, id: index + 1 }; // 1-based ID for keys
    };
    
    // Update Backdrop DOM
    const updateBackdropDOM = (slide, settings) => {
        let layer = slide.querySelector('.backdrop-layer');
        if (!layer) {
            layer = document.createElement('div');
            layer.className = 'backdrop-layer';
            // Insert as first child
            slide.insertBefore(layer, slide.firstChild);
        }
        
        layer.innerHTML = ''; // Clear old
        
        if (settings.type === 'none') {
            return;
        }
        
        const el = document.createElement('div');
        el.className = 'backdrop-element';
        el.style.left = settings.x + '%';
        el.style.top = settings.y + '%';
        el.style.transform = 'translate(-50%, -50%)';
        el.style.opacity = settings.opacity;
        el.style.fontSize = settings.size + 'px'; // For emoji
        el.style.width = settings.size + 'px'; // For image
        
        if (settings.type === 'emoji') {
            el.textContent = settings.emoji || '🎁';
            el.style.lineHeight = '1';
        } else if (settings.type === 'image') {
            const img = document.createElement('img');
            img.src = settings.image;
            img.style.width = '100%';
            img.style.height = 'auto';
            img.style.display = 'block';
            el.appendChild(img);
        }
        
        layer.appendChild(el);
    };

    // Event Listeners for Layout
    sizeSlider.addEventListener('input', (e) => { updateSizeValue(e.target.value); applyLayoutSettings(); });
    sizeInput.addEventListener('input', (e) => { updateSizeValue(e.target.value); applyLayoutSettings(); });

    scaleSlider.addEventListener('input', (e) => { updateScaleValue(e.target.value); applyLayoutSettings(); });
    scaleInput.addEventListener('input', (e) => { updateScaleValue(e.target.value); applyLayoutSettings(); });

    gapSlider.addEventListener('input', (e) => { updateGapValue(e.target.value); applyLayoutSettings(); });
    gapInput.addEventListener('input', (e) => { updateGapValue(e.target.value); applyLayoutSettings(); });
    
    radiusSlider.addEventListener('input', (e) => { updateRadiusValue(e.target.value); applyLayoutSettings(); });
    radiusInput.addEventListener('input', (e) => { updateRadiusValue(e.target.value); applyLayoutSettings(); });

    heightSlider.addEventListener('input', (e) => { updateHeightValue(e.target.value); applyLayoutSettings(); });
    heightInput.addEventListener('input', (e) => { updateHeightValue(e.target.value); applyLayoutSettings(); });

    wrapCheckbox.addEventListener('change', () => { applyLayoutSettings(); });

    alignButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (selectedImageContainer) {
                 alignButtons.forEach(b => b.classList.remove('active'));
                 btn.classList.add('active');

                 selectedImageContainer.dataset.justifyContent = btn.dataset.align;
                 console.log('[ALIGN] Button clicked:', btn.dataset.align, 'Container:', selectedImageContainer);
                 applyLayoutSettings();
            }
        });
    });
    
    dirButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
             if (selectedImageContainer) {
                 dirButtons.forEach(b => b.classList.remove('active'));
                 btn.classList.add('active');

                 selectedImageContainer.dataset.direction = btn.dataset.dir;
                 updateAlignButtonIcons(btn.dataset.dir);
                 applyLayoutSettings();
            }
        });
    });

    // Positioning Mode Buttons
    const flexModeBtn = panel.querySelector('#positioning-mode-flex');
    const freeModeBtn = panel.querySelector('#positioning-mode-free');
    const flexModeControls = panel.querySelector('#flex-mode-controls');

    flexModeBtn.addEventListener('click', () => {
        if (!selectedImageContainer) return;

        // Визуальное переключение кнопок
        flexModeBtn.classList.add('active');
        flexModeBtn.style.background = 'rgba(59, 130, 246, 0.3)';
        flexModeBtn.style.borderColor = '#3b82f6';

        freeModeBtn.classList.remove('active');
        freeModeBtn.style.background = 'rgba(255,255,255,0.1)';
        freeModeBtn.style.borderColor = 'rgba(255,255,255,0.3)';

        // Показываем flex controls
        flexModeControls.style.display = 'block';

        // Отключаем свободное позиционирование
        const slideIndex = parseInt(selectedImageContainer.dataset.slideIndex);
        toggleFreePositioningMode(slideIndex, false);
    });

    freeModeBtn.addEventListener('click', () => {
        if (!selectedImageContainer) return;

        // Визуальное переключение кнопок
        freeModeBtn.classList.add('active');
        freeModeBtn.style.background = 'rgba(139, 233, 253, 0.3)';
        freeModeBtn.style.borderColor = '#8be9fd';

        flexModeBtn.classList.remove('active');
        flexModeBtn.style.background = 'rgba(255,255,255,0.1)';
        flexModeBtn.style.borderColor = 'rgba(255,255,255,0.3)';

        // Скрываем flex controls
        flexModeControls.style.display = 'none';

        // Включаем свободное позиционирование
        const slideIndex = parseInt(selectedImageContainer.dataset.slideIndex);
        toggleFreePositioningMode(slideIndex, true);
    });

    // Layout Preset Buttons
    const layoutPresetBtns = panel.querySelectorAll('.layout-preset-btn');
    layoutPresetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (!selectedImageContainer) return;

            const preset = btn.dataset.preset;
            applyLayoutPreset(selectedImageContainer, preset);
        });

        btn.addEventListener('mouseenter', () => {
            btn.style.background = 'rgba(59, 130, 246, 0.3)';
            btn.style.borderColor = '#3b82f6';
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.background = 'rgba(255,255,255,0.1)';
            btn.style.borderColor = 'rgba(255,255,255,0.2)';
        });
    });

    // Initialize Gradient Presets
    const presetsContainer = panel.querySelector('#gradient-presets-container');
    const gradientPresets = [
        { name: 'Deep Blue', colors: ['#1e3a8a', '#3b82f6'], angle: 135 },
        { name: 'Purple Power', colors: ['#7e22ce', '#a855f7'], angle: 135 },
        { name: 'Teal Success', colors: ['#0f766e', '#14b8a6'], angle: 135 },
        { name: 'Midnight', colors: ['#0f172a', '#334155'], angle: 135 },
        { name: 'Hot Orange', colors: ['#c2410c', '#fb923c'], angle: 135 },
        { name: 'Berry Red', colors: ['#be123c', '#fb7185'], angle: 135 },
        { name: 'Ocean Breeze', colors: ['#0369a1', '#38bdf8'], angle: 135 },
        { name: 'Forest Green', colors: ['#14532d', '#22c55e'], angle: 135 },
        { name: 'Royal Gold', colors: ['#854d0e', '#facc15'], angle: 135 },
        { name: 'Classic Dark', colors: ['#18181b', '#3f3f46'], angle: 135 }
    ];

    if (presetsContainer) {
        gradientPresets.forEach(preset => {
            const btn = document.createElement('div');
            btn.style.width = '100%';
            btn.style.height = '30px';
            btn.style.borderRadius = '4px';
            btn.style.cursor = 'pointer';
            btn.style.background = `linear-gradient(${preset.angle}deg, ${preset.colors[0]}, ${preset.colors[1]})`;
            btn.style.border = '1px solid rgba(255,255,255,0.2)';
            btn.title = preset.name;
            
            btn.addEventListener('click', () => {
                bgTypeSelect.value = 'gradient';
                bgColor1.value = preset.colors[0];
                bgColor2.value = preset.colors[1];
                bgAngleSlider.value = preset.angle;
                
                updateBackgroundUI();
                applyBackgroundSettings();
            });
            
            presetsContainer.appendChild(btn);
        });
    }

    // Event Listeners for Background
    bgTypeSelect.addEventListener('change', () => { updateBackgroundUI(); applyBackgroundSettings(); });
    bgColor1.addEventListener('input', applyBackgroundSettings);
    bgColor2.addEventListener('input', applyBackgroundSettings);
    bgAngleSlider.addEventListener('input', applyBackgroundSettings);
    
    backdropTypeSelect.addEventListener('change', () => { updateBackdropUI(); applyBackgroundSettings(); });
    backdropEmojiInput.addEventListener('input', applyBackgroundSettings);
    backdropImageInput.addEventListener('input', applyBackgroundSettings);
    backdropSizeSlider.addEventListener('input', applyBackgroundSettings);
    backdropOpacitySlider.addEventListener('input', applyBackgroundSettings);
    backdropX.addEventListener('input', applyBackgroundSettings);
    backdropY.addEventListener('input', applyBackgroundSettings);
    
    // Handle File Upload for Backdrop
    backdropUploadBtn.addEventListener('click', () => backdropFileHidden.click());
    backdropFileHidden.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
             const reader = new FileReader();
             reader.onload = (ev) => {
                 backdropImageInput.value = ev.target.result;
                 applyBackgroundSettings();
             };
             reader.readAsDataURL(file);
        }
    });
    
    closeBtn.addEventListener('click', () => {
        panel.style.display = 'none';
        selectedImageContainer = null;
        selectedImage = null;
    });

    panel.addEventListener('click', (e) => {
        e.stopPropagation();
    });
    
    // Init state (defaults)
    updateBackgroundUI();
    updateBackdropUI();
    return panel;
}

// Показываем панель настроек контейнера
function applyLayoutPreset(container, preset) {
    if (!container) return;

    saveStateForUndo();

    const slide = container.closest('.slide');
    const is916 = slide && slide.classList.contains('format-9-16');
    const format = is916 ? '9-16' : '1-1';
    const slideIndex = parseInt(container.dataset.slideIndex);
    const settingsKey = `container_${slideIndex}_${format}`;

    const images = container.querySelectorAll('img');
    const imageCount = images.length;

    const presetConfigs = {
        '2-row': {
            direction: 'row',
            align: 'center',
            gap: 15,
            wrap: false,
            sizes: [48, 48]
        },
        '3-row': {
            direction: 'row',
            align: 'center',
            gap: 10,
            wrap: false,
            sizes: [30, 30, 30]
        },
        '4-row': {
            direction: 'row',
            align: 'center',
            gap: 8,
            wrap: false,
            sizes: [23, 23, 23, 23]
        },
        '1-big-center': {
            direction: 'row',
            align: 'center',
            gap: 0,
            wrap: false,
            sizes: [80]
        },
        'small-big-small': {
            direction: 'row',
            align: 'center',
            gap: 10,
            wrap: false,
            sizes: [20, 50, 20]
        },
        '2x2-grid': {
            direction: 'row',
            align: 'center',
            gap: 10,
            wrap: true,
            sizes: [45, 45, 45, 45]
        },
        'column': {
            direction: 'column',
            align: 'center',
            gap: 15,
            wrap: false,
            sizes: [60, 60]
        }
    };

    const config = presetConfigs[preset];
    if (!config) return;

    container.style.flexDirection = config.direction;
    container.style.justifyContent = config.align;
    container.style.alignItems = 'center';
    container.style.gap = config.gap + 'px';
    container.style.flexWrap = config.wrap ? 'wrap' : 'nowrap';

    if (config.wrap && config.direction === 'row') {
        container.style.alignContent = config.align;
    }

    container.dataset.justifyContent = config.align;
    container.dataset.direction = config.direction;

    images.forEach((img, i) => {
        const sizeForImage = config.sizes[i] || config.sizes[config.sizes.length - 1] || 30;
        img.style.setProperty('max-width', sizeForImage + '%', 'important');

        if (img.dataset.sizeKey) {
            const formatSizeKey = `${img.dataset.sizeKey}_${format}`;
            imageSizes[formatSizeKey] = sizeForImage;
        }
    });

    containerSettings[settingsKey] = {
        gap: config.gap,
        radius: containerSettings[settingsKey]?.radius || 0,
        align: config.align,
        direction: config.direction,
        height: containerSettings[settingsKey]?.height || 0,
        wrap: config.wrap
    };

    const selector = is916 ? '.slide.format-9-16' : '.slide:not(.format-9-16)';
    const otherSlides = document.querySelectorAll(selector);
    otherSlides.forEach(s => {
        if (s === slide) return;
        const otherContainer = s.querySelector(`.slide-image-container[data-slide-index="${slideIndex}"]`);
        if (otherContainer) {
            otherContainer.style.flexDirection = config.direction;
            otherContainer.style.justifyContent = config.align;
            otherContainer.style.alignItems = 'center';
            otherContainer.style.gap = config.gap + 'px';
            otherContainer.style.flexWrap = config.wrap ? 'wrap' : 'nowrap';

            if (config.wrap && config.direction === 'row') {
                otherContainer.style.alignContent = config.align;
            }

            const otherImages = otherContainer.querySelectorAll('img');
            otherImages.forEach((img, i) => {
                const sizeForImage = config.sizes[i] || config.sizes[config.sizes.length - 1] || 30;
                img.style.setProperty('max-width', sizeForImage + '%', 'important');
            });
        }
    });

    const panel = document.getElementById('container-settings-panel');
    if (panel) {
        panel.querySelector('#container-gap-slider').value = config.gap;
        panel.querySelector('#container-gap-input').value = config.gap;
        panel.querySelector('#container-gap-value').textContent = config.gap;

        panel.querySelector('#container-wrap-checkbox').checked = config.wrap;

        const dirBtns = panel.querySelectorAll('.dir-btn');
        dirBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.dir === config.direction) {
                btn.classList.add('active');
            }
        });

        const alignBtns = panel.querySelectorAll('.align-btn-control');
        alignBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.align === config.align) {
                btn.classList.add('active');
            }
            if (config.direction === 'row') {
                if (btn.dataset.align === 'flex-start') btn.textContent = '⬅';
                else if (btn.dataset.align === 'flex-end') btn.textContent = '➡';
            } else {
                if (btn.dataset.align === 'flex-start') btn.textContent = '⬆';
                else if (btn.dataset.align === 'flex-end') btn.textContent = '⬇';
            }
        });
    }

    if (slide && window.fitSlideContent) {
        window.fitSlideContent(slide);
    }

    saveToLocalStorage();
    showNotification('Шаблон применен', 'success');
}

function showContainerSettingsPanel(container, slideIndex, targetImage = null, slideRef = null) {
    console.log('showContainerSettingsPanel called:', { container: !!container, slideIndex, targetImage: !!targetImage, slideRef: !!slideRef });
    
    let panel = document.getElementById('container-settings-panel');
    const panelExisted = !!panel;
    if (!panel) {
        console.log('Creating new container settings panel');
        panel = createContainerSettingsPanel();
    }
    
    // Закрываем другие панели
    document.querySelectorAll('.text-edit-panel').forEach(p => p.style.display = 'none');
    document.querySelectorAll('.image-size-panel').forEach(p => {
        if (p.id !== 'container-settings-panel') p.style.display = 'none';
    });
    
    selectedImageContainer = container;
    
    // Detect format
    let slide = container ? container.closest('.slide') : slideRef;
    console.log('Slide found:', !!slide);
    
    const is916 = slide && slide.classList.contains('format-9-16');
    const format = is916 ? '9-16' : '1-1';
    console.log('Format detected:', format);
    
    // Handle Image Selection if specific image passed
    if (targetImage) {
        selectedImage = targetImage;
        const sizeGroup = panel.querySelector('#size-control-group');
        if (sizeGroup) sizeGroup.style.display = 'block';
        
        // Load size
        const sizeKey = targetImage.dataset.sizeKey;
        let currentSize = 100;
        if (sizeKey) {
             const formatSizeKey = `${sizeKey}_${format}`;
             currentSize = imageSizes[formatSizeKey];
             // Fallback to base key if format key not found (migration)
             if (!currentSize && imageSizes[sizeKey]) currentSize = imageSizes[sizeKey];
             if (!currentSize) currentSize = parseInt(targetImage.style.maxWidth) || 100;
        }

        panel.querySelector('#image-size-slider').value = currentSize;
        panel.querySelector('#image-size-input').value = currentSize;
        panel.querySelector('#image-size-value').textContent = currentSize;

        // Load scale
        let currentScale = 100;
        if (sizeKey) {
            const scaleKey = `${slideIndex}_${sizeKey}_scale`;
            if (typeof imageScales !== 'undefined' && imageScales[scaleKey]) {
                currentScale = Math.round(imageScales[scaleKey] * 100);
            }
        }

        panel.querySelector('#image-scale-slider').value = currentScale;
        panel.querySelector('#image-scale-input').value = currentScale;
        panel.querySelector('#image-scale-value').textContent = currentScale;
    } else {
        selectedImage = null; // No specific image selected (e.g. from general settings)
        // Hide size controls if we only want container settings? 
        // Or default to 'No image selected'?
        // The prompt implies we want to consolidate. 
        // If 'Settings' clicked on container, maybe just hide size or disable it.
        const sizeGroup = panel.querySelector('#size-control-group');
        if (sizeGroup) sizeGroup.style.display = 'none';
    }

    const settingsKey = `container_${slideIndex}_${format}`;
    const savedSettings = containerSettings[settingsKey] || {
        gap: 15,
        align: 'center',
        direction: 'row',
        radius: 0,
        height: 0,
        wrap: false
    };

    const currentGap = container ? (parseInt(container.style.gap) || savedSettings.gap || 15) : (savedSettings.gap || 15);
    const currentAlign = container ? (container.style.justifyContent || savedSettings.align || 'center') : (savedSettings.align || 'center');
    const currentDirection = container ? (container.style.flexDirection || savedSettings.direction || 'row') : (savedSettings.direction || 'row');
    const currentRadius = container ? (parseInt(container.style.borderRadius) || savedSettings.radius || 0) : (savedSettings.radius || 0);
    const currentHeight = container ? (parseInt(container.style.minHeight) || savedSettings.height || 0) : (savedSettings.height || 0);
    const currentWrap = container ? (container.style.flexWrap === 'wrap') : (savedSettings.wrap || false);

    if (container) {
        container.dataset.justifyContent = currentAlign;
        container.dataset.direction = currentDirection;
    }

    if (panel._settingsStateSaved !== undefined) {
        panel._settingsStateSaved = false;
    }

    panel.querySelector('#container-gap-slider').value = currentGap;
    panel.querySelector('#container-gap-input').value = currentGap;
    panel.querySelector('#container-gap-value').textContent = currentGap;

    panel.querySelector('#container-radius-slider').value = currentRadius;
    panel.querySelector('#container-radius-input').value = currentRadius;
    panel.querySelector('#container-radius-value').textContent = currentRadius;

    panel.querySelector('#container-height-slider').value = currentHeight;
    panel.querySelector('#container-height-input').value = currentHeight;
    panel.querySelector('#container-height-value').textContent = currentHeight === 0 ? 'auto' : currentHeight + 'px';

    panel.querySelector('#container-wrap-checkbox').checked = currentWrap;

    const alignButtonsRow = panel.querySelector('#align-buttons-row');
    const alignBtns = alignButtonsRow.querySelectorAll('.align-btn-control');
    alignBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.align === currentAlign) {
            btn.classList.add('active');
        }
        if (currentDirection === 'row') {
            if (btn.dataset.align === 'flex-start') btn.textContent = '⬅';
            else if (btn.dataset.align === 'flex-end') btn.textContent = '➡';
        } else {
            if (btn.dataset.align === 'flex-start') btn.textContent = '⬆';
            else if (btn.dataset.align === 'flex-end') btn.textContent = '⬇';
        }
    });

    const dirButtons = panel.querySelectorAll('.dir-btn');
    dirButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.dir === currentDirection) {
            btn.classList.add('active');
        }
    });
    
    // Удаляем избыточную логику переназначения обработчиков, так как createContainerSettingsPanel
    // уже назначает их корректно, используя глобальную переменную selectedImageContainer.
    // Повторное назначение через cloneNode может ломать ссылки или логику.
    
    // Позиционируем панель справа от контейнера превью слайдов
    const slideWrapper = container ? container.closest('.slide-wrapper') : (slideRef ? slideRef.closest('.slide-wrapper') : null);
    if (slideWrapper) {
        const previewContainer = slideWrapper.querySelector('.slides-preview-container');
        if (previewContainer) {
            const rect = previewContainer.getBoundingClientRect();

            panel.style.display = 'block';
            panel.style.visibility = 'hidden'; // Hide initially to measure height

            const panelHeight = panel.offsetHeight || 400; // Fallback height
            const topPos = rect.top + (rect.height / 2) - (panelHeight / 2);
            const leftPos = rect.right + 20;

            panel.style.top = Math.max(20, topPos) + 'px';
            panel.style.left = leftPos + 'px';
            panel.style.visibility = 'visible';
        }
    } else if (container) {
        // Fallback positioning if container exists
        const containerRect = container.getBoundingClientRect();
        panel.style.display = 'block';
        panel.style.top = containerRect.top + 'px';
        panel.style.left = (containerRect.right + 20) + 'px';
    } else {
        // Default positioning when no container exists
        panel.style.display = 'block';
        panel.style.top = '50%';
        panel.style.left = '50%';
        panel.style.transform = 'translate(-50%, -50%)';
    }
    
    panel.style.position = 'fixed';
    panel.style.zIndex = '100001';
    panel.style.opacity = '1';
    
    const panelRect = panel.getBoundingClientRect();
    if (panelRect.right > window.innerWidth) {
        panel.style.left = (window.innerWidth - panelRect.width - 20) + 'px';
    }
}

// Показываем панель управления размером (перенаправляем на единую панель настроек)
function showSizeControlPanel(img, slideIndex) {
    // Ищем контейнер - может быть как в flex, так и в free positioning режиме
    let container = img.closest('.slide-image-container');

    if (!container) {
        // Если не нашли через closest, ищем через wrapper и его parent
        const wrapper = img.closest('.uploaded-image-wrapper');
        if (wrapper) {
            // В режиме free positioning wrapper может быть внутри контейнера
            container = wrapper.parentElement;
            if (container && !container.classList.contains('slide-image-container')) {
                // Или контейнер может быть выше
                container = container.querySelector('.slide-image-container') ||
                           container.closest('.slide-image-container');
            }
        }
    }

    if (container) {
        showContainerSettingsPanel(container, slideIndex, img);
    } else {
        console.warn('Container not found for image, cannot open settings', img);
    }
}

// Функция для создания панели настройки текста
function createTextEditPanel() {
    const oldPanel = document.getElementById('text-edit-panel');
    if (oldPanel) oldPanel.remove();
    
    const panel = document.createElement('div');
    panel.id = 'text-edit-panel';
    panel.className = 'text-edit-panel';
    panel.style.display = 'none';
    
    panel.innerHTML = `
        <div class="panel-header">
            <h4>Редактирование текста</h4>
            <button class="close-panel-btn">×</button>
        </div>
        <div class="panel-content">
            <div style="margin-bottom: 10px;">
                <label>Шрифт:</label>
                <select id="text-font-family" style="width: 100%; padding: 5px; margin-top: 5px;">
                    <option value="'Comfortaa', cursive">Comfortaa</option>
                    <option value="'Inter', sans-serif">Inter</option>
                    <option value="'Roboto', sans-serif">Roboto</option>
                    <option value="'Open Sans', sans-serif">Open Sans</option>
                    <option value="'Montserrat', sans-serif">Montserrat</option>
                    <option value="'Playfair Display', serif">Playfair Display</option>
                    <option value="'Merriweather', serif">Merriweather</option>
                    <option value="'Caveat', cursive">Caveat</option>
                    <option value="'Pacifico', cursive">Pacifico</option>
                </select>
            </div>
            <div style="margin-bottom: 10px;">
                <label style="color: white; display: block;">Размер:</label>
                <input type="number" id="text-font-size" value="24" min="8" max="300" style="width: 100%; padding: 5px; margin-top: 5px;">
            </div>
            <div style="margin-bottom: 10px;">
                <label style="color: white; display: block;">Ширина: <span id="text-width-value">100</span>%</label>
                <input type="range" id="text-width-slider" min="10" max="200" value="100" style="width: 100%; margin-top: 5px;">
            </div>
            <div style="margin-bottom: 10px;">
                <label style="color: white; display: block;">Цвет:</label>
                <input type="color" id="text-color" value="#ffffff" style="width: 100%; height: 40px; margin-top: 5px;">
            </div>
            <div style="margin-bottom: 20px;">
                <label style="color: white; display: block;">Выравнивание:</label>
                <div style="display: flex; gap: 10px; margin-top: 5px;">
                    <button class="align-btn" data-align="left" title="По левому краю">⬅</button>
                    <button class="align-btn" data-align="center" title="По центру">⬌</button>
                    <button class="align-btn" data-align="right" title="По правому краю">➡</button>
                </div>
            </div>
            <div style="display: flex; gap: 10px;">
                <button id="apply-text-btn" class="apply-text-btn">Применить</button>
                <button id="delete-text-btn" style="background: #ef4444; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer;">Удалить</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(panel);
    
    // Обработчики
    const closeBtn = panel.querySelector('.close-panel-btn');
    const applyBtn = panel.querySelector('#apply-text-btn');
    const deleteBtn = panel.querySelector('#delete-text-btn');
    const fontSelect = panel.querySelector('#text-font-family');
    const fontSizeInput = panel.querySelector('#text-font-size');
    const colorInput = panel.querySelector('#text-color');
    const widthSlider = panel.querySelector('#text-width-slider');
    const widthValue = panel.querySelector('#text-width-value');
    const alignButtons = panel.querySelectorAll('.align-btn');
    
    // Флаг для отслеживания сохранения состояния
    panel._stateSaved = false;
    
    const applyStyles = () => {
        if (selectedTextElement) {
            if (!panel._stateSaved) {
                saveStateForUndo();
                panel._stateSaved = true;
            }
            
            selectedTextElement.style.fontFamily = fontSelect.value;
            selectedTextElement.style.fontSize = fontSizeInput.value + 'px';
            selectedTextElement.style.color = colorInput.value;
            
            // Update width value display
            widthValue.textContent = widthSlider.value;
            
            // Apply width - allow values over 100%
            selectedTextElement.style.width = widthSlider.value + '%';
            selectedTextElement.style.maxWidth = 'none'; // Remove max-width constraint
            
            selectedTextElement.style.textAlign = panel.querySelector('.align-btn.active').dataset.align;
            
            // Ensure display block for width to work if it's not
            if (window.getComputedStyle(selectedTextElement).display === 'inline') {
                selectedTextElement.style.display = 'inline-block';
            }
            
            saveToLocalStorage();
        }
    };
    
    // Show width zone while adjusting
    let widthIndicatorTimeout;
    const showWidthIndicator = () => {
        if (selectedTextElement) {
            selectedTextElement.style.outline = '3px dashed rgba(59, 130, 246, 0.8)';
            selectedTextElement.style.outlineOffset = '2px';
            selectedTextElement.style.backgroundColor = 'rgba(59, 130, 246, 0.05)';
        }
    };
    
    const hideWidthIndicator = () => {
        if (selectedTextElement) {
            clearTimeout(widthIndicatorTimeout);
            widthIndicatorTimeout = setTimeout(() => {
                selectedTextElement.style.outline = '';
                selectedTextElement.style.outlineOffset = '';
                selectedTextElement.style.backgroundColor = '';
            }, 1000);
        }
    };
    
    // Мгновенное применение изменений
    fontSelect.addEventListener('change', applyStyles);
    fontSizeInput.addEventListener('input', applyStyles);
    colorInput.addEventListener('input', applyStyles);
    
    widthSlider.addEventListener('input', () => {
        showWidthIndicator();
        applyStyles();
    });
    
    widthSlider.addEventListener('change', () => {
        hideWidthIndicator();
    });
    
    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        panel.style.display = 'none';
        selectedTextElement = null;
    });
    
    alignButtons.forEach(btn => {
        btn.addEventListener('click', () => {
             alignButtons.forEach(b => b.classList.remove('active'));
             btn.classList.add('active');
             applyStyles();
        });
    });
    
    applyBtn.addEventListener('click', () => {
        applyStyles();
        panel.style.display = 'none';
        selectedTextElement = null;
        panel._stateSaved = false;
    });
    
    deleteBtn.addEventListener('click', () => {
        if (selectedTextElement) {
            saveStateForUndo();
            selectedTextElement.remove();
            panel.style.display = 'none';
            selectedTextElement = null;
            saveToLocalStorage();
            showNotification('Текстовый блок удален', 'success');
        }
    });
    
    return panel;
}

// Показываем панель редактирования текста
function showTextEditPanel(textElement) {
    let panel = document.getElementById('text-edit-panel');
    if (!panel) {
        panel = createTextEditPanel();
    }
    
    selectedTextElement = textElement;
    
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
    
    // Получаем текущие стили
    const computedStyle = window.getComputedStyle(textElement);
    const currentFontFamily = computedStyle.fontFamily || "'Comfortaa', cursive";
    const currentFontSize = parseInt(computedStyle.fontSize) || 24;
    const currentTextAlign = computedStyle.textAlign || 'left';
    const currentColor = rgbToHex(computedStyle.color);
    
    // Сбрасываем флаг сохранения состояния в панели
    if (panel._stateSaved) {
        panel._stateSaved = false;
    }
    
    // Устанавливаем значения в панели
    const fontSelect = panel.querySelector('#text-font-family');
    const fontSizeInput = panel.querySelector('#text-font-size');
    const alignButtons = panel.querySelectorAll('.align-btn');
    const colorInputEl = panel.querySelector('#text-color');
    
    if (colorInputEl) {
        colorInputEl.value = currentColor;
    }
    
    // Width Slider
    const widthSlider = panel.querySelector('#text-width-slider');
    if (widthSlider) {
        let w = 100;
        if (textElement.style.width && textElement.style.width.includes('%')) {
             w = parseInt(textElement.style.width);
        }
        widthSlider.value = w;
    }
    
    // Находим ближайший шрифт в списке
    let selectedFont = "'Comfortaa', cursive";
    for (let option of fontSelect.options) {
        const optionFont = option.value.split(',')[0].replace(/'/g, '').trim();
        const currentFont = currentFontFamily.split(',')[0].replace(/'/g, '').trim();
        if (currentFontFamily.includes(optionFont) || optionFont === currentFont) {
            selectedFont = option.value;
            break;
        }
    }
    fontSelect.value = selectedFont;
    fontSizeInput.value = currentFontSize;
    
    // Активируем кнопку выравнивания
    alignButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.align === currentTextAlign) {
            btn.classList.add('active');
        }
    });
    
    // Позиционируем панель справа от контейнера превью слайдов
    const slideWrapper = textElement.closest('.slide-wrapper');
    
    panel.style.display = 'block';
    panel.style.visibility = 'hidden';
    
    if (slideWrapper) {
        const previewContainer = slideWrapper.querySelector('.slides-preview-container');
        if (previewContainer) {
            const rect = previewContainer.getBoundingClientRect();
            
            const panelHeight = panel.offsetHeight || 400; 
            const topPos = rect.top + (rect.height / 2) - (panelHeight / 2);
            const leftPos = rect.right + 20;
            
            panel.style.top = Math.max(20, topPos) + 'px';
            panel.style.left = leftPos + 'px';
        }
    } else {
        const textRect = textElement.getBoundingClientRect();
        let leftPos = textRect.right + 20;
        let topPos = textRect.top;
        
        panel.style.top = topPos + 'px';
        panel.style.left = leftPos + 'px';
    }
    
    const panelRect = panel.getBoundingClientRect();
    if (panelRect.right > window.innerWidth) {
            panel.style.left = (window.innerWidth - panelRect.width - 20) + 'px';
    }
    
    panel.style.position = 'fixed';
    panel.style.visibility = 'visible';
    panel.style.opacity = '1';
}

// Функция для создания панели управления логотипом
function createLogoSettingsPanel() {
    const oldPanel = document.getElementById('logo-settings-panel');
    if (oldPanel) {
        oldPanel.remove();
    }
    
    const panel = document.createElement('div');
    panel.id = 'logo-settings-panel';
    panel.className = 'image-size-panel';
    panel.style.display = 'none';
    
    panel.innerHTML = `
        <div class="size-panel-header">
            <h4>Настройки логотипа</h4>
            <button class="close-panel-btn">×</button>
        </div>
        <div class="size-panel-content">
            <div style="margin-bottom: 15px;">
                <label>Размер (высота): <span id="logo-height-value">60</span>px</label>
                <input type="range" id="logo-height-slider" min="20" max="200" value="60" style="width: 100%; margin: 10px 0;">
                <input type="number" id="logo-height-input" min="20" max="200" value="60" style="width: 100%; padding: 8px; margin-bottom: 10px;">
            </div>
            <div style="margin-bottom: 15px;">
                <label>Позиция сверху: <span id="logo-top-value">40</span>px</label>
                <input type="range" id="logo-top-slider" min="0" max="200" value="40" style="width: 100%; margin: 10px 0;">
                <input type="number" id="logo-top-input" min="0" max="200" value="40" style="width: 100%; padding: 8px; margin-bottom: 10px;">
            </div>
            <div style="margin-bottom: 15px;">
                <label>Позиция слева: <span id="logo-left-value">40</span>px</label>
                <input type="range" id="logo-left-slider" min="0" max="500" value="40" style="width: 100%; margin: 10px 0;">
                <input type="number" id="logo-left-input" min="0" max="500" value="40" style="width: 100%; padding: 8px; margin-bottom: 10px;">
            </div>
            <div style="margin-bottom: 15px;">
                <label>Прозрачность: <span id="logo-opacity-value">100</span>%</label>
                <input type="range" id="logo-opacity-slider" min="0" max="100" value="100" style="width: 100%; margin: 10px 0;">
                <input type="number" id="logo-opacity-input" min="0" max="100" value="100" style="width: 100%; padding: 8px; margin-bottom: 10px;">
            </div>
            <div style="margin-bottom: 15px;">
                <label>Тень (X Y Blur Color):</label>
                <div style="display: flex; gap: 5px; margin: 10px 0;">
                    <input type="number" id="logo-shadow-x" placeholder="X" value="0" style="width: 25%; padding: 8px;">
                    <input type="number" id="logo-shadow-y" placeholder="Y" value="2" style="width: 25%; padding: 8px;">
                    <input type="number" id="logo-shadow-blur" placeholder="Blur" value="8" style="width: 25%; padding: 8px;">
                    <input type="color" id="logo-shadow-color" value="#000000" style="width: 25%; padding: 8px; height: 40px;">
                </div>
                <input type="number" id="logo-shadow-opacity" placeholder="Прозрачность тени (0-100)" value="50" min="0" max="100" style="width: 100%; padding: 8px; margin-bottom: 10px;">
            </div>
            <div style="margin-bottom: 15px;">
                <label>Обводка:</label>
                <div style="display: flex; gap: 5px; margin: 10px 0;">
                    <input type="number" id="logo-border-width" placeholder="Толщина" value="0" min="0" max="20" style="width: 33%; padding: 8px;">
                    <input type="color" id="logo-border-color" value="#ffffff" style="width: 33%; padding: 8px; height: 40px;">
                    <input type="number" id="logo-border-radius" placeholder="Радиус" value="0" min="0" max="50" style="width: 33%; padding: 8px;">
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(panel);
    
    // Обработчики
    const closeBtn = panel.querySelector('.close-panel-btn');
    const heightSlider = panel.querySelector('#logo-height-slider');
    const heightInput = panel.querySelector('#logo-height-input');
    const heightValue = panel.querySelector('#logo-height-value');
    const topSlider = panel.querySelector('#logo-top-slider');
    const topInput = panel.querySelector('#logo-top-input');
    const topValue = panel.querySelector('#logo-top-value');
    const leftSlider = panel.querySelector('#logo-left-slider');
    const leftInput = panel.querySelector('#logo-left-input');
    const leftValue = panel.querySelector('#logo-left-value');
    const opacitySlider = panel.querySelector('#logo-opacity-slider');
    const opacityInput = panel.querySelector('#logo-opacity-input');
    const opacityValue = panel.querySelector('#logo-opacity-value');
    const shadowX = panel.querySelector('#logo-shadow-x');
    const shadowY = panel.querySelector('#logo-shadow-y');
    const shadowBlur = panel.querySelector('#logo-shadow-blur');
    const shadowColor = panel.querySelector('#logo-shadow-color');
    const shadowOpacity = panel.querySelector('#logo-shadow-opacity');
    const borderWidth = panel.querySelector('#logo-border-width');
    const borderColor = panel.querySelector('#logo-border-color');
    const borderRadius = panel.querySelector('#logo-border-radius');
    
    let logoStateSaved = false;
    
    // Helper helpers
    const updateHeightValue = (value) => {
        const height = parseInt(value);
        heightValue.textContent = height;
        heightSlider.value = height;
        heightInput.value = height;
    };
    const updateTopValue = (value) => {
        const top = parseInt(value);
        topValue.textContent = top;
        topSlider.value = top;
        topInput.value = top;
    };
    const updateLeftValue = (value) => {
        const left = parseInt(value);
        leftValue.textContent = left;
        leftSlider.value = left;
        leftInput.value = left;
    };
    const updateOpacityValue = (value) => {
        const opacity = parseInt(value);
        opacityValue.textContent = opacity;
        opacitySlider.value = opacity;
        opacityInput.value = opacity;
    };
    
    const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 0, g: 0, b: 0 };
    };

    const applyLogoSettings = () => {
        if (!currentProjectId) return;
        
        const height = parseInt(heightInput.value) || 60;
        const top = parseInt(topInput.value) || 40;
        const left = parseInt(leftInput.value) || 40;
        const opacity = (parseInt(opacityInput.value) || 100) / 100;
        
        const shadowXVal = parseInt(shadowX.value) || 0;
        const shadowYVal = parseInt(shadowY.value) || 2;
        const shadowBlurVal = parseInt(shadowBlur.value) || 8;
        const shadowColorVal = shadowColor.value || '#000000';
        const shadowOpacityVal = (parseInt(shadowOpacity.value) || 50) / 100;
        const shadowRgb = hexToRgb(shadowColorVal);
        const shadow = `${shadowXVal}px ${shadowYVal}px ${shadowBlurVal}px rgba(${shadowRgb.r}, ${shadowRgb.g}, ${shadowRgb.b}, ${shadowOpacityVal})`;
        
        const borderWidthVal = parseInt(borderWidth.value) || 0;
        const borderColorVal = borderColor.value || '#ffffff';
        const borderRadiusVal = parseInt(borderRadius.value) || 0;
        
        // Применяем настройки ко всем логотипам проекта
        const allSlides = document.querySelectorAll('.slide');
        allSlides.forEach(slide => {
            const logoImg = slide.querySelector('.logo');
            if (logoImg) {
                logoImg.style.height = height + 'px';
                logoImg.style.top = top + 'px';
                logoImg.style.left = left + 'px';
                logoImg.style.opacity = opacity;
                logoImg.style.filter = `drop-shadow(${shadow})`;
                
                if (borderWidthVal > 0) {
                    logoImg.style.border = `${borderWidthVal}px solid ${borderColorVal}`;
                    logoImg.style.borderRadius = borderRadiusVal + 'px';
                } else {
                    logoImg.style.border = 'none';
                    logoImg.style.borderRadius = '0px';
                }
            }
        });
        
        // Сохраняем настройки
        logoSettings[currentProjectId] = {
            height: height,
            top: top,
            left: left,
            opacity: opacity,
            shadow: shadow,
            border: borderWidthVal > 0,
            borderWidth: borderWidthVal,
            borderColor: borderColorVal,
            borderRadius: borderRadiusVal
        };
        saveToLocalStorage();
    };
    
    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        panel.style.display = 'none';
        return false;
    }, true);
    
    // Add handlers helper
    const addInputHandlers = (slider, input, valueSpan, updateFn) => {
        slider.addEventListener('input', (e) => {
            if (!logoStateSaved) {
                saveStateForUndo();
                logoStateSaved = true;
            }
            updateFn(e.target.value);
            applyLogoSettings();
        });
        
        input.addEventListener('input', (e) => {
            if (!logoStateSaved) {
                saveStateForUndo();
                logoStateSaved = true;
            }
            updateFn(e.target.value);
            applyLogoSettings();
        });
    };
    
    addInputHandlers(heightSlider, heightInput, heightValue, updateHeightValue);
    addInputHandlers(topSlider, topInput, topValue, updateTopValue);
    addInputHandlers(leftSlider, leftInput, leftValue, updateLeftValue);
    addInputHandlers(opacitySlider, opacityInput, opacityValue, updateOpacityValue);
    
    [shadowX, shadowY, shadowBlur, shadowColor, shadowOpacity, borderWidth, borderColor, borderRadius].forEach(input => {
        input.addEventListener('input', () => {
            if (!logoStateSaved) {
                saveStateForUndo();
                logoStateSaved = true;
            }
            applyLogoSettings();
        });
    });
    
    panel._setValues = (projectId, settings) => {
        // currentProjectId must be set globally before calling this or inside this
        // but function uses global currentProjectId. We'll assume caller sets it or we rely on global.
        // Actually the arg 'projectId' overrides global usage? No, internal apply uses global.
        // Let's set the global if needed? NO, avoid side effects.
        
        logoStateSaved = false;
        
        if (settings) {
            updateHeightValue(settings.height || 60);
            updateTopValue(settings.top !== undefined ? settings.top : 40);
            updateLeftValue(settings.left !== undefined ? settings.left : 40);
            updateOpacityValue((settings.opacity || 1) * 100);
            
            if (settings.shadow) {
                const shadowMatch = settings.shadow.match(/(\d+)px\s+(\d+)px\s+(\d+)px\s+rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
                if (shadowMatch) {
                    shadowX.value = shadowMatch[1];
                    shadowY.value = shadowMatch[2];
                    shadowBlur.value = shadowMatch[3];
                    shadowOpacity.value = Math.round(parseFloat(shadowMatch[7]) * 100);
                    const r = parseInt(shadowMatch[4]).toString(16).padStart(2, '0');
                    const g = parseInt(shadowMatch[5]).toString(16).padStart(2, '0');
                    const b = parseInt(shadowMatch[6]).toString(16).padStart(2, '0');
                    shadowColor.value = `#${r}${g}${b}`;
                }
            }
            
            if (settings.border) {
                borderWidth.value = settings.borderWidth || 0;
                borderColor.value = settings.borderColor || '#ffffff';
                borderRadius.value = settings.borderRadius || 0;
            }
        }
    };
    
    return panel;
}

// Показываем панель настроек логотипа
function showLogoSettingsPanel(projectId) {
    let panel = document.getElementById('logo-settings-panel');
    if (!panel) {
        panel = createLogoSettingsPanel();
    }
    
    document.querySelectorAll('.image-size-panel').forEach(p => p.style.display = 'none');
    document.querySelectorAll('.text-edit-panel').forEach(p => p.style.display = 'none');
    
    const settings = logoSettings[projectId];
    if (settings && panel._setValues) {
        panel._setValues(projectId, settings);
    }
    
    // Position panel to right of slides-preview
    // We try to find active slide-wrapper
    const slideWrapper = document.querySelector('.slide-wrapper');
    if (slideWrapper) {
         const previewContainer = slideWrapper.querySelector('.slides-preview-container');
         if (previewContainer) {
             const rect = previewContainer.getBoundingClientRect();
             const panelHeight = panel.offsetHeight || 500;
             const topPos = rect.top + (rect.height / 2) - (panelHeight / 2);
             const leftPos = rect.right + 20;
             panel.style.top = Math.max(20, topPos) + 'px';
             panel.style.left = leftPos + 'px';
         }
    } else {
        panel.style.top = '100px';
        panel.style.left = (window.innerWidth - 320) + 'px';
    }
    
    panel.style.display = 'block';
    
    const panelRect = panel.getBoundingClientRect();
    if (panelRect.right > window.innerWidth) {
        panel.style.left = (window.innerWidth - panelRect.width - 20) + 'px';
    }
}

// Функция для создания панели настроек номера слайда
function createSlideNumberSettingsPanel() {
    const oldPanel = document.getElementById('slide-number-settings-panel');
    if (oldPanel) {
        oldPanel.remove();
    }
    
    const panel = document.createElement('div');
    panel.id = 'slide-number-settings-panel';
    panel.className = 'image-size-panel';
    panel.style.display = 'none';
    
    panel.innerHTML = `
        <div class="size-panel-header">
            <h4>Номер слайда</h4>
            <button class="close-panel-btn">×</button>
        </div>
        <div class="size-panel-content">
            <div style="margin-bottom: 15px;">
                <label>Размер шрифта: <span id="sn-font-size-value">14</span>px</label>
                <input type="range" id="sn-font-size-slider" min="8" max="40" value="14" style="width: 100%; margin: 10px 0;">
            </div>
            <div style="margin-bottom: 15px;">
                <label>Позиция (отступ снизу / от края):</label>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 5px; margin: 10px 0;">
                    <button class="align-btn sn-pos-btn" data-pos="top-left">↖</button>
                    <button class="align-btn sn-pos-btn" data-pos="top-center">⬆</button>
                    <button class="align-btn sn-pos-btn" data-pos="top-right">↗</button>
                    
                    <button class="align-btn sn-pos-btn" data-pos="center-left">⬅</button>
                    <button class="align-btn sn-pos-btn" data-pos="center-center">✛</button>
                    <button class="align-btn sn-pos-btn" data-pos="center-right">➡</button>
                    
                    <button class="align-btn sn-pos-btn" data-pos="bottom-left">↙</button>
                    <button class="align-btn sn-pos-btn" data-pos="bottom-center">⬇</button>
                    <button class="align-btn sn-pos-btn active" data-pos="bottom-right">↘</button>
                </div>
                <div style="margin-top: 10px;">
                    <label>Отступ X: <span id="sn-offset-x-value">20</span>px</label>
                    <input type="range" id="sn-offset-x-slider" min="0" max="500" value="20" style="width: 100%;">
                </div>
                <div style="margin-top: 10px;">
                    <label>Отступ Y: <span id="sn-offset-y-value">20</span>px</label>
                    <input type="range" id="sn-offset-y-slider" min="0" max="500" value="20" style="width: 100%;">
                </div>
            </div>
            <div style="margin-bottom: 15px;">
                <label>Прозрачность: <span id="sn-opacity-value">50</span>%</label>
                <input type="range" id="sn-opacity-slider" min="0" max="100" value="50" style="width: 100%;">
            </div>
             <div style="margin-bottom: 15px;">
                <label>Цвет:</label>
                <input type="color" id="sn-color-input" value="#ffffff" style="width: 100%; height: 40px; margin-top: 5px;">
            </div>
        </div>
    `;
    
    document.body.appendChild(panel);
    
    const closeBtn = panel.querySelector('.close-panel-btn');
    const fontSizeSlider = panel.querySelector('#sn-font-size-slider');
    const fontSizeValue = panel.querySelector('#sn-font-size-value');
    const offsetXSlider = panel.querySelector('#sn-offset-x-slider');
    const offsetXValue = panel.querySelector('#sn-offset-x-value');
    const offsetYSlider = panel.querySelector('#sn-offset-y-slider');
    const offsetYValue = panel.querySelector('#sn-offset-y-value');
    const opacitySlider = panel.querySelector('#sn-opacity-slider');
    const opacityValue = panel.querySelector('#sn-opacity-value');
    const colorInput = panel.querySelector('#sn-color-input');
    const posButtons = panel.querySelectorAll('.sn-pos-btn');
    
    let stateSaved = false;
    
    const startEdit = () => {
        if (!stateSaved) {
            saveStateForUndo();
            stateSaved = true;
        }
    };
    
    const apply = () => {
        const fontSize = fontSizeSlider.value;
        const offsetX = offsetXSlider.value;
        const offsetY = offsetYSlider.value;
        const opacity = opacitySlider.value / 100;
        const color = colorInput.value;
        const position = panel.querySelector('.sn-pos-btn.active').dataset.pos;
        
        fontSizeValue.textContent = fontSize;
        offsetXValue.textContent = offsetX;
        offsetYValue.textContent = offsetY;
        opacityValue.textContent = opacitySlider.value;
        
        slideNumberSettings = {
            fontSize: parseInt(fontSize),
            offsetX: parseInt(offsetX),
            offsetY: parseInt(offsetY),
            opacity: parseFloat(opacity),
            color: color,
            position: position
        };
        
        const allSlides = document.querySelectorAll('.slide');
        allSlides.forEach(slide => {
            const sn = slide.querySelector('.slide-number');
            if (sn) {
                sn.style.fontSize = fontSize + 'px';
                sn.style.opacity = opacity;
                sn.style.color = color;
                
                sn.style.left = 'auto';
                sn.style.right = 'auto';
                sn.style.top = 'auto';
                sn.style.bottom = 'auto';
                sn.style.transform = 'none';
                sn.style.marginTop = '0';
                sn.style.marginLeft = '0';
                sn.style.marginRight = '0';
                sn.style.marginBottom = '0';
                
                const ox = parseInt(offsetX) || 0;
                const oy = parseInt(offsetY) || 0;
                
                // Horizontal
                if (position.endsWith('left')) {
                    sn.style.left = ox + 'px';
                } else if (position.endsWith('right')) {
                    sn.style.right = ox + 'px';
                } else { // center
                    sn.style.left = '50%';
                    sn.style.transform = 'translateX(-50%)';
                    sn.style.marginLeft = ox + 'px';
                }
                
                // Vertical
                if (position.startsWith('top')) {
                    sn.style.top = oy + 'px';
                } else if (position.startsWith('bottom')) {
                    sn.style.bottom = oy + 'px';
                } else { // center
                    sn.style.top = '50%';
                    if (sn.style.transform && sn.style.transform !== 'none') {
                        sn.style.transform += ' translateY(-50%)';
                    } else {
                        sn.style.transform = 'translateY(-50%)';
                    }
                    sn.style.marginTop = oy + 'px';
                }
            }
        });
        
        saveToLocalStorage();
    };
    
    fontSizeSlider.addEventListener('input', (e) => { 
        fontSizeValue.textContent = e.target.value;
        startEdit(); apply(); 
    });
    offsetXSlider.addEventListener('input', (e) => { 
        offsetXValue.textContent = e.target.value;
        startEdit(); apply(); 
    });
    offsetYSlider.addEventListener('input', (e) => { 
       offsetYValue.textContent = e.target.value; 
       startEdit(); apply(); 
    });
    opacitySlider.addEventListener('input', (e) => { 
        opacityValue.textContent = e.target.value;
        startEdit(); apply(); 
    });
    colorInput.addEventListener('input', () => { startEdit(); apply(); });
    
    posButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            startEdit();
            posButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            apply();
        });
    });
    
    closeBtn.addEventListener('click', () => {
        panel.style.display = 'none';
        stateSaved = false;
    });
    
    panel._setValues = () => {
        stateSaved = false;
        const s = slideNumberSettings || {};
        fontSizeSlider.value = s.fontSize || 14;
        offsetXSlider.value = s.offsetX !== undefined ? s.offsetX : 20;
        offsetYSlider.value = s.offsetY !== undefined ? s.offsetY : 20;
        opacitySlider.value = (s.opacity !== undefined ? s.opacity : 0.5) * 100;
        colorInput.value = s.color || '#ffffff';
        
        const pos = s.position || 'bottom-right';
        posButtons.forEach(b => {
             b.classList.remove('active');
             if (b.dataset.pos === pos) b.classList.add('active');
        });
        
        fontSizeValue.textContent = fontSizeSlider.value;
        offsetXValue.textContent = offsetXSlider.value;
        offsetYValue.textContent = offsetYSlider.value;
        opacityValue.textContent = opacitySlider.value;
    };
    
    return panel;
}

function showSlideNumberSettingsPanel() {
    let panel = document.getElementById('slide-number-settings-panel');
    if (!panel) panel = createSlideNumberSettingsPanel();
    
    document.querySelectorAll('.image-size-panel, .text-edit-panel').forEach(p => p.style.display = 'none');
    
    panel._setValues();
    panel.style.display = 'block';
    
    panel.style.top = '100px';
    panel.style.left = (window.innerWidth / 2 - 150) + 'px';
}

// Функция для создания панели настроек водяного знака
function createWatermarkSettingsPanel() {
    const oldPanel = document.getElementById('watermark-settings-panel');
    if (oldPanel) oldPanel.remove();
    
    const panel = document.createElement('div');
    panel.id = 'watermark-settings-panel';
    panel.className = 'image-size-panel';
    panel.style.display = 'none';
    
    panel.innerHTML = `
        <div class="size-panel-header">
            <h4>Водяной знак</h4>
            <button class="close-panel-btn">×</button>
        </div>
        <div class="size-panel-content">
             <div style="margin-bottom: 15px;">
                <label>Текст:</label>
                <input type="text" id="wm-text-input" value="GameInvitation.com" style="width: 100%; padding: 8px; margin-top: 5px;">
            </div>
            <div style="margin-bottom: 15px;">
                <label>Размер шрифта: <span id="wm-font-size-value">24</span>px</label>
                <input type="range" id="wm-font-size-slider" min="10" max="100" value="24" style="width: 100%; margin: 10px 0;">
            </div>
             <div style="margin-bottom: 15px;">
                <label>Прозрачность: <span id="wm-opacity-value">10</span>%</label>
                <input type="range" id="wm-opacity-slider" min="0" max="100" value="10" style="width: 100%;">
            </div>
             <div style="margin-bottom: 15px;">
                <label>Поворот: <span id="wm-rotate-value">0</span>°</label>
                <input type="range" id="wm-rotate-slider" min="-90" max="90" value="0" style="width: 100%;">
            </div>
            <div style="margin-bottom: 15px;">
                 <label>Позиция (X% Y%):</label>
                 <div style="display: flex; gap: 5px;">
                    <input type="number" id="wm-pos-x" placeholder="X %" min="0" max="100" style="width: 50%; padding: 8px;">
                    <input type="number" id="wm-pos-y" placeholder="Y %" min="0" max="100" style="width: 50%; padding: 8px;">
                 </div>
            </div>
             <div style="margin-bottom: 15px;">
                <label>Цвет:</label>
                <input type="color" id="wm-color-input" value="#ffffff" style="width: 100%; height: 40px; margin-top: 5px;">
            </div>
        </div>
    `;
    
    document.body.appendChild(panel);
    
    const closeBtn = panel.querySelector('.close-panel-btn');
    const textInput = panel.querySelector('#wm-text-input');
    const fontSizeSlider = panel.querySelector('#wm-font-size-slider');
    const opacitySlider = panel.querySelector('#wm-opacity-slider');
    const rotateSlider = panel.querySelector('#wm-rotate-slider');
    const posX = panel.querySelector('#wm-pos-x');
    const posY = panel.querySelector('#wm-pos-y');
    const colorInput = panel.querySelector('#wm-color-input');
    
    let stateSaved = false;
    const startEdit = () => { if (!stateSaved) { saveStateForUndo(); stateSaved = true; } };
    
    const apply = () => {
        panel.querySelector('#wm-font-size-value').textContent = fontSizeSlider.value;
        panel.querySelector('#wm-opacity-value').textContent = opacitySlider.value;
        panel.querySelector('#wm-rotate-value').textContent = rotateSlider.value;
        
        watermarkSettings = {
            text: textInput.value,
            fontSize: parseInt(fontSizeSlider.value),
            opacity: parseFloat(opacitySlider.value) / 100,
            rotate: parseInt(rotateSlider.value),
            x: parseInt(posX.value) || 50,
            y: parseInt(posY.value) || 50,
            color: colorInput.value
        };
        
        const allSlides = document.querySelectorAll('.slide');
        allSlides.forEach(slide => {
             let wm = slide.querySelector('.watermark-layer');
             if (!wm) {
                 wm = document.createElement('div');
                 wm.className = 'watermark-layer';
                 wm.addEventListener('click', (e) => { e.stopPropagation(); showWatermarkSettingsPanel(); });
                 slide.appendChild(wm);
             }
             
             wm.textContent = watermarkSettings.text;
             wm.style.fontSize = watermarkSettings.fontSize + 'px';
             wm.style.opacity = watermarkSettings.opacity;
             wm.style.color = watermarkSettings.color;
             wm.style.left = watermarkSettings.x + '%';
             wm.style.top = watermarkSettings.y + '%';
             
             let trans = '';
             if (watermarkSettings.x < 35) {
                trans = 'translateY(-50%)';
             } else if (watermarkSettings.x > 65) {
                trans = 'translate(-100%, -50%)';
             } else {
                trans = 'translate(-50%, -50%)';
             }
             trans += ` rotate(${watermarkSettings.rotate}deg)`;
             
             wm.style.transform = trans;
             // Reset styles to ensure correct positioning
             wm.style.position = 'absolute';
             wm.style.pointerEvents = 'auto';
             wm.style.cursor = 'pointer';
             wm.style.whiteSpace = 'nowrap';
             wm.style.zIndex = '5';
        });
        
        saveToLocalStorage();
    };
    
    [textInput, fontSizeSlider, opacitySlider, rotateSlider, posX, posY, colorInput].forEach(el => {
        el.addEventListener('input', () => { startEdit(); apply(); });
    });
    
    closeBtn.addEventListener('click', () => { panel.style.display = 'none'; stateSaved = false; });
    
    panel._setValues = () => {
        stateSaved = false;
        const s = watermarkSettings || {};
        
        let defaultText = 'GameInvitation.com';
        // Attempt to find current project's watermark if global settings are empty
        if (!s.text && typeof currentProjectId !== 'undefined' && typeof projectsData !== 'undefined') {
             const proj = projectsData.find(p => p.id === currentProjectId);
             if (proj && proj.watermark) {
                 defaultText = proj.watermark;
             }
        }
        
        textInput.value = s.text || defaultText;
        fontSizeSlider.value = s.fontSize || 24;
        opacitySlider.value = (s.opacity !== undefined ? s.opacity : 0.1) * 100;
        rotateSlider.value = s.rotate || 0;
        posX.value = s.x !== undefined ? s.x : 50;
        posY.value = s.y !== undefined ? s.y : 50;
        colorInput.value = s.color || '#ffffff';
        
        apply();
    };
    
    return panel;
}

function showWatermarkSettingsPanel() {
    let panel = document.getElementById('watermark-settings-panel');
    if (!panel) panel = createWatermarkSettingsPanel();
    
    document.querySelectorAll('.image-size-panel, .text-edit-panel').forEach(p => p.style.display = 'none');
    
    panel._setValues();
    panel.style.display = 'block';
    
    panel.style.top = '100px';
    panel.style.left = (window.innerWidth / 2 - 150) + 'px';
}

// Добавим лог для проверки размеров изображений
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const containers = document.querySelectorAll('.slide-image-container');
        containers.forEach(cont => {
            const images = cont.querySelectorAll('img');
            console.log('[DEBUG] Container width:', cont.offsetWidth);
            images.forEach(img => {
                console.log('[DEBUG] Image:', {
                    width: img.offsetWidth,
                    maxWidth: img.style.maxWidth,
                    computedMaxWidth: window.getComputedStyle(img).maxWidth
                });
            });
        });
    }, 2000);
});
