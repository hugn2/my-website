const products = [
    {
        id: 1,
        name: "Áo thun basic",
        price: 150000,
        category: "Thời trang",
        icon: "👕"
    },
    {
        id: 2,
        name: "Túi xách thời trang",
        price: 250000,
        category: "Phụ kiện",
        icon: "👜"
    },
    {
        id: 3,
        name: "Giày thể thao",
        price: 450000,
        category: "Thời trang",
        icon: "👟"
    },
    {
        id: 4,
        name: "Mũ thời trang",
        price: 120000,
        category: "Phụ kiện",
        icon: "🧢"
    },
    {
        id: 5,
        name: "Bình nước cá nhân",
        price: 180000,
        category: "Đồ gia dụng",
        icon: "🧴"
    },
    {
        id: 6,
        name: "Đèn bàn học",
        price: 320000,
        category: "Đồ gia dụng",
        icon: "💡"
    },
    {
        id: 7,
        name: "Kính thời trang",
        price: 190000,
        category: "Phụ kiện",
        icon: "🕶️"
    },
    {
        id: 8,
        name: "Áo khoác nhẹ",
        price: 380000,
        category: "Thời trang",
        icon: "🧥"
    }
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function formatPrice(price) {
    return price.toLocaleString("vi-VN") + "đ";
}

function renderProducts() {
    const list = document.getElementById("product-list");
    const search = document.getElementById("search").value.toLowerCase();
    const category = document.getElementById("category").value;

    const filtered = products.filter(product => {
        const matchSearch = product.name.toLowerCase().includes(search);
        const matchCategory =
            category === "all" || product.category === category;

        return matchSearch && matchCategory;
    });

    if (filtered.length === 0) {
        list.innerHTML = "<p>Không tìm thấy sản phẩm.</p>";
        return;
    }

    list.innerHTML = filtered.map(product => `
        <div class="product">
            <div class="product-img">${product.icon}</div>

            <div class="product-info">
                <p class="category">${product.category}</p>
                <h3>${product.name}</h3>
                <p class="price">${formatPrice(product.price)}</p>

                <button class="add-btn" onclick="addToCart(${product.id})">
                    🛒 Thêm vào giỏ
                </button>
            </div>
        </div>
    `).join("");
}

function addToCart(id) {
    const product = products.find(p => p.id === id);
    const item = cart.find(p => p.id === id);

    if (item) {
        item.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    saveCart();
    alert("Đã thêm sản phẩm vào giỏ hàng!");
}

function changeQuantity(id, amount) {
    const item = cart.find(p => p.id === id);

    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {
        cart = cart.filter(p => p.id !== id);
    }

    saveCart();
}

function removeFromCart(id) {
    cart = cart.filter(p => p.id !== id);
    saveCart();
}

function renderCart() {
    const cartItems = document.getElementById("cart-items");
    const count = document.getElementById("cart-count");
    const totalElement = document.getElementById("cart-total");

    count.textContent = cart.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    if (cart.length === 0) {
        cartItems.innerHTML = "<p>🛒 Giỏ hàng đang trống.</p>";
        totalElement.textContent = "0đ";
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-icon">${item.icon}</div>

            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>${formatPrice(item.price)}</p>

                <div class="quantity">
                    <button onclick="changeQuantity(${item.id}, -1)">−</button>
                    <span>${item.quantity}</span>
                    <button onclick="changeQuantity(${item.id}, 1)">+</button>
                    <button class="remove-btn"
                        onclick="removeFromCart(${item.id})">
                        Xóa
                    </button>
                </div>
            </div>
        </div>
    `).join("");

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    totalElement.textContent = formatPrice(total);
}

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
}

function toggleCart() {
    const cartElement = document.getElementById("cart");
    const overlay = document.getElementById("cart-overlay");

    cartElement.classList.toggle("open");

    overlay.style.display =
        cartElement.classList.contains("open") ? "block" : "none";
}

function checkout() {
    if (cart.length === 0) {
        alert("Giỏ hàng đang trống!");
        return;
    }

    let message = "Xin chào Shop Mây, tôi muốn đặt hàng:%0A%0A";

    cart.forEach(item => {
        message += `- ${item.name} x ${item.quantity}: ${formatPrice(item.price * item.quantity)}%0A`;
    });

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    message += `%0ATổng tiền: ${formatPrice(total)}`;

    // Đổi số điện thoại Zalo của bạn tại đây
    const zaloPhone = "0123456789";

    window.open(
        `https://zalo.me/${zaloPhone}`,
        "_blank"
    );

    alert("Bạn hãy gửi nội dung đơn hàng cho shop qua Zalo nhé!");
}

renderProducts();
renderCart();