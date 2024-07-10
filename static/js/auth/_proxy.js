const part1 = [104, 116, 116, 112, 115, 58, 47, 47, 98, 101];
const part2 = [116, 97, 46, 115, 104, 111, 115, 104, 105, 110];
const part3 = [46, 109, 111, 101, 47, 99, 97, 112, 116, 99];
const part4 = [104, 97, 47, 103, 111, 111, 103, 108, 101, 47];
const part5 = [114, 101, 99, 97, 112, 116, 99, 104, 97, 47, 118, 101, 114, 105, 102, 121];
const asciiCodes = part1.concat(part2, part3, part4, part5);

const _La_part1 = [104, 116, 116, 112, 115, 58, 47, 47, 98, 101];
const _La_part2 = [116, 97, 46, 115, 104, 111, 115, 104, 105, 110];
const _La_part3 = [46, 109, 111, 101, 47, 97, 117, 116, 104, 47, 118, 101];
const _La_part4 = [114, 105, 102, 121];
const _La_asciiCodes = _La_part1.concat(_La_part2, _La_part3, _La_part4);

const _pvc_part1 = [104, 116, 116, 112, 115, 58, 47, 47];
const _pvc_part2 = [98, 101, 116, 97, 46, 115, 104, 111, 115, 104, 105, 110, 46, 109, 111, 101];
const _pvc_part3 = [47, 97, 117, 116, 104, 47, 118, 101, 114, 105, 102, 121, 47, 99, 111, 100, 101];

const _pvc_asciiCodes = _pvc_part1.concat(_pvc_part2, _pvc_part3);

export const _px = asciiCodes.map(code => String.fromCharCode(code)).join('');
export const _pl = _La_asciiCodes.map(code => String.fromCharCode(code)).join('');
export const _pvc = _pvc_asciiCodes.map(code => String.fromCharCode(code)).join('');