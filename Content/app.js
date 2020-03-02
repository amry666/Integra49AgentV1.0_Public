/////INIT PAGE+ACTIVEMENU ON BACKBUTTON HITS
$(window).on("popstate", function (e) {
    loadContent(e.originalEvent.state),
        setActivemenu(), setPageProp();
});

/////SET ACTIVE MENU
function setActivemenu() {
    var url = window.location;
    $('ul.nav a').removeClass('active');
    $('ul.nav li').removeClass('active');
    var element = $('ul.nav a').filter(function () {
        return this.href == url;
    }).addClass('active').parent().addClass('active');
    while (true) {
        if (element.is('li')) {
            element = element.parent().addClass('in').parent().addClass('active');
        }
        else {
            break;
        }
    }
}

/////GET PROPERTY APP & USER dari menu localstorage
//$('.sesuser_foto').attr('src', $('#session_ssorl').text() + "Content/images/user_photo/" + localStorage.FOTO);
//$('.sesuser_nama').text(localStorage.NAMA);
//$('.sesuser_namadpn').text(localStorage.NAMADPN);
//$('.sesapp_appname').text(localStorage.APPNAME);
//$('.sesapp_appver').text(localStorage.APPVER);
//$('.sesapp_appyear').text(localStorage.APPYEAR);
//$('.sesinst_nminst').text(localStorage.NMINST);
//$('.sesapp_devby').text(localStorage.DEVBY);


/////GET PROPERTY PAGE dari menu yang active
function setPageProp() {
    var url = location.pathname + location.search;
    $('.menuside').each(function () {
        var href = $(this).attr('href');
        var judulhal = $(this).attr('judulhal');
        var menuinfo = $(this).attr('menuifo');
        if (url == href.replace("..", "")) {
            $('.judulhal').html(judulhal);
            if (menuinfo !== "null") {
                $('.menuinfo_div').removeClass('d-none');
                $('.menuinfo').html(menuinfo);
            }
            
            document.title = judulhal;
            var breadcrumb = location.pathname.split("/");
            var html = "";
            //console.log(breadcrumb);
            for (var i = 0; i < breadcrumb.length; i++) {
                if (breadcrumb[i] !== "") {
                    if ([i] != breadcrumb.length - 1) {
                        html += '<li><a href="javascript:void(0)">' + breadcrumb[i] + '</a></li>';
                    }
                    else {
                        html += '<li class="active">' + breadcrumb[i] + '</li>';
                    }
                }
            }
            $('.breadcrumb').html(html);
        }
    })
}

/////LOAD CONTENT DYNAMIC
function loadContent(targetUrl) {
    NProgress.configure({ showSpinner: false }, { ease: 'ease', speed: 1000 });
   
    //setTimeout(function () { $('.preloader2').removeClass('d-none') }, 50);
    NProgress.start();
    $("#dynamic").load("../Page/" + targetUrl.replace("../", ""), function (response, status, xhr) {
        if (status == "success") {
            $('#box_preview,#error_load').addClass('hidden');
            //$('#dynamic,#error_load').empty().addClass('d-none');
            //setTimeout(function () { $('.preloader2').addClass('d-none') }, 300),
                setPageProp(), setActivemenu(),
                setTimeout(function () { $('#dynamic').removeClass('d-none') }, 400);
                NProgress.done();
                if (localStorage.UNIT === 'null' || typeof localStorage.UNIT == undefined) {
                    checkver();
                }
                
                ///load scheduler on head
                loadscheduler();
        }
        else {
            var msg = "Mohon Maaf Terjadi Kesalahan saat memuat halaman, segera hubungi Administrator.";
            setTimeout(function () { $('.preloader2').addClass('d-none') }, 100),
                setTimeout(function () {
                $('#box_preview,#dynamic').addClass('d-none'), NProgress.done(),
                $("#error_load").empty().removeClass('d-none').html(msg + "<br><small class='text-danger'>" + xhr.status + " " + xhr.statusText + "</small>")
                }, 200);
        }
    });
    
}

/////LOAD FIRST PAGE
if (location.pathname != "/") {
    loadContent(location.pathname + location.search);
}
else {
    loadContent('Beranda');
}

////LOAD SIDEBAR FIRST
var data = $.parseJSON($('#menu_arr').text());
//loadmenu(data, '#sidebarnav');
function loadmenu(data, element) {
    var sidebarmenu = "";
    for (var i = 0; i < data.length; i++) {
        ////FIND LEVEL 1
        if (data[i].PARENTID === null || data[i].PARENTID === 0) {
            ////FIND HEADER ON LEVEL 1
            if (data[i].URL === null || data[i].URL === "") {
                sidebarmenu += '<li>\
                                    <a href="javascript:void(0)" class="menuside has-arrow waves-effect waves-dark" aria-expanded="false"><i class="' + data[i].IKON + '"></i> <span class="hide-menu">' + data[i].NAMA + '<span></a>\
                                    <ul aria-expanded="false" class="collapse">';
                for (var ii = 0; ii < data.length; ii++) {
                    ////FIND LEVEL 2 
                    if (data[ii].PARENTID === data[i].ID) {
                        if (data[ii].URL === null || data[ii].URL === "") {
                            ////FIND HEADER ON LEVEL 2
                            sidebarmenu += '<li>\
                                                <a href="javascript:void(0)" class="menuside has-arrow waves-effect waves-dark"><i class="' + data[ii].IKON + '"></i> <span class="hide-menu">' + data[ii].NAMA + '<span></a>\
                                                <ul aria-expanded="true" class="collapse in">';

                            for (var iii = 0; iii < data.length; iii++) {
                                ////FIND LEVEL 3
                                if (data[iii].PARENTID === data[ii].ID) {
                                    ////FIND DETAIL ON LEVEL 3
                                    sidebarmenu += '<li>\
                                                        <a class="menuside" id="menu_' + data[iii].ID + '" i="' + data[iii].CREATE + '" u="' + data[iii].UPDATE + '" d="' + data[iii].DELETE + '" judulhal="' + data[iii].JUDULHAL + '"  satunit="' + data[iii].SATUNIT + '" href="../' + data[iii].URL + '">' + data[iii].NAMA + '</a>\
                                                    </li>';
                                }
                            }
                            sidebarmenu += '    </ul>\
                                            </li>'
                        }
                        else {
                            ////FIND DETAIL ON LEVEL 2
                            sidebarmenu += '<li>\
                                                <a id="menu_' + data[ii].ID + '" i="' + data[ii].CREATE + '" u="' + data[ii].UPDATE + '" d="' + data[ii].DELETE + '" judulhal="' + data[ii].JUDULHAL + '"  satunit="' + data[ii].SATUNIT + '" href="../' + data[ii].URL + '" class="waves-effect menuside"><i class="' + data[ii].IKON + '"></i> ' + data[ii].NAMA + '<span class="hide-menu"></span></a>\
                                            </li>';
                        }
                    }
                }
            }
            else {
                ////FIND DETAIL ON LEVEL 1
                sidebarmenu += '<li>\
                                    <a id="menu_' + data[i].ID + '" i="' + data[i].CREATE + '" u="' + data[i].UPDATE + '" d="' + data[i].DELETE + '" judulhal="' + data[i].JUDULHAL + '" satunit="' + data[i].SATUNIT + '" href="../' + data[i].URL + '" class="menuside waves-effect waves-dark"><i class="' + data[i].IKON + '"></i> <span class="hide-menu">' + data[i].NAMA + '</span></a>\
                                </li>';
            }
        }
    }
    $(element).empty();
    $(element).append(sidebarmenu);
}