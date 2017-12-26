(() => {
    // 加载会议室列表
    ajaxTool.getwriteList((data) => {
        var dom = '';
        data.writeList.map((_data) => {
            dom += '<li><div class="main"><div class="mes">' +
                '<a href="writeDetail.html?note=' + _data.mName + '"><h3>' + _data.mName + 
                '</h3><div class="mesPeople"><img src="img/03.png" alt=""><span>' +
                changeTime(_data.meta.updateAt) + '</span></div></a></div>' +
                '<span class="showBtn">&gt;</span></div><div class="del">删除</div></li>'
        });

        // 在会议地点中加载
        document.querySelector('.writeList ul').innerHTML = dom;

        //搜索功能实现
        // 重组数组
        let searchBtn =document.querySelector('.searchBtn');
        let writeList =document.querySelectorAll('.writeList li');
        let writeTitleData = [];
        data.writeList.forEach(function(_data){
            writeTitleData.push(_data.mName);
        });
        // 筛选信息，修改值时
        searchBtn.addEventListener('keyup', function(){
            haveTextInData(this.value, writeTitleData, function(){
                hideList(writeList);        
            }, function(isFind){
                hideList(writeList);        
                isFind.map(function(num){
                    writeList[num].style.display = 'block';
                });
            });
        });

    });

    // 查询Data中是否有text
    function haveTextInData(text, Data, callback1, callback2){
        var reg = new RegExp(text);
        var isFind = [];
        Data.map(function(value, index){
            if(value.match(reg)){
                isFind.push(index)
            }
        });
        if(isFind.length == 0){
            callback1();
        }else{
            callback2(isFind);
        }
    }

    // 修改时间显示格式
    function changeTime(time) {
        var data = time.replace(/T/, ' ').split(':');
        return data[0] + ':' + data[1];
    }

})();