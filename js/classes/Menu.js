class Menu
{
	construct()
	{
		this.opened = true;
	}



	// Open options menu
	// --------------------------------------------------------
	open()
	{
		if (options.animations)
		{
			$('#controls_box').animate({'top': '0px'});
		}
		else
		{
			$('#controls_box').css({'top': '0px'});
		}
		this.opened = true;
	}



	// Close options menu
	// --------------------------------------------------------
	close()
	{
		var controls_h = $('#controls_box').outerHeight();
		var indicators_h = $('#indicators').outerHeight();

		if (options.animations)
		{
			$('#controls_box').animate({'top': "-" + (controls_h - indicators_h) + 'px'});
		}
		else
		{
			$('#controls_box').css({'top': "-" + (controls_h - indicators_h) + 'px'});
		}

		this.opened = false;
	}



	// Toggle options menu
	// --------------------------------------------------------
	toggle()
	{
		(this.opened) ? this.close() : this.open();
	}
}