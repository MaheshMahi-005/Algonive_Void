let isLogin=true;

window.onload=function(){
    let loggedIn=localStorage.getItem("loggedIn");
    if(loggedIn == "true"){
        showDashboard();
    }
};

function newUser(){
    isLogin = !isLogin;
    document.getElementById("title").innerText=isLogin? "Login":"Create User";
    document.getElementById("authBtn").innerText =isLogin ? "Login":"Create user";
    document.getElementById("new").innerText = isLogin ? "New User? Create here": "Already have an account? Login";
}


// Demo login ony (not secure)
function loginUser(){
    let username = document.getElementById("user").value;
    let password =document.getElementById("pass").value;
    if(isLogin){
        let existUser =JSON.parse(localStorage.getItem("user"));
        if(existUser && existUser.username === username && existUser.password === password)
        {
            localStorage.setItem("currentUser",username);
            localStorage.setItem("loggedIn","true");
            showDashboard(); 
        }
        else{
            alert("Invalid Credentials");
        }
    }
    else{
        localStorage.setItem("user",JSON.stringify({username,password}));
        alert("Registered Successfully");
        newUser();
    }
}

function showDashboard(){
    document.querySelector(".container").classList.add("hidden");
    document.querySelector(".dashboard").classList.remove("hidden");
    document.body.style.alignItems = "flex-start";
    document.body.style.paddingTop = "40px";

    let currentUser=localStorage.getItem("currentUser");
    document.getElementById("welcome").innerText=currentUser;
    loadTasks();
}

function addTask(){
    let title = document.getElementById("taskTitle").value;
    let assignedTo = document.getElementById("assignedTo").value;
    let dueDate =document.getElementById("dueDate").value;
   
    if(!title || !dueDate){
        alert("Title and Due date are required");
        return;
    }

    let currentUser =localStorage.getItem("currentUser");
    let tasks =JSON.parse(localStorage.getItem(currentUser + "_tasks")) || [];
    
    tasks.push({
        title,
        assignedTo,
        dueDate,
        status:"Pending"
    });
    localStorage.setItem(currentUser+"_tasks", JSON.stringify(tasks));
    document.getElementById("taskTitle").value = "";
    document.getElementById("assignedTo").value = "";
    document.getElementById("dueDate").value = "";

    loadTasks();
}

function loadTasks(){
    let currentUser=localStorage.getItem("currentUser");
    let tasks =JSON.parse(localStorage.getItem(currentUser+"_tasks")) || [];
    let list = document.getElementById("list");
    list.innerHTML = "";
    tasks.forEach((task ,index) => {
        let card =document.createElement("div");
       
        card.innerHTML = `
        <h4>${task.title}</h4>
        <p>Assigned: ${task.assignedTo}</p>
        <p>Due: ${task.dueDate}</p>
        <p>Status:<strong> ${task.status}</strong></p>
        <div class="stat-btn">
        <button onclick = "setStat(${index},'Pending')">Pending</button>
        <button onclick = "setStat(${index},'In Progress')">In Progress</button>
        <button onclick = "setStat(${index}, 'Completed')">Completed</button>
        </div>
        `;

        list.appendChild(card);
    });
}
function setStat(index, newStatus) {
    let currentUser = localStorage.getItem("currentUser");
    let tasks = JSON.parse(localStorage.getItem(currentUser+"_tasks")) || [];

    tasks[index].status = newStatus;

    localStorage.setItem(currentUser+"_tasks", JSON.stringify(tasks));
    loadTasks();
}


function logout(){
    localStorage.setItem("loggedIn","false");
    localStorage.removeItem("currentUser");

    document.querySelector(".dashboard").classList.add("hidden");
    document.querySelector(".container").classList.remove("hidden");
    document.body.style.alignItems = "center";
    document.body.style.paddingTop = "0";

}