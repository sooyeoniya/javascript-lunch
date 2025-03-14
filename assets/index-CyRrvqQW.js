var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _RestaurantForm_instances, handleSubmit_fn, getFormData_fn, resetFormData_fn, _RestaurantFilter_instances, renderFilterCategory_fn, renderFilterSort_fn, _App_instances, renderHeader_fn, renderMain_fn, renderRestaurantNavBar_fn, renderRestaurantFilter_fn, renderRestaurantList_fn, renderBottomSheet_fn, handleFormSubmit_fn, updateRestaurantList_fn, _restaurants, _listeners, _RestaurantStore_instances, loadFromLocalStorage_fn, saveToLocalStorage_fn, notifyListeners_fn;
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
        options: CATEGORY.slice(1, CATEGORY.length)
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
  constructor({ id, name, category, description, distance, link, isFavorite }, onToggleFavorite) {
    this.id = id;
    this.name = name;
    this.category = category;
    this.description = description;
    this.distance = distance;
    this.link = link;
    this.isFavorite = isFavorite;
    this.onToggleFavorite = onToggleFavorite;
  }
  render() {
    const $item = document.createElement("li");
    $item.className = "restaurant";
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
    $favoriteButton.addEventListener(
      EVENT_TYPES.click,
      () => this.onToggleFavorite(this.id)
    );
    return $item;
  }
}
class RestaurantList {
  constructor(restaurantList, restaurantService2) {
    this.restaurantList = restaurantList;
    this.restaurantService = restaurantService2;
    this.$listSection = document.createElement("section");
    this.$listSection.className = "restaurant-list-container";
    this.$list = document.createElement("ul");
    this.$list.className = "restaurant-list";
    this.$listSection.append(this.$list);
  }
  render() {
    this.$list.innerHTML = "";
    this.restaurantList.forEach((restaurantInfo) => {
      const $listItem = new RestaurantListItem(
        restaurantInfo,
        (restaurantId) => {
          this.restaurantService.toggleFavorite(restaurantId);
        }
      );
      this.$list.append($listItem.render());
    });
    return this.$listSection;
  }
  updateRestaurantList(options = {
    tabType: NAV_BAR_KEYS.all,
    filterType: {
      categoryFilterType: CATEGORY[0],
      sortFilterType: Object.keys(SORT_OPTIONS)[0]
    }
  }) {
    this.restaurantList = this.restaurantService.getRestaurants(options);
    this.render();
  }
}
class RestaurantFilter {
  constructor({ onFilterChange }) {
    __privateAdd(this, _RestaurantFilter_instances);
    this.onFilterChange = onFilterChange;
    this.currentFilterType = {
      categoryFilterType: CATEGORY[0],
      sortFilterType: Object.keys(SORT_OPTIONS)[0]
    };
  }
  render() {
    this.$filterContainer = document.createElement("section");
    this.$filterContainer.className = "restaurant-filter-container";
    __privateMethod(this, _RestaurantFilter_instances, renderFilterCategory_fn).call(this);
    __privateMethod(this, _RestaurantFilter_instances, renderFilterSort_fn).call(this);
    return this.$filterContainer;
  }
  getCurrentFilterType() {
    return this.currentFilterType;
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
  $filterSort.id = "sorting-filter";
  $filterSort.setAttribute("name", "sorting-filter");
  this.$filterContainer.append($filterSort);
  Object.keys(SORT_OPTIONS).forEach((optionType) => {
    const $option = document.createElement("option");
    $option.value = optionType;
    $option.textContent = SORT_OPTIONS[optionType];
    $filterSort.append($option);
  });
  $filterSort.addEventListener(EVENT_TYPES.change, (e) => {
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
        this.currentTabType = e.target.value;
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
  getCurrentTabType() {
    return this.currentTabType;
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
  __privateMethod(this, _App_instances, renderRestaurantNavBar_fn).call(this);
  __privateMethod(this, _App_instances, renderRestaurantFilter_fn).call(this);
  __privateMethod(this, _App_instances, renderRestaurantList_fn).call(this);
  __privateMethod(this, _App_instances, renderBottomSheet_fn).call(this);
};
renderRestaurantNavBar_fn = function() {
  this.$restaurantNavBar = new RestaurantNavBar({
    onTabChange: (tabType) => {
      this.$restaurantFilter.toggleFilterVisibility({ tabType });
      this.$restaurantList.updateRestaurantList({
        tabType,
        filterType: this.$restaurantFilter.getCurrentFilterType()
      });
    }
  });
  this.$main.append(this.$restaurantNavBar.render());
};
renderRestaurantFilter_fn = function() {
  this.$restaurantFilter = new RestaurantFilter({
    onFilterChange: (filterType) => {
      this.$restaurantList.updateRestaurantList({
        tabType: this.$restaurantNavBar.getCurrentTabType(),
        filterType
      });
    }
  });
  this.$main.append(this.$restaurantFilter.render());
};
renderRestaurantList_fn = function() {
  const restaurantList = this.restaurantService.getRestaurants();
  this.$restaurantList = new RestaurantList(
    restaurantList,
    this.restaurantService
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
  this.$restaurantList.updateRestaurantList({
    tabType: this.$restaurantNavBar.getCurrentTabType(),
    filterType: this.$restaurantFilter.getCurrentFilterType()
  });
};
class RestaurantService {
  constructor(restaurantStore2) {
    this.restaurantStore = restaurantStore2;
  }
  addRestaurant(restaurantInfo) {
    this.restaurantStore.addRestaurant(restaurantInfo);
  }
  getRestaurants(options = {
    tabType: NAV_BAR_KEYS.all,
    filterType: {
      categoryFilterType: CATEGORY[0],
      sortFilterType: Object.keys(SORT_OPTIONS)[0]
    }
  }) {
    return this.restaurantStore.getRestaurants(options);
  }
  toggleFavorite(restaurantName) {
    this.restaurantStore.toggleFavorite(restaurantName);
  }
}
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
    __privateAdd(this, _listeners, /* @__PURE__ */ new Set());
    __privateMethod(this, _RestaurantStore_instances, loadFromLocalStorage_fn).call(this);
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
  getRestaurants({
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
  toggleFavorite(restaurantId) {
    __privateSet(this, _restaurants, __privateGet(this, _restaurants).map(
      (restaurant) => restaurant.id === restaurantId ? { ...restaurant, isFavorite: !restaurant.isFavorite } : restaurant
    ));
    __privateMethod(this, _RestaurantStore_instances, saveToLocalStorage_fn).call(this);
    __privateMethod(this, _RestaurantStore_instances, notifyListeners_fn).call(this);
  }
  subscribe(listener) {
    __privateGet(this, _listeners).add(listener);
    return () => __privateGet(this, _listeners).delete(listener);
  }
}
_restaurants = new WeakMap();
_listeners = new WeakMap();
_RestaurantStore_instances = new WeakSet();
loadFromLocalStorage_fn = function() {
  const savedRestaurants = localStorage.getItem("restaurants");
  const savedFavorites = localStorage.getItem("favorites");
  __privateSet(this, _restaurants, savedRestaurants ? JSON.parse(savedRestaurants).map((restaurant) => ({
    ...restaurant,
    isFavorite: savedFavorites ? JSON.parse(savedFavorites).includes(restaurant.id) : false
  })) : []);
};
saveToLocalStorage_fn = function() {
  localStorage.setItem("restaurants", JSON.stringify(__privateGet(this, _restaurants)));
  const favorites = __privateGet(this, _restaurants).filter((restaurant) => restaurant.isFavorite).map((restaurant) => restaurant.id);
  localStorage.setItem("favorites", JSON.stringify(favorites));
};
notifyListeners_fn = function() {
  __privateGet(this, _listeners).forEach((listener) => listener(__privateGet(this, _restaurants)));
};
const restaurantStore = new RestaurantStore();
const restaurantService = new RestaurantService(restaurantStore);
new App(restaurantStore, restaurantService);
