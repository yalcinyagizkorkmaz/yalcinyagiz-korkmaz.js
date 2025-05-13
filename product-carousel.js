console.log('Kod başladı, path:', window.location.pathname);

if (!localStorage.getItem('favorites')) {
    localStorage.setItem('favorites', JSON.stringify([]));
}

// Ebebek Ürün Karuseli
class ProductCarousel {
    constructor() {
        this.products = [
            // ... elle ürünler ...
        ];
        this.favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        this.carouselContainer = null;
        this.init();
    }

    async init() {
        // Sadece ana sayfada çalıştığını kontrol et
        const path = window.location && window.location.pathname;
        if (!(path === '/')) {
            console.log('yanlış sayfa');
            return;
        }

        // Ürünleri getir
        await this.fetchProducts();
        
        // Karuseli oluştur
        this.createCarousel();
        
        // Event listener'ları ekle
        this.addEventListeners();
    }

    async fetchProducts() {
        try {
            const response = await fetch('https://gist.githubusercontent.com/sevindi/8bcbde9f02c1d4abe112809c974e1f49/raw/9bf93b58df623a9b16f1db721cd0a7a539296cf0/products.json');
            if (!response.ok) {
                throw new Error('Network response was not OK');
            }
            const data = await response.json();
            this.products = data;
            localStorage.setItem('products', JSON.stringify(this.products));
        } catch (error) {
            console.error('Hata oluştu:', error);
            this.products = [];
        }
    }

    createCarousel() {
        // Banner ve container
        const banner = document.createElement('div');
        banner.className = 'banner';
        const container = document.createElement('div');
        container.className = 'container';

        // Başlık
        const bannerTitles = document.createElement('div');
        bannerTitles.className = 'banner__titles';
        const title = document.createElement('h2');
        title.className = 'title-primary';
        title.textContent = 'Sizin için Seçtiklerimiz';
        bannerTitles.appendChild(title);

        // Wrapper
        const bannerWrapper = document.createElement('div');
        bannerWrapper.className = 'banner__wrapper';

        // Karusel
        this.carouselContainer = document.createElement('div');
        this.carouselContainer.className = 'product-carousel';
        this.carouselContainer.style.position = 'relative';

        // Oklar
        this.addCarouselArrows(this.carouselContainer);

        // Ürünler
        const productsContainer = document.createElement('div');
        productsContainer.className = 'products-container';
        this.products.forEach(product => {
            const productCard = this.createProductCard(product);
            productsContainer.appendChild(productCard);
        });
        this.carouselContainer.appendChild(productsContainer);

        // Hiyerarşi
        bannerWrapper.appendChild(this.carouselContainer);
        container.appendChild(bannerTitles);
        container.appendChild(bannerWrapper);
        banner.appendChild(container);

        // Sayfaya ekle
        const stories = document.querySelector('.stories-section');
        if (stories) {
            stories.parentNode.insertBefore(banner, stories.nextSibling);
        }
    }

    createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.style.position = 'relative';
        card.style.background = '#fff';
        card.style.display = 'flex';
        card.style.flexDirection = 'column';
        card.style.justifyContent = 'flex-start';
        card.style.boxShadow = '0 2px 8px 0 rgba(0,0,0,0.04)';
        card.style.border = '1px solid #e6e6e6';
        card.style.padding = '24px 16px 16px 16px';
        card.style.margin = '0';
        card.style.minHeight = '480px';
        card.style.minWidth = '320px';
        card.style.maxWidth = '320px';
        card.style.flex = '0 0 320px';
        card.style.borderRadius = '18px';

        // Etiket (varsa)
        if (product.label) {
            const label = document.createElement('div');
            label.className = 'product-label';
            label.innerHTML = `<span style="display:flex;align-items:center;gap:4px;">
                <svg width="24" height="24" fill="#ff9800" viewBox="0 0 24 24"><path d="M7 2v2H3v2h2v14h14V6h2V4h-4V2H7zm2 2h6v2H9V4zm8 4v12H7V8h10z"/></svg>
                ${product.label.replace(/\n/g, '<br>')}
            </span>`;
            label.style.position = 'absolute';
            label.style.left = '16px';
            label.style.top = '16px';
            label.style.background = '#ff9800';
            label.style.color = '#fff';
            label.style.fontSize = '13px';
            label.style.fontWeight = '700';
            label.style.borderRadius = '12px';
            label.style.padding = '6px 12px';
            label.style.zIndex = '3';
            label.style.lineHeight = '1.2';
            label.style.boxShadow = '0 2px 8px 0 rgba(255,152,0,0.08)';
            card.appendChild(label);
        }

