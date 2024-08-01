/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./static/ts/data/_notifications.ts":
/*!******************************************!*\
  !*** ./static/ts/data/_notifications.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\nvar menuButton = document.getElementById('menu-button');\nvar dropdownMenu = document.getElementById('dropdownMenu');\nvar menuItems = dropdownMenu.querySelectorAll('.flex.flex-col.gap-1.px-4.py-2');\nif (menuButton && dropdownMenu) {\n    menuButton.addEventListener('click', function () {\n        dropdownMenu.classList.toggle('hidden');\n    });\n    menuItems.forEach(function (item) {\n        item.addEventListener('click', function (event) {\n            event.preventDefault();\n            var selectedText = item.querySelector('a').textContent || '';\n            menuButton.innerHTML = \"\".concat(selectedText, \" <svg class=\\\"-mr-1 ml-2 h-5 w-5\\\" xmlns=\\\"http://www.w3.org/2000/svg\\\" viewBox=\\\"0 0 20 20\\\" fill=\\\"currentColor\\\" aria-hidden=\\\"true\\\"><path fill-rule=\\\"evenodd\\\" d=\\\"M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z\\\" clip-rule=\\\"evenodd\\\" /></svg>\");\n            dropdownMenu.classList.add('hidden');\n        });\n    });\n    document.addEventListener('click', function (event) {\n        var target = event.target;\n        if (!menuButton.contains(target) && !dropdownMenu.contains(target)) {\n            dropdownMenu.classList.add('hidden');\n        }\n    });\n}\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zdGF0aWMvdHMvZGF0YS9fbm90aWZpY2F0aW9ucy50cyIsIm1hcHBpbmdzIjoiO0FBRUEsSUFBTSxVQUFVLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxhQUFhLENBQWdCLENBQUM7QUFDekUsSUFBTSxZQUFZLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxjQUFjLENBQWdCLENBQUM7QUFDNUUsSUFBTSxTQUFTLEdBQUcsWUFBWSxDQUFDLGdCQUFnQixDQUFDLGdDQUFnQyxDQUE0QixDQUFDO0FBRTdHLElBQUksVUFBVSxJQUFJLFlBQVksRUFBRSxDQUFDO0lBQzdCLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUU7UUFDakMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDNUMsQ0FBQyxDQUFDLENBQUM7SUFFSCxTQUFTLENBQUMsT0FBTyxDQUFDLGNBQUk7UUFDbEIsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxVQUFTLEtBQUs7WUFDekMsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQ3ZCLElBQU0sWUFBWSxHQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFpQixDQUFDLFdBQVcsSUFBSSxFQUFFLENBQUM7WUFDaEYsVUFBVSxDQUFDLFNBQVMsR0FBRyxVQUFHLFlBQVksaVVBQThTLENBQUM7WUFDclYsWUFBWSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDekMsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsVUFBUyxLQUFLO1FBQzdDLElBQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFxQixDQUFDO1FBQzNDLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDO1lBQ2pFLFlBQVksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3pDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNQLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zaG9zaGluLWJldGEvLi9zdGF0aWMvdHMvZGF0YS9fbm90aWZpY2F0aW9ucy50cz84MzVlIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCB7fTtcblxuY29uc3QgbWVudUJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtZW51LWJ1dHRvbicpIGFzIEhUTUxFbGVtZW50O1xuY29uc3QgZHJvcGRvd25NZW51ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Ryb3Bkb3duTWVudScpIGFzIEhUTUxFbGVtZW50O1xuY29uc3QgbWVudUl0ZW1zID0gZHJvcGRvd25NZW51LnF1ZXJ5U2VsZWN0b3JBbGwoJy5mbGV4LmZsZXgtY29sLmdhcC0xLnB4LTQucHktMicpIGFzIE5vZGVMaXN0T2Y8SFRNTEVsZW1lbnQ+O1xuXG5pZiAobWVudUJ1dHRvbiAmJiBkcm9wZG93bk1lbnUpIHtcbiAgICBtZW51QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGRyb3Bkb3duTWVudS5jbGFzc0xpc3QudG9nZ2xlKCdoaWRkZW4nKTtcbiAgICB9KTtcblxuICAgIG1lbnVJdGVtcy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBjb25zdCBzZWxlY3RlZFRleHQgPSAoaXRlbS5xdWVyeVNlbGVjdG9yKCdhJykgYXMgSFRNTEVsZW1lbnQpLnRleHRDb250ZW50IHx8ICcnO1xuICAgICAgICAgICAgbWVudUJ1dHRvbi5pbm5lckhUTUwgPSBgJHtzZWxlY3RlZFRleHR9IDxzdmcgY2xhc3M9XCItbXItMSBtbC0yIGgtNSB3LTVcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgdmlld0JveD1cIjAgMCAyMCAyMFwiIGZpbGw9XCJjdXJyZW50Q29sb3JcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48cGF0aCBmaWxsLXJ1bGU9XCJldmVub2RkXCIgZD1cIk01LjI5MyA3LjI5M2ExIDEgMCAwMTEuNDE0IDBMMTAgMTAuNTg2bDMuMjkzLTMuMjkzYTEgMSAwIDExMS40MTQgMS40MTRsLTQgNGExIDEgMCAwMS0xLjQxNCAwbC00LTRhMSAxIDAgMDEwLTEuNDE0elwiIGNsaXAtcnVsZT1cImV2ZW5vZGRcIiAvPjwvc3ZnPmA7XG4gICAgICAgICAgICBkcm9wZG93bk1lbnUuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICBjb25zdCB0YXJnZXQgPSBldmVudC50YXJnZXQgYXMgSFRNTEVsZW1lbnQ7XG4gICAgICAgIGlmICghbWVudUJ1dHRvbi5jb250YWlucyh0YXJnZXQpICYmICFkcm9wZG93bk1lbnUuY29udGFpbnModGFyZ2V0KSkge1xuICAgICAgICAgICAgZHJvcGRvd25NZW51LmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpO1xuICAgICAgICB9XG4gICAgfSk7XG59Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./static/ts/data/_notifications.ts\n");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval-source-map devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./static/ts/data/_notifications.ts"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;