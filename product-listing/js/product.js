import fetchProducts from "../../utilis/fetchProducts.js";

export default class Products {
    constructor(products) {
        this.products = products
        this.displayData(this.products)


        document.getElementById('category-filter')?.addEventListener('change', this.handleFilter.bind(this));
        document.getElementById('start-price')?.addEventListener('change', this.handleFilter.bind(this));
        document.getElementById('end-price')?.addEventListener('change', this.handleFilter.bind(this));
        document.getElementById('search')?.addEventListener('change', this.handleSearch.bind(this));

        this.displayCartData()
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
        const startPrice = parseInt(document.getElementById('start-price').value)
        let endPrice = parseInt(document.getElementById('end-price').value)

        if (startPrice >= endPrice) {
            endPrice = startPrice * 10
            document.getElementById('end-price').value = endPrice.toString()
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
        const result = this.products.filter(({ title }) => title.toLowerCase().includes(search))
        this.displayData(result)
    }


    getProduct(productId) {
        const result = this.products.find(({ id }) => id === productId)
        return result
    }


    displayCartData() {
        const dropdownContent = document.getElementById('dropdown-content')

        let tab=''

        const cartItems = localStorage.getItem('cartItems')

        if (cartItems) {
            
            const cart = JSON.parse(cartItems)

            cart.forEach(({ title, price,quantity }) => {
                tab += `<div class="cart-tile"> 
                            <span class="cart-title">${title}</span>
                            <span class="cart-quantity"> x ${quantity} = </span>
                            <span class="cart-price">₹ ${price*quantity} /-</span>
                        </div>`;

                if (dropdownContent) {
                    dropdownContent.innerHTML = tab;
                }
            })

            const totalPrice=cart.reduce((acc,cur)=>{
                acc=acc+cur.price*cur.quantity
                return acc
            },0)

            const div=dropdownContent.appendChild(document.createElement('div'))
            div.classList.add("cart-total");
            div.innerHTML=`<hr/>Total Amount - <span class="cart-price">₹${totalPrice}/-</span>`
            const cartCount=document.getElementById('cart-count')
            cartCount.innerHTML=cart.length
        }
    }

}

const products = await fetchProducts()
const productObj = new Products(products)
