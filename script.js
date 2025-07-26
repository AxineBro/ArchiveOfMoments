      // Функции для управления видео
      function togglePlay(btn) {
        const video = btn.closest(".media-container").querySelector("video");
        const icon = btn.querySelector("i");

        if (video.paused) {
          video.play();
          icon.classList.remove("fa-play");
          icon.classList.add("fa-pause");
        } else {
          video.pause();
          icon.classList.remove("fa-pause");
          icon.classList.add("fa-play");
        }
      }

      function toggleMute(btn) {
        const video = btn.closest(".media-container").querySelector("video");
        const icon = btn.querySelector("i");

        video.muted = !video.muted;
        icon.classList.toggle("fa-volume-up");
        icon.classList.toggle("fa-volume-mute");
      }

      function openFullscreen(btn) {
        const mediaContainer = btn.closest(".media-container");
        const media = mediaContainer.querySelector("video, img");

        // Выходим из полноэкранного режима, если уже в нем
        if (document.fullscreenElement) {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          }
          return;
        }

        // Входим в полноэкранный режим
        if (media.requestFullscreen) {
          media.requestFullscreen();
        } else if (media.webkitRequestFullscreen) {
          /* Safari */
          media.webkitRequestFullscreen();
        } else if (media.webkitEnterFullscreen) {
          /* iOS Safari */
          media.webkitEnterFullscreen();
        } else if (media.msRequestFullscreen) {
          /* IE11 */
          media.msRequestFullscreen();
        }

        // Для видео показываем стандартные элементы управления
        if (media.tagName === "VIDEO") {
          media.controls = true;

          media.addEventListener("fullscreenchange", function () {
            if (!document.fullscreenElement) {
              media.controls = false;
            }
          });
        }
      }

      document.addEventListener("DOMContentLoaded", function () {
        const peopleMenu = document.querySelector(".people-menu");

        if (peopleMenu) {
          // Проверяем, есть ли горизонтальный скролл
          function checkScroll() {
            const hasScroll = peopleMenu.scrollWidth > peopleMenu.clientWidth;
            peopleMenu.classList.toggle("has-scroll", hasScroll);
          }

          // Проверяем при загрузке и при изменении размера окна
          checkScroll();
          window.addEventListener("resize", checkScroll);
        }
      });
      // Автопауза при скролле (чтобы не играло несколько видео одновременно)
      document.addEventListener("scroll", function () {
        document.querySelectorAll("video").forEach((video) => {
          if (isElementInViewport(video)) return;
          video.pause();
          const playBtn = video
            .closest(".media-container")
            .querySelector(".play-btn i");
          if (playBtn) {
            playBtn.classList.remove("fa-pause");
            playBtn.classList.add("fa-play");
          }
        });
      });

      function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
          rect.top >= 0 &&
          rect.left >= 0 &&
          rect.bottom <=
            (window.innerHeight || document.documentElement.clientHeight) &&
          rect.right <=
            (window.innerWidth || document.documentElement.clientWidth)
        );
      }

      function openFullscreenImg(btn) {
  // Находим контейнер и изображение
  const container = btn.closest('.media-container');
  const img = container?.querySelector('img.moment-media');
  
  if (!img) {
    console.error('Изображение не найдено');
    return;
  }

  // Проверяем, находится ли уже элемент в полноэкранном режиме
  if (document.fullscreenElement) {
    // Если кликнули на другое изображение, сначала выходим из текущего полноэкранного режима
    if (document.fullscreenElement !== img) {
      document.exitFullscreen()
        .then(() => requestImgFullscreen(img))
        .catch(err => console.error('Ошибка при выходе из полноэкранного режима:', err));
    } else {
      // Если это то же изображение - просто выходим
      document.exitFullscreen().catch(err => console.error('Ошибка при выходе:', err));
    }
    return;
  }

  // Запускаем полноэкранный режим
  requestImgFullscreen(img);
}

/**
 * Вспомогательная функция для запроса полноэкранного режима
 * @param {HTMLImageElement} img - Изображение для полноэкранного режима
 */
function requestImgFullscreen(img) {
  // Пробуем разные варианты API для разных браузеров
  if (img.requestFullscreen) {
    img.requestFullscreen().catch(err => {
      console.error('Ошибка Fullscreen API:', err);
      showFallbackZoom(img);
    });
  } else if (img.webkitRequestFullscreen) { // Safari
    img.webkitRequestFullscreen();
  } else if (img.webkitEnterFullscreen) { // iOS Safari
    img.webkitEnterFullscreen();
  } else if (img.msRequestFullscreen) { // IE/Edge
    img.msRequestFullscreen();
  } else {
    console.warn('Fullscreen API не поддерживается');
    showFallbackZoom(img);
  }
}

/**
 * Фолбэк-режим увеличения, если Fullscreen API недоступен
 * @param {HTMLImageElement} img - Изображение для увеличения
 */
function showFallbackZoom(img) {
  const clone = img.cloneNode();
  const overlay = document.createElement('div');
  
  // Стили для оверлея
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(0,0,0,0.9)';
  overlay.style.display = 'flex';
  overlay.style.justifyContent = 'center';
  overlay.style.alignItems = 'center';
  overlay.style.zIndex = '9999';
  overlay.style.cursor = 'zoom-out';
  
  // Стили для увеличенного изображения
  clone.style.maxWidth = '90vw';
  clone.style.maxHeight = '90vh';
  clone.style.objectFit = 'contain';
  clone.style.cursor = 'zoom-out';
  
  // Добавляем элементы в DOM
  overlay.appendChild(clone);
  document.body.appendChild(overlay);
  
  // Закрытие по клику
  overlay.addEventListener('click', () => {
    document.body.removeChild(overlay);
  });
  
  // Закрытие по ESC
  document.addEventListener('keydown', function escClose(e) {
    if (e.key === 'Escape') {
      document.body.removeChild(overlay);
      document.removeEventListener('keydown', escClose);
    }
  });
}