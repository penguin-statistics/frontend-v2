//
//  PenguinPlugin.m
//  App
//
//  Created by Galvin Gao on 2020/9/28.
//

#import <Capacitor/Capacitor.h>

CAP_PLUGIN(PenguinPlugin, "PenguinPlugin",
  CAP_PLUGIN_METHOD(echo, CAPPluginReturnPromise);
)
