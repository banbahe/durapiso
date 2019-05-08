// const uriservice = "https://durapisoservice.herokuapp.com/";
const uriservice = "http://localhost:5000/";

// document.getElementById("btnLogin").addEventListener("click", login);
document.getElementById("btnLoad").addEventListener("click", ProductsGet);


function ProductsGetCallback(products) {
    console.dir(products);
}
function ProductsGet() {
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
                debugger;

                adata.map(datatmp => {
                    let tmpproduct = {
                        id: datatmp._id,
                        status_item: datatmp.name,
                        create_date: datatmp.parentResourceId,
                        modification_date: datatmp.modification_date,
                        maker: datatmp.maker,
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
function login() {
    // var tmpuser = {
    //     "email": document.getElementById("txtEmail").value,
    //     "password": document.getElementById("txtPWD").value,
    // }
    var tmpuser = {
        "email": "iblanquel@gmail.com",
        "password": "admin",
    }

    var user = {};

    let endpoint = uriservice + "api/login";
    //  let tmpData = JSON.stringify(tmpuser);
    $.ajax({
        type: "POST",
        dataType: "json",
        url: endpoint,
        async: true,
        data: tmpuser,
        beforeSend: function (xhr) {
            // xhr.setRequestHeader("Authorization", token);
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
                // window.location.href("about.html");
            }
        },
        complete: function (jqXHR, textStatus) {
            if (jqXHR.statusText == "Not Found") {
                alert("verificar usuario y contraseña")
            } else {
                console.dir(user);
                location.href = "./about.html";
            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(jqXHR.statusText);
        }
    });


}