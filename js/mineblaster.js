/*****************************************************************************
 * Yet another minesweeper clone
 *****************************************************************************
 * (c) 2007 Andrea Gardoni <andrea.gardonitwentyfour@gmail.com> minus 24
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

var field;			// Array containing mines and cells values
var open_cells;			// Array containing open cells boolean flags
var marked_cells;		// Array containing cell markers

var open_cells_number;		// Open cells counter
var marked_mines_number;	// Mine-marked cells number

var rows_number;		// Field rows number
var cols_number;		// Field columns number
var mine_number;		// Field mines number

var background_colors = ['#930', '#390', '#039', '#9a0', '#399', '#939', '#e50', '#999'];	// Background possible colors
var current_background = '';



// Game initialization
// ---------------------------------------------------------------------
function initialize()
{
	// Empty arrays
	field = new Array();
	open_cells = new Array();
	marked_cells = new Array();

	// Empty counters
	open_cells_number = 0;

	// Get highest row and column value
	max_rows_number = $('#rows_number').attr("max");
	max_cols_number = $('#cols_number').attr("max");

	// Get and check all field parameters
	rows_number = parseInt($("#rows_number").val());
	cols_number = parseInt($("#cols_number").val());
	mine_number = parseInt($("#mine_number").val());

	if (rows_number < 1 || rows_number > max_rows_number)
	{
		alert("Max rows number is " + max_rows_number + "!");
		$('#rows_number').val(max_rows_number);
		return false;
	}
	
	if (cols_number < 1 || cols_number > max_cols_number)
	{
		alert("Max columns number is " + max_cols_number + "!");
		$('#cols_number').val(max_cols_number);
		return false;
	}

	if (mine_number <= 0)
	{
		alert("Put at least one mine in the field!");
		return false;
	}

	if (mine_number > (rows_number * cols_number) - 1)
	{
		alert("Mines saturate field!");
		return false;
	}

	// Field disposition
	generate_field();
	plant_mines();
	calculate_cells_values();
	draw_field();
	update_indicators();

	// Unbind all previously associated cells listeners
	$("td").unbind();

	// Associate new events to cells
	$("td").click(cell_click);				// Cell opening listener
	$("td").dblclick(open_surrounding_cells);		// Surrounding cells opening listener
	$("td").mousedown(right_mouse_button);			// Cell marking listener
	$("table").bind("contextmenu", function (e) {		// Avoid cells contextual menu on right mouse button click
		e.preventDefault();
	});
}



// READY FUNCTION
// ---------------------------------------------------------------------
$(document).ready( function () {

	// Regeneration button listener
	$("#regenerate").mouseup(initialize);

	// When page is opened, initialize field with default values
	initialize();

});
