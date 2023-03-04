## PY-IMPORT APP
This app is a support app for the portfolio-react webapp. This app helps users import images to the data.json file so that they autopopulate properly on the app

## Overview:
This is a python app that uses tkinter to provide a simple GUI form. The app compares data.json to the contents of the /img folder, makes a list of all discrepancies between the two, and walks the user through each discrepancy.

## Discrepancy: Image is not included in data.json
For each image not referenced in data.json, the GUI will display the image and provide a form to fill out the necessary metadata for the image. When submitted, this entry is then appended to the data.json file and the GUI moves on to the next image.

## Discrepancy: data.json entry references an image that does not exist
For each missing image, the GUI will display the metadata and provide the option to remove that image from data.json. NOTE: this has not yet been implemented. 

## To run:
Open python in a terminal. Navigate into the py-import folder and run:
python main.py

## installed packages:
tkcalendar