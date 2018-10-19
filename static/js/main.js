window.temp = [];

var sandboxLink =`<div class='sandboxLink'><small>Чтобы не называть парсер лохом, можно протестировать его в <a href="#sandbox">песочнице</a></small></div>`;

try {
	jQuery()
} catch (e) {
	throw "jQuery not loaded"
}
var menuHidden = !1;
var up4k = {
	"viewImage": function() {},
	"config": {
		"siteUrl": "http://frontend.url",
		"apiUrl": "http://api.url/",
		"mainTitle": "Упячка",
		"dateFormat": "d.m.Y, H:i",
	},
	"mention": function(username) {
		$("textarea#text").append(`*${username},* `);
		$("html,body").animate({
			scrollTop: $("#text").offset().top
		}, 1000)
	},
	"goToPost": function(id) {
		$("html,body").animate({
			scrollTop: $(`#post-${id}`).offset().top
		}, 1000)
	},
	"goToComment": function(id) {
		$("html,body").animate({
			scrollTop: $(`#comment-${id}`).offset().top
		}, 1000)
	},
	"toggleMenu": function() {
		window.menuHidden = !window.menuHidden;
		$("#mainMenu").slideToggle();
		if (!window.menuHidden) {
			$("body").css({
				"margin-left": "300px"
			})
		} else {
			$("body").css({
				"margin-left": "50px"
			})
		}
	},
	"status": function(msg, type = "info", notHide = !1) {
		var icon;
		switch (type) {
			case "success":
				icon = "fa fa-check";
				break;
			case "error":
				icon = "fa fa-ban";
				break;
			case "info":
				icon = "fa fa-info-circle";
				break;
			case "loading":
				icon = "fa fa-spinner fa-spin";
				break;
			default:
				icon = "fa fa-info"
		}
		var StatusId = `status-${Math.floor(Math.random() * 1000000000000000)}`;
		$("#status").append(`<div class="statusBlock ${type}" id="${StatusId}"><i class="${icon}"></i> ${msg}</div>`);
		$(`#${StatusId}`).slideDown();
		if (window.statusView) {
			clearTimeout(window.statusView)
		}
		$(".statusBlock").each(function() {
			var color = $(this).css("color");
			$(this).css({
				"box-shadow": `0px 0px 5px 0px ${color}`
			})
		});
		if (!notHide) {
			setTimeout(function() {
				$(`#${StatusId}`).slideUp();
				setTimeout(function () {
					$(`#${StatusId}`).remove();
				}, 3000);
			}, 3000)
		}
	},
	"error": function(msg) {
		this.status(msg, "error")
	},
	"success": function(msg) {
		this.status(msg, "success")
	},
	"setTitle": function(title) {
		$("title").text(`${title}`)
	},
	"setDefaultTitle": function() {
		this.setTitle("ПРОДАЖА МЕДВЕДЕЙ ЗА ПОЛЦЕНЫ!")
	},
	"checkLogin": function() {
		$.ajax({
			"url": this.config.apiUrl,
			"data": {
				"method": "user.info",
				"access_token": getCookie("access_token"),
			},
			"dataType": "json",
			"success": function(data) {
				if (data.success) {
					window.isLogged = !0;
					window.userInfo = data.success
				} else {
					window.isLogged = !1
				}
			},
			"error": function(data) {
				window.up4k.error(`Ошибка сервера: ${data.status} ${data.statusText}`);
				window.isLogged = !1
			},
			"complete": function() {
				if (!window.mainLoaded) {
					window.up4k.main();
					window.mainLoaded = !0
				}
			},
		})
	},
	"modules": {
		"post": {
			"delete": function(id) {
				$.ajax({
					"url": up4k.config.apiUrl,
					"data": {
						"method": "post.delete",
						"id": id,
						"access_token": getCookie("access_token"),
					},
					"success": function(data) {
						if (data.success) {
							$("#status").empty();
							up4k.success(data.success);
							$(`#post-${id}`).html("<div>удалено</div>")
						} else {
							up4k.error(data.error)
						}
					},
					"error": function(data) {
						up4k.error(`${data.status} ${data.statusText}`)
					}
				})
			},
			"edit": function(id) {
				var postWrapper = $(`#post-${id} > .text`);
				$.ajax({
					"url": up4k.config.apiUrl,
					"data": {
						"method": "post.info",
						"id": id,
						"access_token": getCookie("access_token"),
					},
					"success": function(data) {
						if (data.success) {
							var editFormTemplate = _.template(up4k.templates.editPost);
							editFormTemplate = editFormTemplate({
								"post": data.success
							});
							postWrapper.html(editFormTemplate)
						} else {
							up4k.error(data.error)
						}
					},
					"error": function(data) {
						up4k.error(`${data.status} ${data.statusText}`)
					},
				});
				var submitEdition = function() {};
				var setEditEvent = setInterval(function() {
					try {
						document.getElementById(`editPost-${id}`).onsubmit = function() {
							var formData = $(`#editPost-${id}`).serializeObject();
							$.ajax({
								"url": up4k.config.apiUrl,
								"data": formData,
								"success": function(data) {
									if (data.success) {
										up4k.success(data.success);
										$.ajax({
											"url": up4k.config.apiUrl,
											"data": {
												"method": "post.info",
												"id": id,
												"access_token": getCookie("access_token"),
											},
											"success": function(data) {
												if (data.success) {
													$(`#post-${id} > .text`).html(data.success.post_text)
												} else {
													up4k.error(data.error) || up4k.error("Сервер вернул пустой запрос")
												}
											},
											"error": function(data) {
												up4k.error(`${data.status} ${data.statusText}`)
											},
										})
									} else {
										up4k.error(data.error)
									}
								},
								"error": function(data) {
									up4k.error(`${data.status} ${data.statusText}`)
								},
							});
							return !1
						};
						clearInterval(setEditEvent)
					} catch (e) {
						console.log('хуй')
					}
				}, 500)
			},
			"versions": function(id) {
				location.href = `#postVersions/${id}`
			},
			"report": function (id) {
				var reason = prompt('Введите причину своего негодования');
				$.ajax({
					"url": up4k.config.apiUrl,
					"data": {
						"access_token": getCookie('access_token'),
						"content_id": id,
						"content_type": "psto",
						"reason": reason,
						"method": "report.create"
					},
					"success": function (data) {
						if(data.success) {
							up4k.success(data.success);
						}
						else {
							up4k.error(data.error);
						}
					}
				});
			},
			"karmaView": function (id) {
				$.ajax({
					"url": up4k.config.apiUrl,
					"data": {
						"method": "karma.onPost",
						"post_id": id,
						"access_token": getCookie('access_token')
					},
					"success": function (data) {
						if(data.success) {
							$(`#post-${id} > .moderate > .karma > .count`).text(data.success.count);
						}
						else {
							up4k.error(data.error);
						}
					}
				});
			},
			"karmaPlus": function (id) {
				$.ajax({
					"url": up4k.config.apiUrl,
					"data": {
						"method": "karma.set",
						"access_token": getCookie('access_token'),
						"content_id": id,
						"content_type": "psto",
						"type": "plus",
					},
					"success": function (data) {
						if(data.success) {
							up4k.modules.post.karmaView(id);
						}
						else {
							up4k.error(data.error);
						}
					}
				});
			},
			"karmaMinus": function (id) {
				$.ajax({
					"url": up4k.config.apiUrl,
					"data": {
						"method": "karma.set",
						"access_token": getCookie('access_token'),
						"content_id": id,
						"content_type": "psto",
						"type": "minus",
					},
					"success": function (data) {
						if(data.success) {
							up4k.modules.post.karmaView(id);
						}
						else {
							up4k.error(data.error);
						}
					}
				});
			},
			"karmaList": function (id) {
				$.ajax({
					"url": up4k.config.apiUrl,
					"data": {
						"method": "karma.onPost",
						"post_id": id,
						"access_token": getCookie('access_token'),
					},
					"success": function (data) {
						if(data.success) {
							var list = $(`#post-${id} > .moderate > .karma > .votes > .list`);
							list.empty();
							$(data.success.advanced).each(function () {
								console.log(this)
								var count = Number(this.mass);
								if(this.type == 'minus') {
									count = count * (-1);
								}
								list.append(`<li>${this.voting_user} (${count})</li>`);
							});
							$(`#post-${id} > .moderate > .karma > .votes`).css({"display": "block"});
						}
						else {
							up4k.error(data.error);
						}
					}
				});
			}
		},
		"comment": {
			"delete": function(id) {
				var params = {
					"access_token": getCookie("access_token"),
					"method": "comment.delete",
					"id": id
				};
				$.ajax({
					"url": up4k.config.apiUrl,
					"data": params,
					"success": function(data) {
						if (data.success) {
							up4k.success(data.success);
							$(`#comment-${id}`).html("Удалено")
						} else {
							up4k.error(data.error)
						}
					},
					"error": function(data) {
						up4k.error(`Ошибка сервера: ${data.status} ${data.statusText}`)
					},
				})
			},
			"edit": function(id) {
				$.ajax({
					"url": up4k.config.apiUrl,
					"data": {
						"id": id,
						"method": "comment.info",
						"access_token": getCookie("access_token")
					},
					"success": function(data) {
						if (data.success) {
							var editForm = _.template(up4k.templates.editComment);
							var commentInfo = data.success;
							editForm = editForm({
								"comment": commentInfo
							});
							$(`#comment-${data.success.id} > .text`).html(editForm);
							$(`#editComment-${data.success.id}`).submit(function() {
								var params = $(this).serializeObject();
								$.ajax({
									"url": up4k.config.apiUrl,
									"data": params,
									"success": function(data) {
										if (data.success) {
											up4k.success(data.success)
										} else {
											up4k.error(data.error)
										}
										$.ajax({
											"url": up4k.config.apiUrl,
											"data": {
												"id": commentInfo.id,
												"method": "comment.info",
												"access_token": getCookie("access_token"),
											},
											"success": function(data) {
												if (data.success) {
													$(`#comment-${commentInfo.id} > .text`).html(data.success.comment_text)
												} else {
													up4k.error(data.error)
												}
											},
											"error": function(data) {
												up4k.error(`Сервер выплюнул хуйню: ${data.status} ${data.statusText}`)
											},
										})
									},
									"error": function(data) {
										up4k.error(`Сервер выплюнул хуйню: ${data.status} ${data.statusText}`)
									},
								});
								return !1
							})
						} else {
							up4k.error(data.error)
						}
					},
					"error": function(data) {
						up4k.error(`Сервер выплюнул хуйню: ${data.status} ${data.statusText}`)
					},
				})
			},
			"versions": function(id) {
				location.href = `#commentVersions/${id}`
			},
			"report": function (id) {
				var reason = prompt('Введите причину вашего негодования');
				$.ajax({
					"url": up4k.config.apiUrl,
					"data": {
						"access_token": getCookie('access_token'),
						"content_id": id,
						"content_type": "comment",
						"reason": reason,
						"method": "report.create"
					},
					"success": function (data) {
						if(data.success) {
							up4k.success(data.success)
						}
						else {
							up4k.error(data.error);
						}
					}
				});
			},
			"karmaView": function (id) {
				$.ajax({
					"url": up4k.config.apiUrl,
					"data": {
						"method": "karma.onComment",
						"access_token": getCookie('access_token'),
						"comment_id": id
					},
					"success": function (data) {
						if(data.success) {
							$(`#comment-${id} > .commentContent > .moderate > .karma > .count`).text(data.success.count);
						}
						else {
							up4k.error(data.error);
						}
					}
				});
			},
			"karmaPlus": function (id) {
				$.ajax({
					"url": up4k.config.apiUrl,
					"data": {
						"method": "karma.set",
						"access_token": getCookie('access_token'),
						"content_id": id,
						"content_type": 'comment',
						"type": "plus",
					},
					"success": function (data) {
						if(data.success) {
							up4k.modules.comment.karmaView(id);
						}
						else {
							up4k.error(data.error);
						}
					}
				});
			},
			"karmaMinus": function (id) {
				$.ajax({
					"url": up4k.config.apiUrl,
					"data": {
						"method": "karma.set",
						"access_token": getCookie('access_token'),
						"content_id": id,
						"content_type": 'comment',
						"type": "minus",
					},
					"success": function (data) {
						if(data.success) {
							up4k.modules.comment.karmaView(id);
						}
						else {
							up4k.error(data.error);
						}
					}
				});
			},
			"karmaList": function (id) {
				$.ajax({
					"url": up4k.config.apiUrl,
					"data": {
						"method": "karma.onComment",
						"comment_id": id,
						"access_token": getCookie('access_token'),
					},
					"success": function (data) {
						if(data.success) {
							var list = $(`#comment-${id} > .commentContent > .moderate > .karma > .votes > .list`);
							list.empty();
							$(data.success.advanced).each(function () {
								console.log(this)
								var count = Number(this.mass);
								if(this.type == 'minus') {
									count = count * (-1);
								}
								list.append(`<li>${this.voting_user} (${count})</li>`);
							});
							$(`#comment-${id} > .commentContent > .moderate > .karma > .votes`).css({"display": "block"});
						}
						else {
							up4k.error(data.error);
						}
					}
				});
			}
		},
		"ban": {
			"pardon": function (id) {
				$.ajax({
					"url": up4k.config.apiUrl,
					"data": {
						"method": "ban.pardon",
						"id": id,
						"access_token": getCookie('access_token'),
					},
					"success": function (data) {
						if(data.success) {
							up4k.success(data.success);
							$.ajax({
								"url": up4k.config.apiUrl,
								"data": {
									"method": "ban.infoById",
									"id": id,
									"access_token": getCookie('access_token'),
								},
								"success": function (data) {
									if(data.success) {
										up4k.modules.ban.listInSub(data.success.sub);
									}
									else {
										up4k.error(data.error);
									}
								}
							});
						}
						else {
							up4k.error(data.error);
						}
					}
				});
			},
			"listInSub": function (sub) {
				var banList = $("#banList");
				$.ajax({
					"url": up4k.config.apiUrl,
					"data": {
						"sub": sub,
						"method": "ban.listInSub",
						"access_token": getCookie('access_token'),
					},
					"success": function (data) {
						if(data.success) {
							var list = data.success;
							if(list[0]) {
								var htmlList = "";
								$(list).each(function () {
									var banTemplate = _.template(up4k.templates.ban);
									var banTemplate = banTemplate({"ban": this});
									htmlList += banTemplate;
								});
								banList.html(htmlList);
								$('.pardon').click(function () {
									var banId = $(this).attr('ban_id');
									up4k.modules.ban.pardon(banId);
								});
							}
							else {
								banList.html('Здесь пусто, нет ничего вообще');
							}
						}
						else {
							up4k.error(data.error);
						}
					},
					"error": function () {
						up4k.error(`Ошибка сервера: ${data.status} ${data.statusText}`);
					},
				});
			},
		},
		"sub": {
			"moderators": function (sub) {
				$.ajax({
					"url": up4k.config.apiUrl,
					"data": {
						"method": "sub.moderators",
						"address": sub,
						"access_token": getCookie('access_token'),
					},
					"success": function (data) {
						if(data.success) {
							var moderatorTemplate = `<div class="moderator"><%-moderator.username%> 
														<form class="removeModerator">
															<input type="hidden" name="method" value="sub.removeModerator">
															<input type="hidden" name="username" value="<%-moderator.username%>">
															<input type="hidden" name="sub" value="${sub}">
															<input type="hidden" name="access_token" value="${getCookie('access_token')}">
															<button type="submit">Отобрать банхаммер</button>
														</form>
													</div>`;
							var moderatorsHTML = "";
							$(data.success).each(function () {
								var moderator = this;
								var moderatorTemplateReady = _.template(moderatorTemplate);
								moderatorTemplateReady = moderatorTemplateReady({"moderator": moderator});
								moderatorsHTML += moderatorTemplateReady;
							});
							$("#modList").html(moderatorsHTML);
							$('.removeModerator').submit(function () {
								var params = $(this).serializeObject();
								$.ajax({
									"url": up4k.config.apiUrl,
									"data": params,
									"success": function () {
										if(data.success) {
											up4k.success('Выпилен!');
											$("#modList").empty();
										}
										else {
											up4k.error(data.error);
										}
									},
									"complete": function () {
										up4k.modules.sub.moderators(sub);
									}
								});
								return false;
							});
						}
						else {
							up4k.error(data.error);
						}
					}
				});
			},
		},
	},

	"templates": {
		"ban": `<div class="ban" id="ban-<%=ban.id%>">
			<p><%=ban.banned_user%> забанен лопатой <%=date(up4k.config.dateFormat, ban.ban_date)%> до <%=date(up4k.config.dateFormat, ban.time)%> по причине "<%=ban.reason%>" в разделе <%=ban.sub%> мордератором <%=ban.moderator%>
			<% if(ban.discontinued) { %>
			и разбанен <%=date(up4k.config.dateFormat, ban.discontinued_in_date)%> модератором <%=ban.discontinued_by%>
			<% } if(!ban.expired && !ban.discontinued) { %>
			<div><button class="pardon" ban_id="<%=ban.id%>">Разбанить</button></div>
			<% } %>
			</p>
		</div>`,
		"editPost": `<div>
	<form action="" id="editPost-<%=post.id%>">
		${sandboxLink}
		<div><textarea name="text" id="text" cols="30" rows="10"><%=post.raw_text%></textarea>
		<input type="hidden" name='id' id='id' value='<%=post.id%>' />
		<input type="hidden" name='method' id='method' value='post.edit' />
		<input type="hidden" name='access_token' value='${getCookie('access_token')}' /></div>
		<div><button type="submit" name="doEditPost" id="doEditPost">Заредачить</button></div>
	</form>		
</div>`,
		"editComment": `<div>
	<form action="" id="editComment-<%=comment.id%>">
		${sandboxLink}
		<div><textarea name="text" id="text" cols="30" rows="10"><%=comment.raw_text%></textarea>
		<input type="hidden" name='id' id='id' value='<%=comment.id%>' />
		<input type="hidden" name='method' id='method' value='comment.edit' />
		<input type="hidden" name='access_token' value='${getCookie('access_token')}' /></div>
		<div><button type="submit" name="doEditComment" id="doEditComment">Заредачить</button></div>
	</form>		
</div>`,
		"subInfo": `<div class="subInfo">
	<h3 class="subName"><a href="#sub/<%= sub.address %>"><%= sub.name %></a></h3>
</div>`,
		"inSub": `
<div class="inSub">
	<h2><%= sub.name %> <sup class="presidentLink"><a href="#manage/<%=sub.address%>">Президентская лажа</a></sup></h2>
	<details>
		<summary>Описание</summary>
		<div class="subDescription"><%= sub.description %></div>
	</details>
</div>		
		`,
		"editor": `<details>
			<summary>Разметка</summary>
			<div id="editor">
				<button onclick='click_bb("**", "**");'><b>Жыр</b></button>
				<button onclick='click_bb("*", "*");'><i>Пизданская башня</i></button>
				<button onclick='click_bb("~~", "~~");'><s>Не то сказал</s></button>
				<button onclick='editor.img()'>Image</button>
				<button onclick='editor.link()' class="link">Link</button>
				<button onclick='click_bb("[irony]", "[/irony]")' class="btnIrony">Irony</button>
				<button onclick='click_bb("[bkb]", "[/bkb]")' class="btnBkb">БКБ!</button>
				<button onclick='click_bb("[bnb]", "[/bnb]")' class="btnBnb">БНБ!</button>
				<button onclick="editor.youtube()">YouTube</button>
				<button onclick="editor.textStyle()">Текст со стилем</button>
				<button onclick="editor.pastebin()">Pastebin</button>
			</div>
		</details>`,
		"postForm": `<details>
						<summary>Запостить</summary>
						<form id="postForm">
							<div><p>Ваш шедевр:</p> ${sandboxLink}<p><textarea name="text" id="text" cols="30" rows="10" placeholder="ПИШИ ЧТО ХОЧЕШЬ, ВЕДЬ ДЕТИ УЗНАЮТ И ОХУЕЮТ!!!1"></textarea></p></div>
							<input type="hidden" name="sub" id="sub" value="<%=sub%>">
							<button id="postFormYarrr">YARRR!</button>
						</form>
					</details>`,
		"tagLines": [
			"<b>СТОЙ И ДВИГАЙ УПОР ЛЕЖА, <%=username%>!!!11</b>",
			"Лопатой Упячку не остановишь, <%=username%>",
			"Вам подарок — <b>ТРАВЫ ИЗ УЗЫСТАНА!!!!</b>, <%=username%>",
			"<span class='irony'>Ебанистыд не знать злого котэ, <%=username%>. У вас же ни одного олдфага на форуме</span>",
			"Исходник парсера хуже любых фильмов ужасов, <%=username%>",
			"ЫСТЫК ПИШТЕР ФИЛЬМЕР ТРИ АХУЕВАЙ ПРИКОЛЫ ЖРИ, <%=username%>",
			"Пиво есть, <%=username%> ???",
			"Не пость тупак на глагне, <%=username%>!",
			"Ебани меня палкой, <%=username%>",
			"Это я <%=username%> помоги мне выбраться из печки",
			"У МЕНЯ ХУЙ НЕ ВКЛЮЧАЕТСЯ, <%=username%>",
			"Батарейки менять пробовал, <%=username%>?",
			"ВИДИТЕ, <%=username%>, ТЕЛЕВИЗОР РАБОТАЕТ!!!11",
			"Ебизнес накрылся полным ебизнесом, <%=username%>",
		],
		"post": `<div class="post <% if (post.is_invited != 0) { %>gold<% } %>" id="post-<%=post.id%>">
	<div class="text"><%=post.post_text%></div>
	<% if (misc.moderateAvailable) { %>
	<div class="moderate">
		<% if (!misc.deleted) { %>
		<% if(misc.karmaAvailable) { %>
		<div class="karma">
			<button class="plus" onclick="up4k.modules.post.karmaPlus(<%=post.id%>)"><i class="fa fa-thumbs-o-up"></i></button>
			<span class="count" onclick="up4k.modules.post.karmaList(<%=post.id%>)"><%=misc.karma%></span>
			<button class="minus" onclick="up4k.modules.post.karmaMinus(<%=post.id%>)"><i class="fa fa-thumbs-o-down"></i></button>
			<div class="votes"><button class="closeVotes" title="Закрыть" onclick="$(this).parent().css('display', 'none')"><i class="fa fa-close"></i></button> <ul class="list"></ul></div>
		</div>
		<% } %>
		<button class="delete" onclick="up4k.modules.post.delete(<%=post.id%>)" title='Удалить'><i class="fa fa-close"></i></button>
		<button class="edit" onclick="up4k.modules.post.edit(<%=post.id%>)" title='Редактировать'><i class="fa fa-edit"></i></button>
		<button class="versions" onclick="up4k.modules.post.versions(<%=post.id%>)" title='Версии поста'><i class="fa fa-archive"></i></button>
		<button class="report" onclick="up4k.modules.post.report(<%=post.id%>)" title='Репорт'><i class="fa fa-exclamation"></i></button>
		<% } %>
	</div>
	<% } %>
	<div class="autograph"><span class="username" onclick="window.up4k.mention($(this).html());"><%=post.author%></span> написал этот псто <%=date(window.up4k.config.dateFormat, post.create_time)%>, <% if(misc.idInLink) { %><a href="#comments/<%=post.id%>/"><% } %>#<%=post.id%><% if(misc.idInLink) { %></a><% } %><% if (misc.edition) { %>, отредактировал <%=post.editor%> <%=date(up4k.config.dateFormat, post.ver_time)%><% } %></div>
</div>`,
		"comment": `<div class="comment" id="comment-<%=comment.id%>" cid="<%=comment.id%>">
						<div class='commentContent'>
							<div class="text"><%=comment.comment_text%></div>
							<% if (misc.moderateAvailable) { %>
							<div class="moderate">
								<% if (!misc.deleted) { %>
								<% if(misc.karmaAvailable) { %>
								<div class="karma">
									<button class="plus" onclick="up4k.modules.comment.karmaPlus(<%=comment.id%>)"><i class="fa fa-thumbs-o-up"></i></button>
									<span class="count" onclick="up4k.modules.comment.karmaList(<%=comment.id%>)"><%=misc.karma%></span>
									<button class="minus" onclick="up4k.modules.comment.karmaMinus(<%=comment.id%>)"><i class="fa fa-thumbs-o-down"></i></button>
									<div class="votes"><button class="closeVotes" title="Закрыть" onclick="$(this).parent().css('display', 'none')"><i class="fa fa-close"></i></button> <ul class="list"></ul></div>
								</div>
								<% } %>
								<button class="delete" onclick="up4k.modules.comment.delete(<%=comment.id%>)" title='Удалить'><i class="fa fa-close"></i></button>
								<button class="edit" onclick="up4k.modules.comment.edit(<%=comment.id%>)" title='Редактировать'><i class="fa fa-edit"></i></button>
								<button class="versions" onclick="up4k.modules.comment.versions(<%=comment.id%>)" title='Версии комментария'><i class="fa fa-archive"></i></button>
								<button class="report" onclick="up4k.modules.comment.report(<%=comment.id%>)" title='Репорт'><i class="fa fa-exclamation"></i></button>
								<% } %>
							</div>
							<% } %>
							<div class="autograph"><span class="username" onclick="window.up4k.mention($(this).html());"><%=comment.author%></span> написал этот псто <%=date(window.up4k.config.dateFormat, comment.create_time)%>, <% if(misc.idInLink) { %><a href="#comment/<%=comment.id%>/"><% } %>#<%=comment.id%><% if(misc.idInLink) { %></a><% } %><% if(misc.edition) { %>, отредактировал <%=comment.editor%> <%=date(up4k.config.dateFormat, comment.edition_time)%><% } %> <% if (misc.replyLink) { %><a href="javascript:void(0);" id="replyTo-<%=comments.id%>"  onclick="reply('<%=comment.id%>')">ответить</a><% } %></div>
							<div id="reply-<%=comment.id%>" class="reply"></div>
						</div>
					<div class="parentComments"></div>
				</div>`,
		"commentForm": `<div><p>Ваш шедевр:</p> ${sandboxLink}<p><textarea name="text" id="text" cols="30" rows="10" placeholder="ПИШИ ЧТО ХОЧЕШЬ, ВЕДЬ ДЕТИ УЗНАЮТ И ОХУЕЮТ!!!1"></textarea></p></div>
	<input type="hidden" name="post_id" id="post_id" value="<%=post_id%>">
	<input type="hidden" name="parent_comment" value="<% if(misc && misc.parentComment) { %><%=misc.parentComment%><% } else { %>0<% } %>">
	<button id="postFormYarrr">YARRR!</button>`,
		"subInMyManage": `<div class="subInMyManage">
			<h3><a href="#manage/<%=sub.address%>"><%=sub.name%></a></h3>
		</div>`,
		"modlogEntry": function(entry) {
			return `<tr>
				<td>${entry.id}</td>
				<td>${entry.moderator}</td>
				<td>${entry.type}</td>
				<td>${entry.post_id}</td>
				<td>${entry.comment_id}</td>
				<td>${entry.sub}</td>
				<td>${entry.user_moderated}</td>
				<td>${date(up4k.config.dateFormat, entry.datetime)}</td>
			</tr>`
		},
	},
	"pages": {
		"register": function() {
			window.up4k.setTitle(`Регистрация`);
			if (!window.isLogged) {
				$("#up4k").append("<h2>Регистрация</h2>");
				$("#up4k").append(`
	<div id="register">
		<div class="hello">
			<p class="irony big">Осторожно, комраде! Двери кагбе ПЫЩЬ! Следующая остановка — Упячка!</p>
		</div>
		<form action="" id="regaForm">
			<div><label for="login">Логин: </label><input type="text" name="login" id="login"></div>
			<div><label for="passwd">Пароль: </label><input type="password" name="passwd" id="passwd"></div>
			<div><label for="passwd_verify">Подтверждение пароля: </label><input type="password" name="passwd_verify" id="passwd_verify"></div>
			<div><label for="email">Мыло: </label><input type="text" name="email" id="email"></div>
			<div><label for="invite" >Инвайт: </label><input type="text" name="invite" id="invite"></div>
			<div><button id="regaYarrr">YARRR!</button></div>
		</form>
	</div>
	`);
				if(up4kURL[1]) {
					$("#invite").val(up4kURL[1]);
				}

				$("#regaForm").submit(function() {
					params = $("#regaForm").serializeObject();
					params.method = "user.register";
					$.ajax({
						"url": window.up4k.config.apiUrl,
						"data": params,
						"dataType": "json",
						"success": function(data) {
							if (data.success) {
								window.up4k.success("Зарегано!");
								location.href = "#"
							} else if (data.error) {
								window.up4k.error(data.error)
							}
						},
						"error": function(data) {
							window.up4k.error(`ПИЗДЕЦ! КРОЛИКИ ЕБАНУЛИСЬ И ПИШУТ ВОТ ЭТО: ${data.status} ${data.statusText}`)
						}
					});
					return !1
				})
			} else {
				location.href = "#"
			}
		},
		"login": function() {
			window.up4k.setTitle('Логин');
			if (!window.isLogged) {
				$("#up4k").append("<h2>Логин</h2>");
				$("#up4k").append(`
	<div id="login">
		<form action="" id="loginForm">
			<div><label>Логин: <input id="login" type="text" name="login" ></label></div>
			<div><label>Пароль: <input id="passwd" type="password" name="passwd" ></label></div>
			<div><button type="submit" name="loginYarrr" id="loginYarrr">GSOM!1</button></div> 
		</form>
	</div>`);
				$("#loginForm").submit(function() {
					var params = $("#loginForm").serializeObject();
					params.method = "user.getToken";
					$.ajax({
						"url": window.up4k.config.apiUrl,
						"data": params,
						"dataType": "json",
						"success": function(data) {
							if (data.success) {
								window.up4k.checkLogin();
								window.up4k.initMenu();
								window.up4k.initMenu();
								setCookie('access_token', data.success.code, { expires: new Date(data.success.expires_in * 1000) });
								var checkLoginInterval = setInterval(function() {
									up4k.checkLogin();
									if (isLogged) {
										location.href = "#sub/main";
										clearInterval(checkLoginInterval)
									}
								}, 500);
								window.up4k.success("Риальне логине!")
							} else if (data.error) {
								window.up4k.error(data.error)
							}
						},
						"error": function(data) {
							window.up4k.error(`Ошибка сервера: ${data.status} ${data.statusText}`)
						},
					});
					return !1
				})
			} else {
				location.href = "#"
			}
		},
		"logout": function() {
			window.up4k.setTitle('Уходим...');
			deleteCookie("access_token");
			window.up4k.checkLogin();
			window.up4k.initMenu();
			window.up4k.initMenu();
			location.href = "#"
		},
		"createSubPage": function() {
			window.up4k.setTitle("Создать раздел");
			if (window.isLogged) {
				$("#up4k").append(`
	<div id="createSubPage">
		<div class="hello">
			<p>Прежде чем создать раздел:</p>
			<ul>
				<li>Ваш раздел не может быть ни о чем</li>
				<li>Адрес вашего раздела не должен состоять из одной буквы, ибо не понятно — о чем, блять, раздел</li>
			</ul>
		</div>
		<form action="" id="createSubPageForm">
			<div><label>Адрес: <input type="text" name="address" id="address"></label></div>
			<div><label>Имя: <input type="text" name="name" id="name"></label></div>
			<div><label>Описание: <textarea name="description" id="description" cols="30" rows="10"></textarea></label></div>
			<div><button name="createSubPageYarrr">Создать</button></div>
		</form>
	</div>
				`);
				$("#createSubPageForm").submit(function() {
					var params = $("#createSubPageForm").serializeObject();
					params.method = "sub.create";
					params.access_token = getCookie("access_token");
					$.ajax({
						"url": window.up4k.config.apiUrl,
						"data": params,
						"dataType": "json",
						"success": function(data) {
							if (data.success) {
								window.up4k.success(data.success);
								location.href = "#"
							} else if (data.error) {
								window.up4k.error(data.error)
							}
						},
						"error": function(data) {
							window.up4k.error(`Ошибка сервера: ${data.status} ${data.statusText}`)
						},
					});
					return !1
				})
			} else {
				location.href = "#"
			}
		},
		"sub": function() {
			if (window.isLogged) {
				if (!window.up4kURL[1] || window.up4kURL[1] == "") {
					window.up4k.setTitle("Разлелы");
					$("#up4k").append("<h2>Разделы</h2>");
					$("#up4k").append(`<div id="subList"></div>`);
					$.ajax({
						"url": window.up4k.config.apiUrl,
						"dataType": "json",
						"data": {
							"method": "sub.list",
							"access_token": getCookie("access_token"),
						},
						"success": function(data) {
							if (data.success) {
								$(data.success).each(function() {
									var subInfoTemplate = _.template(window.up4k.templates.subInfo);
									var templateData = {
										"sub": this
									};
									$("#subList").append(subInfoTemplate(templateData))
								})
							} else {
								window.up4k.error(data.error)
							}
						},
						"error": function(data) {
							window.up4k.error(`Ошибка сервера: ${data.status} ${data.statusText}`)
						}
					})
				} else {
					$("#up4k").append(`<div id="sub"></div>`);
					$.ajax({
						"url": window.up4k.config.apiUrl,
						"data": `method=sub.info&address=${window.up4kURL[1]}&access_token=${getCookie("access_token")}`,
						"dataType": "json",
						"success": function(data) {
							if (window.up4kURL[2]) {
								window.postsPage = window.up4kURL[2]
							} else {
								window.postsPage = 0
							}
							if (data.success) {
								window.currentSub = data.success;
								var inSub = _.template(window.up4k.templates.inSub);
								var templateData = {
									"sub": data.success
								};
								window.up4k.setTitle(data.success.name);
								$("#sub").append(inSub(templateData));
								$("#sub").append(`<div id="forms"></div>`);
								var postForm = _.template(window.up4k.templates.postForm);
								$("#forms").append(`${postForm({"sub": data.success.address})}
								<details>
									<summary>Потыкать разные <!-- indev --> фишки</summary>
									<div><button id="loadPosts">Загрузить новые посты</button></div>
								</details>
								`);

								function pagination() {
									$("#pagination").remove();
									$("#sub").append(`<div id="pagination">
										<div class="pages">
											<table style="">
												<tbody>
													<tr>
														
													</tr>
												</tbody>
											</table>
										</div>
									</div>`);
									$.ajax({
										"url": window.up4k.config.apiUrl,
										"data": {
											"method": "post.totalPagesInSub",
											"sub": data.success.address,
											"access_token": getCookie("access_token"),
										},
										"success": function(data) {
											if (data.success || data.success == 0) {
												var totalPages = data.success;
												var pagesArray = _.range(Number(totalPages) + 1);
												$(pagesArray).each(function() {
													if (window.postsPage != this) {
														$(".pages > table > tbody > tr").append(`<td><a href="#sub/${window.up4kURL[1]}/${this}">${this}</a></td>`)
													} else {
														$(".pages > table > tbody > tr").append(`<td><span class="activePage">${this}</span></td>`)
													}
												})
											} else {
												window.up4k.error(data.error)
											}
										},
									})
								}

								function loadPosts() {
									if (window.up4kURL[2]) {
										window.postsPage = window.up4kURL[2]
									} else {
										window.postsPage = 0
									}
									$.ajax({
										"url": window.up4k.config.apiUrl,
										"data": `method=post.listInSub&sub=${data.success.address}&page=${window.postsPage}&access_token=${getCookie("access_token")}`,
										"dataType": "json",
										"beforeSend": function() {
											window.up4k.status("Загружаю епта...", "loading", !0)
										},
										"success": function(data) {
											if (data.success) {
												$("#posts").empty();
												$(data.success).each(function() {
													var postTemplate = _.template(window.up4k.templates.post);
													window.temp.push(this);
													up4k.modules.post.karmaView(this.id);
													$("#posts").append(postTemplate({
														"post": this,
														"misc": {
															"idInLink": !0,
															"moderateAvailable": !0,
															"karmaAvailable": true,
															"karma": 0
														}
													}));
												});
												$("#status").empty()
											} else {
												window.up4k.error(data.error)
											}
										},
										"error": function(data) {
											window.up4k.error(`Ошибка сервера ${data.status} ${data.statusText}`)
										}
									});
									pagination()
								}

								function submitPost() {
									var params = $("#postForm").serializeObject();
									params.method = "post.create";
									params.access_token = getCookie("access_token");
									$.ajax({
										"url": window.up4k.config.apiUrl,
										"data": params,
										"success": function(data) {
											if (data.error) {
												if (data.error.ban) {
													window.up4k.error(`Забанен`)
												} else {
													window.up4k.error(data.error)
												}
											} else {
												window.up4k.success(data.success);
												textarea = $("#text")[0];
												$(textarea).val("");
												loadPosts()
											}
										},
										"error": function(data) {
											window.up4k.error(`Ошибка сервера: ${data.status} ${data.statusText}`)
										},
									})
								}
								$("#postForm").submit(function() {
									submitPost();
									return !1
								});
								$('#text').keydown(function(e) {
									if (e.ctrlKey && e.keyCode == 13) {
										submitPost();
										return !1
									}
								});
								$("#sub").append(`<div id="posts"></div>`);
								loadPosts();
								$("#loadPosts").click(function() {
									loadPosts()
								})
							} else if (data.error) {
								window.up4k.error(data.error);
								location.href = "#sub"
							}
						},
						"error": function(data) {
							window.up4k.error(`Ошибка сервера: ${data.status} ${data.statusText}`)
						},
					})
				}
			} else {
				location.href = "#"
			}
		},
		"comments": function() {
			$("#up4k").append(`<div id="commentsPage"></div>`);
			if (!window.up4kURL[1]) {
				window.up4k.error("Потс не выбран")
			} else {
				$.ajax({
					"url": window.up4k.config.apiUrl,
					"data": {
						"method": "post.info",
						"id": window.up4kURL[1],
						"access_token": getCookie("access_token"),
					},
					"success": function(data) {
						if (data.success) {
							window.postInfo = data.success;
							window.up4k.setTitle(`/${window.postInfo.sub}/ — Псто #${window.up4kURL[1]}`);
							postInfoTemplate = _.template(window.up4k.templates.post);
							$("#commentsPage").append(`<div id="postInfo"></div>`);
							up4k.modules.post.karmaView(data.success.id);
							$("#postInfo").append(postInfoTemplate({
								"post": data.success,
								"misc": {
									"idInLink": !1,
									"moderateAvailable": !0,
									"karmaAvailable": true,
									"karma": 0
								}
							}));
							$("#commentsPage").append(`<div id="comments"></div>`);
							$("#commentsPage").append(`<div id="commentsMeta"></div>`);

							function loadParentComments(commentId) {
								$.ajax({
									"url": window.up4k.config.apiUrl,
									"data": {
										"method": "comment.parentComments",
										"comment_id": commentId,
										"access_token": getCookie("access_token"),
									},
									"success": function(data) {
										if (data.success) {
											$(data.success).each(function() {
												var commentTemplate = _.template(window.up4k.templates.comment);
												up4k.modules.comment.karmaView(this.id);
												var commentTemplateReady = commentTemplate({
													"comment": this,
													"misc": {
														"idInLink": !0,
														"replyLink": !0,
														"moderateAvailable": !0,
														"karmaAvailable": true,
														"karma": 0
													}
												});
												$(`#comment-${commentId} > .parentComments`).append(commentTemplateReady);
												loadParentComments(this.id)
											})
										} else {}
									},
									"error": function(data) {
										window.up4k.error(`Ошибка: ${data.status} ${data.statusText}`)
									}
								})
							}

							function loadComments(parentComment = 0) {
								window.parentComment = parentComment;
								$.ajax({
									"url": window.up4k.config.apiUrl,
									"data": {
										"method": "comment.listUnderPost",
										"post_id": window.up4kURL[1],
										"access_token": getCookie("access_token"),
									},
									"beforeSend": function() {
										window.up4k.status("Загружаю епта...", "loading", !0)
									},
									"success": function(data) {
										if (data.success) {
											$("#comments").html(`<h2>Комментарии</h2><hr><div id="all"></div>`);
											window.comments = data.success;
											$(comments).each(function() {
												var commentTemplate = _.template(window.up4k.templates.comment);
												up4k.modules.comment.karmaView(this.id);
												$("#all").append(commentTemplate({
													"comment": this,
													"misc": {
														"idInLink": !0,
														"replyLink": !0,
														"moderateAvailable": !0,
														"karmaAvailable": true,
														"karma": 0
													}
												}));
												loadParentComments(this.id)
											})
										} else {
											window.up4k.error(data.error)
										}
										$("#status").empty()
									},
								})
							}
							window.reply = function(to) {
								$(".reply, #commentsPanel").each(function() {
									$(this).empty()
								});
								if (to != 0) {
									$("#commentsPanel").html("<div><a href='javascript:reply(0);'>Я, пожалуй, оставлю комментарий</a></div>");
									$(`#comment-${to} > .commentContent > .reply`).prepend(window.up4k.templates.editor);
									commentForm = _.template(window.up4k.templates.commentForm);
									commentForm = commentForm({
										"post_id": window.postInfo.id,
										"misc": {
											"parentComment": to
										}
									});
									$(`#comment-${to} > .commentContent > .reply`).append(`<form id="commentsForm"></form>`);
									$("#commentsPanel").append(`<button id="loadComments">Обновить комментарии</button>`);
									$("#loadComments").click(function() {
										loadComments();
										return !1
									});
									$(`#comment-${to} > .commentContent > .reply > #commentsForm`).html(commentForm)
								} else {
									$(`#commentsPanel`).prepend(window.up4k.templates.editor);
									commentForm = _.template(window.up4k.templates.commentForm);
									commentForm = commentForm({
										"post_id": window.postInfo.id,
										"misc": {
											"parentComment": to
										}
									});
									$(`#commentsPanel`).append(`<form id="commentsForm"></form>`);
									$("#commentsPanel").append(`<button id="loadComments">Обновить комментарии</button>`);
									$("#loadComments").click(function() {
										loadComments();
										return !1
									});
									$(`#commentsPanel > #commentsForm`).html(commentForm)
								}
								document.getElementById("commentsForm").onsubmit = function() {
									submitComment();
									return !1
								};
								$('#text').keydown(function(e) {
									if (e.ctrlKey && e.keyCode == 13) {
										submitComment();
										return !1
									}
								})
							};
							loadComments();
							$("#commentsPage").append(`<div id="commentsPanel"></div>`);
							$("#commentsPanel").append(`<button id="loadComments">Обновить комментарии</button>`);
							$("#loadComments").click(function() {
								loadComments();
								return !1
							});
							reply(0);

							function submitComment() {
								var commentFormData = $("#commentsForm").serializeObject();
								commentFormData.method = "comment.create";
								commentFormData.access_token = getCookie("access_token");
								$.ajax({
									"url": window.up4k.config.apiUrl,
									"data": commentFormData,
									"success": function(data) {
										if (data.success) {
											window.up4k.success(data.success);
											$("#text").val("");
											loadComments()
										} else {
											if (data.error.ban) {
												window.up4k.error("Забанен")
											} else {
												window.up4k.error(data.error)
											}
										}
									},
									"error": function(data) {
										window.up4k.error(`Ошибка сервера: ${data.status} ${data.statusText}`)
									}
								})
							}
						} else {
							window.up4k.error(data.error);
							window.up4k.setTitle(data.error)
						}
					},
					"error": function(data) {
						window.up4k.error(`Ошибка сервера: ${data.status} ${data.statusText}`)
					},
				})
			}
		},
		"freeInvites": function() {
			up4k.setTitle("Халява! Воруй! Убивай!");
			$("#up4k").append(`<div id="freeInvites"></div>`);
			$("#freeInvites").append("<ul></ul>");
			$.ajax({
				"url": window.up4k.config.apiUrl,
				"data": {
					"method": "invite.freeList",
				},
				"success": function(data) {
					if (data.success) {
						$(data.success).each(function() {
							$("#freeInvites > ul").append(`<li>${this.code}</li>`)
						})
					}
				}
			})
		},
		"invites": function() {
			if (window.isLogged) {
				up4k.setTitle("Отдать слонов в хорошие руки");
				$("#up4k").append("<div id='invites'></div>");
				$("#invites").append(`<div class="inviteWarning"><p>${userInfo.login}, помни, что только ты ответственен за каждого приглашенного. Не раздавай инвайты кому попало.</p></div><ul></ul>`);
				$.ajax({
					"url": window.up4k.config.apiUrl,
					"data": {
						"method": "invite.getMyList",
						"access_token": getCookie("access_token"),
					},
					"success": function(data) {
						invites = data.success;
						$(invites).each(function() {
							$("#invites > ul").append(`<li id="invite-${this.id}"><input type="text" value="${up4k.config.siteUrl}/register/${this.code}"> <button>Скопировать ссылку</button></li>`);
							var invite = this;
							document.querySelector(`#invite-${this.id} > button`).onclick = function () {
								document.querySelector(`#invite-${invite.id} > input`).select();
								document.execCommand('copy');
							};
						})
					},
				})
			} else {
				window.up4k.pages.main()
			}
		},
		"modlog": function() {
			$("#up4k").html(`<div id="modlogPage"></div>`);
			$.ajax({
				"url": up4k.config.apiUrl,
				"data": {
					"method": "modlog.read",
					"access_token": getCookie("access_token"),
				},
				"success": function(data) {
					if (data.success) {
						up4k.setTitle("Провинности кровавой мочерации");
						$("#modlogPage").html(`<table id="modlog"><thead></thead><tbody></tbody></table>`);
						$("#modlog > thead").append(`<tr>
							<td>ID</td>
							<td>Мочератор</td>
							<td>Тип</td>
							<td>ID поста</td>
							<td>ID комментария</td>
							<td>Разлел</td>
							<td>На кого повлияло</td>
							<td>Время</td>
						</tr>`);
						$(data.success).each(function() {
							$("#modlog > tbody").append(up4k.templates.modlogEntry(this))
						})
					} else {
						up4k.error(data.error)
					}
				}
			})
		},
		"getInvites": function() {
			if (window.isLogged) {
				$.ajax({
					"url": window.up4k.config.apiUrl,
					"data": {
						"method": "invite.get",
						"access_token": getCookie("access_token"),
					},
					"success": function(data) {
						if (data.success) {
							window.up4k.success(data.success)
						} else {
							window.up4k.error(data.error)
						}
					},
				});
				location.href = "#"
			} else {
				window.up4k.pages.main()
			}
		},
		"main": function() {
			window.up4k.setTitle('Глагне');
			if (window.isLogged) {
				location.href = "#sub/main"
			} else {
				location.href = "#login"
			}
		},
		"postVersions": function() {
			if (up4kURL[1]) {
				$("#up4k").append(`<div id="postVersions"></div>`);
				$.ajax({
					"url": up4k.config.apiUrl,
					"data": {
						"method": "post.versions",
						"id": up4kURL[1],
						"access_token": getCookie("access_token"),
					},
					"success": function(data) {
						if (data.success) {
							up4k.setTitle(`Версии поста #${up4kURL[1]}`);
							var versions = data.success;
							if (versions[0]) {
								$(versions).each(function() {
									version = this;
									var versionTemplate = _.template(up4k.templates.post);
									versionTemplate = versionTemplate({
										"post": {
											"id": version.post_id,
											"post_text": version.text,
											"author": version.author,
											"create_time": version.post_time,
											"ver_time": version.ver_time,
											"editor": version.editor
										},
										"misc": {
											"edition": !0
										}
									});
									$("#postVersions").prepend(versionTemplate)
								})
							} else {
								$("#postVersions").html(`<p>Здесь пусто, нет ничего вообще</p>`)
							}
						} else {
							up4k.error(data.error)
						}
					}
				})
			} else {
				up4k.error("Не выбран потс!1")
			}
		},
		"commentVersions": function() {
			if (up4kURL[1]) {
				$("#up4k").append(`<div id="commentVersions"></div>`);
				$.ajax({
					"url": up4k.config.apiUrl,
					"data": {
						"id": up4kURL[1],
						"method": "comment.versions",
						"access_token": getCookie("access_token"),
					},
					"success": function(data) {
						if (data.success) {
							var versions = data.success;
							if (versions[0]) {
								$(versions).each(function() {
									var version = this;
									var versionTemplate = _.template(up4k.templates.comment);
									versionTemplate = versionTemplate({
										"comment": {
											"id": version.post_id,
											"comment_text": version.text,
											"author": version.author,
											"create_time": version.post_time,
											"editor": version.editor,
											"edition_time": version.ver_time
										},
										"misc": {
											"moderateAvailable": !1,
											"idInLink": !0,
											"edition": !0,
										},
									});
									$("#commentVersions").append(versionTemplate)
								})
							} else {
								$("#commentVersions").html(`<p>Здесь пусто, нет ничего вообще</p>`)
							}
						} else {
							up4k.error(data.error)
						}
					},
					"error": function(data) {
						up4k.error(`Ошибка сервера: ${data.status} ${data.statusText}`)
					}
				})
			} else {
				up4k.error("Не выбран комменте!!1")
			}
		},
		"manage": function () {
			$("#up4k").html(`<div id="manage">
				
			</div>`);
			if(isLogged)
			{
				if(!up4kURL[1])
				{
					/**
					 * Список разделов
					 */
					$.ajax({
						"url": up4k.config.apiUrl,
						"data": {
							"method": "sub.inMyManage",
							"access_token": getCookie("access_token")
						},
						"success": function (data) {
							if(data.success)
							{
								up4k.setTitle("Управление");
								var inMyManage = data.success;
								console.log(inMyManage);
								$("#manage").html(`<h2>Управление разделами</h2>`);
								if(inMyManage[0]) {
									$(inMyManage).each(function () {
										var inMyManageTemplate = _.template(up4k.templates.subInMyManage);
										inMyManageTemplate = inMyManageTemplate({"sub": this});
										$("#manage").append(inMyManageTemplate);
									});
								}
								else
								{
									$("#manage").append("<p>Вы ничем не управляете</p>");
								}
							}
						},
					});
				}
				else
				{
					/**
					 * Управление конкретным разделом
					 */
					$.ajax({
						"url": up4k.config.apiUrl,
						"data": {
							"method": "sub.info",
							"address": up4kURL[1],
							"access_token": getCookie("access_token"),
						},
						"success": function (data) {
							if(data.success) {
								var sub = data.success;
								if(sub.can_moderate) {
									/**
									 * Предоставляем панель офигения
									 */
									var linkToManage = `#manage/${up4kURL[1]}`;
									$('#manage').append(`<div id='menu'><ul>
										<li><a href="${linkToManage}/summary/">Общий вид</a></li>
										<li><a href="${linkToManage}/bans/">Баны</a></li>
										<li><a href="${linkToManage}/mods/">Модераторы</a></li>
										<li><a href="${linkToManage}/reports/">Репорты</a></li>
									</ul></div>`);
									if(!up4kURL[2] || up4kURL[2] == 'summary') {
										/**
										 * Редактирование описания раздела
										 */
										up4k.setTitle("Редактирование раздела");
										$("#manage").append(`<div id="summary"></div>`);
										$("#summary").html(`<h2>Редактирование раздела</h2>
										<div id="edit"></div>`);
										$("#summary > #edit").html(`<form>
											<div>Имя раздела: <input type="text" name="name" value="${sub.name}"></div>
											<div><span style="vertical-align: top;">Описание:</span> <textarea name="description" id="" cols="30" rows="10">${sub.raw_description}</textarea></div>
											<div><button type="submit">YARRR!</button></div>
											<div>
												<input type="hidden" name="method" value="sub.edit">
												<input type="hidden" name="access_token" value="${getCookie('access_token')}">
												<input type="hidden" name="address" value="${sub.address}">
											</div>
										</form>`);
										$("#summary > #edit > form").submit(function () {
											var params = $(this).serializeObject();
											$.ajax({
												"url": up4k.config.apiUrl,
												"data": params,
												"success": function (data) {
													if(data.success) {
														up4k.success(data.success);
													}
													else {
														up4k.error(data.error);
													}
												},
												"error": function (data) {
													up4k.error(`Ощшибка сревера: ${data.status} ${data.statusText}`);
												}
											});
											return false;
										});
									}
									else if(up4kURL[2] == 'bans') {
										up4k.setTitle('Баны');
										$("#manage").append(`<div id="bans"></div>`);
										$("#bans").html(`<h2>Баны</h2>
										<div id="addBan"></div>`);
										$("#bans > #addBan").html(`<form>
											<div>Кого забанить: <input type="text" name="username"></div>
											<div>Время бана: <select name="term" id="term">
												<option value="86400">День</option>
												<option value="604800">Неделя</option>
												<option value="2592000">Месяц</option>
												<option value="31536000">Год</option>
											</select></div>
											<div>Причина <input type="text" name="reason"></div>
											<div><button type="submit">Бан! Бан! Бан!</button></div>
											<div>
												<input type="hidden" name="address" value="${up4kURL[1]}">
												<input type="hidden" name="method" value="sub.ban">
												<input type="hidden" name="access_token" value="${getCookie('access_token')}">
											</div>
										</form>
										<div id="banList"></div>`);
										up4k.modules.ban.listInSub(up4kURL[1]);
										$("#addBan > form").submit(function () {
											var params = $(this).serializeObject();
											$.ajax({
												"url": up4k.config.apiUrl,
												"data": params,
												"success": function (data) {
													if(data.success) {
														up4k.success(data.success);
														up4k.modules.ban.listInSub(up4kURL[1]);
													}
													else {
														up4k.error(data.error);
													}
												},
												"error": function (data) {
													up4k.error(`Ошибка сервера: ${data.status} ${data.statusText}`);
												}
											});
											return false;
										});
									}
									else if (up4kURL[2] == 'mods') {
										up4k.setTitle('Мочераторы');
										$("#manage").append(`<div id="mods"></div>`);
										$("#mods").html(`<h2>Модераторы</h2>
										<div id="addMod"></div>`);
										$("#addMod").html(`<form>
											<div>Никнейм: <input type="text" name="username"> <button type="submit">Назначить</button></div>
											<div>
												<input type="hidden" name="method" value="sub.addModerator">
												<input type="hidden" name="access_token" value="${getCookie('access_token')}">
												<input type="hidden" name="sub" value="${up4kURL[1]}">
											</div>
										</form><div id="modList"></div>`);
										$('#addMod > form').submit(function () {
											var params = $(this).serializeObject();
											$.ajax({
												"url": up4k.config.apiUrl,
												"data": params,
												"success": function (data) {
													if(data.success) {
														up4k.success(data.success);
														up4k.modules.sub.moderators(up4kURL[1]);
													}
													else {
														up4k.error(data.error);
													}
												}
											});
											return false;
										});
										up4k.modules.sub.moderators(up4kURL[1]);
									}
									else if (up4kURL[2] == 'reports') {
										up4k.setTitle('Репорты');
										$("#manage").append(`<div id="reports"></div>`);
										$("#reports").html(`<h2>Репорты</h2>
										<table id="list">
											<thead>
												<tr>
													<td>ID</td>
													<td>Тип</td>
													<td>ID контента</td>
													<td>Кто зарепортил</td>
													<td>Причина</td>
													<td>Время</td>
												</tr>
											</thead>
											<tbody></tbody>
										</table>`);
										function buildReportHTML(report) {
											var link;
											if(report.content_type == 'post') {
												link = 'comments';
											}
											else if(report.content_type == 'comment') {
												link = 'comment';
											}
											return `<tr>
												<td>${report.id}</td>
												<td>${report.content_type}</td>
												<td><a href="#${link}/${report.content_id}">${report.content_id}</a></td>
												<td>${report.user}</td>
												<td>${report.reason}</td>
												<td>${date(up4k.config.dateFormat, report.date)}</td>
											</tr>`;
										}
										$.ajax({
											"url": up4k.config.apiUrl,
											"data": {
												"access_token": getCookie('access_token'),
												"sub": up4kURL[1],
												"method": "report.inSub",
											},
											"success": function (data) {
												if(data.success) {
													var reports = data.success;
													var list = $("#list > tbody")
													$(reports).each(function () {
														var report = this;
														list.append(buildReportHTML(report));
													});
												}
											}
										});
									}
								}
								else {
									/**
									 * Посылаем нахуй
									 */
									up4k.error("Вы не модератор");
								}
							}
							else {
								up4k.error(data.error);
							}
						},
						"error": function (data) {
							up4k.error(`Ошибка сревера: ${data.status} ${data.statusText}`);
						}
					});
				}
			}
			else
			{
				location.href = '#login';
			}
		},
		"sandbox": function () {
			up4k.setTitle('Песочница');
			$("#up4k").html(`<div id="sandbox"></div>`);
			$("#sandbox").html(`<form>
				<div>Ваш шедевр:</div>
				<div><textarea name="text" id="text" cols="30" rows="10" placeholder="Да-да. Дети узнают и охуеют!"></textarea></div>
				<div><button type="submit">YARRR!</button></div>
			</form>
			<div id="sandboxOutput"></div>`);
			$('#sandbox > form').submit(function () {
				var params = $('#sandbox > form').serializeObject();
				params.method = "sandbox.test";
				$.ajax({
					"url": up4k.config.apiUrl,
					"data": params,
					"success": function (data) {
						if(data.success) {
							$("#sandboxOutput").html(data.success);
						}
						else {
							up4k.error(data.error);
						}
					}
				});
				return false;
			});
		},
		"pageNotExists": function() {
			up4k.setTitle("Не найдено");
			$("#up4k").html(`
			<p>Хуй там плавал, ничего здесь нет...</p>
			`)
		},
	},
	"mainMenu": {
		"ifNoLogin": [{
			"insideHTML": "Регистрация",
			"link": "#register"
		}, {
			"insideHTML": "Логин",
			"link": "#login"
		}, ],
		"ifLogin": [{
			"insideHTML": "Создать раздел",
			"link": "#createSubPage"
		}, ],
		"all": [{
			"insideHTML": `<img src="static/img/04.gif" alt="Упячка!!1" id="logo">`,
			"link": "#"
		}, ],
	},
	"initMenu": function() {
		$("#mainMenu").empty();
		if (window.isLogged) {
			$("#mainMenu").prepend(`
<li><a href="#createSubPage"><i class="fa fa-plus"></i> Создать раздел</a></li>
<li><a href="#sub"><i class="fa fa-list"></i> Все разделы</a></li>
<li><a href="#sandbox"><i class="fa fa-edit"></i> Песочница</a></li>
<li><a href="#modlog"><i class="fa fa-book"></i> Журнал мочерации</a></li>
<li><a href="#getInvites"><i class="fa fa-briefcase"></i> Получить инвайты</a></li>
<li><a href="#invites"><i class="fa fa-reorder"></i> Список инвайтов</a></li>
<li><a href="#manage"><i class="fa fa-cog"></i> Панель офигения</a></li>
<li><a href="#logout"><i class="fa fa-sign-out"></i> Выйти</a></li>
`)
		} else {
			$("#mainMenu").prepend(`
<li><a href="#login"><i class="fa fa-sign-in"></i> Логин</a></li>
<li><a href="#register"><i class="fa fa-user-plus"></i> Регистрация</a></li>
<li><a href="#freeInvites"><i class="fa fa-briefcase"></i> Инвайты бесплатно</a></li>
			`)
		}
		$("#mainMenu").prepend(`
<li><a href="#"><i class="fa fa-home"></i> Глагне</a></li>
		`)
	},
	"pageLoad": function(url) {
		window.up4k.checkLogin();
		$("#up4k").empty();
		window.up4k.setDefaultTitle();
		if (window.isLogged) {
			this.initTagLine()
		} else {
			$("#tagLine").empty()
		}
		if (Array.isArray(url)) {
			if (url[0] || !empty(url[0])) {
				var functionExists = typeof this['pages'][url[0]] == 'function';
				if (functionExists) {
					eval(`this.pages.${url[0]}();`)
				} else {
					this.pageLoad(['pageNotExists'])
				}
			} else {
				this.pageLoad(['main'])
			}
		}
		var useragent = window.navigator.userAgent;
		var firefoxRegex = new RegExp('firefox', 'gi');
		if(!firefoxRegex.test(useragent)) {
			$("#up4k").prepend('<div class="firefoxRulezzz"><small>Пора бы вместо уебищного недобраузера на базе хромонога установить удобный и современный <a href="https://www.mozilla.org/en-US/firefox/new/">Firefox</a></small></div>');
		}
		if(isLogged) {
			$("#inventory").html(`<div id="pepyaka">
									Пепяка:
									<span class="count"></span>
								</div>`);
			$.ajax({
				"url": up4k.config.apiUrl,
				"data": {
					"username": userInfo.login,
					"method": "karma.ofUser",
					"access_token": getCookie('access_token')
				},
				"success": function (data) {
					if(data.success) {
						$("#pepyaka > .count").html(data.success.count);
					}
					else {
						up4k.error(data.error);
					}
				},
			});
		}
		else {
			$("#inventory").empty();
		}
	},
	"urlParser": function(url) {
		urlRegex = new RegExp("\#(.*)", "g");
		url = url.replace(urlRegex, "$1");
		window.up4kURL = url.split("/")
	},
	"initTagLine": function() {
		var tagLine = arrayRand(window.up4k.templates.tagLines);
		tagLine = _.template(tagLine);
		$("#tagLine").html(`${tagLine({"username": window.userInfo.login})}`)
	},
	"main": function() {
		if (window.isLogged) {}
		this.setDefaultTitle();
		this.urlParser(location.hash);
		this.pageLoad(window.up4kURL);
		this.templates.postForm = `${this.templates.editor} 
		${this.templates.postForm}`;
		window.onhashchange = function() {
			window.up4k.urlParser(location.hash);
			window.up4k.pageLoad(window.up4kURL);
			window.up4k.initMenu()
		};
		window.up4k.initMenu()
	},
};
window.up4k.checkLogin();
window.onresize = function() {
	if ($(this).width() < 950) {
		$("#mainMenu").css({
			"width": "100%"
		});
		document.body.style.fontSize = "160%";
	} else {
		$("#mainMenu").css({
			"width": "250px"
		});
		document.body.style.fontSize = "100%";
	}
};
if ($(window).width() < 1050) {
	$("#mainMenu").css({
		"width": "100%"
	});
	document.body.style.fontSize = "160%";
} else {
	$("#mainMenu").css({
		"width": "250px"
	})
	document.body.style.fontSize = "100%";
}

up4k.pages.comment = function () {
	if (up4kURL[1]) {
		$.ajax({
			"url": up4k.config.apiUrl,
			"data": {
				"method": "comment.info",
				"access_token": getCookie("access_token"),
				"id": up4kURL[1],
			},
			"success": function(data) {
				if (data.success) {
					var success = data.success;
					if (typeof success !== "object") {
						up4k.error("API какого-то хуя вернул не объект")
					} else {
						up4k.setTitle(`Комментарий #${up4kURL[1]}`);
						$("#up4k").html(`<div id="commentPage"></div>`);
						var commentTemplate = _.template(up4k.templates.comment);
						up4k.modules.comment.karmaView(success.id);
						commentTemplate = commentTemplate({
							comment: success,
							misc: {
								idInLink: !1,
								replyLink: !1,
								moderateAvailable: 1,
								"karmaAvailable": true,
								"karma": 0
							}
						});
						$("#commentPage").html(commentTemplate)
					}
				} else {
					var error = data.error || "Ответ пуст";
					up4k.error(error)
				}
			},
			"error": function(data) {
				var errorString = `Ошибка сервера: ${data.status} ${data.statusText}`;
				up4k.error(errorString)
			}
		})
	}
};
