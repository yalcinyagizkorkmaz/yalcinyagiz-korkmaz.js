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
        if (!(path === '/' || path === '/anasayfa')) {
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
        const wrapper = document.createElement('div');
        wrapper.className = 'carousel-wrapper';

        const container = document.createElement('div');
        container.className = 'container';

        const carouselHeaderWrapper = document.createElement('div');
        carouselHeaderWrapper.className = 'carousel-header-wrapper';

        const carouselHeader = document.createElement('eb-carousel-header');
        carouselHeader.className = 'ng-star-inserted';

        const bannerTitles = document.createElement('div');
        bannerTitles.className = 'banner__titles';

        const h2 = document.createElement('h2');
        h2.className = 'title-primary';
        h2.textContent = 'Sizin için Seçtiklerimiz';

        bannerTitles.appendChild(h2);
        carouselHeader.appendChild(bannerTitles);
        carouselHeaderWrapper.appendChild(carouselHeader);
        container.appendChild(carouselHeaderWrapper);

        const carouselArea = document.createElement('div');
        carouselArea.className = 'carousel-area';
        container.appendChild(carouselArea);

        wrapper.appendChild(container);

        // Oklar için yeni container
        const arrowsContainer = document.createElement('div');
        arrowsContainer.className = 'carousel-arrows-container';

        const leftArrow = document.createElement('button');
        leftArrow.className = 'carousel-arrow left';
        leftArrow.innerHTML = `<svg width="28" height="28" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="20" fill="#fff6ed"/><path d="M24 28L16 20L24 12" stroke="#e99100" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

        const rightArrow = document.createElement('button');
        rightArrow.className = 'carousel-arrow right';
        rightArrow.innerHTML = `<svg width="28" height="28" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="20" fill="#fff6ed"/><path d="M16 12L24 20L16 28" stroke="#e99100" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

        arrowsContainer.appendChild(leftArrow);
        arrowsContainer.appendChild(rightArrow);

        document.body.insertBefore(wrapper, document.body.firstChild);
        document.body.insertBefore(arrowsContainer, wrapper.nextSibling);

        this.createCarouselArea(this.products, carouselArea);

        // Ok event listener'ları
        leftArrow.addEventListener('click', () => {
            const products = carouselArea.querySelector('.products-container');
            products.scrollBy({ left: -(240 + 12), behavior: 'smooth' });
        });

        rightArrow.addEventListener('click', () => {
            const products = carouselArea.querySelector('.products-container');
            products.scrollBy({ left: 240 + 12, behavior: 'smooth' });
        });
    }

    createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.style.position = 'relative';
        card.style.background = '#fff';
        card.style.setProperty('background', '#fff', 'important');
        card.style.display = 'flex';
        card.style.flexDirection = 'column';
        card.style.justifyContent = 'flex-start';
        card.style.boxShadow = '0 2px 8px 0 rgba(0,0,0,0.04)';
        card.style.border = '1px solid #e6e6e6';
        card.style.padding = '24px 16px 16px 16px';
        card.style.margin = '0';
        card.style.minHeight = '550px';
        card.style.minWidth = '240px';
        card.style.maxWidth = '240px';
        card.style.flex = '0 0 240px';
        card.style.borderRadius = '18px';
        card.style.height = '550px';

        // Etiket (varsa)
        if (product.label) {
            const label = document.createElement('div');
            label.className = 'product-label';
            label.innerHTML = `<span style="display:flex;align-items:center;gap:4px;">
                <svg width="20" height="20" fill="#ff9800" viewBox="0 0 24 24"><path d="M7 2v2H3v2h2v14h14V6h2V4h-4V2H7zm2 2h6v2H9V4zm8 4v12H7V8h10z"/></svg>
                ${product.label.replace(/\n/g, '<br>')}
            </span>`;
            label.style.position = 'absolute';
            label.style.left = '12px';
            label.style.top = '12px';
            label.style.background = '#ff9800';
            label.style.color = '#fff';
            label.style.fontSize = '12px';
            label.style.fontWeight = '700';
            label.style.borderRadius = '12px';
            label.style.padding = '4px 8px';
            label.style.zIndex = '3';
            label.style.lineHeight = '1.2';
            label.style.boxShadow = '0 2px 8px 0 rgba(67,176,42,0.08)';
        }
        // AR etiketi (varsa)
        if (product.ar) {
            const arLabel = document.createElement('div');
            arLabel.textContent = 'AR';
            arLabel.style.position = 'absolute';
            arLabel.style.left = '12px';
            arLabel.style.top = '40px';
            arLabel.style.background = '#444';
            arLabel.style.color = '#fff';
            arLabel.style.fontSize = '11px';
            arLabel.style.fontWeight = '700';
            arLabel.style.borderRadius = '8px';
            arLabel.style.padding = '2px 8px';
            arLabel.style.zIndex = '3';
            card.appendChild(arLabel);
        }
        // Video etiketi (varsa)
        if (product.video) {
            const videoLabel = document.createElement('div');
            videoLabel.textContent = 'VIDEO';
            videoLabel.style.position = 'absolute';
            videoLabel.style.left = '12px';
            videoLabel.style.top = product.ar ? '64px' : '40px';
            videoLabel.style.background = '#888';
            videoLabel.style.color = '#fff';
            videoLabel.style.fontSize = '11px';
            videoLabel.style.fontWeight = '700';
            videoLabel.style.borderRadius = '8px';
            videoLabel.style.padding = '2px 8px';
            videoLabel.style.zIndex = '3';
            card.appendChild(videoLabel);
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
        image.style.height = '140px';
        image.style.objectFit = 'contain';
        image.style.margin = '24px 0 12px 0';
        card.appendChild(image);

        // Ürün başlığı
        const title = document.createElement('h3');
        title.innerHTML = `<span style="font-weight:700;">${product.brand}</span> - <span style="font-weight:400;">${product.name}</span>`;
        title.style.fontSize = '14px';
        title.style.fontWeight = '400';
        title.style.color = '#444';
        title.style.margin = '0 0 12px 0';
        title.style.height = '36px';
        title.style.overflow = 'hidden';
        title.style.background = '#fff';
        card.appendChild(title);

        // Yıldız ve yorum satırı
        const ratingRow = document.createElement('div');
        ratingRow.style.display = 'flex';
        ratingRow.style.alignItems = 'center';
        ratingRow.style.gap = '2px';
        ratingRow.style.justifyContent = 'flex-start';
        ratingRow.style.width = '100%';
        ratingRow.style.marginTop = '16px';
        // Yıldızlar (puan varsa ona göre, yoksa random yıldız)
        const rating = product.rating || Math.floor(Math.random() * 5) + 1;
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('span');
            star.innerHTML = '★';
            star.style.color = i <= rating ? '#FFD600' : '#eee';
            star.style.fontSize = '20px';
            ratingRow.appendChild(star);
        }
        // Yorum sayısı (yıldız sayısını göster)
        const review = document.createElement('span');
        review.textContent = `(${rating})`;
        review.style.fontSize = '16px';
        review.style.color = '#888';
        review.style.marginLeft = '8px';
        ratingRow.appendChild(review);
        card.appendChild(ratingRow);

        // Fiyat
        const priceContainer = document.createElement('div');
        priceContainer.style.display = 'flex';
        priceContainer.style.alignItems = 'center';
        priceContainer.style.gap = '8px';
        priceContainer.style.margin = '24px 0 0 0';
        priceContainer.style.justifyContent = 'flex-start';
        priceContainer.style.width = '100%';

        let hasDiscount = product.original_price && product.original_price > product.price;

        if (hasDiscount) {
            // Fiyat kutusunu iki ana bloğa ayır
            const priceBlock = document.createElement('div');
            priceBlock.style.display = 'flex';
            priceBlock.style.alignItems = 'flex-start';
            priceBlock.style.width = '100%';
            priceBlock.style.gap = '32px';

            // Sol blok: Eski fiyat ve indirimli fiyat alt alta
            const leftBlock = document.createElement('div');
            leftBlock.style.display = 'flex';
            leftBlock.style.flexDirection = 'column';
            leftBlock.style.alignItems = 'flex-start';
            leftBlock.style.justifyContent = 'flex-start';
            leftBlock.style.minWidth = '120px';

            // Eski fiyat
            const originalPrice = document.createElement('span');
            originalPrice.textContent = `${product.original_price.toLocaleString('tr-TR', {minimumFractionDigits: 2})} TL`;
            originalPrice.style.fontSize = '16px';
            originalPrice.style.color = '#888';
            originalPrice.style.textDecoration = 'line-through';
            originalPrice.style.fontWeight = 'bold';
            leftBlock.appendChild(originalPrice);

            // İndirimli fiyat
            const price = document.createElement('span');
            price.style.display = 'inline-block';
            price.style.fontSize = '24px';
            price.style.fontWeight = '700';
            price.style.color = '#43b02a';
            price.style.marginTop = '4px';
            price.innerHTML = `${product.price.toLocaleString('tr-TR', {minimumFractionDigits: 2})} <span style=\"font-size:16px;vertical-align:middle;\">TL</span>`;
            leftBlock.appendChild(price);

            // Sağ blok: İndirim oranı
            const rightBlock = document.createElement('div');
            rightBlock.style.display = 'flex';
            rightBlock.style.flexDirection = 'column';
            rightBlock.style.alignItems = 'flex-start';
            rightBlock.style.justifyContent = 'flex-start';

            const discount = Math.round(100 - (product.price / product.original_price) * 100);
            const discountDiv = document.createElement('span');
            discountDiv.style.fontWeight = 'bold';
            discountDiv.style.fontSize = '20px';
            discountDiv.style.color = '#43b02a';
            discountDiv.style.display = 'flex';
            discountDiv.style.alignItems = 'center';
            discountDiv.style.whiteSpace = 'nowrap';
            discountDiv.style.marginLeft = '0px';
            discountDiv.innerHTML = `%${discount} <span style=\"display:inline-flex;align-items:center;background:#43b02a;color:#fff;border-radius:50%;width:20px;height:20px;justify-content:center;margin-left:0px;\"><svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M12 16V8M12 16L8 12M12 16L16 12\" stroke=\"white\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg></span>`;
            rightBlock.appendChild(discountDiv);

            priceBlock.appendChild(leftBlock);
            priceBlock.appendChild(rightBlock);
            priceContainer.appendChild(priceBlock);
        } else {
            // İndirim yoksa sadece fiyatı göster
            const price = document.createElement('span');
            price.textContent = `${product.price.toLocaleString('tr-TR', {minimumFractionDigits: 2})} TL`;
            price.style.fontSize = '20px';
            price.style.fontWeight = '700';
            price.style.color = '#888';
            priceContainer.appendChild(price);
        }

        card.appendChild(priceContainer);

        // Sepete Ekle butonu
        const addToCartBtn = document.createElement('button');
        addToCartBtn.textContent = 'Sepete Ekle';
        addToCartBtn.className = 'add-to-cart-btn custom-add-to-cart-btn';
        addToCartBtn.style.width = '100%';
        addToCartBtn.style.background = '#fff3e0';
        addToCartBtn.style.color = '#e99100';
        addToCartBtn.style.border = 'none';
        addToCartBtn.style.borderRadius = '16px';
        addToCartBtn.style.fontWeight = 'bold';
        addToCartBtn.style.fontSize = '16px';
        addToCartBtn.style.padding = '12px 0';
        addToCartBtn.style.marginTop = 'auto';
        addToCartBtn.style.cursor = 'pointer';
        addToCartBtn.style.boxShadow = '0 2px 8px 0 rgba(0,0,0,0.04)';
        addToCartBtn.style.background = '#fff';
        addToCartBtn.style.transition = 'background 0.2s, color 0.2s';
        addToCartBtn.addEventListener('mouseover', () => {
            addToCartBtn.style.background = '#ff9800';
            addToCartBtn.style.color = '#fff';
        });
        addToCartBtn.addEventListener('mouseout', () => {
            addToCartBtn.style.background = '#fff';
            addToCartBtn.style.color = '#e99100';
        });
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

    createCarouselArea(products, container) {
        const productsContainer = document.createElement('div');
        productsContainer.className = 'products-container';
        productsContainer.style.display = 'flex';
        productsContainer.style.overflowX = 'auto';
        productsContainer.style.gap = '12px';
        productsContainer.style.padding = '0 32px';
        productsContainer.style.scrollBehavior = 'smooth';
        productsContainer.style.background = '#fff';
        productsContainer.style.setProperty('background', '#fff', 'important');

        // Tüm ürünleri göster
        products.forEach(product => {
            const card = this.createProductCard(product);
            productsContainer.appendChild(card);
        });

        container.appendChild(productsContainer);
    }
}

