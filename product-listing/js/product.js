import fetchProducts from "../../utilis/fetchProducts.js";

export default class Products {
    constructor(products) {
        this.products = products
        this.displayData(this.products)


        document.getElementById('category-filter')?.addEventListener('change', this.handleFilter.bind(this));
        document.getElementById('start-price')?.addEventListener('change', this.handleFilter.bind(this));
        document.getElementById('end-price')?.addEventListener('change', this.handleFilter.bind(this));
        document.getElementById('search')?.addEventListener('change', this.handleSearch.bind(this));


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
        console.log("🚀 ~ file: product.js:111 ~ Products ~ getProduct ~ result", result);
        return result
    }

}

const products = await fetchProducts()
const productObj = new Products(products)
