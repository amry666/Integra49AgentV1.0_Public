if (localStorage.i == "1") {
    $('#div_btn_tambah').html('<button id="btn_tambah" data-toggle="modal" data-target="#ModalAddUpdate" class="fcbtn btn btn-rounded btn-outline btn-info btn-1e"><i class="icon-plus"></i> Tambah</button>');
    var btnsub_nest = '<button type="button" data-toggle="modal" data-target="#ModalAddUpdate" class="btn_addsub btn btn-info waves-effect btn_nest_ubah float-right"><span><i class="zmdi zmdi-format-valign-bottom zmdi-hc-fw"></i></span></button>';
}
else {
    $('#div_btn_tambah').html('');
    var btnsub_nest = '';
}


$(document).ready(function () {
    GetGlobalData();/////CALL GLOBAL FUNCTION YANG MENGHASILKAN VARIABLE GlobalData
    Read();

    $(".select2").select2({ width: '100%' });
    $('.select2tree').select2tree({ width: '100%' });

    function expandclick() {
        $('.dd-expand').on('click', function () {
            localStorage.setItem("lastexpand" + unit, $(this).parent().attr('data-id'));
        })
    }

    var GlobalData;
    function GetGlobalData() {
        $.ajax
            ({
                url: "../CRUD/R_Proc",
                type: "GET",
                data: "sp=" + CRUDSP + "&sdlvl=" + maxlvl + "&t=" + $.cookie('t'),
                async: false,
                dataType: 'json',
                success: function (response) {
                    GlobalData = $.parseJSON(response);
                }
            })
    }

    ////////////////////////////////////////////////////////READ BEGIN////////////////////////////////////////////////////////
    function Read() {
        var data = GlobalData;
        var endMenu = getMenu(0);

        function getMenu(parentID) {
            return data.filter(function (node) { return (node.PARENTID === parentID); }).sort(function (a, b) { return a.URUTAN > b.URUTAN }).map(function (node) {
                var exists = data.some(function (childNode) { return childNode.PARENTID === node.ID; });
                var name = "";
                var subMenu = (exists) ? '<ol class="dd-list">' + getMenu(node.ID).join('') + '</ol>' : "";
                var li = "<li style='cursor: pointer;' class='dd-item dd3-item' data-id='" + node.ID + "'>";

                if (localStorage.d == "1") {
                    name += "<input type='checkbox' data-checkbox='icheckbox_flat-red' class='checklist check' style='' value='" + node.ID + "' name='check" + node.ID + "'>";
                }

                name +=
                    "<div class='dd-handle dd3-handle'></div>" +
                    "<div class='dd3-content'>" +
                    "<span " +
                    "data-ID='" + node.ID + "'" +
                    "data-PARENTID='" + node.PARENTID + "'" +
                    "data-NAMA='" + node.NAMA + "'" +
                    "data-KODE='" + node.KODE + "'" +
                    "data-LEVEL='" + node.LEVEL + "'" +
                    "class='hidden'></span>" + node.KODE + ' ' + node.NAMA;

                name += btnde_nest + btnup_nest;
                if (node.LEVEL < maxlvl) { name += btnsub_nest }
                name += "</div>";
                return li + name + subMenu + '</li>';
            });
        }

        $(".dd").empty();
        $('.dd').html('<ol class="dd-list">' + endMenu.join('') + '</ol>');
        $('.dd').nestable('destroy');
        $(".dd").nestable({
            maxDepth: maxlvl,
            collapsedClass: 'dd-collapsed'
        }).nestable('collapseAll');

        Create();
        CreateSub();
        LoadDDTreeUnit();
        Update();
        Delete();
        expandclick();
        checkbox_tree();

        $('.dd-item[data-id="' + localStorage['lastexpand' + unit] + '"]').removeClass('dd-collapsed');
        $('.dd-item[data-id="' + localStorage['lastexpand' + unit] + '"]').parent().parent().removeClass('dd-collapsed');
        $('.dd-item[data-id="' + localStorage['lastexpand' + unit] + '"]').parent().parent().parent().parent().removeClass('dd-collapsed');
        $('.dd-item[data-id="' + localStorage['lastexpand' + unit] + '"]').parent().parent().parent().parent().parent().parent().removeClass('dd-collapsed');
    }
    ////////////////////////////////////////////////////////READ END////////////////////////////////////////////////////////





    ////////////////////////////////////////////////////////CREATE BEGIN////////////////////////////////////////////////////////
    function Create() {
        $("#btn_tambah").on('click', function () {
            $(".JudulForm").text("Tambah " + unit);
            var form = $('#form_modal2');
            form.attr("action", "../CRUD/C_Table");
            $('#btn_ubahdata').addClass('hidden');
            $('#btn_simpandatabaru').removeClass('hidden');
            $("#edit_PARENTID").val('').trigger('change');
            getlevelunit();
        });
    }

    function CreateSub() {
        $(".btn_addsub").on('click', function () {
            var ID = $(this).siblings('span').attr('data-ID');
            var KODE = $(this).siblings('span').attr('data-KODE');
            var NAMA = $(this).siblings('span').attr('data-NAMA');
            $('#edit_ID').val(ID);
            $(".JudulForm").html("Tambah Sub untuk <br><h5><b>" + KODE + " " + NAMA + "</b></h5>");
            var form = $('#form_modal2');
            form.attr("action", "../CRUD/C_Table");
            $('#btn_ubahdata').addClass('hidden');
            $('#btn_simpandatabaru').removeClass('hidden');
            setTimeout(function () { $("#edit_PARENTID").val(ID).trigger('change'); }, 40);
            setTimeout(getlevelunit(), 70);
            $('#edit_PARENTID').parent().parent().addClass('hidden');
        });
    }

    //SIMPAN DATA BARU
    $("#btn_simpandatabaru").on('click', function () {
        var ID = $('#edit_ID').val();
        var form = $('#form_modal2');
        var validator = form.data("bs.validator");
        validator.validate();
        if (!validator.hasErrors()) {
            var queryform = form.serialize() + '&tb=' + CRUDtbl + "&t=" + $.cookie('t');
            $.ajax({
                type: "POST",
                url: form.attr('action') + "?" + queryform,
                dataType: 'json',
                success: function (response) {
                    $('.close').click();
                    if (response == "OK") {
                        Command: toastr["success"]("Berhasil ditambahkan ke database", "Berhasil !");
                        GetGlobalData();
                        //LoadDDTreeUnit();
                        localStorage.setItem("lastexpand" + unit, ID);
                        Read();
                        console.log(localStorage.lastexpandRekening);
                    } else {
                        Command: toastr["error"]("Data <strong> GAGAL </strong> ditambahkan ke database", "Error !")
                    }
                }
            });
        }
    });
    ////////////////////////////////////////////////////////CREATE END////////////////////////////////////////////////////////


    ////////////////////////////////////////////////////////UPDATE BEGIN////////////////////////////////////////////////////////
    function Update() {
        $('.btn_edit').on('click', function () {
            var ID = $(this).siblings('span').attr('data-ID');
            var NAMA = $(this).siblings('span').attr('data-NAMA');
            var PARENTID = $(this).siblings('span').attr('data-PARENTID');
            var KODE = $(this).siblings('span').attr('data-KODE');
            var LEVEL = $(this).siblings('span').attr('data-LEVEL');

            $('#edit_ID').val(ID);
            $('#edit_NAMA').val(NAMA);
            $('#edit_PARENTID').val(PARENTID).trigger('change');
            $('#edit_KODE').val(KODE);
            $('#edit_LEVEL').val(LEVEL);

            $(".JudulForm").text("Ubah Data " + unit);
            $('#btn_simpandatabaru').addClass('hidden');
            $('#btn_ubahdata').removeClass('hidden');

            getlevelunit();
        });
    }


    //UBAH DATA KE DATABASE
    $("#btn_ubahdata").on('click', function () {
        var ID = $('#edit_ID').val();
        var form = $('#form_modal2');
        var validator = form.data("bs.validator");
        validator.validate();

        if (!validator.hasErrors()) {
            var queryform = form.serialize() + '&tb=' + CRUDtbl + '&pk=' + CRUDPk + '&' + CRUDPk + '=' + ID + "&t=" + $.cookie('t');
            $.ajax({
                type: "POST",
                url: '../CRUD/U_Table?' + queryform,
                dataType: 'json',
                success: function (response) {
                    if (response == "OK") {
                        $('.close').click();
                        Command: toastr["success"]("Berhasil Diubah", "Berhasil !")
                        GetGlobalData();
                        localStorage.setItem("lastexpand" + unit, ID);
                        Read();
                        //LoadDDTreeUnit();

                    } else {
                        Command: toastr["error"]("Data <strong> GAGAL </strong> diubah", "Error !")
                    }
                }
            });
        }
    });

    /////////////DRAG N DROP KATEGORI
    $(".dd").on('change', function () {
        var product_data = $(this).nestable('toArray');

        var json = JSON.stringify(product_data);
        var data = $.parseJSON(json);

        var countdataOK = 0;
        var countdataNOTOK = 0;

        for (var i = 0; i < data.length; i++) {
            //console.log('../CRUD/U_Table?tb=DAFTUNIT&pk=UNITKEY&UNITKEY=' + data[i].id + '&urutan=' + [i] + '&PARENTID=' + data[i].parent_id + '&LEVEL=' + data[i].depth);
            $.ajax({
                type: "POST",
                url: '../CRUD/U_Table?tb=' + CRUDtbl + '&pk=' + CRUDPk + '&' + CRUDPk + '=' + data[i].id + '&urutan=' + [i] + '&PARENTID=' + data[i].parent_id + '&LEVEL=' + data[i].depth + "&t=" + $.cookie('t'),
                dataType: 'json',
                success: function (response) {
                    if (response == "OK") {
                        countdataOK += 1;
                    } else {
                        countdataNOTOK += 1;
                    }
                }
            });
        }

        Command: toastr["info"](" data berhasil Diubah, ", "info !")
        setTimeout(GetGlobalData(), 5);
        setTimeout(Read(), 10);

    });
    ////////////////////////////////////////////////////////UPDATE END////////////////////////////////////////////////////////

    ////////////////////////////////////////////////////////DELETE BEGIN////////////////////////////////////////////////////////
    function Delete() {
        ////SINGLE DELETE
        $('.btn_hapus').on('click', function () {
            var id = $(this).siblings('span').attr('data-ID');
            swal({
                title: 'Yakin mau dihapus?',
                text: "Hati-hati kamu gak bisa ngembaliin data ini lagi!",
                type: 'warning',
                showCancelButton: true,
                cancelButtonText: 'Batal',
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Ya, Hapus!'
            }).then((result) => {
                if (result.value) {
                    $.ajax({
                        type: "POST",
                        url: '../CRUD/D_Table?tb=' + CRUDtbl + '&' + CRUDPk + '=' + id + "&t=" + $.cookie('t'),
                        success: function (response) {
                            if (response == "OK") {
                                Command: toastr["success"]("Data Barang telah dihapus", "OK !")
                                GetGlobalData();
                                $('.dd').nestable('remove', id);
                                LoadDDTreeUnit();
                            } else {
                                Command: toastr["error"]("Data Barang <strong> GAGAL </strong> dihapus", "Error !")
                            }
                        }
                    });
                }
            })
        });

        ////MULTI DELETE
        $('#aksicheck').on('click', function () {
            var id = [];
            $(".dd").find('input[type="checkbox"]:checked').each(function () {
                id.push($(this).attr('value'));
            });
            swal({
                title: 'Yakin mau dihapus?',
                text: "Hati-hati kamu gak bisa ngembaliin data ini lagi!",
                type: 'warning',
                showCancelButton: true,
                cancelButtonText: 'Batal',
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Ya, Hapus!'
            }).then((result) => {
                if (result.value) {
                    $.ajax({
                        type: "POST",
                        url: '../CRUD/D_TableMulti',
                        data: 'pk=' + CRUDPk + '&id=' + id + '&tb=' + CRUDtbl + "&t=" + $.cookie('t'),
                        success: function (response) {
                            Command: toastr["success"](response, "OK !")
                            GetGlobalData();
                            for (var i = 0; i < id.length; i++) {
                                $('.dd').nestable('remove', id[i]);
                            }
                            LoadDDTreeUnit();
                            $(this).addClass('hidden');
                        }
                    });
                }
            })
        });
    }
    ////////////////////////////////////////////////////////DELETE END////////////////////////////////////////////////////////

    //FILTER DROPDOWN
    //LoadDDTreeUnit();
    function LoadDDTreeUnit() {
        var data2 = GlobalData;
        var html = "";
        html += "<option value='0' level='0' kode=''>Tanpa Induk</option>";
        for (var x = 0; x < data2.length; x++) {
            html += "<option value='" + data2[x].ID + "' parent='" + data2[x].PARENTID + "' level='" + data2[x].LEVEL + "' kode='" + data2[x].KODE + "'>" + data2[x].KODE + " " + data2[x].NAMA + "</option>";
        }
        $("#edit_PARENTID").empty();
        $("#edit_PARENTID").append(html);
    }


    //RESET FORM
    $(".close,#btnbatal").on('click', function (e) {
        $('#edit_PARENTID').parent().parent().removeClass('hidden');
        $("#form_modal2").trigger("reset");
        $('.select2tree').val('').trigger("change");
    });


    /////expandclick
    function expandclick() {
        $('.dd-expand').on('click', function () {
            localStorage.setItem("lastexpand" + unit, $(this).parent().attr('data-id'));
        })
    }


    /////expand/collapse all
    $('.nestable-menu').on('click', function (e) {
        var target = $(e.target),
            action = target.data('action');
        if (action === 'expand-all') {
            $('.dd').nestable('expandAll');
        }
        if (action === 'collapse-all') {
            $('.dd').nestable('collapseAll');
        }
    });

    //PENCARIAN
    $("#input_carikategori").on('keyup', function () {
        var tr = $('.dd-list li');
        if ($(this).val().length >= 2) {
            $(".dd").nestable('expandAll');
            var noElem = true;
            var val = $.trim(this.value).toLowerCase();
            el = tr.filter(function () {
                return $(this).find('.dd3-content').text().toLowerCase().match(val);
            });
            if (el.length >= 1) { noElem = false; }
            tr.not(el).fadeOut();
            el.fadeIn();
        }
        else {
            $(".dd").nestable('collapseAll');
            tr.fadeIn();
        }
    });

    ///GET LEVEL
    function getlevelunit() {
        $("#edit_PARENTID").on('change', function () {
            var level = $(this).find('option:selected').attr("level");
            var levelnew = parseInt(level) + 1;
            $("#edit_LEVEL").val(levelnew);

            ////get max order
            var id = $(this).val();
            var parent = $(this).find('option[parent="' + id + '"]');
            var max = 1;
            var digit = 0;
            $(parent).each(function () {
                parts = $(this).attr("kode").split("."),
                    last_part = parts[parts.length - 2];
                digit = last_part.length;
                var value = parseInt(last_part) + 1;
                max = (value > max) ? value : max;
            });
            var kdunit = $(this).find('option:selected').attr("kode");
            var ordernew = kdunit + ((max > 10) ? (max.toString() + '.') : ('0' + max.toString() + '.'));
            if (digit === 0) {
                var ordernew = kdunit + ('0' + max.toString() + '.');
            }
            if (digit === 1) {
                var ordernew = kdunit + (max.toString() + '.');
            }
            if (digit === 2) {
                if (max >= 10) {
                    var ordernew = kdunit + (max.toString() + '.');
                }
                else {
                    var ordernew = kdunit + ('0' + max.toString() + '.');
                }
            }
            if (digit === 3) {
                if (max > 100) {
                    var ordernew = kdunit + (max.toString() + '.');
                }
                if (max >= 10 && max <= 100) {
                    var ordernew = kdunit + ('0' + max.toString() + '.');
                }
                else {
                    var ordernew = kdunit + ('00' + max.toString() + '.');
                }
            }

            if ($(this).val() !== null) {
                $("#edit_KODE").val(ordernew);
            }

        });

    }

    function checkbox_tree() {
        ///checkbox
        $('.checklist').iCheck({
            checkboxClass: 'icheckbox_flat-red'
        });
        $('.checklistAll').iCheck({
            checkboxClass: 'icheckbox_flat-red'
        });
        $('.checklist').on('ifChecked', function () {
            $(this).parent().siblings('.dd-list')
                .find("input:checkbox.checklist").iCheck('check');
        });
        $('.checklist').on('ifUnchecked', function () {
            $(this).parent().siblings('.dd-list')
                .find("input:checkbox.checklist").iCheck('uncheck');
        });
        $(".checklist").on('ifChanged', function () {
            var countcheck = $('.dd').find('input:checkbox:checked').length;
            $('#countcheck').text(countcheck);
            if (this.checked) {
                $("#aksicheck").slideDown("2000", function () {
                    $("#aksicheck").removeClass('hidden');
                });
            }
            else if ($(":checkbox:checked").length == 0) {
                $("#aksicheck").fadeOut("700", function () {
                    $("#aksicheck").addClass('hidden');
                });
            }
        });
    }

});