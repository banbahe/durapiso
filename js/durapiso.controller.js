const uriservice = "https://durapisoservice.herokuapp.com/";

function login() {
    var user = {
        "_id": "",
        "status_item": "",
        "create_date": "",
        "modification_date": "",
        "maker": "",
        "name": "",
        "email": document.getElementById("txtEmail").value,
        "password": document.getElementById("txtPWD").value,
        "description": "",
        "imgurl": "https://www.emojirequest.com/images/SalutingEmoji.jpg"
    }

    let endpoint = uriservice + "api/login";

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
                user = {
                    status_item: data.name,
                    create_date: data.parentResourceId,
                    modification_date: data.modification_date,
                    maker: data.maker,
                    name: data.name,
                    description: data.description,
                    imgurl: data.imgurl,
                };

                window.location.href("about.html");
            }
        },
        complete: function (jqXHR, textStatus) {
            console.dir(user);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(textStatus);
        }
    });


}