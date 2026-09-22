
let cars = [];
let cart = JSON.parse(localStorage.getItem("carCart")) || [];

document.addEventListener("DOMContentLoaded", function () {
    loadCars();
    setupNavigation();
    setupMobileMenu();
    setupSearch();
    setupFilters();
    setupContactForm();
    updateCartCount();
});

async function loadCars() {
    try {
        let response = await fetch("data/cars.json");

        if (!response.ok) {
            throw new Error("Unable to load cars.json");
        }

        cars = await response.json();

        displayHomeCars();
        displayAllCars();
        displayFeaturedCars();
        displayCategories();
        displayProductDetails();
        displayCart();
    } catch (error) {
        console.error("Error loading car data:", error);

        let containers = document.querySelectorAll(".car-container, #carContainer, #carsContainer");

        containers.forEach(function (container) {
            container.innerHTML =
                '<div class="error-message">' +
                '<h3>Unable to load cars</h3>' +
                '<p>Please make sure the website is running through a local server.</p>' +
                '</div>';
        });
    }
}

function displayHomeCars() {
    let container = document.getElementById("homeCars");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    let featuredCars = cars.slice(0, 6);

    featuredCars.forEach(function (car) {
        container.innerHTML += createCarCard(car);
    });
}

function displayAllCars() {
    let container = document.getElementById("carsContainer");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    cars.forEach(function (car) {
        container.innerHTML += createCarCard(car);
    });

    updateCarCount(cars.length);
}

function displayFeaturedCars() {
    let container = document.getElementById("featuredCars");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    cars.slice(0, 6).forEach(function (car) {
        container.innerHTML += createCarCard(car);
    });
}

function createCarCard(car) {
    return (
        '<div class="car-card" data-id="' + car.id + '">' +

            '<div class="car-image-wrapper">' +
                '<img src="' + car.image + '" alt="' + car.name + '" class="car-image">' +
            '</div>' +

            '<div class="car-card-content">' +

                '<span class="car-category">' +
                    car.category +
                '</span>' +

                '<h3>' +
                    car.name +
                '</h3>' +

                '<p class="car-model">' +
                    car.model +
                '</p>' +

                '<div class="car-details">' +
                    '<span>' + car.year + '</span>' +
                    '<span>' + car.engine + '</span>' +
                    '<span>' + car.transmission + '</span>' +
                '</div>' +

                '<div class="car-card-bottom">' +
                    '<strong>' +
                        formatPrice(car.price) +
                    '</strong>' +

                    '<button class="details-btn" onclick="viewCar(' + car.id + ')">' +
                        'View Details' +
                    '</button>' +
                '</div>' +

            '</div>' +

        '</div>'
    );
}

function formatPrice(price) {
    return "PKR " + Number(price).toLocaleString("en-PK");
}

function viewCar(id) {
    window.location.href = "car-details.html?id=" + id;
}

