var __defProp = Object.defineProperty;
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _RestaurantForm_instances, renderTitle_fn, renderForm_fn, handleSubmit_fn, getInputValue_fn, getFormData_fn, resetFormData_fn, _RestaurantList_instances, initializeDOM_fn, _RestaurantFilter_instances, renderFilterCategory_fn, renderFilterSort_fn, _RestaurantDetail_instances, initializeDOM_fn2, initializeEventListeners_fn, updateContent_fn, handleSubmit_fn2, _App_instances, renderHeader_fn, renderMain_fn, renderRestaurantNavBar_fn, renderRestaurantFilter_fn, renderRestaurantList_fn, renderSubmitFormBottomSheet_fn, renderOpenDetailBottomSheet_fn, _restaurants, _currentFilter, _selectedRestaurant, _listeners, _RestaurantStore_instances, loadFromLocalStorage_fn, saveToLocalStorage_fn, notifyListeners_fn;
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
const LABEL_KEYS = Object.freeze({
  category: "category",
  name: "name",
  distance: "distance",
  description: "description",
  link: "link"
});
const LABEL_NAMES = Object.freeze({
  [LABEL_KEYS.category]: "카테고리",
  [LABEL_KEYS.name]: "이름",
  [LABEL_KEYS.distance]: "거리(도보 이동 시간)",
  [LABEL_KEYS.description]: "설명",
  [LABEL_KEYS.link]: "참고 링크"
});
const NAV_BAR_KEYS = Object.freeze({
  all: "all",
  favorite: "favorite"
});
const NAV_BAR_OPTIONS = Object.freeze({
  [NAV_BAR_KEYS.all]: "모든 음식점",
  [NAV_BAR_KEYS.favorite]: "자주 가는 음식점"
});
const SORT_OPTIONS = Object.freeze({
  [LABEL_KEYS.name]: "이름순",
  [LABEL_KEYS.distance]: "거리순"
});
const DISTANCE = ["5", "10", "15", "20", "30"];
const CATEGORY = [
  "전체",
  "한식",
  "중식",
  "일식",
  "양식",
  "아시안",
  "기타"
];
const CATEGORY_ASSETS = Object.freeze({
  한식: "./assets/category-korean.png",
  중식: "./assets/category-chinese.png",
  일식: "./assets/category-japanese.png",
  양식: "./assets/category-western.png",
  아시안: "./assets/category-asian.png",
  기타: "./assets/category-etc.png"
});
const FAVORITE_ASSETS = Object.freeze({
  filled: "./assets/favorite-icon-filled.png",
  lined: "./assets/favorite-icon-lined.png"
});
const EVENT_TYPES = Object.freeze({
  click: "click",
  submit: "submit",
  change: "change"
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
    __publicField(this, "onOpen");
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
  constructor({ id, $children }) {
    __publicField(this, "id");
    __publicField(this, "$children");
    __publicField(this, "$modal");
    this.id = id;
    this.$children = $children;
    this.$modal = document.createElement("div");
  }
  render() {
    this.$modal.className = "modal";
    if (this.id) this.$modal.id = this.id;
    const $backdrop = document.createElement("div");
    $backdrop.className = "modal-backdrop";
    const $container = document.createElement("div");
    $container.className = "modal-container";
    this.$modal.append($backdrop, $container);
    $container.append(this.$children);
    $backdrop.addEventListener(EVENT_TYPES.click, this.close.bind(this));
    return this.$modal;
  }
  open() {
    this.$modal.classList.add("modal--open");
  }
  close(e) {
    if (!e || !(e.target instanceof HTMLElement) || !e.target.closest(".modal-container")) {
      this.$modal.classList.remove("modal--open");
    }
  }
}
const primaryActions = [BUTTON_TYPES.add, BUTTON_TYPES.close];
const secondaryActions = [
  BUTTON_TYPES.cancel,
  BUTTON_TYPES.delete
];
const actionVariant = [...primaryActions, ...secondaryActions].reduce(
  (acc, action) => ({
    ...acc,
    [action]: primaryActions.includes(action) ? "primary" : "secondary"
  }),
  {}
);
class Button {
  constructor({ type = "button", text, action }) {
    __publicField(this, "type");
    __publicField(this, "text");
    __publicField(this, "action");
    this.type = type;
    this.text = text;
    this.action = action;
  }
  render() {
    const $button = document.createElement("button");
    if (this.type) $button.type = this.type;
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
    __publicField(this, "label");
    __publicField(this, "options");
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
  constructor({ title, onSubmit, onCancel }) {
    __privateAdd(this, _RestaurantForm_instances);
    __publicField(this, "title");
    __publicField(this, "onSubmit");
    __publicField(this, "onCancel");
    __publicField(this, "formElements");
    this.title = title;
    this.onSubmit = onSubmit;
    this.onCancel = onCancel;
    this.formElements = {
      category: new SelectBox({
        label: "category",
        options: CATEGORY.slice(1, CATEGORY.length)
      }).render(),
      name: new NameInput().render(),
      distance: new SelectBox({
        label: "distance",
        options: [...DISTANCE]
      }).render(),
      description: new DescriptionInput().render(),
      link: new LinkInput().render()
    };
  }
  render() {
    const $fragment = new DocumentFragment();
    const $title = __privateMethod(this, _RestaurantForm_instances, renderTitle_fn).call(this);
    const $form = __privateMethod(this, _RestaurantForm_instances, renderForm_fn).call(this);
    $fragment.append($title, $form);
    return $fragment;
  }
}
_RestaurantForm_instances = new WeakSet();
renderTitle_fn = function() {
  const $title = document.createElement("h2");
  $title.className = "modal-title text-title";
  $title.textContent = this.title;
  return $title;
};
renderForm_fn = function() {
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
  $buttonContainer.append($cancelButton, $addButton);
  $form.append(
    this.formElements.category,
    this.formElements.name,
    this.formElements.distance,
    this.formElements.description,
    this.formElements.link,
    $buttonContainer
  );
  $cancelButton.addEventListener(EVENT_TYPES.click, this.onCancel.bind(this));
  $form.addEventListener(EVENT_TYPES.submit, __privateMethod(this, _RestaurantForm_instances, handleSubmit_fn).bind(this));
  return $form;
};
handleSubmit_fn = function(e) {
  e.preventDefault();
  const newRestaurantInfo = __privateMethod(this, _RestaurantForm_instances, getFormData_fn).call(this);
  this.onSubmit(newRestaurantInfo);
  __privateMethod(this, _RestaurantForm_instances, resetFormData_fn).call(this);
};
getInputValue_fn = function(key) {
  const element = this.formElements[key];
  if (!element) {
    return "";
  }
  const selectorMap = {
    category: "select",
    name: "input",
    distance: "select",
    description: "textarea",
    link: "input"
  };
  const el = element.querySelector(selectorMap[key]);
  if (el instanceof HTMLInputElement || el instanceof HTMLSelectElement || el instanceof HTMLTextAreaElement) {
    return el.value ?? "";
  }
  return "";
};
getFormData_fn = function() {
  return {
    category: __privateMethod(this, _RestaurantForm_instances, getInputValue_fn).call(this, "category"),
    name: __privateMethod(this, _RestaurantForm_instances, getInputValue_fn).call(this, "name"),
    distance: __privateMethod(this, _RestaurantForm_instances, getInputValue_fn).call(this, "distance"),
    description: __privateMethod(this, _RestaurantForm_instances, getInputValue_fn).call(this, "description"),
    link: __privateMethod(this, _RestaurantForm_instances, getInputValue_fn).call(this, "link")
  };
};
resetFormData_fn = function() {
  Object.values(this.formElements).forEach((el) => {
    const query = el.querySelector("input, select, textarea");
    if (query) query.value = "";
  });
};
class RestaurantListItem {
  constructor({
    id,
    name,
    category,
    description,
    distance,
    isFavorite
  }, onToggleFavorite, onOpenDetail) {
    __publicField(this, "id");
    __publicField(this, "category");
    __publicField(this, "name");
    __publicField(this, "distance");
    __publicField(this, "description");
    __publicField(this, "isFavorite");
    __publicField(this, "onToggleFavorite");
    __publicField(this, "onOpenDetail");
    this.id = id;
    this.name = name;
    this.category = category;
    this.description = description;
    this.distance = distance;
    this.isFavorite = isFavorite;
    this.onToggleFavorite = onToggleFavorite;
    this.onOpenDetail = onOpenDetail;
  }
  render() {
    const $item = document.createElement("li");
    $item.className = "restaurant";
    $item.id = this.id;
    const $category = document.createElement("div");
    $category.className = "restaurant__category";
    const $categoryImg = document.createElement("img");
    $categoryImg.className = "category-icon";
    $categoryImg.setAttribute("src", CATEGORY_ASSETS[this.category]);
    $categoryImg.setAttribute("alt", this.category);
    const $info = document.createElement("div");
    $info.className = "restaurant__info";
    const $name = document.createElement("h3");
    $name.className = "restaurant__name text-subtitle";
    $name.textContent = this.name;
    const $distance = document.createElement("span");
    $distance.className = "restaurant__distance text-body";
    $distance.textContent = `캠퍼스부터 ${this.distance}분 내`;
    const $description = document.createElement("p");
    $description.className = "restaurant__description text-body";
    $description.textContent = this.description;
    const $favoriteButton = document.createElement("button");
    $favoriteButton.className = "favorite-button";
    $favoriteButton.setAttribute("aria-label", "자주 가는 음식점 추가");
    $favoriteButton.type = "button";
    const $favoriteImg = document.createElement("img");
    $favoriteImg.className = "favorite-icon";
    $favoriteImg.setAttribute(
      "src",
      this.isFavorite ? FAVORITE_ASSETS.filled : FAVORITE_ASSETS.lined
    );
    $favoriteImg.setAttribute("alt", "자주 가는 음식점 추가");
    $item.append($category, $info, $favoriteButton);
    $category.append($categoryImg);
    $info.append($name, $distance, $description);
    $favoriteButton.append($favoriteImg);
    $favoriteButton.addEventListener(EVENT_TYPES.click, (e) => {
      e.stopPropagation();
      this.onToggleFavorite(this.id);
    });
    $item.addEventListener(EVENT_TYPES.click, (e) => {
      if (e.target && e.target instanceof HTMLElement && !e.target.closest(".favorite-button")) {
        this.onOpenDetail(this.id);
      }
    });
    return $item;
  }
}
class RestaurantList {
  constructor(restaurantList, { onToggleFavorite, onOpenDetail }) {
    __privateAdd(this, _RestaurantList_instances);
    __publicField(this, "restaurantList");
    __publicField(this, "onToggleFavorite");
    __publicField(this, "onOpenDetail");
    __publicField(this, "$listSection");
    __publicField(this, "$list");
    this.restaurantList = restaurantList;
    this.onToggleFavorite = onToggleFavorite;
    this.onOpenDetail = onOpenDetail;
    __privateMethod(this, _RestaurantList_instances, initializeDOM_fn).call(this);
  }
  render() {
    this.$list.innerHTML = "";
    this.restaurantList.forEach((restaurantInfo) => {
      const $listItem = new RestaurantListItem(
        restaurantInfo,
        this.onToggleFavorite,
        this.onOpenDetail
      );
      this.$list.append($listItem.render());
    });
    return this.$listSection;
  }
  updateRestaurantList(filteredRestaurants) {
    this.restaurantList = filteredRestaurants;
    this.render();
  }
}
_RestaurantList_instances = new WeakSet();
initializeDOM_fn = function() {
  this.$listSection = document.createElement("section");
  this.$listSection.className = "restaurant-list-container";
  this.$list = document.createElement("ul");
  this.$list.className = "restaurant-list";
  this.$listSection.append(this.$list);
};
class RestaurantFilter {
  constructor({ onFilterChange }) {
    __privateAdd(this, _RestaurantFilter_instances);
    __publicField(this, "onFilterChange");
    __publicField(this, "currentFilterType");
    __publicField(this, "$filterContainer");
    this.onFilterChange = onFilterChange;
    this.currentFilterType = {
      categoryFilterType: CATEGORY[0],
      sortFilterType: "name"
    };
  }
  render() {
    this.$filterContainer = document.createElement("section");
    this.$filterContainer.className = "restaurant-filter-container";
    __privateMethod(this, _RestaurantFilter_instances, renderFilterCategory_fn).call(this);
    __privateMethod(this, _RestaurantFilter_instances, renderFilterSort_fn).call(this);
    return this.$filterContainer;
  }
  toggleFilterVisibility({ tabType }) {
    if (tabType === NAV_BAR_KEYS.favorite) {
      this.$filterContainer.classList.add("restaurant-filter--open");
    } else {
      this.$filterContainer.classList.remove("restaurant-filter--open");
    }
  }
}
_RestaurantFilter_instances = new WeakSet();
renderFilterCategory_fn = function() {
  const $filterCategory = document.createElement("select");
  $filterCategory.className = "restaurant-filter";
  $filterCategory.id = "category-filter";
  $filterCategory.setAttribute("name", "category-filter");
  this.$filterContainer.append($filterCategory);
  CATEGORY.forEach((optionType) => {
    const $option = document.createElement("option");
    $option.value = optionType;
    $option.textContent = optionType;
    $filterCategory.append($option);
  });
  $filterCategory.addEventListener(EVENT_TYPES.change, (e) => {
    if (!e.target || !(e.target instanceof HTMLSelectElement)) return;
    const categoryFilterType = e.target.value;
    this.currentFilterType = {
      ...this.currentFilterType,
      categoryFilterType
    };
    this.onFilterChange(this.currentFilterType);
  });
};
renderFilterSort_fn = function() {
  const $filterSort = document.createElement("select");
  $filterSort.className = "restaurant-filter";
  $filterSort.id = "sort-filter";
  $filterSort.setAttribute("name", "sort-filter");
  this.$filterContainer.append($filterSort);
  Object.keys(SORT_OPTIONS).forEach(
    (optionType) => {
      const $option = document.createElement("option");
      $option.value = optionType;
      $option.textContent = SORT_OPTIONS[optionType];
      $filterSort.append($option);
    }
  );
  $filterSort.addEventListener(EVENT_TYPES.change, (e) => {
    if (!e.target || !(e.target instanceof HTMLSelectElement)) return;
    const sortFilterType = e.target.value;
    this.currentFilterType = {
      ...this.currentFilterType,
      sortFilterType
    };
    this.onFilterChange(this.currentFilterType);
  });
};
const activeTabStyle = "active-tab-menu";
class RestaurantNavBar {
  constructor({ onTabChange }) {
    __publicField(this, "onTabChange");
    __publicField(this, "currentTabType");
    this.onTabChange = onTabChange;
    this.currentTabType = NAV_BAR_KEYS.all;
  }
  render() {
    const $navBar = document.createElement("nav");
    const $navList = document.createElement("ul");
    $navList.className = "restaurant-tab-menu";
    const $allItem = document.createElement("li");
    const $allButton = document.createElement("button");
    $allButton.className = `restaurant-${NAV_BAR_KEYS.all}-menu text-subtitle ${activeTabStyle}`;
    $allButton.value = NAV_BAR_KEYS.all;
    $allButton.type = "button";
    $allButton.textContent = NAV_BAR_OPTIONS[NAV_BAR_KEYS.all];
    const $favoriteItem = document.createElement("li");
    const $favoriteButton = document.createElement("button");
    $favoriteButton.className = `restaurant-${NAV_BAR_KEYS.favorite}-menu text-subtitle`;
    $favoriteButton.value = NAV_BAR_KEYS.favorite;
    $favoriteButton.type = "button";
    $favoriteButton.textContent = NAV_BAR_OPTIONS[NAV_BAR_KEYS.favorite];
    [$allButton, $favoriteButton].forEach(($button) => {
      $button.addEventListener(EVENT_TYPES.click, (e) => {
        if (e.target instanceof HTMLButtonElement) {
          this.currentTabType = e.target.value;
        }
        $navList.querySelectorAll("button").forEach((button) => {
          button.classList.toggle(
            activeTabStyle,
            button.value === this.currentTabType
          );
        });
        if (this.onTabChange) {
          this.onTabChange(this.currentTabType);
        }
      });
    });
    $allItem.append($allButton);
    $navList.append($allItem);
    $favoriteItem.append($favoriteButton);
    $navList.append($favoriteItem);
    $navBar.append($navList);
    return $navBar;
  }
}
class RestaurantDetail {
  constructor({ onToggleFavorite, onDelete, onClose }) {
    __privateAdd(this, _RestaurantDetail_instances);
    __publicField(this, "onToggleFavorite");
    __publicField(this, "onDelete");
    __publicField(this, "onClose");
    __publicField(this, "$form");
    __publicField(this, "$categoryImg");
    __publicField(this, "$name");
    __publicField(this, "$distance");
    __publicField(this, "$description");
    __publicField(this, "$link");
    __publicField(this, "$favoriteButton");
    __publicField(this, "$favoriteImg");
    __publicField(this, "$closeButton");
    __publicField(this, "id");
    __publicField(this, "category");
    __publicField(this, "name");
    __publicField(this, "distance");
    __publicField(this, "description");
    __publicField(this, "link");
    __publicField(this, "isFavorite");
    this.onToggleFavorite = onToggleFavorite;
    this.onDelete = onDelete;
    this.onClose = onClose;
    __privateMethod(this, _RestaurantDetail_instances, initializeDOM_fn2).call(this);
    __privateMethod(this, _RestaurantDetail_instances, initializeEventListeners_fn).call(this);
  }
  render() {
    return this.$form;
  }
  updateAndOpenDetail({
    id,
    category,
    name,
    distance,
    description,
    link,
    isFavorite
  }) {
    this.id = id;
    this.category = category;
    this.name = name;
    this.distance = distance;
    this.description = description;
    this.link = link;
    this.isFavorite = isFavorite;
    __privateMethod(this, _RestaurantDetail_instances, updateContent_fn).call(this);
  }
}
_RestaurantDetail_instances = new WeakSet();
initializeDOM_fn2 = function() {
  this.$form = document.createElement("form");
  const $formContainer = document.createElement("div");
  $formContainer.className = "restaurant-detail__form-container";
  const $detailInfo = document.createElement("div");
  $detailInfo.className = "restaurant-detail__detail-info";
  const $category = document.createElement("div");
  $category.className = "restaurant-detail__category";
  this.$categoryImg = document.createElement("img");
  this.$categoryImg.className = "category-icon";
  const $info = document.createElement("div");
  $info.className = "restaurant-detail__info";
  this.$name = document.createElement("h3");
  this.$name.className = "restaurant-detail__name text-subtitle";
  this.$distance = document.createElement("span");
  this.$distance.className = "restaurant-detail__distance text-body";
  this.$description = document.createElement("p");
  this.$description.className = "restaurant-detail__description text-body";
  this.$link = document.createElement("a");
  this.$link.className = "restaurant-detail__link";
  this.$link.setAttribute("target", "_blank");
  this.$link.setAttribute("rel", "noopener noreferrer");
  this.$favoriteButton = document.createElement("button");
  this.$favoriteButton.className = "favorite-button";
  this.$favoriteButton.setAttribute("aria-label", "자주 가는 음식점 추가");
  this.$favoriteButton.type = "button";
  this.$favoriteImg = document.createElement("img");
  this.$favoriteImg.className = "favorite-icon";
  this.$favoriteImg.setAttribute("alt", "자주 가는 음식점 추가");
  const $buttonContainer = document.createElement("div");
  $buttonContainer.className = "button-container";
  const $deleteButton = new Button({
    type: "submit",
    text: BUTTON_TEXTS.delete,
    action: BUTTON_TYPES.delete
  }).render();
  this.$closeButton = new Button({
    text: BUTTON_TEXTS.close,
    action: BUTTON_TYPES.close
  }).render();
  $category.append(this.$categoryImg);
  $info.append(this.$name, this.$distance, this.$description, this.$link);
  this.$favoriteButton.append(this.$favoriteImg);
  $detailInfo.append($category, $info);
  $formContainer.append($detailInfo, this.$favoriteButton);
  $buttonContainer.append($deleteButton, this.$closeButton);
  this.$form.append($formContainer, $buttonContainer);
};
initializeEventListeners_fn = function() {
  this.$favoriteButton.addEventListener(
    EVENT_TYPES.click,
    () => this.onToggleFavorite(this.id)
  );
  this.$closeButton.addEventListener(
    EVENT_TYPES.click,
    this.onClose.bind(this)
  );
  this.$form.addEventListener(
    EVENT_TYPES.submit,
    __privateMethod(this, _RestaurantDetail_instances, handleSubmit_fn2).bind(this)
  );
};
updateContent_fn = function() {
  this.$categoryImg.setAttribute("src", CATEGORY_ASSETS[this.category]);
  this.$categoryImg.setAttribute("alt", this.category);
  this.$name.textContent = this.name;
  this.$distance.textContent = `캠퍼스부터 ${this.distance}분 내`;
  this.$description.textContent = this.description;
  this.$link.textContent = this.link;
  this.$link.setAttribute("href", this.link);
  this.$favoriteImg.setAttribute(
    "src",
    this.isFavorite ? FAVORITE_ASSETS.filled : FAVORITE_ASSETS.lined
  );
};
handleSubmit_fn2 = function(e) {
  e.preventDefault();
  this.onDelete(this.id);
  this.onClose();
};
class App {
  constructor(store2) {
    __privateAdd(this, _App_instances);
    __publicField(this, "$body");
    __publicField(this, "$main");
    __publicField(this, "$restaurantNavBar");
    __publicField(this, "$restaurantFilter");
    __publicField(this, "$restaurantList");
    __publicField(this, "$submitFormBottomSheet");
    __publicField(this, "$openDetailBottomSheet");
    __publicField(this, "$restaurantDetail");
    this.store = store2;
    this.store = store2;
    this.render();
    this.store.subscribe(
      "restaurantList",
      (state) => this.$restaurantList.updateRestaurantList(state.filteredRestaurants)
    );
    this.store.subscribe("restaurantDetail", (state) => {
      this.$restaurantDetail.updateAndOpenDetail(state.selectedRestaurant);
    });
  }
  render() {
    this.$body = document.querySelector("body");
    __privateMethod(this, _App_instances, renderHeader_fn).call(this);
    __privateMethod(this, _App_instances, renderMain_fn).call(this);
  }
}
_App_instances = new WeakSet();
renderHeader_fn = function() {
  const $header = new Header({
    onOpen: () => this.$submitFormBottomSheet.open()
  });
  this.$body.append($header.render());
};
renderMain_fn = function() {
  this.$main = document.createElement("main");
  this.$body.append(this.$main);
  __privateMethod(this, _App_instances, renderRestaurantNavBar_fn).call(this);
  __privateMethod(this, _App_instances, renderRestaurantFilter_fn).call(this);
  __privateMethod(this, _App_instances, renderRestaurantList_fn).call(this);
  __privateMethod(this, _App_instances, renderSubmitFormBottomSheet_fn).call(this);
  __privateMethod(this, _App_instances, renderOpenDetailBottomSheet_fn).call(this);
};
renderRestaurantNavBar_fn = function() {
  this.$restaurantNavBar = new RestaurantNavBar({
    onTabChange: (tabType) => {
      this.store.setFilter({
        ...this.store.state.currentFilter,
        tabType
      });
      this.$restaurantFilter.toggleFilterVisibility({ tabType });
    }
  });
  this.$main.append(this.$restaurantNavBar.render());
};
renderRestaurantFilter_fn = function() {
  this.$restaurantFilter = new RestaurantFilter({
    onFilterChange: (filterType) => {
      this.store.setFilter({
        ...this.store.state.currentFilter,
        filterType
      });
    }
  });
  this.$main.append(this.$restaurantFilter.render());
};
renderRestaurantList_fn = function() {
  const restaurantList = this.store.getFilteredRestaurants({
    tabType: NAV_BAR_KEYS.all,
    filterType: {
      categoryFilterType: CATEGORY[0],
      sortFilterType: "name"
    }
  });
  this.$restaurantList = new RestaurantList(restaurantList, {
    onToggleFavorite: (restaurantId) => {
      this.store.toggleFavorite(restaurantId);
      this.store.updateSelectedRestaurant(restaurantId);
    },
    onOpenDetail: (restaurantId) => {
      this.store.updateSelectedRestaurant(restaurantId);
      this.$openDetailBottomSheet.open();
    }
  });
  this.$main.append(this.$restaurantList.render());
};
renderSubmitFormBottomSheet_fn = function() {
  const $restaurantForm = new RestaurantForm({
    title: "새로운 음식점",
    onSubmit: (newRestaurantInfo) => {
      this.store.addRestaurant(newRestaurantInfo);
      this.$submitFormBottomSheet.close();
    },
    onCancel: () => this.$submitFormBottomSheet.close()
  });
  this.$submitFormBottomSheet = new BottomSheetBase({
    id: "submit-form",
    $children: $restaurantForm.render()
  });
  this.$main.append(this.$submitFormBottomSheet.render());
};
renderOpenDetailBottomSheet_fn = function() {
  this.$restaurantDetail = new RestaurantDetail({
    onToggleFavorite: (restaurantId) => {
      this.store.toggleFavorite(restaurantId);
      this.store.updateSelectedRestaurant(restaurantId);
    },
    onDelete: (restaurantId) => {
      this.store.deleteRestaurant(restaurantId);
    },
    onClose: () => this.$openDetailBottomSheet.close()
  });
  this.$openDetailBottomSheet = new BottomSheetBase({
    id: "open-detail",
    $children: this.$restaurantDetail.render()
  });
  this.$main.append(this.$openDetailBottomSheet.render());
};
const generateUUID = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === "x" ? r : r & 3 | 8;
    return v.toString(16);
  });
};
class RestaurantStore {
  constructor() {
    __privateAdd(this, _RestaurantStore_instances);
    __privateAdd(this, _restaurants, []);
    __privateAdd(this, _currentFilter, {
      tabType: NAV_BAR_KEYS.all,
      filterType: {
        categoryFilterType: CATEGORY[0],
        sortFilterType: "name"
      }
    });
    __privateAdd(this, _selectedRestaurant, {});
    __privateAdd(this, _listeners, /* @__PURE__ */ new Map());
    __privateMethod(this, _RestaurantStore_instances, loadFromLocalStorage_fn).call(this);
  }
  get state() {
    return {
      restaurants: __privateGet(this, _restaurants),
      filteredRestaurants: this.getFilteredRestaurants(__privateGet(this, _currentFilter)),
      currentFilter: __privateGet(this, _currentFilter),
      selectedRestaurant: __privateGet(this, _selectedRestaurant)
    };
  }
  addRestaurant(restaurant) {
    const newRestaurant = {
      ...restaurant,
      id: generateUUID(),
      isFavorite: false
    };
    __privateSet(this, _restaurants, [...__privateGet(this, _restaurants), newRestaurant]);
    __privateMethod(this, _RestaurantStore_instances, saveToLocalStorage_fn).call(this);
    __privateMethod(this, _RestaurantStore_instances, notifyListeners_fn).call(this);
  }
  deleteRestaurant(restaurantId) {
    __privateSet(this, _restaurants, __privateGet(this, _restaurants).filter(
      (restaurant) => restaurant.id !== restaurantId
    ));
    __privateMethod(this, _RestaurantStore_instances, saveToLocalStorage_fn).call(this);
    __privateMethod(this, _RestaurantStore_instances, notifyListeners_fn).call(this);
  }
  toggleFavorite(restaurantId) {
    __privateSet(this, _restaurants, __privateGet(this, _restaurants).map(
      (restaurant) => restaurant.id === restaurantId ? { ...restaurant, isFavorite: !restaurant.isFavorite } : restaurant
    ));
    __privateMethod(this, _RestaurantStore_instances, saveToLocalStorage_fn).call(this);
    __privateMethod(this, _RestaurantStore_instances, notifyListeners_fn).call(this);
  }
  setFilter(options) {
    __privateSet(this, _currentFilter, options);
    __privateMethod(this, _RestaurantStore_instances, notifyListeners_fn).call(this);
  }
  updateSelectedRestaurant(restaurantId) {
    const restaurantInfoById = __privateGet(this, _restaurants).find(
      (restaurant) => restaurant.id === restaurantId
    );
    if (restaurantInfoById) {
      __privateSet(this, _selectedRestaurant, restaurantInfoById);
    }
    __privateMethod(this, _RestaurantStore_instances, notifyListeners_fn).call(this);
  }
  getFilteredRestaurants({
    tabType,
    filterType: { categoryFilterType, sortFilterType }
  }) {
    const restaurants = [...__privateGet(this, _restaurants)];
    const tabTypeFn = {
      [NAV_BAR_KEYS.all]: (restaurantsInfo) => {
        if (categoryFilterType === CATEGORY[0]) return restaurantsInfo;
        return restaurantsInfo.filter(
          (restaurant) => restaurant.category === categoryFilterType
        );
      },
      [NAV_BAR_KEYS.favorite]: (restaurantsInfo) => {
        return restaurantsInfo.filter((restaurant) => restaurant.isFavorite);
      }
    };
    const sortFilterTypeFn = {
      [LABEL_KEYS.name]: (restaurantsInfo) => {
        return restaurantsInfo.sort((a, b) => a.name.localeCompare(b.name));
      },
      [LABEL_KEYS.distance]: (restaurantsInfo) => {
        return restaurantsInfo.sort(
          (a, b) => parseInt(a.distance) - parseInt(b.distance)
        );
      }
    };
    if (tabType === NAV_BAR_KEYS.favorite) {
      return tabTypeFn[tabType](restaurants);
    }
    return sortFilterTypeFn[sortFilterType](tabTypeFn[tabType](restaurants));
  }
  subscribe(key, callback) {
    __privateGet(this, _listeners).set(key, callback);
    callback(this.state);
    return () => __privateGet(this, _listeners).delete(key);
  }
}
_restaurants = new WeakMap();
_currentFilter = new WeakMap();
_selectedRestaurant = new WeakMap();
_listeners = new WeakMap();
_RestaurantStore_instances = new WeakSet();
loadFromLocalStorage_fn = function() {
  const savedRestaurants = localStorage.getItem("restaurants");
  if (savedRestaurants) {
    __privateSet(this, _restaurants, JSON.parse(savedRestaurants));
    __privateMethod(this, _RestaurantStore_instances, notifyListeners_fn).call(this);
  }
};
saveToLocalStorage_fn = function() {
  localStorage.setItem("restaurants", JSON.stringify(__privateGet(this, _restaurants)));
};
notifyListeners_fn = function() {
  __privateGet(this, _listeners).forEach((listener) => listener(this.state));
};
const store = new RestaurantStore();
new App(store);
