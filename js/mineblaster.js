/*****************************************************************************
 * Yet another minesweeper clone
 *****************************************************************************
 * (c) 2007-2016 Andrea Gardoni <andrea.gardonitwentyfour@gmail.com> minus 24
 *
 * This program is free software; you can redistribute it and/or modify it
 * under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation; either version 2.1 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program;
 * if not, see <http://www.gnu.org/licenses/lgpl-2.1.html>.
 *****************************************************************************/

navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;



var mineblaster = new Object();

// enable vibration support
mineblaster.vibration;
mineblaster.animations;

mineblaster.background_colors = ['#930', '#390', '#039', '#9a0', '#399', '#939', '#e50', '#999'];	// Background possible colors
mineblaster.images = ['imgs/mineblaster_icon.svg', 'imgs/wrong_mine.svg', 'imgs/menu.svg', 'imgs/mine.svg',
'imgs/1.svg', 'imgs/2.svg', 'imgs/3.svg', 'imgs/4.svg', 'imgs/5.svg', 'imgs/6.svg', 'imgs/7.svg', 'imgs/8.svg',
'mined/mined.svg', 'imgs/unknown.svg'];



// Field initialization
// ---------------------------------------------------------------------
mineblaster.initialize = function()
{
	// Load cookies
	mineblaster.cookies.load();

	// Initializations
	mineblaster.gui.initialize();		// GUI initialization
	mineblaster.field.initialize();		// Field initialization

	// Resize field on resize window
	$(window).resize(mineblaster.field.resize);

}



// End of game procedures
// ---------------------------------------------------------------------
mineblaster.game_over = function ()
{
	var i, j;

	// Game over, remove all cells listeners
	$(".cell").unbind();

	// Show all mines position except the exploded one
	for (i = 0; i < mineblaster.field.rows_number; i++)
	{
		for (j = 0; j < mineblaster.field.cols_number; j++)
		{
			// Show wrong marked mine
			if (mineblaster.field.marked_cells[i][j] == "M" && mineblaster.field.field[i][j] != "*")
			{
				$("#row" + i + "col" + j + " .front").html('').addClass("wrong_mine");
			}

			// Show non-marked mines
			if (mineblaster.field.field[i][j] == "*" && mineblaster.field.open_cells[i][j] == 0)
			{
				$("#row" + i + "col" + j + " .front").html('').addClass("demined");
			}
		}
	}
	
	mineblaster.field.flip_open_cells();
}



// On document ready
// ---------------------------------------------------------------------
$(document).ready( function () {

	// When page is opened, initialize field with default values
	mineblaster.initialize();

});
