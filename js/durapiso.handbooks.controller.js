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

function PreviewImage() {
    var tmpimg = document.getElementById('txtImg').value;
    if (tmpimg) {
        document.getElementById('imgPreview').src = tmpimg;
    }
}

function Add() {
    let $form = $("#CreateUpdate");
    let data = getFormData($form);
    data.maker = GetCredentials().id;

    let endpoint = "";
    let user = {};

    if (data.id.length > 0) {
        endpoint = uriservice + "api/downloads/" + data.id;
        $.ajax({
            type: "PATCH",
            dataType: "json",
            url: endpoint,
            async: true,
            data: data,
            beforeSend: function (xhr) {
                sessionStorage.setItem('handbooksupdate', "");
            },
            success: function (data, textStatus, jqXHR) {
                if (typeof data !== "undefined") {
                    let datatmp = JSON.parse(data.result);
                    user = {
                        status_item: datatmp.name,
                        create_date: datatmp.create_date,
                        modification_date: datatmp.modification_date,
                        maker: datatmp.maker,
                        name: datatmp.name,
                        imgurl: datatmp.imgurl,
                        description: datatmp.description,
                        price: datatmp.price,
                        offerprice: datatmp.offerprice,
                        start_date: datatmp.start_date,
                        end_date: datatmp.end_date
                    };
                }
            },
            complete: function (jqXHR, textStatus) {
                document.getElementById("CreateUpdate").reset();
                alert(`Modificado`);
                location.href = "./backofficehandbooks.html";
            },
            error: function (jqXHR, textStatus, errorThrown) { }
        });
    } else {
        endpoint = uriservice + "api/downloads";
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
                location.href = "./backofficehandbooks.html";
            },
            error: function (jqXHR, textStatus, errorThrown) { }
        });
    }
}





function Update() {
    sessionStorage.getItem('handbooksupdate');
    sessionStorage.setItem('handbooksupdate', "");
    sessionStorage.setItem('handbooksupdate', JSON.stringify(listItemsSelected));
}

function Delete() {
    for (let index = 0; index < listItemsSelected.length; index++) {
        let endpoint = uriservice + "api/downloads/" + listItemsSelected[index].id;
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
    console.dir(listItems);
    let tmpRender = '';
    listItems.map(item => {
        tmpRender += `
         <li> <input type="checkbox" id="cb${item.id}" onchange="Action('${item.id}')" />
         <label  for="cb${item.id}" data-toggle="tooltip" title='${item.title} '><img
                 src="https://reypila.github.io/durapiso/images/pdf.png" /></label>
     </li>`;
    });

    console.dir(tmpRender);

    $("#divResultCatalog").html(tmpRender);
}


function FillForm(paramobject) {
    try {
        document.getElementById('itemid').value = paramobject.id;
        document.getElementById('itemstatus').value = paramobject.status_item;
        document.getElementById('txtTitle').value = paramobject.title;
        document.getElementById('txtDescription').value = paramobject.description;
        document.getElementById('txtPathurl').value = paramobject.pathurl;
    } catch (error) {
        console.log("ERROR.HANDBOOKS.CONTROLLER.FillForm");
    }
}

function OnLoad() {
    let tmplist = sessionStorage.getItem('handbooksupdate');
    if (tmplist != null && tmplist.length > 0) {
        sessionStorage.setItem('handbooksupdate', '');
        let tmpobj = JSON.parse(tmplist);
        FillForm(tmpobj[0]);
    }
}
function Read() {

    listItems = [];
    listItemsSelected = [];
    let endpoint = uriservice + "api/downloads/4/filter";

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
                        title: datatmp.title,
                        description: datatmp.description,
                        pathurl: datatmp.pathurl
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


