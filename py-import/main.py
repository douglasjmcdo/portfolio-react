#
# JSON IMPORT
#
import json
jsondata = ""
with open('../portfolio-site/src/data.json', "r") as datafile:
    jsondata = json.load(datafile)

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
mediumarray = {}
industryarray = {}
insubpagearray = {}

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

        #compile all current mediums in mediumarray
        for x in entry["medium"]:
            if x not in mediumarray:
                print(x)
                mediumarray[x] = 0
        
        for y in entry["industry"]:
            if y not in industryarray:
                industryarray[y] = 0

        for z in entry["insubpage"]:
            if z not in insubpagearray:
                insubpagearray[z] = 0

    else:
        print("NOT AN INDIVIDUAL ENTRY. MAYBE CHECK FOR A HEADER BUT OTHERWISE LEAVE HER ALONE")

print("FILE ARRAY SHOULD NOW ONLY CONTAIN IMAGES THAT ARE NOT INCLUDED IN JSON.")

#
#GUI SETUP
#
from tkinter import *
from tkcalendar import DateEntry
from PIL import ImageTk, Image
import math
root = Tk()
root.title("PORTFOLIO: IMAGE IMPORTER")
root.geometry('950x500')
currentimg = -1

#
# GUI HEADER
#
header = Label(root, text = "This app helps fill out information about new images for the portfolio app! \
First, this app will compare the contents of data.json to the file names available in public/img.\
Then, it will inform you of any discrepancies between the two lists \
and give you the opportunity to add or remove entries from data.json accordingly.",
    background="yellow", wraplength=600)
header.grid(columnspan=4)

jsontest = Label(root, 
                text = "it looks like json.data is " + str(indcount) + " entries long (excluding subpages) and there are " + str(initlen) + " files in the img directory",
                background="yellowgreen", wraplength=300)
jsontest.grid(column=1, columnspan=2, row=1)

filetest = Label(root, text="unprocessed file list: " + str(len(filearray)),
            background="orange")
filetest.grid(column=1, columnspan=2, row=2)

#
# GUI IMAGE
#
showimg = Label(root, image="", width=40, height=20, padx=5, pady=5,
                background="grey", borderwidth=2, relief='flat')
showimg.grid(column=3, row=4)

