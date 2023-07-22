## PY-IMPORT APP
This app is a support app for the portfolio-react webapp. This app helps users import images so that they autopopulate properly on the app. Images must first be placed in public/img.

## Overview:
This is a python app that uses tkinter to provide a simple GUI form. The app compares data.json to the contents of the /img folder, makes a list of all discrepancies between the two, and walks the user through each discrepancy unless the discrepancy is marked in ignore.json.

## Discrepancy: Image is not included in data.json
For each image in /img that is not referenced in data.json, the GUI will display the image and provide a form to fill out the necessary metadata for the image. When submitted, this entry is then appended to the data.json file and the GUI moves on to the next image.

## Discrepancy: data.json entry references a subpage that does not exist
For each subpage mentioned in data.json that does not have a corresponding entry, the GUI will display the subpage name and provide a form to fill out the necessary metadata for collection subpages. When submitted, this entry is then appended to the data.json file and the GUI moves on to the next subpage. NOTE: the form only works for collection subpages. If the subpage is part of a documentation subpage, skip or ignore that subpage.

## Discrepancy: Two entries share the same name
For each pair of entries in data.json that share a title, the GUI will display both images and provide a form that allows the user to change one or both entry names. NOTE: this has not yet been implemented.

## Discrepancy: data.json entry references an image that does not exist
For each missing image, the GUI will display the metadata and provide the option to remove that image from data.json. NOTE: this has not yet been implemented. 

## To run:
Open python in a terminal. Navigate into the py-import folder and run:
python main.py

## installed packages:
tkcalendar