function displayProductDetails() {
    let container = document.getElementById("carDetails");

    if (!container) {
        return;
    }

    let urlParams = new URLSearchParams(window.location.search);
    let carId = Number(urlParams.get("id"));

    if (!carId) {
        container.innerHTML =
            '<div class="error-message">' +
            '<h2>Car Not Found</h2>' +
            '<p>No car was selected.</p>' +
            '<a href="cars.html">Back to Cars</a>' +
            '</div>';

        return;
    }

    let car = cars.find(function (item) {
        return item.id === carId;
    });

    if (!car) {
        container.innerHTML =
            '<div class="error-message">' +
            '<h2>Car Not Found</h2>' +
            '<p>The selected car does not exist.</p>' +
            '<a href="cars.html">Back to Cars</a>' +
            '</div>';

        return;
    }

    container.innerHTML =
        '<div class="product-image-section">' +

            '<img src="' + car.image + '" alt="' + car.name + '">' +

        '</div>' +

        '<div class="product-info-section">' +

            '<span class="car-category">' +
                car.category +
            '</span>' +

            '<h1>' +
                car.name +
            '</h1>' +

            '<h3>' +
                car.model +
            '</h3>' +

            '<div class="product-price">' +
                formatPrice(car.price) +
            '</div>' +

            '<p class="product-description">' +
                car.description +
            '</p>' +

            '<div class="specifications">' +

                '<div class="specification">' +
                    '<strong>Brand</strong>' +
                    '<span>' + car.brand + '</span>' +
                '</div>' +

                '<div class="specification">' +
                    '<strong>Year</strong>' +
                    '<span>' + car.year + '</span>' +
                '</div>' +

                '<div class="specification">' +
                    '<strong>Engine</strong>' +
                    '<span>' + car.engine + '</span>' +
                '</div>' +

                '<div class="specification">' +
                    '<strong>Fuel</strong>' +
                    '<span>' + car.fuelType + '</span>' +
                '</div>' +

                '<div class="specification">' +
                    '<strong>Transmission</strong>' +
                    '<span>' + car.transmission + '</span>' +
                '</div>' +

                '<div class="specification">' +
                    '<strong>Mileage</strong>' +
                    '<span>' + car.mileage + '</span>' +
                '</div>' +

                '<div class="specification">' +
                    '<strong>Seats</strong>' +
                    '<span>' + car.seatingCapacity + '</span>' +
                '</div>' +

                '<div class="specification">' +
                    '<strong>Color</strong>' +
                    '<span>' + car.color + '</span>' +
                '</div>' +

                '<div class="specification">' +
                    '<strong>Condition</strong>' +
                    '<span>' + car.condition + '</span>' +
                '</div>' +

                '<div class="specification">' +
                    '<strong>Location</strong>' +
                    '<span>' + car.location + '</span>' +
                '</div>' +

            '</div>' +

            '<div class="product-actions">' +

                '<button class="add-cart-btn" onclick="addToCart(' + car.id + ')">' +
                    'Add to Cart' +
                '</button>' +

                '<button class="contact-btn" onclick="contactAboutCar(\'' +
                    escapeQuotes(car.name) +
                '\')">' +
                    'Contact Seller' +
                '</button>' +

            '</div>' +

        '</div>';
}

