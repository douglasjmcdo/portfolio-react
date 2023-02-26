#
# JSON IMPORT
#
import json
jsondata = json.load(open('../portfolio-site/src/data.json'))


#
# READ ALL FILE NAMES IN IMG INTO THE LIST filearray
#
import glob
import os
filearray = []
initlen = 0
rootdirectory = "../portfolio-site/public/img/**"

for filename in glob.iglob(rootdirectory, recursive=True):
    root, ext = os.path.splitext(filename)
    if ext != "":
        # format the file path to match how it appears in data.json
        filearray.append(".." + filename[24:].replace('\\', '/'))

initlen = len(filearray)
print("filearray", initlen)

# checking for duplicate imports: i think i solved this bug though
dupes = [entry for entry in filearray if filearray.count(entry) > 1]
dupes = list(set(dupes))
print(dupes)



#
# COMPARE JSONDATA TO FILE LIST
#
leftover = []
indcount = 0
minindex = 0
for entry in jsondata['entries']:

    #find the highest index value in order to avoid dupes while generating
    if entry["id"] >= minindex:
        minindex = entry["id"] + 1
    
    if entry["type"] == "individual":
        indcount += 1
        #for each individual entry, find the matching file in the filearray and pop it
        if entry["img"] in filearray:
            filearray.remove(entry["img"])
        else:
            print("this json img is not in filearray. adding entry to leftover array")
            leftover.append(entry)

    else:
        print("NOT AN INDIVIDUAL ENTRY. MAYBE CHECK FOR A HEADER BUT OTHERWISE LEAVE HER ALONE")

print("FILE ARRAY SHOULD NOW ONLY CONTAIN IMAGES THAT ARE NOT INCLUDED IN JSON.")
print(leftover)
print(filearray)
print(len(filearray))


#
#GUI SETUP
#
from tkinter import *
from PIL import ImageTk, Image
import math
root = Tk()
root.title("PORTFOLIO: IMAGE IMPORTER")
root.geometry('650x550')
currentimg = -1

header = Label(root, text = "This app helps fill out information about new images for the portfolio app! \
First, this app will compare the contents of data.json to the file names available in public/img.\
Then, it will inform you of any discrepancies between the two lists \
and give you the opportunity to add or remove entries from data.json accordingly.",
    background="green", wraplength=600)
header.grid(columnspan=3)

jsontest = Label(root, 
                text = "it looks like json.data is " + str(indcount) + " entries long (excluding subpages) and there are " + str(initlen) + " files in the img directory",
                background="yellowgreen", wraplength=300)
jsontest.grid(column=1, row=1)

filetest = Label(root, text="unprocessed file list: " + str(len(filearray)),
            background="orange")
filetest.grid(column=1, row=2)

showimg = Label(root, text="show image here!",
                background="yellow", borderwidth=2)
showimg.grid(column=1, row=4)

def showclick():
    global currentimg
    #SAFETY CHECK: we've hit end of filearray
    if currentimg >= len(filearray) - 1:
        print("END OF FILEARRAY")
        showimg.configure(image="")
        showimg.configure(text="no more images!")
        showbtn.configure(text="back to start?", command=resetclick)
        submitbtn.grid_forget()


        return

    currentimg += 1
    print(currentimg)
    if currentimg == 0:
        submitbtn.grid(column=1, row=3)
        showimg.configure(text="now showing image")
        showimg.grid(column=0, columnspan=3)
        showbtn.configure(text="next image")

    print("in showclick for img ", currentimg)
    imgpath = "../portfolio-site/public" + filearray[currentimg][2:]

    #SAFETY CHECK: it's not displayable as an image
    pathext = imgpath.split(".").pop()
    allowedextensions = ["png", "jpg", "jpeg", "gif"]
    if pathext not in allowedextensions:
        print(imgpath, "IS NOT AN IMAGE")
        showimg.configure(image="", text="IT'S NOT AN IMAGE")
        return

    imgis = Image.open(imgpath)
    imgis = imgis.convert("RGB")
    # keep image under 500px in any direction
    while (imgis.width > 1000 or imgis.height > 1000):
        imgis = imgis.resize((imgis.width // 2, imgis.height // 2))
    while (imgis.width > 400 or imgis.height > 400):
        imgis = imgis.resize((math.ceil(imgis.width / 1.2), math.ceil(imgis.height / 1.2) ))
    print("SHRUNK TO: ", imgis.width, imgis.height)
    newimg = ImageTk.PhotoImage(imgis)
    showimg.configure(image=newimg)
    showimg.image = newimg #images wont show up without this!

def resetclick():
    global currentimg
    currentimg = -1
    showbtn.configure(command=showclick)
    showclick()

def submitclick():
    global currentimg
    #SAFETY CHECK: must be on a valid entry in filearray
    if currentimg < 0:
        print("NO IMAGE VIEWED YET")
        return
    elif currentimg >= len(filearray) - 1:
        print("OUT OF BOUNDS")
        return

    global minindex
    newsubmit = {
        "id": minindex,
        "title": "input field",
        "type": "individual",
        "medium": ["input field", "checkboxes for pre-existing", "minimum 1 required"],
        "industry": ["same as medium"],
        "insubpage": ["same as medium but none required"],
        "onmainpage": "checkbox",
        "date": "use today or allow older input",
        "img": filearray[currentimg],
        "alt": "text field",
        "caption": "text field"
    }
    thejson = json.dumps(newsubmit)
    print(thejson)


    filearray.pop(currentimg)
    currentimg -= 1 #to account for filearray shrinking
    minindex += 1

    filetest.configure(text="unprocessed file list: " + str(len(filearray)))

    showclick()


showbtn = Button(root, width=25, text="show unprocessed image", fg="purple", command=showclick)
showbtn.grid(column=0, row=3)

resetbtn = Button(root, width=25, text="back to 1st unprocessed img", fg="blue", command=resetclick)
resetbtn.grid(column=2, row=3)

submitbtn = Button(root, width=25, text="FAKE SUBMIT", fg="green", command=submitclick)

root.mainloop()