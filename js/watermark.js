const WatermarkSystem = (function() {
    const defaultWatermark = {
        enabled: true,
        text: 'GameInvitation.com',
        position: 'bottom-right',
        fontSize: 14,
        color: '#ffffff',
        opacity: 50,
        offsetX: 20,
        offsetY: 20,
        fontFamily: 'Geologica',
        fontWeight: '500',
        rotation: 0,
        useImage: false,
        imageSrc: '',
        imageSize: 100
    };

    function getGlobalWatermark() {
        if (!window.globalWatermarkSettings) {
            window.globalWatermarkSettings = { ...defaultWatermark };
        }
        return window.globalWatermarkSettings;
    }

    function saveGlobalWatermark(settings) {
        window.globalWatermarkSettings = { ...settings };
        try {
            localStorage.setItem('globalWatermarkSettings', JSON.stringify(settings));
        } catch (e) {
            console.warn('Failed to save watermark settings:', e);
        }
    }

    function loadGlobalWatermark() {
        try {
            const saved = localStorage.getItem('globalWatermarkSettings');
            if (saved) {
                window.globalWatermarkSettings = JSON.parse(saved);
            }
        } catch (e) {
            console.warn('Failed to load watermark settings:', e);
        }
    }

    function createWatermarkElement(settings) {
        const watermark = document.createElement('div');
        watermark.className = 'watermark-layer';

        if (settings.useImage && settings.imageSrc) {
            const img = document.createElement('img');
            img.src = settings.imageSrc;
            img.style.cssText = `
                max-width: ${settings.imageSize}px;
                max-height: ${settings.imageSize}px;
                opacity: ${settings.opacity / 100};
                transform: rotate(${settings.rotation}deg);
            `;
            watermark.appendChild(img);
        } else {
            watermark.textContent = settings.text;
            watermark.style.cssText = `
                font-family: '${settings.fontFamily}', sans-serif;
                font-size: ${settings.fontSize}px;
                font-weight: ${settings.fontWeight};
                color: ${settings.color};
                opacity: ${settings.opacity / 100};
                transform: rotate(${settings.rotation}deg);
            `;
        }

        const positions = {
            'top-left': { top: settings.offsetY + 'px', left: settings.offsetX + 'px' },
            'top-center': { top: settings.offsetY + 'px', left: '50%', transform: `translateX(-50%) rotate(${settings.rotation}deg)` },
            'top-right': { top: settings.offsetY + 'px', right: settings.offsetX + 'px' },
            'center-left': { top: '50%', left: settings.offsetX + 'px', transform: `translateY(-50%) rotate(${settings.rotation}deg)` },
            'center': { top: '50%', left: '50%', transform: `translate(-50%, -50%) rotate(${settings.rotation}deg)` },
            'center-right': { top: '50%', right: settings.offsetX + 'px', transform: `translateY(-50%) rotate(${settings.rotation}deg)` },
            'bottom-left': { bottom: settings.offsetY + 'px', left: settings.offsetX + 'px' },
            'bottom-center': { bottom: settings.offsetY + 'px', left: '50%', transform: `translateX(-50%) rotate(${settings.rotation}deg)` },
            'bottom-right': { bottom: settings.offsetY + 'px', right: settings.offsetX + 'px' }
        };

        const pos = positions[settings.position] || positions['bottom-right'];
        Object.assign(watermark.style, pos);

        watermark.style.position = 'absolute';
        watermark.style.zIndex = '50';
        watermark.style.pointerEvents = 'none';
        watermark.style.userSelect = 'none';
        watermark.style.whiteSpace = 'nowrap';

        return watermark;
    }

    function applyWatermarkToSlide(slide, settings) {
        if (!slide) return;

        const existing = slide.querySelector('.watermark-layer');
        if (existing) existing.remove();

        if (!settings.enabled) return;

        const watermark = createWatermarkElement(settings);
        slide.appendChild(watermark);
    }

    function applyWatermarkToAllSlides(settings) {
        document.querySelectorAll('.slide').forEach(slide => {
            applyWatermarkToSlide(slide, settings);
        });
    }

    function createWatermarkPanel() {
        const existing = document.getElementById('watermark-panel');
        if (existing) existing.remove();

        const settings = getGlobalWatermark();

        const panel = document.createElement('div');
        panel.id = 'watermark-panel';
        panel.className = 'transform-panel watermark-panel';
        panel.innerHTML = `
            <div class="transform-panel-header">
                <h4>Водяной знак</h4>
                <button class="transform-panel-close">&times;</button>
            </div>
            <div class="transform-panel-body">
                <div class="transform-section">
                    <label class="toggle-label">
                        <input type="checkbox" id="wm-enabled" ${settings.enabled ? 'checked' : ''}>
                        <span>Включить водяной знак</span>
                    </label>
                </div>

                <div class="transform-section">
                    <label class="toggle-label">
                        <input type="checkbox" id="wm-use-image" ${settings.useImage ? 'checked' : ''}>
                        <span>Использовать изображение</span>
                    </label>
                </div>

                <div id="wm-text-group" class="transform-section" style="${settings.useImage ? 'display:none' : ''}">
                    <label>Текст:</label>
                    <input type="text" id="wm-text" value="${settings.text}" class="text-input">
                </div>

                <div id="wm-image-group" class="transform-section" style="${settings.useImage ? '' : 'display:none'}">
                    <label>Изображение:</label>
                    <input type="text" id="wm-image-url" value="${settings.imageSrc}" placeholder="URL изображения" class="text-input">
                    <button id="wm-upload-btn" class="upload-btn">Загрузить</button>
                    <input type="file" id="wm-file-input" accept="image/*" style="display:none">
                    <div class="transform-section">
                        <label>Размер: <span id="wm-image-size-val">${settings.imageSize}</span>px</label>
                        <input type="range" id="wm-image-size" min="20" max="300" value="${settings.imageSize}">
                    </div>
                </div>

                <div class="transform-section">
                    <label>Позиция:</label>
                    <div class="position-grid">
                        <button data-pos="top-left" class="pos-btn ${settings.position === 'top-left' ? 'active' : ''}">↖</button>
                        <button data-pos="top-center" class="pos-btn ${settings.position === 'top-center' ? 'active' : ''}">↑</button>
                        <button data-pos="top-right" class="pos-btn ${settings.position === 'top-right' ? 'active' : ''}">↗</button>
                        <button data-pos="center-left" class="pos-btn ${settings.position === 'center-left' ? 'active' : ''}">←</button>
                        <button data-pos="center" class="pos-btn ${settings.position === 'center' ? 'active' : ''}">⬤</button>
                        <button data-pos="center-right" class="pos-btn ${settings.position === 'center-right' ? 'active' : ''}">→</button>
                        <button data-pos="bottom-left" class="pos-btn ${settings.position === 'bottom-left' ? 'active' : ''}">↙</button>
                        <button data-pos="bottom-center" class="pos-btn ${settings.position === 'bottom-center' ? 'active' : ''}">↓</button>
                        <button data-pos="bottom-right" class="pos-btn ${settings.position === 'bottom-right' ? 'active' : ''}">↘</button>
                    </div>
                </div>

                <div id="wm-font-group" style="${settings.useImage ? 'display:none' : ''}">
                    <div class="transform-section">
                        <label>Размер шрифта: <span id="wm-font-size-val">${settings.fontSize}</span>px</label>
                        <input type="range" id="wm-font-size" min="8" max="48" value="${settings.fontSize}">
                    </div>

                    <div class="transform-section">
                        <label>Цвет:</label>
                        <input type="color" id="wm-color" value="${settings.color}">
                    </div>

                    <div class="transform-section">
                        <label>Шрифт:</label>
                        <select id="wm-font-family">
                            <option value="Geologica" ${settings.fontFamily === 'Geologica' ? 'selected' : ''}>Geologica</option>
                            <option value="Comfortaa" ${settings.fontFamily === 'Comfortaa' ? 'selected' : ''}>Comfortaa</option>
                            <option value="Arial" ${settings.fontFamily === 'Arial' ? 'selected' : ''}>Arial</option>
                            <option value="Georgia" ${settings.fontFamily === 'Georgia' ? 'selected' : ''}>Georgia</option>
                        </select>
                    </div>

                    <div class="transform-section">
                        <label>Толщина:</label>
                        <select id="wm-font-weight">
                            <option value="300" ${settings.fontWeight === '300' ? 'selected' : ''}>Light</option>
                            <option value="400" ${settings.fontWeight === '400' ? 'selected' : ''}>Regular</option>
                            <option value="500" ${settings.fontWeight === '500' ? 'selected' : ''}>Medium</option>
                            <option value="600" ${settings.fontWeight === '600' ? 'selected' : ''}>Semibold</option>
                            <option value="700" ${settings.fontWeight === '700' ? 'selected' : ''}>Bold</option>
                        </select>
                    </div>
                </div>

                <div class="transform-section">
                    <label>Прозрачность: <span id="wm-opacity-val">${settings.opacity}</span>%</label>
                    <input type="range" id="wm-opacity" min="0" max="100" value="${settings.opacity}">
                </div>

                <div class="transform-section">
                    <label>Поворот: <span id="wm-rotation-val">${settings.rotation}</span>&deg;</label>
                    <input type="range" id="wm-rotation" min="-45" max="45" value="${settings.rotation}">
                </div>

                <div class="transform-section">
                    <label>Отступ X: <span id="wm-offset-x-val">${settings.offsetX}</span>px</label>
                    <input type="range" id="wm-offset-x" min="0" max="100" value="${settings.offsetX}">
                </div>

                <div class="transform-section">
                    <label>Отступ Y: <span id="wm-offset-y-val">${settings.offsetY}</span>px</label>
                    <input type="range" id="wm-offset-y" min="0" max="100" value="${settings.offsetY}">
                </div>

                <div class="transform-section transform-actions">
                    <button id="wm-reset" class="reset-btn">Сбросить</button>
                </div>
            </div>
        `;

        document.body.appendChild(panel);

        const enabledCheck = panel.querySelector('#wm-enabled');
        const useImageCheck = panel.querySelector('#wm-use-image');
        const textGroup = panel.querySelector('#wm-text-group');
        const imageGroup = panel.querySelector('#wm-image-group');
        const fontGroup = panel.querySelector('#wm-font-group');
        const textInput = panel.querySelector('#wm-text');
        const imageUrlInput = panel.querySelector('#wm-image-url');
        const uploadBtn = panel.querySelector('#wm-upload-btn');
        const fileInput = panel.querySelector('#wm-file-input');
        const imageSizeSlider = panel.querySelector('#wm-image-size');
        const imageSizeVal = panel.querySelector('#wm-image-size-val');
        const fontSizeSlider = panel.querySelector('#wm-font-size');
        const fontSizeVal = panel.querySelector('#wm-font-size-val');
        const colorInput = panel.querySelector('#wm-color');
        const fontFamilySelect = panel.querySelector('#wm-font-family');
        const fontWeightSelect = panel.querySelector('#wm-font-weight');
        const opacitySlider = panel.querySelector('#wm-opacity');
        const opacityVal = panel.querySelector('#wm-opacity-val');
        const rotationSlider = panel.querySelector('#wm-rotation');
        const rotationVal = panel.querySelector('#wm-rotation-val');
        const offsetXSlider = panel.querySelector('#wm-offset-x');
        const offsetXVal = panel.querySelector('#wm-offset-x-val');
        const offsetYSlider = panel.querySelector('#wm-offset-y');
        const offsetYVal = panel.querySelector('#wm-offset-y-val');

        const updateAndApply = () => {
            const newSettings = {
                enabled: enabledCheck.checked,
                useImage: useImageCheck.checked,
                text: textInput.value,
                imageSrc: imageUrlInput.value,
                imageSize: parseInt(imageSizeSlider.value),
                position: panel.querySelector('.pos-btn.active')?.dataset.pos || 'bottom-right',
                fontSize: parseInt(fontSizeSlider.value),
                color: colorInput.value,
                fontFamily: fontFamilySelect.value,
                fontWeight: fontWeightSelect.value,
                opacity: parseInt(opacitySlider.value),
                rotation: parseInt(rotationSlider.value),
                offsetX: parseInt(offsetXSlider.value),
                offsetY: parseInt(offsetYSlider.value)
            };

            fontSizeVal.textContent = newSettings.fontSize;
            imageSizeVal.textContent = newSettings.imageSize;
            opacityVal.textContent = newSettings.opacity;
            rotationVal.textContent = newSettings.rotation;
            offsetXVal.textContent = newSettings.offsetX;
            offsetYVal.textContent = newSettings.offsetY;

            saveGlobalWatermark(newSettings);
            applyWatermarkToAllSlides(newSettings);
        };

        useImageCheck.addEventListener('change', () => {
            const useImage = useImageCheck.checked;
            textGroup.style.display = useImage ? 'none' : '';
            fontGroup.style.display = useImage ? 'none' : '';
            imageGroup.style.display = useImage ? '' : 'none';
            updateAndApply();
        });

        [enabledCheck, textInput, imageUrlInput, colorInput, fontFamilySelect, fontWeightSelect].forEach(el => {
            el.addEventListener('change', updateAndApply);
        });

        [fontSizeSlider, imageSizeSlider, opacitySlider, rotationSlider, offsetXSlider, offsetYSlider].forEach(el => {
            el.addEventListener('input', updateAndApply);
        });

        uploadBtn.addEventListener('click', () => fileInput.click());

        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (evt) => {
                imageUrlInput.value = evt.target.result;
                updateAndApply();
            };
            reader.readAsDataURL(file);
        });

        panel.querySelectorAll('.pos-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                panel.querySelectorAll('.pos-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                updateAndApply();
            });
        });

        panel.querySelector('#wm-reset').addEventListener('click', () => {
            const def = { ...defaultWatermark };
            enabledCheck.checked = def.enabled;
            useImageCheck.checked = def.useImage;
            textInput.value = def.text;
            imageUrlInput.value = def.imageSrc;
            imageSizeSlider.value = def.imageSize;
            fontSizeSlider.value = def.fontSize;
            colorInput.value = def.color;
            fontFamilySelect.value = def.fontFamily;
            fontWeightSelect.value = def.fontWeight;
            opacitySlider.value = def.opacity;
            rotationSlider.value = def.rotation;
            offsetXSlider.value = def.offsetX;
            offsetYSlider.value = def.offsetY;

            panel.querySelectorAll('.pos-btn').forEach(b => {
                b.classList.toggle('active', b.dataset.pos === def.position);
            });

            textGroup.style.display = def.useImage ? 'none' : '';
            fontGroup.style.display = def.useImage ? 'none' : '';
            imageGroup.style.display = def.useImage ? '' : 'none';

            updateAndApply();
        });

        panel.querySelector('.transform-panel-close').addEventListener('click', () => {
            panel.remove();
        });

        panel.style.left = '50%';
        panel.style.top = '50%';
        panel.style.transform = 'translate(-50%, -50%)';
        panel.style.display = 'block';

        return panel;
    }

    function init() {
        loadGlobalWatermark();
    }

    return {
        getGlobalWatermark,
        saveGlobalWatermark,
        loadGlobalWatermark,
        createWatermarkElement,
        applyWatermarkToSlide,
        applyWatermarkToAllSlides,
        createWatermarkPanel,
        init,
        defaultWatermark
    };
})();

document.addEventListener('DOMContentLoaded', () => {
    WatermarkSystem.init();
});
