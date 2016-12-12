/**
 * Created by Administrator on 2016/11/8 0008.
 */
;(function(){
    'use strict'

    var $content = $("#task_content"),
        $addTaskBtn = $("#add_task_btn"),
        $task_detail = $(".task_detail"),
        $task_detail_mask = $(".task_detail_mask"),
        task_list = [],
        current_index,
        $update_form,
        $task_detail_content,
        $task_detail_content_input,
        $delete_task_btn,
        $detail_task_btn;

    init();
        
    $addTaskBtn.on("click", function(e){
        var new_task = {};
        /* 获取新Task的值 */
        new_task.content = $content.val();
        /* 如果新Task的值为空则直接返回，否则继续执行 */
        if(!new_task.content) return;
        /* 存入新Task */
        if(addTask(new_task)){
            $content.val(null);
        }
    });

    $task_detail_mask.on("click" ,hideTaskDetail);

    /**
     * 添加Task
     * @param {String} 任务内容
     */
    function addTask(new_task){
        /* 将新Task推入TaskList */
        task_list.push(new_task);
        /* 更新LocalStorege */
        refreshTaskList();
        return true;
    }

    /**
     * 渲染全部的Task
     */
    function renderTaskList(){
        var $task_list = $(".task_list");
        $task_list.html("");
        for(var i=0; i<task_list.length; i++){
            var $task = renderTaskItem(task_list[i],i);
            $task_list.prepend($task);
        }

        $delete_task_btn = $(".task_list").find(".del");
        $detail_task_btn = $(".task_list").find(".detail");
        listenTaskDelete();
        listenTaskDetail()

        //console.log("$delete_task_btn",$delete_task_btn);
    }

    /**
     * 渲染单条Task模版
     * @param  {Object} data  task
     * @param  {Int} index 序号
     * @return {jQuery}    task对象
     */
    function renderTaskItem(data,index){
        if(!data || (!index && index != 0)) return;
        var task_item_tpl = `
        <div class="task_item" data-index="${index}">
            <div class="task_item_content">
                <span><input type="checkbox"/></span>
                <span class="task-content">${data.content}</span>
            </div>
            <div class="task_item_operation">
                <span class="del">删除</span>
                <span class="detail">详细</span>
            </div>
        </div>`;

        return $(task_item_tpl);
    }

    /**
     * 刷新localStorage数据并渲染模版
     */
    function refreshTaskList(){
        store.set("task_list",task_list);
        renderTaskList();
    }

    /**
     * 查找并监听所有删除按钮的点击事件
     */
    function listenTaskDelete(){
        $delete_task_btn.on("click", function(){
            var $this = $(this);
            var $item = $this.parent().parent();
            var index = $item.data("index");
            var temp = confirm("确认删除？");
            temp ? deleteTask(index) : null;
        });
    }

    /**
     * 删除Task
     * @param  {int} index TaskId
     */
    function deleteTask(index){
        if((!index && index != 0) || !task_list[index]) return;
        delete task_list[index];
        /*更新localStorage*/
        refreshTaskList();
    }

    /**
     * 查找并监听所有详细按钮的点击事件
     */
    function listenTaskDetail(){
        $detail_task_btn.on("click", function(){
            var $this = $(this);
            var $item = $this.parent().parent();
            var index = $item.data("index");
            showTaskDetail(index);
        });
    }

    /**
     * 显示Task详细信息
     * @param  {int} index
     */
    function showTaskDetail(index){
        if(!index && index != 0) return;
        //生成详情模版
        renderTaskDetai(index);
        current_index = index;
        //显示详情模版，默认隐藏
        $task_detail_mask.show();
        $task_detail.show();
    }

    /**
     * 渲染指定Task的详细信息
     */
    function renderTaskDetai(index){
        var item = task_list[index];
        console.log("item",item);
        if(!item) return;
        var content = item.content;
        var desc = item.desc;
        if(content === undefined) content = "";
        if(desc === undefined) desc= "";
        var tpl = `
        <form>
        <div class="content" >${content}</div>
        <div class="input_item"><input type="text" name="content" value="${content}" style="display:none;"></div>
        <div>
            <div class="desc input_item">
                <textarea placeholder="添加描述" name="desc">${desc}</textarea>
            </div>
            <div class="remind input_item">
                <input name="remind_date" type="date" value="${item.remind_date}"/>
            </div>
        </div>
        <div class="input_item"><button type="submit">更新</button></div>
        </form>`;
        //清空Task详情模版
        $task_detail.html(null);
        //替换旧模板
        $task_detail.html(tpl);
        //选中其中的from元素，因为之后会使用其监听submit事件
        $update_form = $task_detail.find("form");
        //选中显示Task内容元素
        $task_detail_content = $task_detail.find(".content");
        //选中显示Task input内容元素
        $task_detail_content_input = $task_detail.find("[name='content']");

        //双击内容元素显示input，隐藏自己
        $task_detail_content.on("dblclick", function(){
            $task_detail_content_input.show();
            $task_detail_content.hide();
        });    
        //获取表单中各个input的值
        $update_form.on("submit", function(e){
            e.preventDefault();
            var data = {};
            data.content = $(this).find("[name='content']").val();
            data.desc = $(this).find("[name='desc']").val();
            data.remind_date = $(this).find("[name='remind_date']").val();
            updateTask(index,data);
            hideTaskDetail();
        });

    }

    /**
     * 更新Task
     * @param  {[type]} index [description]
     * @param  {[type]} data  [description]
     * @return {[type]}       [description]
     */
    function updateTask(index,data){
        if(!index || !task_list[index]) return;

        task_list[index] = data;
        refreshTaskList();
    }


    /**
     * 隐藏Task详细信息
     */
    function hideTaskDetail(){
        $task_detail_mask.hide();
        $task_detail.hide();
    }

    function init(){
        task_list = store.get("task_list") || [];
        if(task_list.length) renderTaskList();
    }

    /**
     * 相应Enter键
     */
    $content.keyup(function(e){
        if(e.key === "Enter"){
            $addTaskBtn.trigger("click");
        }
    });
    

})();
