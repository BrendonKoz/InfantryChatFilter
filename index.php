<?php
	$file    = 'history.log';
	$lines   = '<span>Choose a Log File to Display</span>';
	$bodyClass = '';
	$aliasList = '';
	if ($file) {
		$text    = file_get_contents($file);
		$matches = array();
		#$pattern = '/^(\d)\t(.*)?\t(.*)?\t(.*)?$/'; //digit, TAB, possible text, TAB, possible text, TAB, message
		$pattern = '/^(\d)\t(.+)?\t(.+)?\t(.+)?$/m'; //digit, TAB, possible text, TAB, possible text, TAB, message
		preg_match_all($pattern, $text, $matches, PREG_SET_ORDER);
		$lines = array();
		$aliasList = array();

		$colorOverride = array(
			'~' => 'co0',
			'!' => 'co1',
			'@' => 'co2',
			'#' => 'co3',
			'$' => 'co4',
			'%' => 'co5',
			'^' => 'co6',
			'&' => 'co7',
			'*' => 'co8'
		);

		foreach ($matches as $line) {
			//0: full line
			//1: msg type [mt]
			//2: msg to
			//3: msg from
			//4: msg content
			$class[] = 'mt' . $line[1];
			$to      = $line[2];
			$from    = $line[3] ? "<span class='msg-from'>{$line[3]}</span><span class='delimiter'>&gt;&nbsp;</span>" : '';
			$content = $line[4];
			$title   = $to ? " title='Message to {$to}'" : '';

			if ($line[1] == 5) {
				if (array_key_exists($content[0], $colorOverride)) {
					$class[] = $colorOverride[$content[0]];
					$content = substr($content, 1);
				}
			}
			if ($line[3]) {
				$aliasList[$line[3]] = '';
				$class[] = '{p}-'.$line[3];
			}

			$lines[] = '<div class="' . implode(' ', $class) . '"'.$title.'><span class="msg-to">'.$to.'</span>' . $from . '<span class="content">' . $content . '</span></div>';
			$class = null;
		}
		$aliasList = array_keys($aliasList);
		natcasesort($aliasList);
		$playerList = array();
		foreach ($aliasList as $player) {
			$playerList[] = '<option value="'.$player.'">'.$player.'</option>';
		}
		$lines = implode('', $lines);
	} else {
		$bodyClass = 'empty';
	}
?>
<!doctype html>
<html lang="en">
<head>
	<!-- Required meta tags -->
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

	<!-- CSS -->
	<link href="https://fonts.googleapis.com/css?family=Red+Hat+Text|Russo+One&display=swap" rel="stylesheet">
	<link href="https://unpkg.com/mobius1-selectr@latest/dist/selectr.min.css" rel="stylesheet" type="text/css">
	<script src="https://unpkg.com/mobius1-selectr@latest/dist/selectr.min.js" type="text/javascript"></script>
	<link rel="stylesheet" href="style.css" title="style">
	<title>Infantry Chat Filter</title>
</head>
<body class="<?= $bodyClass ?>">
	<section class="chat">
		<?= $lines; ?>
	</section>
	<section class="filter">
		<h1>Infantry Chat Viewer and Filter</h1>
		<hr>
		<form class="" action="index.html" method="post">
			<div class="upload-btn-wrapper">
				<button class="btn">Choose File</button>
				<input type="file" name="myfile" />
			</div>
			<div class="options">
				<label><input type="checkbox" name="mt0" checked="checked"> Public Chat</label>
				<label><input type="checkbox" name="mt1" checked="checked"> Macros</label>
				<label><input type="checkbox" name="mt2" checked="checked"> Private Messages</label>
				<label><input type="checkbox" name="mt3" checked="checked"> Internal Team</label>
				<label><input type="checkbox" name="mt4" checked="checked"> External Team</label>
				<label><input type="checkbox" name="mt5" checked="checked"> System Message</label>
				<label><input type="checkbox" name="mt6" checked="checked"> Chat Channels</label>
				<label><input type="checkbox" name="mt7" checked="checked"> Squad</label>
				<label><input type="checkbox" name="mt8" checked="checked"> Killed</label>
				<label><input type="checkbox" name="mt9" checked="checked"> Zone Announcements</label>

				<div class="misc">
					<div class="half">
						<label for="players">Filter By Players</label>
						<select class="" id="players" name="players">
							<?= implode("\n", $playerList); ?>
						</select>
					</div>
					<div class="half">
						<label for="namewidth">Namewidth: <output>12</output></label>
						<input type="range" id="namewidth" name="namewidth" min="1" max="24" value="12">
					</div>
				</div>
			</div>
		</form>
	</section>
	<script src="./filter.js" type="text/javascript"></script>
</body>
</html>
