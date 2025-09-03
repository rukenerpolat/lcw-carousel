const PRODUCTS_URL = "https://gist.githubusercontent.com/sevindi/5765c5812bbc8238a38b3cf52f233651/raw/56261d81af8561bf0a7cf692fe572f9e1e91f372/products.json";
const STORAGE_KEY = "carouselProducts";

function injectFont() {
  if (document.getElementById("nunito-font")) return;
  const link = document.createElement("link");
  link.id = "nunito-font";
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,opsz,wght@0,6..12,200..1000;1,6..12,200..1000&display=swap";
  document.head.appendChild(link);
}

async function renderCarousel() {
  injectFont();

  const localStorageItems = localStorage.getItem(STORAGE_KEY);

  if (localStorageItems) {
    createCarousel(JSON.parse(localStorageItems))
  } else {
    fetch(PRODUCTS_URL)
    .then(response => response.json())
    .then(data => {
      createCarousel(data);

      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    });
  }
}

/*
async function loadProducts() {
  let products = [];
  const cached = localStorage.getItem(STORAGE_KEY);

  if (cached) {
    products = JSON.parse(cached);
  } else {
    const response = await fetch(PRODUCTS_URL);
    products = await response.json();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }
  return products;
}
*/
 
 function createCarousel(products) {

  let localStorageItems = JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? {};  

  const container = document.createElement("div");
  container.className = "custom-carousel";

  const title = document.createElement("h2");
  title.textContent = "Benzer Ürünler";
  container.appendChild(title);

  const list = document.createElement("div");
  list.className = "carousel-list";

  products.forEach((product, index) => {
    const item = document.createElement("div");
    item.className = "carousel-item";

    const img = document.createElement("img");
    img.src = product.img;
    img.alt = product.name;
    img.addEventListener("click", () => {
      window.open(product.url, "_blank");
    });

    const name = document.createElement("p");
    name.textContent = product.name;

    const price = document.createElement("p");
    price.className = "price";
    price.textContent = product.price + " TRY";

    const heart = document.createElement("i");
    heart.className = localStorageItems[index]?.wishlist ? "fa-heart heart-icon fa-solid active" : "fa-regular fa-heart heart-icon";

    item.appendChild(img);
    item.appendChild(name);
    item.appendChild(price);
    item.appendChild(heart);
    list.appendChild(item);
  });

  container.appendChild(list);
  
  const hearts = list.querySelectorAll(".heart-icon");
  hearts.forEach((heart, index) => {    
    heart.addEventListener("click", () => {
      
      if (localStorageItems[index]?.wishlist) {
        localStorageItems[index].wishlist = false;
      } else {
        localStorageItems[index].wishlist = true;
      }
      
      heart.classList.toggle("active");  
      heart.classList.toggle("fa-regular");
      heart.classList.toggle("fa-solid");

      localStorage.setItem(STORAGE_KEY, JSON.stringify(localStorageItems));
    });
  });

  const prevBtn = document.createElement("button");
  prevBtn.className = "prev";
  prevBtn.textContent = "❮";

  const nextBtn = document.createElement("button");
  nextBtn.className = "next";
  nextBtn.textContent = "❯";

  container.appendChild(prevBtn);
  container.appendChild(nextBtn);

  injectStyles();

  const productDetail = document.querySelector(".product-detail");
  if (productDetail) {
    productDetail.insertAdjacentElement("afterend", container);
  } else {
    document.body.appendChild(container);
  }

  const firstCard = list.querySelector(".carousel-item");
  const cardStyle = window.getComputedStyle(firstCard);
  const cardWidth = firstCard.offsetWidth + parseInt(cardStyle.marginRight);
  // offsetWidth = içerik + padding + border genişliği
  const scrollAmount = cardWidth;

  nextBtn.addEventListener("click", () => {
    list.scrollBy({ left: scrollAmount, behavior: "smooth" });
  });

  prevBtn.addEventListener("click", () => {
    list.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  });
}

function injectStyles() {
  if (document.getElementById("carousel-styles")) return;
  const style = document.createElement("style");
  style.id = "carousel-styles";
  style.textContent = `
    .custom-carousel {
      font-family: "Nunito Sans", sans-serif;
      margin: 0 auto;
      width: 1400px;
      background-color: #f5f5f5;
      padding: 0 60px;
      position: relative;
      overflow: hidden;
    }

    .custom-carousel h2 {
      font-size: 30px;
      letter-spacing: 2px;
      margin-bottom: 20px;
      font-weight: 500;
    }

    .carousel-list {
      display: flex;
      gap: 15px;
      overflow-x: auto;
      padding: 10px 0;
      scroll-behavior: smooth;
      scrollbar-width: none; 
    }

    .carousel-item {
      flex: 0 0 auto;
      background-color: white;
      position: relative;
      width: 200px;
      height: 400px;
    }

    .carousel-item img {
      width: 100%;
      cursor: pointer;
    }

    .carousel-item p {
      margin: 5px 0;
      padding: 10px;
      font-size: 1em;
      text-align: left;
    }

    .price {
      color: #193DB0;
      font-weight: bold;
      position: absolute;
      bottom: 1px;
      left: 2px;
    }

    .heart-icon {
      color: #999;
      background-color: #f5f5f5;
      border: 1px solid #ddd;      
      box-shadow: 0 6px 12px rgba(0, 0, 0, .09);
      border-radius: 5px;
      font-size: 20px;
      position: absolute;
      top: 8px;
      right: 8px;
      cursor: pointer;
      padding: 5px;
      transition: color 0.3s;
    }

    .heart-icon.active {
      color: #193DB0;       
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
    }

    .prev {
      left: 10px;
    }

    .next {
      right: 10px;
    }
  `;
  document.head.appendChild(style);
}

renderCarousel();