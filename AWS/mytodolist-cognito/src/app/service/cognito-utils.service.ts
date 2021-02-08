import { Injectable } from '@angular/core';

import * as AWS from 'aws-sdk';
import * as AWSCognito from 'amazon-cognito-identity-js';

import { UserState } from '../model/UserState';
import { environment } from '../../environments/environment';
import { LocalStorageService  } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class CognitoUtilsService {

  private _USER_POOL_ID = environment['USER_POOL_ID'];
  private _USER_POOL_DOMAIN_NAME = environment['USER_POOL_DOMAIN_NAME'];
  private _CLIENT_ID: string = environment['CLIENT_ID'];
  private _IDENTITY_POOL_ID: string = environment['IDENTITY_POOL_ID'];
  private _REGION: string = environment['REGION'];
  private _WEB_REDIRECT_URI = environment['WEB_REDIRECT_URI'];
  private _RESPONSE_TYPE = 'code';

  constructor(private _localStorageService: LocalStorageService) { }

  public getRegion(): string {
    return this._REGION;
  }

  public getIdentityPoolId(): string {
    return this._IDENTITY_POOL_ID;
  }

  public getUserPoolId(): string {
    return this._USER_POOL_ID;
  }


  public getUserPool() {
    // Initialize Cognito User Pool
    let poolData: AWSCognito.ICognitoUserPoolData = {
      UserPoolId: this._USER_POOL_ID,
      ClientId: this._CLIENT_ID
    };
    AWS.config.region = this._REGION;
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: this._IDENTITY_POOL_ID
    });
    //AWS.config.update({accessKeyId: 'dummyvalue', secretAccessKey: 'dummyvalue'});//TODO: borrar si no es requerido.
    return new AWSCognito.CognitoUserPool(poolData);
  }

  public getCognitoIdentityId(): string {
    return (AWS.config.credentials as AWS.CognitoIdentityCredentials).identityId;
  }


  public setUsername(username: string) {
    this._localStorageService.set('userName', username);
  }

  public setUserState(userState: UserState) {
    this._localStorageService.set('userState', JSON.stringify(userState));
  }

  public getCognitoUser() {
    let username = this._localStorageService.get('userName');

    let userData = {
      Username: username,
      Pool: this.getUserPool()
    };
    return new AWSCognito.CognitoUser(userData);
  }

  public getUserId(): string {
    // Retrieve user ID from local storage. Return null if it does not exist
    return this._localStorageService.get('userId');
  }

}