function escapeQuotes(text) {
    return text.replace(/'/g, "\\'");
}

function addToCart(id) {
    let car = cars.find(function (item) {
        return item.id === id;
    });

    if (!car) {
        return;
    }

    let existingCar = cart.find(function (item) {
        return item.id === id;
    });

    if (existingCar) {
        existingCar.quantity += 1;
    } else {
        cart.push({
            id: car.id,
            name: car.name,
            model: car.model,
            price: car.price,
            image: car.image,
            quantity: 1
        });
    }

    saveCart();
    updateCartCount();

    alert(car.name + " added to cart.");
}

function removeFromCart(id) {
    cart = cart.filter(function (item) {
        return item.id !== id;
    });

    saveCart();
    displayCart();
    updateCartCount();
}

function increaseQuantity(id) {
    let item = cart.find(function (car) {
        return car.id === id;
    });

    if (!item) {
        return;
    }

    item.quantity += 1;

    saveCart();
    displayCart();
}

function decreaseQuantity(id) {
    let item = cart.find(function (car) {
        return car.id === id;
    });

    if (!item) {
        return;
    }

    if (item.quantity > 1) {
        item.quantity -= 1;
    } else {
        cart = cart.filter(function (car) {
            return car.id !== id;
        });
    }

    saveCart();
    displayCart();
    updateCartCount();
}

function saveCart() {
    localStorage.setItem("carCart", JSON.stringify(cart));
}

function updateCartCount() {
    let cartCountElements = document.querySelectorAll(".cart-count");

    let totalItems = cart.reduce(function (total, item) {
        return total + item.quantity;
    }, 0);

    cartCountElements.forEach(function (element) {
        element.textContent = totalItems;
    });
}

function displayCart() {
    let container = document.getElementById("cartContainer");

    if (!container) {
        return;
    }

    let summary = document.getElementById("cartSummary");

    if (cart.length === 0) {
        container.innerHTML =
            '<div class="empty-cart">' +
                '<h2>Your Cart is Empty</h2>' +
                '<p>You have not added any cars yet.</p>' +
                '<a href="cars.html">Browse Cars</a>' +
            '</div>';

        if (summary) {
            summary.innerHTML = "";
        }

        return;
    }

    container.innerHTML = "";

    cart.forEach(function (item) {
        container.innerHTML +=
            '<div class="cart-item">' +

                '<img src="' + item.image + '" alt="' + item.name + '">' +

                '<div class="cart-item-info">' +

                    '<h3>' +
                        item.name +
                    '</h3>' +

                    '<p>' +
                        item.model +
                    '</p>' +

                    '<strong>' +
                        formatPrice(item.price) +
                    '</strong>' +

                '</div>' +

                '<div class="quantity-controls">' +

                    '<button onclick="decreaseQuantity(' + item.id + ')">' +
                        '-' +
                    '</button>' +

                    '<span>' +
                        item.quantity +
                    '</span>' +

                    '<button onclick="increaseQuantity(' + item.id + ')">' +
                        '+' +
                    '</button>' +

                '</div>' +

                '<div class="cart-item-total">' +
                    formatPrice(item.price * item.quantity) +
                '</div>' +

                '<button class="remove-cart-btn" onclick="removeFromCart(' + item.id + ')">' +
                    'Remove' +
                '</button>' +

            '</div>';
    });

    let total = cart.reduce(function (sum, item) {
        return sum + item.price * item.quantity;
    }, 0);

    if (summary) {
        summary.innerHTML =
            '<div class="summary-row">' +
                '<span>Items</span>' +
                '<strong>' +
                    cart.reduce(function (sum, item) {
                        return sum + item.quantity;
                    }, 0) +
                '</strong>' +
            '</div>' +

            '<div class="summary-row">' +
                '<span>Total</span>' +
                '<strong>' +
                    formatPrice(total) +
                '</strong>' +
            '</div>' +

            '<button class="checkout-btn" onclick="checkout()">' +
                'Proceed to Checkout' +
            '</button>';
    }
}

function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty.");
        return;
    }

    alert(
        "Checkout is ready for demonstration. " +
        "No real payment will be processed."
    );
}

function setupSearch() {
    let searchInput = document.getElementById("searchInput");

    if (!searchInput) {
        return;
    }

    searchInput.addEventListener("input", function () {
        let searchValue = searchInput.value.toLowerCase().trim();

        let filteredCars = cars.filter(function (car) {
            return (
                car.name.toLowerCase().includes(searchValue) ||
                car.brand.toLowerCase().includes(searchValue) ||
                car.model.toLowerCase().includes(searchValue) ||
                car.category.toLowerCase().includes(searchValue) ||
                car.location.toLowerCase().includes(searchValue)
            );
        });

        displayFilteredCars(filteredCars);
    });
}

function displayFilteredCars(filteredCars) {
    let container = document.getElementById("carsContainer");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    if (filteredCars.length === 0) {
        container.innerHTML =
            '<div class="no-results">' +
                '<h2>No Cars Found</h2>' +
                '<p>Try searching for another car or category.</p>' +
            '</div>';

        updateCarCount(0);
        return;
    }

    filteredCars.forEach(function (car) {
        container.innerHTML += createCarCard(car);
    });

    updateCarCount(filteredCars.length);
}

function setupFilters() {
    let categoryFilter = document.getElementById("categoryFilter");
    let brandFilter = document.getElementById("brandFilter");
    let sortFilter = document.getElementById("sortFilter");

    if (categoryFilter) {
        categoryFilter.addEventListener("change", applyFilters);
    }

    if (brandFilter) {
        brandFilter.addEventListener("change", applyFilters);
    }

    if (sortFilter) {
        sortFilter.addEventListener("change", applyFilters);
    }
}

