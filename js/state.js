// Глобальное состояние
let projectsData = [];
let currentProjectId = null;
let undoStack = [];
let redoStack = [];

// Хранилища данных
let slideImages = {}; // Хранилище загруженных изображений для каждого слайда
let imageSizes = {}; // Хранилище размеров изображений
let imageGaps = {}; // Хранилище отступов между изображениями для каждого слайда
let containerSettings = {}; // Хранилище настроек контейнеров изображений
let logoSettings = {}; // Хранилище настроек логотипа
let slideNumberSettings = {}; // Хранилище настроек номера слайда
let watermarkSettings = {}; // Хранилище настроек водяного знака
let slideSettings = {}; // Хранилище настроек слайда (фон, эмоджи, backdrop)
let imageTransformSettings = {}; // Хранилище настроек трансформации изображений

// Текущие выбранные элементы
let selectedImage = null;
let selectedImageContainer = null;
let selectedTextElement = null;

// Функции управления состоянием

// Сохранение состояния для отмены
function saveStateForUndo() {
    const state = {
        projectsData: JSON.parse(JSON.stringify(projectsData)),
        currentProjectId: currentProjectId,
        slideImages: JSON.parse(JSON.stringify(slideImages)),
        imageSizes: JSON.parse(JSON.stringify(imageSizes)),
        imageGaps: JSON.parse(JSON.stringify(imageGaps)),
        containerSettings: JSON.parse(JSON.stringify(containerSettings)),
        logoSettings: JSON.parse(JSON.stringify(logoSettings)),
        slideNumberSettings: JSON.parse(JSON.stringify(slideNumberSettings)),
        watermarkSettings: JSON.parse(JSON.stringify(watermarkSettings)),
        slideSettings: JSON.parse(JSON.stringify(slideSettings)),
        imageTransformSettings: JSON.parse(JSON.stringify(imageTransformSettings)),
        timestamp: Date.now()
    };

    undoStack.push(state);
    if (undoStack.length > MAX_UNDO_STEPS) {
            undoStack.shift();
    }
    redoStack = []; // Очищаем стек повтора при новом действии
}

// Отмена (cmd+z)
function undo() {
    if (undoStack.length === 0) {
        showNotification('Нет действий для отмены', 'info');
        return;
    }
    
    const currentState = {
        projectsData: JSON.parse(JSON.stringify(projectsData)),
        currentProjectId: currentProjectId,
        slideImages: JSON.parse(JSON.stringify(slideImages)),
        imageSizes: JSON.parse(JSON.stringify(imageSizes)),
        imageGaps: JSON.parse(JSON.stringify(imageGaps)),
        containerSettings: JSON.parse(JSON.stringify(containerSettings)),
        logoSettings: JSON.parse(JSON.stringify(logoSettings)),
        slideNumberSettings: JSON.parse(JSON.stringify(slideNumberSettings)),
        watermarkSettings: JSON.parse(JSON.stringify(watermarkSettings)),
        slideSettings: JSON.parse(JSON.stringify(slideSettings)),
        imageTransformSettings: JSON.parse(JSON.stringify(imageTransformSettings)),
        timestamp: Date.now()
    };

    redoStack.push(currentState);
    if (redoStack.length > MAX_UNDO_STEPS) {
        redoStack.shift();
    }
    
    const previousState = undoStack.pop();
    restoreState(previousState);
    showNotification('Отменено', 'success');
}

// Повтор (cmd+shift+z)
function redo() {
    if (redoStack.length === 0) {
        showNotification('Нет действий для повтора', 'info');
        return;
    }
    
    const currentState = {
        projectsData: JSON.parse(JSON.stringify(projectsData)),
        currentProjectId: currentProjectId,
        slideImages: JSON.parse(JSON.stringify(slideImages)),
        imageSizes: JSON.parse(JSON.stringify(imageSizes)),
        imageGaps: JSON.parse(JSON.stringify(imageGaps)),
        containerSettings: JSON.parse(JSON.stringify(containerSettings)),
        logoSettings: JSON.parse(JSON.stringify(logoSettings)),
        slideNumberSettings: JSON.parse(JSON.stringify(slideNumberSettings)),
        watermarkSettings: JSON.parse(JSON.stringify(watermarkSettings)),
        slideSettings: JSON.parse(JSON.stringify(slideSettings)),
        imageTransformSettings: JSON.parse(JSON.stringify(imageTransformSettings)),
        timestamp: Date.now()
    };

    undoStack.push(currentState);
    if (undoStack.length > MAX_UNDO_STEPS) {
        undoStack.shift();
    }

    const nextState = redoStack.pop();
    restoreState(nextState);
    showNotification('Повторено', 'success');
}

