class Product {
    constructor() {
        this.products = []
    }

    async fetchProducts() {
        try {
            const response = await fetch('https://arjuns-developer.github.io/e-cart-json/db.json')
            const data = await response.json()
            this.products = data.products
            this.displayData(this.products)
        } catch (error) {
            console.log(error, 'error');
        }

    }

    displayData(products) {
        let tab = '';
        products.forEach(({ title, price, image }) => {

            tab += ` <div class="product-tile">
                        <img class="product-image" src=${image} />
                        <span class="product-title">${title}</span>
                        <span class="price">₹ ${price}</span>
                    </div>`;

            document.getElementById('products-container-id').innerHTML = tab;
        })
    }

    filterData(e) {

        const filter = document.getElementById("category-filter").value
        if(filter){
            const filteredList = this.products.filter(({ category }) => category === filter)
            return this.displayData(filteredList)
        }
        this.displayData(this.products)
    }

    handlePriceRange(){
        const startPrice=parseInt(document.getElementById('start-price').value)
        const endPrice=parseInt(document.getElementById('end-price').value)
    
        const max=100000
        if(startPrice>=endPrice){
            const computedValues=startPrice*10>max?'max':startPrice*10
            document.getElementById('end-price').value=computedValues.toString()
        }
        
        // const filteredPrices=this.products.filter(({ price }) => price>=startPrice && price<=endPrice)
        // console.log("🚀 ~ file: product.js:54 ~ Product ~ handlePriceRange ~ filteredPrices", filteredPrices)
    
    }

}

const productObj = new Product()
productObj.fetchProducts()
