package io.penguinstats.app;

import android.net.Uri;
import android.os.Bundle;

import com.getcapacitor.Plugin;

import java.util.ArrayList;

public class SearchMetaActivity extends MainActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        if (this.getBridge() == null) {
            super.onCreate(savedInstanceState);

            // Initializes the Bridge
            this.init(savedInstanceState, new ArrayList<Class<? extends Plugin>>() {{
                // Additional plugins you've installed go here
                // Ex: add(TotallyAwesomePlugin.class);
            }});
        }

        Uri uri = Uri.parse("https://penguin-stats.io/search");

        this.getBridge().logToJs("onCreate: uri parsed as " + uri);

        this.getBridge().launchIntent(uri);
    }
}
