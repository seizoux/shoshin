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

/***/ "./static/ts/data/_func.ts":
/*!*********************************!*\
  !*** ./static/ts/data/_func.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\nfunction maskEmail(email) {\n    var _a = email.split(\"@\"), name = _a[0], domain = _a[1];\n    if (name.length <= 2) {\n        return email; // Too short to mask, return as is\n    }\n    var maskedName = name[0] + \"*\".repeat(name.length - 2) + name[name.length - 1];\n    return maskedName + \"@\" + domain;\n}\nvar emailField = document.getElementById('_sho-mng-email-field');\nif (emailField) {\n    var email = emailField.value;\n    var maskedEmail = maskEmail(email);\n    emailField.value = maskedEmail;\n}\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zdGF0aWMvdHMvZGF0YS9fZnVuYy50cyIsIm1hcHBpbmdzIjoiO0FBRUEsU0FBUyxTQUFTLENBQUMsS0FBYTtJQUN4QixTQUFpQixLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFoQyxJQUFJLFVBQUUsTUFBTSxRQUFvQixDQUFDO0lBQ3hDLElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUUsQ0FBQztRQUNuQixPQUFPLEtBQUssQ0FBQyxDQUFDLGtDQUFrQztJQUNwRCxDQUFDO0lBQ0QsSUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNqRixPQUFPLFVBQVUsR0FBRyxHQUFHLEdBQUcsTUFBTSxDQUFDO0FBQ25DLENBQUM7QUFFRCxJQUFNLFVBQVUsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLHNCQUFzQixDQUFxQixDQUFDO0FBQ3ZGLElBQUksVUFBVSxFQUFFLENBQUM7SUFDYixJQUFNLEtBQUssR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDO0lBQy9CLElBQU0sV0FBVyxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNyQyxVQUFVLENBQUMsS0FBSyxHQUFHLFdBQVcsQ0FBQztBQUNuQyxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc2hvc2hpbi1iZXRhLy4vc3RhdGljL3RzL2RhdGEvX2Z1bmMudHM/NDIwNSJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQge307XG5cbmZ1bmN0aW9uIG1hc2tFbWFpbChlbWFpbDogc3RyaW5nKTogc3RyaW5nIHtcbiAgY29uc3QgW25hbWUsIGRvbWFpbl0gPSBlbWFpbC5zcGxpdChcIkBcIik7XG4gIGlmIChuYW1lLmxlbmd0aCA8PSAyKSB7XG4gICAgICByZXR1cm4gZW1haWw7IC8vIFRvbyBzaG9ydCB0byBtYXNrLCByZXR1cm4gYXMgaXNcbiAgfVxuICBjb25zdCBtYXNrZWROYW1lID0gbmFtZVswXSArIFwiKlwiLnJlcGVhdChuYW1lLmxlbmd0aCAtIDIpICsgbmFtZVtuYW1lLmxlbmd0aCAtIDFdO1xuICByZXR1cm4gbWFza2VkTmFtZSArIFwiQFwiICsgZG9tYWluO1xufVxuXG5jb25zdCBlbWFpbEZpZWxkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ19zaG8tbW5nLWVtYWlsLWZpZWxkJykgYXMgSFRNTElucHV0RWxlbWVudDtcbmlmIChlbWFpbEZpZWxkKSB7XG4gICAgY29uc3QgZW1haWwgPSBlbWFpbEZpZWxkLnZhbHVlO1xuICAgIGNvbnN0IG1hc2tlZEVtYWlsID0gbWFza0VtYWlsKGVtYWlsKTtcbiAgICBlbWFpbEZpZWxkLnZhbHVlID0gbWFza2VkRW1haWw7XG59Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./static/ts/data/_func.ts\n");

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
/******/ 	__webpack_modules__["./static/ts/data/_func.ts"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;