if (localStorage.i === "1") {
    $('#div_btn_tambah').html('<button id="btn_tambah" class="fcbtn btn btn-rounded btn-outline btn-info btn-1e"><i class="icon-plus"></i> Tambah</button>');
}
else {
    $('#div_btn_tambah').html('');
}

$(document).ready(function () {
    $(".select2").select2({ width: '100%' });
    setTimeout(function () { $('.select2tree').select2tree({ width: '100%' }); }, 20);

    //RESET FORM
    $(".close,#btnbatal").on('click', function () {
        $("#form_modal2").trigger("reset");
        $('#view_div').removeClass('hidden');
        $('#addedit_div').addClass('hidden');
        $('#btn_keluarlangsung').addClass('hidden');
        $('#btnbatal').html('<span><i class="fa fa-times"></i> Batal </span>');
        $('#DT_Table_Detail1 tbody').empty();
        var row = '<tr>n\
                            <td class="hidden"></td>n\
                            <td><select name="IDBRG" class="form-control select2 edit_IDBRG edit_IDBRGnew" required data-error="Mohon isi atau pilih field ini"></select></td>n\
                            <td><input name= "JUMLAH" id= "" type= "text" class="form-control edit_JUMLAH"></td>n\
                            <td><input id="" type="text" class="form-control edit_SATUAN" disabled></td>n\
                            <td><input name="HARGASAT" id="" type="text" class="form-control edit_HARGASAT currency text-right"></td>n\
                            <td><input id="" type="text" class="form-control edit_JUMLAHHARGA currency text-right" disabled></td>n\
                            <td><textarea name="KET" id="edit_KET" type="text" class="form-control edit_KET"></textarea></td>n\
                            <td><i></i></td>n\
                       </tr>';
        row += '<tr>\
                            <td style="text-align:center;" colspan="4"><h3> JUMLAH TOTAL HARGA </h3></td>\
                            <<td><input type="text" class="form-control currency text-right" id="TOTHARGADET" disabled></input></td>\
                            <td colspan="2"></td>\
                        </tr>'
        row += '<tr>\
                            <td style="text-align:center;" colspan="4"><h3> BANYAKNYA ITEM BARANG </h3></td>\
                            <td><h3 id="TOTBRGDET"></h3></td>\
                            <td colspan="2"></td>\
                        </tr>'
        $('#DT_Table_Detail1 tbody').append(row);
        getddbarang('.edit_IDBRG');
        getsatuan(); getjumlahharga();


    });


    ////DT remember page
    function rememberpage() {
        $('.paginate_button').on('click', function () {
            localStorage.lastpage = $(this).text();
        })
    }

    ////CRUD checkbox
    function checkbox() {
        $('.checklist').iCheck({
            checkboxClass: 'icheckbox_flat-red'
        });
        $('.checklistAll').iCheck({
            checkboxClass: 'icheckbox_flat-red'
        });

        $(".checklistAll").on('ifChecked', function () {
            $("input:checkbox.checklist").iCheck('check');
        });

        $(".checklistAll").on('ifUnchecked', function () {
            $("input:checkbox.checklist").iCheck('uncheck');
        });

        $(".checklist").on('ifChanged', function () {
            var countcheck = $('#DT_Table').find('tbody').find('input:checkbox:checked').length;
            $('#countcheck').text(countcheck);
            if (this.checked) {
                $("#aksicheck").slideDown("2000", function () {
                    $("#aksicheck").removeClass('hidden');
                });
            }
            else if ($(":checkbox:checked").length === 0) {
                $("#aksicheck").fadeOut("700", function () {
                    $("#aksicheck").addClass('hidden');
                });
            }
        });
    }


    //$.each(CRUDFilter, function (index, value) {
    //    localStorage.setItem(value, "");
    //    //DTfilter[value] = localStorage.getItem(value);
    //});

    var DTcolumn = [];
    DTcolumn.push({ data: "ID", name: "ID", className: "hidden DT_ROWID" });
    DTcolumn.push({ data: null, defaultContent: checkd, "className": "text-center", "title": checkdall, orderable: false, "width": "5%" });
    $.each(read_column, function (index, value) {
        DTcolumn.push({
            data: value.split('=')[0],
            name: value.split('=')[0],
            title: (value.split('=')[1] === undefined) ? value.split('=')[0] : value.split('=')[1]
        });
    });
    DTcolumn.push({ "data": null, defaultContent: btnup + "&nbsp;" + btnde, "className": "text-center", orderable: false, "title": "Aksi", "width": "10%" });


    Read();
    Create();


    ////////////////////////////////////////////////////////READ BEGIN////////////////////////////////////////////////////////
    function Read() {
        ////////DATATABLE USER PARAM



        ////////DATATABLE INITIALISATION
        table = $('#DT_Table').DataTable({
            "responsive": true, "processing": true, "serverSide": true, "filter": true, "bInfo": true, "sPaginationType": "simple_numbers", "paging": true,
            "fixedHeader": { headerOffset: 10 }, "pageLength": 5, "deferLoading": 0,
            "ajax": {
                "url": "../CRUD/R_DataTables",
                "type": "POST",
                "data": function (data) {
                    data.t = $.cookie('t');
                    data.SP = CRUDSP;
                    $.each(CRUDFilter, function (index, value) {
                        data[value] = localStorage.getItem(value);
                    });
                },
                "datatype": "json"
            },
            "language": {
                "sProcessing": "<span class='fa fa-spin fa-gear fa-2x'></span>",
                "sLengthMenu": "Tampilkan _MENU_ " + unit,
                "sZeroRecords": "Opps, Tidak ditemukan " + unit + " satupun yang sesuai dengan pencarian/filter kamu",
                "sInfo": "Menampilkan _START_-_END_ dari _TOTAL_ " + unit,
                "sInfoEmpty": "Menampilkan 0-0 dari 0 " + unit,
                "sSearch": "Cari " + unit + ": ",
                "sInfoFiltered": "(disaring dari _MAX_ " + unit + " keseluruhan)",
                "oPaginate": {
                    "sFirst": "Awal",
                    "sPrevious": '<i class="fa fa-angle-left">',
                    "sNext": '<i class="fa fa-angle-right">',
                    "sLast": "Akhir"
                }
            },
            "columns": DTcolumn,
            "columnDefs": [
                {
                    "targets": [0],
                    "searchable": false,
                    "orderable": false,
                    "createdCell": function (td, cellData, rowData, row, col) {
                        $(td).attr("id", row.ID);
                    }
                },
            ],
            "lengthMenu": [[5, 10, 50, 100], ['5', '20', '50', '200']],
            initComplete: function () {
                setTimeout(function () {
                    table.page(parseInt(localStorage.lastpage) - 1).draw('page');
                }, 10);
            }
        });

        ////////DATATABLE SEARCH
        function DT_search() {
            $('#DT_search').on('paste keyup', function () {
                if ($(this).val().length > 2) {
                    table.search($(this).val()).draw();
                }
                if ($(this).val().length === 0) {
                    table.search("").draw();
                }
            });
        }

        ///////DATATABLE PAGE LIMIT
        function DT_limitpage() {
            $('.DT_limitpage').append($('#DT_Table_length'));
            $('.DT_limitpage').on('change', function () {
                table.page.len($(this).val()).draw();
            });
        }

        DT_draw();
        DT_search();
        DT_limitpage();


        $.each(CRUDFilter, function (index, value) {
            $('#DT_filter' + value).on('change', function () {
                localStorage.setItem(value, $(this).val());
                table.draw();
            });
        });

        function DT_draw() {
            ////////DATATABLE DRAW CONDITION
            $('#DT_Table').on('draw.dt', function () {
                rememberpage();
                Update();
                Delete();
                checkbox();

                $(".checklistAll").prop('checked', false);
                $("input:checkbox.checklist").prop('checked', false).trigger('change');
                $("#aksicheck").addClass('hidden');
            });
        }
        /////////////////////////////DATATABLES END////////////////////////////////////
    }

    ////////////////////////////////////////////////////////READ END////////////////////////////////////////////////////////


    function getsatuan() {
        $('.edit_IDBRG').on('change', function () {
            var satuanX = $(this).find(':selected').attr('satuan');
            $(this).parent().parent().find('.edit_SATUAN').val(satuanX);

        })
    }

    function hapus_det() {
        $(".hapus_det").on('click', function () {
            $(this).parent().remove();
        })
    }

    function hapusedit_det() {
        $(".hapus_det").on('click', function () {
            var ID = $(this).siblings(".IDDET").text().trim();
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
                    $(this).parent().remove();
                    $.ajax({
                        type: "POST",
                        url: '../CRUD/D_Table?tb=' + CRUDtbl_det + '&ID=' + ID + "&t=" + $.cookie('t'),
                        success: function (response) {
                            if (response === "OK") {
                                Command: toastr["success"]("Data " + unit_det + " telah dihapus", "OK !")
                            } else {
                                Command: toastr["error"]("Data  " + unit_det + " <strong> GAGAL </strong> dihapus", "Error !")
                            }
                        }
                    });
                }
            })
        })
    }

    function getjumlahharga() {
        $('.edit_JUMLAH,.edit_HARGASAT').on('paste keyup', function () {
            var edit_JUMLAH = $(this).parent().parent().find('.edit_JUMLAH').val();
            var edit_HARGASAT = $(this).parent().parent().find('.edit_HARGASAT').maskMoney('unmasked')[0];
            var jmlharga = edit_JUMLAH * edit_HARGASAT;
            $(this).parent().parent().find('.edit_JUMLAHHARGA').maskMoney('mask', jmlharga);
            $('.currency').maskMoney({ prefix: 'Rp. ', precision: 2, affixesStay: false }).maskMoney('mask');
            
        })
    }

    function tambah_det() {
        $("#btn_tambah_det").on('click', function () {
            $('#DT_Table_Detail1 tbody').find('.edit_IDBRG').removeClass('edit_IDBRGnew');
            var row = '<tr>n\
                            <td class="hidden IDDET"></td>n\
                            <td><select name="IDBRG" class="form-control select2 edit_IDBRG edit_IDBRGnew" required data-error="Mohon isi atau pilih field ini"></select></td>n\
                            <td><input name= "JUMLAH" id= "" type= "text" class="form-control edit_JUMLAH"></td>n\
                            <td><input id="" type="text" class="form-control edit_SATUAN" disabled></td>n\
                            <td><input name="HARGASAT" id="" type="text" class="form-control edit_HARGASAT currency text-right"></td>n\
                            <td><input id="" type="text" class="form-control edit_JUMLAHHARGA currency text-right" disabled></td>n\
                            <td><textarea name="KET" id="edit_KET" type="text" class="form-control edit_KET"></textarea></td>n\
                            <td style="cursor:pointer;" class="hapus_det"><i class="fa fa-minus-circle btn btn-danger"></i></td>n\
                       </tr>';
            row += '<tr>\
                            <td style="text-align:center;" colspan="4"><h3> JUMLAH TOTAL HARGA </h3></td>\
                            <td><input type="text" class="form-control currency text-right" id="TOTHARGADET" disabled></input></td>\
                            <td colspan="2"></td>\
                        </tr>'
            row += '<tr>\
                            <td style="text-align:center;" colspan="4"><h3> BANYAKNYA ITEM BARANG </h3></td>\
                            <td><h3 id="TOTBRGDET"></h3></td>\
                            <td colspan="2"></td>\
                        </tr>'
            $('#DT_Table_Detail1 tbody').append(row);
            getddbarang('.edit_IDBRGnew');
            getsatuan(); getjumlahharga();
            hapus_det();

        })
    }


    ////////////////////////////////////////////////////////CREATE BEGIN////////////////////////////////////////////////////////

    function Create() {
        $("#btn_tambah").on('click', function () {
            $('#view_div').addClass('hidden');
            $('#addedit_div').removeClass('hidden');
            $(".JudulForm").text("Tambah " + unit);
            var form = $('#form_modal2');
            form.attr("action", "../CRUD/C_Table");
            $('#btn_ubahdata').addClass('hidden');
            $('#btn_simpandatabaru').removeClass('hidden');
            $('.select2').trigger('change');
            tambah_det();
            hapus_det();
            getjumlahharga();
            getsatuan();

        });
    }

    //SIMPAN DATA BARU
    $("#btn_simpandatabaru").on('click', function (e) {
        var form = $('#form_modal2');
        var validator = form.data("bs.validator");
        validator.validate();
        if (!validator.hasErrors()) {
            var queryform = form.serialize() + '&tb=' + CRUDtbl + "&t=" + $.cookie('t');
            ///////
            $.ajax({
                type: "POST",
                url: form.attr('action') + "?" + queryform,
                dataType: 'json',
                success: function (response) {

                    var countdetok = 0;
                    var countdetnotok = 0;
                    ////////
                    $.ajax({
                        type: "GET",
                        url: "../CRUD/R_Proc?SP=GETID&TB=" + CRUDtbl + "&t=" + $.cookie('t'),
                        dataType: 'json',
                        success: function (response2) {
                            var dataid = $.parseJSON(response2);
                            ///////
                            //var formdet = $('#form_modal2det');

                            if (response === "OK") {
                                $('#DT_Table_Detail1 > tbody > tr').each(function () {
                                    var IDBRG = $(this).find('.edit_IDBRG').val();
                                    var JUMLAH = $(this).find('.edit_JUMLAH').val();
                                    var HARGASAT = $(this).find('.edit_HARGASAT').maskMoney('unmasked')[0];
                                    var KET = $(this).find('.edit_KET').val();
                                    var querystr = 'IDBRG=' + IDBRG + '&JUMLAH=' + JUMLAH + '&HARGASAT=' + HARGASAT + '&KET=' + KET;
                                    $.ajax({
                                        type: "POST",
                                        url: "../CRUD/C_Table?IDBA=" + dataid[0].ID + "&" + querystr + '&tb=' + CRUDtbl_det,
                                        dataType: 'json',
                                        success: function (response3) {
                                            if (response === "OK") {
                                                countdetok++;
                                            } else {
                                                countdetnotok++;
                                            }
                                        }
                                    });
                                    //console.log(querystr);
                                })

                                Command: toastr["success"]("Data Berhasil ditambahkan ke database, " + countdetok + " Data Rincian " + unit_det + " Berhasil ditambahkan ke database", "Berhasil !")
                                table.page(parseInt(localStorage.lastpage) - 1).draw('page');
                                $('.close').click();
                                //$('#btnbatal').html('<span><i class="fa fa-reply"></i> Kembali </span>');
                            } else {
                                Command: toastr["error"]("Data <strong> GAGAL </strong> ditambahkan ke database", "Error !")
                                $('.close').click();
                                //$('#btnbatal').html('<span><i class="fa fa-reply"></i> Kembali </span>');
                            }


                        }
                    });
                    ///////


                }
            });
            ///////

        }


    });
    ////////////////////////////////////////////////////////CREATE END////////////////////////////////////////////////////////


    function Detail(ID) {
        $.ajax({
            type: "GET",
            url: "../CRUD/R_Proc",
            data: 'SP=' + CRUDtbl_det + '_DET_BYID&ID=' + ID + "&t=" + $.cookie('t'),
            dataType: 'json',
            success: function (response) {
                var data = $.parseJSON(response);
                var idbrg = [];
                $('#DT_Table_Detail1 tbody').empty();
                for (var i = 0; i < data.length; i++) {
                    var html = "";

                    idbrg.push(data[i].ID + "=" + data[i].IDBRG);
                    html += '<tr>n\
                            <td class="hidden IDDET">'+ data[i].ID + '</td>n\
                            <td><select name="IDBRG" id="edit_IDBRG'+ data[i].ID + '" class="form-control select2 edit_IDBRG" required data-error="Mohon isi atau pilih field ini"></select></td>n\
                            <td><input value=' + data[i].JUMLAH + ' name= "JUMLAH" id= "" type= "text" class="form-control edit_JUMLAH"></td>n\
                            <td class="hidden edit_JUMLAHKELUAR">' + data[i].JUMLAHKELUAR + '</td>n\
                            <td><input id="" type="text" class="form-control edit_SATUAN" disabled></td>n\
                            <td><input value=' + data[i].HARGASAT + ' name="HARGASAT" id="" type="text" class="form-control edit_HARGASAT currency text-right"></td>n\
                            <td><input id="" type="text" class="form-control edit_JUMLAHHARGA currency text-right" disabled></td>n\
                            <td><textarea name="KET" id="edit_KET" type="text" class="form-control edit_KET">' + data[i].KET + ' </textarea></td>n\
                            <td style="cursor:pointer;" class="hapus_det"><i class="fa fa-minus-circle btn btn-danger"></i></td>n\
                       </tr>';
                    $('#DT_Table_Detail1 tbody').append(html);
                }
                var row = '<tr>n\
                            <td class="hidden IDDET"></td>n\
                            <td><select name="IDBRG" class="form-control select2 edit_IDBRG edit_IDBRGnew" required data-error="Mohon isi atau pilih field ini"></select></td>n\
                            <td><input name= "JUMLAH" id= "" type= "text" class="form-control edit_JUMLAH"></td>n\
                            <td class="hidden edit_JUMLAHKELUAR"></td>n\
                            <td><input id="" type="text" class="form-control edit_SATUAN" disabled></td>n\
                            <td><input name="HARGASAT" id="" type="text" class="form-control edit_HARGASAT  currency text-right"></td>n\
                            <td><input id="" type="text" class="form-control edit_JUMLAHHARGA  currency text-right" disabled></td>n\
                            <td><textarea name="KET" id="edit_KET" type="text" class="form-control edit_KET"></textarea></td>n\
                            <td style="cursor:pointer;" class="hapus_det"><i class="fa fa-minus-circle btn btn-danger"></i></td>n\
                       </tr>';

                row += '<tr>\
                            <td style="text-align:center;" colspan="4"><h3> JUMLAH TOTAL HARGA </h3></td>\
                            <td><input type="text" class="form-control currency text-right" id="TOTHARGADET" disabled></input></td>\
                            <td colspan="2"></td>\
                        </tr>'
                row += '<tr>\
                            <td style="text-align:center;" colspan="4"><h3> BANYAKNYA ITEM BARANG </h3></td>\
                            <td><h3 id="TOTBRGDET"></h3></td>\
                            <td colspan="2"></td>\
                        </tr>'
                $('#DT_Table_Detail1 tbody').append(row);

                getddbarang('.edit_IDBRG');
                getsatuan(); getjumlahharga();

                $.each(idbrg, function (index, value) {
                    setTimeout(function () { $('#edit_IDBRG' + value.split('=')[0]).val(value.split('=')[1]).trigger('change'); }, 20);
                });

                setTimeout(function () { $('.edit_JUMLAH').keyup(); $('.currency').maskMoney({ prefix: 'Rp. ', precision: 2, affixesStay: false }).maskMoney('mask'); }, 30);
                tambah_det();
                hapusedit_det();
                setTimeout(function () { tothargadet(); }, 50);

                $('.edit_JUMLAHHARGA').on('change', function () {
                    tothargadet();
                });
                

            }
        });



    }

    function tothargadet() {
        var sum = 0;
        $('.edit_JUMLAHHARGA').each(function () {
            sum += parseInt($(this).maskMoney('unmasked')[0]);
        });
       $('#TOTHARGADET').maskMoney('mask', sum);
    }


    ////////////////////////////////////////////////////////UPDATE BEGIN////////////////////////////////////////////////////////
    function Update() {
        $('.btn_edit').on('click', function () {
            var ID = $(this).parent().siblings(".DT_ROWID").text().trim();
            $.ajax({
                type: "GET",
                url: '../CRUD/R_Proc',
                data: 'SP=' + CRUDtbl + '_DET_BYID&ID=' + ID + "&t=" + $.cookie('t'),
                success: function (response) {
                    var data = $.parseJSON(response);
                    for (var i = 0; i < chained_el.length; i++) {
                        $.each(data[0], function (index, value) {
                            if ('#edit_' + index !== chained_el[i]) {
                                $('#edit_' + index).val(value).trigger('change');
                            }
                            else {
                                setTimeout(function () { $('#edit_' + index).val(value).trigger('change'); }, 100);
                            }
                        });

                    }
                }
            });
            $('#view_div').addClass('hidden');
            $('#addedit_div').removeClass('hidden');
            $(".JudulForm").text("Ubah Data " + unit);
            $('#btn_simpandatabaru').addClass('hidden');
            $('#btn_ubahdata').removeClass('hidden');
            $('#btn_keluarlangsung').removeClass('hidden');
            Detail(ID);
            KeluarLangsung();
        });
    }
    function KeluarLangsung() {
        $('#btn_keluarlangsung').on('click', function () {
            var noba = $('#edit_NOBAKELUAR').val() === '' ? $('#edit_NOBATERIMA').val() : $('#edit_NOBAKELUAR').val();
            $('#directout_NOBAKELUAR').val(noba);
            $('#directout_TGLBAKELUAR').val($('#edit_TGLBAKELUAR').val());
            $('#directout_NMUNIT').text($('#edit_UNITKEY').text());
            $('#directout_NMREK').text($('#edit_IDREK').find(':selected').text());
            $('#directout_NMKEG').text($('#edit_IDKEG').find(':selected').text());
            $('#directout_NMPEG').text($('#edit_IDPEG').find(':selected').text());
            $('#directout_KET').text($('#edit_KET').val());

            $('#directout_table tbody').empty();

            $("#DT_Table_Detail1 tr:not(:last-child)").each(function () {
                var row = '';
                row += '<tr>\
                            <td class="hidden directout_IDDET">'+ $(this).find('.IDDET').text() + '</td>\
                            <td class="directout_NMBRG">'+ $(this).find('.edit_IDBRG').find(':selected').text() + '</td>\
                            <td class="directout_SATUAN">'+ $(this).find('.edit_SATUAN').val() + '</td>\
                            <td style="text-align:center;" class="directout_JUMLAH">'+ $(this).find('.edit_JUMLAH').val() + '</td>\
                            <td class="">\
                                <input type="text" value="'+ $(this).find('.edit_JUMLAHKELUAR').text() + '" class="form-control directout_JUMLAHKELUAR touchspin" data-bts-button-down-class="btn btn-default btn-outline" data-bts-button-up-class="btn btn-default btn-outline">\
                            </td>\
                            <td class="directout_KET">'+ $(this).find('.edit_KET').text() + '</td>\
                            </tr>';
                $('#directout_table tbody').append(row);
            });
        });
    }


    $('#btn_simpandatabaru_directout').on('click', function () {
        var ID = $("#edit_ID").val();
        var form = $('#form_directout');
        var validator = form.data("bs.validator");
        validator.validate();
        if (!validator.hasErrors()) {
            var queryform = form.serialize() + "&tb=" + CRUDtbl + "&pk=ID&ID=" + ID + "&t=" + $.cookie('t');
            $.ajax({
                type: "POST",
                url: '../CRUD/U_Table?' + queryform,
                dataType: 'json',
                success: function (response) {
                    if (response === "OK") {
                        $('#directout_table > tbody > tr').each(function () {
                            var IDDET = $(this).find('.directout_IDDET').text();
                            var JUMLAHKELUAR = $(this).find('.directout_JUMLAHKELUAR').val();
                            //console.log(IDDET);
                            var querystr = 'ID=' + IDDET + '&JUMLAHKELUAR=' + JUMLAHKELUAR + "&t=" + $.cookie('t');
                            $.ajax({
                                type: "POST",
                                url: "../CRUD/U_Table?tb=" + CRUDtbl_det + "&pk=ID&" + querystr,
                                dataType: 'json',
                                success: function (response3) {
                                    //if (response == "OK") {
                                    //    countdetok++;
                                    //} else {
                                    //    countdetnotok++;
                                    //}
                                }
                            });
                        })

                        Command: toastr["success"]("Berhasil Diubah", "Berhasil !")
                        table.page(parseInt(localStorage.lastpage) - 1).draw('page');
                        $('.close2').click();
                        $('.close').click();
                    } else {
                        Command: toastr["error"]("Data <strong> GAGAL </strong> diubah", "Error !")
                    }



                }
            });
        }
    })

    //UBAH DATA KE DATABASE
    $("#btn_ubahdata").on('click', function () {
        var ID = $("#edit_ID").val();
        var form = $('#form_modal2');
        var validator = form.data("bs.validator");
        validator.validate();
        if (!validator.hasErrors()) {
            var queryform = form.serialize() + "&tb=" + CRUDtbl + "&pk=ID&ID=" + ID + "&t=" + $.cookie('t');
            $.ajax({
                type: "POST",
                url: '../CRUD/U_Table?' + queryform,
                dataType: 'json',
                success: function (response) {
                    if (response === "OK") {

                        $('#DT_Table_Detail1 > tbody > tr').each(function () {
                            var IDDET = $(this).find('.IDDET').text();
                            var IDBRG = $(this).find('.edit_IDBRG').val();
                            var JUMLAH = $(this).find('.edit_JUMLAH').val();
                            var HARGASAT = $(this).find('.edit_HARGASAT').maskMoney('unmasked')[0];
                            var KET = $(this).find('.edit_KET').val();
                            //console.log(IDDET);
                            var querystr = 'ID=' + IDDET + '&IDBRG=' + IDBRG + '&JUMLAH=' + JUMLAH + '&HARGASAT=' + HARGASAT + '&KET=' + KET;
                            $.ajax({
                                type: "get",
                                url: "../CRUD/R_Proc?SP=UPSERT_BA_DET&IDBA=" + ID + "&" + querystr + "&t=" + $.cookie('t'),
                                dataType: 'json',
                                success: function (response3) {
                                    if (response === "OK") {
                                        countdetok++;
                                    } else {
                                        countdetnotok++;
                                    }
                                }
                            });
                        })

                        Command: toastr["success"]("Berhasil Diubah", "Berhasil !")
                        table.page(parseInt(localStorage.lastpage) - 1).draw('page');
                        $('#btnbatal').html('<span><i class="fa fa-reply"></i> Kembali </span>');
                        //$('.close').click();
                    } else {
                        Command: toastr["error"]("Data <strong> GAGAL </strong> diubah", "Error !")
                    }



                }
            });
        }


    });
    ////////////////////////////////////////////////////////UPDATE END////////////////////////////////////////////////////////

    ////////////////////////////////////////////////////////DELETE BEGIN////////////////////////////////////////////////////////
    function Delete() {
        //var ID;
        ////SINGLE DELETE
        $('.btn_hapus').on('click', function () {
            var ID = $(this).parent().siblings(".DT_ROWID").text().trim();
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
                        url: '../CRUD/D_Table?tb=' + CRUDtbl + '&ID=' + ID + "&t=" + $.cookie('t'),
                        success: function (response) {
                            if (response === "OK") {
                                Command: toastr["success"]("Data Barang telah dihapus", "OK !")
                                table.page(1).draw('page');

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

            $('#DT_Table').find('tbody').find('.checked').each(function () {
                id.push($(this).parent().siblings('.DT_ROWID').text().trim());
            });
            console.log(id);

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
                        data: 'pk=ID&id=' + id + '&tb=' + CRUDtbl + "&t=" + $.cookie('t'),
                        success: function (response) {
                            Command: toastr["success"](response, "OK !")
                            table.page(1).draw('page');
                            $(this).addClass('hidden');
                        }
                    });
                }
            })

        });

    }
    ////////////////////////////////////////////////////////DELETE END////////////////////////////////////////////////////////
});