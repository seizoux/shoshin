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

/***/ "./static/ts/data/_colors.ts":
/*!***********************************!*\
  !*** ./static/ts/data/_colors.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\ndocument.addEventListener('DOMContentLoaded', function () {\n    // Function to handle color selection and store it in local storage\n    function handleColorSelection(button) {\n        document.querySelectorAll('[data-color]').forEach(function (btn) {\n            btn.classList.remove('outline-none', 'outline-offset-2', 'outline-orange-500');\n            var divElement = btn.querySelector('div');\n            if (divElement) {\n                divElement.classList.add('hidden');\n            }\n        });\n        button.classList.add('outline-none', 'outline-offset-2', 'outline-orange-500');\n        var buttonDivElement = button.querySelector('div');\n        if (buttonDivElement) {\n            buttonDivElement.classList.remove('hidden');\n        }\n        // Store the selected color in local storage\n        var selectedColor = button.getAttribute('data-color');\n        if (selectedColor) {\n            localStorage.setItem('selectedColor', selectedColor);\n        }\n    }\n    // Add event listeners to all buttons with data-color attribute\n    document.querySelectorAll('[data-color]').forEach(function (button) {\n        button.addEventListener('click', function () { return handleColorSelection(button); });\n    });\n    // Function to apply the stored color on page load\n    function applyStoredColor() {\n        var storedColor = localStorage.getItem('selectedColor');\n        if (storedColor) {\n            var button = document.querySelector(\"[data-color=\\\"\".concat(storedColor, \"\\\"]\"));\n            if (button) {\n                button.classList.add('outline-none', 'outline-offset-2', 'outline-orange-500');\n                var buttonDivElement = button.querySelector('div');\n                if (buttonDivElement) {\n                    buttonDivElement.classList.remove('hidden');\n                }\n            }\n        }\n    }\n    // Apply the stored color when the page loads\n    applyStoredColor();\n});\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zdGF0aWMvdHMvZGF0YS9fY29sb3JzLnRzIiwibWFwcGluZ3MiOiI7QUFFQSxRQUFRLENBQUMsZ0JBQWdCLENBQUMsa0JBQWtCLEVBQUU7SUFDMUMsbUVBQW1FO0lBQ25FLFNBQVMsb0JBQW9CLENBQUMsTUFBZTtRQUN6QyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsY0FBYyxDQUFDLENBQUMsT0FBTyxDQUFDLGFBQUc7WUFDakQsR0FBRyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsY0FBYyxFQUFFLGtCQUFrQixFQUFFLG9CQUFvQixDQUFDLENBQUM7WUFDL0UsSUFBTSxVQUFVLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUM1QyxJQUFJLFVBQVUsRUFBRSxDQUFDO2dCQUNiLFVBQVUsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3ZDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUNILE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRSxrQkFBa0IsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO1FBQy9FLElBQU0sZ0JBQWdCLEdBQUcsTUFBTSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNyRCxJQUFJLGdCQUFnQixFQUFFLENBQUM7WUFDbkIsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNoRCxDQUFDO1FBRUQsNENBQTRDO1FBQzVDLElBQU0sYUFBYSxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDeEQsSUFBSSxhQUFhLEVBQUUsQ0FBQztZQUNoQixZQUFZLENBQUMsT0FBTyxDQUFDLGVBQWUsRUFBRSxhQUFhLENBQUMsQ0FBQztRQUN6RCxDQUFDO0lBQ0wsQ0FBQztJQUVELCtEQUErRDtJQUMvRCxRQUFRLENBQUMsZ0JBQWdCLENBQUMsY0FBYyxDQUFDLENBQUMsT0FBTyxDQUFDLGdCQUFNO1FBQ3BELE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsY0FBTSwyQkFBb0IsQ0FBQyxNQUFNLENBQUMsRUFBNUIsQ0FBNEIsQ0FBQyxDQUFDO0lBQ3pFLENBQUMsQ0FBQyxDQUFDO0lBRUgsa0RBQWtEO0lBQ2xELFNBQVMsZ0JBQWdCO1FBQ3JCLElBQU0sV0FBVyxHQUFHLFlBQVksQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDMUQsSUFBSSxXQUFXLEVBQUUsQ0FBQztZQUNkLElBQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsd0JBQWdCLFdBQVcsUUFBSSxDQUFDLENBQUM7WUFDdkUsSUFBSSxNQUFNLEVBQUUsQ0FBQztnQkFDVCxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUUsa0JBQWtCLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztnQkFDL0UsSUFBTSxnQkFBZ0IsR0FBRyxNQUFNLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNyRCxJQUFJLGdCQUFnQixFQUFFLENBQUM7b0JBQ25CLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQ2hELENBQUM7WUFDTCxDQUFDO1FBQ0wsQ0FBQztJQUNMLENBQUM7SUFFRCw2Q0FBNkM7SUFDN0MsZ0JBQWdCLEVBQUUsQ0FBQztBQUN2QixDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL3Nob3NoaW4tYmV0YS8uL3N0YXRpYy90cy9kYXRhL19jb2xvcnMudHM/NDkzZiJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQge307XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbigpIHtcbiAgICAvLyBGdW5jdGlvbiB0byBoYW5kbGUgY29sb3Igc2VsZWN0aW9uIGFuZCBzdG9yZSBpdCBpbiBsb2NhbCBzdG9yYWdlXG4gICAgZnVuY3Rpb24gaGFuZGxlQ29sb3JTZWxlY3Rpb24oYnV0dG9uOiBFbGVtZW50KSB7XG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLWNvbG9yXScpLmZvckVhY2goYnRuID0+IHtcbiAgICAgICAgICAgIGJ0bi5jbGFzc0xpc3QucmVtb3ZlKCdvdXRsaW5lLW5vbmUnLCAnb3V0bGluZS1vZmZzZXQtMicsICdvdXRsaW5lLW9yYW5nZS01MDAnKTtcbiAgICAgICAgICAgIGNvbnN0IGRpdkVsZW1lbnQgPSBidG4ucXVlcnlTZWxlY3RvcignZGl2Jyk7XG4gICAgICAgICAgICBpZiAoZGl2RWxlbWVudCkge1xuICAgICAgICAgICAgICAgIGRpdkVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBidXR0b24uY2xhc3NMaXN0LmFkZCgnb3V0bGluZS1ub25lJywgJ291dGxpbmUtb2Zmc2V0LTInLCAnb3V0bGluZS1vcmFuZ2UtNTAwJyk7XG4gICAgICAgIGNvbnN0IGJ1dHRvbkRpdkVsZW1lbnQgPSBidXR0b24ucXVlcnlTZWxlY3RvcignZGl2Jyk7XG4gICAgICAgIGlmIChidXR0b25EaXZFbGVtZW50KSB7XG4gICAgICAgICAgICBidXR0b25EaXZFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gU3RvcmUgdGhlIHNlbGVjdGVkIGNvbG9yIGluIGxvY2FsIHN0b3JhZ2VcbiAgICAgICAgY29uc3Qgc2VsZWN0ZWRDb2xvciA9IGJ1dHRvbi5nZXRBdHRyaWJ1dGUoJ2RhdGEtY29sb3InKTtcbiAgICAgICAgaWYgKHNlbGVjdGVkQ29sb3IpIHtcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdzZWxlY3RlZENvbG9yJywgc2VsZWN0ZWRDb2xvcik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBBZGQgZXZlbnQgbGlzdGVuZXJzIHRvIGFsbCBidXR0b25zIHdpdGggZGF0YS1jb2xvciBhdHRyaWJ1dGVcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1jb2xvcl0nKS5mb3JFYWNoKGJ1dHRvbiA9PiB7XG4gICAgICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IGhhbmRsZUNvbG9yU2VsZWN0aW9uKGJ1dHRvbikpO1xuICAgIH0pO1xuXG4gICAgLy8gRnVuY3Rpb24gdG8gYXBwbHkgdGhlIHN0b3JlZCBjb2xvciBvbiBwYWdlIGxvYWRcbiAgICBmdW5jdGlvbiBhcHBseVN0b3JlZENvbG9yKCkge1xuICAgICAgICBjb25zdCBzdG9yZWRDb2xvciA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdzZWxlY3RlZENvbG9yJyk7XG4gICAgICAgIGlmIChzdG9yZWRDb2xvcikge1xuICAgICAgICAgICAgY29uc3QgYnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgW2RhdGEtY29sb3I9XCIke3N0b3JlZENvbG9yfVwiXWApO1xuICAgICAgICAgICAgaWYgKGJ1dHRvbikge1xuICAgICAgICAgICAgICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdvdXRsaW5lLW5vbmUnLCAnb3V0bGluZS1vZmZzZXQtMicsICdvdXRsaW5lLW9yYW5nZS01MDAnKTtcbiAgICAgICAgICAgICAgICBjb25zdCBidXR0b25EaXZFbGVtZW50ID0gYnV0dG9uLnF1ZXJ5U2VsZWN0b3IoJ2RpdicpO1xuICAgICAgICAgICAgICAgIGlmIChidXR0b25EaXZFbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGJ1dHRvbkRpdkVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gQXBwbHkgdGhlIHN0b3JlZCBjb2xvciB3aGVuIHRoZSBwYWdlIGxvYWRzXG4gICAgYXBwbHlTdG9yZWRDb2xvcigpO1xufSk7Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./static/ts/data/_colors.ts\n");

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
/******/ 	__webpack_modules__["./static/ts/data/_colors.ts"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;