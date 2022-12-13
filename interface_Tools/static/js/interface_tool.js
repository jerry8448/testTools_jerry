var fileer = $("[type='file']");
var texts = $('textarea')[0];
var reader = new FileReader();
fileer.on('change',function(event){
  file = event.target.files[0];
  console.log(file.name);
  reader.readAsText(file,'utf-8');
  reader.onload = function(event){
    console.log(event.target.result)
    texts.innerHTML = event.target.result;
  }
})

$('.starts').click(function(){
window.location.href="./stock/down_file/"
})

var fruit_select = $('#fruit');
var hq = $('.hqjg');
hq.on('click',function(event){
    console.log(fruit_select.val())
});
fruit_select.change(function(){
    console.log(fruit_select.val())
})


function creadeDomParas(input2_value,input3_value){
        paraDiv = document.createElement('div');
        paraDiv1 = document.createElement('div');
        paraDiv2 = document.createElement('div');
        paraDiv3 = document.createElement('div')
        paraInput1 = document.createElement('input');
        paraInput2 = document.createElement('input');
        paraInput3 = document.createElement('input');
        paraLable = document.createElement('label');
        paraSpan = document.createElement('span');
        paraDiv.setAttribute('class',"row mid-buffer ");
        paraDiv1.setAttribute('class',"col-md-2 paraFrame");
        paraDiv2.setAttribute('class',"col-md-3 paraFrame");
        paraDiv3.setAttribute('class',"col-md-5 paraFrame");
        paraInput1.type = 'checkbox';
        paraInput1.name = 'paraname'
        paraInput2.type = 'text';
        paraInput3.type = 'text';
        paraInput1.setAttribute('checked',"checked");
        paraSpan.setAttribute('class','checkable');
        paraSpan.innerHTML = '启用';
        paraDiv.appendChild(paraDiv1);
        paraDiv.appendChild(paraDiv2);
        paraDiv.appendChild(paraDiv3);
        paraDiv1.appendChild(paraLable);
        paraLable.appendChild(paraInput1);
        paraLable.appendChild(paraSpan);
        paraDiv2.appendChild(paraInput2);
        paraDiv3.appendChild(paraInput3);
    if(input2_value== undefined&&input3_value==undefined){
        
        return paraDiv
    }else if(input2_value!= undefined&&input3_value!=undefined){
        paraInput2.value = input2_value;
        paraInput3.value = input3_value;
        return paraDiv
    }
    

};

function createPara(interface_module){
    var interPara = $(interface_module);
    var lens = interPara[0].children.length;
    var paras = {};
    var key,value;
    if(lens>0){
        for(var i=0;i<lens;i++){
            var condition = interPara[0].children[i].firstElementChild.firstElementChild.firstElementChild;
            if(condition.checked){
                key = interPara[0].children[i].children[1].firstElementChild.value;
                value = interPara[0].children[i].children[2].firstElementChild.value;
                if(key!=''&&value!=''){
                    paras[key] = value;
                }
                
            }
            
        }
        return paras
    }else{
        return paras
    }
};

function extraction_data(){
    var method,_headers,datas,_url
    method = $('#method').val();
    _description = $('.description').val();
    _headers = createPara('.headers');
    datas = createPara('.bodys');
    console.log(_headers);
    _url = $('.test_url')[0].value;
    console.log(datas);
    return [method,_headers,datas,_url,_description]
}

$('.send').click(
    function(){
    var text2 = $('textarea')[0];
    text2.innerHTML = '';
    var extra_data = extraction_data();
    var _method = extra_data[0];
    var _headers = JSON.stringify(extra_data[1])=='{}'?extra_data[1]:JSON.stringify(extra_data[1]);
    var _datas = JSON.stringify(extra_data[2])=='{}'?extra_data[2]:JSON.stringify(extra_data[2]);
    var _url = extra_data[3];
    var data = {
        method:_method,
        headers:_headers,
        bodys:_datas,
        url:_url
    }
    $.post('./send/',data,
    function(data){
        text2.innerHTML = JSON.parse(data);
    }
    )
    }
)
//         $.ajax(
//             {
//                 headers:_headers,
//                 type:'GET',
//                 url:_url,
//                 data :datas,
//                 success:function(data){
            
//                     text2.innerHTML = data;
            
//                 }
    
//             }
//         )
//     }


$('.save').click(
    function(){
        var extra_data = extraction_data();
        console.log(extra_data);
        var save_data = {
        _method : extra_data[0],
        _headers : JSON.stringify(extra_data[1])=='{}'?extra_data[1]:JSON.stringify(extra_data[1]),
        _datas : JSON.stringify(extra_data[2])=='{}'?extra_data[1]:JSON.stringify(extra_data[2]),
        _url : extra_data[3],
        _description : extra_data[4]
        }
        console.log(save_data);
        $.post('./save/',
                data=save_data,function(){
                    create_history_list();

                    $('[data-toggle="tooltip"]').tooltip()

                }
            
        )
        
    }
)

$( "#tabs" ).tabs();

var headers = 1;
var bodys = 0;
var cookies = 0;

$('.headerStatus').click(
    function(){
        headers = 1;
        bodys = 0;
        cookies = 0;
    }
)

$('.bodyStatus').click(
    function(){
        headers =0;
        bodys = 1;
        cookies = 0;
    }
)

$('.cookieStatus').click(
    function(){
        headers =0;
        bodys = 0;
        cookies = 1;
    }
)

