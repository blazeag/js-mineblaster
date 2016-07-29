# js-mineblaster

### Yet another Minesweeper clone

A simple javascript / jQuery based Minesweeper clone. [Demo here](http://mineblaster.blazestudio.it/)

### Mouse actions

* Single left-click on a cell to open it. If it is mined, you lose. If it is not, it will open and show the number of adjacent mined cells.
* Single right-click on a cell to mark it. First click marks it as mined. Second click marks it as unknown. A third click unmarks it. Marked cells can't be opened.
* Double left-click on an open cell to open all surrounding non-marked cells. This works only if adjacent mines number is satisfied. This action will be recursively applied over all just opened cells. Be careful, because if a wrong mine is marked, you will probably end up opening a non-marked mined cell.
