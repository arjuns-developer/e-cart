import fetchProducts from "../../utilis/fetchProducts.js";
import Products from "../../product-listing/js/product.js";

class Product extends Products {
    constructor(products) {
        super(products)
        this.handleProductDetail()
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
        if(data){
            const {image}=data
            const productImageElement = document.getElementById('product-image')
            if (productImageElement) {
                productImageElement.innerHTML = `<img src=${image}>`;
            }

        }
        
    }

    handleProductDetail(){
        const data=this.getProductData()
        this.displayProduct(data)
    }

}

const products = await fetchProducts()

const prodctObj = new Product(products)
