$('a').on('click', function(e){  

    var pageRef = $(this).attr('href');

    if(pageRef.indexOf("index.html")>-1){
        return true;
    }
    e.preventDefault( );
    
  
callPage(pageRef);
})
function callPage(pageRefInput){
$.ajax({
    url:pageRefInput,

    type:"GET",
    dataType:"text",

    success:function(response){
        $(".mypages").html(response);
        // $("<h1/>").text(json.title).appendTo("body");
        // $("<div class\"content\"/>").html(json.html).appendTo("body");
    },
    error:function(xhr,status,errorThrown){
        alert("Bir Problem Oluştu");
        console.log("Hata :",errorThrown);
    }
});
}