#
# FILEARRAY NAVIGATION
#
#go to the next entry in filearray
def showclick():
    global currentimg
    #SAFETY CHECK: we've hit end of filearray
    if currentimg >= len(filearray) - 1:
        print("END OF FILEARRAY")
        showimg.configure(image="")
        showbtn.configure(text="back to start?", command=resetclick)
        theform.grid_forget()


        return

    currentimg += 1

    #starting display: configure buttons accordingly
    if currentimg == 0:
        showimg.configure(text="now showing image", width=300, height=300, padx=5, pady=5)
        # showimg.grid(column=0, columnspan=3)
        showbtn.configure(text="skip this image")
        theform.grid(column=0, row=4, columnspan=3)

    print("in showclick for img ", currentimg)
    imgpath = "../portfolio-site/public" + filearray[currentimg][2:]

    #SAFETY CHECK: it's not displayable as an image
    pathext = imgpath.split(".").pop()
    allowedextensions = ["png", "jpg", "jpeg", "gif"]
    if pathext not in allowedextensions:
        showstr = imgpath + " is not an image"
        print(showstr)
        showimg.configure(image="", text=showstr)
        showclick()
        return

    #display new image
    imgis = Image.open(imgpath)
    imgis = imgis.convert("RGB")
    # shrink image to under 300px in any direction
    while (imgis.width > 600 or imgis.height > 600):
        imgis = imgis.resize((imgis.width // 2, imgis.height // 2))
    while (imgis.width > 300 or imgis.height > 300):
        imgis = imgis.resize((math.ceil(imgis.width / 1.2), math.ceil(imgis.height / 1.2) ))
    newimg = ImageTk.PhotoImage(imgis)
    showimg.configure(image=newimg)
    showimg.image = newimg #images wont show up without this!
    #make sure the form title updates also
    theform.etitle.updatetitle()
    theform.eurlstring.configure(text="IMAGE: " + filearray[currentimg])

#return to the first entry in filearray
def resetclick():
    global currentimg
    currentimg = -1
    showbtn.configure(command=showclick)
    showclick()

#
# FORM
#

#Fentry: for title, caption, alt, and any other text entry
class Fentry(Frame):
    def __init__(self, parent, label, default=""):
        Frame.__init__(self, parent)

        self.label = Label(self, text=label, anchor="w", width=15)
        self.entry = Entry(self, width=20)
        if label=="caption:" or label=="alt:" :
            self.entry.configure(width=75)
        self.entry.insert(0, default)

        self.label.pack(side="left")
        self.entry.pack(side="right", padx=4)

    def get(self):
        return self.entry.get()

    def updatetitle(self):
        global minindex
        self.entry.delete(0, END)
        newtitle = filearray[currentimg].split("/").pop().split(".")[0]
        self.entry.insert(0, newtitle)
    
    def updatelabel(self):
        self.entry.delete(0, END)
        self.entry.insert(0, "new tag,new tag")

    def clearcaption(self):
        self.entry.delete(0, END)
        self.entry.insert(0, "no caption")

    def clearalt(self):
        self.entry.delete(0, END)
        self.entry.insert(0, "no alt text available")

#Checkset: for medium, industry, insubpage
class Checkset(Frame):
    def __init__(self, parent, set, title, default=False):
        self.tf = set
        Frame.__init__(self, parent)
        self.fentry = Fentry(self, "new " + title + ": ", "new tag,new tag")
        self.fentry.grid(row=0, column=0, sticky="w")


        #make list of checkboxes based on passed in set and grid them in rows of 4
        for idx, item in enumerate(self.tf):
            self.tf[item] = BooleanVar()
            x = Checkbutton(self, text=item, variable=self.tf[item])
            letrow = ((idx) // 4) 
            letcol = ((idx) % 4) + 1
            x.grid(row=letrow, column=letcol, sticky="w")

    def get(self):
        #returns an array based on the checkbuttons...
        retlist = []
        for item in self.tf:
            if self.tf[item].get() != 0:
                retlist.append(item)
        
        #...and fentry tags
        if self.fentry.get() != "new tag,new tag":
            newtags = self.fentry.get().split(",")
            print(newtags)
            for tag in newtags:
                retlist.append(tag)
            
                #also, add that new tag to the checkbox collection for future entries
                self.tf[tag] = BooleanVar()
                x = Checkbutton(self, text=tag, variable=self.tf[tag] )
                letrow = ((len(self.tf) - 1) // 4)
                letcol = ((len(self.tf) - 1) % 4) + 1
                x.grid(row=letrow, column=letcol, sticky="w")

        return retlist

    #clears all checkboxes and the fentry
    def clear(self):
        for item in self.tf:
            self.tf[item].set(False)
        self.fentry.updatelabel()

#TheForm: The Beast Itself
class TheForm(Frame):
    def __init__(self, parent):
        Frame.__init__(self, parent, padx=5, pady=5, bg="teal")

        #MAKE ALL PARTS OF THEFORM
        self.eurlstring = Label(self, text=("IMAGE: " + filearray[currentimg]), wraplength=450)
        self.eurlstring.grid(row=0, column=0, sticky="ew")

        newtitle = filearray[currentimg].split("/").pop().split(".")[0]
        self.etitle = Fentry(self, "Title:", newtitle)
        self.etitle.grid(row=1, column=0, sticky="w")

        self.emedium = Checkset(self, mediumarray, "medium")
        self.emedium.grid(row=2, column=0, sticky="ew")

        self.eindustry = Checkset(self, industryarray, "industry")
        self.eindustry.grid(row=3, column=0, sticky="ew")

        self.esubpage = Checkset(self, insubpagearray, "insubpage")
        self.esubpage.grid(row=4, column=0)

        self.omp = BooleanVar()
        self.eomp = Checkbutton(self, text="onmainpage", variable=self.omp)
        self.eomp.grid(row=5, column=0, sticky="w")

        self.ecaption = Fentry(self, "caption:", "no caption")
        self.ecaption.grid(row=6, column=0, sticky="w")
        
        self.ealt = Fentry(self, "alt:", "no alt text available")
        self.ealt.grid(row=7, column=0, sticky="w")

        self.edate = DateEntry(self, selectmode = 'day')
        self.edate.grid(row=8, column=0, sticky="w")

        self.submitButton = Button(self, text="Submit and Next Image", command=self.submit)
        self.submitButton.grid(row=9, column=0, sticky="e")

        self.skipButton = Button(self, text="Clear form", command=self.clear, fg="red")
        self.skipButton.grid(row=9, column=0, sticky="w")

        self.grid_columnconfigure(0, weight=1)
        self.grid_rowconfigure(2, weight=1)

    #on clicking submit, append new data to the json and move on
    def submit(self):
        #SAFETY CHECK: must be on a valid entry in filearray
        global currentimg
        if currentimg < 0:
            print("NO IMAGE VIEWED YET")
            return
        elif currentimg > len(filearray) - 1:
            print("OUT OF BOUNDS")
            return

        #gather all the relevant variables for json dump
        global minindex

        title = self.etitle.get()
        caption = self.ecaption.get()
        alt = self.ealt.get()
        onmainpage = self.omp.get()
        date = str(self.edate.get_date())
        print(date)

        medium = self.emedium.get()
        self.emedium.clear()

        industry = self.eindustry.get()
        self.eindustry.clear()

        insubpage = self.esubpage.get()
        self.esubpage.clear()
        
        #the json dump
        newsubmit = {
            "id": minindex,
            "title": title,
            "type": "individual",
            "medium": medium,
            "industry": industry,
            "insubpage": insubpage,
            "onmainpage": onmainpage,
            "date": date,
            "img": filearray[currentimg],
            "alt": alt,
            "caption": caption
        }
        
        #thejson = json.dump(newsubmit)
        with open('../portfolio-site/src/data.json', "r+") as datafile:
            ogdata = json.load(datafile)
            ogdata["entries"].append(newsubmit)
            datafile.seek(0)
            json.dump(ogdata, datafile, indent=4)
            

        #json has been submitted: now we remove relevant image from the list and move on
        filearray.pop(currentimg)
        currentimg -= 1 #to account for filearray shrinking
        minindex += 1

        #numbers have been updated: now update relevant displays
        filetest.configure(text="unprocessed file list: " + str(len(filearray)))
        showclick()

    #clear form fields
    def clear(self):
        self.emedium.clear()
        self.eindustry.clear()
        self.esubpage.clear()
        self.etitle.updatetitle()
        self.omp.set(False)
        self.ecaption.clearcaption()
        self.ealt.clearalt()

#
# GUI: FORM AREA
#
showbtn = Button(root, width=25, text="show unprocessed image", fg="purple", command=showclick)
showbtn.grid(column=0, row=3)

resetbtn = Button(root, width=25, text="back to 1st unprocessed img", fg="blue", command=resetclick)
resetbtn.grid(column=3, row=3)

theform = TheForm(root)
root.mainloop()