package io.penguinstats.app;

import android.app.Application;
import android.content.Context;

public class PenguinApplication extends Application {

    private static Context context;

    public void onCreate() {
        super.onCreate();
        PenguinApplication.context = getApplicationContext();
    }

    public static Context getAppContext() {
        return PenguinApplication.context;
    }
}
