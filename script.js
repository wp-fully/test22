// بيانات الوسائط - يمكن إضافة المزيد هنا بسهولة
const mediaData = [
    {
        id: 1,
        path: "images/12123.jpg",
        type: "image",
        title: "صورة ",
        description: "صورة "
    },
    {
        id: 2,
        path: "images/3ff.jpg",
        type: "image", 
        title: "صورة ",
        description: "صورة "
    },
    {
        id: 3,
        path: "images/3fr.jpg",
        type: "image",
        title: "صورة ",
        description: "صورة "
    },
    {
        id: 4,
        path: "images/3r.jpg",
        type: "image",
        title: "صورة 3r",
        description: "منظر خلاب"
    },
    {
        id: 5,
        path: "images/شقة.png",
        type: "image",
        title: "صورة ",
        description: "صورة "
    },
    {
        id: 6,
        path: "images/غرفة 1.png", 
        type: "image",
        title: "صورة ",
        description: "صورة "
    },
    {
        id: 7,
        path: "images/غرفة 2.png",
        type: "image", 
        title: "صورة ",
        description: "صورة "
    },
    {
        id: 8,
        path: "images/غرفة.mp4",
        type: "video",
        title: "فيديو ", 
        description: "فيديو"
    }
];

// متغيرات عامة
let currentFilter = 'all';
let currentMediaIndex = 0;
let filteredMedia = [...mediaData];

// عناصر DOM
const gallery = document.getElementById('gallery');
const lightbox = document.getElementById('lightbox');
const lightboxMedia = document.getElementById('lightboxMedia');
const lightboxTitle = document.getElementById('lightboxTitle');
const closeLightbox = document.getElementById('closeLightbox');
const downloadBtn = document.getElementById('downloadBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const loading = document.getElementById('loading');
const filterBtns = document.querySelectorAll('.filter-btn');

// تهيئة التطبيق
document.addEventListener('DOMContentLoaded', function() {
    showLoading();
    setTimeout(() => {
        initializeGallery();
        hideLoading();
    }, 1000);
});

// عرض شاشة التحميل
function showLoading() {
    loading.classList.add('active');
}

// إخفاء شاشة التحميل
function hideLoading() {
    loading.classList.remove('active');
}

// تهيئة المعرض
function initializeGallery() {
    renderGallery();
    setupEventListeners();
}

// إعداد مستمعات الأحداث
function setupEventListeners() {
    // أزرار التصفية
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.dataset.filter;
            setActiveFilter(this);
            filterMedia(filter);
        });
    });

    // إغلاق اللايت بوكس
    closeLightbox.addEventListener('click', closeLightboxModal);
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightboxModal();
        }
    });

    // التنقل في اللايت بوكس
    prevBtn.addEventListener('click', showPreviousMedia);
    nextBtn.addEventListener('click', showNextMedia);

    // اختصارات لوحة المفاتيح
    document.addEventListener('keydown', function(e) {
        if (lightbox.classList.contains('active')) {
            switch(e.key) {
                case 'Escape':
                    closeLightboxModal();
                    break;
                case 'ArrowLeft':
                    showNextMedia();
                    break;
                case 'ArrowRight':
                    showPreviousMedia();
                    break;
            }
        }
    });

    // تحميل الملف
    downloadBtn.addEventListener('click', downloadCurrentMedia);
}

// عرض المعرض
function renderGallery() {
    gallery.innerHTML = '';
    
    filteredMedia.forEach((item, index) => {
        const galleryItem = createGalleryItem(item, index);
        gallery.appendChild(galleryItem);
    });

    // تأثير الظهور المتدرج
    setTimeout(() => {
        document.querySelectorAll('.gallery-item').forEach((item, index) => {
            setTimeout(() => {
                item.style.animationDelay = `${index * 0.1}s`;
            }, index * 50);
        });
    }, 100);
}

// إنشاء عنصر المعرض
function createGalleryItem(media, index) {
    const item = document.createElement('div');
    item.className = 'gallery-item show';
    item.dataset.type = media.type;
    
    const mediaElement = media.type === 'video' 
        ? `<video src="${media.path}" muted></video>`
        : `<img src="${media.path}" alt="${media.title}">`;
    
    const overlayContent = media.type === 'video'
        ? '<button class="play-button"><i class="fas fa-play"></i></button>'
        : '';

    item.innerHTML = `
        <div class="media-container">
            ${mediaElement}
            <div class="media-overlay">
                ${overlayContent}
            </div>
            <div class="type-badge">
                <i class="fas fa-${media.type === 'video' ? 'video' : 'image'}"></i>
                ${media.type === 'video' ? 'فيديو' : 'صورة'}
            </div>
        </div>
        <div class="item-info">
            <h3 class="item-title">${media.title}</h3>
            <div class="item-actions">
                <button class="action-btn" onclick="openLightbox(${index})">
                    <i class="fas fa-expand"></i>
                    عرض
                </button>
            </div>
        </div>
    `;

    // إضافة حدث النقر لفتح اللايت بوكس
    item.addEventListener('click', function(e) {
        if (!e.target.closest('.item-actions')) {
            openLightbox(index);
        }
    });

    return item;
}