// Stil tanımlamaları
const styles = `
    body,
    eb-root,
    cx-storefront,
    main,
    cx-page-layout,
    cx-page-slot.Section2A.has-components.ng-star-inserted,
    eb-product-carousel,
    .banner,
    .banner__wrapper,
    .product-carousel,
    .products-container {
        background: #fff !important;
    }
    .product-card {
        background: #fff6ed !important; /* veya istediğin başka bir renk */
    }
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
        background: #fff6ed;
        border-radius: 50%;
        width: 56px;
        height: 56px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 28px;
        color: #e99100;
        cursor: pointer;
        box-shadow: 0 2px 8px 0 rgba(0,0,0,0.04);
        border: none;
        z-index: 10;
        transition: background 0.2s, color 0.2s;
    }
    .carousel-arrow svg {
        width: 28px;
        height: 28px;
        display: block;
    }
    .carousel-arrow.left { 
        left: 12px; 
    }
    .carousel-arrow.right { 
        right: 12px; 
    }
    .carousel-wrapper {
        position: relative;
        width: 100%;
        max-width: 1400px;
        margin: 0 auto;
        padding: 0;
    }
    .carousel-arrows-container {
        position: absolute;
        width: 100%;
        max-width: 1544px;
        left: 50%;
        transform: translateX(-50%);
        top: 0;
        height: 100%;
        pointer-events: none;
    }
    .carousel-arrows-container .carousel-arrow {
        pointer-events: auto;
    }
    .product-carousel {
        width: 100%;
        max-width: 1180px;
        height: 729px;
        margin: 0 auto;
        padding: 0 24px;
        position: relative;
        overflow: visible;
        box-sizing: border-box;
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
        flex-wrap: nowrap;
        width: 100%;
        box-sizing: border-box;
        gap: 12px;
        padding: 0 32px;
        scrollbar-width: thin;
        -ms-overflow-style: none;
    }
    .products-container::-webkit-scrollbar {
        display: none;
    }
    .product-card {
        min-width: 240px;
        max-width: 240px;
        flex: 0 0 240px;
        box-sizing: border-box;
    }
    .carousel-area,
    .products-container {
        width: 1248px;
        max-width: 1248px;
        gap: 12px;
        padding: 0;
        margin: 0 auto;
        box-sizing: border-box;
        justify-content: flex-start;
    }
    .product-card {
        min-width: 240px;
        max-width: 240px;
        flex: 0 0 240px;
        margin: 0;
        box-sizing: border-box;
    }
    .carousel-area {
        width: 1248px;
        max-width: 1248px;
        padding: 0;
        margin: 0 auto;
        box-sizing: border-box;
    }
    .product-card {
        min-width: 240px;
        max-width: 240px;
        flex: 0 0 240px;
        border-radius: 18px;
        background: #fff;
        box-shadow: 0 4px 16px 0 rgba(0,0,0,0.08);
        border: 1px solid #f3e7d9;
        padding: 16px 12px 12px 12px;
        margin: 0;
        min-height: 550px;
        height: 550px;
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
    .add-to-cart-btn.custom-add-to-cart-btn {
        background: #fff3e0 !important;
        color: #e99100 !important;
        border: none;
        border-radius: 16px;
        font-weight: bold;
        font-size: 16px;
        padding: 12px 0;
        margin-top: auto;
        cursor: pointer;
        box-shadow: 0 2px 8px 0 rgba(0,0,0,0.04);
        transition: background 0.2s, color 0.2s;
    }
    .add-to-cart-btn.custom-add-to-cart-btn:hover {
        background: #ff9800 !important;
        color: #fff !important;
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
    @media (max-width: 1100px) {
        .product-card {
            min-width: 150px;
            max-width: 150px;
            flex: 0 0 150px;
            min-height: 350px;
            height: 350px;
        }
        .products-container {
            gap: 8px;
            padding: 0 8px;
        }
    }
    @media (max-width: 700px) {
        .product-card {
            min-width: 100px;
            max-width: 100px;
            flex: 0 0 100px;
            min-height: 220px;
            height: 220px;
        }
        .product-card img { height: 90px; }
        .product-carousel { padding: 0 2px; }
        .carousel-bg { border-radius: 12px; }
        .products-container {
            gap: 4px;
            padding: 0 2px;
        }
        .container, .carousel-area {
            padding: 0 2px !important;
            max-width: 100vw !important;
            width: 100vw !important;
        }
    }
    .carousel-main-wrapper {
        width: 100%;
        max-width: 1200px;
        margin: 0 auto 32px auto;
    }
    .banner {
        background: #fff6ed;
        border-radius: 32px;
        padding: 32px 0 16px 0;
        margin-bottom: 32px;
        box-shadow: 0 2px 12px 0 rgba(0,0,0,0.04);
        position: relative;
    }
    .title-primary {
        text-align: left;
        color: #e99100;
        font-size: 1.3rem;
        font-weight: 800;
        margin-bottom: 32px;
        margin-left: 0;
        padding-left: 0;
    }
    .products-container {
        display: flex;
        overflow-x: auto;
        gap: 24px;
        padding: 0 64px 8px 64px;
        scroll-behavior: smooth;
    }
    .product-card {
        background: #fff;
        border-radius: 18px;
        box-shadow: 0 2px 8px 0 rgba(0,0,0,0.04);
        border: 1px solid #f3e7d9;
        padding: 24px 16px 16px 16px;
        min-width: 320px;
        max-width: 320px;
        flex: 0 0 320px;
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
    }
    .carousel-arrow {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background: #fff6ed;
        border-radius: 50%;
        width: 56px;
        height: 56px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 28px;
        color: #e99100;
        cursor: pointer;
        box-shadow: 0 2px 8px 0 rgba(0,0,0,0.04);
        border: none;
        z-index: 10;
        transition: background 0.2s, color 0.2s;
    }
    .carousel-arrow svg {
        width: 28px;
        height: 28px;
        display: block;
    }
    .carousel-arrow.left { 
        left: 12px; 
    }
    .carousel-arrow.right { 
        right: 12px; 
    }
    .add-to-cart-btn {
        width: 100%;
        background: #fff3e0;
        color: #e99100;
        border: none;
        border-radius: 24px;
        font-weight: bold;
        font-size: 20px;
        padding: 18px 0;
        margin-top: 24px;
        cursor: pointer;
        box-shadow: 0 2px 8px 0 rgba(0,0,0,0.04);
    }
    .carousel-header-wrapper {
        background: #fef7ec;
        border-top-left-radius: 48px;
        border-top-right-radius: 48px;
        padding: 32px 48px 16px 48px;
        margin-bottom: 32px !important;
        width: 100%;
        box-sizing: border-box;
    }
    .banner__titles {
        display: flex;
        align-items: center;
        justify-content: flex-start;
    }
    .title-primary {
        color: #f28e00;
        font-size: 2.5rem;
        font-family: 'Quicksand', 'Poppins', Arial, sans-serif;
        font-weight: 700;
        margin: 0;
        line-height: 1.1;
        letter-spacing: 0.5px;
        text-align: center;
    }
    @media (max-width: 768px) {
        .carousel-header-wrapper {
            padding: 16px 16px 8px 16px;
            border-top-left-radius: 24px;
            border-top-right-radius: 24px;
        }
        .title-primary {
            font-size: 1.5rem;
        }
        .carousel-arrow {
            width: 40px;
            height: 40px;
            font-size: 24px;
        }
        .carousel-arrow.left {
            left: 8px;
        }
        .carousel-arrow.right {
            right: 8px;
        }
    }
    .container {
        width: 100%;
        max-width: 1600px;
        margin: 0 auto;
        padding: 0 24px;
        box-sizing: border-box;
        position: relative;
    }
    @media (max-width: 700px) {
        .carousel-area {
            padding: 0 2px;
        }
        .products-container {
            gap: 4px;
            padding: 0 2px;
        }
        .product-card {
            min-width: 120px;
            max-width: 120px;
            flex: 0 0 120px;
            min-height: 160px;
            height: auto;
        }
        .carousel-arrow {
            width: 28px;
            height: 28px;
            font-size: 12px;
            position: static !important;
            margin: 12px auto !important;
            display: block !important;
            transform: none !important;
        }
        .carousel-arrow svg {
            width: 12px;
            height: 12px;
        }
        .title-primary {
            font-size: 1rem;
        }
        .carousel-arrows-container {
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            position: static !important;
            width: 100% !important;
            max-width: 100vw !important;
            left: 0 !important;
            top: 0 !important;
            height: auto !important;
            transform: none !important;
            pointer-events: auto !important;
            margin-bottom: 8px;
        }
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

function createEbbebekCarouselDOM() {
    let ebRoot = document.querySelector('eb-root');
    if (!ebRoot) {
        ebRoot = document.createElement('eb-root');
        document.body.appendChild(ebRoot);
    }
    let storefront = ebRoot.querySelector('cx-storefront');
    if (!storefront) {
        storefront = document.createElement('cx-storefront');
        ebRoot.appendChild(storefront);
    }
    let main = storefront.querySelector('main');
    if (!main) {
        main = document.createElement('main');
        storefront.appendChild(main);
    }
    let pageLayout = main.querySelector('cx-page-layout');
    if (!pageLayout) {
        pageLayout = document.createElement('cx-page-layout');
        main.appendChild(pageLayout);
    }
    let pageSlot = pageLayout.querySelector('cx-page-slot.Section2A.has-components.ng-star-inserted');
    if (!pageSlot) {
        pageSlot = document.createElement('cx-page-slot');
        pageSlot.className = 'Section2A has-components ng-star-inserted';
        pageLayout.appendChild(pageSlot);
    }
    let carousel = pageSlot.querySelector('eb-product-carousel');
    if (!carousel) {
        carousel = document.createElement('eb-product-carousel');
        pageSlot.appendChild(carousel);
    }
    let carouselDiv = carousel.querySelector('div');
    if (!carouselDiv) {
        carouselDiv = document.createElement('div');
        carousel.appendChild(carouselDiv);
    }
    return carouselDiv;
}

async function renderCarousel() {
    const carouselDiv = createEbbebekCarouselDOM();

    // Ürünleri çek
    const response = await fetch('https://gist.githubusercontent.com/sevindi/8bcbde9f02c1d4abe112809c974e1f49/raw/9bf93b58df623a9b16f1db721cd0a7a539296cf0/products.json');
    const products = await response.json();

    // Karusel ana kutusu
    const banner = document.createElement('div');
    banner.className = 'banner';
    banner.style.background = '#fff';
    banner.style.borderRadius = '32px';
    banner.style.padding = '32px 0 16px 0';
    banner.style.marginBottom = '32px';
    banner.style.boxShadow = '0 2px 12px 0 rgba(0,0,0,0.04)';
    banner.style.position = 'relative';

    // eb-carousel-header
    const ebCarouselHeader = document.createElement('eb-carousel-header');
    const bannerTitles = document.createElement('div');
    bannerTitles.className = 'banner__titles';
    const title = document.createElement('h2');
    title.className = 'title-primary';
    title.textContent = 'Sizin için Seçtiklerimiz';
    bannerTitles.appendChild(title);
    ebCarouselHeader.appendChild(bannerTitles);
    banner.appendChild(ebCarouselHeader);

    // Banner wrapper
    const bannerWrapper = document.createElement('div');
    bannerWrapper.className = 'banner__wrapper';
    bannerWrapper.style.position = 'relative';
    bannerWrapper.style.display = 'flex';
    bannerWrapper.style.alignItems = 'center';
    bannerWrapper.style.background = '#fff';

    // Sol ok (button.swiper-prev)
    const leftArrow = document.createElement('button');
    leftArrow.className = 'swiper-prev';
    leftArrow.type = 'button';
    leftArrow.setAttribute('aria-label', 'back');
    leftArrow.innerHTML = `<svg width="28" height="28" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="20" fill="#fff6ed"/><path d="M24 28L16 20L24 12" stroke="#e99100" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    leftArrow.style.marginRight = '4px';

    // Sağ ok (button.swiper-next)
    const rightArrow = document.createElement('button');
    rightArrow.className = 'swiper-next';
    rightArrow.type = 'button';
    rightArrow.setAttribute('aria-label', 'next');
    rightArrow.innerHTML = `<svg width="28" height="28" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="20" fill="#fff6ed"/><path d="M16 12L24 20L16 28" stroke="#e99100" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    rightArrow.style.marginLeft = '4px';

    // Ürünler container
    const productsContainer = document.createElement('div');
    productsContainer.className = 'products-container';
    productsContainer.style.display = 'flex';
    productsContainer.style.overflowX = 'auto';
    productsContainer.style.gap = '24px';
    productsContainer.style.padding = '0 64px 8px 64px';
    productsContainer.style.scrollBehavior = 'smooth';
    productsContainer.style.background = '#fff';
    productsContainer.style.setProperty('background', '#fff', 'important');

    // Kartları ekle
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.style.background = '#fff';
        card.style.setProperty('background', '#fff', 'important');
        card.style.borderRadius = '18px';
        card.style.boxShadow = '0 2px 8px 0 rgba(0,0,0,0.04)';
        card.style.border = '1px solid #f3e7d9';
        card.style.padding = '24px 16px 16px 16px';
        card.style.minWidth = '320px';
        card.style.maxWidth = '320px';
        card.style.flex = '0 0 320px';
        card.style.display = 'flex';
        card.style.flexDirection = 'column';
        card.style.alignItems = 'center';
        card.style.position = 'relative';

        // Etiket (varsa)
        if (product.label) {
            const label = document.createElement('div');
            label.className = 'product-label';
            label.textContent = product.label;
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
            label.style.boxShadow = '0 2px 8px 0 rgba(67,176,42,0.08)';
            card.appendChild(label);
        }
        // AR etiketi (varsa)
        if (product.ar) {
            const arLabel = document.createElement('div');
            arLabel.textContent = 'AR';
            arLabel.style.position = 'absolute';
            arLabel.style.left = '16px';
            arLabel.style.top = '48px';
            arLabel.style.background = '#444';
            arLabel.style.color = '#fff';
            arLabel.style.fontSize = '13px';
            arLabel.style.fontWeight = '700';
            arLabel.style.borderRadius = '8px';
            arLabel.style.padding = '2px 8px';
            arLabel.style.zIndex = '3';
            card.appendChild(arLabel);
        }
        // Video etiketi (varsa)
        if (product.video) {
            const videoLabel = document.createElement('div');
            videoLabel.textContent = 'VIDEO';
            videoLabel.style.position = 'absolute';
            videoLabel.style.left = '16px';
            videoLabel.style.top = product.ar ? '64px' : '40px';
            videoLabel.style.background = '#888';
            videoLabel.style.color = '#fff';
            videoLabel.style.fontSize = '13px';
            videoLabel.style.fontWeight = '700';
            videoLabel.style.borderRadius = '8px';
            videoLabel.style.padding = '2px 8px';
            videoLabel.style.zIndex = '3';
            card.appendChild(videoLabel);
        }

        // Yıldız ve yorum satırı
        const ratingRow = document.createElement('div');
        ratingRow.style.display = 'flex';
        ratingRow.style.alignItems = 'center';
        ratingRow.style.gap = '4px';
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('span');
            star.innerHTML = '★';
            star.style.color = '#FFD600';
            star.style.fontSize = '20px';
            ratingRow.appendChild(star);
        }
        const review = document.createElement('span');
        review.textContent = `(${product.rating || Math.floor(Math.random() * 5) + 1})`;
        review.style.fontSize = '16px';
        review.style.color = '#888';
        review.style.marginLeft = '8px';
        ratingRow.appendChild(review);
        card.appendChild(ratingRow);

        // Fiyat
        const price = document.createElement('div');
        price.textContent = `${product.price.toLocaleString('tr-TR', {minimumFractionDigits: 2})} TL`;
        price.style.fontSize = '20px';
        price.style.fontWeight = '700';
        price.style.color = '#888';
        price.style.display = 'block';
        price.style.marginTop = '4px';
        price.style.background = '#fff';
        card.appendChild(price);

        // Favori butonu
        const favoriteBtn = document.createElement('button');
        favoriteBtn.className = 'favorite-btn';
        favoriteBtn.innerHTML = `<svg width='32' height='32' viewBox='0 0 48 48'><circle cx='24' cy='24' r='24' fill='#fff'/><path d='M24 34s-10.5-6.525-10.5-14.25A6.75 6.75 0 0 1 24 13.5a6.75 6.75 0 0 1 10.5 6.25C34.5 27.475 24 34 24 34z' stroke='#e99100' stroke-width='2' fill='none'/></svg>`;
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

        // Ürün görseli
        const image = document.createElement('img');
        image.src = product.img;
        image.alt = product.name;
        image.style.width = '100%';
        image.style.height = '180px';
        image.style.objectFit = 'contain';
        image.style.margin = '32px 0 16px 0';
        card.appendChild(image);

        // Ürün başlığı
        const title = document.createElement('h3');
        title.innerHTML = `<span style="font-weight:700;">${product.brand}</span> - <span style="font-weight:400;">${product.name}</span>`;
        title.style.fontSize = '18px';
        title.style.fontWeight = '400';
        title.style.color = '#444';
        title.style.margin = '0 0 16px 0';
        title.style.height = '48px';
        title.style.overflow = 'hidden';
        title.style.background = '#fff';
        card.appendChild(title);

        productsContainer.appendChild(card);
    });

    // Ürün kartlarını ekledikten sonra:
    const mevcutKartSayisi = productsContainer.children.length;
    const eksikKartSayisi = 5 - mevcutKartSayisi;

    for (let i = 0; i < eksikKartSayisi; i++) {
        const bosKart = document.createElement('div');
        bosKart.className = 'product-card';
        bosKart.style.position = 'relative';
        bosKart.style.background = '#f7f7f7';
        bosKart.style.setProperty('background', '#f7f7f7', 'important');
        bosKart.style.display = 'flex';
        bosKart.style.flexDirection = 'column';
        bosKart.style.justifyContent = 'center';
        bosKart.style.alignItems = 'center';
        bosKart.style.boxShadow = '0 2px 8px 0 rgba(0,0,0,0.04)';
        bosKart.style.border = '1px dashed #e6e6e6';
        bosKart.style.padding = '24px 16px 16px 16px';
        bosKart.style.margin = '0';
        bosKart.style.minHeight = '480px';
        bosKart.style.minWidth = '320px';
        bosKart.style.maxWidth = '320px';
        bosKart.style.flex = '0 0 320px';
        bosKart.style.borderRadius = '18px';

        // Boş içerik
        const bosYazi = document.createElement('div');
        bosYazi.textContent = 'Boş Kart';
        bosYazi.style.color = '#bbb';
        bosYazi.style.fontSize = '24px';
        bosYazi.style.fontWeight = 'bold';
        bosYazi.style.textAlign = 'center';
        bosKart.appendChild(bosYazi);

        productsContainer.appendChild(bosKart);
    }

    // Karusel container
    const productCarousel = document.createElement('div');
    productCarousel.className = 'product-carousel';
    productCarousel.appendChild(productsContainer);

    // Okları ve karuseli wrapper'a ekle
    bannerWrapper.appendChild(leftArrow);
    bannerWrapper.appendChild(productCarousel);
    bannerWrapper.appendChild(rightArrow);

    // banner'a wrapper'ı ekle
    banner.appendChild(bannerWrapper);

    // Karuseli DOM'a ekle
    carouselDiv.innerHTML = '';
    carouselDiv.appendChild(banner);

    // Oklar ile kaydırma
    leftArrow.onclick = () => {
        productsContainer.scrollBy({ left: -340, behavior: 'smooth' });
    };
    rightArrow.onclick = () => {
        productsContainer.scrollBy({ left: 340, behavior: 'smooth' });
    };
}

renderCarousel(); 

function createEbebekCarouselHeader() {
    // .container
    const container = document.createElement('div');
    container.className = 'container';

    // eb-carousel-header
    const carouselHeader = document.createElement('eb-carousel-header');
    carouselHeader.className = 'ng-star-inserted';

    // .banner__titles
    const bannerTitles = document.createElement('div');
    bannerTitles.className = 'banner__titles';

    // h2 başlık
    const h2 = document.createElement('h2');
    h2.className = 'title-primary';
    h2.textContent = 'Sizin için Seçtiklerimiz';

    // Yapıyı birleştir
    bannerTitles.appendChild(h2);
    carouselHeader.appendChild(bannerTitles);
    container.appendChild(carouselHeader);

    // Karusel ve ürünler için bir alan ekle (örnek)
    const carouselArea = document.createElement('div');
    carouselArea.className = 'carousel-area'; // buraya karusel ve ürünler eklenecek
    container.appendChild(carouselArea);

    // Sayfada uygun yere ekle (örneğin body'nin başına)
    document.body.insertBefore(container, document.body.firstChild);

    // Artık carouselArea'ya ürün karuseli ekleyebilirsiniz
    return carouselArea;
}

// Kullanım:
const carouselArea = createEbebekCarouselHeader();
// Şimdi carouselArea içine karusel ve ürün kartlarını ekleyebilirsiniz. 

const yeniKart = document.createElement('div');
yeniKart.className = 'product-card';
yeniKart.style.position = 'relative';
yeniKart.style.background = '#fff';
yeniKart.style.setProperty('background', '#fff', 'important');
yeniKart.style.display = 'flex';
yeniKart.style.flexDirection = 'column';
yeniKart.style.justifyContent = 'flex-start';
yeniKart.style.boxShadow = '0 2px 8px 0 rgba(0,0,0,0.04)';
yeniKart.style.border = '1px solid #e6e6e6';
yeniKart.style.padding = '24px 16px 16px 16px';
yeniKart.style.margin = '0';
yeniKart.style.minHeight = '400px';
yeniKart.style.minWidth = '240px';
yeniKart.style.maxWidth = '240px';
yeniKart.style.flex = '0 0 240px';
yeniKart.style.borderRadius = '18px';

// Etiket
const label = document.createElement('div');
label.className = 'product-label';
label.innerHTML = `<span style="display:flex;align-items:center;gap:4px;">
    <svg width="24" height="24" fill="#ff9800" viewBox="0 0 24 24"><path d="M7 2v2H3v2h2v14h14V6h2V4h-4V2H7zm2 2h6v2H9V4zm8 4v12H7V8h10z"/></svg>
    YENİ KART
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
label.style.boxShadow = '0 2px 8px 0 rgba(67,176,42,0.08)';
yeniKart.appendChild(label);

