/**
 * Created by Administrator on 2016/11/8 0008.
 */
;(function(){
    'use strict'

    var $content = $("#task_content"),
        $addTaskBtn = $("#add_task_btn"),
        new_task = {},
        task_list = [];

    init();
        
    $addTaskBtn.on("click", function(e){
        /* 获取新Task的值 */
        new_task.content = $content.val();
        /* 如果新Task的值为空则直接返回，否则继续执行 */
        if(!new_task.content) return;
        /* 存入新Task */
        if(addTask(new_task)){
            renderTaskList();
        }
        $content.val("");
        console.log("new_task",new_task);
    });

    function addTask(new_task){
        /* 将新Task推入TaskList */
        task_list.push(new_task);
        /* 更新LocalStorege */
        store.set("task_list",task_list);

        return true;
    }

    function renderTaskList(){
        var $task_list = $(".task_list");
        $task_list.html("");
        for(var i=0; i<task_list.length; i++){
            var $task = renderTaskTpl(task_list[i]);
            $task_list.append($task);
        }

        //console.log("renderTaskList() => ok");
    }

    function renderTaskTpl(data){
        var task_item_tpl = `
        <div class="task_item">
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

    function init(){
        task_list = store.get("task_list") || [];
        if(task_list.length) renderTaskList();
    }

    $content.keyup(function(e){
        if(e.key === "Enter"){
            $addTaskBtn.trigger("click");
        }
    });
    

})();