        // Favori butonu (sağ üst)
        const favoriteBtn = document.createElement('button');
        favoriteBtn.className = 'favorite-btn';
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        const isFavorite = favorites.includes(product.id);
        favoriteBtn.innerHTML = isFavorite
            ? `<svg width='48' height='48' viewBox='0 0 48 48'><circle cx='24' cy='24' r='24' fill='#fdf6ed'/><path d='M24 34s-10.5-6.525-10.5-14.25A6.75 6.75 0 0 1 24 13.5a6.75 6.75 0 0 1 10.5 6.25C34.5 27.475 24 34 24 34z' stroke='#e99100' stroke-width='2' fill='#e99100'/></svg>`
            : `<svg width='48' height='48' viewBox='0 0 48 48'><circle cx='24' cy='24' r='24' fill='#fdf6ed'/><path d='M24 34s-10.5-6.525-10.5-14.25A6.75 6.75 0 0 1 24 13.5a6.75 6.75 0 0 1 10.5 6.25C34.5 27.475 24 34 24 34z' stroke='#e99100' stroke-width='2' fill='none'/></svg>`;
        favoriteBtn.dataset.productId = product.id;
        favoriteBtn.style.position = 'absolute';
        favoriteBtn.style.top = '16px';
        favoriteBtn.style.right = '16px';
        favoriteBtn.style.background = 'none';
        favoriteBtn.style.border = 'none';
        favoriteBtn.style.width = '48px';
        favoriteBtn.style.height = '48px';
        favoriteBtn.style.cursor = 'pointer';
        favoriteBtn.style.zIndex = '2';
        card.appendChild(favoriteBtn);

        // Ürün resmi
        const image = document.createElement('img');
        image.src = product.img;
        image.alt = product.name;
        image.style.width = '100%';
        image.style.height = '180px';
        image.style.objectFit = 'contain';
        image.style.margin = '32px 0 16px 0';
        card.appendChild(image);

        // Ürün başlığı (marka bold, ürün adı normal)
        const title = document.createElement('h3');
        title.innerHTML = `<span style="font-weight:700;">${product.brand}</span> - <span style="font-weight:400;">${product.name}</span>`;
        title.style.fontSize = '18px';
        title.style.fontWeight = '400';
        title.style.color = '#444';
        title.style.margin = '0 0 16px 0';
        title.style.height = '48px';
        title.style.overflow = 'hidden';
        card.appendChild(title);

