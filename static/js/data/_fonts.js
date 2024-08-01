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

/***/ "./static/ts/data/_fonts.ts":
/*!**********************************!*\
  !*** ./static/ts/data/_fonts.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\nvar customSelectButton = document.getElementById('custom-select-button');\nvar customSelectOptions = document.getElementById('custom-select-options');\nif (customSelectButton) {\n    customSelectButton.addEventListener('click', function () {\n        if (customSelectOptions) {\n            customSelectOptions.classList.toggle('hidden');\n        }\n    });\n}\nvar customSelectOptionItems = document.querySelectorAll('#custom-select-options li');\ncustomSelectOptionItems.forEach(function (item) {\n    item.addEventListener('click', function () {\n        if (customSelectButton) {\n            customSelectButton.textContent = item.textContent || '';\n        }\n        if (customSelectOptions) {\n            customSelectOptions.classList.add('hidden');\n        }\n    });\n});\ndocument.addEventListener('click', function (event) {\n    if (customSelectButton && customSelectOptions) {\n        var target = event.target;\n        var isClickInside = customSelectButton.contains(target);\n        var isOptionClickInside = customSelectOptions.contains(target);\n        if (!isClickInside && !isOptionClickInside) {\n            customSelectOptions.classList.add('hidden');\n        }\n    }\n});\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zdGF0aWMvdHMvZGF0YS9fZm9udHMudHMiLCJtYXBwaW5ncyI6IjtBQUVBLElBQU0sa0JBQWtCLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxzQkFBc0IsQ0FBZ0IsQ0FBQztBQUMxRixJQUFNLG1CQUFtQixHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsdUJBQXVCLENBQWdCLENBQUM7QUFFNUYsSUFBSSxrQkFBa0IsRUFBRSxDQUFDO0lBQ3JCLGtCQUFrQixDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRTtRQUN6QyxJQUFJLG1CQUFtQixFQUFFLENBQUM7WUFDdEIsbUJBQW1CLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNuRCxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDO0FBRUQsSUFBTSx1QkFBdUIsR0FBRyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsMkJBQTJCLENBQThCLENBQUM7QUFFcEgsdUJBQXVCLENBQUMsT0FBTyxDQUFDLFVBQVMsSUFBSTtJQUN6QyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFO1FBQzNCLElBQUksa0JBQWtCLEVBQUUsQ0FBQztZQUNyQixrQkFBa0IsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsSUFBSSxFQUFFLENBQUM7UUFDNUQsQ0FBQztRQUNELElBQUksbUJBQW1CLEVBQUUsQ0FBQztZQUN0QixtQkFBbUIsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2hELENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNQLENBQUMsQ0FBQyxDQUFDO0FBRUgsUUFBUSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxVQUFTLEtBQUs7SUFDN0MsSUFBSSxrQkFBa0IsSUFBSSxtQkFBbUIsRUFBRSxDQUFDO1FBQzVDLElBQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFxQixDQUFDO1FBQzNDLElBQU0sYUFBYSxHQUFHLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMxRCxJQUFNLG1CQUFtQixHQUFHLG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUVqRSxJQUFJLENBQUMsYUFBYSxJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztZQUN6QyxtQkFBbUIsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2hELENBQUM7SUFDTCxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zaG9zaGluLWJldGEvLi9zdGF0aWMvdHMvZGF0YS9fZm9udHMudHM/YzA5ZiJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQge307XG5cbmNvbnN0IGN1c3RvbVNlbGVjdEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjdXN0b20tc2VsZWN0LWJ1dHRvbicpIGFzIEhUTUxFbGVtZW50O1xuY29uc3QgY3VzdG9tU2VsZWN0T3B0aW9ucyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjdXN0b20tc2VsZWN0LW9wdGlvbnMnKSBhcyBIVE1MRWxlbWVudDtcblxuaWYgKGN1c3RvbVNlbGVjdEJ1dHRvbikge1xuICAgIGN1c3RvbVNlbGVjdEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoY3VzdG9tU2VsZWN0T3B0aW9ucykge1xuICAgICAgICAgICAgY3VzdG9tU2VsZWN0T3B0aW9ucy5jbGFzc0xpc3QudG9nZ2xlKCdoaWRkZW4nKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG5jb25zdCBjdXN0b21TZWxlY3RPcHRpb25JdGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJyNjdXN0b20tc2VsZWN0LW9wdGlvbnMgbGknKSBhcyBOb2RlTGlzdE9mPEhUTUxMSUVsZW1lbnQ+O1xuXG5jdXN0b21TZWxlY3RPcHRpb25JdGVtcy5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICBpZiAoY3VzdG9tU2VsZWN0QnV0dG9uKSB7XG4gICAgICAgICAgICBjdXN0b21TZWxlY3RCdXR0b24udGV4dENvbnRlbnQgPSBpdGVtLnRleHRDb250ZW50IHx8ICcnO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjdXN0b21TZWxlY3RPcHRpb25zKSB7XG4gICAgICAgICAgICBjdXN0b21TZWxlY3RPcHRpb25zLmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpO1xuICAgICAgICB9XG4gICAgfSk7XG59KTtcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihldmVudCkge1xuICAgIGlmIChjdXN0b21TZWxlY3RCdXR0b24gJiYgY3VzdG9tU2VsZWN0T3B0aW9ucykge1xuICAgICAgICBjb25zdCB0YXJnZXQgPSBldmVudC50YXJnZXQgYXMgSFRNTEVsZW1lbnQ7XG4gICAgICAgIGNvbnN0IGlzQ2xpY2tJbnNpZGUgPSBjdXN0b21TZWxlY3RCdXR0b24uY29udGFpbnModGFyZ2V0KTtcbiAgICAgICAgY29uc3QgaXNPcHRpb25DbGlja0luc2lkZSA9IGN1c3RvbVNlbGVjdE9wdGlvbnMuY29udGFpbnModGFyZ2V0KTtcblxuICAgICAgICBpZiAoIWlzQ2xpY2tJbnNpZGUgJiYgIWlzT3B0aW9uQ2xpY2tJbnNpZGUpIHtcbiAgICAgICAgICAgIGN1c3RvbVNlbGVjdE9wdGlvbnMuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XG4gICAgICAgIH1cbiAgICB9XG59KTsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./static/ts/data/_fonts.ts\n");

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
/******/ 	__webpack_modules__["./static/ts/data/_fonts.ts"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;