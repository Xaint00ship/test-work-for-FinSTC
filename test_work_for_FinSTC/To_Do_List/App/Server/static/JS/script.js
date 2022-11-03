window.onload=function(){

    const host = "127.0.0.1";
    const port = "5000"
        
    loadProgress();

    let btnCreateNewTask = document.querySelector("#btn-create-new-task");
    let inputTaskText = document.querySelector("#form-input-text-task");
    let taskBlock = document.querySelector(".container");
    let btnDeletedTask = document.querySelector("#btn-deleted-task");
    let btnСompletedTask = document.querySelector("#btn-completed-task");
    let btnUnfinishedTask = document.querySelector("#btn-unfinished-task");
    let checkboxSelectAllTasks = document.querySelector("#check-box-select-all-task");
    let inputDate = document.querySelector("#input-date");
    let inputTime = document.querySelector("#input-time");
    let btnSaveProgress = document.querySelector("#btn-save");
    let taskArray = [];
    
    let dateToday = new Date();
    inputDate.min = dateToday.toISOString().split('T')[0];

    let yesterdaysDateWarning = document.createElement('div');
    yesterdaysDateWarning.className = "";
    yesterdaysDateWarning.innerHTML = "<h1>К сожалению, не прошедшее время нельзя запланировать задачи</h1>";

    let blankFieldWarningTime = document.createElement('div');
    blankFieldWarningTime.className = "";
    blankFieldWarningTime.innerHTML = "<h1>Пожалуйста, введите дату и время</h1>";

    let blankFieldWarningText = document.createElement('div');
    blankFieldWarningText.className = "";
    blankFieldWarningText.innerHTML = "<h1>Пожалуйста, введите название</h1>"; 


    
    btnCreateNewTask.addEventListener("click", () => createNewTask(inputTaskText.value, concatDateTime()));
    btnSaveProgress.addEventListener("click", setProgress);


    function concatDateTime(){
        if (inputDate.value && inputTime.value){
            return inputDate.value + " | " + inputTime.value; 
        }
        else{
            return false;
        }
    }

    function loadProgress(){
        fetch(`http://${host}:${port}/getSiteProgress`
        )
            .then((response) => response.json())
            .then((data) => {
                for (let task in data["tasks"]) {      
                    createNewTask(data["tasks"][task]["text"],data["tasks"][task]["date"],data["tasks"][task]["state"]);
                }
                
            });
    }

    function setProgress(){
        let taskJsonArray = [];

        if(!document.querySelectorAll('.task-text')[0]){
            taskJsonArray.push({"task":{date:"Clear all entries"}});
        }

        else{
            for(var i = 0; i < document.querySelectorAll('.task-text').length; i++){
                taskText = document.querySelectorAll('.task-text')[i].value;
                taskDate = document.querySelectorAll('.task-date')[i].value;
                taskState = document.querySelectorAll('.task-text')[i].style.backgroundColor + "";
                if(taskState == "rgb(25, 135, 84)"){
                    taskState = true;
                }
                if(taskState == "rgb(200, 48, 63)"){
                    taskState = false;
                }

                taskJsonArray.push({"task":{date:taskDate, text:taskText, state:taskState}});
            }
        }
        

        fetch(`http://${host}:${port}/setSiteProgress`,{
            credentials: "same-origin",
            method: 'POST',
            body: JSON.stringify(taskJsonArray),
            headers: {
                'content-type': 'application/json'
            },
        })
    }
    


    function createNewTask(taskText, dateTime, state = ""){
       
        if(taskText){
            blankFieldWarningText.remove();
            if(dateTime){
                blankFieldWarningTime.remove();
                    if (state == "True"){
                        state = "#198754";
                    }
                    else if(state == "False"){
                        state = "#c8303f";
                    }
                    yesterdaysDateWarning.remove(); 
          
                    let newTask = document.createElement('div');
                    newTask.className = "task row";

                    newTask.innerHTML = "<div class='col p-0 m-0'> <input type='checkbox' class='checkbox-task big-checkbox'> </div>" +
                    " "+ "</div>" + "<div class='col-11 col-lg-2 p-0 m-0'> <input type='text' name='input-dateTime' class='input-editing-task task-date form-control' value='" + dateTime + "'></div>"+
                    "<div class='col-12 col-lg-9 p-0 m-0'> <input type='text' name='input-task' style='background-color:"+ state +"' class='input-editing-task form-control task-text' value='" 
                    + taskText + "'>" ;
                    
                    taskArray.push(newTask);
                    taskBlock.append(newTask);
                    newTask.querySelector('.checkbox-task').addEventListener('change', checkSelectTask);
                    
                    inputTaskText.value = "";
                    inputDate.value = "";
                    inputTime.value = "";
     
            }
            else{
                taskBlock.append(blankFieldWarningTime);
            }
        }

        else{
            taskBlock.append(blankFieldWarningText);
        }
        
    }

    
    
    function selectAllTasks(){
        if(taskBlock.querySelectorAll('.checkbox-task').length){
            checkSelectTask();
            
            taskArray.forEach(element => {
                if(checkboxSelectAllTasks.checked){
                    element.querySelector('.checkbox-task').checked = 1;
                    visibilityBtn(true);
                }
                else{
                    element.querySelector('.checkbox-task').checked = 0;
                    visibilityBtn(false);
                    checkSelectTask();
                }

            });
        }
    }

    function visibilityBtn(value){
        if(value){
            btnСompletedTask.style.display = '';
            btnDeletedTask.style.display = '';
            btnUnfinishedTask.style.display = '';
        }
        else{
            btnСompletedTask.style.display = 'none';
            btnDeletedTask.style.display = 'none';
            btnUnfinishedTask.style.display = 'none';
        }
    }

    
    function checkSelectTask(){
        checkBoksActive = taskBlock.querySelectorAll('.checkbox-task');
        let stableCheckBox = 0;
        
        checkBoksActive.forEach(element => {
            stableCheckBox = stableCheckBox + element.checked;
        });
        visibilityBtn(stableCheckBox);
     
        btnDeletedTask.addEventListener('click', deletedTask);
        
        btnСompletedTask.addEventListener('click', completedTask);
        btnUnfinishedTask.addEventListener('click', unfinishedTask);

    }
    checkboxSelectAllTasks.addEventListener("change", selectAllTasks);

    function deletedTask(){
        taskArray.forEach(element => {
            if(element.querySelector('.checkbox-task').checked){
                element.querySelector('.checkbox-task').checked = 0;
                
                visibilityBtn(false);
                checkboxSelectAllTasks.checked = 0;
                element.remove();
                
            }
            
        });

    }
    
    function completedTask(){
        taskArray.forEach(element => {
            if(element.querySelector('.checkbox-task').checked){
                element.querySelector('.checkbox-task').checked = 0;
                visibilityBtn(false);
                checkboxSelectAllTasks.checked = 0;
                element.querySelector(".task-text").style.backgroundColor = '#198754';
            }
        });

    }

    function unfinishedTask(){
        taskArray.forEach(element => {
            if(element.querySelector('.checkbox-task').checked){
                element.querySelector('.checkbox-task').checked = 0;
                visibilityBtn(false);
                checkboxSelectAllTasks.checked = 0;
                element.querySelector(".task-text").style.backgroundColor = '#c8303f';
            }
        });

    }


}