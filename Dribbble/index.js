/**
 * @function 创建一个div
 * @param classname:类名 innertext:文本内容
 * @return div
 */
function CreatDIV(classname, innertext) {
  const div = document.createElement("div");
  div.className = classname;
  div.innerHTML = innertext;
  return div;
}
/**
 * @function 创建一个img
 * @param src:图片路径 width:图片宽度
 * @return img.outerHTML
 */
function CreatIMG(src, width) {
  const img = document.createElement("img");
  img.src = src;
  img.width = width;
  return img.outerHTML;
}
/**
 * @function 动态生成item
 * @param void
 * @return void
 */
function Additem() {
  const data = document.querySelector(".DATA");
  for (var i = 0; i < DATA.length; i++) {
    //item
    const item = CreatDIV("item", null);
    data.appendChild(item);
    item.appendChild(CreatDIV("item-cover", CreatIMG(DATA[i].cover, 325)));
    //item-foot
    const item_foot = CreatDIV("item-foot", null);
    item.appendChild(item_foot);
    const avatar = CreatDIV("avatar", null);
    const avatar_heat = CreatDIV("avatar-heat", null);
    item_foot.appendChild(avatar);
    item_foot.appendChild(avatar_heat);
    item_foot.style = "width: 320px;";
    //item-foot.avatar
    avatar.appendChild(CreatDIV("headimg", CreatIMG(DATA[i].avatar, 24)));
    avatar.appendChild(CreatDIV("name", DATA[i].name));
    if (DATA[i].badge) avatar.appendChild(CreatDIV("badge", DATA[i].badge));
    //item-foot.avatar-heat
    const likes = CreatDIV(
      "likes",
      '<img src="imgs/icon-like.svg" width="14">'
    );
    const views = CreatDIV(
      "views",
      '<img src="imgs/icon-view.svg" width="14">'
    );
    avatar_heat.appendChild(likes);
    avatar_heat.appendChild(views);
    likes.appendChild(CreatDIV("likes-text", DATA[i].likes));
    views.appendChild(CreatDIV("views-text", DATA[i].views));
  }
}
/**
 * @function 改变 'imgs/icon-menu.svg' <=> 'imgs/icon-close.svg'
 * @param e
 * @return void
 */
function ChangeMenu(event) {
  var img = menu.getElementsByTagName("img");
  var temp = img[0].getAttribute("style");
  img[0].setAttribute("style", img[1].getAttribute("style"));
  img[1].setAttribute("style", temp);
}
/**
 * @function 显示菜单项，遮住整个页面
 * @param e
 * @return void
 */
function ShowMENU(event) {
  var nav_menu = document.querySelector(".nav-menu");
  if (event.target.id == "img-menu") {
    nav_menu.setAttribute("style", "display: flex;");
    body.style.overflowY = "clip";
  } else if (event.target.id == "img-close") {
    nav_menu.setAttribute("style", "display: none;");
    body.style.overflowY = "scroll";
  }
}
Additem();
const body = document.querySelector("body");
const menu = document.querySelector(".menu");
menu.addEventListener("click", ChangeMenu);
const nav = document.querySelector(".nav");
nav.addEventListener("click", ShowMENU);
