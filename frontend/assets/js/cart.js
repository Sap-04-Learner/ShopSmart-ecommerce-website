const cartItemsContainer = document.getElementById("cart-items");
const totalPriceContainer = document.getElementById("total-price");
const clearCartButton = document.getElementById("clear-cart");

// Retrieve the cart data from localStorage
const cart = JSON.parse(localStorage.getItem("cart")) || [];

const updateCartUI = () => {
  cartItemsContainer.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<h2>!! Your Cart Is Empty !!</h2>";
    totalPriceContainer.innerHTML = "";
    return;
  }

  cart.forEach((item, index) => {
    total += item.price * item.quantity;

    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-content">
                        <h3>${item.name}</h3>
                        <p>Price: Rs ${item.price}</p>
                        <div class="quantity-btns">
                            <button class="decrease-btn" data-index="${index}">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="increase-btn" data-index="${index}">+</button>
                        </div>
                        <p>Total: Rs <span class="item-total">${(
                          item.price * item.quantity
                        ).toFixed(2)}</span></p>
                    </div>
                `;
    cartItemsContainer.appendChild(div);
  });

  totalPriceContainer.innerHTML = `<h2 >Total: Rs ${total.toFixed(2)}</h2>`;
};

updateCartUI();

cartItemsContainer.addEventListener("click", function (event) {
  const index = event.target.dataset.index;

  if (event.target.classList.contains("increase-btn")) {
    cart[index].quantity += 1;
  } else if (event.target.classList.contains("decrease-btn")) {
    if (cart[index].quantity > 1) {
      cart[index].quantity -= 1;
    } else {
      cart.splice(index, 1);
    }
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartUI();
});

clearCartButton.addEventListener("click", function () {
  localStorage.removeItem("cart");
  cart.length = 0;
  updateCartUI();
});