// Восстановление состояния
function restoreState(state) {
    projectsData = JSON.parse(JSON.stringify(state.projectsData));
    currentProjectId = state.currentProjectId;
    slideImages = JSON.parse(JSON.stringify(state.slideImages));
    imageSizes = JSON.parse(JSON.stringify(state.imageSizes));
    imageGaps = state.imageGaps ? JSON.parse(JSON.stringify(state.imageGaps)) : {};
    containerSettings = state.containerSettings ? JSON.parse(JSON.stringify(state.containerSettings)) : {};
    logoSettings = state.logoSettings ? JSON.parse(JSON.stringify(state.logoSettings)) : {};
    slideNumberSettings = state.slideNumberSettings ? JSON.parse(JSON.stringify(state.slideNumberSettings)) : {};
    watermarkSettings = state.watermarkSettings ? JSON.parse(JSON.stringify(state.watermarkSettings)) : {};
    slideSettings = state.slideSettings ? JSON.parse(JSON.stringify(state.slideSettings)) : {};
    imageTransformSettings = state.imageTransformSettings ? JSON.parse(JSON.stringify(state.imageTransformSettings)) : {};

    if (currentProjectId) {
        const project = projectsData.find(p => p.id === currentProjectId);
        if (project) {
            generateSlides(project);
            renderProjectsList();
        }
    }
}

// Функции для работы с localStorage
function saveToLocalStorage() {
    try {
        localStorage.setItem('slideGenerator_projectsData', JSON.stringify(projectsData));
        localStorage.setItem('slideGenerator_currentProjectId', currentProjectId || '');
        localStorage.setItem('slideImages', JSON.stringify(slideImages));
        localStorage.setItem('imageSizes', JSON.stringify(imageSizes));
        localStorage.setItem('imageGaps', JSON.stringify(imageGaps));
        localStorage.setItem('containerSettings', JSON.stringify(containerSettings));
        localStorage.setItem('logoSettings', JSON.stringify(logoSettings));
        localStorage.setItem('slideNumberSettings', JSON.stringify(slideNumberSettings));
        localStorage.setItem('watermarkSettings', JSON.stringify(watermarkSettings));
        localStorage.setItem('slideSettings', JSON.stringify(slideSettings));
        localStorage.setItem('imageTransformSettings', JSON.stringify(imageTransformSettings));
    } catch (e) {
        // Если localStorage переполнен, пытаемся очистить старые данные
        if (e.name === 'QuotaExceededError') {
            console.warn('localStorage переполнен, очищаем старые данные...');
            try {
                // Очищаем только изображения, сохраняя остальные данные
                const oldSlideImages = slideImages;
                slideImages = {};
                localStorage.setItem('slideGenerator_projectsData', JSON.stringify(projectsData));
                localStorage.setItem('slideGenerator_currentProjectId', currentProjectId || '');
                localStorage.setItem('imageSizes', JSON.stringify(imageSizes));
                localStorage.setItem('imageGaps', JSON.stringify(imageGaps));
                // Восстанавливаем slideImages в памяти
                slideImages = oldSlideImages;
                showNotification('Данные сохранены (изображения не сохранены из-за ограничений браузера)', 'warning');
            } catch (e2) {
                console.error('Не удалось сохранить даже без изображений:', e2);
                showNotification('Не удалось сохранить данные. Используйте экспорт JSON.', 'error');
            }
        } else {
            console.error('Ошибка сохранения в localStorage:', e);
        }
    }
}

function loadFromLocalStorage() {
    try {
        const savedProjects = localStorage.getItem('slideGenerator_projectsData');
        if (savedProjects) {
            projectsData = JSON.parse(savedProjects);
        }
        
        const savedProjectId = localStorage.getItem('slideGenerator_currentProjectId');
        if (savedProjectId) {
            currentProjectId = savedProjectId;
        }
        
        const savedSlideImages = localStorage.getItem('slideImages');
        if (savedSlideImages) {
            slideImages = JSON.parse(savedSlideImages);
        }
        
        const savedImageSizes = localStorage.getItem('imageSizes');
        if (savedImageSizes) {
            imageSizes = JSON.parse(savedImageSizes);
        }
        
        const savedImageGaps = localStorage.getItem('imageGaps');
        if (savedImageGaps) {
            imageGaps = JSON.parse(savedImageGaps);
        }
        
        const savedContainerSettings = localStorage.getItem('containerSettings');
        if (savedContainerSettings) {
            containerSettings = JSON.parse(savedContainerSettings);
        }
        
        const savedLogoSettings = localStorage.getItem('logoSettings');
        if (savedLogoSettings) {
            logoSettings = JSON.parse(savedLogoSettings);
        }

        const savedSlideNumberSettings = localStorage.getItem('slideNumberSettings');
        if (savedSlideNumberSettings) {
            slideNumberSettings = JSON.parse(savedSlideNumberSettings);
        }

        const savedWatermarkSettings = localStorage.getItem('watermarkSettings');
        if (savedWatermarkSettings) {
            watermarkSettings = JSON.parse(savedWatermarkSettings);
        }

        const savedSlideSettings = localStorage.getItem('slideSettings');
        if (savedSlideSettings) {
            slideSettings = JSON.parse(savedSlideSettings);
        }

        const savedImageTransformSettings = localStorage.getItem('imageTransformSettings');
        if (savedImageTransformSettings) {
            imageTransformSettings = JSON.parse(savedImageTransformSettings);
        }

    } catch (e) {
        console.error('Ошибка загрузки из localStorage:', e);
    }
}

// Автоматическое сохранение при изменениях
function autoSave() {
    saveToLocalStorage();
}
