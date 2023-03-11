#
# JSON IMPORT
#
import json
jsondata = ""
ignoredata = ""
with open('../portfolio-site/src/data.json', "r") as datafile:
    jsondata = json.load(datafile)

with open('../portfolio-site/src/ignore.json', "r") as datafile:
    ignoredata = json.load(datafile)

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
currentsubpages = []
missingsubpages = []

for entry in ignoredata["img"]:
    if entry in filearray:
        filearray.remove(entry)
        
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
            if x not in mediumarray and x not in ignoredata["img"]:
                print(x)
                mediumarray[x] = 0
        
        for y in entry["industry"]:
            if y not in industryarray and y not in ignoredata["img"]:
                industryarray[y] = 0

        for z in entry["insubpage"]:
            if z not in insubpagearray and z not in ignoredata["img"]:
                insubpagearray[z] = 0

    else:
        if entry["type"] == "collection":
            #print("IT'S A COLLECTION. NOTE ITS URL")
            currentsubpages.append(entry["url"])
        else:
            print("ENTRY IS A DOC PAGE. NOTE ANY BOARDS NAMED IN ITS TEMPLATE")
            for e in entry["template"]:
                if e[0] == "board":
                    print(e)
                    currentsubpages.append(e[1])


print("FILE ARRAY SHOULD NOW ONLY CONTAIN IMAGES THAT ARE NOT INCLUDED IN JSON.")

for entry in insubpagearray.keys():
    if entry not in currentsubpages and entry not in ignoredata["subpage"]:
        missingsubpages.append(entry)



print("EXISTING SUBBOARDS:", currentsubpages)
print("MISSING SUBBOARDS:", missingsubpages)

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

