import { Injectable } from '@angular/core';
import base64url from 'base64url';

@Injectable({
  providedIn: 'root'
})
export class EncodeDecodeBase64UrlService {

  constructor() { }

  // Convert a raw string into a base64url encoded string
  public encodeStringToBase64Url(value: string): string {

    return base64url.encode(value, 'utf8');
  }
  // Convert a base64url encoded string into a raw string
  public decodeBase64UrlToString(value: string): string {
    return base64url.decode(value, 'utf8');
  }
  // Convert a base64 encoded string to a base64url encoded string.
  public convertBase64ToBase64Url(value: string): string {
    return base64url.fromBase64(value);
  }
  // Convert a base64url encoded string to a base64 encoded string.
  public convertase64urlToBase64(value: string): string {
    return base64url.toBase64(value);
  }
  // Convert a base64url encoded string to a Buffer containing the decoded bytes.
  public convertase64urlToBuffer(value: string): Buffer {
    return base64url.toBuffer(value);
  }
}
