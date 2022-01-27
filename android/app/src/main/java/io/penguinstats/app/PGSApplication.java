package io.penguinstats.app;

import android.app.Application;
import android.content.Context;

public class PGSApplication extends Application {

    private static Context context;

    public void onCreate() {
        super.onCreate();
        PGSApplication.context = getApplicationContext();
    }

    public static Context getAppContext() {
        return PGSApplication.context;
    }
}
