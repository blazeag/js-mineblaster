class Menu
{
	construct()
	{
		this.opened = true;
	}



	// Open options menu
	// --------------------------------------------------------
	open(animations)
	{
		if (animations)
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
	close(animations)
	{
		var controls_h = $('#controls_box').outerHeight();
		var indicators_h = $('#indicators').outerHeight();

		if (animations)
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
	toggle(animations)
	{
		(this.opened) ? this.close(animations) : this.open(animations);
	}
}