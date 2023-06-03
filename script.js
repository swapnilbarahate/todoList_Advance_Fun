function addTask(button) {
    let bid = button.id;
    console.log("Inside the add function");
    let date = document.getElementById("date").value;
    let taskName = document.getElementById("taskName").value;
    let taskDesc = document.getElementById("taskDesc").value;
    console.log("data:", date, taskName, taskDesc);
    if (!date || !taskName || !taskDesc) {
        alert("please fill all fields");
    }
    else if (bid === 'saveData') {
        let uniqueId = "id" + Math.random().toString(16).slice(2);
        let newObj = {
            date,
            taskName,
            taskDesc,
            uniqueId
        }
        let newArray = [];
        newArray.push(newObj);
        let prevArray = localStorage.getItem('dataArray') ? JSON.parse(localStorage.getItem('dataArray')) : [];
        let value = prevArray.concat(newArray);
        localStorage.setItem('dataArray', JSON.stringify(value));
        prepareTable(value);
        document.getElementById("date").value = "";
        document.getElementById("taskName").value = "";
        document.getElementById("taskDesc").value = "";
    }
    else if (bid) {
        let prevArray = JSON.parse(localStorage.getItem('dataArray'));
        let newArray = prevArray.map(myFunction);
        function myFunction(ele) {
            if (ele.uniqueId === bid) {
                document.getElementById(ele.uniqueId).id = "saveData";
                document.getElementById('saveData').innerHTML = "ADD"
                document.getElementById('saveData').classList.remove("btn-update");
                ele.date = date;
                ele.taskName = taskName;
                ele.taskDesc = taskDesc;
                ele.uniqueId = ele.uniqueId;
            }
            return ele;
        }
        localStorage.setItem('dataArray', JSON.stringify(newArray));
        prepareTable(newArray);
        document.getElementById("date").value = "";
        document.getElementById("taskName").value = "";
        document.getElementById("taskDesc").value = "";
    }

}

function prepareTable(prevArray) {
    let row_num = 3;
    let table = document.getElementById('table1');

    for (var j = 3; j < table.rows.length;) {
        table.deleteRow(j);
    }
    for (let i = prevArray.length - 1; i >= 0; i--) {

        let row = table.insertRow(row_num);
        row.insertCell(0).innerHTML = prevArray[i].date;
        row.insertCell(1).innerHTML = prevArray[i].taskName;
        row.insertCell(2).innerHTML = prevArray[i].taskDesc;
        row.insertCell(3).innerHTML = '<input id ="' + prevArray[i].uniqueId + '" type="button" onclick = "updateRow1(this)" hidden class ="btn-update-icon" value ="&#9998; "> <input  type="button" id ="' + prevArray[i].uniqueId + '" onclick = "removeRow(this)" class ="btn-symbol btn-delete" value ="&#10007;"> ';
        row_num++;
        row.addEventListener("dblclick", function () {
            let targetCell = row.getElementsByTagName("td");
            targetCell[0].setAttribute('class', 'contentEditable bgcolor');
            targetCell[1].setAttribute('class', 'contentEditable bgcolor');
            targetCell[2].setAttribute('class', 'contentEditable bgcolor');
        });
        row.addEventListener("mouseout", function () {
            let targetCell = row.getElementsByTagName("td");
            targetCell[0].removeAttribute('class', 'contentEditable');
            targetCell[1].removeAttribute('class', 'contentEditable');
            targetCell[2].removeAttribute('class', 'contentEditable');
            let id = targetCell[3].innerHTML;
            id = id.slice(11, 26);
            updateRow1(targetCell[0].innerHTML, targetCell[1].innerHTML, targetCell[2].innerHTML, id);
        });
    }
}
function removeRow(button) {
    console.log("Inside the delete function");
    let bid = button.id;
    console.log("deleted id =", bid);

    let prevArray = JSON.parse(localStorage.getItem('dataArray'));
    console.log(prevArray);

    prevArray = prevArray.filter(ele => {
        if (ele.uniqueId != bid) {
            return ele;
        }
    })
    localStorage.setItem('dataArray', JSON.stringify(prevArray));
    prepareTable(prevArray);
}

window.onload = function () {
    let prevArray = JSON.parse(localStorage.getItem('dataArray'));
    prepareTable(prevArray);
};


function search(data) {
    if (!data) {
        let prevArray = JSON.parse(localStorage.getItem('dataArray'));
        prepareTable(JSON.parse(localStorage.getItem('dataArray')));
    }
    else {
        let txt = data.toUpperCase();
        let searchArray = JSON.parse(localStorage.getItem('dataArray'));
        searchArray = searchArray.filter(ele => {
            if (ele.taskName.toUpperCase().indexOf(txt) > -1 || ele.taskDesc.toUpperCase().indexOf(txt) > -1) {
                return ele;
            }
        });
        prepareTable(searchArray);
    }
}


