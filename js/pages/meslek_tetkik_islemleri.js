function initLoadedPage_meslek_tetkik_islemleri() {
    loadCheckBoxList('lstTetkikler', 'idTetkik', 'tetkik', 'tetkikler');
        firebase.database().ref('meslektetkikler').once('value').then(function (snapshot) {
    
            grid.bootgrid("clear");
            var rows = [];
            snapshot.forEach(function (element) {
                var cleanelement = JSON.parse(JSON.stringify(element));
                cleanelement['id'] = rows.length + 1;
                rows.push(cleanelement);
            });
            grid.bootgrid("append", rows);
        });
        
        LoadDrop('drpMeslek','idMeslek','meslek','meslekler','');
        setHeader("Mesleğe Göre Tetkik Belirleme İşlemleri");
    }

function ShowTetkik()
{
    var meslekId=$("#drpMeslek").val();
    setEditTetkikMeslek(meslekId);
}
function setEditTetkikMeslek(id) {
    firebase.database().ref('/tetkikler/').once('value').then(function (snapshot) {
        if(snapshot==null){
            return;
        }
        $("#txtTetkik").val(snapshot.val().tetkik);
        $("#txtFiyat").val(snapshot.val().fiyat);
        // $("#drpUygulamaTuru select").val(snapshot.val().uygulamaTuru);    
        // $("#drpUygulamaTuru select[value='"+snapshot.val().uygulamaTuru +"']").attr("selected",true);
         $("#drpUygulamaTuru").val(snapshot.val().uygulamaTuru ).find("option[value=" + snapshot.val().uygulamaTuru +"]").attr('selected', true);
        $('#myModal').modal('show');
    });
}

function kaydetTetkikBilgisi() {
    var d = new Date();
    var n = d.getTime()

    var tetkik = $("#txtTetkik").val();
    var idTetkik = tetkik.replace(/[^\x00-\x7F]/g, "") + n;
    if ($("#hdnId").val().trim().length >0){
        idTetkik = $("#hdnId").val();
    }
        
    var fiyat = $("#txtFiyat").val();
    var uygulamaTuru = $("#drpUygulamaTuru").val();

    //(Firma Adı, adresi, tel, SGK sicil No, İlgili Kişi, Cep, Email ve İşyeri Hekimi, İş güvenliği Uzmanı)

    var veri = {
        "idTetkik": idTetkik,
        "tetkik": tetkik,
        "fiyat": fiyat,
        "uygulamaTuru": uygulamaTuru,
        "kayitEden": firebase.auth().currentUser.providerData[0]["email"]
    }

    kaydetVeritabani("tetkikler", idTetkik, veri);
    clearAllFieldsTetkik()
    initLoadedPage_tetkik_islemleri();

}


function clearAllFieldsTetkik() {
    $("#hdnId").val('');
    $("#txtTetkik").val("");
    $("#txtFiyat").val('');
    $("#drpUygulamaTuru select").val("Seçiniz");   
    $("#drpUygulamaTuru").val("Seçiniz").find("option[value=0]").attr('selected', true);
}