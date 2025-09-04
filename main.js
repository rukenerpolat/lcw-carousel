function loadjQuery(callback) {
  if (window.jQuery) {
    callback();
  } else {
    var script = document.createElement('script');
    script.src = "https://code.jquery.com/jquery-3.7.1.min.js";
    script.onload = callback;
    document.head.appendChild(script);
  }
}

loadjQuery(function () {
  $('body').empty();

  $('head').append(
    '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">'
  );

  $('head').append(
    '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,opsz,wght@0,6..12,200..1000;1,6..12,200..1000&display=swap">'
  );

  var styles = `
  <style>  
    body {
      font-family: "Nunito Sans", sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f5f5f5;
      min-height: 100vh;
    }
    
    .product-detail p {
      font-size: 1.2em;
      color: #999;
      text-align: center;
      margin-bottom: 30px;
    }
    .custom-carousel {
      background-color: #f5f5f5;
      padding: 0 60px;
      position: relative;
      overflow: hidden;
      margin: 20px auto;
      max-width: 1400px;
    }
    .custom-carousel h2 {
      font-size: 30px;
      letter-spacing: 3px;
      margin-bottom: 20px;
      font-weight: 500;
      padding-top: 20px;
    }
    .carousel-list {
      display: flex;
      gap: 15px;
      overflow-x: auto;
      padding: 10px 0 20px 0;
      scroll-behavior: smooth;
      scrollbar-width: none; 
    }
    .carousel-list::-webkit-scrollbar {
      display: none;
    }
    .carousel-item {
      flex: 0 0 auto;
      background-color: white;
      position: relative;
      width: 200px;
      height: 400px;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .carousel-item img {
      width: 100%;
      height: 250px;
      object-fit: cover;
      cursor: pointer;
      transition: transform 0.3s;
    }
    .carousel-item p {
      margin: 5px 0;
      padding: 10px;
      font-size: 14px;
      text-align: left;
    }
    .carousel-item .product-name {
      height: 60px;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .price {
      color: #193DB0;
      font-weight: bold;
      position: absolute;
      bottom: 10px;
      left: 10px;
      font-size: 16px;
    }
    .heart-icon {
      color: #999;
      background-color: #f5f5f5;
      border: 1px solid #ddd;      
      box-shadow: 0 6px 12px rgba(0, 0, 0, .09);
      border-radius: 5px;
      font-size: 18px;
      position: absolute;
      top: 8px;
      right: 8px;
      cursor: pointer;
      transition: all 0.3s;
      width: 34px;
      height: 34px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .heart-icon:hover {
      transform: scale(1.1);
    }
    .heart-icon.active {
      color: #193DB0;
      background-color: white;
    }
    .prev, .next {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      color: #000;
      background: transparent;
      border: none;
      font-size: 1.5em;
      cursor: pointer;
      z-index: 10;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s;
    }
    .prev:hover, .next:hover {
      transform: translateY(-50%) scale(1.1);
    }
    .prev {
      left: 15px;
    }
    .next {
      right: 15px;
    }
  </style>`;

  $('head').append(styles);
  $('body').append('<div class="product-detail"></div>');

  // API URL
  var apiUrl ='https://gist.githubusercontent.com/sevindi/5765c5812bbc8238a38b3cf52f233651/raw/56261d81af8561bf0a7cf692fe572f9e1e91f372/products.json';
  
  // favorites from localStorage
  var savedFavorites = localStorage.getItem('favorites');
  var favorites = savedFavorites ? JSON.parse(savedFavorites) : {};
  
  function createProductCards(products) {
    return `
      <div class="custom-carousel">
        <h2>Benzer Ürünler</h2>
        <div class="carousel-list">
          ${products.map((product, i) => {
            const isFavorite = favorites[i] && favorites[i].wishlist;
            const heartClass = isFavorite ? 'fa-solid fa-heart heart-icon active' : 'fa-regular fa-heart heart-icon';
            return `
              <div class="carousel-item">
                <img src="${product.img}" alt="${product.name}" data-url="${product.url}">
                <i class="${heartClass}" data-index="${i}"></i>
                <p class="product-name">${product.name}</p>
                <p class="price">${product.price} TRY</p>
              </div>
            `;
          }).join('')}
        </div>
        <button class="prev">❮</button>
        <button class="next">❯</button>
      </div>
    `;
  }

  function bindEvents() {
    $('.carousel-item img')
    .off('click')
    .on('click', function () {
      var url = $(this).data('url');
      window.open(url, '_blank');
    });
    
    $('.heart-icon')
    .off('click')
    .on('click', function () {
      var index = $(this).data('index');

      if (!favorites[index]) {
        favorites[index] = {};
      }

      favorites[index].wishlist = !favorites[index].wishlist;
      localStorage.setItem('favorites', JSON.stringify(favorites));
      
      $(this).toggleClass('active fa-regular fa-solid');
    });

    var scrollAmount = 215; // 200px card + 15px gap
    var carouselList = $('.carousel-list');

    $('.next')
    .off('click')
    .on('click', function () {
      carouselList.animate({
        scrollLeft: carouselList.scrollLeft() + scrollAmount,
      },300);
    });
    
    $('.prev')
    .off('click')
    .on('click', function () {
      carouselList.animate({
        scrollLeft: carouselList.scrollLeft() - scrollAmount,
      },300);
    });
  }

  function createCarousel() {
    $.ajax({
    url: apiUrl,
    method: 'GET',
    dataType: 'json',
    success: function (products) {
      $('.custom-carousel').remove();
      var carouselHtml = createProductCards(products);
      
      $('.product-detail').after(carouselHtml);
        bindEvents();
      }
    });
  }
  createCarousel();
});