

if (localStorage.d == "1") {
    var btnde = '<button type="button" class="btn_hapus btn btn-danger btn-circle waves-effect"> <span><i class="fa fa-times"></i></span></button>';
    var btnde_nest = '<button type="button" class="btn_hapus btn btn-danger waves-effect btn_nest_ubah float-right"> <span><i class="fa fa-times"></i></span></button>';
    var checkd = '<input data-checkbox="icheckbox_flat-red" style="cursor:pointer;" type="checkbox" class="checklist check" value="">';
    var checkdall = '<input style="cursor:pointer;" type="checkbox" class="checklistAll check" value="">';
}
else {
    var btnde = '';
    var btnde_nest = '';
    var checkd = '';
    var checkdall = '';
}

if (localStorage.u == "1") {
    var btnup = '<button type="button" data-toggle="modal" data-target="#ModalAddUpdate" class="btn_edit btn btn-success btn-circle waves-effect"><span><i class="ti-pencil-alt"></i></span></button>';
    var btnup_nest = '<button type="button" data-toggle="modal" data-target="#ModalAddUpdate" class="btn_edit btn btn-success waves-effect btn_nest_ubah float-right"><span><i class="ti-pencil-alt"></i></span></button>';
} else {
    var btnup = '';
}



//FILTER DROPDOWN
function Select2tree_bysp(spquery, element, placeholder) {
    $.ajax
        ({
            url: "../CRUD/R_Proc",
            type: "GET",
            data: spquery + "&t=" + $.cookie('t'),
            cache: !0,
            success: function (response) {
                var data2 = $.parseJSON(response);
                var html = "";
                for (var x = 0; x < data2.length; x++) {
                    html += "<option parent='" + data2[x].PARENTID + "' level='" + data2[x].LEVEL + "' value='" + data2[x].ID + "'>" + data2[x].KODE + " " + data2[x].NAMA + "</option>";
                }
                $(element).empty();
                $(element).append(html);
            }
        })
}

//FILTER DROPDOWN
function Select2_bytbl(tb,element,placeholder) {
    $.ajax
        ({
            url: "../CRUD/R_Table",
            contentType: "application/html; charset=utf-8",
            type: "GET",
            data: "tb=" + tb + "&t=" + $.cookie('t'),
            cache: !0,
            datatype: "html",
            success: function (r) {
                var data = $.parseJSON(r);
                var html = "";
                for (var i = 0; i < data.length; i++) {
                    html += "<option value='" + data[i].ID + "' >" + data[i].NAMA + "</option>";
                }
                $(element).empty();
                $(element).append('<option value="">' + placeholder+'</option>');
                $(element).append(html);
            }
        })
}


//FILTER DROPDOWN CHAINED
var chained_el = [];
function Select2chain_bytbl(tb, element, element2, placeholder) {
    var IDNAME = $(element2).attr('name');
    chained_el.push(element);

    $(element2).on('change', function(){
        var ID = $(this).val();
        $.ajax
            ({
                url: "../CRUD/R_Table",
                contentType: "application/html; charset=utf-8",
                type: "GET",
                data: "tb=" + tb + "&" + IDNAME + "=" + ID + "&t=" + $.cookie('t'),
                cache: !0,
                datatype: "html",
                success: function (r) {
                    var data = $.parseJSON(r);
                    var html = "";
                    for (var i = 0; i < data.length; i++) {
                        html += "<option value='" + data[i].ID + "' >" + data[i].NAMA + "</option>";
                    }
                    $(element).empty();
                    $(element).append('<option value="">' + placeholder + '</option>');
                    $(element).append(html);
                    $(element).addClass('chained');
                }
            })
    })
   
}


$(document).ready(function () {
    toastr.options = {
        "closeButton": true, // true/false
        "debug": false, // true/false
        "newestOnTop": false, // true/false
        "progressBar": true, // true/false
        "positionClass": "toast-top-right", // toast-top-right / toast-top-left / toast-bottom-right / toast-bottom-left
        "preventDuplicates": false, //true/false
        "onclick": null,
        "showDuration": "300", // in milliseconds
        "hideDuration": "1000", // in milliseconds
        "timeOut": "1500", // in milliseconds
        "extendedTimeOut": "1000", // in milliseconds
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }
});