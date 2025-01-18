// Carousel Functionality
const images = ["assets/images/cart.jpg", "assets/images/camera.jpg", "assets/images/perfume.jpg", "assets/images/watch.jpg", "assets/images/headphone.jpg"];

let currentIndex = 0;
const heroContainer = document.querySelector(".hero-container");

// Function to update the hero background image
function updateHeroBackground() {
  heroContainer.style.backgroundImage = `url('${images[currentIndex]}')`;
}

// Function to move to the next image
function nextSlide() {
  currentIndex = (currentIndex + 1) % images.length;
  updateHeroBackground();
}

// Function to move to the previous image
function prevSlide() {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  updateHeroBackground();
}

// Automatically switch images every 5 seconds
setInterval(nextSlide, 5000); // 5000 ms = 5 seconds

// Initialize the hero background
updateHeroBackground();


// Function to show notifications
const showNotification = (message, type = "success") => {
  const container = document.getElementById("notificationContainer");
  const notification = document.createElement("div");
  notification.className = `notification ${type}`; // Set success or error type
  notification.innerHTML = `
      <span>${message}</span>
      <i class="fas fa-times" onclick="this.parentElement.remove();"></i>
  `;

  // Add the notification to the container
  container.appendChild(notification);

  // Trigger the fade-in effect
  setTimeout(() => {
      notification.style.opacity = "1";
      notification.style.transform = "translateY(0)"; // Bring notification into view
  }, 10); // Delay to ensure the element is added before the animation starts

  // Remove the notification after 8 seconds
  setTimeout(() => {
      notification.style.opacity = "0";
      notification.style.transform = "translateY(-20px)"; // Slide notification out of view
      notification.addEventListener("transitionend", () => {
          notification.remove(); // Remove the notification from the DOM after transition ends
      });
  }, 3000); // Notification will disappear after 8 seconds
};


// to perform the storing of product in cart
// Selectors
const addToCartButtons = document.querySelectorAll(".add-to-cart");
const cart = JSON.parse(localStorage.getItem("cart")) || [];

// Function to update the cart in localStorage and UI
const updateCartUI = (productName) => {
  localStorage.setItem("cart", JSON.stringify(cart));
  showNotification(`Product "${productName}" added to the cart!`, "success");
};

// Event listener for "Add to Cart" buttons
addToCartButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
      const productCard = event.target.closest(".product-card");
      const productId = productCard.getAttribute("data-id");
      const productName = productCard.querySelector("h3").textContent;
      const productPrice = parseFloat(
          productCard.querySelector(".price").textContent.replace("Rs ", "")
      );
      const productImage = productCard.querySelector("img").src;

      // Check if the product is already in the cart
      const existingProduct = cart.find((item) => item.id === productId);

      if (existingProduct) {
          // If product exists, increase the quantity
          existingProduct.quantity += 1;
      } else {
          // If product doesn't exist, add it to the cart
          cart.push({
              id: productId,
              name: productName,
              price: productPrice,
              image: productImage,
              quantity: 1,
          });
      }

      // Call the updated function with the product name
      updateCartUI(productName);
  });
});

// Functionality for "Buy Now" buttons
const buyNowButtons = document.querySelectorAll(".buy-btn");
buyNowButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    const productCard = event.target.closest(".product-card");
    const productName = productCard.querySelector("h3").textContent;
    showNotification(`Thank you for purchasing ${productName}!`, "success");
    // You can implement additional logic like redirecting to a payment page here.
  });
});


// Selectors for Modal
const modal = document.getElementById("productModal");
const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const modalPrice = document.getElementById("modalPrice");
const modalDescription = document.getElementById("modalDescription");
const modalAvailability = document.getElementById("modalAvailability");
const modalClose = document.getElementById("modalClose");
const modalAddToCart = document.getElementById("modalAddToCart");

// Example data for product details
const productDetails = {
    1: {
        description: "A high-quality camera for capturing life's moments.",
        availability: "In Stock",
    },
    2: {
        description: "A collection of amazing waterbottles with transparent body.",
        availability: "Limited Stock",
    },
    3: {
        description: "An innovative watch which will tell you time.",
        availability: "Out of Stock",
    },
    4: {
        description: "A premium product for your lifestyle.",
        availability: "In Stock",
    },
    5: {
        description: "A versatile headgear to listen music in peace without noise.",
        availability: "In Stock",
    },
    6: {
        description: "High-quality football to play with having Ronaldo signature.",
        availability: "Limited Stock",
    },
};

// Open Modal and Populate Data
document.querySelectorAll(".product-card img, .product-card h3").forEach((element) => {
    element.addEventListener("click", (event) => {
        const productCard = event.target.closest(".product-card");
        const productId = productCard.getAttribute("data-id");
        const productName = productCard.querySelector("h3").textContent;
        const productPrice = productCard.querySelector(".price").textContent;
        const productImage = productCard.querySelector("img").src;

        // Populate Modal
        modalImage.src = productImage;
        modalTitle.textContent = productName;
        modalPrice.textContent = `Price: ${productPrice}`;
        modalDescription.textContent = `Description: ${productDetails[productId]?.description || "No description available."}`;
        modalAvailability.textContent = `Availability: ${productDetails[productId]?.availability || "Unknown"}`;

        // Show Modal
        modal.style.display = "block";

        // Add functionality to "Add to Cart" button in the modal
        modalAddToCart.onclick = () => {
            // Add the product to the cart
            const productPriceValue = parseFloat(productPrice.replace("Rs ", ""));
            const existingProduct = cart.find((item) => item.id === productId);

            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                cart.push({
                    id: productId,
                    name: productName,
                    price: productPriceValue,
                    image: productImage,
                    quantity: 1,
                });
            }
            localStorage.setItem("cart", JSON.stringify(cart));
            showNotification(`Product "${productName}" added to the cart!`, "success");
        };
    });
});

// Close Modal
modalClose.addEventListener("click", () => {
    modal.style.display = "none";
});

// Close Modal on Outside Click
window.addEventListener("click", (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});