filetest = Label(root, text="unprocessed file list: " + str(len(filearray)) + "\
                 missing subpage list: " + str(len(missingsubpages)),
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
        resetbtn.grid_forget()
        return

    currentimg += 1

    #starting display: configure buttons accordingly
    if currentimg == 0:
        showimg.configure(text="now showing image", width=300, height=300, padx=5, pady=5)
        # showimg.grid(column=0, columnspan=3)
        showbtn.configure(text="skip this image")
        exitbtn.grid(column=1, row=3)
        resetbtn.configure(command=resetclick, text="return to 1st unprocessed img")
        resetbtn.grid(column=3, row=3)
        subpagebtn.grid_forget()
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
        self.entry.delete(0, END)
        newtitle = filearray[currentimg].split("/").pop().split(".")[0]
        self.entry.insert(0, newtitle)

    def updatesubtitle(self):
        self.entry.delete(0, END)
        self.entry.insert(0, missingsubpages[currentimg])
    
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
            if item.find(".") != -1:
                imgpath = "../portfolio-site/public" + item[2:]
                newimg = Image.open(imgpath)
                newimg = newimg.convert("RGB")
                while (newimg.width > 80 or newimg.height > 80):
                    newimg = newimg.resize((newimg.width // 2, newimg.height // 2))
                newimg = ImageTk.PhotoImage(newimg)
                x = Checkbutton(self, image=newimg, variable=self.tf[item])
                x.image = newimg
            else:
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
    
    def getnames(self):
        retlist = []
        for item in self.tf:
            retlist.append(item)
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

        self.clearButton = Button(self, text="Clear form", command=self.clear, fg="red")
        self.clearButton.grid(row=9, column=0, sticky="w")

        self.ignoreButton = Button(self, text="Ignore Image", command=self.ignore, fg="red")
        self.ignoreButton.grid(row=9, column=0, sticky="n")


        #are these necessary?
        self.grid_columnconfigure(0, weight=1)
        self.grid_rowconfigure(2, weight=1)

    #on clicking submit, append new data to the json and move on
    def submit(self):
        #SAFETY CHECK: must be on a valid entry in filearray
        if currentimg < 0:
            print("NO IMAGE VIEWED YET")
            return
        elif currentimg > len(filearray) - 1:
            print("OUT OF BOUNDS")
            return

        #gather all the relevant variables for json dump
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
        
        self.moveon()
            

    #clear form fields
    def clear(self):
        self.emedium.clear()
        self.eindustry.clear()
        self.esubpage.clear()
        self.etitle.updatetitle()
        self.omp.set(False)
        self.ecaption.clearcaption()
        self.ealt.clearalt()

    #mark the current img on ignorelist and move on
    def ignore(self):
        global ignoredata
        ignoredata["img"].append(filearray[currentimg])
        
        with open('../portfolio-site/src/ignore.json', "r+") as datafile:
            datafile.seek(0)
            json.dump(ignoredata, datafile, indent=4)

        self.moveon()

    def moveon(self):
        #json has been submitted: now we remove relevant image from the list and move on
        global currentimg
        global minindex
        filearray.pop(currentimg)
        currentimg -= 1 #to account for filearray shrinking
        minindex += 1

        #numbers have been updated: now update relevant displays
        filetest.configure(text="unprocessed file list: " + str(len(filearray)) + "\
                 missing subpage list: " + str(len(missingsubpages)))
        showclick()



#
# SUBPAGE STUFF
#

def subpagesclick():
    global currentimg
    #SAFETY CHECK: we've hit end of missing subpages
    if currentimg >= len(missingsubpages) - 1:
        print("END OF MISSINGSUBPAGES")
        #TODO: clear any images/display
        subpagebtn.configure(text="back to start?", command=resetsubpage)
        subform.grid_forget()
        return
    
    currentimg += 1

    #starting display: configure buttons accordingly
    if currentimg == 0:
        showbtn.grid_forget()
        subpagebtn.grid(column=0)
        exitbtn.grid(column=1, row=3)
        resetbtn.configure(command=resetsubpage, text="return to 1st missing subpage")
        resetbtn.grid(column=3, row=3)
        subpagebtn.configure(text="skip this subpage")
        subform.grid(column=0, row=4, columnspan=3)

    #further configuration goes here
    print("in subpage for page ", missingsubpages[currentimg])
    subform.eimg.grid_forget()
    subform.populatedata()
    #subform.configure(text="TEST: " + missingsubpages[currentimg])
    subform.etitle.updatesubtitle()
    
def resetsubpage():
    global currentimg
    currentimg = -1
    subpagebtn.configure(command=subpagesclick)
    subpagesclick()

#todo: SubForm
from datetime import date as dt
class SubForm(Frame):
    def __init__(self, parent):
        Frame.__init__(self, parent, padx=5, pady=5, bg="lightgreen")
        print("NEW SUBFORM")
        self.submediumarray = {}
        self.subindustryarray = {}
        self.subdate = dt.min
        self.possibleimages = {}
        self.eimg = Label(self, text="placeholder")
        
        self.etitle = Fentry(self, "Title:", missingsubpages[currentimg])
        self.etitle.grid(row=1, column=0, sticky="w")

        self.ecaption = Fentry(self, "caption:", "SUBHEADER")
        self.ecaption.grid(row=2, column=0, sticky="w")

        self.emedium = Checkset(self, self.submediumarray, "medium")
        self.emedium.grid(row=3, column=0, sticky="ew")
       
        self.esubpage = Checkset(self, insubpagearray, "insubpage")
        self.esubpage.grid(row=6, column=0)

        self.omp = BooleanVar()
        self.eomp = Checkbutton(self, text="onmainpage", variable=self.omp)
        self.eomp.grid(row=7, column=0, sticky="w")

        self.submitButton = Button(self, text="Submit and Next Subpage", command=self.submit)
        self.submitButton.grid(row=9, column=0, sticky="e")
        self.clearButton = Button(self, text="Clear form", command=self.clear, fg="red")
        self.clearButton.grid(row=9, column=0, sticky="w")
        self.ignoreButton = Button(self, text="Ignore Subpage", command=self.ignore, fg="red")
        self.ignoreButton.grid(row=9, column=0, sticky="n")
    
    def populatedata(self):
        #wipe all data
        self.submediumarray = {}
        self.subindustryarray = {}
        self.subdate = dt.min
        self.possibleimages = {}
        self.possiblealts = {}

        #FIND FEATURED ENTRIES AND COLLECT NEEDED INFO
        for entry in jsondata["entries"]:
            if missingsubpages[currentimg] in entry["insubpage"]:
                #print(entry["title"] + " is featured in " + missingsubpages[currentimg])
                self.possibleimages[entry["img"]] = 0
                self.possiblealts[entry["img"]] = entry["alt"]
                #make list of mediums listed in featured entries
                for x in entry["medium"]:
                    if x not in self.submediumarray:
                        self.submediumarray[x] = 0

                #make list of industries listed in featured entries
                for y in entry["industry"]:
                    if y not in self.subindustryarray:
                        self.subindustryarray[y] = 0
                
                #get most recent date
                if dt.fromisoformat(entry["date"]) > self.subdate:
                    self.subdate = dt.fromisoformat(entry["date"])

        self.emedium = Checkset(self, self.submediumarray, "medium")
        self.emedium.grid(row=3, column=0, sticky="ew")
         
        self.eindustry = Checkset(self, self.subindustryarray, "industry")
        self.eindustry.grid(row=4, column=0, sticky="ew")

        self.eimg = Checkset(self, self.possibleimages, "image: check 1 only")
        self.eimg.grid(row=5, column=0, sticky="ew")
        #print(self.eimg.getnames())
        
    def submit(self):
        if currentimg < 0:
            print("NO SUBPAGE VIEWED YET")
            return
        elif currentimg > len(missingsubpages) - 1:
            print("OUT OF BOUNDS")
            return
        
        theimg = self.eimg.get()[0]
        print(theimg)

        #the json dump
        newsubmit = {
            "id": minindex,
            "title": self.etitle.get(),
            "url": missingsubpages[currentimg],
            "type": "collection",
            "medium": self.emedium.get(),
            "industry": self.eindustry.get(),
            "insubpage": self.esubpage.get(),
            "onmainpage": self.omp.get(),
            "date": self.subdate.isoformat(),
            "img": self.eimg.get()[0],
            "alt": self.possiblealts[theimg],
            "caption": self.ecaption.get()
        }
        print(newsubmit)

        self.esubpage.clear()
        self.emedium.clear()
        self.eindustry.clear()
        self.eimg.clear()
        self.eimg.grid_forget()

        #TODO: thejson dump!
        
        with open('../portfolio-site/src/data.json', "r+") as datafile:
            ogdata = json.load(datafile)
            ogdata["entries"].append(newsubmit)
            datafile.seek(0)
            json.dump(ogdata, datafile, indent=4)

        self.moveon()
    
    def moveon(self):
        global currentimg
        global minindex
        missingsubpages.pop(currentimg)
        currentimg -= 1
        minindex += 1

        filetest.configure(text="unprocessed file list: " + str(len(filearray)) + "\
                 missing subpage list: " + str(len(missingsubpages)))
        subpagesclick()

    #mark the current img on ignorelist and move on
    def ignore(self):
        global ignoredata
        ignoredata["subpage"].append(missingsubpages[currentimg])
        
        with open('../portfolio-site/src/ignore.json', "r+") as datafile:
            datafile.seek(0)
            json.dump(ignoredata, datafile, indent=4)

        self.moveon()
        

    def clear(self):
        self.emedium.clear()
        self.eindustry.clear()
        self.esubpage.clear()
        self.etitle.updatetitle()
        self.omp.set(False)
        self.ecaption.clearcaption()
        self.eimg.clear()



#LEAVE ALL CLICKTHROUGHS NAD RETURN TO STARTING SCREEN
def leave():
    print("LEAVE")
    global currentimg
    currentimg = -1
    subpagebtn.configure(text="show missing subpages", command=subpagesclick)
    subpagebtn.grid(column=1, row=3)
    showbtn.configure(text="show unprocessed image", command=showclick)
    showbtn.grid(column=0, row=3)
    resetbtn.grid_forget()
    exitbtn.grid_forget()
    theform.grid_forget()
    subform.grid_forget()


#
# GUI: FORM AREA
#
showbtn = Button(root, width=25, text="show unprocessed image", fg="purple", command=showclick)
showbtn.grid(column=0, row=3)

subpagebtn = Button(root, width=25, text="show missing subpages", fg="purple", command=subpagesclick)
subpagebtn.grid(column=1, row=3)

resetbtn = Button(root, width=25, text="back to 1st unprocessed img", fg="blue", command=resetclick)

exitbtn = Button(root, width=25, text="RETURN TO HOME", fg="red", command=leave)

theform = TheForm(root)
subform = SubForm(root)


root.mainloop()