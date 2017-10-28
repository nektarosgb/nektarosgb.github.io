$('a').on('click', function(e){  
    e.preventDefault( );
    var pageRef = $(this).attr('href');
  
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