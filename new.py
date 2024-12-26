import pandas

s = "Wood"

d = pandas.read_csv("amazon_dataset_2.csv")
d = d[d["sub_category"] == "Furniture"]


l = []
for i in d["name"]:
    if s.lower() in i.lower():
        l.append(i)

d2 = d[d["name"] == l[0]]
tl = len(d2)
d2.index = [i for i in range(tl)]

print(d2.loc[0])  