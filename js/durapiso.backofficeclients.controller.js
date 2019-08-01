// const uriservice = "https://durapisoservice.herokuapp.com/";
const uriservice = "http://localhost:5000/";
const sessionmaker = "WEBAPP";

// client start
let listClient = [];
let listClientSelected = [];

function ClientAdd() {
    let $form = $("#ProductCreateUpdate");
    let data = getFormData($form);
    data.maker = sessionmaker;
    let endpoint = "";
    let product = {};

    if (data.id.length > 0) {
        sessionStorage.setItem('productupdate', "");
        endpoint = uriservice + "api/products/" + data.id;
        $.ajax({
            type: "PATCH",
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
                        stock: datatmp.stock,
                        imgurl: datatmp.imgurl,
                    };
                    // window.location.href("about.html");
                }
            },
            complete: function (jqXHR, textStatus) {

                document.getElementById("ProductCreateUpdate").reset();

                alert("Producto Agregado");
                location.href = "./backofficeproducts.html";
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert(jqXHR.statusText);
            }
        });
    } else {

        endpoint = uriservice + "api/products";
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
                        stock: datatmp.stock,
                        imgurl: datatmp.imgurl,
                    };
                    // window.location.href("about.html");
                }
            },
            complete: function (jqXHR, textStatus) {
                document.getElementById("ProductCreateUpdate").reset();
                alert("Producto Agregado");
                location.href = "./productcatalog.html";
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert(jqXHR.statusText);
            }
        });
    }
    //  let tmpData = JSON.stringify(tmpuser);    
}

function ClientOnLoad() {
    // debugger;
    let tmplistclient = sessionStorage.getItem('clientupdate');
    if (typeof tmplistclient != '' || typeof tmplistclient != 'undefined' || typeof tmplistclient != undefined) {
        let tmpclient = JSON.parse(tmplistclient);
        ClientFillForm(tmpclient[0]);
    }
}

function ClientFillForm(client) {
    try {
        // debugger;
        document.getElementById('clientid').value = client.id;
        document.getElementById('clientstatus').value = client.status_item;

        document.getElementById('txtImg').value = client.imgurl;
        document.getElementById('imgPreview').src = client.imgurl;
        document.getElementById('txtName').value = client.name;
        document.getElementById('txtDescription').value = client.description;

    } catch (error) {
        console.dir(error);
    }
}

function ClientUpdate() {
    sessionStorage.getItem('clientupdate');
    sessionStorage.setItem('clientupdate', "");
    sessionStorage.setItem('clientupdate', JSON.stringify(listClientSelected));
}

function ClientDelete() {

    for (let index = 0; index < listClientSelected.length; index++) {
        let endpoint = uriservice + "api/clients/" + listClientSelected[index].id;
        const data = { maker: sessionmaker };

        $.ajax({
            type: "DELETE",
            dataType: "json",
            url: endpoint,
            async: true,
            data: data,
            beforeSend: function (xhr) {
                // xhr.setRequestHeader("Authorization", token);
            },
            success: function (data, textStatus, jqXHR) {

                if (typeof data !== "undefined") {
                    console.dir(data);
                    // window.location.href("about.html");
                }
            },
            complete: function (jqXHR, textStatus) {
                let tmpindex = index + 1;
                if (tmpindex == listClientSelected.length) {
                    // debugger;
                    ClientRead();
                }

            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert(jqXHR.statusText);
            }
        });
    }
}

function ClientAction(tmpObject) {

    let tmpelementid = "cb" + tmpObject;
    var toogle = document.getElementById(tmpelementid).checked;
    if (toogle) {
        const resultado = listClient.find(item => item.id === tmpObject);
        listClientSelected.push(resultado);
    } else {
        for (var i = 0; i < listClientSelected.length; i++)
            if (listClientSelected[i].id === tmpObject) {
                listClientSelected.splice(i, 1);
                break;
            }
    }

    if (listClientSelected.length == 0) {
        document.getElementById("btnUpdate").style.visibility = "hidden";
        document.getElementById("btnDelete").style.visibility = "hidden";
    }

    if (listClientSelected.length == 1) {
        document.getElementById("btnUpdate").style.visibility = "visible";
        document.getElementById("btnDelete").style.visibility = "visible";

    }
    if (listClientSelected.length > 1) {
        document.getElementById("btnUpdate").style.visibility = "hidden";
        // document.getElementById("btnDelete").style.display = "block";
    }
}

function ClientReadCallback() {
    // console.dir(products);

    let tmpRender = '';
    listClient.map(item => {

        tmpRender += `
         <li> <input type="checkbox" id="cb${item.id}" onchange="ClientAction('${item.id}')" />
         <label  for="cb${item.id}" data-toggle="tooltip" title='${item.description}'><img
                 src="${item.imgurl}" /></label>
     </li>`;
    });
    $("#divResultCatalog").html(tmpRender);
}

function ClientRead() {
    // debugger;
    listClient = [];
    listClientSelected = [];

    let endpoint = uriservice + "api/clients";

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
                // debugger;
                adata.map(datatmp => {
                    let tmp = {
                        id: datatmp._id,
                        status_item: datatmp.status_item,
                        create_date: datatmp.create_date,
                        modification_date: datatmp.modification_date,
                        maker: datatmp.maker,
                        name: datatmp.name,
                        description: datatmp.description,
                        imgurl: datatmp.imgurl
                    };
                    listClient.push(tmp);
                });
            }
        },
        complete: function (jqXHR, textStatus) {
            ClientReadCallback();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(jqXHR.statusText);
        }
    });


}
// client end
