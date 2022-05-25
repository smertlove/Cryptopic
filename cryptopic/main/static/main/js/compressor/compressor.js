function saveData(data, filename) {
  if (data) {
    const a = document.createElement('a');
    const file = new Blob([data], {type: 'octet/stream'});
    a.href= URL.createObjectURL(file);
    a.download = filename;
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

function compressData(data, output_name) {
  compressDataFunction = Module.cwrap('compress_data', 'number', ['number', 'number', 'number']);

  var compressedDataPtr = Module._malloc(data.length);
  var compressedDataSize = compressDataFunction(arrayToWasmPtr(data),
      data.length, compressedDataPtr);
  var compressedData = wasmPtrToArray(compressedDataPtr, compressedDataSize);

  const file = new Blob([compressedData], {type: 'octet/stream'});
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

  return decompressedData;
}


function processFile(file, processor, output_name) {
  var fileReader = new FileReader();
  fileReader.onload = function () {
    var rawData = new Uint8Array(fileReader.result);
    saveData(processor(rawData, output_name), encryptionData.file.name);
  };
  fileReader.readAsArrayBuffer(file);
}
