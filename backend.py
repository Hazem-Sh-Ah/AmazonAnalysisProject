#Necessary libraries: flask, pandas, os, json, hashlib
#flask: Back-end server, Processes requests
#pandas: Loading csv data, Analysing csv data
#os: Manages directories in the file system for files and images
#json: Reading and writing to json files
#hashlib: Hashing functions used for passwords

from flask import Flask, render_template, request
import pandas as pd
import os
import json
from hashlib import sha256 

#Reading amazon_dataset_2.csv
#CSV structure

# Columns: Index name main_category sub_category image link ratings no_of_ratings discount_price actual_price   
# Size: 9 columns (excl. Index) X 669972 rows

amazon_data = pd.read_csv("amazon_dataset_2.csv")

group = amazon_data.groupby("main_category")["actual_price"].mean()

cat = ["Appliances", "Bags & Luggage", "Beauty & Health", "Car & Motorbike", "Grocery & Gourmet Foods", "Home, Kitchen, Pets", 
       "Industrial Supplies", "Kids' Fashion", "Men's Clothing", "Men's Shoes", "Music", "Pet Supplies", "Sports & Fitness", 
       "Stores", "TV, Audio & Cameras", "Women's Clothing", "Women's Shoes"]

def filter_group(n):
    d = {}
    for i in list(group.keys())[:n]:
        d[i] = group[i]
    return d    

group = dict(group)
template_dir = os.path.abspath("../templates") 
static_dir = os.path.abspath("../static") 


#Routing to various directories on the website
app = Flask(__name__)

#Home page
@app.route("/")
def index():
    return render_template("index.html")

#Finding required info on data, for example if request is "mean-p", the client is looking for the mean price category
def generate_data(data):
    base_group = amazon_data.groupby("main_category")
    comp = data["compare"]
    if comp == "mean-p":
        base_group = base_group["actual_price"].mean()
    elif comp == "med-p":
        base_group = base_group["actual_price"].median()
    elif comp == "mean-r":
        base_group = base_group["ratings"].mean()
    elif comp == "med-r":
        base_group = base_group["ratings"].median()
    elif comp == "mean-nr":
        base_group = base_group["no_of_ratings"].mean()
    else:
        base_group = base_group["no_of_ratings"].median()
    d = {}
    for i in cat:
        if data[i] == "true":
            d[i.lower()] = base_group[i.lower()]
    return d

#Functions specific to generating scatter data
def generate_scatter_data(data):
    categories = {"price": "actual_price", "discount": "discount_price", "rating": "ratings", 
    "n-rating": "no_of_ratings"}
    x_val = data["compare-x"]
    y_val = data["compare-y"]
    x_cat = categories[x_val]
    y_cat = categories[y_val]

    first_x = amazon_data[x_cat].values
    first_y = amazon_data[y_cat].values

    zip_list = []

    for i in range(0, len(first_x), 700):
        zip_list.append({"x": first_x[i], "y": first_y[i]})
    
    return zip_list

#Loging in function
def log_func(user, password):
    ac = ""
    #open database file
    with open("database.json", "r") as f:
        data = json.load(f)
        try:
            d = data["data"][user]
            p = sha256(bytes(password, "utf-8")).hexdigest()
            if not data["data"][user] == p: 
                return "Incorrect"
        except:
            return "User does not exist"
    
    #open second database file
    with open("col.json", "r") as f:
        data = json.load(f)
        col_data = data[user]
        return col_data
    
#Sign in function
def sign_func(user, password, col):
    data_read = ""
    data_read_2 = ""

    #Reading database
    with open("database.json", "r") as f:
        data_read = json.load(f)

    #Writing to database    
    with open("database.json", "w+") as f:
        try:
            d = data_read["data"][user]
            json.dump(data_read, f)
            return "User exists"
        except:
            data_read["data"][user] = sha256(bytes(password, "utf-8")).hexdigest()
            json.dump(data_read, f)

    #Reading second database     
    with open("col.json", "r") as f:
        data_read_2 = json.load(f)

    #Writing to second database     
    with open("col.json", "w+") as f:
        data_read_2[user] = col
        json.dump(data_read_2, f)
        return "User Added"

#Route for requesting graph data
@app.route("/create", methods=["POST"])
def create_graph():
    if (request.json)["type"] != "scatter":
        return generate_data(request.json)
    return generate_scatter_data(request.json)

#Route for logging in ot signing up
@app.route("/account", methods=["POST"])
def account():
    req = request.json
    resp = ""
    if req["type"] == "log":
        resp = log_func(req["user"], req["pass"])
    else:
        resp = sign_func(req["user"], req["pass"], req["col"])
    return {"req": req["type"], "message": resp}

def search_item_func(name, cat, num):
    sub_group = amazon_data[amazon_data["sub_category"] == cat]
    l = []
    l2 = []
    for i in sub_group["name"]:
        if name.lower() in i.lower():
            l.append(i)
    
    for i in l:
        s = sub_group[sub_group["name"] == i]
        s.index = [i for i in range(len(s))]
        f = s.loc[0]
        l2.append({"name": f["name"], "image": f["image"], "link": f["link"], "price": f["actual_price"]})

    l2 = l2[:num]

    return {"items": l2}

@app.route("/search",  methods=["POST"])
def search_item():
    req = request.json
    return search_item_func(req["name"], req["cat"], int(req["num"]))

#Main loop
if __name__ == "__main__":
    app.run(debug=True)