package io.penguinstats.app;

import com.getcapacitor.JSObject;
import com.getcapacitor.NativePlugin;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;

@NativePlugin()
public class PenguinPlugin extends Plugin {
    public void load() {
        // Called when the plugin is first constructed in the bridge
    }

    @PluginMethod()
    public void isDarkMode(PluginCall call) {
        String value = call.getString("value");

        JSObject ret = new JSObject();
        ret.put("value", value);
        call.success(ret);
    }
}
