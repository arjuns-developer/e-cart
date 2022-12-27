function handlePriceRange(){
    const startPrice=parseInt(document.getElementById('start-price').value)

    const endPrice=parseInt(document.getElementById('end-price').value)

    const max=100000
    if(startPrice>=endPrice){
        const computedValues=startPrice*10>max?'max':startPrice*10
        console.log("🚀 ~ file: product-listing.js:11 ~ handlePriceRange ~ computedValues", computedValues)
        document.getElementById('end-price').value=computedValues.toString()
    }

}


