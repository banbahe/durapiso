const uriservice = "https://durapisoservice.herokuapp.com/";
// const uriservice = "http://localhost:5000/";

function PreviewImage() {
    var tmpimg = document.getElementById('txtImg').value;
    if (tmpimg) {
        document.getElementById('imgPreview').src = tmpimg;
    }
}
function ProductOnLoad() {
    debugger;
    var test = sessionStorage.getItem('label')
    sessionStorage.setItem('label', 'value')
}

function getFormData($form) {
    let unindexed_array = $form.serializeArray();
    let indexed_array = {};

    $.map(unindexed_array, function (n, i) {
        indexed_array[n['name']] = n['value'];
    });

    return indexed_array;
}

function ProductAdd() {
    let $form = $("#ProductCreateUpdate");
    let data = getFormData($form);
    data.maker = "web user";
    let endpoint = uriservice + "api/products";
    let product = {};
    //  let tmpData = JSON.stringify(tmpuser);
    $.ajax({
        type: "POST",
        dataType: "json",
        url: endpoint,
        async: true,
        data: data,
        beforeSend: function (xhr) {
            // xhr.setRequestHeader("Authorization", token);
        },
        success: function (data, textStatus, jqXHR) {

            if (typeof data !== "undefined") {
                let datatmp = JSON.parse(data.result);
                product = {
                    status_item: datatmp.name,
                    create_date: datatmp.parentResourceId,
                    modification_date: datatmp.modification_date,
                    maker: datatmp.maker,
                    name: datatmp.name,
                    description: datatmp.description,
                    cost: datatmp.cost,
                    sale: datatmp.sale,
                    iva: datatmp.iva,
                    imgurl: datatmp.imgurl,
                };
                // window.location.href("about.html");
            }
        },
        complete: function (jqXHR, textStatus) {

            document.getElementById("UserLogin").reset();
            alert("Producto Agregado");
            location.href = "./productcatalog.html";
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(jqXHR.statusText);
        }
    });
}

$("#ProductCreateUpdate").on("submit", function (event) {
    event.preventDefault();
    console.log($(this).serialize());
});

function ProductsGetCallback(products) {
    // console.dir(products);

    let renderProducts = '';
    products.map(item => {
        renderProducts += `<li id="${item.id}" class="list-group-item"> <input type="checkbox" name="" value="${item.id}"> <img alt="${item.description}" src="${item.imgurl}" width="25px" height="20px"> ${item.name}</li>`;
    });


    // <li class="list-group-item"> <input type="checkbox" name="vehicle1" value="Bike"> <img alt="x" src="./images/img_1.jpg" width="20px" height="20px"> Cras justoodio</li>

    $("#divResultCatalogProduct").html(renderProducts);

}
function ProductsRead() {
    let endpoint = uriservice + "api/products";
    //  let tmpData = JSON.stringify(tmpuser);

    let products = [];
    $.ajax({
        type: "GET",
        dataType: "json",
        url: endpoint,
        async: true,
        beforeSend: function (xhr) {
            // xhr.setRequestHeader("Authorization", token);
        },
        success: function (data, textStatus, jqXHR) {

            if (typeof data !== "undefined") {
                let adata = JSON.parse(data.result);
                //                debugger;
                adata.map(datatmp => {
                    let tmpproduct = {
                        id: datatmp._id,
                        status_item: datatmp.name,
                        create_date: datatmp.parentResourceId,
                        modification_date: datatmp.modification_date,
                        maker: datatmp.maker,
                        name: datatmp.name,
                        description: datatmp.description,
                        stock: datatmp.stock,
                        cost: datatmp.cost,
                        sale: datatmp.sale,
                        iva: datatmp.iva,
                        imgurl: datatmp.imgurl,
                    };

                    products.push(tmpproduct);
                });
            }
        },
        complete: function (jqXHR, textStatus) {
            ProductsGetCallback(products);

        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(jqXHR.statusText);
        }
    });


}
function UserLogin() {
    // alert("test");
    let $form = $("#UserLogin");
    let data = getFormData($form);

    let endpoint = uriservice + "api/login";
    //  let tmpData = JSON.stringify(tmpuser);
    $.ajax({
        type: "POST",
        dataType: "json",
        url: endpoint,
        async: true,
        data: data,
        beforeSend: function (xhr) {
        },
        success: function (data, textStatus, jqXHR) {

            if (typeof data !== "undefined") {
                let datatmp = JSON.parse(data.result);
                user = {
                    status_item: datatmp.name,
                    create_date: datatmp.parentResourceId,
                    modification_date: datatmp.modification_date,
                    maker: datatmp.maker,
                    name: datatmp.name,
                    description: datatmp.description,
                    imgurl: datatmp.imgurl,
                };
            }
        },
        complete: function (jqXHR, textStatus) {
            if (jqXHR.statusText == "Not Found") {
                document.getElementById("UserLogin").reset();
                alert("verificar usuario y contraseña");
            } else {
                location.href = "./about.html";
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(jqXHR.statusText);
        }
    });


}