const uriservice = "https://durapisoservice.herokuapp.com/";


// user start
let listUsers = [];
let listUsersSelected = [];

function GetCredentials() {
    let tmpuser = JSON.parse(sessionStorage.getItem('usersigned'));
    if (tmpuser.id !== null || typeof (tmpuser.id) !== undefined) { return tmpuser } else {
        location.href = "./login.html";
    }
}

function getFormData($form) {
    let unindexed_array = $form.serializeArray();
    let indexed_array = {};

    $.map(unindexed_array, function (n, _i) {
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
        endpoint = uriservice + "api/users/" + data.id;
        $.ajax({
            type: "PATCH",
            dataType: "json",
            url: endpoint,
            async: true,
            data: data,
            beforeSend: function (_xhr) {
                sessionStorage.setItem('userupdate', "");
            },
            success: function (data, _textStatus, _jqXHR) {
                if (typeof data !== "undefined") {
                    let datatmp = JSON.parse(data.result);
                    user = {
                        status_item: datatmp.name,
                        create_date: datatmp.create_date,
                        modification_date: datatmp.modification_date,
                        maker: datatmp.maker,
                        name: datatmp.name,
                        email: datatmp.email,
                        password: datatmp.password,
                        description: datatmp.description,
                        imgurl: datatmp.imgurl
                    };
                }
            },
            complete: function (_jqXHR, _textStatus) {
                document.getElementById("CreateUpdate").reset();
                alert(`Usuario  Modificado`);
                location.href = "./backofficeusers.html";
            },
            error: function (_jqXHR, _textStatus, _errorThrown) { }
        });
    } else {
        endpoint = uriservice + "api/users";
        $.ajax({
            type: "POST",
            dataType: "json",
            url: endpoint,
            async: true,
            data: data,
            beforeSend: function (_xhr) {},
            success: function (_data, _textStatus, _jqXHR) { },
            complete: function (_jqXHR, _textStatus) {
                document.getElementById("CreateUpdate").reset();
                alert("Usuario Agregado");
                location.href = "./backofficeusers.html";
            },
            error: function (_jqXHR, _textStatus, _errorThrown) { }
        });
    }
}

function OnLoad() {
    let tmplist = sessionStorage.getItem('userupdate');
    if (tmplist != null && tmplist.length > 0) {
        sessionStorage.setItem('userupdate','');
        let tmpobj = JSON.parse(tmplist);
        FillForm(tmpobj[0]);
    }
}

function FillForm(paramobject) {
    try {
        document.getElementById('itemid').value = paramobject.id;
        document.getElementById('txtImg').value = paramobject.imgurl;
        document.getElementById('imgPreview').src = paramobject.imgurl;
        document.getElementById('txtName').value = paramobject.name;
        document.getElementById('txtEmail').value = paramobject.email;
        document.getElementById('txtPassword').value = paramobject.password;
        document.getElementById('txtDescription').value = paramobject.description;
        document.getElementById('itemstatus').value = paramobject.status_item;
    } catch (error) {
        console.log("User FillForm");
        console.dir(error);
    }
}

function Update() {
    sessionStorage.getItem('userupdate');
    sessionStorage.setItem('userupdate', "");
    sessionStorage.setItem('userupdate', JSON.stringify(listUsersSelected));
}

function UserDelete() {
    for (let index = 0; index < listUsersSelected.length; index++) {
        let endpoint = uriservice + "api/users/" + listUsersSelected[index].id;
        let tmpId =  GetCredentials().id;
        const data = { maker: tmpId };

        $.ajax({
            type: "DELETE",
            dataType: "json",
            url: endpoint,
            async: true,
            data: data,
            beforeSend: function (_xhr) {},
            success: function (_data, _textStatus, _jqXHR) {},
            complete: function (_jqXHR, _textStatus) {
                let tmpindex = index + 1;
                if (tmpindex == listUsersSelected.length) {
                    UsersRead();
                }
            },
            error: function (_jqXHR, _textStatus, _errorThrown) { }
        });
    }
}

function UserAction(tmpObject) {
    let tmpelementid = "cb" + tmpObject;
    var toogle = document.getElementById(tmpelementid).checked;
    if (toogle) {
        const resultado = listUsers.find(item => item.id === tmpObject);
        listUsersSelected.push(resultado);
    } else {
        for (var i = 0; i < listUsersSelected.length; i++)
            if (listUsersSelected[i].id === tmpObject) {
                listUsersSelected.splice(i, 1);
                break;
            }
    }

    if (listUsersSelected.length == 0) {
        document.getElementById("btnUpdate").style.visibility = "hidden";
        document.getElementById("btnDelete").style.visibility = "hidden";
    }

    if (listUsersSelected.length == 1) {
        document.getElementById("btnUpdate").style.visibility = "visible";
        document.getElementById("btnDelete").style.visibility = "visible";

    }
    if (listUsersSelected.length > 1) {
        document.getElementById("btnUpdate").style.visibility = "hidden";
        // document.getElementById("btnDelete").style.display = "block";
    }
}

function UsersReadCallback() {
    let tmpRender = '';
    listUsers.map(item => {
        tmpRender += `
         <li> <input type="checkbox" id="cb${item.id}" onchange="UserAction('${item.id}')" />
         <label  for="cb${item.id}" data-toggle="tooltip" title='${item.name} : ${item.email} '><img
                 src="${item.imgurl}" /></label>
     </li>`;
    });

    $("#divResultCatalog").html(tmpRender);
}

//  onload users read
function UsersRead() {

    listUsers = [];
    listUsersSelected = [];
    let endpoint = uriservice + "api/users";

    $.ajax({
        type: "GET",
        dataType: "json",
        url: endpoint,
        async: true,
        beforeSend: function (_xhr) {
        },
        success: function (data, _textStatus, _jqXHR) {

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
                        email: datatmp.email,
                        password: datatmp.password,
                        description: datatmp.description,
                        imgurl: datatmp.imgurl
                    };

                    listUsers.push(tmp);

                });
            }
        },
        complete: function (_jqXHR, _textStatus) {
            if (listUsers.length > 0) {
                UsersReadCallback();
            }
        },
        error: function (_jqXHR, _textStatus, _errorThrown) {
            // alert(jqXHR.statusText);
        }
    });
}
// usert end
