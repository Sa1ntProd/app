// Конфигурация для контуров и overlay
export const OVERLAY_CONFIG = {
  // Настройки для овала лица
  face: {
    // Размер овала (в процентах от размера canvas)
    radiusX: 0.27,        // Радиус по X (27% от ширины canvas)
    radiusY: 0.24,        // Радиус по Y (24% от высоты canvas)
    
    // Смещение центра овала
    centerOffsetX: 0,     // Смещение центра по X (0 = центр)
    centerOffsetY: 0.02,  // Смещение центра по Y (2% = чуть ниже центра)
    
    // Стили основного овала
    strokeColor: '#00FF00',
    strokeWidth: 4,
    dashPattern: [15, 8], // Пунктирная линия
    
    // Стили внутреннего овала
    innerOval: {
      enabled: true,
      scale: 0.95,      // 95% от основного овала
      strokeColor: 'rgba(0, 255, 0, 0.3)',
      strokeWidth: 2
    },
    
    // Настройки текста
    text: {
      main: 'Расположите лицо в овале',
      secondary: 'Держите камеру на уровне глаз',
      mainFontSize: 20,
      secondaryFontSize: 16,
      color: '#FFFFFF',
      shadowColor: 'rgba(0, 0, 0, 0.9)',
      shadowBlur: 8,
      shadowOffset: 2,
      mainOffsetY: -50,    // Отступ от низа для основного текста
      secondaryOffsetY: -25 // Отступ от низа для дополнительного текста
    }
  },
  
  // Настройки для документа
  document: {
    // Размеры прямоугольника (в процентах от размера canvas)
    width: 0.54,          // 54% от ширины canvas (увеличено в 1.2 раза)
    height: 0.42,          // 42% от высоты canvas (увеличено в 1.2 раза)
    
    // Смещение центра прямоугольника
    centerOffsetX: 0,     // Смещение центра по X
    centerOffsetY: 0,     // Смещение центра по Y
    
    // Затемнение фона
    overlayColor: 'rgba(0, 0, 0, 0.6)',
    
    // Стили рамки
    borderColor: '#FFFFFF',
    borderWidth: 3,
    
    // Стили углов
    corners: {
      color: '#00FF00',
      width: 6,
      length: 40        // Длина линии угла в пикселях
    },
    
    // Настройки текста
    text: {
      main: 'Расположите документ в рамке',
      secondary: 'Совместите углы с зелеными метками',
      mainFontSize: 18,
      secondaryFontSize: 14,
      color: '#FFFFFF',
      shadowColor: 'rgba(0, 0, 0, 0.9)',
      shadowBlur: 8,
      shadowOffset: 2,
      topMargin: 35,        // Отступ сверху от рамки для текста
      bottomMargin: 25      // Отступ снизу от рамки для текста
    }
  },
  
  // Настройки камеры
  camera: {
    idealWidth: 1280,
    idealHeight: 720,
    defaultWidth: 640,
    defaultHeight: 480,
    jpegQuality: 0.92
  },
  
  // Адаптивные настройки для разных размеров экрана
  responsive: {
    // Для очень маленьких экранов (до 320px)
    extraSmall: {
      face: {
        radiusX: 0.29,
        radiusY: 0.25,
        centerOffsetY: 0.02,
        strokeWidth: 3,
        innerOval: {
          strokeWidth: 1.5
        },
        text: {
          mainFontSize: 24,
          secondaryFontSize: 11,
          mainOffsetY: -40,
          secondaryOffsetY: -20
        }
      },
      document: {
        width: 0.72,
        height: 0.504,
        borderWidth: 2,
        corners: {
          width: 4,
          length: 25
        },
        text: {
          mainFontSize: 22,
          secondaryFontSize: 10,
          topMargin: 25,
          bottomMargin: 20
        }
      }
    },
    // Для маленьких экранов (321px - 480px)
    small: {
      face: {
        radiusX: 0.28,
        radiusY: 0.24,
        centerOffsetY: 0.02,
        strokeWidth: 3,
        text: {
          mainFontSize: 26,
          secondaryFontSize: 13,
          mainOffsetY: -45,
          secondaryOffsetY: -22
        }
      },
      document: {
        width: 0.696,
        height: 0.492,
        borderWidth: 2.5,
        corners: {
          width: 5,
          length: 30
        },
        text: {
          mainFontSize: 24,
          secondaryFontSize: 11,
          topMargin: 28,
          bottomMargin: 22
        }
      }
    },
    // Для средних экранов (481px - 768px)
    medium: {
      face: {
        radiusX: 0.27,
        radiusY: 0.24,
        centerOffsetY: 0.02,
        text: {
          mainFontSize: 28,
          secondaryFontSize: 15
        }
      },
      document: {
        width: 0.672,
        height: 0.48,
        corners: {
          length: 35
        },
        text: {
          mainFontSize: 26,
          secondaryFontSize: 13,
          topMargin: 30,
          bottomMargin: 23
        }
      }
    },
    // Для больших планшетов и маленьких ноутбуков (769px - 1024px)
    large: {
      face: {
        radiusX: 0.27,
        radiusY: 0.24,
        centerOffsetY: 0.02,
        strokeWidth: 5,
        text: {
          mainFontSize: 32,
          secondaryFontSize: 17
        }
      },
      document: {
        width: 0.648,
        height: 0.468,
        borderWidth: 3.5,
        corners: {
          width: 7,
          length: 45
        },
        text: {
          mainFontSize: 30,
          secondaryFontSize: 16,
          topMargin: 33,
          bottomMargin: 25
        }
      }
    },
    // Для больших десктопов (1367px - 1920px)
    extraLarge: {
      face: {
        radiusX: 0.26,
        radiusY: 0.23,
        centerOffsetY: 0.02,
        strokeWidth: 5,
        text: {
          mainFontSize: 34,
          secondaryFontSize: 19,
          mainOffsetY: -60,
          secondaryOffsetY: -30
        }
      },
      document: {
        width: 0.624,
        height: 0.456,
        borderWidth: 4,
        corners: {
          width: 7,
          length: 50
        },
        text: {
          mainFontSize: 32,
          secondaryFontSize: 17,
          topMargin: 38,
          bottomMargin: 28
        }
      }
    },
    // Для 4K и Ultra HD (1921px+)
    ultraLarge: {
      face: {
        radiusX: 0.25,
        radiusY: 0.23,
        centerOffsetY: 0.02,
        strokeWidth: 6,
        dashPattern: [20, 10],
        innerOval: {
          strokeWidth: 3
        },
        text: {
          mainFontSize: 38,
          secondaryFontSize: 22,
          shadowBlur: 10,
          mainOffsetY: -70,
          secondaryOffsetY: -35
        }
      },
      document: {
        width: 0.60,
        height: 0.444,
        borderWidth: 5,
        corners: {
          width: 8,
          length: 60
        },
        text: {
          mainFontSize: 36,
          secondaryFontSize: 20,
          shadowBlur: 10,
          topMargin: 42,
          bottomMargin: 32
        }
      }
    }
  }
};

