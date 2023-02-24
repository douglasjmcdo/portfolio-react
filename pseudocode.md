## BOARD
The BOARD contains ENTRIES.
The BOARD has clickable industry filters along the top of the app, as well as an openable sort/filter menu.

  ### SORTING
  ENTRIES on the board can be filtered or sorted by DATE, TITLE, MEDIUM (type of art), or INDUSTRY (for professional portfolios). If sorting by MEDIUM or INDUSTRY, entries will be sorted based on the FIRST ONE LISTED in their array of mediums or industries.
  


### OBJECT: BOARD
  sort: "medium" / "date" / none
  filters: { industry: illustration,
             medium: traditional,
           }

## ENTRIES
ENTRIES can be INDIVIDUAL or SUB-PAGES. ENTRIES are displayed on the default BOARD if the "on-main-page" variable is TRUE.

   ### INDIVIDUALS
   INDIVIDUALs are IMAGES. the image reference is held in the "img" variable
   
   ### SUB PAGES
   SUB-PAGES are UNIQUE PAGES that can be clicked through. they can be either COLLECTIONS or DOCUMENTATIONs
     A COLLECTION is a SUB-SET OF ENTRIES. This functions similar to the main board. An entry displays if the sub-page id is listed in the "in-sub-page" variable. 
     A DOCUMENTATION is a specific page. It may contain UNIQUE TEXT OR IMAGES. An array containing the data for a DOCUMENTATION page is held in the "template" variable.
     Upon returning from any SUB-PAGE to the MAIN PAGE, all previously active filters and/or sorts should persist!

### OBJECT: ENTRY
  id: 12
  title: "UniqueTitle" 
  url: "not required for individuals"
  type: individual / sub-page-d / sub-page-c
  medium: [ digital / traditional, water color / 3d ]
  industry: [ ui / front-end / illustration, comics ]
  in-sub-page: [ 2d-studio, observational / null ]
  on-main-page: true
  date: 2017
  img: blank.jpeg
  alt: "alt text"
  template: [{text, "header"}, {entry, "entry"}]
  caption: ""


### DOCUMENTATION: TEMPLATE ARRAY
  Template arrays hold pairs of type-information, in the order that they should be displayed.
  -{header, "header text"} -> displays as a centered h2
  -{text, "text to display"} -> displays as a centered div
  -{image, "/img/name.jpeg"} -> displays as a centered image
  -{entry, "entryname"} -> displays the entry with name "entryname"
  -{board, "x"} -> displays a board of all entries that have "x" listed in their "insubpage" array
  
