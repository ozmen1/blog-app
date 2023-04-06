$(document).ready(function () {

    $('#categoriesTable').DataTable({

        dom: "<'row'<'col-sm-3'l><'col-sm-6 text-center'B><'col-sm-3'f>>" +
            "<'row'<'col-sm-12'tr>>" +
            "<'row'<'col-sm-5'i><'col-sm-7'p>>",
        buttons: [{
            text: 'Ekle',
            attr: {
                id: 'btnAdd'// id buton click durumu için burada kullanıldı.
            },
            action: function (e, dt, node, config) { },
            className: 'btn btn-success'
        },
        {
            text: 'Yenile',
            action: function (e, dt, node, config) {
                //Burada yenile butonuna basıldığına da  Ajax ile içeriğimizi yeniliyeceğiz.
                $.ajax({
                    type: 'GET',
                    url: '/Admin/Category/GetAllCategories/',
                    contentType: 'application/json',
                    beforeSend: function () {
                        $('#categoriesTable').fadeOut(1000);
                        $('.spinner-border').show();
                    },
                    success: function (data) {
                        const categoryListDto = jQuery.parseJSON(data);
                        if (categoryListDto.ResultStatus === 0) {
                            let tableBody = '';
                            $.each(categoryListDto.Categories.$values,
                                function (index, category) {
                                    tableBody += `
                                    <tr name="${category.Id}">
                                        <td>${category.Id}</td>
                                        <td>${category.Name}</td>
                                        <td>${category.Description}</td>
                                        <td>${convertFirstLetterToUpperCase(category.IsActive)}</td>
                                        <td>${convertToShortDate(category.CreatedDate)}</td>
                                        <td>${category.CreatedByName}</td>
                                        <td>
                                            <button class="btn btn-warning btn-sm btn-update" data-id="${category.Id}">
<span class="fas fa-edit text-white"></span></button>
                                            <button class="btn btn-danger btn-sm btn-delete" data-id="${category.Id}">
<span class="fas fa-minus-circle"></span></button>
                                        </td>
                                    </tr>
                                `;
                                });
                            $('#categoriesTable > tbody').replaceWith(tableBody);
                            $('.spinner-border').hide();
                            $('#categoriesTable').fadeIn(1000);
                        } else {
                            toastr.error(`${categoryListDto.Message}`, 'İşlem başarısız!')
                        }
                    },
                    error: function (err) {
                        toastr.error(err, 'Başarısız İşlem!')
                    }
                });
            },
            className: 'btn btn-warning'
        }],
        language: {
            url: "//cdn.datatables.net/plug-ins/1.13.1/i18n/tr.json"
        }
    });
    //Datatable burada bitiyor

    $(function () {
        const url = '/Admin/Category/Add/'; //url'ye veri tabanımızdan çekmiş olduğumuz kategorileri tanımlıyoruz.
        const placeHolderDiv = $('#modalPlaceHolder'); // burada da  json da başlangı noktasını kullanmak için tanımlama yaptık 
        //Ajax'la partial viewimizi ekrna getirme
        $('#btnAdd').click(function () { // butana tıklnamada verekli olan function başlaması
            $.get(url).done(function (data) {//url bilgisini aldık "done" sorun yoksa çalıştır
                placeHolderDiv.html(data);
                placeHolderDiv.find(".modal").modal('show'); // sayafada ekleme tablosunun görnmesini sağlıyoruz.
            });
        });
        //Ajax'la (GET) partial viewimizi ekrna getirme BİTTİ

        //Ajax'la (POST) işlemleri
        placeHolderDiv.on('click', '#btnSave', function (event) { // Add için kaydet tuşuna basılma anı için gerekli fonksiyonların başlaması 
            event.preventDefault();
            const form = $('#form-category-add'); // formun json dönşümü 
            const actionUrl = form.attr('action');//formun ierisinde atribiut seçmek için
            const dataToSend = form.serialize();//formun içerisinde tüm verileri almak için
            $.post(actionUrl, dataToSend).done(function (data) { //
                const categoryAddAjaxModel = jQuery.parseJSON(data); // data veriloerinin json da dömnüşümü 
                const newFormBody = $('.modal-body', categoryAddAjaxModel.CategoryAddPartial);
                placeHolderDiv.find('.modal-body').replaceWith(newFormBody);
                const isValid = newFormBody.find('[name="IsValid"]').val() === 'True'; // _CategoryAddPartial'ımız daki inputta durumun true olup olmadığını burada kontrol edip isValid içerisine atıyoruz.
                if (isValid) {
                    const newTableRow = `
                        <tr name="${categoryAddAjaxModel.CategoryDto.Category.Id}">
                           <td>${categoryAddAjaxModel.CategoryDto.Category.Id}</td>
                           <td>${categoryAddAjaxModel.CategoryDto.Category.Name}</td>
                           <td>${categoryAddAjaxModel.CategoryDto.Category.Description}</td>
                           <td>${convertFirstLetterToUpperCase(categoryAddAjaxModel.CategoryDto.Category.IsActive)}</td>
                           <td>${convertToShortDate(categoryAddAjaxModel.CategoryDto.Category.CreatedDate)}</td>
                           <td>${categoryAddAjaxModel.CategoryDto.Category.CreatedByName}</td>
                           <td>
                               <button class="btn btn-warning btn-sm btn-update" data-id="${categoryAddAjaxModel.CategoryDto.Category.Id}">
<span class="fas fa-edit text-white"></span></button>
                               <button class="btn btn-danger btn-sm btn-delete" data-id="${categoryAddAjaxModel.CategoryDto.Category.Id}">
<span class="fas fa-minus-circle"></span></button>
                           </td>
    
                        </tr>
                    `;
                    const newTableRowObject = $(newTableRow);
                    newTableRowObject.hide(); // oluşmuş olan yeni satırı gizliyoruz 
                    $('#categoriesTable').append(newTableRowObject); // yeni satırı tabloya ekliyoruz 
                    newTableRowObject.fadeIn(1000); // 3 saniye ye kadar ekrana yavaş - yavaş gelmesini sağlıyoruz.
                    toastr.success(`${categoryAddAjaxModel.CategoryDto.Message}`, 'Başarılı!'); // toaster  kütüphanesi      ile kayıt durumu ekrana yazdırlıyo.
                    placeHolderDiv.find(".modal").modal('hide'); // post ekranı kapatılıyor.

                } else {
                    let summaryText = '<br>';
                    $('#validation-summary > ul > li').each(function () {
                        // each ile hata lar var ise sırasıyla toaster kütüphanesinden ekrana yazdırlıyor.
                        let liText = $(this).text();
                        summaryText += `*${liText}<br><br>`;
                    });
                    toastr.warning(summaryText, 'DİKKAT !');
                }
            });
        });
        //Ajax'la (post) işlemleri bitti

        //Ajax'la DELETE işlemleri
        //on burda tıklamayı alıyor
        $(document).on('click', '.btn-delete', function (event) {
            event.preventDefault();//Burada butonumuzun tipi submit olmadığı için bunu kullanmasakta olur . Sadece alışkanlık olsun diye yazıyoruz.
            const id = $(this).attr('data-id');
            Swal.fire({
                title: 'Silmek istediğinizden emin misiniz?',
                text: "İlgili kategori silinecektir!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Evet',
                cancelButtonText: 'Hayır',
            }).then((result) => {
                if (result.isConfirmed) {
                    //Burada kategorinin silinme işlemleri yapılacak, ardından silinmiş mesajı gösterilecek
                    $.ajax({
                        type: 'POST',
                        dataType: 'json',
                        data: { categoryId: id },
                        url: '/Admin/Category/Delete/',
                        success: function (data) {
                            const result = jQuery.parseJSON(data);
                            if (result.ResultStatus === 0) {
                                Swal.fire({
                                    title: 'İşlem başarılı!',
                                    text: 'İlgili kategori silinmiştir.',
                                    icon: 'success',
                                    cofirmButtonText: 'Tamam'
                                });
                                const tableRow = $(`[name="${id}"]`);
                                tableRow.fadeOut(3000);
                            } else {
                                Swal.fire({
                                    title: 'Hata oluştu',
                                    text: `${result.Message}`,
                                    icon: 'error',
                                    cofirmButtonText: 'Tamam'
                                });
                            }
                        },
                        error: function (err) {
                            toaster.error(err.statusText, 'Hata!');
                        }
                    });

                };
            });
        });
    });
    $(function () {
        const url = '/Admin/Category/Update/';
        const placeHolderDiv = $('#modalPlaceHolder');

        //category update partial view getirme
        $(document).on('click', '.btn-update', function (event) {
            event.preventDefault();
            const id = $(this).attr('data-id');
            $.get(url, { categoryId: id })
                .done(function (data) {
                    placeHolderDiv.html(data);
                    placeHolderDiv.find('.modal').modal('show');
                })
                .fail(function () {
                    toastr.error('Bir hata oluştu!');
                });
        });
        //category update partial view getirme bitti

        //
        placeHolderDiv.on('click', '#btnUpdate', function (event) {
            event.preventDefault();
            const form = $('#form-category-update');
            const actionUrl = form.attr('action');
            const dataToSend = form.serialize();

            $.post(actionUrl, dataToSend)
                .done(function (data) {
                    const categoryUpdateAjaxModel = jQuery.parseJSON(data);

                    const newFormBody = $('.modal-body', categoryUpdateAjaxModel.CategoryUpdatePartial);
                    placeHolderDiv.find('.modal-body').replaceWith(newFormBody);
                    const isValid = newFormBody.find('[name="IsValid"]').val() === 'True';

                    if (isValid) {
                        placeHolderDiv.find('.modal').modal('hide');
                        const currentCategoryTableRow = $(`[name="${categoryUpdateAjaxModel.CategoryDto.Category.Id}"]`);
                        if (!categoryUpdateAjaxModel.CategoryDto.Category.IsDeleted) {
                            const newTableRow = `
                                <tr name="${categoryUpdateAjaxModel.CategoryDto.Category.Id}">
                                    <td>${categoryUpdateAjaxModel.CategoryDto.Category.Id}</td>
                                    <td>${categoryUpdateAjaxModel.CategoryDto.Category.Name}</td>
                                    <td>${categoryUpdateAjaxModel.CategoryDto.Category.Description}</td>
                                    <td>${convertFirstLetterToUpperCase(categoryUpdateAjaxModel.CategoryDto.Category.IsActive)}</td>
                                    <td>${convertToShortDate(categoryUpdateAjaxModel.CategoryDto.Category.CreatedDate)}</td>
                                    <td>${categoryUpdateAjaxModel.CategoryDto.Category.CreatedByName}</td>
                                    <td>
<button class="btn btn-warning btn-sm btn-update" data-id="${categoryUpdateAjaxModel.CategoryDto.Category.Id}">
<span class="fas fa-edit text-white"></span></button>
<button class="btn btn-danger btn-sm btn-delete" data-id="${categoryUpdateAjaxModel.CategoryDto.Category.Id}">
<span class="fas fa-minus-circle"></span></button>
                                    </td>
    
                                 </tr>
                                 `;
                            const newTableRowObject = $(newTableRow);
                            newTableRowObject.hide();
                            currentCategoryTableRow.replaceWith(newTableRowObject);
                            newTableRowObject.fadeIn(1000);
                            toastr.success(`${categoryUpdateAjaxModel.CategoryDto.Message}`, 'İşlem Başarılı!');
                        }
                        else {
                            currentCategoryTableRow.fadeOut(1000);
                            toastr.success(`${categoryUpdateAjaxModel.CategoryDto.Category.Name} adlı kategori silindi`, 'İşlem Başarılı!')
                        }


                    }
                    else {
                        let summaryText = '<br>';
                        $('#validation-summary > ul > li').each(function () {
                            let text = $(this).text();
                            toastr.error(text);

                        });
                    }

                });

        });
    })


});