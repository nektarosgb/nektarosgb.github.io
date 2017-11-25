$('#frm_calisan').validate({
    rules: {
        txtCalisanAdi: {
            minlength: 2,
            required: true
        },
        email: {
            required: true,
            email: true
        },
        txtCalisanAdresi: {
            minlength: 2,
            required: true
        }
    }
});