function kaydetMeslek() {
    var d = new Date();
    var n = d.getTime()

    var meslek=$("#txtMeslek").val();    
    var idmeslek=meslek.replace(/[^\x00-\x7F]/g, "")+n;

    var veri={
        "idmeslek":idmeslek,
        "meslek":meslek
    }

    kaydetVeritabani("meslek",idmeslek,veri);

}
