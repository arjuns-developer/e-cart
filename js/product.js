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
        if(!products?.length){
            tab='<div class="no-results">No Results found!</div>'
            document.getElementById('products-container-id').innerHTML = tab;
            return
        }
        products.forEach(({ title, price, image }) => {

            tab += ` <div class="product-tile">
                        <img class="product-image" src=${image} />
                        <span class="product-title">${title}</span>
                        <span class="price">₹ ${price}</span>
                    </div>`;

            document.getElementById('products-container-id').innerHTML = tab;
        })
    }

    categoryFilter(products) {

        const filter = document.getElementById("category-filter").value
        if(filter){
            const filteredList = this.products.filter(({ category }) => category === filter)
            return filteredList
        }

        return products
    }

    handlePriceRange(products){
        const startPrice=parseInt(document.getElementById('start-price').value)
        let endPrice=parseInt(document.getElementById('end-price').value)
    
        if(startPrice>=endPrice){
            endPrice=startPrice*10
            document.getElementById('end-price').value=endPrice.toString()
        }
        
        const filteredList = products.filter(({ price }) => price>=startPrice && price<=endPrice)
        return filteredList

    }

    handleFilter(){
        const filteredCategory=this.categoryFilter(this.products)
        const finalData=this.handlePriceRange(filteredCategory)
        this.displayData(finalData)
    }

    handleSearch(e){
        // setTimeout(() => {
        //     console.log(e.target.value,'event');
        // }, 2000);
        const search=e.target.value.toLowerCase()
        const result=this.products.filter(({title})=>title.toLowerCase().includes(search))
        this.displayData(result)
    }

}

const productObj = new Product()
productObj.fetchProducts()
