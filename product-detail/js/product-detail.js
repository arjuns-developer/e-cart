import fetchProducts from "../../utilis/fetchProducts.js";
import Products from "../../product-listing/js/product.js";

/**
 * Class representing a cart.
 */
export default class Cart extends Products {
    /**
     * Creates list of products
     * @param {*} products -list of products
     */
    constructor(products) {
        super(products)
        this.handleProductDetail()

        document.getElementById('minus-button')?.addEventListener('click', this.handleQuantity.bind(this, 'minus-button'));
        document.getElementById('plus-button')?.addEventListener('click', this.handleQuantity.bind(this, 'plus-button'));
        document.getElementById('add-to-cart')?.addEventListener('click', this.handleAddtoCart.bind(this));

        document.querySelector('.logo')?.addEventListener('click', this.redirect.bind(this));
        
    }
    /**
     * Redirects to the home page
     */
    redirect(){
        window.location.href = "../index.html";
    }

    /**
     * Function that returns the product detail based on the productId present in the parameter
     * @returns - Product detail if found else null
     */
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

    /**
     * Function that displays the Product details
     * @param {object} data - product object
     */
    displayProduct(data) {
        if (data) {
            const { image, title, price, units, description, id } = data
            const productImageElement = document.getElementById('product-image')
            if (productImageElement) {
                productImageElement.innerHTML = `<img src=${image}>`;
            }

            const productDetailElement = document.getElementById('product-detail-info')

            let stock = `<div id="availability" class="stock">In Stock</div>`
            const quantityInCart = this.getCartProductsById(id)?.quantity || 0
            if (units - quantityInCart < 1) {
                stock = `<div id="availability" class="no-stock">Out of Stock</div>`
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

    /**
     * Function that displays product information
     */
    handleProductDetail() {
        const data = this.getProductData()
        this.displayProduct(data)
    }

    /**
     * Function that displays the increment and decrement of the quantity 
     * @param {string} arg - string argument 
     */
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

    /**
     * Functions that adds product to cart
     */
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

    /**
     * Function that checks the product availability
     * @param {number} quantityAdded - quantity to be added
     * @param {object} data - product data
     * @returns whether it is available or not 
     */
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

    /**
     * Function that returns the Product in the cart based on id
     * @param {*} Pid - Product Id
     * @returns Product 
     */
    getCartProductsById(Pid) {
        const cartItems = this.getCartData()
        return cartItems?.find(({ id }) => Pid === id)
    }

    /**
     * Function that returns available units of a products after product is added in cart
     * @param {object} data - product object
     * @param {number} quantityAdded - quantity to be added
     * @returns object which represents availabilty and available units
     */
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

    /**
     * Function that returns cart items stored in local storage
     * @returns cart items
     */
    getCartData() {
        const cartItems = localStorage.getItem('cartItems')
        const cartArray = JSON.parse(cartItems) || []
        return cartArray
    }

    /**
     * Function that initiates message displaying based on the units available
     * @param {number} units - units available
     */
    showValidationMsg(units) {
        if (units) {
            this.showAlert(`Only ${units} Units Available`)
        }
        else {
            const element=document.querySelector('#availability')
            element.className='no-stock'
            element.innerHTML='Out of Stock'
            this.showAlert(`No Units Available`)
        }
    }

    /**
     * Saves the data to the localstorage 
     * @param {object} data - product to be added to cart
     * @param {number} quantity - quantity of product to be added
     */
    addToCart(data, quantity) {
        const cartArray = this.getCartData()
        if (!this.getCartProductsById(data.id)) {
            cartArray.push({ ...data, 'quantity': quantity })
            localStorage.setItem('cartItems', JSON.stringify(cartArray))
            this.showAlert(`Item added to cart`)
            return
        }
        const out = cartArray.map(item => item.id === data.id ? { ...item, quantity: item.quantity + quantity } : item)

        localStorage.setItem('cartItems', JSON.stringify(out))
        this.showAlert(`Item added to cart`)
    }

    /**
     * Function that displays a popup message 
     * @param {*} msg - message to be displayed
     */
    showAlert(msg){
        const alert=`
        <div class="alert">
        ${msg}
        <span class="closebtn" onclick="this.parentElement.style.display='none';">&times;</span>
        </div>`

        const element=document.querySelector('.popup')
        element.innerHTML=alert

        this.hideAlert()
    }

    /**
     * Hides the popup message after a time interval
     */
    hideAlert(){
        setTimeout(() => {
            document.querySelector('.alert').style.display='none'
        }, 1000);
    }

}

const products = await fetchProducts()

const cartObj = new Cart(products)