// Функция для глубокого объединения объектов
function mergeDeep(target, source) {
  const output = Object.assign({}, target);
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target))
          Object.assign(output, { [key]: source[key] });
        else
          output[key] = mergeDeep(target[key], source[key]);
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
}

function isObject(item) {
  return item && typeof item === 'object' && !Array.isArray(item);
}

// Функция для получения настроек с учетом размера экрана
export function getResponsiveConfig(type) {
  const screenWidth = window.innerWidth;
  const baseConfig = JSON.parse(JSON.stringify(OVERLAY_CONFIG[type]));
  
  let responsiveConfig = null;
  
  if (screenWidth <= 320) {
    responsiveConfig = OVERLAY_CONFIG.responsive.extraSmall[type];
  } else if (screenWidth <= 480) {
    responsiveConfig = OVERLAY_CONFIG.responsive.small[type];
  } else if (screenWidth <= 768) {
    responsiveConfig = OVERLAY_CONFIG.responsive.medium[type];
  } else if (screenWidth <= 1024) {
    responsiveConfig = OVERLAY_CONFIG.responsive.large[type];
  } else if (screenWidth <= 1920) {
    responsiveConfig = OVERLAY_CONFIG.responsive.extraLarge[type];
  } else {
    responsiveConfig = OVERLAY_CONFIG.responsive.ultraLarge[type];
  }
  
  // Объединяем конфигурации
  if (responsiveConfig) {
    return mergeDeep(baseConfig, responsiveConfig);
  }
  
  return baseConfig;
}

// Экспорт для использования в других частях приложения
export default {
  OVERLAY_CONFIG,
  getResponsiveConfig
}