# portfolio-react is exactly what it sounds like
I built this single-page React app to serve as my art portfolio. It displays my own artwork across
I retain copyright for all art and code.

## Overview:
This app displays art projects in a responsive grid. These projects can be sorted or filtered by title, date, medium, or industry. The app is entirely autopopulated from a json file containing each entry and its metadata.


## Boards
Boards are responsive grids that display entries. Each board is autopopulated by entries that are marked for that board. The entries on the board can then be sorted, searched or filtered. Entries can be displayed on multiple boards.

### The Main Board
The main board is the board that displays on the home page. Most entries will display on this board, but entries can be excluded from this board with the "onmainpage" variable.


## Entries
This app distinguishes between three different types of projects-- individual images, collections, and detailed documentation pages. All three types are displayed in boards. Individual images can be clicked on for full size, while collections and documentation pages route to a new page in order to display their full contents when clicked on.

### Entry: JSON Object Format
  id: unique integer value
  title: "Image Title" 
  url: "for collections and doc pages"
  type: individual / documentation / collection
  medium: [ digital / traditional, water color / 3d ]
  industry: [ ui / front-end / illustration, comics ]
  insubpage: [ 2d-studio, observational / null ]
  onmainpage: true
  date: 2017
  img: "../img/img.jpeg"
  alt: "alt text"
  template: [[text, "Documentation Page Template"], [board, "documentboard"]]
  caption: ""

### Collections
Collections contain boards that are solely populated with entries tagged for that board. Collections will display at the route "/collection/collection-name". Entries featured in collections may also display on the main board. Add an entry to a collection by putting the collection name in that entry's "insubpage" array.

### Documentation Pages
Documentation pages are intended for detailing the progression of larger projects. Documentation pages will display at the route "/documentation/page-name". These pages populate from a template contained in their metadata. These pages can contain headers, text, images, boards, and entries. Entries featured in documentation pages may also display on the main board.

#### Documentation: The Template
  The template is an array holding pairs of type-information, in the order that they should be displayed.
  -[header, "header text"] -> displays as a centered h2
  -[link, {"url": "url.com", "text": text OR "image": img.jpeg, "alt": alt text}] -> displays a link with the given text or image
  -[text, "text to display"] -> displays as a centered div
  -[image, {"image": "/img/name.jpeg", "alt": alt text}] -> displays as a centered image
  -[entry, id int or "title"] -> displays the entry with the given id or title
  -[board, "x"] -> displays a board of all entries that have "x" listed in their "insubpage" array
  



## Searching, Sorting and Filtering
Searching, sorting and filtering is accomplished with the expandable sidebar.

### Searching
Searching with the search bar will filter entries to only those that contain the relevant text in any part of the metadata, including alt text and captions.

### Sorting
Sorting will organize current entries by the current method. Sorts are currently limited to title, date, medium or industry. If sorting by medium or industry, entries will be sorted based on the first one listed in their array of mediums or industries respectively.

###Filtering
Filtering will filter entries to only those with the relevant tag. Filters are currently limited to medium or industry. Quick links to filter by industry are also displayed in the header bar. Filter options in both the sidebar and header are autopopulated from relevant tags in the json file.


##Installed Packages and Resources:
The following packages were used in order to build this webapp:
node.js
react
react-router-dom
use-query-params

The following open source fonts were installed in order to display this webapp:
Overpass

TODO: import the shared folders (studio-3d, pet pals data)