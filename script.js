function startCounters() {
  const counters = document.querySelectorAll(".counter-numbers");

  const options = {
    threshold: 0.6,
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const endValue = parseInt(target.getAttribute("data-number"));
        const startValue = 0;
        let currentValue = startValue;

        const counter = setInterval(() => {
          target.textContent = currentValue;
          currentValue += Math.ceil((endValue - startValue) / 55);

          if (currentValue > endValue) {
            target.textContent = endValue;
            clearInterval(counter);
          }
        }, 55);

        observer.unobserve(target);
      }
    });
  }, options);

  counters.forEach((counter) => {
    observer.observe(counter);
  });
}

// Start the counters when the document is fully loaded
document.addEventListener("DOMContentLoaded", startCounters);

// cart

const cart = document.querySelector(".cart");
const carttab = document.querySelector(".carttab");
const close = document.querySelector(".close");
let listproductHTML = document.querySelector(".listproduct");
let listcartHTML = document.querySelector(".listcart");
let iconcartspan = document.querySelector(".cart span");
let listproduct = [];
let carts = [];

cart.addEventListener("click", () => {
  if (carttab.style.display === "none") {
    carttab.style.display = "grid";
  } else {
    carttab.style.display = "none";
  }
});

close.addEventListener("click", () => {
  carttab.style.display = "none";
});

const addDataToHTML = () => {
  listproductHTML.innerHTML = "";
  if (listproduct.length > 0) {
    listproduct.forEach((product) => {
      let newproduct = document.createElement("div");
      newproduct.classList.add("tabitem");
      newproduct.dataset.id = product.id;
      newproduct.innerHTML = `
        <img src="${product.image}" alt="${product.name}" />
        <h2 class="hjson">${product.name}</h2>
        <div class="button">
          <a href="#">₹${product.price}</a>
          <a class="cart-btn" href="#">
            <i class="fa-solid fa-bag-shopping"></i>ADD TO CART
          </a>
        </div>`;
      listproductHTML.appendChild(newproduct);
    });
  }
};

listproductHTML.addEventListener("click", (e) => {
  let postionclick = e.target;
  if (postionclick.classList.contains("cart-btn")) {
    let product_id = postionclick.closest(".tabitem").dataset.id;
    addToCart(product_id);
  }
});

listcartHTML.addEventListener("click", (e) => {
  let target = e.target;

  if (target.classList.contains("minus")) {
    handleQuantityChange(target, -1);
  } else if (target.classList.contains("plus")) {
    handleQuantityChange(target, 1);
  }
});

const handleQuantityChange = (target, change) => {
  let cartItem = target.closest(".tabitem");
  let productId = cartItem.dataset.id;

  let productIndex = carts.findIndex((cart) => cart.product_id == productId);

  if (productIndex !== -1) {
    carts[productIndex].quantity += change;

    if (carts[productIndex].quantity <= 0) {
      // Remove item from the cart if quantity becomes zero or negative
      carts.splice(productIndex, 1);
    }

    addCarttohtml();
    addcarttomemory();
  }
};

const addToCart = (product_id) => {
  let postionproductcart = carts.findIndex(
    (value) => value.product_id == product_id
  );
  if (carts.length <= 0) {
    carts = [
      {
        product_id: product_id,
        quantity: 1,
      },
    ];
  } else if (postionproductcart < 0) {
    carts.push({
      product_id: product_id,
      quantity: 1,
    });
  } else {
    carts[postionproductcart].quantity += 1;
  }
  addCarttohtml();
  addcarttomemory();
};

const addcarttomemory = () => {
  localStorage.setItem("cart", JSON.stringify(carts));
};

const addCarttohtml = () => {
  listcartHTML.innerHTML = "";
  let totalquantity = 0;
  if (carts.length > 0) {
    carts.forEach((cart) => {
      totalquantity = totalquantity + cart.quantity;
      let product = listproduct.find((p) => p.id == cart.product_id);

      if (product) {
        let newCart = document.createElement("div");
        newCart.classList.add("tabitem");
        let postionproduct = listproduct.findIndex(
          (value) => value.id == cart.product_id
        );
        let info = listproduct[postionproduct];
        newCart.innerHTML = `
          <div class="tabitemimg">
            <img src="${info.image}" alt="" />
          </div>
          <div class="name">${info.name}</div>
          <div class="totalprice">$${info.price * cart.quantity}</div>
          <div class="quantity">
            <span class="minus">-</span>
            <span>${cart.quantity}</span>
            <span class="plus">+</span>
          </div>
        `;
        listcartHTML.appendChild(newCart);
      }
    });
  }
  iconcartspan.innerHTML = totalquantity;
};

addCarttohtml();
addcarttomemory();

const initapp = () => {
  fetch("product.json")
    .then((response) => response.json())
    .then((data) => {
      listproduct = data;
      addDataToHTML();
      // get cart from localstorage
      if (localStorage.getItem("cart")) {
        carts = JSON.parse(localStorage.getItem("cart"));
        addCarttohtml();
      }
    });
};

// Initialize the application
initapp();

const btn = document.getElementById("button");

document.getElementById("form").addEventListener("submit", function (event) {
  event.preventDefault();

  btn.value = "Sending...";

  const serviceID = "service_e98mmum";
  const templateID = "template_e7v792c";

  emailjs.sendForm(serviceID, templateID, this).then(
    () => {
      btn.value = "Send Email";
      alert("Sent Successfully");
    },
    (err) => {
      btn.value = "Send Email";
      alert(JSON.stringify(err));
    }
  );
});
