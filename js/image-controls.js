const ImageControlSystem = (function() {
    const defaultImageSettings = {
        scale: 100,
        rotation: 0,
        posX: 50,
        posY: 50,
        alignH: 'center',
        alignV: 'center',
        objectFit: 'contain',
        opacity: 100,
        borderRadius: 0,
        flipH: false,
        flipV: false
    };

    function getImageKey(slideIndex, imageSrc) {
        const srcHash = imageSrc.substring(0, 50).replace(/[^a-zA-Z0-9]/g, '');
        return `img_${slideIndex}_${srcHash}`;
    }

    function getSettings(slideIndex, imageSrc, format = '1-1') {
        const key = `${getImageKey(slideIndex, imageSrc)}_${format}`;
        if (!window.imageTransformSettings) window.imageTransformSettings = {};
        return window.imageTransformSettings[key] || { ...defaultImageSettings };
    }

    function saveSettings(slideIndex, imageSrc, format, settings) {
        const key = `${getImageKey(slideIndex, imageSrc)}_${format}`;
        if (!window.imageTransformSettings) window.imageTransformSettings = {};
        window.imageTransformSettings[key] = { ...settings };
        saveToLocalStorage();
    }

    function applyTransformToImage(img, settings) {
        if (!img) return;

        // Поддерживаем оба типа обёрток: flex и free positioning
        const wrapper = img.closest('.uploaded-image-wrapper') || img.closest('.free-positioned-image');
        if (!wrapper) return;

        let transform = '';

        if (settings.scale !== 100) {
            transform += `scale(${settings.scale / 100}) `;
        }

        if (settings.rotation !== 0) {
            transform += `rotate(${settings.rotation}deg) `;
        }

        if (settings.flipH) {
            transform += 'scaleX(-1) ';
        }

        if (settings.flipV) {
            transform += 'scaleY(-1) ';
        }

        img.style.transform = transform.trim() || 'none';
        img.style.opacity = settings.opacity / 100;
        img.style.borderRadius = settings.borderRadius + 'px';
        img.style.objectFit = settings.objectFit;

        wrapper.dataset.scale = settings.scale;
        wrapper.dataset.rotation = settings.rotation;
    }

    function applyContainerAlignment(container, settings) {
        if (!container) return;

        const alignMap = {
            'left': 'flex-start',
            'center': 'center',
            'right': 'flex-end'
        };

        const vAlignMap = {
            'top': 'flex-start',
            'center': 'center',
            'bottom': 'flex-end'
        };

        container.style.justifyContent = alignMap[settings.alignH] || 'center';
        container.style.alignItems = vAlignMap[settings.alignV] || 'center';
    }

    function createImageSettingsPanel() {
        const existingPanel = document.getElementById('image-transform-panel');
        if (existingPanel) existingPanel.remove();

        const panel = document.createElement('div');
        panel.id = 'image-transform-panel';
        panel.className = 'transform-panel';
        panel.innerHTML = `
            <div class="transform-panel-header">
                <h4>Настройки изображения</h4>
                <button class="transform-panel-close">&times;</button>
            </div>
            <div class="transform-panel-body">
                <div class="transform-section">
                    <label>Масштаб: <span id="img-scale-val">100</span>%</label>
                    <input type="range" id="img-scale" min="10" max="200" value="100">
                </div>

                <div class="transform-section">
                    <label>Поворот: <span id="img-rotation-val">0</span>&deg;</label>
                    <input type="range" id="img-rotation" min="-180" max="180" value="0">
                    <div class="rotation-presets">
                        <button data-rot="0">0&deg;</button>
                        <button data-rot="90">90&deg;</button>
                        <button data-rot="180">180&deg;</button>
                        <button data-rot="-90">-90&deg;</button>
                    </div>
                </div>

                <div class="transform-section">
                    <label>Прозрачность: <span id="img-opacity-val">100</span>%</label>
                    <input type="range" id="img-opacity" min="0" max="100" value="100">
                </div>

                <div class="transform-section">
                    <label>Скругление: <span id="img-radius-val">0</span>px</label>
                    <input type="range" id="img-radius" min="0" max="100" value="0">
                </div>

                <div class="transform-section">
                    <label>Режим заполнения:</label>
                    <select id="img-object-fit">
                        <option value="contain">Вписать (contain)</option>
                        <option value="cover">Заполнить (cover)</option>
                        <option value="fill">Растянуть (fill)</option>
                        <option value="none">Оригинал (none)</option>
                    </select>
                </div>

                <div class="transform-section">
                    <label>Отразить:</label>
                    <div class="flip-buttons">
                        <button id="img-flip-h" class="flip-btn">↔ Горизонтально</button>
                        <button id="img-flip-v" class="flip-btn">↕ Вертикально</button>
                    </div>
                </div>

                <div class="transform-section">
                    <label>Горизонтальное выравнивание:</label>
                    <div class="align-buttons">
                        <button data-align-h="left" class="align-btn-h">⬅</button>
                        <button data-align-h="center" class="align-btn-h active">⬌</button>
                        <button data-align-h="right" class="align-btn-h">➡</button>
                    </div>
                </div>

                <div class="transform-section">
                    <label>Вертикальное выравнивание:</label>
                    <div class="align-buttons">
                        <button data-align-v="top" class="align-btn-v">⬆</button>
                        <button data-align-v="center" class="align-btn-v active">⬌</button>
                        <button data-align-v="bottom" class="align-btn-v">⬇</button>
                    </div>
                </div>

                <div class="transform-section transform-actions">
                    <button id="img-reset-transform" class="reset-btn">Сбросить</button>
                    <button id="img-delete" class="delete-btn">Удалить</button>
                </div>
            </div>
        `;

        document.body.appendChild(panel);
        return panel;
    }

    function showImageSettingsPanel(img, slideIndex) {
        if (!img) return;

        const panel = createImageSettingsPanel();
        const slide = img.closest('.slide');
        const format = slide?.classList.contains('format-9-16') ? '9-16' : '1-1';
        const imageSrc = img.dataset.originalSrc || img.src;

        let settings = getSettings(slideIndex, imageSrc, format);

        const scaleSlider = panel.querySelector('#img-scale');
        const scaleVal = panel.querySelector('#img-scale-val');
        const rotationSlider = panel.querySelector('#img-rotation');
        const rotationVal = panel.querySelector('#img-rotation-val');
        const opacitySlider = panel.querySelector('#img-opacity');
        const opacityVal = panel.querySelector('#img-opacity-val');
        const radiusSlider = panel.querySelector('#img-radius');
        const radiusVal = panel.querySelector('#img-radius-val');
        const objectFitSelect = panel.querySelector('#img-object-fit');
        const flipHBtn = panel.querySelector('#img-flip-h');
        const flipVBtn = panel.querySelector('#img-flip-v');

        scaleSlider.value = settings.scale;
        scaleVal.textContent = settings.scale;
        rotationSlider.value = settings.rotation;
        rotationVal.textContent = settings.rotation;
        opacitySlider.value = settings.opacity;
        opacityVal.textContent = settings.opacity;
        radiusSlider.value = settings.borderRadius;
        radiusVal.textContent = settings.borderRadius;
        objectFitSelect.value = settings.objectFit;

        if (settings.flipH) flipHBtn.classList.add('active');
        if (settings.flipV) flipVBtn.classList.add('active');

        panel.querySelectorAll('.align-btn-h').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.alignH === settings.alignH);
        });
        panel.querySelectorAll('.align-btn-v').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.alignV === settings.alignV);
        });

        const updateAndApply = () => {
            settings.scale = parseInt(scaleSlider.value);
            settings.rotation = parseInt(rotationSlider.value);
            settings.opacity = parseInt(opacitySlider.value);
            settings.borderRadius = parseInt(radiusSlider.value);
            settings.objectFit = objectFitSelect.value;

            scaleVal.textContent = settings.scale;
            rotationVal.textContent = settings.rotation;
            opacityVal.textContent = settings.opacity;
            radiusVal.textContent = settings.borderRadius;

            applyTransformToImage(img, settings);
            saveSettings(slideIndex, imageSrc, format, settings);

            syncImageAcrossFormats(slideIndex, imageSrc, settings);
        };

        scaleSlider.addEventListener('input', updateAndApply);
        rotationSlider.addEventListener('input', updateAndApply);
        opacitySlider.addEventListener('input', updateAndApply);
        radiusSlider.addEventListener('input', updateAndApply);
        objectFitSelect.addEventListener('change', updateAndApply);

        panel.querySelectorAll('.rotation-presets button').forEach(btn => {
            btn.addEventListener('click', () => {
                rotationSlider.value = btn.dataset.rot;
                updateAndApply();
            });
        });

        flipHBtn.addEventListener('click', () => {
            settings.flipH = !settings.flipH;
            flipHBtn.classList.toggle('active', settings.flipH);
            updateAndApply();
        });

        flipVBtn.addEventListener('click', () => {
            settings.flipV = !settings.flipV;
            flipVBtn.classList.toggle('active', settings.flipV);
            updateAndApply();
        });

        panel.querySelectorAll('.align-btn-h').forEach(btn => {
            btn.addEventListener('click', () => {
                panel.querySelectorAll('.align-btn-h').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                settings.alignH = btn.dataset.alignH;

                const container = img.closest('.slide-image-container');
                if (container) applyContainerAlignment(container, settings);
                saveSettings(slideIndex, imageSrc, format, settings);
            });
        });

        panel.querySelectorAll('.align-btn-v').forEach(btn => {
            btn.addEventListener('click', () => {
                panel.querySelectorAll('.align-btn-v').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                settings.alignV = btn.dataset.alignV;

                const container = img.closest('.slide-image-container');
                if (container) applyContainerAlignment(container, settings);
                saveSettings(slideIndex, imageSrc, format, settings);
            });
        });

        panel.querySelector('#img-reset-transform').addEventListener('click', () => {
            settings = { ...defaultImageSettings };
            scaleSlider.value = settings.scale;
            rotationSlider.value = settings.rotation;
            opacitySlider.value = settings.opacity;
            radiusSlider.value = settings.borderRadius;
            objectFitSelect.value = settings.objectFit;
            flipHBtn.classList.remove('active');
            flipVBtn.classList.remove('active');
            updateAndApply();
        });

        panel.querySelector('#img-delete').addEventListener('click', () => {
            if (confirm('Удалить изображение?')) {
                deleteImage(img, slideIndex);
                panel.remove();
            }
        });

        panel.querySelector('.transform-panel-close').addEventListener('click', () => {
            panel.remove();
        });

        const imgRect = img.getBoundingClientRect();
        let left = imgRect.right + 20;
        let top = imgRect.top;

        if (left + 320 > window.innerWidth) {
            left = imgRect.left - 340;
        }
        if (top + 500 > window.innerHeight) {
            top = window.innerHeight - 520;
        }
        if (top < 20) top = 20;
        if (left < 20) left = 20;

        panel.style.left = left + 'px';
        panel.style.top = top + 'px';
        panel.style.display = 'block';

        const closeOnClickOutside = (e) => {
            if (!panel.contains(e.target) && !img.contains(e.target)) {
                panel.remove();
                document.removeEventListener('click', closeOnClickOutside);
            }
        };

        setTimeout(() => {
            document.addEventListener('click', closeOnClickOutside);
        }, 100);
    }

    function syncImageAcrossFormats(slideIndex, imageSrc, settings) {
        const formats = ['1-1', '4-5', '9-16'];
        const srcHash = imageSrc.substring(0, 50);

        document.querySelectorAll('.slide').forEach(slide => {
            const slideIdx = slide.querySelector('.slide-image-container')?.dataset.slideIndex;
            if (parseInt(slideIdx) !== slideIndex) return;

            slide.querySelectorAll('.uploaded-image-wrapper img').forEach(img => {
                const imgSrc = img.dataset.originalSrc || img.src;
                if (imgSrc.substring(0, 50) === srcHash) {
                    applyTransformToImage(img, settings);
                }
            });
        });
    }

    function deleteImage(img, slideIndex) {
        saveStateForUndo();

        const sizeKey = img.dataset.sizeKey;
        const wrapper = img.closest('.uploaded-image-wrapper') || img.closest('.free-positioned-image');

        document.querySelectorAll('.slide').forEach(slide => {
            // Используем вспомогательную функцию которая ищет в обоих слоях
            const relatedWrapper = findImageWrapperBySizeKey(slide, sizeKey);
            if (relatedWrapper) {
                relatedWrapper.remove();
            }
        });

        if (slideImages[slideIndex]) {
            const imgSrc = img.src;
            slideImages[slideIndex] = slideImages[slideIndex].filter(src => src !== imgSrc);
            if (slideImages[slideIndex].length === 0) {
                delete slideImages[slideIndex];
            }
        }

        if (sizeKey) {
            delete imageSizes[sizeKey];
        }

        saveToLocalStorage();
    }

    function initImageClickHandlers() {
        document.addEventListener('click', (e) => {
            const img = e.target.closest('.uploaded-image-wrapper img');
            if (img) {
                e.stopPropagation();
                const slide = img.closest('.slide');
                const container = img.closest('.slide-image-container');
                const slideIndex = container?.dataset.slideIndex || 0;
                showImageSettingsPanel(img, parseInt(slideIndex));
            }
        });
    }

    return {
        getSettings,
        saveSettings,
        applyTransformToImage,
        applyContainerAlignment,
        showImageSettingsPanel,
        syncImageAcrossFormats,
        deleteImage,
        initImageClickHandlers,
        defaultSettings: defaultImageSettings
    };
})();

document.addEventListener('DOMContentLoaded', () => {
    ImageControlSystem.initImageClickHandlers();
});
