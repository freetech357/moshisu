import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {

	secretKey: any = "G1Z-QR}Sh+a98!S$vH^MxTXflgUd5F}acY$~o=8$2Cv;#B(nDv";

	constructor() {}

	encryptData(data: any) {
		return CryptoJS.AES.encrypt(JSON.stringify(data), this.secretKey).toString();
	}

    decryptData(encryptedData: any) {
        const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, this.secretKey);
        const data = decryptedBytes.toString(CryptoJS.enc.Utf8);
        if (!data) {
            return null;
        }
        if (this.isJsonString(data)) {
            return JSON.parse(data);
        }
        return data;
    }

    isJsonString(str: any) {
        try {
          JSON.parse(str);
        } catch (e) {
          return false;
        }
        return true;
      }

}
