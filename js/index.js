var wrapper_useer = document.getElementsByClassName('wrapper_useer')[0];
var sideArary = document.getElementsByClassName('side')[0];
var form = document.getElementById('studentMessage');
var submit = document.getElementsByClassName('submit')[0];
var studentTable = document.getElementById('studentTable');
var studentBody = document.getElementById('studentBody');
var editor_wrapper = document.getElementsByClassName('editor_wrapper')[0];
var editor_form = document.getElementById('editor_form');
var close_logo = document.getElementById('close_logo');
var editor_submit = document.getElementById('editor_submit');
var page_wrapper = document.getElementsByClassName('page_wrapper')[0];
var log_mes = document.getElementById('log_mes_form');
var web_log_in = document.getElementsByClassName('web_log_in')[0];
var log_mes_form = document.getElementById('log_mes_form');
var regsister_mes = document.getElementById('regsister_mes');
var log_mesHeader = document.getElementsByClassName('log_mesHeader')[0];
var log_regsister = document.getElementsByClassName('log_regsister')[0];
var log_user = document.getElementsByClassName('log_user')[0];
var loadLine = document.getElementById('loadLine');
var wrapper_loadLine = document.getElementsByClassName('wrapper_loadLine')[0];

//学生数组
var studentIformation = [];
//当前页码
var index = 1;
//学生总页数
var count = null;
//学生一页的人数
var size = 7;

//样式

//侧边栏的点击事件,content相应侧边栏点击
sideArary.onclick = function(e){
    if(e.target.tagName == 'DD'){
    var active = this.getElementsByClassName('active')[0];
    active.classList.remove('active');
    e.target.className = "active";
    document.getElementsByClassName('change')[0].classList.remove('change');
    document.getElementsByClassName(e.target.dataset.id)[0].classList.add('change');
    }

}

//添加学生按钮
submit.onclick = function(e){
    e.preventDefault();//禁止默认事件
    student_form('studentMessage','add',complete_Mes);
}
//用什么状态来获取表单
function student_form(form_id,status,handle){
    var form = document.getElementById(form_id);
    var studentData = {
        name: form.name.value,
        sex: form.sex.value == '男' ? 0 : 1,
        sNo: form.number.value,
        email: form.address.value,
        phone: form.iphone.value,
        address: form.location.value,
        birth: form.birth.value
    }
    if(status == 'add'){
        handle(studentData);
    }else if(status == 'editor'){
        handle(studentData);
    }
}
//判断有没有输入完善并发送数据
function complete_Mes(studentData){
        //有空内容
        if(!studentData.name
            || !studentData.sNo || !studentData.email 
            || !studentData.phone || !studentData.address 
            || !studentData.birth){
            alert('请完善信息内容');
            console.log(studentData)
        }else{
            //发送表单数据
            studentAdd(studentData);
        }
}

//添加学生
function studentAdd(param){
     transferData('/api/student/addStudent',param,
     function(){
          alert('添加学生信息成功');
          form.reset();
          //跳转页面到学生列表中
          studentTable.click();
          getStudentMes();
     })
}

//获取学生信息,data是学生们信息的一个数组
// getStudentMes();
function getStudentMes(){
   transferData('/api/student/findByPage',{
        page:index,
        size:size
    },function(data){
        studentIformation = data.data.findByPage;
        count = Math.ceil(data.data.cont / size);
        renderStudentMes(studentIformation);
    })
} 

//渲染学生信息
function renderStudentMes(data){
    studentBody.innerHTML = "";
    data.forEach(
        function(ele,index,self){
            studentBody.innerHTML += `<tr>
            <td>${ele.sNo}</td>
            <td>${ele.name}</td>
            <td>${ele.sex == 0 ? '男' : '女'}</td>
            <td>${ele.email}</td>
            <td>${ele.birth}</td>
            <td>${ele.phone}</td>
            <td>${ele.address}</td>
            <td>
                <button class="edit" data-index=${index}>编辑</button>
                <button class="delete" data-index=${index}>删除</button>
            </td>
        </tr>`;                               
        }
    )
}

// //编辑、删除
studentBody.onclick = function(e){
    //编辑
    if(e.target.classList.contains('edit')){
        editor_wrapper.classList.add('change');
        editor_formMes(e.target.dataset.index);
    }else if(e.target.classList.contains('delete')){
        //删除
        if(window.confirm('确定要删除' +  studentIformation[e.target.dataset.index].name + "吗？")){
            transferData('/api/student/delBySno',{
                sNo: studentIformation[e.target.dataset.index].sNo
            },function(result){
                getStudentMes();
                alert('此学生成功被删除');
            }) 
        }
    }
}


//关闭编辑窗口
close_logo.onclick = function(){
    editor_wrapper.classList.remove('change')
}

//编辑时候信息回传
function editor_formMes(index){
        editor_form.name.value = studentIformation[index].name;
        editor_form.sex.value = studentIformation[index].sex == 0 ? '男' : '女';
        editor_form.number.value = studentIformation[index].sNo;
        editor_form.address.value = studentIformation[index].email;
        editor_form.birth.value = studentIformation[index].birth;
        editor_form.iphone.value = studentIformation[index].phone;
        editor_form.location.value = studentIformation[index].address;
}

//编辑时修改学生
editor_submit.onclick = function(e){
    e.preventDefault();
    student_form('editor_form','editor',function(studentData){
        //修改成功渲染页面、关闭窗口
        transferData('/api/student/updateStudent',studentData,function(){
            close_logo.click();//关闭窗口
            getStudentMes();//获取信息
            alert('修改成功');  

        })
    });
}

