function kaydetMeslek() {
    var d = new Date();
    var n = d.getTime()

    var meslek=$("#txtMeslek").val();    
    var idmeslek=generateID(meslek);

    var veri={
        "idmeslek":idmeslek,
        "meslek":meslek
    }

    kaydetVeritabani("meslek",idmeslek,veri);

}
