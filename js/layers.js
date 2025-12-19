// Layers Panel Management

function renderLayersPanel() {
    const layersList = document.getElementById('layers-list');
    const layersPanel = document.getElementById('layers-panel');

    if (!layersList) {
        console.warn('Layers list element not found');
        return;
    }

    layersList.innerHTML = '';

    console.log('Rendering layers for slide index:', activeSlideIndex);

    // Get active slide
    let activeSlides = document.querySelectorAll(`.slide[data-slide-index="${activeSlideIndex}"]`);

    // Fallback: if no slides found by data-slide-index, try by position
    if (activeSlides.length === 0) {
        console.log('No slides found by data-slide-index, trying fallback');
        const formats = ['.slide-format-1-1', '.slide-format-4-5', '.slide-format-9-16'];
        const fallbackSlides = [];
        formats.forEach(format => {
            const formatSlides = document.querySelectorAll(format);
            if (formatSlides[activeSlideIndex]) {
                fallbackSlides.push(formatSlides[activeSlideIndex]);
            }
        });
        activeSlides = fallbackSlides;
    }

    console.log('Active slides found:', activeSlides.length);

    if (activeSlides.length === 0) {
        layersList.innerHTML = '<div style="color: rgba(255,255,255,0.5); font-size: 14px; text-align: center; padding: 20px;">Выберите слайд</div>';
        // Скрываем панель когда нет слайда
        if (layersPanel) layersPanel.style.display = 'none';
        return;
    }

    // Use first format slide as reference
    const slide = activeSlides[0];
    const contentWrapper = slide.querySelector('.slide-content-wrapper') || slide;

    console.log('Content wrapper found:', !!contentWrapper);
    console.log('Content wrapper children:', contentWrapper.children.length);

    // Get all child elements
    const elements = Array.from(contentWrapper.children).filter(el => {
        // Filter out system elements
        return !el.classList.contains('slide-number') &&
               !el.classList.contains('watermark-layer') &&
               !el.classList.contains('logo') &&
               !el.classList.contains('active-slide-label');
    });

    console.log('Filtered elements:', elements.length);

    if (elements.length === 0) {
        layersList.innerHTML = '<div style="color: rgba(255,255,255,0.5); font-size: 14px; text-align: center; padding: 20px;">Нет элементов<br><small>Добавьте текст или картинки</small></div>';
        // Скрываем панель когда нет элементов
        if (layersPanel) layersPanel.style.display = 'none';
        return;
    }

    // Показываем панель когда есть элементы
    if (layersPanel) layersPanel.style.display = 'block';
    
    // Create a mapping of displayed index to actual element
    // We reverse for display, but track the actual element reference
    const displayedElements = [...elements].reverse();

    displayedElements.forEach((element, displayIndex) => {
        const layerItem = document.createElement('div');
        layerItem.className = 'layer-item';
        layerItem.style.cssText = `
            padding: 8px 10px;
            background: rgba(255,255,255,0.05);
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            gap: 8px;
            color: white;
            font-size: 13px;
            border: 1px solid transparent;
        `;

        // Determine layer type and icon
        let icon = '📄';
        let name = 'Элемент';

        if (element.classList.contains('emoji')) {
            icon = element.textContent.substring(0, 2);
            name = 'Эмоджи';
        } else if (element.tagName === 'H1' || element.tagName === 'H2') {
            icon = '📝';
            name = element.textContent.substring(0, 20) || 'Заголовок';
        } else if (element.classList.contains('subtitle')) {
            icon = '📝';
            name = element.textContent.substring(0, 20) || 'Подзаголовок';
        } else if (element.tagName === 'P') {
            icon = '📝';
            name = element.textContent.substring(0, 20) || 'Текст';
        } else if (element.classList.contains('slide-image-container')) {
            icon = '🖼️';
            const imgCount = element.querySelectorAll('img').length;
            name = `Картинки (${imgCount})`;
        } else if (element.tagName === 'IMG') {
            icon = '🖼️';
            name = 'Картинка';
        }

        layerItem.innerHTML = `
            <span style="font-size: 18px;">${icon}</span>
            <span style="flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${name}</span>
            <div class="layer-controls" style="display: flex; gap: 3px;">
                <button class="layer-up-btn" title="Вверх на слой" style="background: rgba(255,255,255,0.1); border: none; color: white; width: 24px; height: 24px; border-radius: 4px; cursor: pointer; font-size: 12px;">↑</button>
                <button class="layer-down-btn" title="Вниз на слой" style="background: rgba(255,255,255,0.1); border: none; color: white; width: 24px; height: 24px; border-radius: 4px; cursor: pointer; font-size: 12px;">↓</button>
            </div>
        `;

        // Get buttons
        const upBtn = layerItem.querySelector('.layer-up-btn');
        const downBtn = layerItem.querySelector('.layer-down-btn');

        // Disable buttons if at edges
        if (displayIndex === 0) downBtn.disabled = true;
        if (displayIndex === displayedElements.length - 1) upBtn.disabled = true;

        // Move up in display (increase z-index, move later in DOM)
        upBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            console.log('Moving layer up (displayed), actual index:', elements.indexOf(element));

            // Apply to all slide formats
            activeSlides.forEach(slideEl => {
                const wrapper = slideEl.querySelector('.slide-content-wrapper') || slideEl;
                const allElements = Array.from(wrapper.children).filter(el => {
                    return !el.classList.contains('slide-number') &&
                           !el.classList.contains('watermark-layer') &&
                           !el.classList.contains('logo') &&
                           !el.classList.contains('active-slide-label');
                });

                // Find the element in this slide and move it
                const elementIndex = allElements.indexOf(element);
                if (elementIndex > 0) {
                    // Move element to come earlier in DOM (visually on top)
                    wrapper.insertBefore(allElements[elementIndex], allElements[elementIndex - 1]);
                }
            });

            renderLayersPanel();
            saveToLocalStorage();
        });

        // Move down in display (decrease z-index, move earlier in DOM)
        downBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            console.log('Moving layer down (displayed), actual index:', elements.indexOf(element));

            // Apply to all slide formats
            activeSlides.forEach(slideEl => {
                const wrapper = slideEl.querySelector('.slide-content-wrapper') || slideEl;
                const allElements = Array.from(wrapper.children).filter(el => {
                    return !el.classList.contains('slide-number') &&
                           !el.classList.contains('watermark-layer') &&
                           !el.classList.contains('logo') &&
                           !el.classList.contains('active-slide-label');
                });

                // Find the element in this slide and move it
                const elementIndex = allElements.indexOf(element);
                if (elementIndex < allElements.length - 1) {
                    // Move element to come later in DOM (visually behind)
                    wrapper.insertBefore(allElements[elementIndex + 1], allElements[elementIndex]);
                }
            });

            renderLayersPanel();
            saveToLocalStorage();
        });
        
        // Click to select and edit element
        layerItem.addEventListener('click', (e) => {
            // Don't trigger if clicking buttons
            if (e.target.closest('.layer-controls')) return;
            
            // Highlight layer
            document.querySelectorAll('.layer-item').forEach(item => {
                item.style.background = 'rgba(255,255,255,0.05)';
                item.style.borderColor = 'transparent';
            });
            layerItem.style.background = 'rgba(59, 130, 246, 0.3)';
            layerItem.style.borderColor = 'rgba(59, 130, 246, 0.8)';
            
            // Scroll to element
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Flash highlight on element
            const originalOutline = element.style.outline;
            element.style.outline = '3px solid rgba(59, 130, 246, 0.8)';
            element.style.outlineOffset = '3px';
            setTimeout(() => {
                element.style.outline = originalOutline;
                element.style.outlineOffset = '';
            }, 1500);
            
            // Open appropriate edit panel
            if (element.classList.contains('editable-text')) {
                showTextEditPanel(element);
            } else if (element.classList.contains('slide-image-container')) {
                // Open container settings
                const slide = element.closest('.slide');
                const slideIndex = slide ? parseInt(slide.dataset.slideIndex) || 0 : 0;
                showContainerSettingsPanel(element, slideIndex);
            } else if (element.tagName === 'IMG') {
                // Open image settings
                const slide = element.closest('.slide');
                const slideIndex = slide ? parseInt(slide.dataset.slideIndex) || 0 : 0;
                showContainerSettingsPanel(null, slideIndex, element, slide);
            }
        });
        
        // Hover effect
        layerItem.addEventListener('mouseenter', () => {
            if (layerItem.style.borderColor === 'transparent') {
                layerItem.style.background = 'rgba(255,255,255,0.1)';
            }
        });
        layerItem.addEventListener('mouseleave', () => {
            if (layerItem.style.borderColor === 'transparent') {
                layerItem.style.background = 'rgba(255,255,255,0.05)';
            }
        });
        
        layersList.appendChild(layerItem);
    });
}

// Update layers when slide changes
document.addEventListener('DOMContentLoaded', () => {
    // Initial render
    setTimeout(() => {
        renderLayersPanel();
    }, 1000);
});
