let productDetail = [];
let paginateSize = 5;
let paginateDefault = 1;
let paginateCurrent = 1;
let localStorageKey = "Product_Management_Database";

class Product {

    constructor(productId, productName, productImage, productQuantity, productPrice, productDate, productStatus) {

        this.productId = productId;
        this.productName = productName;
        this.productImage = productImage;
        this.productQuantity = productQuantity;
        this.productPrice = productPrice;
        this.productDate = productDate;
        this.productStatus = productStatus;
        this.productAmount = (productQuantity * productPrice);

    }

}

function getData(key) {

    return JSON.parse(localStorage.getItem(key));

}

function setData(key, value) {

    localStorage.setItem(key, JSON.stringify(value));

}

function currencyFormat(number) {

    return number.toLocaleString("en-US", {

        style: "currency",
        currency: "USD"

    });

}

function amountTotal() {

    return productDetail.reduce(function (total, amount) {

        return total + amount.productAmount;

    }, 0);

}

function ascendingId() {

    return [...productDetail].sort(function (product1, product2) {

        return product2.productId - product1.productId;

    })[0].productId + 1;

}

function productSearch() {

    productRender(productDetail.filter(function (product) {

        return product.productName.toLowerCase().indexOf(document.querySelector(".Product-Search").value.toLowerCase()) != -1;

    }), paginateDefault);

}

function validation(field) {

    return field != null && field.trim() != "";

}

function tableReset() {

    document.querySelector(".Product-Name").value = "";
    document.querySelector(".Product-Image").value = "";
    document.querySelector(".Product-Quantity").value = "";
    document.querySelector(".Product-Price").value = "";
    document.querySelector(".Product-Date").value = "";
    document.querySelector(".Product-Search").value = "";
    document.querySelector(".Product-Status").value = "Available";

}

function productInitial() {

    if (getData(localStorageKey) == null) {

        productDetail = [

            new Product(1, "iPad Air", "Cores/Images/Products/iPad_Air.jpg", 1, 10, "2022-05-08", "Available"),
            new Product(2, "iPhone 13", "Cores/Images/Products/iPhone_13.jpg", 1, 10, "2022-05-08", "Available"),
            new Product(3, "iPhone SE", "Cores/Images/Products/iPhone_SE.jpg", 1, 10, "2022-05-08", "Available"),
            new Product(4, "Google Pixel 4A", "Cores/Images/Products/Google_Pixel_4A.jpg", 1, 10, "2022-05-08", "Available"),
            new Product(5, "Samsung Galaxy S20", "Cores/Images/Products/Samsung_Galaxy_S20.jpg", 1, 10, "2022-05-08", "Available")

        ]

        setData(localStorageKey, productDetail);

    }

    else {

        productDetail = getData(localStorageKey);

    }

}

function productRender(productData, paginateTotal) {

    document.querySelector(".Product-Total").innerHTML = `Total Price: ${currencyFormat(amountTotal())}`;
    document.querySelector(".Product-Display").innerHTML = productData.slice((paginateTotal - 1) * paginateSize, (paginateTotal * paginateSize)).map(function (product) {

        return `

            <tr class="Product-Display_Id-${product.productId}">
        
                <td>${product.productId}</td>
                <td>${product.productName}</td>

                <td>

                    <img src="${product.productImage}">

                </td>

                <td>${product.productQuantity}</td>
                <td>${currencyFormat(product.productPrice)}</td>
                <td>${currencyFormat(product.productAmount)}</td>
                <td>${product.productDate}</td>
                <td>${product.productStatus}</td>
                
                <td class="Product-Display_Action-${product.productId}">

                    <button type="button" class="" onclick="productEdit(${product.productId})">Edit</button>
                    <button type="button" class="Product-Display_Action-Hidden" onclick="productUpdate(${product.productId})">Update</button>
                    <button type="button" class="Product-Display_Action-Hidden" onclick="productCancel(${product.productId})">Cancel</button>
                    <button type="button" class="" onclick="productDelete(${product.productId})">Remove</button>
                    
                </td>

            </tr>

        `;

    }).join("");

}

function productCreate() {

    let productId = ascendingId();
    let productName = document.querySelector(".Product-Name").value;
    let productImage = document.querySelector(".Product-Image").value;
    let productQuantity = Number(document.querySelector(".Product-Quantity").value);
    let productPrice = Number(document.querySelector(".Product-Price").value);
    let productDate = document.querySelector(".Product-Date").value;
    let productStatus = document.querySelector(".Product-Status").value;

    if (!validation(productName)) {

        alert("Please set product name to create new product!")
        return;

    }

    let newProduct = new Product(productId, productName, productImage, productQuantity, productPrice, productDate, productStatus);

    productDetail.push(newProduct);

    tableReset();
    setData(localStorageKey, productDetail);
    productRender(productDetail, paginateDefault);
    paginateRender(paginateSize, paginateDefault);

}

