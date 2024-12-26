let but = document.querySelector(".but")
let log = document.querySelector(".log")
let login = document.querySelector(".log-in")
let user_inp = document.querySelector("#username") 
let pass_inp = document.querySelector("#pass") 
let log_but = document.querySelector("#log-but") 
let sign_but = document.querySelector("#sign-but") 
let col = document.querySelector("#col")

let close_but = document.querySelector(".close")
let li1 = document.querySelector(".li-1")
let li2 = document.querySelector(".li-2")
let li3 = document.querySelector(".li-3")
let li4 = document.querySelector(".li-4")
let amazon_data;
let but_count = 1;
const cjs = window.d3;

let user_col;

log.addEventListener("click", () => {
    if (login.classList.contains("off")) {
        login.classList.remove("off")
    }
})

function sendAccount(req, user, pass) {
    let data_form = {};
    data_form["type"] = req 
    data_form["user"] = user 
    data_form["pass"] = pass
    if (req == "sign") {
        data_form["col"] = col.value
    }
    fetch("/account", {
        method: "POST",
        body: JSON.stringify(data_form),
        headers:{'content-type': 'application/json'}
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('API request failed');
            }
        })
        .then(data => {
            if (data["req"] == "sign") {
                if (data["message"] == "User exists") {
                    alert("User already exists")
                } else {
                    alert("User added, color of graph added")
                    user_col = col.value
                }
            } else {
                if (data["message"] == "Incorrect") {
                    alert("Incorrect password")
                } else if (data["message"] == "User does not exist") {
                    alert("User does not exist")
                } else {
                    user_col = data["message"]
                    alert("Hello " + user)
                }
            }
        })  
}

log_but.addEventListener("click", () => sendAccount("log", user_inp.value, pass_inp.value))
sign_but.addEventListener("click", () => sendAccount("sign", user_inp.value, pass_inp.value))

close_but.addEventListener("click", () => {
    login.classList.add("off")
})

li1.addEventListener("click", () => {
    if (li2.classList.contains("active")) {li2.classList.remove("active")}
    if (li3.classList.contains("active")) {li3.classList.remove("active")}
    if (li4.classList.contains("active")) {li4.classList.remove("active")}
    li1.classList.add("active")
    window.location.href = "/#"
})

li2.addEventListener("click", () => {
    if (li1.classList.contains("active")) {li1.classList.remove("active")}
    if (li3.classList.contains("active")) {li3.classList.remove("active")}
    if (li4.classList.contains("active")) {li4.classList.remove("active")}
    li2.classList.add("active")
    window.location.href = "/#ser"
})

li3.addEventListener("click", () => {
    if (li2.classList.contains("active")) {li2.classList.remove("active")}
    if (li1.classList.contains("active")) {li1.classList.remove("active")}
    if (li4.classList.contains("active")) {li4.classList.remove("active")}
    li3.classList.add("active")
    window.location.href = "/#arch"
})

li4.addEventListener("click", () => {
    if (li2.classList.contains("active")) {li2.classList.remove("active")}
    if (li3.classList.contains("active")) {li3.classList.remove("active")}
    if (li1.classList.contains("active")) {li1.classList.remove("active")}
    li4.classList.add("active")
    window.location.href = "/#doc"
})

const canvas = document.querySelector('.chart1')
const ctx = canvas.getContext("2d");   
const canvas2 = document.querySelector('.chart2')
const ctx2 = canvas2.getContext("2d");   
let chart1;
let chart2;

gradient = ctx.createLinearGradient(500, 0, 1000, 0)
gradient.addColorStop(0, "#6A82FB")
gradient.addColorStop(1, "#FC5C7D")


let checkList = document.getElementById('list1');
let items = document.querySelector(".items")
checkList.addEventListener("click", () => {
  if(!(items.matches(":hover"))) {
    if (checkList.classList.contains('visible'))
        checkList.classList.remove('visible');
    else
        checkList.classList.add('visible');
    }
})

let first_select = document.getElementById("category")
let compare = document.getElementById("compare")
let comparex = document.getElementById("compare-x")
let comparey = document.getElementById("compare-y")

let sc1 = document.querySelector(".sc-1")
let sc2 = document.querySelector(".sc-2")
let sc3 = document.querySelector(".sc-3")
let sc4 = document.querySelector(".sc-4")
let sc5 = document.querySelector(".sc-5")

first_select.addEventListener("change", () => {
    if ((first_select.value == "bar") | (first_select.value == "pie")) {
        if (sc2.classList.contains("hide")) {
            sc4.classList.add("hide")
            sc5.classList.add("hide")
            sc2.classList.remove("hide")
            sc3.classList.remove("hide")
        }
    } else {
        sc2.classList.add("hide")
        sc3.classList.add("hide")
        sc4.classList.remove("hide")
        sc5.classList.remove("hide")
    }
})

