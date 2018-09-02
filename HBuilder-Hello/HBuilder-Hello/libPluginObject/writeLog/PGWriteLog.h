//
//  PGWriteLog.h
//  HBuilder-Hello
//
//  Created by LiYuan on 16/2/17.
//  Copyright © 2016年 DCloud. All rights reserved.
//

#import "PGCommon.h"

@interface PGWriteLog : PGCommon

- (void)writelog:(PGMethod*)commands;
- (void)getLog:(PGMethod*)commands;
- (void)deleteLog:(PGMethod*)commands;

@end