$('.add').click(
    function(){
        var newParaDiv = creadeDomParas();
        if(headers==1){
            $('.headers').append(newParaDiv);
        }else if(bodys==1){
            $('.bodys').append(newParaDiv);

        }else if(cookies==1){
            $('.cookies').append(newParaDiv);
        }
        
        $("[type='checkbox']").change(
            function(){
                if(this.checked){
                    this.nextElementSibling.innerHTML = '启用';
                }
                else{
                    this.nextElementSibling.innerHTML= '未启用';
                }
            }
        )
    }
)

$('.delete').click(
    function(){
        if(headers==1){
            var checkboxhead =$('.headers').find("[type='checkbox']")
            for(var i=0;i<checkboxhead.length;i++){
                if(!checkboxhead[i].checked){
                    
                    // son.parentNode.parentNode.remove()
                    checkboxhead[i].parentNode.parentNode.parentNode.remove();
                }
            }
        }else if(bodys==1){
            var checkboxbody =$('.bodys').find("[type='checkbox']")
            for(var i=0;i<checkboxbody.length;i++){
                if(!checkboxbody[i].checked){
                    
                    // son.parentNode.parentNode.remove()
                    checkboxbody[i].parentNode.parentNode.parentNode.remove();
                }
            }

        }else if(cookies==1){
            var checkboxcookie =$('.cookies').find("[type='checkbox']")
            for(var i=0;i<checkboxcookie.length;i++){
                if(!checkboxcookie[i].checked){
                    
                    // son.parentNode.parentNode.remove()
                    checkboxcookie[i].parentNode.parentNode.parentNode.remove();
                }
            }
        }
    }
)

$('.clear').click(
    function(){
        $('.headers').empty();
        $('.bodys').empty();
        $('.cookies').empty();
        $('#textareass').empty();
        $('.description').val('');
        $('.test_url').val('');
    }
)

$('.search').click(
    function(){
        var _method = $('#method').val();
        var _url = $('.test_url')[0].value;
        if(_method!=''&&_url!=''){
            $.get(
                url='./search/',data={
                    method:_method,
                    url:_url
                },
                function(data){
                    $('.headers').empty();
                    $('.bodys').empty();
                    $('.cookies').empty();
                    if(JSON.parse(data).status==-1){
                        alert(JSON.parse(data).message)
                    }
                    else{
                        
                        var search_data = JSON.parse(data);
                        var search_description = search_data.description;
                        $('.description').val(search_description=='{}'?'':search_description);
                        var search_headers = JSON.parse(search_data.headers);
                        var search_bodys = JSON.parse(search_data.bodys);
                        console.log(search_headers,search_bodys);
                        for(var key in search_headers){
                            var sql_header = creadeDomParas(key,search_headers[key]);
                            $('.headers').append(sql_header);
                        }
                        for(var key in search_bodys){
                            var sql_body = creadeDomParas(key,search_bodys[key]);
                            $('.bodys').append(sql_body);
                        }
                    }
                    
                    

                }
            )
        }

    }
)

function create_list_element(method,url,title){
        var list_element = document.createElement('a');
        var list_element_a_span1 = document.createElement('span');
        var list_element_a_span2 = document.createElement('span');
        var bg_colors = [
            'list-group-item-primary',
            'list-group-item-secondary',
            'list-group-item-success',
            'list-group-item-danger',
            'list-group-item-warning',
            'list-group-item-info',
            'list-group-item-light',
            'list-group-item-dark'
        ];
        var bg_random_color = bg_colors[Math.floor(Math.random()*bg_colors.length)];
        var base_class = 'list-group-item list-group-item-action ';
        list_element.setAttribute('class',base_class+bg_random_color);
        list_element.setAttribute('href','#')
        list_element.setAttribute('data-toggle','tooltip')
        list_element.setAttribute('title',title)
        list_element_a_span1.setAttribute('class',"label success method");
        list_element_a_span2.setAttribute('class',"url");
        list_element.appendChild(list_element_a_span1);
        list_element.appendChild(list_element_a_span2);
        list_element_a_span1.innerHTML = method;
        list_element_a_span2.innerHTML = url;
        return list_element

}

function create_history_list(){
    $('div.list-group').empty();
    $.get('./historys/',
        function(data){
            console.log(JSON.parse(data))
            var datas = JSON.parse(data);
            for(var i=0;i<datas.length;i++){
                var interface = datas[i];
                var new_list = create_list_element(interface[0],interface[1],interface[2]);
                $('div.list-group').append(new_list);

            };
            $('div.list-group a').click(
                function(event){
                    var _method = this.children[0].innerHTML;
                    var _url = this.children[1].innerHTML;
                    $('#method').val(_method);
                    $('.test_url')[0].value = _url;
                    $.get(
                        url='./search/',data={
                            method:_method,
                            url:_url
                        },
                        function(data){
                            $('.headers').empty();
                            $('.bodys').empty();
                            $('.cookies').empty();
                            if(JSON.parse(data).status==-1){
                                alert(JSON.parse(data).message)
                            }
                            else{
                                var search_data = JSON.parse(data);
                                var search_description = search_data.description;
                                $('.description').val(search_description=='{}'?'':search_description);
                                var search_headers = JSON.parse(search_data.headers);
                                var search_bodys = JSON.parse(search_data.bodys);
                                console.log(search_headers,search_bodys);
                                for(var key in search_headers){
                                    var sql_header = creadeDomParas(key,search_headers[key]);
                                    $('.headers').append(sql_header);
                                }
                                for(var key in search_bodys){
                                    var sql_body = creadeDomParas(key,search_bodys[key]);
                                    $('.bodys').append(sql_body);
                                }
                            }
                            
                            
        
                        }
                    )

                }
            )
        }
        )
}

$(document).ready(
    function(){
        create_history_list();

        $('[data-toggle="tooltip"]').tooltip()

        
    }
)
