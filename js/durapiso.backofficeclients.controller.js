const uriservice = "https://durapisoservice.herokuapp.com/";
// const uriservice = "http://localhost:5000/";
const sessionmaker = "WEBAPP";

// client start
let listClient = [];
let listClientSelected = [];

function getFormData($form) {
    let unindexed_array = $form.serializeArray();
    let indexed_array = {};

    $.map(unindexed_array, function (n, i) {
        indexed_array[n['name']] = n['value'];
    });

    return indexed_array;
}

function PreviewImage() {
    var tmpimg = document.getElementById('txtImg').value;
    if (tmpimg) {
        document.getElementById('imgPreview').src = tmpimg;
    }
}

function ClientAdd() {
    let $form = $("#ClientCreateUpdate");
    let data = getFormData($form);
    data.maker = sessionmaker;
    let endpoint = "";
    let client = {};

    if (data.id.length > 0) {

        endpoint = uriservice + "api/clients/" + data.id;
        $.ajax({
            type: "PATCH",
            dataType: "json",
            url: endpoint,
            async: true,
            data: data,
            beforeSend: function (xhr) {
                sessionStorage.setItem('clientupdate', "");
            },
            success: function (data, textStatus, jqXHR) {
                if (typeof data !== "undefined") {
                    let datatmp = JSON.parse(data.result);
                    client = {
                        status_item: datatmp.name,
                        modification_date: datatmp.modification_date,
                        maker: datatmp.maker,
                        description: datatmp.description,
                        imgurl: datatmp.imgurl,
                        name: datatmp.name,
                        lastname: datatmp.lastname,
                        email: datatmp.email,
                        mobil: datatmp.mobil,
                        feedback: datatmp.feedback
                    };
                }
            },
            complete: function (jqXHR, textStatus) {
                sessionStorage.setItem('clientupdate', "");
                document.getElementById("ClientCreateUpdate").reset();
                alert("Cliente Modificado");
                location.href = "./backofficeclients.html";
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert(jqXHR.statusText);
            }
        });
    } else {

        endpoint = uriservice + "api/clients";
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
                    client = {
                        status_item: datatmp.name,
                        modification_date: datatmp.modification_date,
                        maker: datatmp.maker,
                        description: datatmp.description,
                        imgurl: datatmp.imgurl,
                        name: datatmp.name,
                        lastname: datatmp.lastname,
                        email: datatmp.email,
                        mobil: datatmp.mobil,
                        feedback: datatmp.feedback
                    };
                }
            },
            complete: function (jqXHR, textStatus) {
                document.getElementById("ClientCreateUpdate").reset();
                alert("Cliente Agregado");
                location.href = "./backofficeclients.html";
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert(jqXHR.statusText);
            }
        });
    }
}

function ClientOnLoad() {
    // debugger;
    let tmplistclient = sessionStorage.getItem('clientupdate');
    // if (typeof tmplistclient != '' || typeof tmplistclient != 'undefined' || typeof tmplistclient != undefined || tmplistclient != null) {
    if (tmplistclient != null) {
        let tmpclient = JSON.parse(tmplistclient);
        ClientFillForm(tmpclient[0]);
    }
}

function ClientFillForm(client) {
    try {
        debugger;
        document.getElementById('clientid').value = client.id;
        document.getElementById('clientstatus').value = client.status_item;
        document.getElementById('txtImg').value = client.imgurl;
        document.getElementById('imgPreview').src = client.imgurl;
        document.getElementById('txtName').value = client.name;
        document.getElementById('txtDescription').value = client.description;
        document.getElementById('txtLastName').value = client.lastname;
        document.getElementById('txtEmail').value = client.email;
        document.getElementById('txtMobil').value = client.mobil;
        document.getElementById('txtFeedback').value = client.feedback;
    } catch (error) {

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

                    // window.location.href("about.html");
                }
            },
            complete: function (jqXHR, textStatus) {
                let tmpindex = index + 1;
                if (tmpindex == listClientSelected.length) {

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

                adata.map(datatmp => {
                    let tmp = {
                        id: datatmp._id,
                        status_item: datatmp.status_item,
                        create_date: datatmp.create_date,
                        modification_date: datatmp.modification_date,
                        maker: datatmp.maker,
                        description: datatmp.description,
                        imgurl: datatmp.imgurl,
                        name: datatmp.name,
                        lastname: datatmp.lastname,
                        email: datatmp.email,
                        mobil: datatmp.mobil,
                        feedback: datatmp.feedback
                    };

                    listClient.push(tmp);
                });
            }
        },
        complete: function (jqXHR, textStatus) {
            if (listClient.length > 0) {
                ClientReadCallback();
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // alert(jqXHR.statusText);

        }
    });


}
// client end
