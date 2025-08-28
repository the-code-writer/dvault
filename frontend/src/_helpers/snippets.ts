/* eslint-disable */
import { ethers } from "ethers";
import * as k from "./constants";
import * as ArrayUtils from "./";
import { CustomEventBus } from "./eventBus";
import * as cryptography from "./Cryptography";
export const snippets = {
  constants: k,
  sleep: (seconds: number) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(seconds), seconds * 1000);
    });
  },
  createArray: (offset: number, length: number) => {
    return Array.from({ length: length }, (_, i) => i + offset);
  },
  cryptography: cryptography,
  ethers: {
    // v5: {
    //     ethersToWei: (etherValue: any) => {
    //         return ethers.utils.parseUnits(etherValue, 18)
    //     },
    //     weiToEthers: (weiValue: any) => {
    //         return ethers.utils.formatEther(weiValue);
    //     },
    //     fromBytes32ToString: (bytes32Value: any) => {
    //         return ethers.utils.parseBytes32String(bytes32Value);
    //     },
    //     fromStringToBytes32: (stringValue: string) => {
    //         return ethers.utils.formatBytes32String(stringValue);
    //     },
    // },
    v6: {
      ethersToWei: (value: any) => {
        return ethers.parseEther(value.toString());
      },
      weiToEthers: (value: any) => {
        return parseFloat(String(parseInt(value) / 20)).toFixed(3); //ethers.formatEther(value);
      },
      fromBytes32ToString: (_bytes32: any) => {
        return ethers.decodeBytes32String(_bytes32);
      },
      fromStringToBytes32: (_string: string) => {
        return ethers.encodeBytes32String(_string);
      },
    },
  },

  formatAddress: (_address: string | undefined, isLong: boolean = false) => {
    if (_address) {
      return `${_address.slice(0, isLong ? 10 : 6)} ... ${_address.slice(_address.length - (isLong ? 10 : 5))}`;
    } else {
      console.warn("ADDRESS WARNING", _address);
      return _address;
    }
  },

  location: {
    getLocationHostURL: () => {
      return k.PROTOCOL + (window as any).location.host;
    },
  },

  strings: {
    validateEmail: (email: string): boolean => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },

    shortenAddress: (address: string): string => {
      if (address.length <= 8) {
        return address;
      }

      const start = address.slice(0, 6);
      const end = address.slice(-5);

      return `${start}...${end}`;
    },
    toSlug: (str:any)=>{

      return str.toString()               // Convert to string
          .normalize('NFD')               // Change diacritics
          .replace(/[\u0300-\u036f]/g,'') // Remove illegal characters
          .replace(/\s+/g,'-')            // Change whitespace to dashes
          .toLowerCase()                  // Change to lowercase
          .replace(/&/g,'-and-')          // Replace ampersand
          .replace(/[^a-z0-9\-]/g,'')     // Remove anything that is not a letter, number or dash
          .replace(/-+/g,'-')             // Remove duplicate dashes
          .replace(/^-*/,'')              // Remove starting dashes
          .replace(/-*$/,'');             // Remove trailing dashes

  },
  toTitleCase: (str:string)=>{

      const words = str.split("_");
      const capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
      const result = capitalizedWords.join(" ");

      return result;

  }
  },

  token: {
    getAmount: (token: any): string => {
      return `${token.amount} ${token.symbol}`;
    },
  },

  events: CustomEventBus,

  arrays: ArrayUtils,
};
