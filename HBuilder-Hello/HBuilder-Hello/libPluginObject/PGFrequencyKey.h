//
//  PGFrequencyKey.h
//  HBuilder-Hello
//
//  Created by LiYuan on 2017/3/22.
//  Copyright © 2017年 DCloud. All rights reserved.
//

#import "PGCommon.h"

@interface PGFrequencyKey : PGCommon
    
-(void)reverseFrequencyKey:(PGMethod *)commonds;
    
-(void)getsnFrequencyKey:(PGMethod *)commonds;
    
-(void)enumCertFrequencyKey:(PGMethod *)commonds;
    
-(void)getCertFrequencyKey:(PGMethod *)commonds;
    
-(void)changePinFrequencyKey:(PGMethod *)commonds;
    
-(void)certSignFrequencyKey:(PGMethod *)commonds;

-(void)destroyFrequencyKey:(PGMethod *)commonds;

-(void)isDefaultFrequencyKey:(PGMethod *)commonds;

-(void)remainCountFrequencyKey:(PGMethod *)commonds;

@end
