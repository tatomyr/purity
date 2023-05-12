export namespace LZString {
    function compressToBase64(input: any): string;
    function decompressFromBase64(input: any): string;
    function compressToUTF16(input: any): string;
    function decompressFromUTF16(compressed: any): string;
    function compressToUint8Array(uncompressed: any): Uint8Array;
    function decompressFromUint8Array(compressed: any): string;
    function compressToEncodedURIComponent(input: string): string;
    function decompressFromEncodedURIComponent(input: string): string;
    function compress(uncompressed: any): string;
    function _compress(uncompressed: any, bitsPerChar: any, getCharFromInt: any): string;
    function decompress(compressed: any): string;
    function _decompress(length: any, resetValue: any, getNextValue: any): string;
}
