class GUI
{
	constructor(settings)
	{
		this.settings = settings;

		this.images = ['imgs/mineblaster_icon.svg', 'imgs/wrong_mine.svg', 'imgs/menu.svg', 'imgs/mine.svg',
		'imgs/1.svg', 'imgs/2.svg', 'imgs/3.svg', 'imgs/4.svg', 'imgs/5.svg', 'imgs/6.svg', 'imgs/7.svg', 'imgs/8.svg',
		'imgs/mined.svg', 'imgs/unknown.svg'];
	}


	// GUI initialization
	// --------------------------------------------------------
	initialize(self)
	{
		this.preloaded_images = new Array();
		this.current_background = '';

		// Preload images
		this.preload_images();
		this.menu = new Menu();
		this.message = new Message();

		if (this.settings.animations)
		{
			$('#field').addClass('animated');
		}

		// Toggle options and set option button listener
		$('#settings').on('click', function() { self.menu.toggle(self.settings.animations); });
		$('#controls_box, #message_box').on('click', function(event) {
			event.stopPropagation();
		});
		$(document).on('click', function() { self.menu.close(self.settings.animations) });

		$('#vibration').on('change', function (e)
		{
			if ($(e.target).is(':checked'))
			{
				self.settings.vibration = true;
			}
			else
			{
				self.settings.vibration = false;
			}

			// Set cookie
			self.settings.save_to_cookie('vibration', self.settings.vibration);

		});

		$('#animations').on('change', function (e) {

			if ($(e.target).is(':checked'))
			{
				self.settings.animations = true;
				$('#field').addClass('animated');
			}
			else
			{
				self.settings.animations = false;
				$('#field').removeClass('animated');
			}

			// Set cookie
			self.settings.save_to_cookie('vibration', self.settings.vibration);
			self.settings.save_to_cookie('animations', self.settings.animations);

		});
	}



	// Preload GUI images
	// --------------------------------------------------------
	preload_images()
	{
		var i;

		for (i = 0; i < this.images.length; i++)
		{
			this.preloaded_images[i] = new Image();
			this.preloaded_images[i].src = this.images[i];
		}
	}



	// Change background color
	// ---------------------------------------------------------------------
	change_background(callback)
	{
		var random;

		do
		{
			random = Math.floor(Math.random() * 10) + 1;
		}
		while (random == this.current_background);

		this.current_background = random;
		var background_image = 'url(imgs/backgrounds/' + random + '.jpg)';

		callback();

		$('#mineblaster').css({transition: '0.5s', 'background-image': background_image});

		callback();
	}



	// Update visual indicators (remaining cells, mines, etc)
	// ---------------------------------------------------------------------
	update_indicators(field)
	{
		var i, j;
		var remaining_cells = (field.rows_number * field.cols_number) - field.mine_number - field.open_cells_number;

		// Update remaining non-opened cells indicator
		$("#remaining_cells").html(remaining_cells.toString());

		// Update remaining mines indicator
		field.marked_mines_number = 0;

		for (i = 0; i < field.rows_number; i++)
		{
			for (j = 0; j < field.cols_number; j++)
			{
				if (field.cells[i][j].marker == "M")
				{
					field.marked_mines_number++;
				}
			}
		}

		var remaining_mines = field.mine_number - field.marked_mines_number;

		$("#remaining_mines").html(remaining_mines.toString());
	}
}