        // Yıldızlı puan ve yorum sayısı
        const ratingRow = document.createElement('div');
        ratingRow.style.display = 'flex';
        ratingRow.style.alignItems = 'center';
        ratingRow.style.gap = '4px';
        const fullStars = Math.floor(product.rating);
        const halfStar = product.rating % 1 >= 0.5;
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('span');
            if (i <= fullStars) {
                star.innerHTML = '★';
                star.style.color = '#FFD600';
            } else if (i === fullStars + 1 && halfStar) {
                star.innerHTML = '<span style="position:relative;display:inline-block;width:15px;overflow:hidden;"><span style="color:#FFD600;position:absolute;left:0;width:7px;overflow:hidden;">★</span><span style="color:#E0E0E0;">★</span></span>';
            } else {
                star.innerHTML = '★';
                star.style.color = '#E0E0E0';
            }
            star.style.fontSize = '20px';
            ratingRow.appendChild(star);
        }
        const review = document.createElement('span');
        review.textContent = `(${product.reviewCount || 0})`;
        review.style.fontSize = '16px';
        review.style.color = '#888';
        review.style.marginLeft = '8px';
        ratingRow.appendChild(review);
        card.appendChild(ratingRow);

        // Fiyat ve indirim alanı
        const priceContainer = document.createElement('div');
        priceContainer.style.display = 'flex';
        priceContainer.style.alignItems = 'center';
        priceContainer.style.gap = '8px';
        priceContainer.style.margin = '16px 0 0 0';

        // Eski fiyat (her zaman göster)
        if (product.original_price) {
            const originalPrice = document.createElement('span');
            originalPrice.textContent = `${product.original_price.toLocaleString('tr-TR', {minimumFractionDigits: 2})} TL`;
            originalPrice.style.fontSize = '20px';
            originalPrice.style.color = '#888';
            originalPrice.style.textDecoration = 'line-through';
            originalPrice.style.fontWeight = '500';
            priceContainer.appendChild(originalPrice);
        }

        // İndirim rozeti (sadece indirim varsa)
        if (product.original_price && product.original_price !== product.price) {
            const discount = document.createElement('span');
            const discountAmount = Math.round(((product.original_price - product.price) / product.original_price) * 100);
            discount.innerHTML = `<span style="
                display:inline-flex;
                align-items:center;
                background:#43b02a;
                color:#fff;
                font-weight:700;
                font-size:20px;
                border-radius:50px;
                padding:2px 12px 2px 8px;
                gap:4px;
            ">%${discountAmount} <svg width='20' height='20' style='margin-left:2px' viewBox='0 0 20 20'><circle cx='10' cy='10' r='10' fill='#43b02a'/><path d='M10 6v6M10 12l-2-2m2 2l2-2' stroke='#fff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/></svg></span>`;
            priceContainer.appendChild(discount);
        }

        // Güncel fiyat (her zaman)
        const price = document.createElement('div');
        price.textContent = `${product.price.toLocaleString('tr-TR', {minimumFractionDigits: 2})} TL`;
        price.style.fontSize = '32px';
        price.style.fontWeight = '700';
        price.style.color = '#43b02a';
        price.style.display = 'block';
        price.style.marginTop = '4px';

        card.appendChild(priceContainer);
        card.appendChild(price);

        // Sepette fiyatı varsa (örnek: product.inCartPrice)
        if (product.inCartPrice) {
            const inCart = document.createElement('div');
            inCart.textContent = `Sepette ${product.inCartPrice.toLocaleString('tr-TR', {minimumFractionDigits: 2})} TL`;
            inCart.style.background = '#eafaf3';
            inCart.style.color = '#43b02a';
            inCart.style.fontWeight = '600';
            inCart.style.fontSize = '18px';
            inCart.style.borderRadius = '16px';
            inCart.style.padding = '8px 16px';
            inCart.style.margin = '16px 0 0 0';
            inCart.style.display = 'inline-block';
            card.appendChild(inCart);
        }

        // Sepete Ekle butonu
        const addToCartBtn = document.createElement('button');
        addToCartBtn.textContent = 'Sepete Ekle';
        addToCartBtn.className = 'add-to-cart-btn';
        addToCartBtn.style.width = '100%';
        addToCartBtn.style.background = '#fdf6ed';
        addToCartBtn.style.color = '#e99100';
        addToCartBtn.style.border = 'none';
        addToCartBtn.style.borderRadius = '24px';
        addToCartBtn.style.fontWeight = 'bold';
        addToCartBtn.style.fontSize = '20px';
        addToCartBtn.style.padding = '18px 0';
        addToCartBtn.style.marginTop = '24px';
        addToCartBtn.style.cursor = 'pointer';
        addToCartBtn.style.boxShadow = '0 2px 8px 0 rgba(0,0,0,0.04)';
        addToCartBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            alert('Ürün sepete eklendi!');
        });
        card.appendChild(addToCartBtn);

        // Ürüne tıklama eventi
        card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('favorite-btn') && e.target !== addToCartBtn) {
                window.open(`https://www.ebebek.com/p/${product.slug}`, '_blank');
            }
        });

        favoriteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
            const idx = favorites.indexOf(product.id);
            if (idx === -1) {
                favorites.push(product.id);
            } else {
                favorites.splice(idx, 1);
            }
            localStorage.setItem('favorites', JSON.stringify(favorites));
            favoriteBtn.innerHTML = favorites.includes(product.id)
                ? `<svg width='48' height='48' viewBox='0 0 48 48'><circle cx='24' cy='24' r='24' fill='#fdf6ed'/><path d='M24 34s-10.5-6.525-10.5-14.25A6.75 6.75 0 0 1 24 13.5a6.75 6.75 0 0 1 10.5 6.25C34.5 27.475 24 34 24 34z' stroke='#e99100' stroke-width='2' fill='#e99100'/></svg>`
                : `<svg width='48' height='48' viewBox='0 0 48 48'><circle cx='24' cy='24' r='24' fill='#fdf6ed'/><path d='M24 34s-10.5-6.525-10.5-14.25A6.75 6.75 0 0 1 24 13.5a6.75 6.75 0 0 1 10.5 6.25C34.5 27.475 24 34 24 34z' stroke='#e99100' stroke-width='2' fill='none'/></svg>`;
        });

        return card;
    }

    addEventListeners() {
        // Favori butonları için event delegation
        this.carouselContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('favorite-btn')) {
                const productId = e.target.dataset.productId;
                this.toggleFavorite(productId, e.target);
            }
        });
    }

    toggleFavorite(productId, button) {
        const index = this.favorites.indexOf(productId);
        
        if (index === -1) {
            this.favorites.push(productId);
            button.innerHTML = `<svg width='48' height='48' viewBox='0 0 48 48'><circle cx='24' cy='24' r='24' fill='#fdf6ed'/><path d='M24 34s-10.5-6.525-10.5-14.25A6.75 6.75 0 0 1 24 13.5a6.75 6.75 0 0 1 10.5 6.25C34.5 27.475 24 34 24 34z' stroke='#e99100' stroke-width='2' fill='#e99100'/></svg>`;
        } else {
            this.favorites.splice(index, 1);
            button.innerHTML = `<svg width='48' height='48' viewBox='0 0 48 48'><circle cx='24' cy='24' r='24' fill='#fdf6ed'/><path d='M24 34s-10.5-6.525-10.5-14.25A6.75 6.75 0 0 1 24 13.5a6.75 6.75 0 0 1 10.5 6.25C34.5 27.475 24 34 24 34z' stroke='#e99100' stroke-width='2' fill='none'/></svg>`;
        }
        
        localStorage.setItem('favorites', JSON.stringify(this.favorites));
    }

    // Karusel oklarını ekle
    addCarouselArrows(container) {
        const leftArrow = document.createElement('div');
        leftArrow.className = 'carousel-arrow left';
        leftArrow.innerHTML = '&#8592;';
        const rightArrow = document.createElement('div');
        rightArrow.className = 'carousel-arrow right';
        rightArrow.innerHTML = '&#8594;';
        container.appendChild(leftArrow);
        container.appendChild(rightArrow);
        leftArrow.style.left = '12px';
        rightArrow.style.right = '12px';
        leftArrow.addEventListener('click', () => {
            const products = container.querySelector('.products-container');
            products.scrollBy({ left: -250, behavior: 'smooth' });
        });
        rightArrow.addEventListener('click', () => {
            const products = container.querySelector('.products-container');
            products.scrollBy({ left: 250, behavior: 'smooth' });
        });
    }
}

