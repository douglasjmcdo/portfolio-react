## MAIN PAGE
The MAIN PAGE contains ENTRIES.
The MAIN PAGE has clickable industry filters along the top of the app, as well as an openable sort/filter menu.
ENTRIES on the main page can be filtered or sorted by DATE, TITLE, MEDIUM (type of art), or INDUSTRY (for professional portfolios).

### OBJECT: MAIN-PAGE
  sort: "medium" / "date" / none
  filters: { industry: illustration,
             medium: traditional,
           }

## ENTRIES
ENTRIES can be INDIVIDUAL or SUB-PAGES. ENTRIES are displayed on the MAIN PAGE if the "on-main-page" variable is TRUE.

   ### INDIVIDUALS
   INDIVIDUALs are IMAGES. the image reference is held in the "data" variable
   
   ### SUB PAGES
   SUB-PAGES are UNIQUE PAGES that can be clicked through. they can be either COLLECTIONS or DOCUMENTATIONs
     A COLLECTION is a SUB-SET OF ENTRIES. This functions similar to the main page. An entry displays if the sub-page id is listed in the "in-sub-page" variable. 
     A DOCUMENTATION is a specific page. It may contain UNIQUE TEXT OR IMAGES. An html file containing the data for a DOCUMENTATION page is held in the "data" variable.
     Upon returning from any SUB-PAGE to the MAIN PAGE, all previously active filters and/or sorts should persist!

### OBJECT: ENTRY
  id: 2d-studio
  title: "Print #4"
  type: individual / sub-page-d / sub-page-c
  medium: [ digital / traditional, water color / 3d ]
  industry: [ ui / front-end / illustration, comics ]
  in-sub-page: [ 2d-studio, observational / null ]
  on-main-page: true
  date: 01 Jan 2017
  data: blank.jpeg / subpage.html
  caption: ""