// Favori butonu
const favoriteBtn = document.createElement('button');
favoriteBtn.className = 'favorite-btn';
favoriteBtn.innerHTML = `<svg width='48' height='48' viewBox='0 0 48 48'><circle cx='24' cy='24' r='24' fill='#fdf6ed'/><path d='M24 34s-10.5-6.525-10.5-14.25A6.75 6.75 0 0 1 24 13.5a6.75 6.75 0 0 1 10.5 6.25C34.5 27.475 24 34 24 34z' stroke='#e99100' stroke-width='2' fill='none'/></svg>`;
favoriteBtn.style.position = 'absolute';
favoriteBtn.style.top = '16px';
favoriteBtn.style.right = '16px';
favoriteBtn.style.background = 'none';
favoriteBtn.style.border = 'none';
favoriteBtn.style.width = '48px';
favoriteBtn.style.height = '48px';
favoriteBtn.style.cursor = 'pointer';
favoriteBtn.style.zIndex = '2';
yeniKart.appendChild(favoriteBtn);

// Ürün resmi
const image = document.createElement('img');
image.src = 'https://via.placeholder.com/200x140?text=Yeni+Kart'; // örnek resim
image.alt = 'Yeni Kart';
image.style.width = '100%';
image.style.height = '180px';
image.style.objectFit = 'contain';
image.style.margin = '32px 0 16px 0';
yeniKart.appendChild(image);

