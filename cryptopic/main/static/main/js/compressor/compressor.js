function saveData(data, typeFile) {
  if (data) {
    const a = document.createElement('a');
    const file = new Blob([data], {type: typeFile});
    console.log(file);
    a.href= URL.createObjectURL(file);
    a.download = `file.${typeFile.split("/")[1]}`;
    a.click();
    URL.revokeObjectURL(a.href);
  }
}

function arrayToWasmPtr(array) {
  var ptr = Module._malloc(array.length);
  Module.HEAP8.set(array, ptr);
  return ptr;
}

function wasmPtrToArray(ptr, length) {
  var array = new Int8Array(length);
  array.set(Module.HEAP8.subarray(ptr, ptr + length));
  return array;
}

function compressData(data, fileType) {
  compressDataFunction = Module.cwrap('compress_data', 'number', ['number', 'number', 'number']);

  var compressedDataPtr = Module._malloc(data.length);
  var compressedDataSize = compressDataFunction(arrayToWasmPtr(data),
      data.length, compressedDataPtr);
  var compressedData = wasmPtrToArray(compressedDataPtr, compressedDataSize);

  const file = new Blob([compressedData], {type: "file/" + fileType});
  let reader = new FileReader();
  reader.readAsDataURL(file); // конвертирует Blob в base64 и вызывает onload

  reader.onload = function() {
    encryptionData.addFileData(reader.result)
  };

  compressedData;
}

function decompressData(data) {
  decompressDataFunction = Module.cwrap('decompress_data', 'number', ['number', 'number', 'number', 'number']);

  var decompressedDataPtr = Module._malloc(data.length * 3);
  var decompressedDataSize = decompressDataFunction(arrayToWasmPtr(data),
      data.length, decompressedDataPtr, data.length * 3);
  var decompressedData = wasmPtrToArray(decompressedDataPtr, decompressedDataSize);
  console.log(decompressedData);
  return decompressedData;
}

function processFile(file, processor, typeFile) {
  var fileReader = new FileReader();
  fileReader.onload = function () {
    var rawData = new Uint8Array(fileReader.result);
    saveData(processor(rawData, file.name.split(".").reverse()[0]), typeFile);
  };
  fileReader.readAsArrayBuffer(file);
}