// Stil tanımlamaları
const styles = `
    .carousel-bg {
        background: #faf6ed;
        border-radius: 28px;
        padding: 32px 0 16px 0;
        margin-bottom: 32px;
        box-shadow: 0 2px 12px 0 rgba(0,0,0,0.04);
    }
    .carousel-arrow {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background: #fdf6ed;
        border: none;
        box-shadow: 0 2px 8px 0 rgba(0,0,0,0.06);
        border-radius: 50%;
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 28px;
        color: #e99100;
        cursor: pointer;
        z-index: 10;
        opacity: 1;
        font-weight: bold;
        transition: background 0.2s;
    }
    .carousel-arrow.left { left: 12px; }
    .carousel-arrow.right { right: 12px; }
    .carousel-arrow:hover { background: #ffe0b2; }
    .product-carousel {
        width: 100%;
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 15px;
        position: relative;
    }
    .product-carousel h2 {
        font-size: 28px;
        margin-bottom: 24px;
        color: #e99100;
        font-weight: 700;
        background: none;
        text-align: left;
        letter-spacing: 0.5px;
        padding-left: 24px;
        margin-left: 0;
    }
    .products-container {
        display: flex;
        overflow-x: auto;
        gap: 12px;
        flex-wrap: nowrap;
        padding: 0 24px 8px 24px;
    }
    .product-card {
        min-width: 240px;
        max-width: 240px;
        flex: 0 0 240px;
        border-radius: 18px;
        background: #fff;
        box-shadow: 0 4px 16px 0 rgba(0,0,0,0.08)';
        border: 1px solid #f3e7d9';
        padding: 16px 12px 12px 12px;
        margin: 0;
        min-height: 370px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        position: relative;
        transition: box-shadow 0.2s;
    }
    .product-card:hover {
        box-shadow: 0 8px 24px 0 rgba(0,0,0,0.12);
    }
    .product-label {
        position: absolute;
        left: 12px;
        top: 12px;
        background: #43b02a;
        color: #fff;
        font-size: 13px;
        font-weight: 700;
        border-radius: 8px;
        padding: 4px 10px;
        z-index: 3;
        line-height: 1.2;
        white-space: pre-line;
        box-shadow: 0 2px 8px 0 rgba(67,176,42,0.08);
    }
    .product-card img {
        width: 100%;
        height: 140px;
        object-fit: contain;
        margin-bottom: 8px;
        border-radius: 8px;
        background: #f7f7f7;
    }
    .product-card h3 {
        font-size: 15px;
        font-weight: 600;
        color: #222;
        margin: 0 0 8px 0';
        height: 38px;
        overflow: hidden;
    }
    .price-container {
        display: flex;
        flex-direction: column;
        gap: 4px;
        margin: 8px 0;
    }
    .price {
        font-size: 20px;
        font-weight: bold;
        color: #43b02a;
    }
    .original-price {
        font-size: 14px;
        color: #999;
        text-decoration: line-through;
    }
    .discount {
        font-size: 13px;
        color: #00B67A;
        font-weight: bold;
    }
    .favorite-btn {
        position: absolute;
        top: 12px;
        right: 12px;
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        z-index: 2;
        transition: color 0.2s;
    }
    .favorite-btn:active, .favorite-btn.filled {
        color: #ff9800;
    }
    .add-to-cart-btn {
        width: 100%;
        background: #fff3e0;
        color: #e99100;
        border: none;
        border-radius: 12px;
        font-weight: bold;
        font-size: 15px;
        padding: 10px 0;
        margin-top: auto;
        cursor: pointer;
        transition: background 0.2s;
    }
    .add-to-cart-btn:hover {
        background: #ffe0b2;
    }
    @media (max-width: 900px) {
        .product-card { width: 180px; min-height: 340px; }
        .products-container { gap: 12px; }
        .carousel-bg { padding: 18px 0 8px 0; }
    }
    @media (max-width: 600px) {
        .product-card { width: 140px; min-height: 280px; }
        .product-card img { height: 90px; }
        .product-carousel { padding: 0 2px; }
        .carousel-bg { border-radius: 12px; }
    }
    .carousel-main-wrapper {
        width: 100%;
        max-width: 1200px;
        margin: 0 auto 32px auto;
    }
`;

