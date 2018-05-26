//面向对象渲染页面
function RanderPage(url,select){
    if(!url || !select) return ;
    this.url = url;
    this.main=$(select);
    this.init();
}
RanderPage.prototype={
    constructor:RanderPage,
    //初始化
    init(){
        this.page=1;
        this.loadData()
        .then(function(res){
            //console.log(res);
            this.json = res.data.list;
            this.rander();
            this.sortItem();
        }.bind(this));
        $(document).on("scroll",$.proxy(this.isLoad,this));
    },
    //加载数据
    loadData(){
        this.opt = {
            url:this.url,
            dataType:"jsonp",
            data:{page:this.page},
            statusCode:{
                404:function(){
                    alert("page no found");
                },
                403:function(){
                    alert("不允许访问！");
                }
            }
        };
        return $.ajax(this.opt)
    },
    //拼接字符串渲染页面
    rander(){
         this.html ="<ul>";
         this.json.forEach(function(item){
            this.html += `<li>
                                <a href="#">
                                    <img src=${item.image} />
                                    <h3>${item.title}</h3>
                                    <p>￥${item.price}</p>
                                </a> 
                                <button data-id=${item.item_id}>${item.item_id}</button>
                            </li>`
         }.bind(this));
         this.html += "</ul>";
         this.main.html(this.main.html() + this.html);
    },
    //排序
    sortItem(){
        this.children = this.main.find("li");
        var heightArray = [];
        for(var i = 0;i<this.children.length;i++){
            //第一行高度数组
            if(i<4){
                heightArray.push($(this.children[i]).height());
            }else{
                //第一行的最小高度
                var minHeight = Math.min.apply(false,heightArray);
                //第一行最小高度的下标
                var minIndex = heightArray.indexOf(minHeight);
                //拼接
                this.children.eq(i).css({
                    position:"absolute",
                    left:this.children.eq(minIndex).position().left + 5,
                    top:minHeight += 10
                })
                heightArray[minIndex] = minHeight + this.children.eq(i).height();
            }
        }

    },
    //是否加载
    isLoad(){
        this.scrollTop = $("html,body").scrollTop();
        this.clientHeight = document.documentElement.clientHeight;
        this.lastTop = this.main.find("li").eq(this.main.find("li").length - 1).position().top;
        //console.log(this.lastTop);
        //是否符合加载条件
        this.loading = false; 
        if(this.scrollTop +this.clientHeight >= this.lastTop){
            this.loading = true;
        }
        if(!this.loading || this.loading_msg) return 0;
        this.loading_msg = true;
        this.page ++;
        this.loadData()
        .then(function(res){
            this.json = res.data.list;
            this.rander();
            this.sortItem();
            this.loading_msg = false;
        }.bind(this))
    }
}
$(function(){
    var randerPage = new RanderPage("http://mce.meilishuo.com/jsonp/get/3?offset=0&frame=0&trace=0&limit=10&endId=0&pid=106888&_=1526369583128","#catecontent")
})