/*******************************************************************************
 * Yet another minesweeper clone
 * ****************************************************************************
 * (c) 2007-2016 Andrea Gardoni <andrea.gardonitwentyfour@gmail.com> minus 24
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program; if not, see
 * <http://www.gnu.org/licenses/lgpl-2.1.html>.
 ******************************************************************************/

navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;


class Mineblaster
{
	constructor()
	{
		this.settings = new Settings();
	}


	// Field initialization
	// ---------------------------------------------------------------------
	initialize()
	{
		var self = this;

		this.settings = new Settings();
		this.settings.load();
		this.field = {};

		this.gui = new GUI(this.settings);
		this.field = new Field(this, this.settings, this.gui);

		this.gui.initialize(this.gui);		// GUI initialization
		this.field.initialize(this.field);		// Field initialization

		// Resize field on resize window
		$(window).on("resize", function () { self.field.resize(self); });


		// Regeneration button listener
		$("#regenerate").on('mouseup', function () { self.field.initialize(self.field); });

		// Message fadeout on click
		$('#message_box').on('click', function () { $(this).fadeOut(); });

	}



	// End of game procedures
	// ---------------------------------------------------------------------
	game_over()
	{
		var i, j;

		// Game over, remove all cells listeners
		$(".cell").off();

		// Show all mines position except the exploded one
		for (i = 0; i < this.field.rows_number; i++)
		{
			for (j = 0; j < this.field.cols_number; j++)
			{
				// Show wrong marked mine
				if (this.field.cells[i][j].marker == "M" && this.field.cells[i][j].mined == false)
				{
					$("#row" + i + "col" + j + " .front").html('').addClass("wrong_mine");
				}

				// Show non-marked mines
				if (this.field.cells[i][j].mined == true && this.field.cells[i][j].open == false)
				{
					$("#row" + i + "col" + j + " .front").html('').addClass("demined");
				}
			}
		}

		this.field.flip_open_cells();
	}

}