// Stilleri sayfaya ekle
const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

// Karuseli başlat
new ProductCarousel(); 

const FAVORI_KEY = 'favorites';

function toggleFavorite(id) {
  let favorites = JSON.parse(localStorage.getItem(FAVORI_KEY)) || [];
  if (favorites.includes(id)) {
    favorites = favorites.filter(favId => favId !== id);
  } else {
    favorites.push(id);
  }
  localStorage.setItem(FAVORI_KEY, JSON.stringify(favorites));
}

function createCarousel(products) {
  const section = document.createElement('section');
  section.innerHTML = `
    <h2 style="font-size: 1.5rem; margin: 1rem 0;">Beğenebileceğinizi düşündüklerimiz</h2>
    <div class="carousel-container" style="display: flex; overflow-x: auto; gap: 1rem; scroll-snap-type: x mandatory; padding: 1rem;">
    </div>
  `;

  const container = section.querySelector('.carousel-container');
  const favorites = JSON.parse(localStorage.getItem(FAVORI_KEY)) || [];

  products.forEach(product => {
    const isFavorite = favorites.includes(product.id);
    const discount = (product.original_price && product.original_price > product.price) ?
      Math.round(100 - (product.price / product.original_price) * 100) : null;

    const card = document.createElement('div');
    card.style = `
      min-width: 200px;
      flex-shrink: 0;
      scroll-snap-align: start;
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 1rem;
      position: relative;
    `;

    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" style="width: 100%; height: auto; border-radius: 6px;" />
      <h3 style="font-size: 1rem; margin: 0.5rem 0;">${product.name}</h3>
      <p style="margin: 0.25rem 0;">
        <strong>${product.price}₺</strong>
        ${discount !== null ? `<span style="text-decoration: line-through; color: #888; margin-left: 0.5rem;">${product.original_price}₺</span>` : ''}
      </p>
      ${discount !== null ? `<p style="color: #e67e22;">%${discount} indirim</p>` : ''}
      <span class="fav-icon" data-id="${product.id}" style="position: absolute; top: 0.5rem; right: 0.5rem; cursor: pointer; font-size: 1.5rem; color: ${isFavorite ? 'orange' : '#ccc'};">♥</span>
    `;

    card.addEventListener('click', () => {
      window.open(product.url, '_blank');
    });

    card.querySelector('.fav-icon').addEventListener('click', (e) => {
      e.stopPropagation();
      toggleFavorite(product.id);
      e.target.style.color = e.target.style.color === 'orange' ? '#ccc' : 'orange';
    });

    container.appendChild(card);
  });

  // Hikayelerden sonra eklemek için:
  const stories = document.querySelector('.stories-section');
  stories.parentNode.insertBefore(section, stories.nextSibling);
}

// Ana sayfa kontrolü
const path = window.location && window.location.pathname;
if (!(path === '/' || path === '/anasayfa')) {
  console.log('yanlış sayfa');
} else {
  // Ürünleri getir ve carouseli oluştur
  createCarousel(products); // products senin ürün dizin
} 