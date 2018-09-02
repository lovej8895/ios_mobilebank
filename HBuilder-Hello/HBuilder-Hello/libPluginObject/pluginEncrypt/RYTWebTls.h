//
//  ;
//  MyBrowser
//
//  Created by Rytong on 2017/10/27.
//  Copyright © 2017年 com.bankcomm. All rights reserved.
//

#import <Foundation/Foundation.h>
typedef enum TLSReponseType1 {
    TLSHelloReponse1 = 1,
    TLSKeyExchangeReponse1,
    TLSHelloAndKeyExchangeReponse1,
} TLSReponseType1;
@interface RYTWebTls : NSObject
{
    TLSReponseType1 tlsReponseType_;
    
   
    
    
   
    
    
}
@property (nonatomic, retain) NSData *clientKey_;
@property (nonatomic, retain) NSData *clientIv_;
@property (nonatomic, retain) NSData * serverRandomData;
@property (nonatomic, retain) NSData * serverCertificate;
@property (nonatomic, retain) NSData * firstClientRandomData;
@property (nonatomic, retain) NSData * clientUUIDData;
@property (nonatomic, retain) NSData * secondClientRandomData;
@property (nonatomic, retain) NSData * serverSessionData;
@property (nonatomic,retain) NSString * serverUrls;
@property (nonatomic,retain) NSString * encryptStr;
@property (nonatomic,retain)NSMutableData *analyseData;
@property (nonatomic,retain)NSMutableData *analyseData2;
//@property (nonatomic,retain) NSString * subKeyStr;
+(NSString *)clientUUID;
-(NSData *)clientRandomCopy:(NSData *)random   clientUUID:(NSData *)clientUuid;
+(void)clientAES256Encrypt:(NSData *)mk;

-(NSData *)webEncryprt:(NSString *)serverUrl  serverInterface:(NSString *)serverInterface    encryptData:(NSString *)encryptData;
+(void)teset;

@end
