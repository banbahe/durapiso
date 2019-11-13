// #region menu
function MenuHide(object) {
    debugger;
    let key = object.id;

    if (document.getElementById(`div${object.id}`).style.visibility == 'visible') {
        document.getElementById("divmenuHome").style.visibility = "hidden";
        document.getElementById("divmenuEmpresa").style.visibility = "hidden";
        document.getElementById("divmenuProducto").style.visibility = "hidden";
    } else {
        document.getElementById(object.id).style.visibility = 'visible';
    }
}

function MenuShow(object) {
    let key = object.id;
    switch (key) {
        case 'menuHome':
            document.getElementById("divmenuHome").style.visibility = "visible";
            document.getElementById("divmenuEmpresa").style.visibility = "hidden";
            document.getElementById("divmenuProducto").style.visibility = "hidden";
            break;
        case 'menuEmpresa':
            document.getElementById("divmenuHome").style.visibility = "hidden";
            document.getElementById("divmenuEmpresa").style.visibility = "visible";
            document.getElementById("divmenuProducto").style.visibility = "hidden";
            break;

        case 'menuProducto':
            document.getElementById("divmenuHome").style.visibility = "hidden";
            document.getElementById("divmenuEmpresa").style.visibility = "hidden";
            document.getElementById("divmenuProducto").style.visibility = "visible";
            break;

        default:
            alert('hahahahahaha xD');
            break;
    }

}
// #endregion menus