// Section for creating bar graph
function create_bar_graph(data, title) {
    let new_col = gradient;
    if (user_col) {
        new_col = user_col
    }

    //delete existing chart
    if (chart1) {chart1.destroy()}
    amazon_data = data;
    delete amazon_data["home & kitchen"]
    // new chart added
    chart1 = new Chart(ctx, {
        type: 'bar',
        data: {
            datasets: [{
                data: amazon_data,
                label: title,
                backgroundColor: new_col
            }]
        },
        options: {
            plugins: {
                legend: {                    
                    labels: {
                        color: "#E6E6E6",
                        font: {
                            size: 13
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: "#E6E6E6"
                    },
                    title: {
                        display: true,
                        text: "Category",
                        font: {
                            size: 14
                        },
                        color: "#E6E6E6"
                    }
                },
                y: {
                    ticks: {
                        color: "#E6E6E6"
                    },
                    title: {
                        display: true,
                        text: title,
                        font: {
                            size: 14
                        },
                        color: "#E6E6E6"
                    }
                }
            }
        }
    }) 
}

// Section for creating pie graph
function create_pie_graph(data, title) {
    let new_col = gradient;
    if (user_col) {
        new_col = user_col
    }

    // delete  existing chart
    if (chart1) {chart1.destroy()}
    amazon_data = data;
    delete amazon_data["home & kitchen"]
    let vals = []
    let labels = []

    for (const [key, val] of Object.entries(data)) {
        labels.push(key)
        vals.push(val)
    }

    // new chart added
    chart1 = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: vals,
                label: title,
                backgroundColor: new_col
            }]
        }
    }) 
}

// Section for creating scatter graph
function create_scatter_graph(data, title_x, title_y) {
    let new_col = gradient;
    if (user_col) {
        new_col = user_col
    }

    // delete  existing chart
    if (chart1) {chart1.destroy()}
    amazon_data = data;
    delete amazon_data["home & kitchen"]
    // new chart added
    chart1 = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                data: amazon_data,
                label: title_x + "-" + title_y,
                backgroundColor: new_col
            }]
        },
        options: {
            plugins: {
                legend: {                    
                    labels: {
                        color: "#E6E6E6",
                        font: {
                            size: 13
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: "#E6E6E6"
                    },
                    title: {
                        display: true,
                        text: title_x,
                        font: {
                            size: 14
                        },
                        color: "#E6E6E6"
                    }
                },
                y: {
                    ticks: {
                        color: "#E6E6E6"
                    },
                    title: {
                        display: true,
                        text: title_y,
                        font: {
                            size: 14
                        },
                        color: "#E6E6E6"
                    }
                }
            }
        }
    }) 
}

function sendFormData() {
    select_val = first_select.value
    data_form = {"type": select_val}
    if ((select_val == "bar") | (select_val == "pie")) {
        comp_val = compare.value
        data_form["compare"] = comp_val
        let lis = items.children;
        for (const element of lis) {
            t_content = element.textContent
            val = element.children[0].checked
            val = val.toString()
            data_form[t_content] = val
        };
        fetch("/create", {
            method: "POST",
            body: JSON.stringify(data_form),
            headers:{'content-type': 'application/json'}
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('API request failed');
                }
            })
            .then(data => {
                canvas.style.margin = "0 0 20vh 0"
                titles = {"mean-p": "Mean Price of Item", "med-p": "Median Price of Item", 
                "mean-r": "Mean Rating of Item", "med-r": "Median Rating of Item", 
                "mean-nr": "Mean No. of Ratings", "med-nr": "Median No. of Ratings"}
                if (select_val == "bar") {
                    create_bar_graph(data, titles[comp_val])
                } else if (select_val == "pie") {
                    create_pie_graph(data, titles[comp_val])
                }
            })
    } else {
        data_form["compare-x"] = comparex.value
        data_form["compare-y"] = comparey.value
        fetch("/create", {
            method: "POST",
            body: JSON.stringify(data_form),
            headers:{'content-type': 'application/json'}
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('API request failed');
                }
            })
            .then(data => {
                create_scatter_graph(data, comparex.value, comparey.value)
            })
    }
}

function generateComparison() {
    chart2 = new Chart(ctx2, {
        type: 'bar',
        data: {
            datasets: [{
                data: {"Min Rating": 10.0, "Max Rating": 299.0, "Mean Rating": 38.14851665442735,
                "Median Rating": 39.0},
                label: "Rating of item",
                backgroundColor: gradient
            }]
        },
        options: {
            plugins: {
                legend: {                    
                    labels: {
                        color: "#E6E6E6",
                        font: {
                            size: 13
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: "#E6E6E6"
                    },
                    title: {
                        display: true,
                        text: "Category",
                        font: {
                            size: 14
                        },
                        color: "#E6E6E6"
                    }
                },
                y: {
                    ticks: {
                        color: "#E6E6E6"
                    },
                    title: {
                        display: true,
                        text: "Mean Price",
                        font: {
                            size: 14
                        },
                        color: "#E6E6E6"
                    }
                }
            }
        }
    })
}

but.addEventListener("click", ()=> {sendFormData()})
generateComparison()

let search_bar = document.querySelector(".search-inp")
let search_cat = document.getElementById("search")
let num_inp = document.querySelector(".num-inp")
let results = document.querySelector(".results")

function searchItem() {
    let data_form = {"name": search_bar.value, "cat": search_cat.value, "num": num_inp.value}
    fetch("/search", {
        method: "POST",
        body: JSON.stringify(data_form),
        headers:{'content-type': 'application/json'}
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('API request failed');
            }
        })
        .then(data => {
            items = data["items"]
            num_val = num_inp.value

            results.innerHTML = "";
            for (let i = 0; i < num_val; i++) {
                let elm = document.createElement("div");
                elm.textContent = items[i]["name"]
                elm.addEventListener("click", () => {window.open(items[i]["link"], "_blank")})
                elm.classList.add("result")
                results.appendChild(elm)
            }
        })
}

search_bar.addEventListener("keydown", (e) => {
    if (e.keyCode == 13) {
        searchItem();
    }
})