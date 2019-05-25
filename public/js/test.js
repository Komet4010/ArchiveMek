
$(document).ready(function(){
    // dataF = JSON.parse($("#folder").val());
    // var id;
    // var fid = $("#folderid").val();
  
    // var p
    // $('#demo').fileTree({
    //     data: dataF,
    //     sortable: false,
    //     selectable: true
    //     });

    setTimeout("  $('#notification').fadeOut('slow')", 4000);

    $("#setting").click(function(){
        $("#modal1").addClass("is-active");  
    });
    
    $("#save").click(function(){
        fid = $(".selected").data('id');
        $("#modal1").removeClass("is-active");
      });

      
      $(".closeModel").click(function() {
         $(".modal").removeClass("is-active");
      });
         

      $('#modal1').on('click', '.modal-card-body', function() {
        $(this).find("li").removeClass("selected")
        });

        

        setInterval(function(){
            $.ajax({
                type: 'POST',
                url: "check",
                success: function (data) {
                    
                    if(data != ""){
                    data1 = JSON.parse(data)
                    $("#modal3").addClass("is-active");  
                    $(".content-show").html("<p><strong>"+data1.name+"</strong><br><small> "+data1.path_with_namespace+" </small> Archive have been finish</p>")
                    }
                    
                }
            }) 
        
        }, 5000);

        $('.pagination').twbsPagination({
            totalPages: $("#num").val(),
            visiblePages: 5,
            onPageClick: function (event, page) {
                
                // $('#page-content').text('Page ' + page);
                $.ajax({
                    type: 'POST',
                    url: "page",
                    data: {
                        num: page,
                    },
                    success: function (data) {
                        data1 = JSON.parse(data)
                        $(".projectshow").html("")
                        data1.forEach(pro => {
                            $(".projectshow").append("<div class='column column is-one-quarter is-flex-mobile'><div class='card'><header class='card-header'><p class='card-header-title'>"+pro.name+"</p></header><div class='card-content'><div class='content'>"+pro.name_with_namespace+"<br><time datetime='2016-1-1'>"+"Activity Date : "+pro.last_activity_at[0]+pro.last_activity_at[1]+pro.last_activity_at[2]+pro.last_activity_at[3]+pro.last_activity_at[4]+pro.last_activity_at[5]+pro.last_activity_at[6]+pro.last_activity_at[7]+pro.last_activity_at[8]+pro.last_activity_at[9]+"</time></div></div><footer class='card-footer'><a href='#'  data-id='"+pro.id+"' data-target='modal' aria-haspopup='true' class='archive card-footer-item button is-primary'>Archive</a></footer></div></div>")
                        });
                        
                    }
                })
            }
        });
        

          $('.projectshow').on( "click",".archive", function() {
            
            id = $(this).data('id');
            $.ajax({
                type: 'POST',
                url: "archive",
                data: {
                    id: id,
                    folderId : fid
                },
                success: function (data) {
                    window.location.href = "/home";
                }
            })
          });

          $('#search').keyup(function() {
            
              
                st = $('#search').val();
                $.ajax({
                    type: 'POST',
                    url: "page",
                    data: {
                        st: st,
                    },
                    success: function (data) {
                        var num
                        data2 = JSON.parse(data)
                        if (data2 == null){
                            $(".projectshow").html("")
                            $('.pagination').twbsPagination('destroy');
                            $(".poon").html("")
                            $(".poon").append("<div class='notification is-warning'>Not Found Your Repositories</div>")
                        }else{
                        p=data2.length
                        if(p%100>0)
                        {
                            num=Math.floor(p/100+1)
                        }else{
                            num=Math.floor(p/100)
                        }
                        
                        $(".projectshow").html("")
                        $(".poon").html("")
                      if(p<100){
                            for(i=0;i<p%100;i++){
                                $(".projectshow").append("<div class='column column is-one-quarter is-flex-mobile'><div class='card'><header class='card-header'><p class='card-header-title'>"+data2[i].name+"</p></header><div class='card-content'><div class='content'><a>"+data2[i].name_with_namespace+"</a<br><time datetime='2016-1-1'>"+data2[i].created_at+"</time></div></div><footer class='card-footer'><a href='#'  data-id='"+data2[i].id+"' data-target='modal' aria-haspopup='true' class='archive card-footer-item button is-primary'>Archive</a></footer></div></div>")
                            }
                        }else{
                            for(i=0;i<100;i++){
                                $(".projectshow").append("<div class='column column is-one-quarter is-flex-mobile'><div class='card'><header class='card-header'><p class='card-header-title'>"+data2[i].name+"</p></header><div class='card-content'><div class='content'><a>"+data2[i].name_with_namespace+"</a<br><time datetime='2016-1-1'>"+data2[i].created_at+"</time></div></div><footer class='card-footer'><a href='#'  data-id='"+data2[i].id+"' data-target='modal' aria-haspopup='true' class='archive card-footer-item button is-primary'>Archive</a></footer></div></div>")
                            }
                        }
                       
                        $('.pagination').twbsPagination('destroy');
                        
                        $('.pagination').twbsPagination({
                            totalPages: num,
                            visiblePages: 5,
                            onPageClick: function (event, page) {
                                
                                // $('#page-content').text('Page ' + page);
                                $.ajax({
                                    type: 'POST',
                                    url: "page",
                                    data: {
                                        num: page,
                                    },
                                    success: function (data) {
                                        data1 = JSON.parse(data)
                                        $(".projectshow").html("")
                                        data1.forEach(pro => {
                                            $(".projectshow").append("<div class='column column is-one-quarter is-flex-mobile'><div class='card'><header class='card-header'><p class='card-header-title'>"+pro.name+"</p></header><div class='card-content'><div class='content'><a>"+pro.name_with_namespace+"</a<br><time datetime='2016-1-1'>"+pro.created_at+"</time></div></div><footer class='card-footer'><a href='#'  data-id='"+pro.id+"' data-target='modal' aria-haspopup='true' class='archive card-footer-item button is-primary'>Archive</a></footer></div></div>")
                                        });
                                        
                                    }
                                })
                            }
                        });
                    }
                    }
                
                })
            
                
               
        });

        $("#addfolder").click(function(){
            fid = $(".selected").data('id');
            if(fid == null){
                $(".NT").append("<div class='notification is-danger' ><strong>Please Select A Folder</strong></div>").fadeOut(2000)
            }else{
                $("#modal1").removeClass("is-active");
                $("#modal2").addClass("is-active");
            }
          
        });
        $(".closeModel2").click(function() {
            $("#modal2").removeClass("is-active");
         });

         $("#addf").click(function() {
            foldername=$(".foldername").val();
            
            $.ajax({
                type: 'POST',
                url: "addF",
                data: {
                    foldername: foldername,
                    folderId : fid
                },
                success: function (data) {
                    SPS=JSON.parse(data);
                    $("#modal2").removeClass("is-active");
                    $("#modal1").addClass("is-active");
                    $("#demo").html("");
                    $('#demo').fileTree({
                        data: SPS,
                        sortable: false,
                        selectable: true
                        });
                }
            })
         });          
         
       
        //  function onSignIn(googleUser) {
        //     // Useful data for your client-side scripts:
        //     var profile = googleUser.getBasicProfile();
        //     console.log("ID: " + profile.getId()); // Don't send this directly to your server!
        //     console.log('Full Name: ' + profile.getName());
        //     console.log('Given Name: ' + profile.getGivenName());
        //     console.log('Family Name: ' + profile.getFamilyName());
        //     console.log("Image URL: " + profile.getImageUrl());
        //     console.log("Email: " + profile.getEmail());
    
        //     // The ID token you need to pass to your backend:
        //     var id_token = googleUser.getAuthResponse().id_token;
        //     console.log("ID Token: " + id_token);
        //   }
});