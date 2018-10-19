var editor = {
	youtube: function () {
		var id = prompt('ID видео:');
		click_bb(`[youtube]${id}[/youtube]`, ``);
	},
	textStyle: function () {
		var style = prompt('Стиль (на языке CSS):');
		var text = prompt('Текст:');
		click_bb(`[textstyle=${style}]${text}[/textstyle]`, ``);
	},
	pastebin: function () {
		var id = prompt('ID копипасты на pastebin:');
		click_bb(`[pastebin]${id}[/pastebin]`, ``);
	},
	img: function () {
		var description = prompt('Описание картинки:');
		var link = prompt('Ссылка на картинку:');
		click_bb(`![${description}](${link})`, ``);
	},
	link: function () {
		var description = prompt('Тексте ссылки:');
		var link = prompt('Ссылка:');
		click_bb(`[${description}](${link})`, ``);
	},
};