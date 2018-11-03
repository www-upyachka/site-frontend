<?php
	if(isset($_GET['hash']))
	{
		header("Location: /#{$_GET['hash']}");
	}
?>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Упячка! я идиот! убейте меня, кто-нибудь!</title>
	<link rel="stylesheet" href="static/css/libs/fa/css/font-awesome.min.css">
	<link rel="stylesheet" href="static/css/main.css">
	<meta name="viewport" content="width=device-width, initial-scale=0.5, maximum-scale=0.5, user-scalable=0; minimal-ui">
	<meta name="description" content="Лучший в мире сайт Упячка!">
</head>
<body>
	<noscript>
		Броузер не поддерживает javascript и сайт работать не хочет.
	</noscript>
	<div id="viewImage">
	</div>
	<div id="status"></div>
	<div id="menu">
		<div id="toggleMenu" onclick="window.up4k.toggleMenu()" style="font-size:120%"><i class="fa fa-bars"></i></div>
		<ul id="mainMenu"></ul>
	</div>
	<div id="tagLine"></div>
	<div id="inventory">

	</div>
	<div id="up4k"></div>
	<script src="static/js/libs/jquery.min.js"></script>
	<script src="static/js/libs/lodash.min.js"></script>
	<script src="static/js/libs/thirdparty.js"></script>
	<script src="static/js/libs/editor.js"></script>
	<script src="static/js/config.js"></script>
	<script src="static/js/main.js"></script>
</body>
</html>
