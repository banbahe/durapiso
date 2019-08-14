const uriservice = "https://durapisoservice.herokuapp.com/";

// user start
let listItems = [];
let listItemsSelected = [];

function GetCredentials() {
    let tmpuser = JSON.parse(sessionStorage.getItem('usersigned'));
    if (tmpuser.id !== null || typeof (tmpuser.id) !== undefined) { return tmpuser } else {
        location.href = "./login.html";
    }
}

function getFormData($form) {
    let unindexed_array = $form.serializeArray();
    let indexed_array = {};

    $.map(unindexed_array, function (n, i) {
        indexed_array[n['name']] = n['value'];
    });

    return indexed_array;
}


function Add() {
    let $form = $("#CreateUpdate");
    let data = getFormData($form);
    data.maker = GetCredentials().id;

    let endpoint = "";
    let user = {};

    if (data.id.length > 0) {
        endpoint = uriservice + "api/jobs/" + data.id;
        $.ajax({
            type: "PATCH",
            dataType: "json",
            url: endpoint,
            async: true,
            data: data,
            beforeSend: function (xhr) {
                sessionStorage.setItem('jobsupdate', "");
            },
            success: function (data, textStatus, jqXHR) {
                if (typeof data !== "undefined") {
                    let datatmp = JSON.parse(data.result);
                    user = {
                        status_item: datatmp.status_item,
                        create_date: datatmp.create_date,
                        modification_date: datatmp.modification_date,
                        maker: datatmp.maker,
                        name: datatmp.name,
                        description: datatmp.description,
                        pathurl: datatmp.imgurl
                    };
                }
            },
            complete: function (jqXHR, textStatus) {
                document.getElementById("CreateUpdate").reset();
                alert(`Modificado`);
                location.href = "./backofficejobs.html";
            },
            error: function (jqXHR, textStatus, errorThrown) { }
        });
    } else {
        endpoint = uriservice + "api/jobs";
        $.ajax({
            type: "POST",
            dataType: "json",
            url: endpoint,
            async: true,
            data: data,
            beforeSend: function (xhr) { },
            success: function (data, textStatus, jqXHR) { },
            complete: function (jqXHR, textStatus) {
                document.getElementById("CreateUpdate").reset();
                alert(" Agregado");
                location.href = "./backofficejobs.html";
            },
            error: function (jqXHR, textStatus, errorThrown) { }
        });
    }
}

function OnLoad() {
    let tmplist = sessionStorage.getItem('jobsupdate');
    if (tmplist != null && tmplist.length > 0) {
        sessionStorage.setItem('jobsupdate', '');
        let tmpobj = JSON.parse(tmplist);
        FillForm(tmpobj[0]);
    }
}

function FillForm(paramobject) {
    try {
        document.getElementById('itemid').value = paramobject.id;
        document.getElementById('itemstatus').value = paramobject.status_item;
        document.getElementById('txtName').value = paramobject.name;
        document.getElementById('txtDescription').value = paramobject.description;
        document.getElementById('txtPathurl').value = paramobject.pathurl;
    } catch (error) {
        console.log("jobs.controller.FillForm");
    }
}

function Update() {
    sessionStorage.getItem('jobsupdate');
    sessionStorage.setItem('jobsupdate', "");
    sessionStorage.setItem('jobsupdate', JSON.stringify(listItemsSelected));
}

function Delete() {
    for (let index = 0; index < listItemsSelected.length; index++) {
        let endpoint = uriservice + "api/jobs/" + listItemsSelected[index].id;
        let tmpId = GetCredentials().id;
        const data = { maker: tmpId };

        $.ajax({
            type: "DELETE",
            dataType: "json",
            url: endpoint,
            async: true,
            data: data,
            beforeSend: function (xhr) { },
            success: function (data, textStatus, jqXHR) { },
            complete: function (jqXHR, textStatus) {
                let tmpindex = index + 1;
                if (tmpindex == listItemsSelected.length) {
                    alert('Elemento inactivo');
                    Read();
                }
            },
            error: function (jqXHR, textStatus, errorThrown) { }
        });
    }
}

function Action(tmpObject) {
    let tmpelementid = "cb" + tmpObject;
    var toogle = document.getElementById(tmpelementid).checked;
    if (toogle) {
        const resultado = listItems.find(item => item.id === tmpObject);
        listItemsSelected.push(resultado);
    } else {
        for (var i = 0; i < listItemsSelected.length; i++)
            if (listItemsSelected[i].id === tmpObject) {
                listItemsSelected.splice(i, 1);
                break;
            }
    }

    if (listItemsSelected.length == 0) {
        document.getElementById("btnUpdate").style.visibility = "hidden";
        document.getElementById("btnDelete").style.visibility = "hidden";
    }

    if (listItemsSelected.length == 1) {
        document.getElementById("btnUpdate").style.visibility = "visible";
        document.getElementById("btnDelete").style.visibility = "visible";

    }
    if (listItemsSelected.length > 1) {
        document.getElementById("btnUpdate").style.visibility = "hidden";
    }
}

function ReadCallback() {
    let tmpRender = '';
    listItems.map(item => {
        tmpRender += `
         <li> <input type="checkbox" id="cb${item.id}" onchange="Action('${item.id}')" />
         <label  for="cb${item.id}" data-toggle="tooltip" title='${item.name}'><img
                 src="https://cdn3.iconfinder.com/data/icons/seo-and-internet-marketing/70/1-10-512.png" /></label>
     </li>`;
    });

    $("#divResultCatalog").html(tmpRender);
}

//  onload jobs read
function Read() {

    listItems = [];
    listItemsSelected = [];
    let endpoint = uriservice + "api/jobs";

    $.ajax({
        type: "GET",
        dataType: "json",
        url: endpoint,
        async: true,
        beforeSend: function (xhr) { },
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
                        name: datatmp.name,
                        description: datatmp.description,
                        pathurl: datatmp.path
                    };

                    listItems.push(tmp);

                });
            }
        },
        complete: function (jqXHR, textStatus) {
            if (listItems.length > 0) {
                ReadCallback();
            } else {
                alert("Vacío ");
            }
        },
        error: function (jqXHR, textStatus, errorThrown) { }
    });
}