// تعيين الفلتر النشط
function setActiveFilter(activeBtn) {
    filterBtns.forEach(btn => btn.classList.remove('active'));
    activeBtn.classList.add('active');
}

// تصفية الوسائط
function filterMedia(filter) {
    currentFilter = filter;
    
    if (filter === 'all') {
        filteredMedia = [...mediaData];
    } else {
        filteredMedia = mediaData.filter(media => media.type === filter);
    }

    // تأثير الاختفاء
    const items = document.querySelectorAll('.gallery-item');
    items.forEach(item => {
        item.classList.add('hide');
    });

    // إعادة عرض المعرض بعد التأثير
    setTimeout(() => {
        renderGallery();
    }, 300);
}

// فتح اللايت بوكس
function openLightbox(index) {
    currentMediaIndex = index;
    const media = filteredMedia[index];
    
    lightboxTitle.textContent = media.title;
    
    if (media.type === 'video') {
        lightboxMedia.innerHTML = `
            <video controls autoplay style="max-width: 100%; max-height: 600px;">
                <source src="${media.path}" type="video/mp4">
                المتصفح لا يدعم عرض الفيديو
            </video>
        `;
    } else {
        lightboxMedia.innerHTML = `
            <img src="${media.path}" alt="${media.title}" style="max-width: 100%; max-height: 600px;">
        `;
    }
    
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // تحديث أزرار التنقل
    updateNavigationButtons();
}

// إغلاق اللايت بوكس
function closeLightboxModal() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    
    // إيقاف الفيديو إذا كان يعمل
    const video = lightboxMedia.querySelector('video');
    if (video) {
        video.pause();
        video.currentTime = 0;
    }
}

// عرض الوسائط السابقة
function showPreviousMedia() {
    currentMediaIndex = currentMediaIndex > 0 ? currentMediaIndex - 1 : filteredMedia.length - 1;
    openLightbox(currentMediaIndex);
}

// عرض الوسائط التالية
function showNextMedia() {
    currentMediaIndex = currentMediaIndex < filteredMedia.length - 1 ? currentMediaIndex + 1 : 0;
    openLightbox(currentMediaIndex);
}

// تحديث أزرار التنقل
function updateNavigationButtons() {
    prevBtn.style.display = filteredMedia.length > 1 ? 'flex' : 'none';
    nextBtn.style.display = filteredMedia.length > 1 ? 'flex' : 'none';
}

// تحميل الملف الحالي
function downloadCurrentMedia() {
    const media = filteredMedia[currentMediaIndex];
    const link = document.createElement('a');
    link.href = media.path;
    link.download = media.title;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// تأثيرات التفاعل مع الماوس
document.addEventListener('mousemove', function(e) {
    const items = document.querySelectorAll('.gallery-item');
    items.forEach(item => {
        const rect = item.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
            const xPercent = (x / rect.width - 0.5) * 20;
            const yPercent = (y / rect.height - 0.5) * 20;
            item.style.transform = `perspective(1000px) rotateX(${-yPercent}deg) rotateY(${xPercent}deg) translateZ(10px)`;
        } else {
            item.style.transform = '';
        }
    });
});

// إضافة تأثيرات الانتقال السلس
function addSmoothTransitions() {
    const style = document.createElement('style');
    style.textContent = `
        .gallery-item {
            transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
        }
        
        .lightbox-overlay {
            transition: all 0.3s ease;
        }
        
        .lightbox-content {
            animation: lightboxIn 0.4s cubic-bezier(0.23, 1, 0.32, 1);
        }
        
        @keyframes lightboxIn {
            from {
                opacity: 0;
                transform: scale(0.8) translateY(20px);
            }
            to {
                opacity: 1;
                transform: scale(1) translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
}

// تهيئة التأثيرات
addSmoothTransitions();

// معالجة الأخطاء للصور والفيديوهات
document.addEventListener('error', function(e) {
    if (e.target.tagName === 'IMG' || e.target.tagName === 'VIDEO') {
        e.target.style.display = 'none';
        const errorMsg = document.createElement('div');
        errorMsg.className = 'error-placeholder';
        errorMsg.innerHTML = `
            <div style="padding: 2rem; text-align: center; color: #666;">
                <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 1rem;"></i>
                <p>فشل في تحميل ${e.target.tagName === 'IMG' ? 'الصورة' : 'الفيديو'}</p>
            </div>
        `;
        e.target.parentNode.insertBefore(errorMsg, e.target);
    }
}, true);

console.log('معرض الوسائط جاهز! 🎨✨');
