import fetchProducts from "../../utilis/fetchProducts.js";
import Products from "../../product-listing/js/product.js";

export default class Cart extends Products {
    constructor(products) {
        super(products)
        this.handleProductDetail()

        document.getElementById('minus-button')?.addEventListener('click', this.handleQuantity.bind(this, 'minus-button'));
        document.getElementById('plus-button')?.addEventListener('click', this.handleQuantity.bind(this, 'plus-button'));
        document.getElementById('add-to-cart')?.addEventListener('click', this.handleAddtoCart.bind(this));

        document.querySelector('.logo')?.addEventListener('click', this.redirect.bind(this));
        
    }

    redirect(){
        window.location.href = "../index.html";
    }

    getProductData() {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const id = urlParams.get('id')
        if (id) {
            const productDetail = this.getProduct(parseInt(id))
            return productDetail

        }
        return null
    }

    displayProduct(data) {
        if (data) {
            const { image, title, price, units, description, id } = data
            const productImageElement = document.getElementById('product-image')
            if (productImageElement) {
                productImageElement.innerHTML = `<img src=${image}>`;
            }

            const productDetailElement = document.getElementById('product-detail-info')

            let stock = `<div class="stock">In Stock</div>`
            const quantityInCart = this.getCartProductsById(id)?.quantity || 0
            if (units - quantityInCart < 1) {
                stock = `<div class="no-stock">Not Available</div>`
            }

            if (productDetailElement) {
                productDetailElement.innerHTML =
                    `
                <div class="title">${title}</div>
                <div class="price">₹${price}</div>
                ${stock}
                <div class="description">
                    <span>Features And Details</span>
                    <div class="description-content" id="description-content">
                   
                    </div>
                </div>
                `
            }
            const descriptionContentElement = document.getElementById('description-content')

            description.forEach((item) => {
                let li = document.createElement("li");
                li.innerText = item;
                descriptionContentElement.appendChild(li);
            })
        }

    }

    handleProductDetail() {
        const data = this.getProductData()
        this.displayProduct(data)
    }

    handleQuantity(arg) {
        const idElement = document?.getElementById('quantity-id')

        const quantity = parseInt(idElement?.value)

        if (quantity) {
            if (arg === 'minus-button' && quantity > 1) {
                idElement.value = quantity - 1
            }
            if (arg === 'plus-button') {
                idElement.value = quantity + 1
            }
        }

    }

    handleAddtoCart() {
        const idElement = document?.getElementById('quantity-id')
        const quantityAdded = parseInt(idElement?.value)
        const data = this.getProductData()
        const isAvailable = this.checkAvailability(quantityAdded, data)
        if (isAvailable) {
            this.addToCart(data, quantityAdded)
            this.displayCartData()
        }
    }

    checkAvailability(quantityAdded, data) {
        if (quantityAdded > data.units) {
            this.showValidationMsg(data.units)
            return false
        }
        const { availableUnits, isAvailable } = this.getCartAvailableData(data, quantityAdded)
        if (!isAvailable) {
            this.showValidationMsg(availableUnits)
            return false
        }
        return true
    }

    getCartProductsById(Pid) {
        const cartItems = this.getCartData()
        return cartItems?.find(({ id }) => Pid === id)
    }

    getCartAvailableData(data, quantityAdded) {
        let availableUnits = 0
        const itemLength = this.getCartProductsById(data.id)?.quantity || 0

        if (data.units >= (itemLength + quantityAdded)) {
            availableUnits = Math.abs(data.units - itemLength)
            return { availableUnits, isAvailable: true }
        }
        // cart case
        else {
            availableUnits = Math.abs(data.units - itemLength)
            return { availableUnits, isAvailable: false }
        }
    }


    getCartData() {
        const cartItems = localStorage.getItem('cartItems')
        const cartArray = JSON.parse(cartItems) || []
        return cartArray
    }

    showValidationMsg(units) {
        if (units) {
            alert(`only ${units} units available`)
        }
        else {
            alert(`No units available`)
        }
    }

    addToCart(data, quantity) {
        const cartArray = this.getCartData()
        if (!this.getCartProductsById(data.id)) {
            cartArray.push({ ...data, 'quantity': quantity })
            localStorage.setItem('cartItems', JSON.stringify(cartArray))
            return
        }
        const out = cartArray.map(item => item.id === data.id ? { ...item, quantity: item.quantity + quantity } : item)

        localStorage.setItem('cartItems', JSON.stringify(out))
    }

}

const products = await fetchProducts()

const cartObj = new Cart(products)