function sortData(data) {
    let bid = data;
    console.log(bid);
    if (bid === 'sortTaskAse') {
        let prevArray = JSON.parse(localStorage.getItem('dataArray'));
        prevArray.sort(function (a, b) {
            if (a.taskName < b.taskName) {
                return -1;
            }
            if (a.taskName > b.taskName) {
                return 1;
            }
            return 0;
        });
        document.getElementById("sortTaskAse").id = "sortTaskDes";
        document.getElementById("sortTaskDes").innerHTML = "Task &#8657;";
        var element = document.getElementById("sortDateAse");
        if (element) {
            element.innerHTML = "Date"
        }
        else {
            document.getElementById("sortDateDes").innerHTML = "Date"
        }
        prepareTable(prevArray);
    }
    else if (bid === 'sortTaskDes') {
        let prevArray = JSON.parse(localStorage.getItem('dataArray'));
        prevArray.sort(function (b, a) {
            if (a.taskName < b.taskName) {
                return -1;
            }
            if (a.taskName > b.taskName) {
                return 1;
            }
            return 0;
        });
        document.getElementById("sortTaskDes").id = "sortTaskAse";
        document.getElementById("sortTaskAse").innerHTML = "Task &#8659;";
        var element = document.getElementById("sortDateAse");
        if (element) {
            element.innerHTML = "Date"
        }
        else {
            document.getElementById("sortDateDes").innerHTML = "Date"
        }
        prepareTable(prevArray);
    }
    else if (bid === 'sortDateAse') {

        let prevArray = JSON.parse(localStorage.getItem('dataArray'));
        prevArray.sort(function (a, b) {
            return new Date(b.date) - new Date(a.date);
        });
        document.getElementById("sortDateAse").id = "sortDateDes";
        document.getElementById("sortDateDes").innerHTML = "Date &#8657;";
        var element = document.getElementById("sortTaskAse");
        if (element) {
            element.innerHTML = "Task"
        }
        else {
            document.getElementById("sortTaskDes").innerHTML = "Task"
        }

        prepareTable(prevArray);
    }
    else if (bid === 'sortDateDes') {
        let prevArray = JSON.parse(localStorage.getItem('dataArray'));
        prevArray.sort(function (b, a) {
            return new Date(b.date) - new Date(a.date);
        });
        document.getElementById("sortDateDes").id = "sortDateAse";
        document.getElementById("sortDateAse").innerHTML = "Date &#8659;";
        var element = document.getElementById("sortTaskAse");
        if (element) {
            element.innerHTML = "Task"
        }
        else {
            document.getElementById("sortTaskDes").innerHTML = "Task"
        }
        prepareTable(prevArray);
    }
}

function edit(button) {
    console.log("update function");
    let bid = button.id;
    console.log("update id =", bid);
    let prevArray = JSON.parse(localStorage.getItem('dataArray'));
    const newArr = prevArray.map(myFunction);
    function myFunction(ele) {
        if (ele.uniqueId === bid) {
            console.log("Hello :", ele.taskName, ele.taskDesc, ele.uniqueId);
            document.getElementById('date').value = ele.date;
            document.getElementById('taskName').value = ele.taskName;
            document.getElementById('taskDesc').value = ele.taskDesc;
            var addbtn = document.getElementById("saveData");
            if (addbtn) {
                document.getElementById("saveData").id = ele.uniqueId;
                document.getElementById(ele.uniqueId).innerHTML = "Update";
                document.getElementById(ele.uniqueId).classList.add("btn-update");
                const temp = document.querySelectorAll(".btn-update-icon");
                for (var i = 0; i < temp.length; i++) {
                    temp[i].style.display = 'none';
                }

            }

        }
        return ele;
    }

}

function updateRow1(date, taskName, taskDesc, bid) {
   
    let prevArray = JSON.parse(localStorage.getItem('dataArray'));
    if (taskName && taskDesc && bid && date) {
        let isValidDateFormat1 = isValidDateFormat(date);
        if (!isValidDateFormat1) {
            alert("Please fill correct date.");
            prepareTable(prevArray);

        } else {
            let newArray = prevArray.map(ele => {
                if (ele.uniqueId === bid) {
                    ele.date = date;
                    ele.taskName = taskName;
                    ele.taskDesc = taskDesc;
                    ele.uniqueId = ele.uniqueId;
                }
                return ele;
            });
            localStorage.setItem('dataArray', JSON.stringify(newArray));
        }
    }
    else {
        alert("Please fill correct data");
        prepareTable(prevArray);
    }


}


function isValidDateFormat(dateString) {
    var pattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!pattern.test(dateString)) {
        return false;
    }
    return true;
}
