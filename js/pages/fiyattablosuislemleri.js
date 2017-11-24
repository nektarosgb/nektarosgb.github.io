function kaydetMuayeneUcret() {
    var d = new Date();
    var n = d.getTime()

    var muayene=$("#txtMuayene").val();    
    var idmuayene=generateID(muayene);
    var muayeneUcret=$("#txtFiyat").val();    
    var uygulamaturu =$("input:radio[name='rdUygulamaTuru']:checked").val()


    var veri={
        "idmuayene":idmuayene,
        "muayene":muayene,
        "muayeneUcret":muayeneUcret,
        "uygulamaturu":uygulamaturu
    }

    kaydetVeritabani("muayeneUcret",idmuayene,veri);

}

function listMuayene()
{

}