// cb: 成功获取数据之后执行的函数
function transferData(url, param, cb,tpye) {
    var result = saveData('http://api.duyiedu.com' + url, Object.assign({
        appkey: "hang_1576385700592"
    }, param),tpye === 'post' ? 'post' : 'get');

    if (result.status == 'success') {
        cb(result);
    } else {
        alert(result.msg);
    }
}

//发送数据
function saveData(url, param,type) {
    var result = null;
    var xhr = null;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else {
        xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }
    if (typeof param == 'string') {
        xhr.open( type , url + '?' + param, false);
    } else if (typeof param == 'object'){
        var str = "";
        for (var prop in param) {
            str += prop + '=' + param[prop] + '&';
        }
        xhr.open( type , url + '?' + str, false);
    } else {
        xhr.open( type , url + '?' + param.toString(), false);
    }
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                result = JSON.parse(xhr.responseText);

            }
        }
    }
    xhr.send();

    return result;
}

//左右翻页
page_wrapper.onclick = function(e){
    if(e.target.dataset.id == 'left_button'){
        index--;
        if(index >= 1){
            getStudentMes();
        }else{
            alert('已经是第一页了');
            index++;
        }
    }else if(e.target.dataset.id == 'right_button'){
        index++;
        if(index <= count){
              getStudentMes();
        }else{
            alert('已经是最后一页了');
            index--;
        }
    }
}


//登陆页面
//登录页面的输入框
inputEvent(log_mes.log_account,'focus');
inputEvent(log_mes.log_account,'blur');
inputEvent(log_mes.log_password,'focus');
inputEvent(log_mes.log_password,'blur');
function inputEvent(dom,type){
    var tempData = dom.placeholder;
    if(type == 'focus'){
        dom.onfocus = function(e){
            this.style.border = '1px solid #5a98de';
            if(!this.value){
                this.placeholder = '';
                this.style.backgroundColor = '#FFF';
            }
        }
    }else {
        dom.onblur = function(e){
            this.style.border = '1px solid #96a5b4';
            if(!this.value){
                this.placeholder = tempData;
                this.style.backgroundColor = 'rgb(232,240,254)';
            }
        }
}
}
//登录按钮
log_mes_form.log_user_submit.onclick = function(e){
    e.preventDefault();
//    //发送登录信息
   transferData('/api/student/stuLogin',{
        account: log_mes_form.log_account.value,
        password: log_mes_form.log_password.value
   },function(result){
         //记住密码下次登录
         numberPassword();

//         //账户密码信息正确
        wrapper_loadLine.classList.remove('close');
        //进度条
        load_pic(function(){
            web_log_in.classList.remove('open');
            // wrapper_useer.className += ' open';
            $(wrapper_useer).show(500)
            getStudentMes();
        })
   },'post')

}

//注册页面
inputEvent(regsister_mes.regsister_usename,'focus');
inputEvent(regsister_mes.regsister_usename,'blur');
inputEvent(regsister_mes.regsister_account,'focus');
inputEvent(regsister_mes.regsister_account,'blur');
inputEvent(regsister_mes.regsister_password,'focus');
inputEvent(regsister_mes.regsister_password,'blur');
inputEvent(regsister_mes.regsister_repassword,'focus');
inputEvent(regsister_mes.regsister_repassword,'blur');

//注册、登录点击事件
log_mesHeader.onclick = function(e){
    if(e.target.tagName == 'SPAN'){
        if(e.target.className != 'log_change'){
            var log_change = document.getElementsByClassName('log_change')[0];
            log_change.classList.remove('log_change');
            e.target.className = 'log_change';
            subAndReg(e.target.dataset.id)
        }
    }
}
//登录、注册来回切换
function subAndReg(dataId){
    if(dataId == 'log_regsister'){
        log_user.style.display = 'none';
        $(log_regsister).slideDown(300);
    }else if(dataId == 'log_user'){
        log_regsister.style.display = 'none';
        $(log_user).slideDown(300);
    }
}

//进度条
//进度条加载完立马渲染
function load_pic(handle){
    var timer = setInterval(function(){
        loadLine.style.width = parseFloat(loadLine.style.width) + 10 + '%';
        if(loadLine.style.width == '100%'){
            clearInterval(timer);
            setTimeout(function(){
            handle();
            wrapper_loadLine.classList.add('close');
            },300)
        }
    },200)
}

//注册账号form   regsister_mes
regsister_mes.regsister_submit.onclick = function(e){
    e.preventDefault();
    transferData('/api/student/stuRegister',{
        account: regsister_mes.regsister_account.value,
        username: regsister_mes.regsister_usename.value,
        password: regsister_mes.regsister_password.value,
        rePassword: regsister_mes.regsister_repassword.value
    },function(){
        regsister_mes.reset();
        alert('注册管理账号成功')
    },'post')   
}

//记住密码
var user = log_mes_form.log_account,
            pass = log_mes_form.log_password,
            check = log_mes_form.checkbox,
            loUser = localStorage.getItem("user") || "";
            loPass = localStorage.getItem("pass") || "";
        user.value = loUser;
        pass.value = loPass;
        if(loUser !== "" && loPass !== ""){
            check.setAttribute("checked","");
        }

//记住密码
function numberPassword(){
        if(check.checked){
            localStorage.setItem("user",user.value);
            localStorage.setItem("pass",pass.value);
        }else{
            localStorage.setItem("user","");
            localStorage.setItem("pass","");
        }
    }
//hang_1576385700592
//forrest_1575638452451



