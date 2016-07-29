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

// enable vibration support
navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;
var vibration = true;

// Global variables
var field;			// Array containing mines and cells values
var open_cells;			// Array containing open cells boolean flags
var marked_cells;		// Array containing cell markers

var open_cells_number;		// Open cells counter
var marked_mines_number;	// Mine-marked cells number
var just_opened_cells;	// List of just opened cells

var rows_number;		// Field rows number
var cols_number;		// Field columns number
var mine_number;		// Field mines number
var timeouts = [];		// Timeout container			

var options_opened = true;

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
	
	// Remove end message, if present
	$("#message_box").fadeOut();

	for (i = 0; i < timeouts.length; i++)
	{
		clearTimeout(timeouts[i]);
	}
	
	timeouts = [];

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
	$(".cell").unbind();

	// Associate new events to cells
	$(".cell").click(cell_click);				// Cell opening listener
	$(".cell").dblclick(open_surrounding_cells);		// Surrounding cells opening listener
	$(".cell").mousedown(right_mouse_button);			// Cell marking listener
	$("#field").bind("contextmenu", function (e) {		// Avoid cells contextual menu on right mouse button click
		e.preventDefault();
	});
}



// Show message
// ---------------------------------------------------------------------
function message(msg)
{
	$('#msg_new_game').unbind('click');

	var msg_box = $('#message_box');
	var msg_div = $('<div id="message_text">' + msg + '</div>');
	
	msg_box.html(msg_div);
	
	$('#message_text').append('<input type="button" id="msg_new_game" value="New Game">');
	$('#msg_new_game').click(initialize);
	
	msg_box.css({visibility: 'hidden'});
	msg_box.show();

	center_message();
	
	msg_box.hide();
	msg_box.css({visibility: 'visible'});
	
	
	msg_box.fadeIn();
}



// Center message vertically
// ---------------------------------------------------------------------
function center_message()
{
	var msg_y = ($('#message_box').outerHeight() - $('#message_text').outerHeight()) / 2;
	$('#message_text').css({top: msg_y + 'px'});
}



// READY
// ---------------------------------------------------------------------
$(document).ready( function () {

	// Regeneration button listener
	$("#regenerate").mouseup(initialize);
	
	$('#message_box').click( function () { $(this).fadeOut(); });
	
	// When page is opened, initialize field with default values
	initialize();
	
	$(window).resize(resize_field);

	// Toggle options and set option button listener
	$('#options').click(toggle_options);
	$('#controls_box').click(function(event){
		event.stopPropagation();
	});
	$(document).click(close_options);
	
	$('#vibration').change(function () {
		
		if ($(this).is(':checked'))
		{
			vibration = true;
		}
		else
		{
			vibration = false;
		}
		
	});

});