// Başlık
const title = document.createElement('h3');
title.innerHTML = `<span style="font-weight:700;">Marka</span> - <span style="font-weight:400;">Yeni Kart Ürün Adı</span>`;
title.style.fontSize = '18px';
title.style.fontWeight = '400';
title.style.color = '#444';
title.style.margin = '0 0 16px 0';
title.style.height = '48px';
title.style.overflow = 'hidden';
title.style.background = '#fff';
yeniKart.appendChild(title);

// Yıldız ve yorum
const ratingRow = document.createElement('div');
ratingRow.style.display = 'flex';
ratingRow.style.alignItems = 'center';
ratingRow.style.gap = '4px';
for (let i = 1; i <= 5; i++) {
    const star = document.createElement('span');
    star.innerHTML = '★';
    star.style.color = '#FFD600';
    star.style.fontSize = '20px';
    ratingRow.appendChild(star);
}
const review = document.createElement('span');
review.textContent = '(0)';
review.style.fontSize = '16px';
review.style.color = '#888';
review.style.marginLeft = '8px';
ratingRow.appendChild(review);
yeniKart.appendChild(ratingRow);

// Fiyat
const price = document.createElement('div');
price.textContent = `0,00 TL`;
price.style.fontSize = '20px';
price.style.fontWeight = '700';
price.style.color = '#888';
price.style.display = 'block';
price.style.marginTop = '4px';
price.style.background = '#fff';
yeniKart.appendChild(price);

