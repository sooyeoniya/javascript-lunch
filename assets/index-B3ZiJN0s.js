var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _RestaurantForm_instances, handleSubmit_fn, getFormData_fn, resetFormData_fn, _App_instances, renderHeader_fn, renderMain_fn, renderRestaurantList_fn, renderBottomSheet_fn, handleFormSubmit_fn, updateRestaurantList_fn, _restaurants, _listeners, _RestaurantStore_instances, notifyListeners_fn;
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
  constructor({ onOpen }) {
    this.onOpen = onOpen;
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
    $header.append($title);
    $button.append($img);
    $header.append($button);
    $button.addEventListener(EVENT_TYPES.click, this.onOpen);
    return $header;
  }
}
class BottomSheetBase {
  constructor({ title, $children }) {
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
    this.$modal.append($backdrop, $container);
    $container.append($title, this.$children);
    $backdrop.addEventListener(EVENT_TYPES.click, this.close.bind(this));
    return this.$modal;
  }
  open() {
    this.$modal.classList.add("modal--open");
  }
  close(e) {
    if (!e || !e.target.closest(".modal-container")) {
      this.$modal.classList.remove("modal--open");
    }
  }
}
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
    $linkFormItem.append($linkLabel, $linkInput, $linkHelpText);
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
    $nameFormItem.append($nameLabel, $nameInput);
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
    $descriptionFormItem.append(
      $descriptionLabel,
      $descriptionTextarea,
      $descriptionHelpText
    );
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
    $formItem.append($label, $select);
    $select.append($defaultOption);
    this.options.forEach((option) => {
      const $option = document.createElement("option");
      $option.value = option;
      if (this.label === "distance") $option.textContent = `${option}분 내`;
      else $option.textContent = option;
      $select.append($option);
    });
    return $formItem;
  }
}
class RestaurantForm {
  constructor({ onSubmit, onCancel }) {
    __privateAdd(this, _RestaurantForm_instances);
    this.onSubmit = onSubmit;
    this.onCancel = onCancel;
    this.formElements = {
      category: new SelectBox({
        label: "category",
        options: CATEGORY
      }).render(),
      name: new NameInput().render(),
      distance: new SelectBox({
        label: "distance",
        options: DISTANCE
      }).render(),
      description: new DescriptionInput().render(),
      link: new LinkInput().render()
    };
  }
  render() {
    const $form = document.createElement("form");
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
    $form.append(
      this.formElements.category,
      this.formElements.name,
      this.formElements.distance,
      this.formElements.description,
      this.formElements.link,
      $buttonContainer
    );
    $buttonContainer.append($cancelButton, $addButton);
    $cancelButton.addEventListener(EVENT_TYPES.click, this.onCancel.bind(this));
    $form.addEventListener(EVENT_TYPES.submit, __privateMethod(this, _RestaurantForm_instances, handleSubmit_fn).bind(this));
    return $form;
  }
}
_RestaurantForm_instances = new WeakSet();
handleSubmit_fn = function(e) {
  e.preventDefault();
  const newRestaurantInfo = __privateMethod(this, _RestaurantForm_instances, getFormData_fn).call(this);
  this.onSubmit(newRestaurantInfo);
  __privateMethod(this, _RestaurantForm_instances, resetFormData_fn).call(this);
};
getFormData_fn = function() {
  return Object.entries(this.formElements).reduce((acc, [key, el]) => {
    acc[key] = el.querySelector("input, select, textarea").value;
    return acc;
  }, {});
};
resetFormData_fn = function() {
  Object.values(this.formElements).forEach((el) => {
    const query = el.querySelector("input, select, textarea");
    if (query) query.value = "";
  });
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
    $item.append($category, $info);
    $category.append($categoryImg);
    $info.append($name, $distance, $description);
    return $item;
  }
}
class RestaurantList {
  constructor(restaurantList) {
    this.restaurantList = restaurantList;
    this.$listSection = document.createElement("section");
    this.$listSection.className = "restaurant-list-container";
    this.$list = document.createElement("ul");
    this.$list.className = "restaurant-list";
    this.$listSection.append(this.$list);
  }
  render() {
    this.$list.innerHTML = "";
    this.restaurantList.forEach(
      (restaurantInfo) => this.$list.append(new RestaurantListItem(restaurantInfo).render())
    );
    return this.$listSection;
  }
  update(restaurantList) {
    this.restaurantList = restaurantList;
    this.render();
  }
}
class App {
  constructor(restaurantStore2, restaurantService2) {
    __privateAdd(this, _App_instances);
    this.restaurantStore = restaurantStore2;
    this.restaurantService = restaurantService2;
    this.render();
    this.restaurantStore.subscribe(() => __privateMethod(this, _App_instances, updateRestaurantList_fn).call(this));
  }
  render() {
    this.$body = document.querySelector("body");
    __privateMethod(this, _App_instances, renderHeader_fn).call(this);
    __privateMethod(this, _App_instances, renderMain_fn).call(this);
  }
}
_App_instances = new WeakSet();
renderHeader_fn = function() {
  const $header = new Header({ onOpen: () => this.$bottomSheet.open() });
  this.$body.append($header.render());
};
renderMain_fn = function() {
  this.$main = document.createElement("main");
  this.$body.append(this.$main);
  __privateMethod(this, _App_instances, renderRestaurantList_fn).call(this);
  __privateMethod(this, _App_instances, renderBottomSheet_fn).call(this);
};
renderRestaurantList_fn = function() {
  this.$restaurantList = new RestaurantList(
    this.restaurantService.getRestaurants()
  );
  this.$main.append(this.$restaurantList.render());
};
renderBottomSheet_fn = function() {
  const $restaurantForm = new RestaurantForm({
    onSubmit: __privateMethod(this, _App_instances, handleFormSubmit_fn).bind(this),
    onCancel: () => this.$bottomSheet.close()
  });
  this.$bottomSheet = new BottomSheetBase({
    title: "새로운 음식점",
    $children: $restaurantForm.render()
  });
  this.$main.append(this.$bottomSheet.render());
};
handleFormSubmit_fn = function(newRestaurantInfo) {
  this.restaurantService.addRestaurant(newRestaurantInfo);
  this.$bottomSheet.close();
};
updateRestaurantList_fn = function() {
  const restaurantList = this.restaurantService.getRestaurants();
  this.$restaurantList.update(restaurantList);
};
class RestaurantService {
  constructor(restaurantStore2) {
    this.restaurantStore = restaurantStore2;
  }
  addRestaurant(restaurantInfo) {
    this.restaurantStore.addRestaurant(restaurantInfo);
  }
  getRestaurants() {
    return this.restaurantStore.getRestaurants();
  }
}
class RestaurantStore {
  constructor() {
    __privateAdd(this, _RestaurantStore_instances);
    __privateAdd(this, _restaurants, []);
    __privateAdd(this, _listeners, /* @__PURE__ */ new Set());
  }
  addRestaurant(restaurant) {
    __privateSet(this, _restaurants, [...__privateGet(this, _restaurants), restaurant]);
    __privateMethod(this, _RestaurantStore_instances, notifyListeners_fn).call(this);
  }
  getRestaurants() {
    return [...__privateGet(this, _restaurants)];
  }
  subscribe(listener) {
    __privateGet(this, _listeners).add(listener);
    return () => __privateGet(this, _listeners).delete(listener);
  }
}
_restaurants = new WeakMap();
_listeners = new WeakMap();
_RestaurantStore_instances = new WeakSet();
notifyListeners_fn = function() {
  __privateGet(this, _listeners).forEach((listener) => listener(__privateGet(this, _restaurants)));
};
const restaurantStore = new RestaurantStore();
const restaurantService = new RestaurantService(restaurantStore);
new App(restaurantStore, restaurantService);
