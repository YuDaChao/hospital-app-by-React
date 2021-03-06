document.getElementsByTagName('html')[0].style.fontSize=document.documentElement.clientWidth/7.5+'px';
//FastClick初始化
document.addEventListener('DOMContentLoaded', function() {
    FastClick.attach(document.body);
}, false);

//config
$.urlObj=$Parse(decodeURI(window.location.href))
$.hosName="医院名字XXX"
$.type=(function(){
            var ua = window.navigator.userAgent.toLowerCase();
            if(/micromessenger/i.test(ua)){
                return 1;                     //微信
            }else if(/alipayclient/i.test(ua)){
                return 2;                     //支付宝
            }else{
                return 2;
            }
        })()
$.openId=(function(){
                if(localStorage.getItem('openId')){
                    return localStorage.getItem('openId')
                }else{
                    var ob=$Parse(window.location.href);
                    var environment=$.type;         //表明支付宝还是微信
                    var code='';                    //授权code 在用户访问授权地址后返回
                    if(environment==1){             //环境不同code的key不同，获取授权code
                        code=ob.code;
                    }else{
                        code=ob.auth_code;
                    }
                    $Ajax('userInfoGetSuper',{
                        environment:environment,
                        code:code ? code : '',
                        returnUrl:code ? '' : window.location.href
                    },function(data){
                        if(!code){
                            window.location.href=data.obj.codeUrl;  //跳转到授权地址授权
                        }else{                                      //如果授权完成，即为获取用户信息
                            return data.obj.userId;
                        }
                    })
                }
        })()

//页面跳转
function $Go(url){window.location.href=url}

//Loading
function $Loading(){
    var el=document.createElement('div');
    el.id='loading';
    el.innerHTML='<div class="loadEffect"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div>';
    document.getElementsByTagName('body')[0].appendChild(el)
}
$Loading.remove=function(){
    var el=document.getElementById('loading');
    if(el)document.getElementsByTagName('body')[0].removeChild(el)
}

//AJAX请求
function $Ajax(url,obj,fn){
    ajax("post",$.reqHost+'/hrwgzyy/rest/'+url,$Param(obj),fn);
    function ajax(method, url, data, success,err) {
        $Loading();
        var xhr = new XMLHttpRequest();
        if (method == 'get' && data) {
            url += '?' + data;
        }
        xhr.open(method,url,true);
        if (method == 'get') {
            xhr.send();
        } else {
            xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
            xhr.send(data);
        }
        xhr.onreadystatechange = function() {
            if ( xhr.readyState == 4 ) {
                $Loading.remove();
                if ( xhr.status == 200 ) {
                    var data = eval("("+xhr.responseText+")");
                    if(!data.success)alert(data.msg);
                    if(success && data.success)success( data );
                } else {
                    err && err();
                }
            }
        }
    }
}

//JSON转query
function $Param(obj){
    var arr=[];
    for(k in obj){
        arr.push(k+'='+encodeURI(obj[k] instanceof Object ? JSON.stringify(obj[k]) : obj[k]));
    }
    return arr.join('&')
}

//query转JSON
function $Parse(string){
    var obj = new Object();
    if (string.indexOf("?") != -1) {
        var string = string.substr(string.indexOf("?") + 1);
        var strs = string.split("&");
        for (var i = 0; i < strs.length; i++) {
            var tempArr = strs[i].split("=");
            obj[tempArr[0]] = tempArr[1];
        }
    }
    return obj;
}

//Date对象格式化
function $Time(tDate){
    var tMonth = tDate.getMonth()+1,tDay = tDate.getDate();
    tMonth < 10 ? tMonth = '0' + tMonth: null;
    tDay < 10 ? tDay = '0' + tDay: null;
    return tDate.getFullYear()+'-'+tMonth+'-'+tDay
}

//给支付平台坑爹接口擦屁股
function $Fuck(a){
    if(typeof a.length == 'undefined' && typeof a != 'number'){
        return [a]
    }else{
        return a
    }
}