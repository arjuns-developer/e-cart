import fetchProducts from "../../utilis/fetchProducts.js";

/**
 * Class representing products.
 */
export default class Products {
    /**
     * Creates list of products
     * @param {Object[]} The list of products
     */
    constructor(products) {

        const query = this.getParams('search')

        if (query) {
            document.getElementById('search').value = query
            const result = products.filter(({ title }) => title.toLowerCase().includes(query))
            this.products = result

        } else {
            this.products = products
        }
        this.displayData(this.products)


        document.getElementById('category-filter')?.addEventListener('change', this.handleFilter.bind(this));
        document.getElementById('search')?.addEventListener('change', this.handleSearch.bind(this));
        document.getElementById('quantity-id')?.addEventListener('keyup', this.handleQuantityInput.bind(this));

        document.getElementById('cart')?.addEventListener('mouseover', this.handleHower.bind(this))

        document.getElementById('dropdown-content')?.addEventListener('mouseover', this.handleHower.bind(this))


        const inputElements = document.querySelectorAll(".range-selector");

        inputElements.forEach((element) => {
            element.addEventListener("change", (e) => {
                let minPrice = parseInt(inputElements[0].value);
                let maxPrice = parseInt(inputElements[1].value);

                this.validateRange(minPrice, maxPrice);
            });
        });

        this.displayCartData()
    }

    /**
     * Function that returns the URL parameters
     * @param {String} string - key of the parameters
     * @returns {String} returns the URL parameters
     */
    getParams(string) {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        return urlParams.get(string)

    }

    /**
     * Function that sets the min and max value in DOM and then triggers the  price filter function
     * @param {*} minPrice - minimum price selected
     * @param {*} maxPrice - maximum price selected
     */
    validateRange(minPrice, maxPrice) {

        let minValue = document.getElementById("min-value");
        let maxValue = document.getElementById("max-value");

        if (minPrice > maxPrice) {

            // Swap to Values
            let tempValue = maxPrice;
            maxPrice = minPrice;
            minPrice = tempValue;
        }

        minValue.innerHTML = minPrice;
        maxValue.innerHTML = maxPrice;

        this.handleFilter()
    }

    /**
     * @property {Function} Displays products on the DOM
     * @returns {void}
   */
    displayData(products) {
        let tab = '';
        if (!products?.length) {
            tab = '<div class="no-results">No Results found!</div>'

            const element = document.getElementById('products-container-id')
            if (element) {

                element.innerHTML = tab;
            }

            return
        }
        products.forEach(({ id, title, price, image }) => {

            tab += `<a class href=product-detail/product-detail.html?id=${id}>
                        <div class="product-tile"> 
                            <img class="product-image" src=${image} />
                            <span class="product-title">${title}</span>
                            <span class="price">₹ ${price}</span>
                        </div>
                    </a>`;

            const element = document.getElementById('products-container-id')
            if (element) {

                element.innerHTML = tab;
            }


        })
    }

    /**
     * @property {Function} Filters products based on category seleted
     * @returns {void} Returns array of products
    */
    categoryFilter(products) {
        const filter = document.getElementById("category-filter").value
        if (filter) {
            const filteredList = this.products.filter(({ category }) => category === filter)
            return filteredList
        }

        return products
    }

    /**
     * @property {Function} Filters products based on price range 
     * @returns {void} Returns array of products
    */
    handlePriceRange(products) {

        let startPrice = parseInt(document.getElementById("start-price")?.value)
        let endPrice = parseInt(document.getElementById("end-price")?.value)


        if (startPrice > endPrice) {

            // Swap to Values
            let tempValue = endPrice;
            endPrice = startPrice;
            startPrice = tempValue;
        }

        const filteredList = products.filter(({ price }) => price >= startPrice && price <= endPrice)
        return filteredList

    }

    /**
     * @property {Function} wrapper function for category filter and price range
     * @returns {void} 
    */
    handleFilter() {
        const filteredCategory = this.categoryFilter(this.products)
        const finalData = this.handlePriceRange(filteredCategory)
        this.displayData(finalData)
    }


    /**
    * @property {Function} Searches the product and displays the data on DOM
    * @returns {void} 
    */
    handleSearch(e) {
        const search = e.target.value.toLowerCase()
        window.location.href = `/?search=${search}`
    }
    
/**
 * Function that returns the product based on id passes
 * @param {number} id of product
 * @returns {object} product object
 */
    getProduct(productId) {
        const result = this.products.find(({ id }) => id === productId)
        return result
    }

/**
 * Function that displays the cart information
 */
    displayCartData() {
        const dropdownContent = document.getElementById('dropdown-content')
        let tab = ''

        const cartItems = localStorage.getItem('cartItems')
        const cart = JSON.parse(cartItems)

        const cartCount = document.getElementById('cart-count')
        cartCount.innerHTML = cart?.length || ''

        if (cartItems) {


            cart.forEach(({ title, price, quantity, id }) => {
                tab += `<div class="cart-tile"> 
                            <span class="cart-title">${title}</span>
                            <span class="cart-quantity"> x ${quantity} = </span>
                            <span class="cart-price">₹ ${price * quantity} /-</span>
                            <span id="delete" data-id=${id} class="material-symbols-outlined delete">delete</span>
                        </div>`;

                if (dropdownContent) {
                    dropdownContent.innerHTML = tab;
                }
            })

            const totalPrice = cart.reduce((acc, cur) => {
                acc = acc + cur.price * cur.quantity
                return acc
            }, 0)


            const div = dropdownContent.appendChild(document.createElement('div'))
            div.classList.add("cart-total");
            div.innerHTML = `<hr/>Total Amount - <span class="cart-price">₹${totalPrice}/-</span>`


        }
        else {

            dropdownContent.innerHTML = `<span class="no-products">No Products Added</span>`
        }

    }

    /**
     * Function that checks the prevents user from entering a value greater than the max value
     */
    handleQuantityInput() {
        const value = document.getElementById('quantity-id').value
        let parsedValue = parseInt(value)
        const max = 20
        if (!value || parsedValue < 1) {
            parsedValue = 1
        }
        if (parsedValue > max) {
            parsedValue = max
        }

        document.getElementById('quantity-id').value = parsedValue
    }

    /**
     * Delete Items from cart and trigers new data to to be displayed in cart
     * @param {*} element - HTML element
     */
    deleteCartItem(element) {
        const dataId = element?.getAttribute('data-id')
        if (dataId) {

            const parsedId = parseInt(dataId)

            const cartItems = localStorage.getItem('cartItems')
            const cartArray = JSON.parse(cartItems) || []
            const filteredData = cartArray.filter(({ id }) => parsedId != id)

            if (filteredData.length === 0) {
                localStorage.removeItem('cartItems')
            }
            else {
                localStorage.setItem('cartItems', JSON.stringify(filteredData))
            }
            this.displayCartData()
        }
    }

    /**
     * Adds an delete cart function to the cart element
     */
    handleHower() {
        document.querySelectorAll('.delete').forEach(item => {
            item.addEventListener('click', this.deleteCartItem.bind(this, item))
        })
    }

}

const products = await fetchProducts()
const productObj = new Products(products)
