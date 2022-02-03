package io.penguinstats.app;

import android.content.pm.ActivityInfo;
import android.content.res.Configuration;
import android.os.Bundle;

import androidx.annotation.NonNull;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;

import java.util.ArrayList;

public class MainActivity extends BridgeActivity {

  protected Configuration mPrevConfig;

  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    // Initializes the Bridge
    this.init(savedInstanceState, new ArrayList<Class<? extends Plugin>>() {{
      // Additional plugins you've installed go here
      // Ex: add(TotallyAwesomePlugin.class);
      add(PenguinPlugin.class);
    }});

    mPrevConfig = new Configuration(getResources().getConfiguration());
  }

  @Override
  public void onConfigurationChanged(@NonNull Configuration newConfig) {
    super.onConfigurationChanged(newConfig);
    if (isNightConfigChanged(newConfig)) {

    }
    mPrevConfig = newConfig;
  }

  protected boolean isNightConfigChanged(Configuration newConfig) {
    return (newConfig.diff(mPrevConfig) & ActivityInfo.CONFIG_UI_MODE) != 0 && isDarkMode(newConfig) != isDarkMode(mPrevConfig);
  }

  public static boolean isDarkMode(Configuration configuration) {
    return (configuration.uiMode & Configuration.UI_MODE_NIGHT_MASK) == Configuration.UI_MODE_NIGHT_YES;
  }
}
