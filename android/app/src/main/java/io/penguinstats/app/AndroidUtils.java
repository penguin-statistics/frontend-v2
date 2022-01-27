package io.penguinstats.app;

import android.content.res.Configuration;

public class AndroidUtils {

    public static boolean getSystemDarkModeOn() {
        int mode = PGSApplication.getAppContext().getResources().getConfiguration().uiMode & Configuration.UI_MODE_NIGHT_MASK;
        boolean isDark = mode == Configuration.UI_MODE_NIGHT_YES;
        return isDark;
    }
}
