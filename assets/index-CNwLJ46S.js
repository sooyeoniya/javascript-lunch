var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _Header_instances, handleButtonClick_fn, _BottomSheetBase_instances, handleBackdropClick_fn, _RestaurantForm_instances, handleCancelButtonClick_fn, handleSubmit_fn, getFormQuery_fn, resetFormData_fn, closeModal_fn, _addList, _App_instances, renderRestaurantList_fn, initElement_fn;
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const LABEL_NAMES = Object.freeze({
  category: "카테고리",
  name: "이름",
  distance: "거리(도보 이동 시간)",
  description: "설명",
  link: "참고 링크"
});
const DISTANCE = ["5", "10", "15", "20", "30"];
const CATEGORY = ["한식", "중식", "일식", "양식", "아시안", "기타"];
const CATEGORY_ASSETS = Object.freeze({
  한식: "./assets/category-korean.png",
  중식: "./assets/category-chinese.png",
  일식: "./assets/category-japanese.png",
  양식: "./assets/category-western.png",
  아시안: "./assets/category-asian.png",
  기타: "./assets/category-etc.png"
});
const EVENT_TYPES = Object.freeze({
  click: "click",
  submit: "submit"
});
const BUTTON_TYPES = Object.freeze({
  add: "add",
  cancel: "cancel",
  delete: "delete",
  close: "close"
});
const BUTTON_TEXTS = Object.freeze({
  [BUTTON_TYPES.add]: "추가하기",
  [BUTTON_TYPES.cancel]: "취소하기",
  [BUTTON_TYPES.delete]: "삭제하기",
  [BUTTON_TYPES.close]: "닫기"
});
class Header {
  constructor() {
    __privateAdd(this, _Header_instances);
  }
  render() {
    const $header = document.createElement("header");
    $header.className = "gnb";
    const $title = document.createElement("h1");
    $title.textContent = "점심 뭐 먹지";
    $title.className = "gnb__title text-title";
    const $button = document.createElement("button");
    $button.className = "gnb__button";
    $button.setAttribute("aria-label", "음식점 추가");
    $button.type = "button";
    const $img = document.createElement("img");
    $img.setAttribute("src", "./assets/add-button.png");
    $img.setAttribute("alt", "음식점 추가");
    $header.appendChild($title);
    $button.appendChild($img);
    $header.appendChild($button);
    $button.addEventListener(
      EVENT_TYPES.click,
      __privateMethod(this, _Header_instances, handleButtonClick_fn).bind(this)
    );
    return $header;
  }
}
_Header_instances = new WeakSet();
handleButtonClick_fn = function() {
  const $modal = document.querySelector(".modal");
  $modal.classList.add("modal--open");
};
class RestaurantListItem {
  constructor(restaurantInfo) {
    this.restaurantInfo = restaurantInfo;
  }
  render() {
    const { name, category, description, distance } = this.restaurantInfo;
    const $item = document.createElement("li");
    $item.className = "restaurant";
    const $category = document.createElement("div");
    $category.className = "restaurant__category";
    const $categoryImg = document.createElement("img");
    $categoryImg.className = "category-icon";
    $categoryImg.src = CATEGORY_ASSETS[category];
    $categoryImg.setAttribute("alt", category);
    const $info = document.createElement("div");
    $info.className = "restaurant__info";
    const $name = document.createElement("h3");
    $name.className = "restaurant__name text-subtitle";
    $name.textContent = name;
    const $distance = document.createElement("span");
    $distance.className = "restaurant__distance text-body";
    $distance.textContent = `캠퍼스부터 ${distance}분 내`;
    const $description = document.createElement("p");
    $description.className = "restaurant__description text-body";
    $description.textContent = description;
    $item.appendChild($category);
    $item.appendChild($info);
    $category.appendChild($categoryImg);
    $info.appendChild($name);
    $info.appendChild($distance);
    $info.appendChild($description);
    return $item;
  }
}
class RestaurantList {
  constructor(restaurantList) {
    this.restaurantList = restaurantList;
  }
  render() {
    const $listSection = document.createElement("section");
    $listSection.className = "restaurant-list-container";
    const $list = document.createElement("ul");
    $list.className = "restaurant-list";
    $listSection.appendChild($list);
    this.restaurantList.forEach(
      (restaurantInfo) => $list.appendChild(new RestaurantListItem(restaurantInfo).render())
    );
    return $listSection;
  }
}
class BottomSheetBase {
  constructor({ title, $children }) {
    __privateAdd(this, _BottomSheetBase_instances);
    this.title = title;
    this.$children = $children;
    this.$modal = document.createElement("div");
  }
  render() {
    this.$modal.className = "modal";
    const $backdrop = document.createElement("div");
    $backdrop.className = "modal-backdrop";
    const $container = document.createElement("div");
    $container.className = "modal-container";
    const $title = document.createElement("h2");
    $title.className = "modal-title text-title";
    $title.textContent = this.title;
    this.$modal.appendChild($backdrop);
    this.$modal.appendChild($container);
    $container.appendChild($title);
    $container.appendChild(this.$children);
    $backdrop.addEventListener(
      EVENT_TYPES.click,
      __privateMethod(this, _BottomSheetBase_instances, handleBackdropClick_fn).bind(this)
    );
    return this.$modal;
  }
}
_BottomSheetBase_instances = new WeakSet();
handleBackdropClick_fn = function(e) {
  if (!e.target.closest(".modal-container")) {
    this.$modal.classList.remove("modal--open");
  }
};
const actionVariant = {
  add: "primary",
  cancel: "secondary"
};
class Button {
  constructor({ type = "button", text, action }) {
    this.type = type;
    this.text = text;
    this.action = action;
  }
  render() {
    const $button = document.createElement("button");
    $button.type = this.type;
    $button.textContent = this.text;
    $button.className = `button button--${actionVariant[this.action]} text-caption`;
    return $button;
  }
}
class LinkInput {
  render() {
    const $linkFormItem = document.createElement("div");
    $linkFormItem.className = "form-item";
    const $linkLabel = document.createElement("label");
    $linkLabel.setAttribute("for", "link text-caption");
    $linkLabel.textContent = LABEL_NAMES.link;
    const $linkInput = document.createElement("input");
    $linkInput.type = "text";
    $linkInput.setAttribute("name", "link");
    $linkInput.id = "link";
    const $linkHelpText = document.createElement("span");
    $linkHelpText.className = "help-text text-caption";
    $linkHelpText.textContent = "매장 정보를 확인할 수 있는 링크를 입력해 주세요.";
    $linkFormItem.appendChild($linkLabel);
    $linkFormItem.appendChild($linkInput);
    $linkFormItem.appendChild($linkHelpText);
    return $linkFormItem;
  }
}
class NameInput {
  render() {
    const $nameFormItem = document.createElement("div");
    $nameFormItem.className = "form-item form-item--required";
    const $nameLabel = document.createElement("label");
    $nameLabel.setAttribute("for", "name text-caption");
    $nameLabel.textContent = LABEL_NAMES.name;
    const $nameInput = document.createElement("input");
    $nameInput.type = "text";
    $nameInput.setAttribute("name", "name");
    $nameInput.id = "name";
    $nameInput.required = true;
    $nameFormItem.appendChild($nameLabel);
    $nameFormItem.appendChild($nameInput);
    return $nameFormItem;
  }
}
class DescriptionInput {
  render() {
    const $descriptionFormItem = document.createElement("div");
    $descriptionFormItem.className = "form-item";
    const $descriptionLabel = document.createElement("label");
    $descriptionLabel.setAttribute("for", "description text-caption");
    $descriptionLabel.textContent = LABEL_NAMES.description;
    const $descriptionTextarea = document.createElement("textarea");
    $descriptionTextarea.id = "description";
    $descriptionTextarea.setAttribute("name", "description");
    $descriptionTextarea.setAttribute("cols", "30");
    $descriptionTextarea.setAttribute("rows", "5");
    const $descriptionHelpText = document.createElement("span");
    $descriptionHelpText.className = "help-text text-caption";
    $descriptionHelpText.textContent = "메뉴 등 추가 정보를 입력해 주세요.";
    $descriptionFormItem.appendChild($descriptionLabel);
    $descriptionFormItem.appendChild($descriptionTextarea);
    $descriptionFormItem.appendChild($descriptionHelpText);
    return $descriptionFormItem;
  }
}
class SelectBox {
  constructor({ label, options }) {
    this.label = label;
    this.options = options;
  }
  render() {
    const $formItem = document.createElement("div");
    $formItem.className = "form-item form-item--required";
    const $label = document.createElement("label");
    $label.setAttribute("for", `${this.label} text-caption`);
    $label.textContent = LABEL_NAMES[this.label];
    const $select = document.createElement("select");
    $select.setAttribute("name", this.label);
    $select.required = true;
    $select.id = this.label;
    const $defaultOption = document.createElement("option");
    $defaultOption.value = "";
    $defaultOption.textContent = "선택해 주세요";
    $formItem.appendChild($label);
    $formItem.appendChild($select);
    $select.appendChild($defaultOption);
    this.options.forEach((option) => {
      const $option = document.createElement("option");
      $option.value = option;
      if (this.label === "distance") $option.textContent = `${option}분 내`;
      else $option.textContent = option;
      $select.appendChild($option);
    });
    return $formItem;
  }
}
class CategorySelect {
  render() {
    const $categorySelect = new SelectBox({
      label: "category",
      options: CATEGORY
    }).render();
    return $categorySelect;
  }
}
class DistanceSelect {
  render() {
    const $distanceSelect = new SelectBox({
      label: "distance",
      options: DISTANCE
    }).render();
    return $distanceSelect;
  }
}
class RestaurantForm {
  constructor(addList) {
    __privateAdd(this, _RestaurantForm_instances);
    this.addList = addList;
  }
  render() {
    const $form = document.createElement("form");
    const $categoryFormItem = new CategorySelect().render();
    const $nameFormItem = new NameInput().render();
    const $distanceFormItem = new DistanceSelect().render();
    const $descriptionFormItem = new DescriptionInput().render();
    const $linkFormItem = new LinkInput().render();
    const $buttonContainer = document.createElement("div");
    $buttonContainer.className = "button-container";
    const $cancelButton = new Button({
      text: BUTTON_TEXTS.cancel,
      action: BUTTON_TYPES.cancel
    }).render();
    const $addButton = new Button({
      type: "submit",
      text: BUTTON_TEXTS.add,
      action: BUTTON_TYPES.add
    }).render();
    $form.appendChild($categoryFormItem);
    $form.appendChild($nameFormItem);
    $form.appendChild($distanceFormItem);
    $form.appendChild($descriptionFormItem);
    $form.appendChild($linkFormItem);
    $form.appendChild($buttonContainer);
    $buttonContainer.appendChild($cancelButton);
    $buttonContainer.appendChild($addButton);
    $cancelButton.addEventListener(
      EVENT_TYPES.click,
      __privateMethod(this, _RestaurantForm_instances, handleCancelButtonClick_fn).bind(this)
    );
    $form.addEventListener(EVENT_TYPES.submit, __privateMethod(this, _RestaurantForm_instances, handleSubmit_fn).bind(this));
    return $form;
  }
}
_RestaurantForm_instances = new WeakSet();
handleCancelButtonClick_fn = function() {
  const $modal = document.querySelector(".modal");
  $modal.classList.remove("modal--open");
};
handleSubmit_fn = function(e) {
  e.preventDefault();
  const formQuery = __privateMethod(this, _RestaurantForm_instances, getFormQuery_fn).call(this);
  const newRestaurantInfo = Object.entries(formQuery).reduce(
    (acc, [key, query]) => {
      acc[key] = query.value;
      return acc;
    },
    {}
  );
  this.addList(newRestaurantInfo);
  __privateMethod(this, _RestaurantForm_instances, resetFormData_fn).call(this, formQuery);
  __privateMethod(this, _RestaurantForm_instances, closeModal_fn).call(this);
};
getFormQuery_fn = function() {
  const category = document.querySelector("#category");
  const name = document.querySelector("#name");
  const distance = document.querySelector("#distance");
  const description = document.querySelector("#description");
  const link = document.querySelector("#link");
  return { category, name, distance, description, link };
};
resetFormData_fn = function({ category, name, distance, description, link }) {
  category.value = "";
  name.value = "";
  distance.value = "";
  description.value = "";
  link.value = "";
};
closeModal_fn = function() {
  const $modal = document.querySelector(".modal");
  $modal.classList.remove("modal--open");
};
class App {
  constructor() {
    __privateAdd(this, _App_instances);
    __privateAdd(this, _addList, (newRestaurantInfo) => {
      this.restaurantList = [...this.restaurantList, newRestaurantInfo];
      __privateMethod(this, _App_instances, renderRestaurantList_fn).call(this);
    });
    this.restaurantList = [];
    __privateMethod(this, _App_instances, initElement_fn).call(this);
  }
}
_addList = new WeakMap();
_App_instances = new WeakSet();
renderRestaurantList_fn = function() {
  const $listContainer = document.querySelector(".restaurant-list-container");
  this.$main.replaceChild(
    new RestaurantList(this.restaurantList).render(),
    $listContainer
  );
};
initElement_fn = function() {
  const $body = document.querySelector("body");
  $body.appendChild(new Header().render());
  this.$main = document.createElement("main");
  $body.appendChild(this.$main);
  this.$main.appendChild(new RestaurantList(this.restaurantList).render());
  this.$main.appendChild(
    new BottomSheetBase({
      title: "새로운 음식점",
      $children: new RestaurantForm(__privateGet(this, _addList)).render()
    }).render()
  );
};
new App();