// Sepete Ekle butonu
const addToCartBtn = document.createElement('button');
addToCartBtn.textContent = 'Sepete Ekle';
addToCartBtn.className = 'add-to-cart-btn custom-add-to-cart-btn';
addToCartBtn.style.width = '100%';
addToCartBtn.style.background = '#fff3e0';
addToCartBtn.style.color = '#e99100';
addToCartBtn.style.border = 'none';
addToCartBtn.style.borderRadius = '16px';
addToCartBtn.style.fontWeight = 'bold';
addToCartBtn.style.fontSize = '16px';
addToCartBtn.style.padding = '12px 0';
addToCartBtn.style.marginTop = 'auto';
addToCartBtn.style.cursor = 'pointer';
addToCartBtn.style.boxShadow = '0 2px 8px 0 rgba(0,0,0,0.04)';
addToCartBtn.style.background = '#fff';
addToCartBtn.style.transition = 'background 0.2s, color 0.2s';
addToCartBtn.addEventListener('mouseover', () => {
    addToCartBtn.style.background = '#ff9800';
    addToCartBtn.style.color = '#fff';
});
addToCartBtn.addEventListener('mouseout', () => {
    addToCartBtn.style.background = '#fff';
    addToCartBtn.style.color = '#e99100';
});
addToCartBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    alert('Ürün sepete eklendi!');
});
yeniKart.appendChild(addToCartBtn);

// Kartı ekle
document.querySelector('.products-container').appendChild(yeniKart); 