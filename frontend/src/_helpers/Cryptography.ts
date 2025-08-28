/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable max-len */
import {Base64} from "js-base64";
import {HmacMD5, HmacSHA1, HmacSHA256, HmacSHA512, MD5, AES, DES} from "crypto-js";

const base64Encode: any = (text: string): string => {
  return Base64.encode(text);
};

const base64Decode: any = (text: string): string => {
  return Base64.decode(text);
};

export {HmacMD5, HmacSHA1, HmacSHA256, HmacSHA512, MD5, AES, DES, base64Encode, base64Decode };