function applyFilters() {
    let categoryFilter = document.getElementById("categoryFilter");
    let brandFilter = document.getElementById("brandFilter");
    let sortFilter = document.getElementById("sortFilter");

    let category = categoryFilter ? categoryFilter.value : "all";
    let brand = brandFilter ? brandFilter.value : "all";
    let sort = sortFilter ? sortFilter.value : "default";

    let filteredCars = cars.filter(function (car) {
        let categoryMatch =
            category === "all" ||
            car.category.toLowerCase() === category.toLowerCase();

        let brandMatch =
            brand === "all" ||
            car.brand.toLowerCase() === brand.toLowerCase();

        return categoryMatch && brandMatch;
    });

    if (sort === "low-high") {
        filteredCars.sort(function (a, b) {
            return a.price - b.price;
        });
    }

    if (sort === "high-low") {
        filteredCars.sort(function (a, b) {
            return b.price - a.price;
        });
    }

    if (sort === "newest") {
        filteredCars.sort(function (a, b) {
            return b.year - a.year;
        });
    }

    displayFilteredCars(filteredCars);
}

function displayCategories() {
    let categoryFilter = document.getElementById("categoryFilter");
    let brandFilter = document.getElementById("brandFilter");

    if (categoryFilter) {
        let categories = [];

        cars.forEach(function (car) {
            if (!categories.includes(car.category)) {
                categories.push(car.category);
            }
        });

        categories.sort();

        categoryFilter.innerHTML =
            '<option value="all">All Categories</option>';

        categories.forEach(function (category) {
            categoryFilter.innerHTML +=
                '<option value="' + category + '">' +
                    category +
                '</option>';
        });
    }

    if (brandFilter) {
        let brands = [];

        cars.forEach(function (car) {
            if (!brands.includes(car.brand)) {
                brands.push(car.brand);
            }
        });

        brands.sort();

        brandFilter.innerHTML =
            '<option value="all">All Brands</option>';

        brands.forEach(function (brand) {
            brandFilter.innerHTML +=
                '<option value="' + brand + '">' +
                    brand +
                '</option>';
        });
    }
}

function updateCarCount(count) {
    let elements = document.querySelectorAll(".car-count");

    elements.forEach(function (element) {
        element.textContent = count + " Cars";
    });
}

function setupNavigation() {
    let currentPage = window.location.pathname.split("/").pop();

    if (currentPage === "") {
        currentPage = "index.html";
    }

    let navLinks = document.querySelectorAll(".nav-link");

    navLinks.forEach(function (link) {
        let linkPage = link.getAttribute("href");

        if (linkPage === currentPage) {
            link.classList.add("active");
        }
    });
}

function setupMobileMenu() {
    let menuButton = document.getElementById("menuButton");
    let mobileMenu = document.getElementById("mobileMenu");

    if (!menuButton || !mobileMenu) {
        return;
    }

    menuButton.addEventListener("click", function () {
        mobileMenu.classList.toggle("show");
    });
}

function contactAboutCar(carName) {
    window.location.href =
        "contact.html?car=" + encodeURIComponent(carName);
}

function setupContactForm() {
    let form = document.getElementById("contactForm");

    if (!form) {
        return;
    }

    let urlParams = new URLSearchParams(window.location.search);
    let carName = urlParams.get("car");

    let subjectInput = document.getElementById("subject");

    if (carName && subjectInput) {
        subjectInput.value = "Inquiry about " + carName;
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        let name = document.getElementById("name");
        let email = document.getElementById("email");
        let subject = document.getElementById("subject");
        let message = document.getElementById("message");

        if (
            !name ||
            !email ||
            !subject ||
            !message
        ) {
            return;
        }

        if (
            name.value.trim() === "" ||
            email.value.trim() === "" ||
            subject.value.trim() === "" ||
            message.value.trim() === ""
        ) {
            alert("Please fill in all fields.");
            return;
        }

        alert(
            "Thank you, " +
            name.value +
            "! Your message has been submitted."
        );

        form.reset();
    });
}