function productEdit(id) {

    const productDisplay = document.querySelector(`.Product-Display_Id-${id}`);
    const productDisplayAction = document.querySelector(`.Product-Display_Action-${id}`);

    productDisplay.children[1].innerHTML = `<input type="text" value="${productDetail[id - 1].productName}"></input>`;
    productDisplay.children[2].innerHTML = `<input type="url" value="${productDetail[id - 1].productImage}"></input>`;
    productDisplay.children[3].innerHTML = `<input type="number" value="${productDetail[id - 1].productQuantity}"></input>`;
    productDisplay.children[4].innerHTML = `<input type="number" value="${productDetail[id - 1].productPrice}"></input>`;
    productDisplay.children[6].innerHTML = `<input type="date"></input>`;
    productDisplay.children[7].innerHTML = `

        <select>

            <option value="Available">Available</option>
            <option value="Unavailable">Unavailable</option>

        </select>

    `;

    productDisplayAction.children[0].classList.add("Product-Display_Action-Hidden");
    productDisplayAction.children[1].classList.remove("Product-Display_Action-Hidden");
    productDisplayAction.children[2].classList.remove("Product-Display_Action-Hidden");
    productDisplayAction.children[3].classList.add("Product-Display_Action-Hidden");

}

function productUpdate(id) {

    const productDisplay = document.querySelector(`.Product-Display_Id-${id}`);

    const productNameUpdate = productDisplay.children[1].children[0].value;

    if (!productNameUpdate) {

        alert("Please set product name to create new product!")
        return;

    }

    const productImageUpdate = productDisplay.children[2].children[0].value;
    const productQuantityUpdate = Number(productDisplay.children[3].children[0].value);
    const productPriceUpdate = Number(productDisplay.children[4].children[0].value);
    const productDateUpdate = productDisplay.children[6].children[0].value;
    const productStatusUpdate = productDisplay.children[7].children[0].value;

    productDetail[id - 1].productName = productNameUpdate;
    productDetail[id - 1].productImage = productImageUpdate;
    productDetail[id - 1].productQuantity = productQuantityUpdate;
    productDetail[id - 1].productPrice = productPriceUpdate;
    productDetail[id - 1].productDate = productDateUpdate;
    productDetail[id - 1].productStatus = productStatusUpdate;
    productDetail[id - 1].productAmount = productDetail[id - 1].productQuantity * productDetail[id - 1].productPrice;

    productDisplay.children[4].innerHTML = currencyFormat(productDetail[id - 1].productAmount);

    setData(localStorageKey, productDetail);
    productRender(productDetail, paginateDefault);

    productCancel(id)

}

function productCancel(id) {

    const productDisplay = document.querySelector(`.Product-Display_Id-${id}`);
    const productDisplayAction = document.querySelector(`.Product-Display_Action-${id}`);

    productDisplay.children[1].innerHTML = productDetail[id - 1].productName;
    productDisplay.children[2].innerHTML = `<img src="${productDetail[id - 1].productImage}">`;
    productDisplay.children[3].innerHTML = productDetail[id - 1].productQuantity;
    productDisplay.children[4].innerHTML = currencyFormat(productDetail[id - 1].productPrice);
    productDisplay.children[6].innerHTML = productDetail[id - 1].productDate;
    productDisplay.children[7].innerHTML = productDetail[id - 1].productStatus;

    productDisplayAction.children[0].classList.remove("Product-Display_Action-Hidden");
    productDisplayAction.children[1].classList.add("Product-Display_Action-Hidden");
    productDisplayAction.children[2].classList.add("Product-Display_Action-Hidden");
    productDisplayAction.children[3].classList.remove("Product-Display_Action-Hidden");

}

function productDelete(id) {

    let index = 0;

    for (let count = 0; count < productDetail.length; count++) {

        if (productDetail[count].productId == id) {

            index = count;

        }

    }

    if (confirm(`Are you sure to delete ${productDetail[index].productName} ?`)) {

        productDetail.splice(index, 1);

        setData(localStorageKey, productDetail);
        productRender(productDetail, paginateDefault);
        paginateRender(paginateSize, paginateDefault);

    }

}

function paginateBinding(paginateTotal) {

    paginateCurrent = paginateTotal;

    productRender(productDetail, paginateTotal);
    paginateRender(paginateSize, paginateTotal);

}

function paginateRender(paginateSize, paginateTotal) {

    let paginate = document.querySelector(".Paginate-Display");

    paginate.innerHTML = "";

    for (let count = 1; count <= Math.ceil(productDetail.length / paginateSize); count++) {

        paginate.innerHTML += `

            <div class="${paginateTotal == count ? "active" : ""}">

                <button onclick="paginateBinding(${count})">${count}</button>

            </div>

        `;

    }

}

productInitial();
productRender(productDetail, paginateDefault);
paginateRender(paginateSize, paginateDefault);