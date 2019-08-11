// const uriservice = "https://durapisoservice.herokuapp.com/";
const uriservice = "http://localhost:5000/";

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

function UserAdd() {
    let $form = $("#UserCreateUpdate");
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
            beforeSend: function (xhr) {
                sessionStorage.setItem('userupdate', "");
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
                        email: datatmp.email,
                        password: datatmp.password,
                        description: datatmp.description,
                        imgurl: datatmp.imgurl
                    };
                }
            },
            complete: function (jqXHR, textStatus) {
                document.getElementById("UserCreateUpdate").reset();
                alert(`Usuario  Modificado`);
                location.href = "./backofficeusers.html";
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert(jqXHR.statusText);
            }
        });
    } else {
        endpoint = uriservice + "api/users";
        debugger;
        $.ajax({
            type: "POST",
            dataType: "json",
            url: endpoint,
            async: true,
            data: data,
            beforeSend: function (xhr) {},
            success: function (data, textStatus, jqXHR) {
                if (typeof data !== "undefined") {
                    console.dir(data.result);
                }
            },
            complete: function (jqXHR, textStatus) {
                document.getElementById("UserCreateUpdate").reset();
                alert("Usuario Agregado");
                location.href = "./backofficeusers.html";
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert(jqXHR.statusText);
            }
        });
    }
}

function ClientOnLoad() {
    
    let tmplistclient = sessionStorage.getItem('clientupdate');
    // if (typeof tmplistclient != '' || typeof tmplistclient != 'undefined' || typeof tmplistclient != undefined || tmplistclient != null) {
    if (tmplistclient != null) {
        let tmpclient = JSON.parse(tmplistclient);
        ClientFillForm(tmpclient[0]);
    }
}

function ClientFillForm(client) {
    try {
        
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

function UserUpdate() {
    sessionStorage.getItem('clientupdate');
    sessionStorage.setItem('clientupdate', "");
    sessionStorage.setItem('clientupdate', JSON.stringify(listClientSelected));
}

function UserDelete() {

    for (let index = 0; index < listClientSelected.length; index++) {
        let endpoint = uriservice + "api/users/" + listClientSelected[index].id;
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

function UsersReadCallback() {
    let tmpRender = '';
    listUsers.map(item => {
        tmpRender += `
         <li> <input type="checkbox" id="cb${item.id}" onchange="ClientAction('${item.id}')" />
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
        beforeSend: function (xhr) {
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
        complete: function (jqXHR, textStatus) {
            if (listUsers.length > 0) {
                UsersReadCallback();
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // alert(jqXHR.statusText);
        }
    });
}
// usert end
