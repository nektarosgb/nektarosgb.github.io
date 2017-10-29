function kaydetMuayeneUcret() {
    var d = new Date();
    var n = d.getTime()

    var muayene=$("#txtMuayene").val();    
    var idmuayene=muayene.replace(/[^\x00-\x7F]/g, "")+n;
    var muayeneUcret=$("#txtFiyat").val();    

    //(Firma Adı, adresi, tel, SGK sicil No, İlgili Kişi, Cep, Email ve İşyeri Hekimi, İş güvenliği Uzmanı)

    var veri={
        "idmuayene":idmuayene,
        "muayene":muayene,
        "muayeneUcret":muayeneUcret
    }

    kaydetVeritabani("muayeneUcret",idmuayene,veri);

}
