# js-mineblaster

### Yet another JS/CSS Minesweeper clone

A simple javascript / jQuery based Minesweeper clone. [Demo here](http://mineblaster.blazestudio.it/)

### Actions

* Single left-click (or tap) on a cell to open it. If it is mined, you lose. If it is not, it will open and show the number of adjacent mined cells.
* Single right-click (or long press) on a cell to mark it. First click marks it as mined. Second click marks it as unknown. A third click unmarks it. Marked cells can't be opened.
* Double left-click (or double tap) on an open cell to open all surrounding non-marked cells. This works only if adjacent mines number is satisfied. This action will be recursively applied over all just opened cells. Be careful, because if a wrong mine is marked, you will probably end up in opening a non-marked mined cell.

### Todo list

* [x] Flip animation when opening cells
* [x] Mobile devices optimization
* [x] Vibration feedback on mobile devices
* [x] Fullscreen when installed on dashboard
* [x] Store settings into cookies
* [x] Enable/Disable animations button
* [ ] Auto-place menu on the shortest side
